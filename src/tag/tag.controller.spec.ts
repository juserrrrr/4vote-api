import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

describe('TagController', () => {
  let tagController: TagController;
  let tagService: TagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(['tag1', 'tag2']),
            findOne: jest.fn().mockResolvedValue('tag1'),
          },
        },
      ],
    }).compile();

    tagController = module.get<TagController>(TagController);
    tagService = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(tagController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tags', async () => {
      const result = await tagController.findAll();
      expect(result).toEqual(['tag1', 'tag2']);
      expect(tagService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single tag', async () => {
      const result = await tagController.findOne(1);
      expect(result).toEqual('tag1');
      expect(tagService.findOne).toHaveBeenCalledWith(1);
    });
  });
});
