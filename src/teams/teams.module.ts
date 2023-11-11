import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsResolver } from './teams.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TeamRoleUser } from './entities/team-role-user.entity';
import { Role } from 'src/roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Role, TeamRoleUser])],
  providers: [TeamsResolver, TeamsService],
  exports: [TeamsService]
})
export class TeamsModule {}
