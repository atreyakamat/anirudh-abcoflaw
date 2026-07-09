import { Injectable } from '@nestjs/common';
import { ChatbotSession, ChatbotMessage } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ChatbotService {
  constructor(private prisma: PrismaService) {}

  async createSession(email?: string, source?: string): Promise<ChatbotSession> {
    return this.prisma.chatbotSession.create({ data: { email, source } });
  }

  async getSession(id: string): Promise<ChatbotSession | null> {
    return this.prisma.chatbotSession.findUnique({ where: { id } });
  }

  async endSession(id: string): Promise<void> {
    await this.prisma.chatbotSession.update({ where: { id }, data: { isActive: false, endedAt: new Date() } });
  }

  async addMessage(sessionId: string, content: string, isFromBot: boolean, intent?: string, confidence?: number): Promise<ChatbotMessage> {
    return this.prisma.chatbotMessage.create({ data: { sessionId, content, isFromBot, intent, confidence } });
  }

  async getMessages(sessionId: string): Promise<ChatbotMessage[]> {
    return this.prisma.chatbotMessage.findMany({ where: { sessionId }, orderBy: { createdAt: 'asc' } });
  }
}