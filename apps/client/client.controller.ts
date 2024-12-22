import { Controller, Inject, Body, Post, UseGuards, Get } from "@nestjs/common";
import { ClientService } from "./client.service";
import { Public } from "decorators/index";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Controller()
export class ClientController {
  constructor() {}

  @Inject() private readonly service: ClientService;
  @Inject(REQUEST) private readonly request: Request;

  @Get()
  async get() {
    return this.request.metadata.client;
  }

  @Post()
  async update(@Body() body: any) {
    return await this.service.update(body);
  }
}
