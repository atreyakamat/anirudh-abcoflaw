import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;
  let configService: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      refreshToken: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        create: jest.fn().mockResolvedValue({ id: 'rt-1' }),
        findFirst: jest.fn(),
      },
      $transaction: jest.fn((promises) => Promise.all(promises)),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock_jwt_token'),
      signAsync: jest.fn().mockResolvedValue('mock_jwt_token'),
    };

    configService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        if (key === 'ADMIN_USERNAME') return 'admin';
        if (key === 'ADMIN_PASSWORD') return 'admin123';
        if (key === 'JWT_SECRET') return 'test-secret';
        if (key === 'JWT_EXPIRATION') return '15m';
        if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
        if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
        return defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateAdmin', () => {
    it('should return admin user when correct credentials provided', async () => {
      const mockAdmin = {
        id: 'admin-1',
        email: 'admin@lawpractice.local',
        username: 'admin',
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'User',
      };
      prisma.user.findFirst.mockResolvedValue(mockAdmin);

      const result = await service.validateAdmin('admin', 'admin123');

      expect(result).toEqual(mockAdmin);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { username: 'admin', role: 'ADMIN' },
      });
    });

    it('should return null when invalid credentials provided', async () => {
      const result = await service.validateAdmin('admin', 'wrongpass');
      expect(result).toBeNull();
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens for user', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'ADMIN',
        firstName: 'Test',
        lastName: 'User',
      };

      const result = await service.generateTokens(mockUser as any);

      expect(result.accessToken).toBe('mock_jwt_token');
      expect(result.refreshToken).toBe('mock_jwt_token');
      expect(result.expiresIn).toBe(900);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('logout', () => {
    it('should revoke user refresh tokens on logout', async () => {
      await service.logout('user-1');

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRevoked: false },
        data: expect.objectContaining({ isRevoked: true }),
      });
    });
  });
});
