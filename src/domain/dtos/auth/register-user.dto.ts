import { regularExps } from '../../../config';

export class RegisterUserDto {
  private constructor(public readonly name: string, public readonly email: string, public readonly password: string) {}

  static create(obj: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password } = obj;

    if (!name || !name.trim().length) return ['Missing name'];
    if (!email || !email.trim().length) return ['Missing email'];
    if (!regularExps.email.test(email)) return ['Email is not valid'];
    if (!password || !password.trim().length) return ['Missing password'];
    if (password.length < 6) return ['Password too short'];

    return [undefined, new RegisterUserDto(name, email, password)];
  }
}
