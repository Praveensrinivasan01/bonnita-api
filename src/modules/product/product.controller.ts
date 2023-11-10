import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import * as fs from 'fs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddorUpdateProductDto, AddorUpdateCategoryDto, AddorUpdateSubCategoryDto, AddtoCartDto, AddReviewDto } from 'src/dto/product.dto';

@Controller('product')
@ApiTags('PRODUCT')
export class ProductController {

    constructor(protected productService: ProductService) { }


    @Post('upload-image')
    @UseInterceptors(FileInterceptor('image'))
    async uploadFile(@UploadedFile() file) {
        console.log(file)
        const imageData = fs.readFileSync(file.path);
        const imageDataBase64 = "data:image/jpeg;base64," + imageData.toString('base64');
        return await this.productService.uploadImage(imageDataBase64, file)
        return
    }


    @Post('upload-product-image/:image_id')
    @UseInterceptors(FilesInterceptor('files[]', 4))
    async uploadProductImage(@UploadedFiles() file, @Param("image_id") image_id: any) {
        // console.log(file)
        return await this.productService.uploadProductImage(file, image_id)
    }


    @Get('get-image/:image_id')
    async getImage(@Param("image_id") image_id: string, @Res() res: any) {
        try {
            const image = await this.productService.getImage(image_id)
            if (image) {
                res.setHeader('Content-Type', 'image/jpeg');
                res.end(image.imageData, 'binary');
            } else {
                res.end()
            }
        } catch (e) {
            console.log(e)
            res.status(500).send("error while fetching the image")
        }
    }

