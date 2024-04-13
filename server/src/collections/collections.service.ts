import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from 'schema/movie.schema';

@Injectable()
export class CollectionsService {
  constructor(@InjectModel('Movie') private movieModel: Model<Movie>) { }

  async findAll(page: number, limit: number): Promise<string[]> {
    page = Number(page);
    limit = Number(limit);

    if ((page === undefined || isNaN(page)) || (limit === undefined || isNaN(limit))) {
      page = 1;
      limit = 10;
    }

    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $match: { belongs_to_collection: { $exists: true } },
      },
      {
        $group: { _id: '$belongs_to_collection.name' },
      }, {
        $sort: { _id: 1 as const },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const result = await this.movieModel.aggregate(pipeline).exec();

    const transformedResult = result.map((item) => item._id);

    return transformedResult;
  }

  findOne(name: string) {
    return this.movieModel.find({ 'belongs_to_collection.name': name }).exec();
  }

  async create(createCollectionDto: CreateCollectionDto) {
    const createdCollection = new this.movieModel(createCollectionDto);
    return createdCollection.save();
  }
}
