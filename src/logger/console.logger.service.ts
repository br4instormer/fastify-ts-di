import { injectable } from "inversify";
import { Logger, ILogObj } from "tslog";
import { ILoggerService } from "./logger.service.interface";
import "reflect-metadata";

@injectable()
export class ConsoleLoggerService implements ILoggerService {
  public logger: Logger<ILogObj>;

  constructor() {
    this.logger = new Logger({
      prettyLogTemplate: `{{hh}}:{{MM}}:{{ss}}:{{ms}} {{logLevelName}} `,
      prettyErrorTemplate: `{{errorName}} {{errorMessage}}`,
      prettyLogTimeZone: "local",
    });
  }

  log(...args: unknown[]): void {
    this.logger.info(...args);
  }

  error(...args: unknown[]): void {
    this.logger.error(...args);
  }

  warn(...args: unknown[]): void {
    this.logger.warn(...args);
  }
}
