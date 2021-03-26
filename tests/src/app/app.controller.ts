import { Controller, Post, UseFilters, UseInterceptors } from "@nestjs/common";

import { Field, File, ParseAsyncResults } from "@quicksend/transmit";

import { Fields, Files, TransmitExceptionFilter, TransmitInterceptor } from "../../../src";

@Controller()
export class AppController {
  @Post("upload")
  @UseInterceptors(TransmitInterceptor())
  @UseFilters(TransmitExceptionFilter)
  upload(@Fields() fields: Field[], @Files() files: File[]): ParseAsyncResults {
    return {
      fields,
      files
    };
  }
}
