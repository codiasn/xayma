import {
  Controller,
  Get,
  Inject,
  Body,
  Post,
  Param,
  Delete,
} from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { HasProfiles, Public } from "decorators/index";

@Controller()
export class ApplicationController {
  constructor() {}

  @Inject() private readonly service: ApplicationService;

  @HasProfiles("owner", "admin")
  @Post()
  async create(@Body() body: any) {
    return await this.service.create(body);
  }

  @Get("/:id")
  async get(@Param("id") id: string) {
    return (await this.service.list({ id }))[0];
  }

  @Post("/list")
  async list(@Body() body: any) {
    return await this.service.list(body);
  }

  @Delete("/:id")
  @HasProfiles("owner", "admin")
  async remove(@Param("id") id: string) {
    return await this.service.remove(id);
  }
}
