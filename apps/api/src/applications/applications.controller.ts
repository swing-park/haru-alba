import { Controller, Post, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  // 구직자: 지원하기
  @Post('jobs/:id/apply')
  apply(@Param('id') jobId: string, @CurrentUser() user: any) {
    return this.applicationsService.apply(jobId, user._id.toString());
  }

  // 구인자: 공고별 지원자 목록
  @Get('jobs/:id/applications')
  findByJob(@Param('id') jobId: string) {
    return this.applicationsService.findByJob(jobId);
  }

  // 구직자: 내 지원 목록
  @Get('applications/me')
  findMyApplications(@CurrentUser() user: any) {
    return this.applicationsService.findByWorker(user._id.toString());
  }

  // 구인자: 지원 확정
  @Patch('applications/:id/confirm')
  confirm(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationsService.confirm(id, user._id.toString());
  }

  // 구인자: 완료 처리
  @Patch('applications/:id/complete')
  complete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationsService.complete(id, user._id.toString());
  }

  // 구직자: 지원 취소
  @Patch('applications/:id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationsService.cancel(id, user._id.toString());
  }
}
