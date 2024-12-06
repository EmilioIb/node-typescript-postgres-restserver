import { CustomError } from '../errors/custom.error';

export class CategoryEntity {
  constructor(public id: string, public name: string, public available: boolean, public user: string) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, _id, name, available, user } = object;

    if (!_id && !id) throw CustomError.badRequest('Missing id');
    if (!name) throw CustomError.badRequest('Missing name');
    if (!available === undefined) throw CustomError.badRequest('Missing available');
    if (!user) throw CustomError.badRequest('Missing user');

    return new CategoryEntity(_id || id, name, available, user);
  }
}
