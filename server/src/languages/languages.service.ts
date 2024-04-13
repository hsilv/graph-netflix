import { Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { Model } from 'mongoose';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SpokenLanguages } from 'schema/movie.schema';
import { Movie } from 'schema/movie.schema';
import { UpdateFilter } from 'mongodb';

@Injectable()
export class LanguagesService {

  constructor(@InjectModel('Movie') private movieModel: Model<Movie>) { }

  findAll() {
    return this.movieModel.find().distinct('spoken_languages.name').exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} language`;
  }

  async renameLanguage(languageIdOrName: string, newName: string): Promise<boolean> {
    const bulkOps = [
      {
        updateMany: {
          filter: { 'spoken_languages.name': languageIdOrName },
          update: { $set: { 'spoken_languages.$[elem].name': newName } },
          arrayFilters: [{ 'elem.name': languageIdOrName }],
        },
      },
      {
        updateMany: {
          filter: { 'spoken_languages.id': languageIdOrName },
          update: { $set: { 'spoken_languages.$[elem].name': newName } },
          arrayFilters: [{ 'elem.id': languageIdOrName }],
        },
      },
    ];

    await this.movieModel.bulkWrite(bulkOps);

    return true;
  }

  async removeLanguage(languageIdOrName: string): Promise<boolean> {
    const bulkOps = [
      {
        updateMany: {
          filter: { $or: [{ 'spoken_languages.name': languageIdOrName }, { 'spoken_languages.id': languageIdOrName }] },
          update: { $pull: { spoken_languages: { $or: [{ name: languageIdOrName }, { id: languageIdOrName }] } } } as UpdateFilter<Movie>,
        },
      },
    ];

    await this.movieModel.bulkWrite(bulkOps);

    return true;
  }
}
