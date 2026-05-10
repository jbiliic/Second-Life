import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CronRelistService implements OnModuleInit {
    private readonly logger = new Logger(CronRelistService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly schedulerRegistry: SchedulerRegistry,
    ) {}
    async onModuleInit() {
        await this.loadSchedules();
    }

    async loadSchedules() {
        const schedules = await this.prisma.recurringSchedule.findMany({
            where: { is_active: true },
            include: { listing: true },
        });

        for (const schedule of schedules) {
            await this.registerCronJob(schedule.id);
        }

        this.logger.log(`Loaded ${schedules.length} recurring listing schedules`);
    }

    async registerCronJob(scheduleId: string) {
        const schedule = await this.prisma.recurringSchedule.findUniqueOrThrow({
            where: { id: scheduleId },
            include: { listing: true },
        });

        if (!schedule.is_active || !schedule.listing || !schedule) {
            return;
        }

        const jobName = `relisting_${schedule.id}`;

        if (this.schedulerRegistry.doesExist('cron', jobName)) {
            return;
        }

        const job = new CronJob(schedule.cron_expression, async () => {
            await this.processReListing(schedule.id);
        });

        this.schedulerRegistry.addCronJob(jobName, job);
        job.start();

        this.logger.log(
            `Registered cron job: ${jobName} with expression: ${schedule.cron_expression}`,
        );
    }

    async processReListing(scheduleId: string) {
        const schedule = await this.prisma.recurringSchedule.findUniqueOrThrow({
            where: { id: scheduleId },
            include: { listing: true },
        });

        if (!schedule.is_active || !schedule.listing || !schedule) {
            return;
        }

        this.logger.log(`Running relist for listing: ${schedule.listing_id}`);

        const now = new Date();
        const endDate = new Date(schedule.end_date);

        if (now > endDate) {
            await this.deactivateSchedule(schedule.id);
            return;
        }

        await this.prisma.listing.update({
            where: { id: schedule.listing_id },
            data: {
                is_active: true,
                available_until: endDate,
                updated_at: now,
            },
        });

        this.logger.log(`Relisted listing: ${schedule.listing_id}`);
    }

    async deactivateSchedule(scheduleId: string) {
        await this.prisma.recurringSchedule.update({
            where: { id: scheduleId },
            data: { is_active: false },
        });

        const jobName = `relisting_${scheduleId}`;
        if (this.schedulerRegistry.doesExist('cron', jobName)) {
            this.schedulerRegistry.deleteCronJob(jobName);
            this.logger.log(`Removed expired cron job: ${jobName}`);
        }
    }

    async addSchedule(scheduleId: string) {
        const schedule = await this.prisma.recurringSchedule.findUniqueOrThrow({
            where: { id: scheduleId },
            include: { listing: true },
        });
        await this.registerCronJob(schedule.id);
    }

    async removeSchedule(scheduleId: string) {
        await this.deactivateSchedule(scheduleId);
    }
}
