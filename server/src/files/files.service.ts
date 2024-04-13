import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model } from 'mongoose';
import { createModel } from 'mongoose-gridfs';
import { GridFSBucketReadStream } from 'mongodb';
import { CreateFileDto } from './dto/create-file.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GridFSBucket, ObjectId } from 'mongodb'
import { File, Chunk } from 'schema/file.schema';


@Injectable()
export class FilesService {
  private gridFsBucket: GridFSBucket;

  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<File>,
    @InjectModel(Chunk.name) private readonly chunkModel: Model<Chunk>,
    @InjectConnection() private readonly connection: Connection
  ) {
    this.gridFsBucket = new GridFSBucket(this.connection.db);
  }


  async readStream(id: string): Promise<GridFSBucketReadStream> {
    return this.gridFsBucket.openDownloadStream(new mongoose.Types.ObjectId(id));
  }

  async findInfo(id: string): Promise<CreateFileDto> {
    try {
      const result = await this.fileModel.findById(id).exec();
      if (!result) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
      return {
        filename: result.filename,
        length: result.size,
        chunkSize: result.chunkSize,
        md5: null, // Asegúrate de que el campo 'md5' existe en tu documento
        contentType: result.contentType
      };
    } catch (error) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteFile(id: string): Promise<boolean> {
    const chunks = await this.chunkModel.deleteMany({ files_id: new ObjectId(id) }).exec();
    const result = await this.fileModel.findByIdAndDelete(id);
    return (chunks != null) && (result != null);
  }
}