# NestJS Transmit

Integrate [Transmit](https://github.com/quicksend/transmit) into your NestJS applications.

## Installation

```bash
$ npm install @quicksend/nestjs-transmit @quicksend/transmit
```

## Usage

### TransmitModule
First start by registering the `TransmitModule` in your application:

```ts
import { Module } from "@nestjs/core";
import { TransmitModule } from "@quicksend/nestjs-transmit";

@Module({
  imports: [
    TransmitModule.register()
  ]
})
export class FilesModule {}
```

You can optionally configure Transmit by passing in [TransmitOptions](https://quicksend.github.io/transmit/interfaces/transmitoptions.html) while registering the module:

```ts
import { Module } from "@nestjs/core";
import { TransmitModule } from "@quicksend/nestjs-transmit";

@Module({
  imports: [
    TransmitModule.register({
      maxFiles: 5,
      maxFileSize: 100 * 1024 * 1024,
    })
  ]
})
export class FilesModule {}
```

`TransmitModule` can also be registered asynchronously like so:

```ts
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/core";
import { TransmitModule } from "@quicksend/nestjs-transmit";

@Module({
  imports: [
    TransmitModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        maxFiles: config.get("MAX_FILES"),
        maxFileSize: config.get('MAX_FILE_SIZE'),
      })
    })
  ]
})
export class FilesModule {}
```

### TransmitInterceptor

Once `TransmitModule` is registered, you can now use `TransmitInterceptor` in your controller to handle file uploads.

You can use the `Fields` and `Files` decorator to retrieve the fields and files that were received.

```ts
import { Controller, Post, UseInterceptors } from "@nestjs/common";

import { Field, File, ParseAsyncResults } from "@quicksend/transmit";

import { Fields, Files, TransmitInterceptor } from "@quicksend/nestjs-transmit";

@Controller()
export class FilesController {
  @Post("upload")
  @UseInterceptors(TransmitInterceptor())
  upload(@Fields() fields: Field[], @Files() files: File[]): ParseAsyncResults {
    return {
      fields,
      files
    };
  }
}
```

You can also pass in [TransmitOptions](https://quicksend.github.io/transmit/interfaces/transmitoptions.html) when using `TransmitInterceptor`. This will allow you to override certain options for a specific endpoint or endpoints.

```ts
import { Controller, Post, UseInterceptors } from "@nestjs/common";

import { Field, File, ParseAsyncResults } from "@quicksend/transmit";

import { Fields, Files, TransmitInterceptor } from "@quicksend/nestjs-transmit";

@Controller()
export class FilesController {
  @Post("upload")
  @UseInterceptors(
    TransmitInterceptor({
      maxFiles: 2,
      maxFileSize: 25 * 1024 * 1024,
    })
  )
  upload(@Fields() fields: Field[], @Files() files: File[]): ParseAsyncResults {
    return {
      fields,
      files
    };
  }
}
```

## Tests

Run tests using the following commands:
```bash
$ npm run test
$ npm run test:watch
```
