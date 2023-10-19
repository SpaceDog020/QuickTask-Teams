import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TeamsService } from './teams.service';
import { ResponseTeams, Team } from './entities/team.entity';
import { CreateTeamInput } from './dto/create-team.input';
import { DeleteTeamInput } from './dto/delete-team.input';
import { AddUserInput } from './dto/add-user.input';
import { KickUserInput } from './dto/kick-user.input';

@Resolver(() => Team)
export class TeamsResolver {
  constructor(
    private readonly teamsService: TeamsService
  ) {}

  @Query((returns) => [Team])
  teams() {
    return this.teamsService.findAll();
  }

  @Query((returns) => Team)
  team(@Args('id', { type: () => Int }) id: number) {
    return this.teamsService.findTeamById(id);
  }

  @Mutation((returns) => ResponseTeams)
  async createTeam(@Args('createTeamInput') createTeamInput: CreateTeamInput) {
    const create = await this.teamsService.createTeam(createTeamInput);
    if(create){
        return {response: true };
    }else{
        return {response: false };
    }
  }

  @Mutation((returns) => ResponseTeams)
  async addUsers(@Args('addUsersInput') addUsersInput: AddUserInput){
    try{
      const validate = await this.teamsService.addUsers(addUsersInput);
      if(validate){
          return {response: true };
      }else{
          return {response: false };
      }
    }catch(error){
        if(error.message === 'team does not exist'){
            throw new Error('team does not exist');
        }else if(error.message === 'user already exists'){
            throw new Error('user already exists');
        }else{
            throw new Error('An error occurred');
        }
    }
  }

  @Mutation((returns) => ResponseTeams)
  async deleteTeam(@Args('deleteTeamInput') deleteTeamInput: DeleteTeamInput){
    try{
      const validate = await this.teamsService.deleteTeam(deleteTeamInput);
      if(validate){
          return {response: true };
      }else{
          return {response: false };
      }
    }catch(error){
      if(error.message === 'team does not exist'){
          throw new Error('team does not exist');
      }else{
          throw new Error('An error occurred');
      }
    }
  }

  @Mutation((returns) => ResponseTeams)
  async kickUser(@Args('kickUserInput') kickUserInput: KickUserInput){
    try{
      const validate = await this.teamsService.kickUser(kickUserInput);
      if(validate){
          return {response: true };
      }else{
          return {response: false };
      }
    }catch(error){
      if(error.message === 'team does not exist'){
          throw new Error('team does not exist');
      }else if(error.message === 'you cannot kick creator'){
          throw new Error('you cannot kick creator');
      }else if(error.message === 'user does not exist'){
          throw new Error('user does not exist');
      }else{
          throw new Error('An error occurred');
      }
    }
  }
}