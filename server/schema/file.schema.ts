import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Schema({ collection: 'fs.chunks' })
export class Chunk {

    @Prop()
    _id: ObjectId;

    @Prop()
    files_id: ObjectId;

    @Prop()
    n: number;

    @Prop()
    data: Buffer;
}

@Schema({ collection: 'fs.files' })
export class File {
    @Prop()
    originalname: string;

    @Prop()
    encoding: string;

    @Prop()
    mimetype: string;

    @Prop()
    id: string;

    @Prop()
    filename: string;

    @Prop()
    metadata: string;

    @Prop()
    bucketName: string;

    @Prop()
    chunkSize: number;

    @Prop()
    size: number;

    @Prop()
    uploadDate: Date;

    @Prop()
    contentType: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
export const ChunkSchema = SchemaFactory.createForClass(Chunk);