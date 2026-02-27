import { IsEmail, IsEnum, IsString, MinLength, IsOptional } from 'class-validator';

export class SignupDto {
  @IsEnum(['employer', 'worker'])
  type: 'employer' | 'worker';

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  bizNumber?: string;
}
