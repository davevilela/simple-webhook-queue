import Bull from 'bull';
import { IsNotEmpty } from 'class-validator';

export class CreateJobDto {
  idempotentId: string;

  @IsNotEmpty()
  callbackUrl: string;

  @IsNotEmpty()
  params: any;

  options?: Bull.JobOptions;
}
