import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class QueryDto {

    @ApiProperty({
        description: 'User Name',
        example: 'john',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'User Phone Number',
        example: '+13240981234',
    })
    @IsNotEmpty()
    @IsString()
    mobile: string;

    @ApiProperty({
        description: 'User Email',
        example: 'johndoe@gmail.com',
    })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        description: 'Query',
        example: 'sample query',
    })
    @IsNotEmpty()
    @IsString()
    query: string;

    @ApiProperty({
        description: 'Comments',
        example: 'sample comment',
    })
    @IsNotEmpty()
    @IsString()
    comments: string;
}