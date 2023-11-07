import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LandingpageService } from './landingpage.service';

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
    async postQuery() {
        return this.landingPageService.getCustomerFeedBacks();
    }


}
