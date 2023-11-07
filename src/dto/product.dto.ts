import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID, Validate, isBase64 } from "class-validator";
import { isBuffer } from "util";

export class AddorUpdateCategoryDto {

    @ApiProperty({
        description: 'category Id',
        example: 'pde7e-eygy87-dge7',
    })
    @IsNotEmpty()
    @IsString()
    category_id: string;

    @ApiProperty({
        description: 'Category Name',
        example: 'Leather',
    })
    @IsNotEmpty()
    @IsString()
    category_name: string;


    @ApiProperty({
        description: 'category descripton',
        example: 'category description',
    })
    @IsNotEmpty()
    @IsString()
    category_description: string;

    @ApiProperty({
        description: 'category features',
        example: 'category features',
    })
    @IsNotEmpty()
    @IsString()
    category_features: string;

    @ApiProperty({
        description: 'category_image_id',
        example: 'uhfd-88fhu-hd77',
    })
    @IsNotEmpty()
    @IsUUID()
    category_image_id: string;

}


export class AddorUpdateProductDto {

    @ApiProperty({
        description: 'Product Code',
        example: 'PA76D',
    })
    @IsNotEmpty()
    @IsString()
    product_code: string;

    @ApiProperty({
        description: 'Product Id',
        example: 'pde7e-eygy87-dge7',
    })
    @IsNotEmpty()
    @IsString()
    product_id: string;

    @ApiProperty({
        description: 'Product Quantity',
        example: 10,
    })
    @IsNotEmpty()
    @IsString()
    product_quantity: number;

    @ApiProperty({
        description: 'Product description',
        example: 'product description',
    })
    @IsNotEmpty()
    @IsString()
    product_description: string;

    @ApiProperty({
        description: 'product_about',
        example: 'product_about',
    })
    @IsNotEmpty()
    @IsString()
    product_about: string;

    @ApiProperty({
        description: 'Product color name',
        example: 'BLACK',
    })
    @IsNotEmpty()
    @IsString()
    product_color_name: string;

    @ApiProperty({
        description: 'Product features',
        example: 'product features',
    })
    @IsNotEmpty()
    @IsString()
    product_features: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: ' category_id',
        example: 'uhfd-88fhu-hd77',
    })
    @IsNotEmpty()
    @IsUUID()
    category_id: string;

    @ApiProperty({
        description: 'subcategory_id',
        example: 'uhfd-88fhu-hd77',
    })
    @IsNotEmpty()
    @IsUUID()
    subcategory_id: string;

    @ApiProperty({
        description: 'product_image_id',
        example: 'uhfd-88fhu-hd77',
    })
    @IsNotEmpty()
    @IsUUID()
    product_image_id: string;

    @ApiProperty({
        description: 'product_color',
        example: '#ffff',
    })
    @IsNotEmpty()
    @IsString()
    product_color: string;


    @ApiProperty({
        description: 'product_size',
        example: 'uhfd-88fhu-hd77',
    })
    @IsNotEmpty()
    @IsString()
    product_size: string;

    @ApiProperty({
        description: 'product_mrp',
        example: 300,
    })
    @IsNotEmpty()
    @IsString()
    product_mrp: number;

    @ApiProperty({
        description: 'product_selling_price',
        example: 300,
    })
    @IsNotEmpty()
    @IsString()
    product_selling_price: number;

}

export class AddorUpdateSubCategoryDto {

    @ApiProperty({ description: 'category Id', example: 'pde7e-eygy87-dge7', })
    @IsNotEmpty()
    @IsString()
    category_id: string;

    @ApiProperty({ description: 'sub_category_id', example: 'pde7e-eygy87-dge7', })
    @IsNotEmpty()
    @IsString()
    sub_category_id: string;

    @ApiProperty({ description: 'sub-category Name', example: 'Leather', })
    @IsNotEmpty()
    @IsString()
    subcategory_name: string;

    @ApiProperty({ description: 'subcategory descripton', example: 'subcategory description', })
    @IsNotEmpty()
    @IsString()
    subcategory_description: string;

    @ApiProperty({ description: 'subcategory_image_id', example: 'uhfd-88fhu-hd77' })
    @IsNotEmpty()
    @IsUUID()
    subcategory_image_id: string;
}


export class AddtoCartDto {

    @ApiProperty({ description: 'product_id Id', example: 'pde7e-eygy87-dge7', })
    @IsNotEmpty()
    @IsString()
    product_id: string;

    @ApiProperty({ description: 'user_id', example: 'pde7e-eygy87-dge7', })
    @IsNotEmpty()
    @IsString()
    user_id: string;

    @ApiProperty({ description: 'quantity', example: 5, })
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

export class AddReviewDto {

    @ApiProperty({ description: 'product_id Id', example: 'pde7e-eygy87-dge7', })
    @IsNotEmpty()
    @IsString()
    product_id: string;

    @ApiProperty({ description: 'user_id', example: 'pde7e-eygy87-dge7', })
    @IsNotEmpty()
    @IsString()
    user_id: string;

    @ApiProperty({ description: 'product rating', example: 5, })
    @IsNotEmpty()
    @IsNumber()
    rating: number;

    @ApiProperty({ description: 'product review', example: 'this product is so good.', })
    @IsNotEmpty()
    @IsString()
    review: string;
}
