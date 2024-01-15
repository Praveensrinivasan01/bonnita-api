import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ENUM_PAYMENT_METHOD, ENUM_PaymentStatus } from "src/enum/common.enum";

export class AddorUpdatePaymentDetails {

    @ApiProperty({ description: 'order Id', example: 'pde7e-eygy87-dge7', })
    @IsNotEmpty()
    order_id: string;

    @ApiProperty({ description: 'order Id', example: 'pde7e-eygy87-dge7', })
    @IsNotEmpty()
    user_id: string;

    @ApiProperty({ description: 'order Id', example: 'pde7e-eygy87-dge7', })
    @IsNotEmpty()
    @IsUUID()
    cashfree_id: string;

    @ApiProperty({ description: 'total ', example: 3000, })
    @IsNotEmpty()
    amount: number;

    @ApiProperty({ description: 'quantity', example: 3, })
    @IsNotEmpty()
    raw_response: string;

    // @ApiProperty({ description: 'quantity', example: 3, })
    // @IsNotEmpty()
    // payment_method: string;

    @IsNotEmpty()
    @ApiProperty({
        description: '',
        example: 'completed',
    })
    status: string;


}