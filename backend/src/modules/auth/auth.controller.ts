import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service.js';
import { FirebaseService } from './firebase.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { CurrentUserData } from '../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private firebaseService: FirebaseService,
    private prisma: PrismaService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with username and password' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { tokens, user } = await this.authService.login(loginDto);

    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: tokens.expiresIn * 1000,
    });

    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { user, expiresIn: tokens.expiresIn };
  }

  @Public()
  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Google Auth Token' })
  async loginWithGoogle(
    @Body('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const decodedToken = await this.firebaseService.verifyIdToken(token);
    const email = decodedToken.email;
    
    if (!email) {
      throw new UnauthorizedException('Token does not contain an email address');
    }

    // 1. Check if user is Internal Staff (Admin, Lawyer, Receptionist)
    let user = await this.prisma.user.findUnique({ where: { email } });
    
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    if (user) {
       if (!user.isActive) throw new UnauthorizedException('Staff account is inactive');
       const tokens = await this.authService.generateTokens(user);
       await this.authService.saveRefreshToken(user.id, tokens.refreshToken);
       
       response.cookie('access_token', tokens.accessToken, {
         httpOnly: true, secure: isProduction, sameSite: 'lax', maxAge: tokens.expiresIn * 1000,
       });
       response.cookie('refresh_token', tokens.refreshToken, {
         httpOnly: true, secure: isProduction, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000,
       });
       
       return { user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName }, expiresIn: tokens.expiresIn };
    }

    // 2. Not staff. Check if existing Customer
    let clientUser = await this.prisma.clientPortalUser.findUnique({ where: { email } });

    // 3. If new Customer, auto-create their account
    if (!clientUser) {
      clientUser = await this.prisma.clientPortalUser.create({
        data: {
          email: email,
          password: 'google-auth-no-password',
          firstName: decodedToken.name?.split(' ')[0] || 'Unknown',
          lastName: decodedToken.name?.split(' ').slice(1).join(' ') || '',
        }
      });
    }

    // 4. Generate client JWT and set cookies
    const tokens = await this.authService.generateClientTokens(clientUser);
    await this.authService.saveClientRefreshToken(clientUser.id, tokens.refreshToken);

    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true, secure: isProduction, sameSite: 'lax', maxAge: tokens.expiresIn * 1000,
    });
    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true, secure: isProduction, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { user: { id: clientUser.id, email: clientUser.email, role: 'CLIENT', firstName: clientUser.firstName, lastName: clientUser.lastName }, expiresIn: tokens.expiresIn };
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new client account' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { tokens, user } = await this.authService.registerClient(registerDto);

    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: tokens.expiresIn * 1000,
    });

    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { user, expiresIn: tokens.expiresIn };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and invalidate tokens' })
  @ApiCookieAuth()
  async logout(
    @CurrentUser() user: CurrentUserData,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(user.id);

    response.clearCookie('access_token');
    response.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.refresh_token;

    if (!refreshToken) {
      return { error: 'No refresh token provided' };
    }

    const { tokens, user } = await this.authService.refreshTokens(refreshToken);

    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: tokens.expiresIn * 1000,
    });

    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { user, expiresIn: tokens.expiresIn };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiCookieAuth()
  async getProfile(@CurrentUser() user: CurrentUserData) {
    return this.authService.getProfile(user.id);
  }
}