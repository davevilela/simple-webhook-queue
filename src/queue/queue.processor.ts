import { HttpService } from '@nestjs/axios';
import {
  OnQueueActive,
  OnQueueError,
  Process,
  Processor,
  OnQueueFailed,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { firstValueFrom } from 'rxjs';
import { symmetric } from 'secure-webhooks';
import { EnqueueDto } from './dto/enqueue.dto';

function replaceLocalhostWithDockerHost(_url: string): string {
  const url = new URL(_url);
  if (url.hostname === 'localhost') {
    url.hostname = 'host.docker.internal';
  }
  return url.toString();
}

@Processor('webhook')
export class WebhookQueueProcessor {
  private readonly logger = new Logger(WebhookQueueProcessor.name);

  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
  ) {}

  @Process({ concurrency: 2 })
  async handleWebhook(job: Job<EnqueueDto>) {
    const {
      data: { params, callbackUrl },
    } = job;

    const secret = this.config.get<string>('app.apiSecret');

    const signature = symmetric.sign(params, secret);

    const body = JSON.stringify(params);

    const url = callbackUrl;

    await firstValueFrom(
      this.httpService.post(url, body, {
        headers: {
          'x-webhook-signature': signature,
          'Content-Type': 'application/json',
        },
        httpAgent: undefined,
        withCredentials: false,
      }),
    );
  }

  @OnQueueActive()
  onActive(job: Job<EnqueueDto>) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueFailed()
  onFail(job: Job, err: Error) {
    this.logger.error(`Job  ${job.id} Failed: ${err}`);
  }

  @OnQueueError()
  onError(err: Error) {
    this.logger.error(`Queue failed: ${err}`);
  }
}
