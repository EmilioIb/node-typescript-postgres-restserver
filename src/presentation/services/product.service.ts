import { ProductModel } from '../../data';
import { CustomError, PaginationDto, CreateCategoryDto, CreateProductDto } from '../../domain';

export class ProductService {
  constructor() {}

  async getProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('user')
          .populate('category'),
        // todo: populate
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        previous: page > 1 ? `api/products?page=${page - 1}&limit=${limit}` : null,
        next: (page + 1) * limit < total ? `api/products?page=${page + 1}&limit=${limit}` : null,
        products: products,
      };
    } catch (error) {
      throw CustomError.internalServer(`An error ocurred while getting products`);
    }
  }

  async createProducts(createProductDto: CreateProductDto) {
    const productExists = await ProductModel.findOne({ name: createProductDto.name });
    if (productExists) throw CustomError.badRequest('Product already exists');

    try {
      const product = new ProductModel(createProductDto);
      await product.save();
      return product;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`An error ocurred while inserting product`);
    }
  }
}
