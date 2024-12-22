import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { Client } from "database/entitys/Client";
import { Profile } from "database/entitys/Profile";
import { ClientRepository } from "database/repositorys/Client";
import { ProfileRepository } from "database/repositorys/Profile";
import { SessionRepository } from "database/repositorys/Session";
import { UserRepository } from "database/repositorys/User";
import jwt from "utils/jwt";

@Injectable()
export class AuthService {
  @Inject() private sessionRepository: SessionRepository;
  @Inject() private clientRepository: ClientRepository;
  @Inject() private profileRepository: ProfileRepository;

  async verifyToken(token: string) {
    const session = await this.sessionRepository._findOne({ id: token });
    let profiles: Profile[] = [];
    const access: { client?: { client: Client } } = {};

    if (session.accessToken) {
      const token = jwt.verify(session.accessToken) as { clientId: string };
      const client = await this.clientRepository._findOne({
        id: token.clientId,
        _findOptions: { withAccessToken: true },
      });

      if (!client) throw new BadRequestException("invalid_access_token");

      access.client = { client };
    } else if (session?.user) {
      profiles = await this.profileRepository._find({
        user: session.user.id,
        _findOptions: { join: ["client"] },
      });
    }

    return { session, profiles, access };
  }
}
