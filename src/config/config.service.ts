import { IConfigService } from "./config.service.interface";
import { config, DotenvLoadOutput, DotenvParseOutput } from "dotenv-flow";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ILoggerService } from "../logger/logger.service.interface";
import "reflect-metadata";

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;
  constructor(@inject(TYPES.ConsoleLoggerService) private logger: ILoggerService) {
    const result: DotenvLoadOutput = config({
      node_env: process.env.NODE_ENV,
      default_node_env: "development",
    });

    if (result.error) {
      this.logger.error("[ConfigService] Не удалось прочитать файл .env или он отсутствует");
    } else {
      this.logger.log("[ConfigService] Конфигурация .env загружена");
      this.config = result.parsed as DotenvParseOutput;
    }
  }

  get(key: string): string {
    const result = this.config[key];

    if (result === undefined) {
      this.logger.warn(`cannot find env variable by key ${key}`);

      return "";
    }

    return this.config[key];
  }

  getArray(key: string): string[] {
    const result = this.get(key);

    return result ? result.split(",") : [];
  }
}
