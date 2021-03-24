import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { Server } from "http";

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
      content: Buffer.from([]),
      field: "file",
      name: "first.txt"
    };

    const response = await request(server)
      .post("/upload")
      .attach(file.field, file.content, file.name)
      .field(field.name, field.value)
      .expect(201);

    expect(response.body).toEqual({
      fields: [expect.objectContaining(field)],
      files: [expect.objectContaining({ name: file.name })]
    });
  });
});
