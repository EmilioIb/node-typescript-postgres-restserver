import { regularExps } from '../../../config';

export class LoginUserDto {
  private constructor(public readonly email: string, public readonly password: string) {}

  static create(obj: { [key: string]: any }): [string?, LoginUserDto?] {
    const { email, password } = obj;

    if (!email || !email.trim().length) return ['Missing email'];
    if (!regularExps.email.test(email)) return ['Email is not valid'];
    if (!password || !password.trim().length) return ['Missing password'];
    if (password.length < 6) return ['Password too short'];

    return [undefined, new LoginUserDto(email, password)];
  }
}
