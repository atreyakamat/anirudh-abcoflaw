import { Controller, Post, Body, Param, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service.js';
import { Public } from '../../common/decorators/public.decorator.js';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Public()
  @Post('appointment/:event')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Appointment webhook endpoint' })
  handleAppointmentEvent(@Param('event') event: string, @Body() body: any) {
    return this.webhooksService.handleAppointmentEvent(event, body);
  }

  @Public()
  @Post('waha/:event')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'WAHA webhook endpoint' })
  handleWahaEvent(@Param('event') event: string, @Body() body: any) {
    return this.webhooksService.handleWahaEvent(event, body);
  }

  @Public()
  @Post('n8n/:event')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'n8n webhook endpoint' })
  handleN8nEvent(@Param('event') event: string, @Body() body: any) {
    return this.webhooksService.handleN8nEvent(event, body);
  }
}