import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieparser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "node:path";
import helmet from "helmet";
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  
  //security
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, 
      max: 200, 
      standardHeaders: true, 
      legacyHeaders: false, 
    }),
  );
  

  app.use(cookieparser());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
