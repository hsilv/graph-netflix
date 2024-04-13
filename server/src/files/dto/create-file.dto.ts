import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateFileDto {

    @ApiProperty()
    length: number;

    @ApiProperty()
    chunkSize: number;

    @ApiProperty()
    filename: string;

    @ApiProperty()
    md5: string;

    @ApiProperty()
    contentType: string;
}

export class ResponseFileDto {
    @ApiProperty()
    message: string;

    @ApiProperty({ type: CreateFileDto })
    file: CreateFileDto;
}
