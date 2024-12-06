import { CategoryModel } from '../../data';
import { CategoryEntity, CreateCategoryDto, CustomError, PaginationDto, UserEntity } from '../../domain';

export class CategoryService {
  constructor() {}

  async getCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        previous: page > 1 ? `api/categories?page=${page - 1}&limit=${limit}` : null,
        next: (page + 1) * limit < total ? `api/categories?page=${page + 1}&limit=${limit}` : null,
        categories: categories.map(CategoryEntity.fromObject).map(category => {
          const { user, ...rest } = category;
          return rest;
        }),
      };
    } catch (error) {
      throw CustomError.internalServer(`An error ocurred while getting categories`);
    }
  }

  async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
    const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name });
    if (categoryExists) throw CustomError.badRequest('Category already exists');

    try {
      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      });

      await category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`An error ocurred while inserting category`);
    }
  }
}
