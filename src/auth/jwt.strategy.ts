import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import request from 'graphql-request';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      logging: true,
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;
    if (!userId) {
      throw new Error('ID de usuario no proporcionado en el token');
    }

    interface UserResponse {
      validateUser: {
        name: string;
      };
    }
  
    const userQuery = `
      query {
        validateUser(id: ${userId}) {
          name
        }
      }
    `;
  
    try {
      const user: UserResponse = await request('http://localhost:3001/graphql', userQuery);
  
      if (!user.validateUser) {
        throw new Error('Usuario no encontrado');
      }
  
      return user.validateUser;
    } catch (error) {
      console.error('Error en la consulta GraphQL:', error.message);
      throw new Error('Error al validar el usuario');
    }
  }
}