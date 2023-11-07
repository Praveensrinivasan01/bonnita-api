import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class AddOrUpdateOrderDto {

    @ApiProperty({ description: 'order Id', example: 'pde7e-eygy87-dge7', })
    @IsNotEmpty()
    order_id: string;

    @ApiProperty({ description: 'order Id', example: 'pde7e-eygy87-dge7', })
    @IsNotEmpty()
    @IsUUID()
    user_id: string;

    @ApiProperty({ description: 'total ', example: 3000, })
    @IsNotEmpty()
    total_amount: number;

    @ApiProperty({ description: 'quantity', example: 3, })
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ description: 'product code', example: 'pde7e-eygy87-dge7', })
    @IsNotEmpty()
    productdetails: any[];

    @ApiProperty({ description: 'payment code', example: 'pde7e-eygy87-dge7', })
    @IsNotEmpty()
    mode_of_payment: string;

    @ApiProperty({ description: 'order status', example: 'pde7e-eygy87-dge7', })
    @IsNotEmpty()
    status: string;
}