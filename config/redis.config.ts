import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  port: +process.env.REDISPORT ?? 3000,
  host: process.env.REDISHOST ?? 'redis',
  user: process.env.REDISUSER ?? 'redis',
  password: process.env.REDISPASSWORD,
  url: process.env.REDIS_URL,
}));
