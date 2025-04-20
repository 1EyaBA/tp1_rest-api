import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../../user/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../../user/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) {}

  async login(loginDto :LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findOnev2(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload);
      return { access_token: token };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(createUserDto: CreateUserDto) {
    const { username, email, password, role } = createUserDto;

    const existingUser = await this.usersService.findOnev2(email);
    if (existingUser) {
      throw new UnauthorizedException('Email is already in use');
    }

    const userRole = role || 'user';

    const validRoles = ['admin', 'user'];
    if (!validRoles.includes(userRole)) {
      throw new UnauthorizedException('Invalid role');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.salt = salt;
    newUser.role = userRole;

    return this.usersService.create(newUser);
  }
}
