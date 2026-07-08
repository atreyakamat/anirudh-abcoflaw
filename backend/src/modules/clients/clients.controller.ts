import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientsService } from './clients.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard, Roles } from '../../common/guards/roles.guard.js';
import { UserRole } from '@prisma/client';
import { PaginationDto, SortableDto, FilterableDto } from '../../common/dto/pagination.dto.js';

@ApiTags('Clients')
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get all clients' })
  findAll(@Query() query: PaginationDto & SortableDto & FilterableDto) {
    return this.clientsService.findAll(query);
  }

  @Get('timeline/:id')
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get client timeline' })
  getTimeline(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.clientsService.getTimeline(id, limit);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get client by ID' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Create new client' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Update client' })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete client' })
  delete(@Param('id') id: string) {
    return this.clientsService.softDelete(id);
  }
}