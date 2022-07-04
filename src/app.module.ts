import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SecureWebhookMiddleware } from './middlewares/SecureWebhookMiddleware';
import { QueueModule } from './queue/queue.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule.register({ folder: './config' }),
    BullModule.forRootAsync({
      imports: [ConfigModule.register({ folder: './config' })],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('QUEUE_HOST'),
          port: +configService.get('QUEUE_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    QueueModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(SecureWebhookMiddleware).forRoutes('queue');
  }
}
