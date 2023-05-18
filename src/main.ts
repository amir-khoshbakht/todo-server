import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { LoggingInterceptor } from './logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Setup Swagger Api
  const configService = app.get<ConfigService>(ConfigService);
  const config = new DocumentBuilder()
    .setTitle(configService.get('APP_NAME', 'ERR'))
    .setDescription(configService.get('APP_DESCRIPTION', '---'))
    .setVersion(configService.get('APP_VERSION', '---'))
    .setContact('contact', 'www.w.w', 'email@email.email')
    .setLicense(
      configService.get('APP_LICENSE', '---'),
      configService.get('APP_LICENSE_URL', '---'),
    )
    .addBearerAuth()
    .build();

  // Register Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Register interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/help', app, document);

  const port: number = configService.get('PORT', 8000);
  await app.listen(port, () => {
    Logger.debug(`Docs: http://localhost:${port}/${globalPrefix}`);
  });
}
bootstrap();
