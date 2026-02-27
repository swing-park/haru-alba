import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationDocument } from './application.schema';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
  ) {}

  async apply(jobId: string, workerId: string): Promise<ApplicationDocument> {
    const exists = await this.applicationModel.findOne({ jobId, workerId });
    if (exists) throw new ConflictException('이미 지원한 공고입니다.');
    const application = new this.applicationModel({ jobId, workerId });
    return application.save();
  }

  async findByJob(jobId: string): Promise<ApplicationDocument[]> {
    return this.applicationModel
      .find({ jobId })
      .populate('workerId', 'name phone trustScore attendanceRate');
  }

  async findByWorker(workerId: string): Promise<ApplicationDocument[]> {
    return this.applicationModel
      .find({ workerId })
      .populate('jobId');
  }

  async confirm(id: string, employerId: string): Promise<ApplicationDocument> {
    const app = await this.applicationModel.findById(id).populate<{ jobId: any }>('jobId');
    if (!app) throw new NotFoundException();
    if (app.jobId.employerId.toString() !== employerId) throw new ForbiddenException();
    app.status = 'confirmed';
    app.confirmedAt = new Date();
    return app.save();
  }

  async complete(id: string, employerId: string): Promise<ApplicationDocument> {
    const app = await this.applicationModel.findById(id).populate<{ jobId: any }>('jobId');
    if (!app) throw new NotFoundException();
    if (app.jobId.employerId.toString() !== employerId) throw new ForbiddenException();
    app.status = 'completed';
    app.completedAt = new Date();
    return app.save();
  }

  async cancel(id: string, userId: string): Promise<ApplicationDocument> {
    const app = await this.applicationModel.findById(id);
    if (!app) throw new NotFoundException();
    if (app.workerId.toString() !== userId) throw new ForbiddenException();
    app.status = 'cancelled';
    return app.save();
  }
}
