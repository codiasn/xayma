import {
  Injectable,
  Inject,
  Scope,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { SessionRepository } from "database/repositorys/Session";
import { UserRepository } from "database/repositorys/User";
import { Request } from "express";
import forge from "utils/forge";
import { sign, verify } from "utils/jwt";
import { sendMail } from "utils/mailer";

@Injectable({ scope: Scope.REQUEST })
export class SessionService {
  @Inject(REQUEST) private readonly request: Request;
  @Inject() private repository: SessionRepository;
  @Inject() private userRepository: UserRepository;

  async init(params: { publicKey: string; accessToken?: string }) {
    if (!this.request.session) {
      this.request.session = await this.repository._add(
        params.publicKey,
        params.accessToken,
      );

      return {
        sessionId: this.request.session.id,
        apiPublicKey: forge.keys.public,
      };
    } else {
      const client = this.request.metadata.client;
      delete client.accessToken;
      return {
        sessionId: this.request.session.id,
        apiPublicKey: forge.keys.public,
        profiles: this.request.metadata.profiles,
        client,
      };
    }
  }

  async register(params: any) {
    await this.repository._register(params);

    return {};
  }

  async confirmIdentity(token: string) {
    const user = await this.userRepository._confirmIdentity(token);

    await this.repository._update(this.request.session.id, { user });

    return { sessionId: this.request.session.id };
  }

  async login(params: { email: string; password: string }) {
    if (this.request.session?.user) {
      throw new ConflictException("not_authorized");
    }

    const user = await this.userRepository._findOne({
      email: params.email,
      _findOptions: { join: ["profiles", ["profiles.client", "client"]] },
    });
    if (!user) throw new NotFoundException("email_or_password_incorect");

    if (
      !UserRepository.comparePassword(user.password?.value, params.password)
    ) {
      throw new NotFoundException("email_or_password_incorect");
    }

    if (!user.confirmedIdentity) {
      throw new NotFoundException("user_identity_not_confirmed");
    }

    await this.repository._update(this.request.session.id, { user });

    return {
      client: user.profiles[0].client,
      profiles: user.profiles,
    };
  }

  async logout() {
    await this.repository._update(this.request.session.id, {
      closed: true,
    });

    return { token: this.request.session.id };
  }

  async requestPasswordReset(params: { email: string }) {
    const user = await this.userRepository._findOne({ email: params.email });
    if (!user) throw new NotFoundException("user_not_found");

    // Génération du token JWT avec l'ID de l'utilisateur et une expiration de 1 heure
    const resetToken = sign({ id: user.id }, { expiresIn: "1h" });

    await sendMail({
      text: `${process.env.BASE_URL}/user/reset-password/${resetToken}`,
      to: user.email,
      subject: "Account confirmation",
    });

    return {};
  }

  async resetPassword(params: { token: string; password: string }) {
    // Décodage et vérification du token
    const decoded = verify(params.token) as {
      id: string;
      resetPassword: true;
    };
    if (!decoded.resetPassword) throw new ForbiddenException("not_authorized");

    // Recherche de l'utilisateur par ID extrait du token
    const user = await this.userRepository._findOne({ id: decoded.id });
    if (!user) throw new NotFoundException("user_not_found");

    await this.userRepository._create({
      id: user.id,
      password: params.password as any,
    });

    return {};
  }
}
