import {
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  IsBoolean,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isBoolean,
  isBooleanString,
  Validate,
  ValidateNested,
  IsIn,
  IsEmail,
  IsDate,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAuthDto {}

export class RegisterDTO {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsBoolean()
  isActor: boolean;

  @ApiProperty({ example: '1985-10-26' })
  @Type(() => Date) // Esto transformará la entrada en un objeto Date
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty()
  @IsString()
  gender: string;
}

export class LoginDTO {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}
