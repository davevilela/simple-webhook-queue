import { Body, Controller, Post } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';

import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  create(@Body() body: CreateJobDto) {
    return this.queueService.enqueue(body);
  }
}
