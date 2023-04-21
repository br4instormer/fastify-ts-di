import { compare, hash } from "bcryptjs";

export class UserEntity {
  private _password: string;

  constructor(
    private readonly _login: string,
    private readonly _name: string,
    private readonly _role: Role,
    passwordHash?: string,
  ) {
    if (passwordHash) {
      this._password = passwordHash;
    }
  }

  get login(): string {
    return this._login;
  }

  get name(): string {
    return this._name;
  }

  get password(): string {
    return this._password;
  }

  get role(): Role {
    return this._role as Role;
  }

  public async setPassword(pass: string, salt: number): Promise<void> {
    this._password = await hash(pass, salt);
  }

  public async comparePassword(pass: string): Promise<boolean> {
    return compare(pass, this._password);
  }
}

export type User = {
  id: number;
  login: string;
  name: string;
  role: Role;
  password: string;
};

export const enum Role {
  USER = "user",
  ADMIN = "admin",
}
