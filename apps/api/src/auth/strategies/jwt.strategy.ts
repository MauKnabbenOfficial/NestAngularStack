import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET não foi definido nas variáveis de ambiente');
    }

    super({
      jwtFromRequest /*Diz à estratégia onde procurar o token JWT na requisição. */:
        ExtractJwt.fromAuthHeaderAsBearerToken(), //configura para o padrão mais comum: o cabeçalho Authorization com o formato Bearer <token>.
      ignoreExpiration: false, // Passport irá automaticamente rejeitar tokens que já expiraram.
      secretOrKey: secret,
    });
  }

  // O Passport já verificou o token, agora apenas retornamos o payload
  async validate(payload: any) {
    // O objeto retornado aqui será injetado no objeto `request`
    return { userId: payload.sub, email: payload.email };
  }
}
