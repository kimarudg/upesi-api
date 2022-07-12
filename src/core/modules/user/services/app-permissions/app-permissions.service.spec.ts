import { Test, TestingModule } from '@nestjs/testing';
import { AppPermissionsService } from './app-permissions.service';

describe('AppPermissionsService', () => {
  let service: AppPermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppPermissionsService],
    }).compile();

    service = module.get<AppPermissionsService>(AppPermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
