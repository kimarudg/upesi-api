import { UserPingInterceptor } from './user-ping.interceptor';
import { UserService } from '../../user/services/user/service';

const userService = {
  saltRounds: 10,
  repository: {},
};

describe('UserPingInterceptor', () => {
  it('should be defined', () => {
   //  expect(new UserPingInterceptor()).toBeDefined();
  });
});
