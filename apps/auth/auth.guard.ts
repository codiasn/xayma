import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "./auth.service";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authServie: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    // Ignorer certaines routes en fonction de la condition (exemple : route 'public')
    const isPublic = this.reflector.get<boolean>(
      "isPublic",
      context.getHandler(),
    );
    if (isPublic && !token) {
      return true; // Sauter l'authentification si la route est publique
    }

    if (!token) return false;

    const { session, profiles, access } =
      await this.authServie.verifyToken(token);

    if (!isPublic) {
      if (!session || !(session.user || session.accessToken)) {
        throw new ForbiddenException("not_authorized");
      }

      if (session.closed && !isPublic) {
        throw new ForbiddenException("session_closed");
      }
    }

    request.session = session;
    request.metadata ||= {} as any;

    if (profiles.length) {
      request.metadata.client = profiles[0].client;
      request.metadata.profiles = profiles;
    }

    request.metadata.access = access;
    if (request.metadata.access.client) {
      request.metadata.client = request.metadata.access.client.client;
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | null {
    const authorization = request.headers["authorization"];
    if (!authorization) {
      return null;
    }

    const parts = authorization.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return null;
    }

    return parts[1];
  }
}
