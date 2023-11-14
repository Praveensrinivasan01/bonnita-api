import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ENUM_Query } from "src/enum/common.enum";

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

export class UpdateQueryDto {

    @ApiProperty({
        description: 'Query-Id',
        example: 'jjvh0-bchd8-88dvh',
    })
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsEnum(ENUM_Query)
    @ApiProperty({
        description: '',
        example: 'completed',
    })
    status: ENUM_Query;
}