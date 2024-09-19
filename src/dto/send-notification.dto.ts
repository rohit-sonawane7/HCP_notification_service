import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendNotificationDto {
  @IsNotEmpty()
  @IsEmail()
  to: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}
