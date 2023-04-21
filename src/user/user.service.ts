import { injectable } from "inversify";
import { UserLoginDto } from "./dto/user.dto";
import { UserEntity } from "./user.entity";
import { IUserService } from "./user.service.interface";
import { Role, User } from "./user.entity";
import "reflect-metadata";

@injectable()
export class UserService implements IUserService {
  async find(login: string): Promise<User | null> {
    const user: User = {
      id: 1,
      login: "login",
      name: "name",
      role: Role.USER,
      password: "password",
    };
    return user;
  }

  async validate({ login, password }: UserLoginDto): Promise<boolean> {
    const existedUser = await this.find(login);

    if (!existedUser) {
      return false;
    }

    const user = new UserEntity(
      existedUser.login,
      existedUser.name,
      existedUser.role,
      existedUser.password,
    );

    return user.comparePassword(password);
  }
}
