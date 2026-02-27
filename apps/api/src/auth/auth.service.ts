import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const user = await this.usersService.create(dto);
    const token = this.generateToken(user);
    return { token, user: this.sanitize(user) };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

    const token = this.generateToken(user);
    return { token, user: this.sanitize(user) };
  }

  private generateToken(user: any) {
    return this.jwtService.sign({ sub: user._id, email: user.email, type: user.type });
  }

  private sanitize(user: any) {
    const { passwordHash, ...rest } = user.toObject();
    return rest;
  }
}
