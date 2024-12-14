import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClientService } from "./client.service";
import { Request } from "express";

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  @Inject() private readonly clientServie: ClientService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.path.startsWith(`/${process.env.ROUTE_PREFIX}/client/`)) {
      request.metadata ||= {} as any;
      request.metadata.client = await this.clientServie.getCurrent(
        request.params.client,
        request.session.user.id,
      );

      if (
        !request.metadata.client &&
        !request.metadata.client.profiles.length
      ) {
        throw new NotFoundException("client_not_found");
      }
    }

    return true;
  }
}

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const profiles = this.reflector.get<string[]>(
      "hasProfiles",
      context.getHandler(),
    );

    if (profiles && profiles.length) {
      const userProfiles = request.metadata.client.profiles.map(
        (profile) => profile.profile,
      );
      const hasProfiles = userProfiles.some((pr) => profiles.includes(pr));

      if (!hasProfiles) throw new ForbiddenException("not_authorized");
    }

    return true;
  }
}
