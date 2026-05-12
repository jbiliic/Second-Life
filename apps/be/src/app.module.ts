import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentTypeMiddleware } from './common/middleware/content-type.middleware';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { CronRelistModule } from './modules/cronRelist/cronRelist.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ListingsModule } from './modules/listings/listings.module';

@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async () => ({
                store: redisStore,
                url: process.env.REDIS_URL,
                ttl: 1000 * 60 * 5, // 5 minutes default
            }),
        }),
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
