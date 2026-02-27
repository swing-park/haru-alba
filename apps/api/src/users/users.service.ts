import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: {
    type: 'employer' | 'worker';
    name: string;
    phone: string;
    email: string;
    password: string;
    bizNumber?: string;
  }): Promise<UserDocument> {
    const exists = await this.userModel.findOne({ email: data.email });
    if (exists) throw new ConflictException('이미 사용 중인 이메일입니다.');

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = new this.userModel({ ...data, passwordHash });
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-passwordHash');
  }
}
