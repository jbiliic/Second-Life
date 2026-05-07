import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma/prisma.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ContentTypeMiddleware } from './common/middleware/content-type.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ListingsModule } from './modules/listings/listings.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronRelistModule } from './modules/cronRelist/cronRelist.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../../.env',
            isGlobal: true,
        }),
        ThrottlerModule.forRoot([
            {
                name: 'default',
                ttl: 60000,
                limit: 100,
            },
        ]),
        ScheduleModule.forRoot(),
        PrismaModule,
        AuthModule,
        CompaniesModule,
        ListingsModule,
        CronRelistModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: 'APP_GUARD',
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware, ContentTypeMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
