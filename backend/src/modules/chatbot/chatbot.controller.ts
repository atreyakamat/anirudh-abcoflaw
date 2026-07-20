import { Controller, Get, Post, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatbotService, ChatbotQueryResult } from './chatbot.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard, Roles } from '../../common/guards/roles.guard.js';
import { UserRole } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator.js';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Public()
  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create chatbot session' })
  createSession(@Body() body: { email?: string; source?: string }) {
    return this.chatbotService.createSession(body.email, body.source);
  }

  @Public()
  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get chatbot session' })
  getSession(@Param('id') id: string) {
    return this.chatbotService.getSession(id);
  }

  @Public()
  @Post('sessions/:id/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send message and get chatbot response' })
  async sendMessage(
    @Param('id') sessionId: string,
    @Body() body: { content: string; isFromBot?: boolean },
  ): Promise<ChatbotQueryResult> {
    // Record user message
    await this.chatbotService.addMessage(sessionId, body.content, false);

    // Process message and get response
    const result = await this.chatbotService.processMessage(sessionId, body.content);

    // Record bot response
    await this.chatbotService.addMessage(
      sessionId,
      result.response,
      true,
      result.intent.name,
      result.intent.confidence,
    );

    return result;
  }

  @Public()
  @Post('sessions/:id/lead')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit lead from chatbot' })
  async submitLead(
    @Param('id') sessionId: string,
    @Body() body: { name?: string; email?: string; phone?: string; message?: string },
  ) {
    await this.chatbotService.qualifyAndSaveLead(sessionId, body);
    return { success: true, message: 'Lead submitted successfully' };
  }

  @Public()
  @Get('sessions/:id/messages')
  @ApiOperation({ summary: 'Get chatbot messages' })
  getMessages(@Param('id') sessionId: string) {
    return this.chatbotService.getMessages(sessionId);
  }

  @Public()
  @Post('sessions/:id/end')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End chatbot session' })
  endSession(@Param('id') id: string) {
    return this.chatbotService.endSession(id);
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get chatbot analytics' })
  getAnalytics() {
    return this.chatbotService.getSessionAnalytics();
  }
}