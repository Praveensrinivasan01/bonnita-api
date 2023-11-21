import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LandingpageService } from './landingpage.service';
import { QueryDto, UpdateQueryDto } from 'src/dto/query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
@Controller('landingpage')
@ApiTags("LANDING PAGE")
export class LandingpageController {

    constructor(protected readonly landingPageService: LandingpageService) { }


    @Post('get-all-category')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the category' })
    @ApiResponse({ status: 200, description: 'fetched all category Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getAllCategory() {
        return this.landingPageService.getAllCategory();
    }

    @Post('get-new-arrivals')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the new arrivals' })
    @ApiResponse({ status: 200, description: 'fetched all new arrivals Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getNewArrivals() {
        return this.landingPageService.getNewArrivals();
    }

    @Post('get-best-sellers')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the best seller products' })
    @ApiResponse({ status: 200, description: 'fetched all best sellers Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getBestSellers() {
        return this.landingPageService.getBestSellers();
    }

    @Post('get-feedbacks')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the customer feedbacks products' })
    @ApiResponse({ status: 200, description: 'fetched all feedbacks Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getCustomerFeedBacks() {
        return this.landingPageService.getCustomerFeedBacks();
    }

    @Post('post-query')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the customer feedbacks products' })
    @ApiResponse({ status: 200, description: 'fetched all feedbacks Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async postQuery(@Body() postQueryDto: QueryDto) {
        return this.landingPageService.postQuery(postQueryDto);
    }

    @Post('update-query')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the customer feedbacks products' })
    @ApiResponse({ status: 200, description: 'fetched all feedbacks Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async updateQuery(@Body() updateQueryDto: UpdateQueryDto) {
        return this.landingPageService.updateQuery(updateQueryDto);
    }

    @Post('get-query')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the customer feedbacks products' })
    @ApiResponse({ status: 200, description: 'fetched all feedbacks Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getQuery(@Query('offset') offset: string,
        @Query('status') status: string,
    ) {
        return this.landingPageService.getQuery(status, offset);
    }


    @Post('upload-image')
    @UseInterceptors(FileInterceptor('image'))
    async uploadFile(@UploadedFile() file) {
        console.log(file)
        const imageData = fs.readFileSync(file.path);
        const imageDataBase64 = "data:image/jpeg;base64," + imageData.toString('base64');
        return await this.landingPageService.uploadImage(imageDataBase64, file)
        return
    }

    @Post('get-banner-image')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the banner images' })
    @ApiResponse({ status: 200, description: 'fetched all images Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getBannerImage(
        @Query("offset") offset: string
    ) {
        return this.landingPageService.getBannerImage(offset);
    }

    @Post('get-all-banner-image')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the banner images' })
    @ApiResponse({ status: 200, description: 'fetched all images Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getAllBannerImage() {
        return this.landingPageService.getAllBannerImage();
    }

    @Post('delete-banner-image/:image_id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'To get all the banner images' })
    @ApiResponse({ status: 200, description: 'fetched all images Successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async deleteBannerImage(
        @Param("image_id") image_id: string
    ) {
        return this.landingPageService.deleteBannerImage(image_id);
    }
}
