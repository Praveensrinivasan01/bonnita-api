import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { QueryDto, UpdateQueryDto } from 'src/dto/query.dto';
import { E_BannerImage } from 'src/entities/landing-page/banner-image.entity';
import { E_ProductCartItem } from 'src/entities/order-management/cart-item.entity';
import { E_ProductCategory } from 'src/entities/product-management/category.entity';
import { E_ProductFavourites } from 'src/entities/product-management/favourites.entity';
import { E_Image } from 'src/entities/product-management/image.entity';
import { E_ProductImage } from 'src/entities/product-management/product-image.entity';
import { E_Product } from 'src/entities/product-management/product.entity';
import { E_ProductReview } from 'src/entities/product-management/review.entity';
import { E_ProductSubCategory } from 'src/entities/product-management/subcategory.entity';
import { E_Query } from 'src/entities/users-management/query.entity';
import { E_WhyUs } from 'src/entities/why-us/why-us.entity';
import { ENUM_Query } from 'src/enum/common.enum';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class LandingpageService {

    constructor(
        @InjectRepository(E_Product)
        protected productRepository: Repository<E_Product>,
        @InjectRepository(E_ProductCategory)
        protected categoryRepository: Repository<E_ProductCategory>,
        @InjectRepository(E_ProductSubCategory)
        protected subCategoryRepository: Repository<E_ProductSubCategory>,
        @InjectRepository(E_ProductFavourites)
        protected favouritesRepository: Repository<E_ProductFavourites>,
        @InjectRepository(E_Image)
        protected imageRepository: Repository<E_Image>,
        @InjectRepository(E_ProductImage)
        protected productImageRepository: Repository<E_ProductImage>,
        @InjectDataSource()
        protected dataSource: DataSource,
        @InjectRepository(E_ProductCartItem)
        private cartRepository: Repository<E_ProductCartItem>,
        @InjectRepository(E_ProductReview)
        private reviewRepository: Repository<E_ProductReview>,
        @InjectRepository(E_Query)
        private queryRepository: Repository<E_Query>,
        @InjectRepository(E_BannerImage)
        private bannerImageRepository: Repository<E_BannerImage>,
        @InjectRepository(E_WhyUs)
        private whyUsRepository: Repository<E_WhyUs>,
    ) { }


    async getAllCategory() {
        try {
            const category = await this.dataSource.query(`select tc."name",tc.description,ti."imageData",tc.id as category_id  
            from tblproduct_category tc 
            join tblimage ti on ti.id = tc.image_id limit 5`)
            if (!category.length) { console.log("no category for now, please add some."); return { statusCode: 400, message: "no category for now, please add some." } }
            return {
                statusCode: 200,
                message: "all category fetched successfully",
                data: category
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }


    async getNewArrivals() {
        try {
            const newArrivals = await this.dataSource.query(`select distinct on (t.name) t.id,t."name",'new' as new,ti.id as product_image_id,ti."front_side",coalesce (cast(round(avg(tr.rating)) as int),5)  as rating, 
            t.mrp ,t.selling_price,t.description  ,
            jsonb_build_object('OuterShell',t.code,'SKU',t.code,'color',t.color,'Lining',t.color) as Information
     from tblproduct t  
                 join tblproduct_image ti on ti.id = t.image_id 
                 left join tblproduct_review tr on tr.product_id = t.id
                 group by t.id,ti."id",tr.product_id  order by t.name,t.createdat desc limit 4`)
            if (!newArrivals.length) { console.log("no newArrivals for now, please add some."); return { statusCode: 400, message: "no newArrivals for now, please add some." } }
            return {
                statusCode: 200,
                message: "all newArrivals fetched successfully",
                data: newArrivals
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async getBestSellers() {
        try {
            const bestSeller = await this.dataSource.query(`select distinct on (t.name) td.id as "order_id",t.id,t."name",'best' as new,ti.id as "product_image_id",
            ti."front_side",
            coalesce (cast(round(avg(tr.rating)) as int),5)  as rating, 
                        t.mrp ,t.selling_price,t.description ,
                        jsonb_build_object('OuterShell',t.code,'SKU',t.code,'color',t.color,'Lining',t.color) as Information
                 from tblproduct t  
                             join tblproduct_image ti on ti.id = t.image_id 
                             left join tblproduct_review tr on tr.product_id = t.id
                             left join tblorder_item tt on tt.product_id = t.id 
                             left join tblorder_details td on td.id = tt.order_id
                             group by t.id,ti."id",td.id order by t.name,td.total desc limit 4`)
            if (!bestSeller.length) { console.log("no bestSeller for now, please add some."); return { statusCode: 400, message: "no bestSeller for now, please add some." } }
            return {
                statusCode: 200,
                message: "all bestSeller fetched successfully",
                data: bestSeller
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async getCustomerFeedBacks() {
        try {
            const customerFeedBacks = await this.dataSource.query(`select tr.review ,concat(t.firstname,' ',t.lastname) as customername,tr.rating   from tblproduct_review tr join tbluser t on t.id = tr.user_id  order by tr.rating desc limit 3`)
            if (!customerFeedBacks.length) { console.log("no customerFeedBacks for now, please add some."); return { statusCode: 400, message: "no customerFeedBacks for now, please add some." } }
            return {
                statusCode: 200,
                message: "all customerFeedBacks fetched successfully",
                data: customerFeedBacks
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }


    async postQuery(queryDto: QueryDto) {
        try {

            const newQuery = new E_Query();
            newQuery.name = queryDto.name;
            newQuery.email = queryDto.email
            newQuery.mobile = queryDto.mobile
            newQuery.query = queryDto.query;
            newQuery.comments = queryDto.comments;

            await this.queryRepository.save(newQuery);

            return {
                statusCode: 200,
                message: "query posted successfully",
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async updateQuery(queryDto: UpdateQueryDto) {
        try {

            const checkQuery = await this.queryRepository.findOne({ where: { id: queryDto.id } })

            if (!checkQuery) {
                return {
                    statusCode: 400,
                    message: "no query found",
                }
            }

            await this.queryRepository.update({ id: checkQuery.id }, { status: queryDto.status });

            return {
                statusCode: 200,
                message: "query update successfully",
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async getQuery(status, offset) {
        try {
            const query = await this.dataSource.query(`select * from tblquery where status = '${status}' offset ${offset ? offset : 0} limit 15 `)

            if (!query.length) {
                return {
                    statusCode: 400,
                    message: "no query found",
                }
            }
            return {
                statusCode: 200,
                message: "query update successfully",
                data: query
            }
        } catch (error) {
            console.log(error)
            return CommonService.error(error)
        }
    }

    async uploadImage(imageData, file) {
        try {
            const newImage = new E_BannerImage();
            newImage.mimetype = file.mimetype;
            newImage.size = file.size;
            newImage.path = file.path;
            newImage.imageData = imageData;

            const saveImage = await this.bannerImageRepository.save(newImage);

            console.log('saveImage', saveImage);
            return {
                statusCode: 200,
                message: 'image saved successfully',
                image: saveImage,
            };
        } catch (error) {
            console.log(error);
            return CommonService.error(error);
        }
    }

    async getBannerImage(offset) {
        try {
            let bannerImage = []
            bannerImage = await this.bannerImageRepository.find({ skip: offset, take: 15 })
            return {
                statusCode: 200,
                data: bannerImage
            }
        } catch (error) {
            console.log(error);
            return CommonService.error(error);
        }
    }

    async getWhyUsImage() {
        try {
            let whyUsImage = []
            whyUsImage = await this.dataSource.query(`select tw.id,ti.front_side ,ti.back_side ,tw.left_content,tw.right_content,tw.image_id from tblproduct_image ti join tblwhyus tw on tw.image_id = ti.id  `)
            return {
                statusCode: 200,
                data: whyUsImage
            }
        } catch (error) {
            console.log(error);
            return CommonService.error(error);
        }
    }

    async getAllBannerImage() {
        try {
            let bannerImage = []
            bannerImage = await this.bannerImageRepository.find()
            if (bannerImage.length) {
                return {
                    statusCode: 200,
                    data: bannerImage
                }
            } else {
                return {
                    statusCode: 400,
                    message: "no images found"
                }
            }

        } catch (error) {
            console.log(error);
            return CommonService.error(error);
        }
    }

    async deleteBannerImage(image_id) {
        try {
            const bannerImage = await this.bannerImageRepository.findOne({ where: { id: image_id } })

            if (bannerImage) {
                await this.bannerImageRepository.delete({ id: image_id })
                return {
                    statusCode: 200,
                    message: "image deleted successfully"
                }
            } else {
                return {
                    statusCode: 400,
                    message: "image id doesnot exists"
                }
            }

        } catch (error) {
            console.log(error);
            return CommonService.error(error);
        }
    }

}
