import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'supersecretjwtkey'),
    });
  }

  async validate(payload: any) {
    // Payload to zdekodowana zawartość tokenu JWT
    // To, co zwrócimy, zostanie dołączone do obiektu `request` jako `req.user`
    return { sub: payload.sub, email: payload.email };
  }
}
