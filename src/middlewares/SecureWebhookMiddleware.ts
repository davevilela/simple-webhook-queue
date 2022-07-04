import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { symmetric } from 'secure-webhooks';

@Injectable()
export class SecureWebhookMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}
  use(req: RawBodyRequest<Request>, res: Response, next: () => any) {
    const { headers } = req;
    const body = req.rawBody;

    if (!body) return next();

    const secret = this.configService.get<string>('API_SECRET');

    const isTrustWorthy = symmetric.verify(
      body.toString(), // 👈 needs to be exactly the same as above, make sure to disable any body parsing for this route
      secret,
      headers['x-webhook-signature'] as string,
    );

    if (!isTrustWorthy) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    next();
  }
}
