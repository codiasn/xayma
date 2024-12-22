import {
  Controller,
  Get,
  Inject,
  Body,
  Post,
  Query,
  NotFoundException,
} from "@nestjs/common";
import { SessionService } from "./session.service";
import { Public } from "decorators/index";
import { verify } from "utils/jwt";
import { UserRepository } from "database/repositorys/User";

@Controller()
export class SessionController {
  constructor() {}

  @Inject() private readonly service: SessionService;
  @Inject() private readonly userRepository: UserRepository;

  @Public()
  @Post("init")
  async init(@Body() body: any) {
    return await this.service.init(body);
  }

  @Public()
  @Post("register")
  async register(@Body() body: any) {
    return await this.service.register(body);
  }

  @Public()
  @Post("login")
  async login(@Body() body: any) {
    return await this.service.login(body);
  }

  @Public()
  @Post("confirm-identity")
  async confirmIdentity(@Query("token") token: string) {
    const decoded = verify(token) as { id: string };

    const user = await this.userRepository._findOne({ id: decoded.id });
    if (!user) throw new NotFoundException("user_not_found");

    await this.userRepository._create({
      id: decoded.id,
      confirmedIdentity: true,
    });

    return await this.service.confirmIdentity(token);
  }

  @Post("logout")
  async logout() {
    return await this.service.logout();
  }

  @Post("request-reset-password")
  async requestPasswordReset(@Body() body: any) {
    return await this.service.requestPasswordReset(body);
  }

  @Post("reset-password")
  async resetPassword(@Body() body: any) {
    return await this.service.resetPassword(body);
  }
}
