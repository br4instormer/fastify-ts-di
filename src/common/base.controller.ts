import { FastifyInstance, FastifyPluginCallback, FastifyReply, RouteOptions } from "fastify";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export abstract class BaseController {
  protected routes: RouteOptions[] = [];

  public send<T>(reply: FastifyReply, code: number, message: T): FastifyReply {
    return reply.status(code).send(message);
  }

  public ok<T>(reply: FastifyReply, message: T): FastifyReply {
    return this.send<T>(reply, 200, message);
  }

  public error<T>(reply: FastifyReply, code: number, message: T): FastifyReply {
    return this.send(reply, code, { error: true, message });
  }

  public created(reply: FastifyReply): FastifyReply {
    return reply.status(201);
  }

  public registerRoutes(): FastifyPluginCallback {
    return (app: FastifyInstance, _, done) => {
      this.routes.forEach((route: RouteOptions): FastifyInstance => app.route(route));

      done();
    };
  }
}
