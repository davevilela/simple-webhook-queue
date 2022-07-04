import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { BullModule } from '@nestjs/bull';
import { WebhookQueueProcessor } from './queue.processor';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../../config/app.config';
@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    HttpModule,
    BullModule.registerQueue({
      name: 'webhook',
    }),
  ],
  controllers: [QueueController],
  providers: [QueueService, WebhookQueueProcessor],
})
export class QueueModule {}
