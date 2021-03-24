import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";

import { TransmitModule } from "../../../src";

@Module({
  imports: [TransmitModule.register()],
  controllers: [AppController]
})
export class AppModule {}
