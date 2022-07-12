import { Test, TestingModule } from '@nestjs/testing';
import { SystemRoleService } from './system-roles.service';

describe('SystemRolesService', () => {
  let service: SystemRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemRoleService],
    }).compile();

    service = module.get<SystemRoleService>(SystemRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
