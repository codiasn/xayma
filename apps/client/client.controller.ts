import { Controller, Inject, Body, Post, UseGuards } from "@nestjs/common";
import { ClientService } from "./client.service";
import { Public } from "decorators/index";

@Controller()
export class ClientController {
  constructor() {}

  @Inject() private readonly service: ClientService;

  @Public()
  @Post()
  async update(@Body() body: any) {
    return await this.service.update(body);
  }
}
