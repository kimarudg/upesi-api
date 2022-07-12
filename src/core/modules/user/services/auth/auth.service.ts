import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TYPES } from '@app/types';
import { UserModel } from '@core/modules/user/models';
import { UserService } from '@core/modules/user/services/user/service';

export interface IChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IVerifyUserPayload {
  email: string;
  user: UserModel;
  key: string;
}

export interface IUserPayload {
  username: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
}
@Injectable()
export class AuthService {
  constructor(
    @Inject(TYPES.UserService) private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async activateAccount(jwtToken: string): Promise<boolean> {
    const payload = this.jwtService.verify<IUserPayload>(jwtToken); // jwtDecode<IUserPayload>(jwtToken);
    if (payload.sub) {
      const user = await this.userService.byEmail(payload.username);
      if (user && user.id === payload.sub && Date.now() <= payload.exp * 1000) {
        user.confirmed = true;
        this.userService.repository.save(user);
        return true;
      }
    }
    return false;
  }

  async changePassword(user, passwordData: IChangePasswordData) {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      throw new ConflictException('The two passwords conflict each other');
    }

    if (!user) {
      throw new ForbiddenException();
    }
    const existingUser = await this.userService.repository.findByEmail(
      user.email,
      true,
    );
    const passwordHash = await this.userService.getHash(
      passwordData.newPassword,
    );
    if (!existingUser) {
      throw new ForbiddenException();
    }

    if (existingUser && existingUser.needPasswordChange) {
      await this.userService.repository.update(existingUser.id, {
        passwordHash,
        needPasswordChange: false,
      });
      return this.loginUser(user.email, passwordData.newPassword);
    }

    const validatedUser = await this.validateUser(
      user.email,
      passwordData.currentPassword,
    );

    if (!validatedUser) throw new UnauthorizedException();

    if (validatedUser) {
      await this.userService.repository.update(existingUser.id, {
        passwordHash,
        needPasswordChange: false,
      });
      return this.loginUser(user.email, passwordData.newPassword);
    }
  }

  async validateUser(email: string, pass: string): Promise<UserModel> {
    const user = await this.userService.repository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('email = :email', { email })
      .andWhere('blocked = :blocked', { blocked: false })
      .getOne();

    if (!user) {
      throw new UnauthorizedException();
    }
    if (!user.confirmed) {
      throw new UnauthorizedException('The account is not confirmed');
    }
    if (!user.active) {
      throw new UnauthorizedException('The account is not active');
    }
    // if not confirmed, no access token
    if (user && (await this.userService.compareHash(pass, user.passwordHash))) {
      const ping = new Date();
      const loginCount = user.loginCount + 1;
      this.userService.repository.update(user.id, {
        lastLogin: ping,
        lastSeen: ping,
        loginCount,
      });
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async sign(user: UserModel) {
    const payload = { username: user.email, sub: user.id };
    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signOneTimePayload(user: UserModel, expiresIn = '24h') {
    const payload = { username: user.email, sub: user.id, aud: 'pass' };
    return this.jwtService.sign(payload, { expiresIn });
  }

  async loginUser(email: string, pass: string): Promise<any> {
    const user: UserModel = await this.validateUser(email, pass);
    if (!user || !user.active) {
      throw new UnauthorizedException();
    }
    // if (!user.confirmed) { fe to extract token, and regenerate email
    if (user.needPasswordChange) {
      const accessToken = await this.signOneTimePayload(user);
      const { passwordHash, ...result } = user;
      return { ...result, accessToken };
    }
    return await this.sign(user);
  }

  async verifyAccount(data: IVerifyUserPayload) {
    await this.userService.repository.update(data.user.id, { confirmed: true });
    const user = await this.userService.findById(data.user.id);
    return this.sign(user);
  }
}
