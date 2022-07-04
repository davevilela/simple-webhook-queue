import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  apiSecret: process.env.API_SECRET,
}));
