import { Controller, Post, UseInterceptors } from "@nestjs/common";

import { Field, File, ParseAsyncResults } from "@quicksend/transmit";

import { Fields, Files, TransmitInterceptor } from "../../../src";

@Controller()
export class AppController {
  @Post("upload")
  @UseInterceptors(TransmitInterceptor())
  upload(@Fields() fields: Field[], @Files() files: File[]): ParseAsyncResults {
    return {
      fields,
      files
    };
  }
}
