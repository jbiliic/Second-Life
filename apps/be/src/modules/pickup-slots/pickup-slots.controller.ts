import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CreatePickupSlotDto } from './dto/createPickupSlot.dto';
import { PickupSlotsService } from './pickup-slots.service';

@Controller('listings/:id/pickup-slots')
export class PickupSlotsController {
    constructor(private readonly pickupService: PickupSlotsService) {}

    @Get()
    getSlots(@Param('id') listingId: string) {
        return this.pickupService.getPickupSlots(listingId);
    }

    @Post()
    createSlot(@Param('id') listingId: string, @Req() req: any, @Body() dto: CreatePickupSlotDto) {
        return this.pickupService.createPickupSlot(listingId, req.user.companyId, dto);
    }
}
