import { Injectable, Logger } from '@nestjs/common';
import { ChatbotSession, ChatbotMessage, Faq } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';

export interface ChatbotIntent {
  name: string;
  confidence: number;
  response?: string;
  action?: 'BOOK_APPOINTMENT' | 'SHOW_FAQS' | 'SHOW_SERVICES' | 'SHOW_CONTACT' | 'TRANSFER_HUMAN' | 'QUALIFY_LEAD';
}

export interface ChatbotQueryResult {
  response: string;
  intent: ChatbotIntent;
  relatedFaqs?: Faq[];
  shouldCollectContact?: boolean;
  bookingData?: {
    preferredDate?: string;
    preferredTime?: string;
    practiceArea?: string;
  };
}

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  private readonly intentPatterns: Array<{
    intent: string;
    keywords: string[];
    confidence: number;
  }> = [
    { intent: 'BOOK', keywords: ['book', 'appointment', 'schedule', 'consultation', 'meet', 'schedule'], confidence: 0.9 },
    { intent: 'FEES', keywords: ['fee', 'fees', 'cost', 'price', 'charges', 'payment', 'pay'], confidence: 0.85 },
    { intent: 'HOURS', keywords: ['hours', 'open', 'close', 'timing', 'available', 'time'], confidence: 0.8 },
    { intent: 'PHONE', keywords: ['phone', 'call', 'telephone', 'mobile', 'contact'], confidence: 0.85 },
    { intent: 'AREAS', keywords: ['practice', 'areas', 'specialize', 'services', 'types', 'law'], confidence: 0.8 },
    { intent: 'LOCATION', keywords: ['location', 'address', 'where', 'office', 'city', 'goa'], confidence: 0.85 },
    { intent: 'CANCEL', keywords: ['cancel', 'reschedule', 'change', 'postpone'], confidence: 0.8 },
    { intent: 'DOCUMENT', keywords: ['document', 'upload', 'file', 'paper', 'evidence'], confidence: 0.75 },
    { intent: 'DURATION', keywords: ['long', 'duration', 'time', 'minutes', 'hours'], confidence: 0.7 },
    { intent: 'PREPARE', keywords: ['prepare', 'bring', 'required', 'need', 'documents'], confidence: 0.75 },
  ];

  private readonly fallbackResponses = [
    "I can help with questions about booking consultations, our practice areas, fees, office hours, and more. What would you like to know?",
    "I'm here to assist with general legal inquiries. You can ask about appointment scheduling, consultation fees, or our areas of practice.",
    "For specific legal advice, I recommend booking a consultation. Is there a general question I can help answer in the meantime?",
  ];

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async createSession(email?: string, source?: string): Promise<ChatbotSession> {
    return this.prisma.chatbotSession.create({
      data: {
        email,
        source: source || 'website',
        isActive: true,
        metadata: { startedAt: new Date().toISOString() },
      },
    });
  }

  async getSession(id: string): Promise<ChatbotSession | null> {
    return this.prisma.chatbotSession.findUnique({ where: { id } });
  }

  async endSession(id: string): Promise<void> {
    await this.prisma.chatbotSession.update({
      where: { id },
      data: { isActive: false, endedAt: new Date() },
    });
  }

  async addMessage(
    sessionId: string,
    content: string,
    isFromBot: boolean,
    intent?: string,
    confidence?: number,
  ): Promise<ChatbotMessage> {
    return this.prisma.chatbotMessage.create({
      data: {
        sessionId,
        content,
        isFromBot,
        intent,
        confidence: confidence ? Number(confidence) : null,
      },
    });
  }

  async getMessages(sessionId: string): Promise<ChatbotMessage[]> {
    return this.prisma.chatbotMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async processMessage(sessionId: string, userMessage: string): Promise<ChatbotQueryResult> {
    const session = await this.getSession(sessionId);
    const normalizedMessage = userMessage.toLowerCase().trim();

    // 1. Detect intent
    const intent = this.detectIntent(normalizedMessage);

    // 2. Handle booking intent - check if ready to collect contact info
    if (intent.name === 'BOOK') {
      const shouldCollect = this.shouldCollectContactInfo(session);
      if (!shouldCollect) {
        return {
          response: "I'd be happy to help you book a consultation. Could you provide your name and email address so I can proceed with the booking?",
          intent: { name: 'QUALIFY_LEAD', confidence: 0.9, action: 'QUALIFY_LEAD' },
          shouldCollectContact: true,
        };
      }
    }

    // 3. Search FAQs
    const relatedFaqs = await this.searchFaqs(normalizedMessage);

    if (relatedFaqs.length > 0) {
      const faq = relatedFaqs[0];
      return {
        response: faq.answer,
        intent: { name: intent.name, confidence: intent.confidence, response: faq.answer },
        relatedFaqs: relatedFaqs.slice(0, 3),
      };
    }

    // 4. Generate contextual response based on intent
    const response = this.generateIntentResponse(intent, session);
    return {
      response,
      intent: { name: intent.name, confidence: intent.confidence },
      shouldCollectContact: intent.name === 'BOOK' && !session?.email,
    };
  }

  private detectIntent(message: string): { name: string; confidence: number } {
    let bestMatch = { name: 'UNKNOWN', confidence: 0 };

    for (const pattern of this.intentPatterns) {
      for (const keyword of pattern.keywords) {
        if (message.includes(keyword)) {
          if (pattern.confidence > bestMatch.confidence) {
            bestMatch = { name: pattern.intent, confidence: pattern.confidence };
          }
          break;
        }
      }
    }

    // Check for greeting patterns
    if (/^(hi|hello|hey|good morning|good afternoon|good evening)/i.test(message)) {
      return { name: 'GREETING', confidence: 0.95 };
    }

    // Check for thanks/closing
    if (/^(thanks|thank you|bye|goodbye|that's all)/i.test(message)) {
      return { name: 'CLOSE', confidence: 0.9 };
    }

    return bestMatch;
  }

  private generateIntentResponse(intent: { name: string; confidence: number }, session?: ChatbotSession | null): string {
    if (intent.confidence < 0.3) {
      return this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)];
    }

    const responses: Record<string, string> = {
      GREETING: "Hello! Welcome to AB & Co. Legal. I'm here to help you with scheduling consultations, answering general legal questions, and guiding you to the right services. How can I assist you today?",
      BOOK: "To book a consultation, please use our booking form at /book. You can select your preferred date, time, and practice area. Alternatively, I can collect your details and create a booking request for you.",
      FEES: "Consultation fees vary based on the type of legal service required. For a detailed fee estimate, please book a consultation where our team can provide accurate pricing based on your specific needs. We accept Cash, GPay, and Bank Transfers.",
      HOURS: "Our office is open Monday to Saturday, 9:00 AM to 6:00 PM. We are closed on Sundays and public holidays. For urgent matters, please call our office directly.",
      PHONE: "You can reach us at +91-9876543210 or email contact@lawpractice.com. For immediate assistance, calling during office hours is recommended.",
      AREAS: "We specialize in Corporate Law, Family Law, Property Law, Employment Law, Criminal Law, and Civil Litigation. What type of legal matter can we assist you with?",
      LOCATION: "Our office is located at Porvorim, Goa. For specific directions or to schedule an in-person consultation, please contact us.",
      CANCEL: "To cancel or reschedule an appointment, please login to the client portal or contact our office at least 24 hours in advance. You can reach us at +91-9876543210.",
      DOCUMENT: "When preparing for your consultation, you may bring relevant documents such as identification, contracts, property papers, or any other documents related to your legal matter. We'll confirm what specific documents are needed when you book.",
      DURATION: "Initial consultations typically last 30 minutes. Complex matters may require longer sessions. We'll provide an estimated duration when you book your appointment.",
      PREPARE: "For your consultation, please bring: 1) Valid identification, 2) Any relevant documents related to your case, 3) A brief summary of your legal matter, 4) Questions you'd like answered. This helps us make the most of our time together.",
      CLOSE: "Thank you for reaching out to AB & Co. Legal. If you have any more questions, feel free to chat with us again. Have a great day!",
      UNKNOWN: this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)],
    };

    return responses[intent.name] || responses.UNKNOWN;
  }

  private async searchFaqs(query: string): Promise<Faq[]> {
    // Get all visible FAQs
    const faqs = await this.prisma.faq.findMany({
      where: { isVisible: true },
      include: { category: true },
    });

    // Simple keyword matching
    const queryWords = query.split(/\s+/).filter(w => w.length > 2);
    const scored = faqs.map(faq => {
      let score = 0;
      const questionLower = faq.question.toLowerCase();
      const answerLower = faq.answer.toLowerCase();

      for (const word of queryWords) {
        if (questionLower.includes(word)) score += 3;
        if (answerLower.includes(word)) score += 1;
      }

      return { faq, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.faq);
  }

  private shouldCollectContactInfo(session?: ChatbotSession | null): boolean {
    return !!session?.email;
  }

  async qualifyAndSaveLead(sessionId: string, leadData: { name?: string; email?: string; phone?: string; message?: string }): Promise<void> {
    await this.prisma.chatbotSession.update({
      where: { id: sessionId },
      data: {
        email: leadData.email,
        metadata: {
          ...(await this.getSession(sessionId))?.metadata as object || {},
          leadData,
          qualifiedAt: new Date().toISOString(),
        },
      },
    });

    // Create notification for receptionist
    if (leadData.email || leadData.phone) {
      await this.notificationsService.create({
        type: 'SYSTEM',
        title: 'New Chatbot Lead',
        message: `New lead from chatbot: ${leadData.name || 'Unknown'} (${leadData.email || leadData.phone})`,
        data: { sessionId, leadData },
      });
    }
  }

  async getSessionAnalytics(): Promise<{ totalSessions: number; activeSessions: number; leadsGenerated: number }> {
    const [totalSessions, activeSessions, leadsGenerated] = await Promise.all([
      this.prisma.chatbotSession.count(),
      this.prisma.chatbotSession.count({ where: { isActive: true } }),
      this.prisma.chatbotSession.count({ where: { email: { not: null } } }),
    ]);

    return { totalSessions, activeSessions, leadsGenerated };
  }
}