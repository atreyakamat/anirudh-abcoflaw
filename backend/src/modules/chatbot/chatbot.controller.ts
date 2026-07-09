import { Controller, Get, Post, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
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
  @ApiOperation({ summary: 'Add message to chatbot session' })
  addMessage(@Param('id') sessionId: string, @Body() body: { content: string; isFromBot: boolean; intent?: string }) {
    return this.chatbotService.addMessage(sessionId, body.content, body.isFromBot, body.intent);
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
}