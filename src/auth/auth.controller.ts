import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { injectable, inject } from "inversify";
import { BaseController } from "../common/base.controller";
import { IConfigService } from "../config/config.service.interface";
import { TYPES } from "../types";
import { IAuthController } from "./auth.controller.interface";
import { IAuthService } from "./auth.service.interface";
import { TokenDto } from "./dto/token.dto";
import { Tokens } from "./types";
import "reflect-metadata";

@injectable()
export class AuthController extends BaseController implements IAuthController {
  private allowedDomain: string = this.configService.get("JWT_ALLOWED_DOMAIN");
  private cookiesPath: string = this.configService.get("JWT_COOKIES_PATH");
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.AuthService) private authService: IAuthService,
  ) {
    super();
    this.routes = [
      {
        url: "/auth/refresh",
        method: "POST",
        handler: this.refresh.bind(this),
      },
    ];
  }

  private async sendTokens(
    { refreshToken, authToken }: Tokens,
    reply: FastifyReply,
  ): Promise<FastifyInstance> {
    return this.send(
      reply.setCookie("token", refreshToken, {
        domain: this.allowedDomain,
        path: this.cookiesPath,
        secure: true,
        httpOnly: true,
        sameSite: true,
      }),
      200,
      { token: authToken },
    );
  }

  async refresh(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const payload = request.user as TokenDto;
    const signFn = reply.jwtSign.bind(reply);
    const tokens = await this.authService.refresh(payload, signFn);

    if (!tokens) {
      this.error(reply, 401, "cannot refresh token");
    } else {
      this.sendTokens(tokens, reply);
    }
  }
}
