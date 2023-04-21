import { FastifyReply, FastifyRequest } from "fastify";
import { BaseController } from "../common/base.controller";

export interface IPingController extends BaseController {
  ping(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
