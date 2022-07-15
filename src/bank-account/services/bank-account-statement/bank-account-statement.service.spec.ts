import { Test, TestingModule } from '@nestjs/testing';
import { BankAccountStatementService } from './bank-account-statement.service';

describe('BankAccountStatementService', () => {
  let service: BankAccountStatementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankAccountStatementService],
    }).compile();

    service = module.get<BankAccountStatementService>(BankAccountStatementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
