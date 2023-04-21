import { inject, injectable } from "inversify";
import { SignOptions } from "@fastify/jwt";
import { IConfigService } from "../config/config.service.interface";
import { TYPES } from "../types";
import { IAuthService } from "./auth.service.interface";
import { TokenDto } from "./dto/token.dto";
import { Tokens } from "./types";
import "reflect-metadata";

@injectable()
export class AuthService implements IAuthService {
  private jwtStorageSignOptions: Partial<SignOptions> = {
    expiresIn: this.configService.get("JWT_STORAGE_EXPIRES"),
  };
  private jwtCookieSignOptions: Partial<SignOptions> = {
    expiresIn: this.configService.get("JWT_COOKIES_EXPIRES"),
  };
  constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}

  private async generateTokens(payload: TokenDto, signFn: Function): Promise<Tokens | null> {
    const authToken = await signFn(payload, this.jwtStorageSignOptions);
    const refreshToken = await signFn(payload, this.jwtCookieSignOptions);

    return {
      authToken,
      refreshToken,
    };
  }

  async refresh(payload: TokenDto, signFn: Function): Promise<Tokens | null> {
    return this.generateTokens(payload, signFn);
  }
}
