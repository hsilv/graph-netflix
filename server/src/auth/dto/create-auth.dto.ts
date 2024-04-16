import {
    IsString, IsInt, IsOptional, IsNumber, IsBoolean,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    isBoolean,
    isBooleanString, Validate, ValidateNested, IsIn, IsEmail
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, ApiResponseProperty } from '@nestjs/swagger';

export class CreateAuthDto { }

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
}

export class LoginDTO {
    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    password: string;
}