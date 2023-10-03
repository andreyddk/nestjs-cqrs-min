/** @format */

import {
  Controller,
  Get,
  Inject,
  Logger,
  LoggerService,
  Module,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  CqrsModule,
  IQueryHandler,
  QueryBus,
  QueryHandler,
} from '@nestjs/cqrs';

// Base use case, for example;
namespace SomeUseCase {
  export type Output = {
    statusCode: number;
    message: string;
  };

  export class Query {
    readonly message: string;

    constructor(props: Partial<Query>) {
      Object.assign(this, props);
    }
  }

  @QueryHandler(Query)
  export class Handler
    implements IQueryHandler<Query, Output>
  {
    constructor(
      @Inject() private readonly Logger: LoggerService
    ) {}
    execute(query: Query): Promise<Output> {
      return Promise.resolve({
        statusCode: 200,
        message: query.message,
      });
    }
  }
}

@Controller()
class SomeController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  sayHello(): Promise<SomeUseCase.Output> {
    return this.queryBus.execute<
      SomeUseCase.Query,
      SomeUseCase.Output
    >(new SomeUseCase.Query({ message: 'Hello' }));
  }
}

@Module({
  imports: [CqrsModule],
  controllers: [SomeController],
  providers: [SomeUseCase.Handler],
})
class AppModule {}

const main = async () => {
  const APP_PORT = 1111;

  const app = await NestFactory.create(AppModule);

  await app.listen(APP_PORT);

  console.log(
    'App started at: http://localhost:%s',
    APP_PORT
  );

  const controller = app.get(SomeController);

  const message = await controller.sayHello();

  console.log('Message is:', message);
};

main().catch(console.error);
