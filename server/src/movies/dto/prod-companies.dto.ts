import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class ProdCompaniesDto {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsString()
    name: string;
}