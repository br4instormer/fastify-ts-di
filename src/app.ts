import fastify, {
  FastifyInstance,
  FastifyListenOptions,
  FastifyRegisterOptions,
  FastifyReply,
  FastifyRequest,
  RegisterOptions,
} from "fastify";
import { inject, injectable } from "inversify";
import corsPlugin from "@fastify/cors";
import cookiePlugin from "@fastify/cookie";
import jwtPlugin, { FastifyJWTOptions } from "@fastify/jwt";
import { TYPES } from "./types";
import { ILoggerService } from "./logger/logger.service.interface";
import { IConfigService } from "./config/config.service.interface";
import { IAuthController } from "./auth/auth.controller.interface";
import { IPingController } from "./ping/ping.controller.interface";
import "reflect-metadata";

@injectable()
export class App {
  private app: FastifyInstance = fastify({
    logger: this.configService.get("VERBOSE") === "true",
  });
  private port: number = Number.parseInt(this.configService.get("PORT"));
  private host: string = this.configService.get("HOST");
  private corsDomain: string = this.configService.get("CORS_DOMAIN");

  private routeOptions: FastifyRegisterOptions<RegisterOptions> = {
    prefix: "/api/v1",
  };
  private listenOptions: FastifyListenOptions = {
    port: this.port,
    host: this.host,
  };
  private jwtOptions: FastifyJWTOptions = {
    secret: this.configService.get("JWT_SECRET"),
    cookie: {
      cookieName: "token",
      signed: false,
    },
    sign: {
      iss: this.configService.get("JWT_ALLOWED_DOMAIN"),
      expiresIn: this.configService.get("JWT_STORAGE_EXPIRES"),
    },
    verify: {
      allowedIss: this.configService.get("JWT_ALLOWED_DOMAIN"),
    },
  };
  private skipRoutes: string[] = ["/login", "/ping"];

  constructor(
    @inject(TYPES.ConsoleLoggerService) private logger: ILoggerService,
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.AuthController) private authController: IAuthController,
    @inject(TYPES.PingController) private pingController: IPingController,
  ) {}

  registerRoutes(): void {
    this.app.register(this.authController.registerRoutes(), this.routeOptions);
    this.app.register(this.pingController.registerRoutes(), this.routeOptions);
  }

  registerJwtValidation(): void {
    this.app.addHook("onRequest", async (request) => {
      const skipRoute = this.skipRoutes.some((route) => request.url.includes(route));
      const isRefreshTokenRoute = request.url.includes("/auth/refresh");

      if (skipRoute) {
        return;
      }

      await request.jwtVerify();
      await request.jwtVerify({ onlyCookie: !isRefreshTokenRoute });
    });
  }

  registerErrorHandlers(): void {
    this.app.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
      this.logger.error(error);

      reply.code(error.statusCode || 500).send("");
    });
  }

  registerPlugins(): void {
    this.app.register(corsPlugin, {
      origin: this.corsDomain,
      credentials: true,
      optionsSuccessStatus: 200,
    });
    this.app.register(jwtPlugin, this.jwtOptions);
    this.app.register(cookiePlugin);
  }

  public async init(): Promise<void> {
    // сначала плагины, потом ручки!
    this.registerPlugins();
    this.registerRoutes();
    this.registerJwtValidation();
    this.registerErrorHandlers();
    await this.app.listen(this.listenOptions);
    this.logger.log(`Server started on port http://${this.host}:${this.port}`);
  }

  public close(): Promise<void> {
    return this.app.close();
  }
}
