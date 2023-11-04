import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsResolver } from './teams.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team])],
  providers: [TeamsResolver, TeamsService],
  exports: [TeamsService]
})
export class TeamsModule {}
