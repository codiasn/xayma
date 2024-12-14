import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigDatabase } from "database";
import { AppController } from "./controller";
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  RouterModule,
} from "@nestjs/core";
import { SessionModule } from "./session/session.module";
import { GlobalInterceptor } from "interceptors/global";
import { UserModule } from "./client/user/user.module";
import { AuthGuard } from "./auth/auth.guard";
import { AuthModule } from "./auth/auth.module";
import { ClientModule } from "./client/client.module";
import routes from "./routes";
import providers from "database/repositorys/providers";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({ ...ConfigDatabase(), autoLoadEntities: true }),

    RouterModule.register(routes),

    AuthModule,
    SessionModule,

    ClientModule,
  ],
  controllers: [AppController],
  providers: [
    ...providers,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: GlobalInterceptor },
    // { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
