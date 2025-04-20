import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy,ExtractJwt } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { UserService } from "../../user/user.service";
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy){
  constructor(private configService:ConfigService,private userService: UserService,){
    super({jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')||'my_super_secret_key',
    });
  }
  async validate(payload: JwtPayload) {
    const user = await this.userService.findOnev2(payload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    return user;
  }


}