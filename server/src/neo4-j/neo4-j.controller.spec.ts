import { Test, TestingModule } from '@nestjs/testing';
import { Neo4JController } from './neo4-j.controller';
import { Neo4JService } from './neo4-j.service';

describe('Neo4JController', () => {
  let controller: Neo4JController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Neo4JController],
      providers: [Neo4JService],
    }).compile();

    controller = module.get<Neo4JController>(Neo4JController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
