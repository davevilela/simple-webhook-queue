import { IsNotEmpty } from 'class-validator';

export class EnqueueDto {
  @IsNotEmpty()
  callbackUrl: string;

  @IsNotEmpty()
  params: any;
}
