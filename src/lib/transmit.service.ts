import { IncomingMessage } from "http";

import { Inject, Injectable } from "@nestjs/common";

import {
  IncomingFile,
  ParseAsyncResults,
  Transmit,
  TransmitManager,
  TransmitOptions,
  TRANSMIT_DEFAULT_OPTIONS
} from "@quicksend/transmit";

import { TRANSMIT_MODULE_OPTIONS } from "./transmit.constants";

import { TransmitModuleOptions } from "./transmit.interfaces";

@Injectable()
export class TransmitService {
  private readonly transmitModuleOptions: TransmitOptions;

  constructor(
    @Inject(TRANSMIT_MODULE_OPTIONS)
    transmitModuleOptions: TransmitModuleOptions
  ) {
    this.transmitModuleOptions = {
      ...TRANSMIT_DEFAULT_OPTIONS,
      ...transmitModuleOptions
    };
  }

  get manager(): TransmitManager {
    return this.transmitModuleOptions.manager;
  }

  async deleteFile(file: IncomingFile): Promise<void> {
    return this.manager.deleteFile(file);
  }

  parseAsync(
    req: IncomingMessage,
    localTransmitOptions: Partial<TransmitOptions> = {}
  ): Promise<ParseAsyncResults> {
    return new Transmit({
      ...this.transmitModuleOptions,
      ...localTransmitOptions
    }).parseAsync(req);
  }
}
