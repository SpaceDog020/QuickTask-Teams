import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TeamsService } from './teams.service';
import { ResponseTeams, Team, TeamUsersResponse } from './entities/team.entity';
import { CreateTeamInput } from './dto/create-team.input';
import { DeleteTeamInput } from './dto/delete-team.input';
import { AddUserInput } from './dto/add-user.input';
import { KickUserInput } from './dto/kick-user.input';
import { UpdateTeamInput } from './dto/update-team.input';

@Resolver(() => Team)
export class TeamsResolver {
  constructor(
    private readonly teamsService: TeamsService
  ) {}

  @Query((returns) => [Team])
  teams() {
    console.log('[*] teams');
    return this.teamsService.findAll();
  }

  @Query((returns) => [Team])
  teamsByUserId(@Args('id', { type: () => Int }) id: number) {
    console.log('[*] teamsByUserId');
    return this.teamsService.findTeamsByUserId(id);
  }

  @Query((returns) => Team)
  team(@Args('id', { type: () => Int }) id: number) {
    console.log('[*] team');
    return this.teamsService.findTeamById(id);
  }

  @Query((returns) => TeamUsersResponse)
  async teamUserIds(@Args('id', { type: () => Int }) id: number) {
    console.log('[*] teamUserIds');
    const userIds = await this.teamsService.findUsersByTeamId(id);
    return { userIds };
  }

  @Mutation((returns) => Team)
  async createTeam(@Args('createTeamInput') createTeamInput: CreateTeamInput) {
    console.log('[*] createTeam');
    try{
      return await this.teamsService.createTeam(createTeamInput);
    }catch(error){
      if(error.message === 'team already exists'){
          throw new Error('team already exists');
      }else{
          throw new Error('An error occurred');
      }
    }
  }

  @Mutation((returns) => ResponseTeams)
  async addUsers(@Args('addUsersInput') addUsersInput: AddUserInput){
    console.log('[*] addUsers');
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
    console.log('[*] deleteTeam');
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
    console.log('[*] kickUser');
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

  @Mutation((returns) => ResponseTeams)
  async updateTeam(@Args('updateTeamInput') updateTeamInput: UpdateTeamInput){
    console.log('[*] updateTeam');
    try{
      const validate = await this.teamsService.updateTeam(updateTeamInput);
      if(validate){
          return {response: true };
      }else{
          return {response: false };
      }
    }catch(error){
      if(error.message === 'team does not exist'){
          throw new Error('team does not exist');
      }else if(error.message === 'you cannot update this team'){
          throw new Error('you cannot update this team');
      }else{
          throw new Error('An error occurred');
      }
    }
  }

  
}