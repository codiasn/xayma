import {
  Injectable,
  Inject,
  UnauthorizedException,
  Post,
  BadRequestException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { ProfileRepository } from "database/repositorys/Profile";
import { UserRepository } from "database/repositorys/User";
import { Request } from "express";

@Injectable()
export class UserService {
  @Inject(REQUEST) private readonly request: Request;
  @Inject() private repository: UserRepository;
  @Inject() private profileRepository: ProfileRepository;

  async add(params: any) {
    if (!["admin", "agent"].includes(params.profile)) {
      throw new BadRequestException("profile_profile_is_not_acceptable");
    }

    const user = await this.repository._create({
      ...params,
      password: undefined,
      id: undefined,
    });
    const profile = await this.profileRepository._create({
      user,
      client: this.request.metadata.client,
      profile: params.profile,
    });

    delete profile.client.profiles;

    return profile;
  }

  async update(params: any) {
    const user = await this.repository._create({
      ...params,
      password: undefined,
    });

    delete user.password;
    return {};
  }

  async list(params: any) {
    const users = await this.repository._find({
      password: params.password,
      id: this.request.session.user.id,
    });

    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async updateMe(params: any) {
    const user = await this.repository._create({
      ...params,
      id: this.request.session.user.id,
    });

    delete user.password;
    return user;
  }
}
