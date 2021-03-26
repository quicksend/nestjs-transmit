import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException
} from "@nestjs/common";

import { BaseExceptionFilter } from "@nestjs/core";

import {
  FieldNameTooLargeException,
  FieldValueTooLargeException,
  FileTooLargeException,
  FileTooSmallException,
  NotEnoughFieldsException,
  NotEnoughFilesException,
  TooManyFieldsException,
  TooManyFilesException,
  TooManyPartsException,
  TransmitException,
  UnsupportedContentTypeException
} from "@quicksend/transmit";

@Catch(TransmitException)
export class TransmitExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  catch(exception: TransmitException, host: ArgumentsHost): void {
    switch (exception.constructor) {
      case FieldNameTooLargeException:
      case FieldValueTooLargeException:
      case FileTooLargeException:
        return super.catch(new PayloadTooLargeException(exception.message), host);

      case FileTooSmallException:
      case NotEnoughFieldsException:
      case NotEnoughFilesException:
      case TooManyFieldsException:
      case TooManyFilesException:
      case TooManyPartsException:
        return super.catch(new BadRequestException(exception.message), host);

      case UnsupportedContentTypeException:
        return super.catch(new UnsupportedMediaTypeException(exception.message), host);

      default:
        return super.catch(new InternalServerErrorException(exception.message), host);
    }
  }
}
