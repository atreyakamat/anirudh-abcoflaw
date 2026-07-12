import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
}

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string | string[];
    let error: string;

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = `A record with this ${(exception.meta?.target as string[])?.join(', ')} already exists`;
        error = 'DuplicateRecord';
        break;

      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        error = 'NotFound';
        break;

      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Foreign key constraint failed';
        error = 'InvalidReference';
        break;

      case 'P2011':
        status = HttpStatus.BAD_REQUEST;
        message = 'Required field is missing';
        error = 'ValidationError';
        break;

      case 'P2014':
        status = HttpStatus.BAD_REQUEST;
        message = 'Change violates a relation constraint';
        error = 'RelationViolation';
        break;

      default:
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
        error = 'DatabaseError';
    }

    this.logger.error(`Prisma error [${exception.code}]: ${message}`, exception.stack);

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}