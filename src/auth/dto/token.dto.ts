import { Role } from "../../user/user.entity";

export class TokenDto {
  constructor(public login: string, public id: number, public role: Role) {}
}
