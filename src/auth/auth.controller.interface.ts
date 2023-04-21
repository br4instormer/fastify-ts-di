import { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../common/base.controller";

export interface IAuthController extends BaseController {
  refresh(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
