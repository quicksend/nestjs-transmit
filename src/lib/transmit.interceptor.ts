import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
  Type,
  mixin
} from "@nestjs/common";

import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Transmit, TransmitOptions } from "@quicksend/transmit";

import { TRANSMIT_MODULE_OPTIONS } from "./transmit.constants";

import { TransmitModuleOptions } from "./transmit.interfaces";

export const TransmitInterceptor = (
  transmitOptions: Partial<TransmitOptions> = {}
): Type<NestInterceptor> => {
  class MixinInterceptor implements NestInterceptor {
    constructor(
      @Inject(TRANSMIT_MODULE_OPTIONS)
      private readonly transmitOptions: TransmitModuleOptions
    ) {}

    async intercept(ctx: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
      const req = ctx.switchToHttp().getRequest();

      const transmit = new Transmit({
        ...this.transmitOptions,
        ...transmitOptions
      });

      const { fields, files } = await transmit.parseAsync(req);

      req.fields = fields;
      req.files = files;

      return next.handle().pipe(
        catchError(async (error) => {
          // Rollback uploads if an error is thrown after the interceptor
          await transmit.deleteUploadedFiles();

          throw error;
        })
      );
    }
  }

  return mixin(MixinInterceptor);
};
