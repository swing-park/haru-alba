import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from './job.schema';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) {}

  async create(employerId: string, dto: CreateJobDto): Promise<JobDocument> {
    const job = new this.jobModel({ ...dto, employerId });
    return job.save();
  }

  async findAll(filters: {
    category?: string;
    date?: string;
    status?: string;
  }): Promise<JobDocument[]> {
    const query: any = { status: filters.status || 'open' };
    if (filters.category) query.category = filters.category;
    if (filters.date) {
      const start = new Date(filters.date);
      const end = new Date(filters.date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }
    return this.jobModel
      .find(query)
      .populate('employerId', 'name trustScore')
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async findOne(id: string): Promise<JobDocument> {
    const job = await this.jobModel.findById(id).populate('employerId', 'name trustScore phone');
    if (!job) throw new NotFoundException('공고를 찾을 수 없습니다.');
    return job;
  }

  async update(id: string, employerId: string, dto: Partial<CreateJobDto>): Promise<JobDocument> {
    const job = await this.jobModel.findById(id);
    if (!job) throw new NotFoundException('공고를 찾을 수 없습니다.');
    if (job.employerId.toString() !== employerId) throw new ForbiddenException();
    return this.jobModel.findByIdAndUpdate(id, dto, { new: true }) as Promise<JobDocument>;
  }

  async remove(id: string, employerId: string): Promise<void> {
    const job = await this.jobModel.findById(id);
    if (!job) throw new NotFoundException('공고를 찾을 수 없습니다.');
    if (job.employerId.toString() !== employerId) throw new ForbiddenException();
    await this.jobModel.findByIdAndDelete(id);
  }

  async findByEmployer(employerId: string): Promise<JobDocument[]> {
    return this.jobModel.find({ employerId }).sort({ createdAt: -1 });
  }
}
