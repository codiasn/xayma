import { Injectable, Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Application } from "database/entitys/Application";
import { ApplicationRepository } from "database/repositorys/Application";
import { Request } from "express";

@Injectable()
export class ApplicationService {
  @Inject(REQUEST) private readonly request: Request;
  @Inject() private repository: ApplicationRepository;

  async create(params: Partial<Application>) {
    const application = await this.repository._create(
      params,
      this.request.metadata.client,
    );
    return application;
  }

  async remove(id: string) {
    const applications = await this.repository._remove(
      id,
      this.request.metadata.client,
    );
    return applications;
  }

  async list(params: { [key: string]: string }) {
    const applications = await this.repository._find({
      ...params,
      client: this.request.metadata.client.id,
    });
    return applications;
  }
}
