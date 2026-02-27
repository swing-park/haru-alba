import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  findAll(@Query() filters: { category?: string; date?: string; status?: string }) {
    return this.jobsService.findAll(filters);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyJobs(@CurrentUser() user: any) {
    return this.jobsService.findByEmployer(user._id.toString());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: any, @Body() dto: CreateJobDto) {
    return this.jobsService.create(user._id.toString(), dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: Partial<CreateJobDto>) {
    return this.jobsService.update(id, user._id.toString(), dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.jobsService.remove(id, user._id.toString());
  }
}
