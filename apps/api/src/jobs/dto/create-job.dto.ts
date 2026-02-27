import { IsString, IsNumber, IsDateString, IsObject, Min } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsObject()
  location: { address: string; lat: number; lng: number };

  @IsDateString()
  date: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsNumber()
  @Min(0)
  pay: number;

  @IsNumber()
  @Min(1)
  headcount: number;
}
