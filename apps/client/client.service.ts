import { Injectable, Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Client } from "database/entitys/Client";
import { ClientRepository } from "database/repositorys/Client";
import { ProfileRepository } from "database/repositorys/Profile";
import { Request } from "express";

@Injectable()
export class ClientService {
  @Inject(REQUEST) private readonly request: Request;
  @Inject() private repository: ClientRepository;
  @Inject() private profileRepository: ProfileRepository;

  async update(params: Partial<Client>) {
    // const application = await this.repository._update(params);
    // return application;
  }

  async getCurrent(id: string, userId: string) {
    const client = await this.repository._findOne({
      id,
      _findOptions: { join: ["profiles", ["profiles.user", "user"]] },
    });

    if (client) {
      client.profiles = client.profiles.filter(
        (profile) => profile.user.id === userId,
      );
    }

    return client;
  }
}
