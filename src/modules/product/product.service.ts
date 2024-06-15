/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import * as fs from 'fs';
import axios from 'axios';
import {
  AddReviewDto,
  AddorUpdateCategoryDto,
  AddorUpdateProductDto,
  AddorUpdateSubCategoryDto,
  AddtoCartDto,
} from 'src/dto/product.dto';
import { E_ProductCategory } from 'src/entities/product-management/category.entity';
import { E_ProductDiscount } from 'src/entities/product-management/discount.entity';
import { E_Image } from 'src/entities/product-management/image.entity';
import { E_Product } from 'src/entities/product-management/product.entity';
import { E_ProductSubCategory } from 'src/entities/product-management/subcategory.entity';
import { DataSource, Repository } from 'typeorm';
import { E_ProductFavourites } from 'src/entities/product-management/favourites.entity';
import { E_ProductCartItem } from 'src/entities/order-management/cart-item.entity';
import { E_ProductReview } from 'src/entities/product-management/review.entity';
import { E_ProductImage } from 'src/entities/product-management/product-image.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(E_Product)
    protected productRepository: Repository<E_Product>,
    @InjectRepository(E_ProductCategory)
    protected categoryRepository: Repository<E_ProductCategory>,
    @InjectRepository(E_ProductSubCategory)
    protected subCategoryRepository: Repository<E_ProductSubCategory>,
    @InjectRepository(E_ProductDiscount)
    protected discountRepository: Repository<E_ProductDiscount>,
    @InjectRepository(E_ProductFavourites)
    protected favouritesRepository: Repository<E_ProductFavourites>,
    @InjectRepository(E_ProductImage)
    protected productImageRepository: Repository<E_ProductImage>,
    @InjectRepository(E_Image)
    protected imageRepository: Repository<E_Image>,
    @InjectDataSource()
    protected dataSource: DataSource,
    @InjectRepository(E_ProductCartItem)
    private cartRepository: Repository<E_ProductCartItem>,
    @InjectRepository(E_ProductReview)
    private reviewRepository: Repository<E_ProductReview>,
  ) {}

  async uploadImage(imageData, file) {
    try {
      if (file.image_id) {
        const image = await this.imageRepository.findOne({
          where: { id: file.image_id },
        });
        if (!image)
          return { statusCode: 400, message: 'Image does not exists.' };

        const objImage = {
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          imageData: imageData,
        };

        console.log('objImage', objImage);

        await this.imageRepository.update({ id: image.id }, objImage);
        return {
          statusCode: 200,
          message: 'image updated successfully',
        };
      } else {
        const newImage = new E_Image();
        newImage.mimetype = file.mimetype;
        newImage.size = file.size;
        newImage.path = file.path;
        newImage.imageData = imageData;

        const saveImage = await this.imageRepository.save(newImage);

        console.log('saveImage', saveImage);
        return {
          statusCode: 200,
          message: 'image saved successfully',
          image: saveImage,
        };
      }
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async uploadProductImage(imageData: any[], image_id) {
    try {
      const imageArray = ['front_side', 'back_side', 'left_side', 'right_side'];
      if (image_id !== 'undefined') {
        const image = await this.productImageRepository.findOne({
          where: { id: image_id },
        });

        if (!image) {
          return {
            statusCode: 400,
            message: 'Image Id doesnot exists',
          };
        }
        if (image) {
          const saveImage = {};
          for (let i = 0; i < imageData.length; i++) {
            const baseImage = fs.readFileSync(imageData[i].path);
            const imageDataBase64 =
              'data:image/jpeg;base64,' + baseImage.toString('base64');
            saveImage[imageArray[i]] = imageDataBase64;
          }
          if (saveImage) {
            await this.productImageRepository.update(
              { id: image_id },
              saveImage,
            );

            return {
              statusCode: 200,
              message: 'Image saved Successfully',
              image: saveImage,
            };
          }
        }
      } else {
        if (imageData.length) {
          const saveImage = new E_ProductImage();
          for (let i = 0; i < imageData.length; i++) {
            const baseImage = fs.readFileSync(imageData[i].path);
            const imageDataBase64 =
              'data:image/jpeg;base64,' + baseImage.toString('base64');
            saveImage[imageArray[i]] = imageDataBase64;
          }
          await this.productImageRepository.save(saveImage);
          return {
            statusCode: 200,
            message: 'product image saved successfully',
            image: saveImage,
          };
        }
      }
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async getImage(image_id: string) {
    try {
      const image = await this.imageRepository.findOne({
        where: { id: image_id },
      });
      if (image) {
        console.log('image', image);
        return image;
      }
    } catch (error) {
      console.log(error);
      CommonService.error(error);
      return;
    }
  }

  async makepayment(detai1ls) {
    // Construct the Cashfree request data
    try {
      const url = `https://api.cashfree.com/pg/orders`;

      const headers = {
        'Content-Type': 'application/json',
        'x-api-version': '2022-09-01',
        'x-client-id': process.env.APPKEY,
        'x-client-secret': process.env.SECRET_KEY,
      };

      const axiosConfig = {
        url,
        method: 'post',
        headers,
        data: detai1ls,
      };

      const response = await axios.request(axiosConfig);

      // Your existing code
      // const category = await this.categoryRepository.findOne({ where: { id: productDto.category_id } });
      // const sub_category = await this.subCategoryRepository.findOne({ where: { id: productDto.subcategory_id } });

      return {
        statusCode: 200,
        message: 'Payment initiated successfully',
        data: response.data,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async addProduct(productDto: Omit<AddorUpdateProductDto, 'product_id'>) {
    try {
      // const category = await this.categoryRepository.findOne({
      //   where: { id: productDto.category_id },
      // });
      // const sub_category = await this.subCategoryRepository.findOne({
      //   where: { id: productDto.subcategory_id },
      // });

      const newProduct = new E_Product();
      newProduct.code = productDto.product_code;
      newProduct.quantity = productDto.product_quantity;
      newProduct.description = productDto.product_description;
      newProduct.features = productDto.product_features;
      newProduct.about = productDto.product_about;
      newProduct.category_id = productDto.category_id;
      newProduct.subcategory_id = productDto.subcategory_id;
      newProduct.image_id = productDto.product_image_id;
      newProduct.color = productDto.product_color;
      newProduct.color_name = productDto.product_color_name;
      newProduct.size = productDto.product_size;
      newProduct.mrp = productDto.product_mrp;
      newProduct.selling_price = productDto.product_selling_price;
      newProduct.name = productDto.name;

      const saveProduct = await this.productRepository.save(newProduct);

      return {
        statusCode: 200,
        message: 'Product added successfully',
        data: saveProduct,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async updateProduct(prodctDto: AddorUpdateProductDto) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id: prodctDto.category_id },
      });
      const sub_category = await this.subCategoryRepository.findOne({
        where: { id: prodctDto.subcategory_id },
      });
      const product = await this.productRepository.findOne({
        where: { id: prodctDto.product_id },
      });

      if (!category)
        return { statusCode: 400, message: 'Category does not exists.' };
      if (!sub_category)
        return { statusCode: 400, message: 'sub category does not exists.' };
      if (!product)
        return { statusCode: 400, message: 'Product Id does not exists.' };

      const objProduct = {
        code: prodctDto.product_code,
        quantity: prodctDto.product_quantity,
        features: prodctDto.product_features,
        about: prodctDto.product_about,
        description: prodctDto.product_description,
        category_id: prodctDto.category_id,
        subcategory_id: prodctDto.subcategory_id,
        image_id: prodctDto.product_image_id,
        color: prodctDto.product_color,
        size: prodctDto.product_size,
        mrp: prodctDto.product_mrp,
        selling_price: prodctDto.product_selling_price,
      };

      const updateProduct = await this.productRepository.update(
        { id: product.id },
        objProduct,
      );

      return {
        statusCode: 200,
        message: 'product updated successfully',
        data: updateProduct,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async deleteProduct(id) {
    try {
      await this.productRepository.delete(id);
      return {
        statusCode: 200,
        message: 'product deleted successfully',
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async getAllProduct() {
    try {
      const products = await this.dataSource
        .query(`select t.*,tc.name as categoryname,ts.name as subcategoryname from tblproduct t 
      join tblproduct_category tc on tc.id = t.category_id 
      join tblproduct_subcategory ts on ts.id = t.subcategory_id `);
      if (!products.length) {
        console.log('no products for now, please add some.');
        return {
          statusCode: 400,
          message: 'no products for now, please add some.',
        };
      }

      return {
        statusCode: 200,
        message: 'all products fetched successfully',
        data: products,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async getProduct(sub_category_id: string) {
    try {
      const products = await this.productRepository.find({
        where: { subcategory_id: sub_category_id },
      });
      if (!products.length) {
        console.log('no products for this subcategory, please add some.');
        return {
          statusCode: 400,
          message: 'no products for this subcategory, please add some.',
        };
      }
      return {
        statusCode: 200,
        message: 'all products fetched successfully',
        data: products,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async addCategory(categoryDto: Omit<AddorUpdateCategoryDto, 'category_id'>) {
    try {
      const newCategory = new E_ProductCategory();
      newCategory.description = categoryDto.category_description;
      newCategory.features = categoryDto.category_features;
      newCategory.image_id = categoryDto.category_image_id;
      newCategory.name = categoryDto.category_name;

      const saveCategory = await this.categoryRepository.save(newCategory);

      return {
        statusCode: 200,
        message: 'Category added successfully',
        data: saveCategory,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async updateCategory(categoryDto: AddorUpdateCategoryDto) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryDto.category_id },
      });
      if (!category)
        return { statusCode: 400, message: 'Category does not exists.' };

      const objCategory = {
        features: categoryDto.category_features,
        description: categoryDto.category_description,
        name: categoryDto.category_name,
        image_id: categoryDto.category_image_id,
      };

      const updatedCategory = await this.categoryRepository.update(
        { id: category.id },
        objCategory,
      );

      return {
        statusCode: 200,
        message: 'Category updated successfully',
        data: updatedCategory,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async deleteCategory(id) {
    try {
      await this.categoryRepository.delete(id);
      return {
        statusCode: 200,
        message: 'Category deleted successfully',
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async addSubCategory(
    subCategoryDto: Omit<AddorUpdateSubCategoryDto, 'sub_category_id'>,
  ) {
    try {
      const newSubCategory = new E_ProductSubCategory();
      newSubCategory.description = subCategoryDto.subcategory_description;
      newSubCategory.category_id = subCategoryDto.category_id;
      newSubCategory.image_id = subCategoryDto.subcategory_image_id;
      newSubCategory.name = subCategoryDto.subcategory_name;

      const saveSubCategory =
        await this.subCategoryRepository.save(newSubCategory);

      return {
        statusCode: 200,
        message: 'Sub-category added successfully',
        data: saveSubCategory,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async updateSubCategory(subCategoryDto: AddorUpdateSubCategoryDto) {
    try {
      const subCategory = await this.subCategoryRepository.findOne({
        where: { id: subCategoryDto.sub_category_id },
      });
      if (!subCategory)
        return { statusCode: 400, message: 'Sub Category does not exists.' };

      const objSubCategory = {
        description: subCategoryDto.subcategory_description,
        name: subCategoryDto.subcategory_name,
        image_id: subCategoryDto.subcategory_image_id,
      };

      const updatedSubCategory = await this.subCategoryRepository.update(
        { id: subCategory.id },
        objSubCategory,
      );

      return {
        statusCode: 200,
        message: 'Sub-category updated successfully',
        data: updatedSubCategory,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async deleteSubCategory(id) {
    try {
      await this.subCategoryRepository.delete(id);
      return {
        statusCode: 200,
        message: 'Sub-category deleted successfully',
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async getAllSubCategory() {
    try {
      const subCategory = await this.subCategoryRepository.find();
      if (!subCategory.length) {
        console.log('no sub category for now, please add some.');
        return {
          statusCode: 400,
          message: 'no sub category for now, please add some.',
        };
      }

      return {
        statusCode: 200,
        message: 'all sub category fetched successfully',
        data: subCategory,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async getSubCategory(category_id: string) {
    try {
      const subCategory = await this.subCategoryRepository.find({
        where: { category_id: category_id },
      });
      if (!subCategory.length) {
        console.log('no subCategory for this subcategory, please add some.');
        return {
          statusCode: 400,
          message: 'no subCategory for this subcategory, please add some.',
        };
      }
      return {
        statusCode: 200,
        message: 'all subCategory fetched successfully',
        data: subCategory,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async productMapping(product_id: string) {
    try {
      const productMapping = await this.dataSource.query(`SELECT
      json_agg(
          jsonb_build_object(
                              'category_name', (select tc.name  from tblproduct_category tc where id = t.category_id),
                              'sub_category_name', (select ts.name  from tblproduct_subcategory ts where id = t.subcategory_id),
                              'name',t.name,
                              'code',t.code,
                              'id',t.id,
                              'quantity',t.quantity ,
                              'description',t.description,
                              'features',t.features,
                              'category_id',t.category_id,
                              'subcategory_id',t.subcategory_id,
                              'color',t.color,
                              'size',t."size" ,
                              'mrp',t.mrp ,
                              'about',t.about,
                              'selling_price',t.selling_price,
                               'totalrating',(select coalesce(round(avg(tr2.rating)),5) as rating  from tblproduct_review tr2 where tr2.product_id = '${product_id}' ),
                               'imageDetails',(
                                select json_agg(
                                 jsonb_build_object(
                                 'front_side',ti."front_side",
                                 'back_side',ti."back_side",
                                 'right_side',ti."right_side",
                                 'left_side',ti."left_side"
                                 )
                                 )  from tblproduct_image ti where ti.id = t.image_id  
                               )

                               )) as productdetails
  from tblproduct t where t.id= '${product_id}' `);

      const colormapping = await this.dataSource.query(`  select id,color,color_name  from tblproduct t where t.name in (select name from tblproduct t2 where t2.id = '${product_id}')`)
      productMapping[0].productdetails[0]['front_side'] = productMapping[0].productdetails[0]['imageDetails'][0]['front_side']
      return {
        statusCode: 200,
        message: 'all product fetched successfully',
        data: productMapping[0].productdetails[0],
        color: colormapping
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async colorMapping(product_id: string) {
    try {

      const colormapping = await this.dataSource.query(`  select id,color,color_name  
      from tblproduct t where t.name in (select name from tblproduct t2 where t2.id = '${product_id}') and t.id <> '${product_id}' `)

      return {
        statusCode: 200,
        message: 'all color fetched successfully',
        data: colormapping
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async categoryMapping() {
    try {
      const categoryMapping = await this.dataSource.query(`select tc.id as "category_id",tc."name" as "category_name",
      (SELECT json_agg(
                         jsonb_build_object(
                             'subcategory_id', ts.id::text,
                             'subcategory_name', ts.name
                         )
                     )
                     FROM tblproduct_subcategory ts
                     WHERE ts.category_id = tc.id) as subcategories
     from tblproduct_category tc join tblproduct_subcategory ts on ts.category_id = tc.id
     group by tc.id
         `);
      return {
        statusCode: 200,
        message: 'all product fetched successfully',
        data: categoryMapping,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async addToFavourites(user_id: string, product_id: string) {
    try {
      const favourites = await this.favouritesRepository.findOne({
        where: { user_id, product_id },
      });
      if (favourites) {
        return { statusCode: 400, message: 'already added to favourites' };
      }

      const newFavourites = new E_ProductFavourites();
      newFavourites.user_id = user_id;
      newFavourites.product_id = product_id;

      const saveFavourites =
        await this.favouritesRepository.save(newFavourites);

      return {
        statusCode: 200,
        message: 'added to favourites',
        data: saveFavourites,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async removeFromFavourites(user_id: string, product_id: string) {
    try {
      const favourites = await this.favouritesRepository.findOne({
        where: { user_id, product_id },
      });
      if (!favourites) {
        console.log('Product does not exists on favourites');
        return {
          statusCode: 400,
          message: 'Product does not exists on favourites',
        };
      }

      await this.favouritesRepository.delete({ id: favourites.id });
      return {
        statusCode: 200,
        message: 'removed from favourites',
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async getAllFavourites(user_id: string) {
    try {
      const favourites = await this.dataSource.query(
        `select ti."front_side",t2.* from tblproduct_favourites t1 left join tblproduct t2 on t2.id = t1.product_id left join tblproduct_image ti on ti.id = t2.image_id  where t1.user_id = '${user_id}'`,
      );
      if (!favourites.length) {
        console.log('no favourites for now, please add some.');
        return {
          statusCode: 400,
          message: 'no favourites for now, please add some.',
        };
      }

      return {
        statusCode: 200,
        message: 'removed from favourites',
        data: favourites,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async addToCart(cartDto: AddtoCartDto) {
    try {
      const product = await this.productRepository.findOne({ where: { id: cartDto.product_id } })

      const cart = await this.cartRepository.findOne({
        where: { user_id: cartDto.user_id, product_id: cartDto.product_id },
      });
      if (cartDto.quantity > product.quantity) {
        return {
          statusCode: 400,
          message: "quantity exceeded the limit",
          data: cart,
          product
        }
      }
      if (cart) {
        await this.cartRepository.update(
          { id: cart.id },
          { quantity: cartDto.quantity },
        );

        const cartBalance = await this.cartRepository.findOne({
          where: { user_id: cartDto.user_id, product_id: cartDto.product_id },
        });

        return {
          statusCode: 200,
          message: 'updated to cart',
          data: cartBalance,
          product
        };
      } else {
        const newCart = new E_ProductCartItem();
        newCart.user_id = cartDto.user_id;
        newCart.product_id = cartDto.product_id;
        newCart.quantity = cartDto.quantity;

        const saveCart = await this.cartRepository.save(newCart);

        return {
          statusCode: 200,
          message: 'added to cart',
          data: saveCart,
        };
      }
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async removeFromCart(user_id: string, product_id: string) {
    try {
      const cart = await this.cartRepository.findOne({
        where: { user_id, product_id },
      });
      if (!cart) {
        return { statusCode: 400, message: 'Already removed from cart' };
      }

      await this.cartRepository.delete(cart.id);
      return {
        statusCode: 200,
        message: 'removed from cart',
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async getAllCart(user_id: string) {
    try {
      const favourites = await this.dataSource.query(
        `select ti.front_side,t1.quantity as "cart_quantity",t2.* from tblcartitem t1 
        join tblproduct t2 on t2.id = t1.product_id
        join tblproduct_image ti on ti.id = t2.image_id
        where t1.user_id = '${user_id}'`,
      );
      const count = await this.dataSource.query(`select sum(t1.quantity) as "cart_quantity" from tblcartitem t1 
      join tblproduct t2 on t2.id = t1.product_id
      join tblproduct_image ti on ti.id = t2.image_id where t1.user_id = '${user_id}'`)
      if (!favourites.length) {
        console.log('no favourites for now, please add some.');
        return {
          statusCode: 400,
          message: 'no favourites for now, please add some.',
        };
      }

      return {
        statusCode: 200,
        message: 'removed from favourites',
        data: favourites,
        count
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async getAllCartCount(user_id: string) {
    try {
      const favourites = await this.dataSource.query(
        `select ti.front_side,t1.quantity as "cart_quantity",t2.* from tblcartitem t1 
        join tblproduct t2 on t2.id = t1.product_id
        join tblproduct_image ti on ti.id = t2.image_id
        where t1.user_id = '${user_id}'`,
      );
      if (!favourites.length) {
        console.log('no favourites for now, please add some.');
        return {
          statusCode: 400,
          message: 'no favourites for now, please add some.',
          count: 0
        };
      }

      return {
        statusCode: 200,
        message: 'removed from favourites',
        count: favourites.length ?? 0,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }
  async addReview(reviewDto: AddReviewDto) {
    try {
      const review = await this.reviewRepository.findOne({
        where: { user_id: reviewDto.user_id, product_id: reviewDto.product_id },
      });
      if (review) return { statusCode: 400, message: 'added a review already' };

      const newReview = new E_ProductReview();
      newReview.product_id = reviewDto.product_id;
      newReview.user_id = reviewDto.user_id;
      newReview.rating = reviewDto.rating;
      newReview.review = reviewDto.review;

      const saveReview = await this.reviewRepository.save(newReview);

      return {
        statusCode: 200,
        message: 'review added successfully',
        data: saveReview,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async getLatestProducts() {
    try {
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async reviewMapping(product_id: string) {
    try {
      const description = await this.dataSource.query(
        ` select id,t.description,t.features from tblproduct t where id= '${product_id}'`,
      );
      const review = await this.dataSource.query(
        `select tr.id,tr.review ,tr.rating,TO_CHAR(tr.createdat ::timestamp, 'mm-dd-yyyy') as created_date,concat(t.firstname,' ',t.lastname) as username  from tblproduct_review tr join tbluser t on t.id = tr.user_id  where tr.product_id = '${product_id}' limit 3`,
      );

      return {
        statusCode: 200,
        message: 'review and rating fetched successfully',
        review,
        description,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async getAllCategory() {
    try {
      const category = await this.dataSource
        .query(`select tc."name",tc.description,ti."imageData",tc.id as category_id  
            from tblproduct_category tc 
            join tbl_image ti on ti.id = tc.image_id`);
      if (!category.length) {
        console.log('no category for now, please add some.');
        return {
          statusCode: 400,
          message: 'no category for now, please add some.',
        };
      }
      return {
        statusCode: 200,
        message: 'all category fetched successfully',
        data: category,
      };
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }

  async shopMapping(category, subcategory, search, price: string, offset, type) {
    console.log(category, subcategory, search, price, offset, type);
    let searchVariable = '';
    if (search && search != undefined) {
      searchVariable = `and (t."name" ilike '%${search}%' or t.code ilike  '%${search}%' )`;
    }
    try {

      if (type == "'bestsellers'") {
        console.log("type", type)
        const shopItems = await this.dataSource
          .query(`select distinct on (t.name) td.id as "order_id",t.id,t."name",'best' as new,ti.id as "product_image_id",t.code,
    t.quantity ,t.description,t.features,t.category_id,t.subcategory_id,t.color,
    t."size" ,t.mrp,t.selling_price,t.about,ti.front_side,
    coalesce (cast(round(avg(tr.rating)) as int),5)  as total_rating
         from tblproduct t  
                     join tblproduct_image ti on ti.id = t.image_id 
                     left join tblproduct_review tr on tr.product_id = t.id
                     left join tblorder_item tt on tt.product_id = t.id 
                     left join tblorder_details td on td.id = tt.order_id
                     group by t.id,ti."id",td.id order by t.name,td.total desc`);

        return {
          statusCode: 200,
          message: 'all products fetched successfully',
          data: shopItems,
        };
      }

      if (type == "'newarrivals'") {
        console.log("type", type)

        const shopItems = await this.dataSource
          .query(`select distinct on (t.name) t.id,t."name",'new' as new,ti.id as product_image_id,ti."front_side",coalesce (cast(round(avg(tr.rating)) as int),5)  as total_rating, 
         t.code,t.quantity ,t.description,t.features,t.category_id,t.subcategory_id,t.color,
          t."size" ,t.mrp,t.selling_price,t.about,ti.front_side 
          from tblproduct t  
             join tblproduct_image ti on ti.id = t.image_id 
             left join tblproduct_review tr on tr.product_id = t.id
             group by t.id,ti."id",tr.product_id  order by t.name,t.createdat desc`);

        return {
          statusCode: 200,
          message: 'all products fetched successfully',
          data: shopItems,
        };
      }

      if (type == "'all'") {
      const shopItems = await this.dataSource
        .query(`select distinct on (t."name",t.selling_price) coalesce(round(avg(tr.rating)),5) as total_rating,t.id,
        t.name,t.code,t.quantity ,t.description,t.features,t.category_id,t.subcategory_id,t.color,
          t."size" ,t.mrp,t.selling_price,t.about,ti.front_side  
          from tblproduct t 
          join tblproduct_category tc on t.category_id = tc.id
          join tblproduct_subcategory ts on ts.id = t.subcategory_id 
          left join tblproduct_review tr on tr.product_id =t.id
          join tblproduct_image ti on ti.id = t.image_id 
          where (case 
            when ${category}='all' then 
            tc.name ilike '%%' else
            tc.name=${category} end) 
                and (case 
            when ${subcategory}='all' then 
            ts.name ilike '%%' else
            ts.name=${subcategory} end)   
           ${searchVariable}         
            group by tr.product_id ,t.id,t.name,t.code,t.quantity ,
                   t.description,t.features,t.category_id,
                   t.subcategory_id,t.color,t."size" ,t.mrp,ti.front_side 
                   order by t.selling_price,t.name  ${price == "'lowToHigh'" ? 'asc' : 'desc'} offset ${offset} limit 15`);

      if (!shopItems.length) {
        console.log('no shopItems for now, please add some.');
        return {
          statusCode: 400,
          message: 'no shopItems for now, please add some.',
        };
      }
      return {
        statusCode: 200,
        message: 'all products fetched successfully',
        data: shopItems,
      };
      }
    } catch (error) {
      console.log(error);
      return CommonService.error(error);
    }
  }
}
