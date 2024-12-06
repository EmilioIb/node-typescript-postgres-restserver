import { bcryptAdapter, envs, JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import { EmailService } from './email.service';

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;
    const exitsUser = await UserModel.findOne({ email });

    if (exitsUser) throw CustomError.badRequest('Email already exists');

    try {
      const user = new UserModel(registerUserDto);

      user.password = bcryptAdapter.hash(user.password);

      const token = await JwtAdapter.generateToken({ email: user.email });
      if (!token) throw CustomError.internalServer('Error while creating jwt');

      await this.sendEmailValidationLink(user.email);

      await user.save();

      const { password, ...userEntity } = UserEntity.fromObject(user);
      return { user: userEntity, token: token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest('User not found');

    const validPassword = bcryptAdapter.compare(loginUserDto.password, user.password);
    if (!validPassword) throw CustomError.forbidden('Incorrect password');

    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
    if (!token) throw CustomError.internalServer('Error while creating jwt');

    return { user: userEntity, token: token };
  }

  public async validateEmail(token: string) {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized('Invalid token');

    const { email } = payload as { email: string };

    if (!email) throw CustomError.internalServer('Email not in token');

    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.badRequest('User not found');

    user.emailValidated = true;
    await user.save();
    return true;
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServer('Error getting token');

    const link = `${envs.WEB_SERVICE_URL}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    };

    const isSend = await this.emailService.sendEmail(options);
    if (!isSend) throw CustomError.internalServer('Error sending email');

    return true;
  };
}
