import { Validators } from '../../../config';

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string,
    public readonly category: string
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateProductDto?] {
    const { name, available, price, description, user, category } = props;

    if (!name || !name.trim()) return ['Missing name'];
    if (!user || !user.trim()) return ['Missing user'];
    if (!category || !category.trim()) return ['Missing category'];
    if (!Validators.isMongoId(user)) return ['Invalid User ID'];
    if (!Validators.isMongoId(category)) return ['Invalid userId'];

    return [undefined, new CreateProductDto(name, !!available, price, description, user, category)];
  }
}
