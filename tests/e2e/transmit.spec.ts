import { Server } from "http";

import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { TransmitErrorCodes } from "@quicksend/transmit";

import request from "supertest";

import { AppModule } from "../src/app/app.module";

describe("Transmit", () => {
  let server: Server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();

    await app.init();
  });

  afterEach(() => app.close());

  it("should return the uploaded fields and files", async () => {
    const field = {
      name: "hello",
      value: "world"
    };

    const file = {
      field: "file",
      name: "first.txt"
    };

    const response = await request(server)
      .post("/upload")
      .attach(file.field, Buffer.from([]), file.name)
      .field(field.name, field.value);

    expect(response.body).toEqual({
      fields: [expect.objectContaining(field)],
      files: [expect.objectContaining(file)]
    });
  });

  it("should return an http exception", async () => {
    const response = await request(server).post("/upload");

    expect(response.body).toEqual(
      expect.objectContaining({
        message: TransmitErrorCodes.UNSUPPORTED_CONTENT_TYPE,
        statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE
      })
    );
  });
});
