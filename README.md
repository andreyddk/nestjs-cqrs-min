# nestjs-cqrs-min
Example provider names in nest ioc

The minimal reproduce:

npm i
npm run watch

After that you will see the error.

[Nest] 84574  - 10/03/2023, 4:52:33 PM   ERROR [ExceptionHandler] Nest can't resolve dependencies of the Handler (?). Please make sure that the argument dependency at index [0] is available in the AppModule context.

Make notice to `Handler` - its possible change name withour renaming class name?
