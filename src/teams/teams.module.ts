import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsResolver } from './teams.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([Team])],
  providers: [TeamsResolver, TeamsService, JwtStrategy],
  exports: [TeamsService]
})
export class TeamsModule {}
