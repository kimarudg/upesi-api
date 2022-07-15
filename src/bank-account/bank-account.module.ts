import { TYPES } from '@app/types';
import { ClassProvider, Module } from '@nestjs/common';
import { BankAccountRepository } from './repositories/bank-account.repository';
import { BankAccountResolver } from './resolvers/bank-account/bank-account.resolver';
import { BankAccountService } from './services/bank-account/bank-account.service';

const serviceProvider: ClassProvider = {
  provide: TYPES.BankAccountService,
  useClass: BankAccountService,
};

const repositoryProvider: ClassProvider = {
  provide: TYPES.BankAccountRepository,
  useClass: BankAccountRepository,
};

const resolvers = [BankAccountResolver];
const services = [BankAccountService];
const providers = [serviceProvider, repositoryProvider];

@Module({
  providers: [...resolvers, ...services, ...providers],
})
export class BankAccountModule {}
