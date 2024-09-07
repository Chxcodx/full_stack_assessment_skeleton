import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for localhost React app
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from React app on localhost:3000
    methods: 'GET,POST,PUT,DELETE,PATCH', // Allow specific methods
    credentials: true, // Enable sending cookies
  });

  await app.listen(3000);
}
bootstrap();
