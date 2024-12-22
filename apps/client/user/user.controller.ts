import { Controller, Get, Inject, Body, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { HasProfiles } from "decorators/index";

@Controller()
export class UserController {
  constructor() {}

  @Inject(REQUEST) private readonly request: Request;
  @Inject() private readonly service: UserService;

  @Get("/me")
  async me() {
    const user = this.request.session.user;
    delete user.password;

    return user;
  }

  @Post("/me")
  async updateMe(@Body() body: any) {
    return await this.service.updateMe(body);
  }

  @Post()
  async list(@Body() body: any) {
    return await this.service.list(body);
  }

  @HasProfiles("owner", "admin")
  @Post("add")
  async add(@Body() body: any) {
    return await this.service.add(body);
  }

  @HasProfiles("owner", "admin")
  @Put("update")
  async update(@Body() body: any) {
    return await this.service.update(body);
  }
}
