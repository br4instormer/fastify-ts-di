import { UserLoginDto } from "./dto/user.dto";
import { User } from "./user.entity";

export interface IUserService {
  validate(dto: UserLoginDto): Promise<boolean>;
  find(login: string): Promise<User | null>;
}
