import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PaginationDto, PaginatedResultDto, SortableDto, FilterableDto } from '../../common/dto/pagination.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    pagination: PaginationDto & SortableDto & FilterableDto,
  ): Promise<PaginatedResultDto<User>> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC', search } = pagination;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return new PaginatedResultDto(items, total, page, limit);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      email: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      isActive: boolean;
    }>,
  ): Promise<User> {
    await this.findOne(id); // Verify exists

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}