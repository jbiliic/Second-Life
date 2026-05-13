import { IsOptional, IsIn } from 'class-validator';

export class GetMyListingsDto {
    @IsOptional()
    @IsIn(['active', 'all', 'expired'])
    status?: string;
}
