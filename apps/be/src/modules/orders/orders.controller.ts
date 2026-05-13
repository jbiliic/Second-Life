import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderStatusDto } from './dto/updateOrderStatus.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    create(@Req() req: any, @Body() dto: CreateOrderDto) {
        return this.ordersService.createOrder(req.user.companyId, dto);
    }

    @Get('my')
    getMyOrders(@Req() req: any) {
        return this.ordersService.getMyOrders(req.user.companyId);
    }

    @Get(':id')
    getById(@Req() req: any, @Param('id') id: string) {
        return this.ordersService.getOrderById(id, req.user.companyId);
    }

    @Patch(':id/status')
    updateStatus(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
        return this.ordersService.updateOrderStatus(id, req.user.companyId, dto);
    }
}
