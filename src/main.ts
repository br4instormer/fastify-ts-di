import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { TYPES } from "./types";
import { ILoggerService } from "./logger/logger.service.interface";
import { ConsoleLoggerService } from "./logger/console.logger.service";
import { IConfigService } from "./config/config.service.interface";
import { ConfigService } from "./config/config.service";
import { IAuthService } from "./auth/auth.service.interface";
import { AuthService } from "./auth/auth.service";
import { IAuthController } from "./auth/auth.controller.interface";
import { AuthController } from "./auth/auth.controller";
import { IPingController } from "./ping/ping.controller.interface";
import { PingController } from "./ping/ping.controller";

export interface IBootstrapReturn {
  appContainer: Container;
  app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILoggerService>(TYPES.ConsoleLoggerService).to(ConsoleLoggerService).inSingletonScope();
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
  bind<IAuthService>(TYPES.AuthService).to(AuthService);
  bind<IAuthController>(TYPES.AuthController).to(AuthController);

  bind<IPingController>(TYPES.PingController).to(PingController).inSingletonScope();

  bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
  const appContainer = new Container();

  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);

  await app.init();

  return { appContainer, app };
}

export const boot = bootstrap();