    @Post('make-payment')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: AddorUpdateProductDto })
    @ApiResponse({ status: 200, description: 'Product added successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async makepayment(@Body() makepayments) {
        return await this.productService.makepayment(makepayments);
    }


    @Post('add-product')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: AddorUpdateProductDto })
    @ApiResponse({ status: 200, description: 'Product added successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async addProduct(@Body() productDto: Omit<AddorUpdateProductDto, 'product_id'>) {
        return await this.productService.addProduct(productDto);
    }

    @Put('update-product')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: AddorUpdateProductDto })
    @ApiResponse({ status: 200, description: 'Product updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async updateProduct(@Body() productDto: AddorUpdateProductDto) {
        return await this.productService.updateProduct(productDto);
    }

    @Delete('delete-product/:id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Product deleted successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
    }

    @Get('get-all-products')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the products' })
    @ApiResponse({ status: 200, description: 'fetched all products Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getAllProduct() {
        return this.productService.getAllProduct();
    }

    @Get('get-products/:sub_category_id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the products' })
    @ApiResponse({ status: 200, description: 'fetched all products for a subcategory Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getProduct(
        @Param('sub_category_id', ParseUUIDPipe) sub_category_id: string
    ) {
        return this.productService.getProduct(sub_category_id);
    }

    @Post('add-category')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: AddorUpdateCategoryDto })
    @ApiResponse({ status: 200, description: 'Category added successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async addCategory(@Body() addCategoryDto: Omit<AddorUpdateCategoryDto, 'category_id'>) {
        return await this.productService.addCategory(addCategoryDto);
    }

    @Put('update-category')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: AddorUpdateCategoryDto })
    @ApiResponse({ status: 200, description: 'Category updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async updateCategory(@Body() categoryDto: AddorUpdateCategoryDto) {
        return await this.productService.updateCategory(categoryDto);
    }

    @Delete('delete-category/:id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Category deleted successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async deleteCategory(@Param('id') id: string) {
        return await this.productService.deleteCategory(id);
    }

    @Post('add-subcategory')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: AddorUpdateSubCategoryDto })
    @ApiResponse({ status: 200, description: 'Sub Category added successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async addSubCategory(@Body() addSubCategory: Omit<AddorUpdateSubCategoryDto, 'sub_category_id'>) {
        return await this.productService.addSubCategory(addSubCategory);
    }

    @Post('update-subcategory')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: AddorUpdateSubCategoryDto })
    @ApiResponse({ status: 200, description: 'Sub Category updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async updateSubCategory(@Body() subCategoryDto: AddorUpdateSubCategoryDto) {
        return await this.productService.updateSubCategory(subCategoryDto);
    }

    @Delete('delete-subcategory/:id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Sub Category deleted successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async deleteSubCategory(@Param('id') id: string) {
        return await this.productService.deleteSubCategory(id);
    }

    @Get('get-all-subcategory')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the subcategory' })
    @ApiResponse({ status: 200, description: 'fetched all products Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getAllSubCategory() {
        return this.productService.getAllSubCategory();
    }

    @Get('get-subcategories/:category_id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the subcategory' })
    @ApiResponse({ status: 200, description: 'fetched all sub category for a category Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getSubCategory(
        @Param('category_id', ParseUUIDPipe) category_id: string
    ) {
        return this.productService.getSubCategory(category_id);
    }

    @Get('product-mapping/:product_id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get the products with mapping' })
    @ApiResponse({ status: 200, description: 'fetched all products with mapping Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async productMapping(
        @Param('product_id', ParseUUIDPipe) product_id: string
    ) {
        return this.productService.productMapping(product_id);
    }

    @Get('color-mapping/:product_id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get the products with mapping' })
    @ApiResponse({ status: 200, description: 'fetched all products with mapping Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async colorMapping(
        @Param('product_id', ParseUUIDPipe) product_id: string
    ) {
        return this.productService.colorMapping(product_id);
    }

    @Get('category-mapping')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get the category/subcategory with mapping' })
    @ApiResponse({ status: 200, description: 'fetched all category with mapping Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async categoryMapping() {
        return this.productService.categoryMapping();
    }

    @Get('get-all-favourites/:user_id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the favourites' })
    @ApiResponse({ status: 200, description: 'fetched all favourites Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getAllFavourites(
        @Param('user_id', ParseUUIDPipe) user_id: string
    ) {
        return this.productService.getAllFavourites(user_id);
    }

    @Post('add-favourites/:user_id/:product_id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'added to favourites successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async addToFavourites(
        @Param('user_id', ParseUUIDPipe) user_id: string,
        @Param('product_id', ParseUUIDPipe) product_id: string
    ) {
        return await this.productService.addToFavourites(user_id, product_id);
    }

    @Delete('delete-favourites/:user_id/:product_id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'removed from favourites successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async removeFromFavourites(
        @Param('user_id', ParseUUIDPipe) user_id: string,
        @Param('product_id', ParseUUIDPipe) product_id: string) {
        return await this.productService.removeFromFavourites(user_id, product_id);
    }

    @Get('get-all-cart/:user_id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the cart of a customer' })
    @ApiResponse({ status: 200, description: 'fetched all cart Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getAllCart(
        @Param('user_id', ParseUUIDPipe) user_id: string
    ) {
        return this.productService.getAllCart(user_id);
    }

    @Post('add-cart')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'added to cart successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async addToCart(
        @Body() cartDto: AddtoCartDto
    ) {
        return await this.productService.addToCart(cartDto);
    }

    @Delete('delete-cart/:user_id/:product_id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'removed from favourites successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async removeFromCart(
        @Param('user_id', ParseUUIDPipe) user_id: string,
        @Param('product_id', ParseUUIDPipe) product_id: string) {
        return await this.productService.removeFromCart(user_id, product_id);
    }

    @Post('add-review')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'review added successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async addReview(
        @Body() reviewDto: AddReviewDto
    ) {
        return await this.productService.addReview(reviewDto);
    }

    @Get('get-latest-products')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get the latest products' })
    @ApiResponse({ status: 200, description: 'latest product fetched Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getLatestProducts() {
        return this.productService.getLatestProducts();
    }

    @Get('get-review/:product_id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get the latest products' })
    @ApiResponse({ status: 200, description: 'latest product fetched Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async reviewMapping(
        @Param("product_id") product_id: string
    ) {
        return this.productService.reviewMapping(product_id);
    }

    @Post('get-all-category')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the category' })
    @ApiResponse({ status: 200, description: 'fetched all category Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getAllCategory() {
        return this.productService.getAllCategory();
    }

    @Post('shop-mapping')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To map the shopping items' })
    @ApiResponse({ status: 200, description: 'fetched all shop items Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async shopMapping(
        @Query('category') category: string,
        @Query('subcategory') subcategory: string,
        @Query('search') search: string,
        @Query('price') price: string,
        @Query('offset') offset: string,
    ) {
        return this.productService.shopMapping(category, subcategory, search, price, offset);
    }

}
