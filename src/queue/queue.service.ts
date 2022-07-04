import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { Queue } from 'bull';
import { EnqueueDto } from './dto/enqueue.dto';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(@InjectQueue('webhook') private queue: Queue<EnqueueDto>) {}

  async enqueue(job: CreateJobDto) {
    const { callbackUrl, idempotentId, params, options = {} } = job;
    const enqueueParams: EnqueueDto = {
      callbackUrl,
      params,
    };

    this.logger.log(
      `Enqueuing job with params: ${JSON.stringify({
        enqueueParams,
        options,
      })}`,
    );
    return this.queue.add(enqueueParams, {
      ...options,
      ...(idempotentId ? { jobId: idempotentId } : {}),
    });
  }
}
