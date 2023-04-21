import { FastifyReply, FastifyRequest } from "fastify";
import { injectable } from "inversify";
import "reflect-metadata";
import { BaseController } from "../common/base.controller";
import { IPingController } from "./ping.controller.interface";

@injectable()
export class PingController extends BaseController implements IPingController {
  constructor() {
    super();
    this.routes = [
      {
        url: "/ping",
        method: "GET",
        handler: this.ping.bind(this),
      },
    ];
  }

  async ping(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    this.ok(reply, "");
  }
}
