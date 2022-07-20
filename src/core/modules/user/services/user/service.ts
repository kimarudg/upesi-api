import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EntityManager, getConnection } from 'typeorm';
import { AuthService } from '@core/modules/user/services/auth/auth.service';
import { config } from '@config/index';
import { validateInput, validateOutput } from '@core/validators';
import { SystemRoleModel } from '@core/modules/user/models/system-roles.model';
import { MailService } from '@core/modules/email/services/mail/mail.service';
import { TYPES } from '@app/types';
import { UserModel } from '@core/modules/user/models';
import { UserRepository } from '@core/modules/user/repositories/user-repository';
import {
  CreateUserInput,
  RegisterUserInput,
} from '@core/modules/user/validators';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class UserService {
  private saltRounds = 10;
  public readonly repository: UserRepository;
  logger = new Logger(AuthService.name);

  /**
   * This is used by the Admin to create a new user
   *
   * @param newUser: User data that is entered by Administrator
   * @returns UserModel
   */
  async createUser(newUser: CreateUserInput): Promise<UserModel | null> {
    let { passwordHash } = newUser;
    const { email, phone, needPasswordChange, systemRoles, profile } = newUser;

    const pwd = this.generateRandomPassword();
    passwordHash = await this.getHash(passwordHash || pwd);

    const user = new UserModel();
    user.email = email;
    user.phone = phone;
    user.passwordHash = passwordHash;
    user.needPasswordChange = needPasswordChange;
    if (systemRoles && systemRoles.length > 0) {
      const roleIds = systemRoles.map((role) => role.id);
      const roles = await this.manager.findByIds(SystemRoleModel, roleIds);
      user.systemRoles = roles;
    }

    user.confirmed = false;
    user.active = true;
    user.profile = profile;

    await validateInput(user, true);
    let saved;
    try {
      saved = await this.repository.save(user);
    } catch (error) {
      throw new Error(error.detail);
    }
    await validateOutput(saved, true);

    const signedPayload = await this.signOneTimePayload(saved);
    this.mailService.send({
      from: config.mail.defaultFrom,
      subject: config.mail.welcomeEmailSubject,
      to: saved.email,
      template: 'template/email/account/create-password',
      context: {
        name: `${saved.profile.firstName} ${saved.profile.lastName}`,
        pwd,
        url: `${config.frontEndUrl}/verify-account?payload=${signedPayload}&email=${saved.email}`,
        unsubscriptionEmail: 'email to unsubscribe',
      },
    });
    return saved;
  }

  /**
   * This is user for self registration by the user
   * @param newUser
   * @param avatar
   * @returns
   */
  async registerUser(
    newUser: RegisterUserInput,
    avatar?: FileUpload,
  ): Promise<UserModel> {
    const { passwordHash: password } = newUser;
    const { email, phone, profile } = newUser;

    const passwordHash = await this.getHash(password);

    let user = new UserModel();
    const userDetails: UserModel = {
      email,
      phone,
      passwordHash,
      needPasswordChange: false,
      confirmed: true,
      active: true,
      profile,
    };
    const displayName = '';
    const initials = '';
    user = { ...userDetails, profile };

    await validateInput(user, true);

    let saved: UserModel;
    try {
      saved = await this.repository.save(user);
    } catch (error) {
      throw new Error(error.detail);
    }
    await validateOutput(saved, true);

    // upload file

    // if (avatar) {
    //   saved.avatarHash = await this.firebaseService.uploadUserAvatar(
    //     avatar,
    //     saved,
    //   );
    //   saved = await this.repository.save(saved);
    // }

    const signedPayload = await this.signOneTimePayload(saved);
    this.mailService.send({
      from: config.mail.defaultFrom,
      subject: config.mail.welcomeEmailSubject,
      to: saved.email,
      template: 'template/email/account/activate',
      context: {
        name: `${saved.profile.firstName} ${saved.profile.lastName}`,
        url: `${config.url}/verify-account?payload=${signedPayload}&email=${saved.email}`,
      },
    });
    return saved;
  }

  async decode(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload?.sub) {
        return this.byEmail(payload.username);
      }
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  generateRandomPassword() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  byEmail(email: string): Promise<UserModel | undefined> {
    return this.repository.findByEmail(email);
  }

  findById(id: string) {
    return this.repository.findById(id);
  }

  async getHash(password: string | undefined): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(
    password: string | undefined,
    hash: string | undefined,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async signOneTimePayload(user: UserModel, expiresIn = '24h') {
    const payload = { username: user.email, sub: user.id, aud: 'pass' };
    return this.jwtService.sign(payload, { expiresIn });
  }

  async addRole(id, roleIds) {
    const user = await getConnection()
      .manager.findOneOrFail(UserModel, {
        id,
      })
      .catch(() => {
        throw new NotFoundException(`User with id:${id} not found!`);
      });
    await getConnection()
      .createQueryBuilder()
      .relation(UserModel, 'systemRoles')
      .of(user)
      .add(roleIds);
    return this.findById(user.id);
  }

  async removeRole(id, roleId) {
    const role = await this.manager
      .findOneOrFail(SystemRoleModel, roleId)
      .catch(() => {
        throw new NotFoundException(`Role with id:${roleId} not found!`);
      });
    const user = await getConnection()
      .manager.findOneOrFail(UserModel, {
        id,
      })
      .catch(() => {
        throw new NotFoundException(`User with id:${id} not found!`);
      });
    await getConnection()
      .createQueryBuilder()
      .relation(UserModel, 'systemRoles')
      .of(user)
      .remove(role);
    return this.findById(user.id);
  }

  constructor(
    @Inject(TYPES.EntityManager) public readonly manager: EntityManager,
    @Inject(TYPES.MailService) private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {
    this.repository = manager.getCustomRepository(UserRepository);
  }
}
