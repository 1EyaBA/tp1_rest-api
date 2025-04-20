import { Controller, Post, Body ,UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../../user/dto/login.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto:LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto){
    return this.authService.register(createUserDto);
  }
  @UseGuards(RolesGuard)
  @Post('protected')
  protectedRoute() {
    return { message: 'You have access to this protected route!' };
  }
}
