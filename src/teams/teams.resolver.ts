import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { request } from 'graphql-request';
import { TeamsService } from './teams.service';
import { ResponseTeams, Team, TeamUsersResponse } from './entities/team.entity';
import { CreateTeamInput } from './dto/create-team.input';
import { DeleteTeamInput } from './dto/delete-team.input';
import { AddUserInput } from './dto/add-user.input';
import { KickUserAllTeamsInput, KickUserInput } from './dto/kick-user.input';
import { ChangeCreatorInput, UpdateTeamInput } from './dto/update-team.input';

@Resolver(() => Team)
export class TeamsResolver {
  constructor(
    private readonly teamsService: TeamsService
  ) { }

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

  @Query((returns) => ResponseTeams)
  async findTeamsByCreatorId(@Args('id', { type: () => Int }) id: number) {
    console.log('[*] findTeamsByCreatorId');
    try {
      const validate = await this.teamsService.findTeamsByCreatorId(id);
      if (validate) {
        return { response: true };
      } else {
        return { response: false };
      }
    } catch (error) {
      const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
      if (errorMessage === 'Error desconocido') {
        throw new Error(error.message);
      }
      throw new Error(errorMessage);
    }
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

  @Query((returns) => [Team])
  teamsByIds(@Args('ids', { type: () => [Int] }) ids: number[]) {
    console.log('[*] teamsByIds');
    return this.teamsService.findTeamsByIds(ids);
  }

  @Mutation((returns) => Team)
  async createTeam(@Args('createTeamInput') createTeamInput: CreateTeamInput) {
    console.log('[*] createTeam');
    try {
      return await this.teamsService.createTeam(createTeamInput);
    } catch (error) {
      const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
      if (errorMessage === 'Error desconocido') {
        throw new Error(error.message);
      }
      throw new Error(errorMessage);
    }
  }

  @Mutation((returns) => ResponseTeams)
  async addUsers(@Args('addUsersInput') addUsersInput: AddUserInput) {
    console.log('[*] addUsers');

    interface UserResponse {
      email: {
        id: number;
      };
    }

    try {
      const userQuery = `
        query {
          email(email: "${addUsersInput.email}") {
            id
          }
        }
      `;

      const user: UserResponse = await request('http://localhost:3001/graphql', userQuery);

      if (!user) {
        return { response: false };
      }
      const validate = await this.teamsService.addUsers(addUsersInput, user.email.id);
      if (validate) {
        return { response: true };
      } else {
        return { response: false };
      }

    } catch (error) {
      const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
      if (errorMessage === 'Error desconocido') {
        throw new Error(error.message);
      }
      throw new Error(errorMessage);
    }
  }

  @Mutation((returns) => ResponseTeams)
  async deleteTeam(@Args('deleteTeamInput') deleteTeamInput: DeleteTeamInput) {
    console.log('[*] deleteTeam');

    interface ProjectResponse {
      removeTeamAllProject: {
        response: boolean;
      };
    }

    try {
      const team = await this.teamsService.findTeamById(deleteTeamInput.idTeam);

      const projectMutation = `
        mutation ($idTeam: Int!, $idUsers: [Int!]!) {
          removeTeamAllProject(removeTeamAllProjectInput:{
            idTeam: $idTeam,
            idUsers: $idUsers
          }) {
            response
          }
        }
      `;

      const variables = {
        idTeam: deleteTeamInput.idTeam,
        idUsers: team.idUsers
      };

      const validateProject: ProjectResponse = await request('http://localhost:3003/graphql', projectMutation, variables);

      if (!validateProject.removeTeamAllProject.response) {
        return { response: false };
      }

      const validate = await this.teamsService.deleteTeam(deleteTeamInput);
      if (validate) {
        return { response: true };
      } else {
        return { response: false };
      }
    } catch (error) {
      const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
      if (errorMessage === 'Error desconocido') {
        throw new Error(error.message);
      }
      throw new Error(errorMessage);
    }
  }

  @Mutation((returns) => ResponseTeams)
  async kickUserAllTeams(@Args('kickUserAllTeamsInput') kickUserAllTeamsInput: KickUserAllTeamsInput) {
    console.log('[*] kickUserAllTeams');

    interface RoleResponse {
      deleteRoleUserByUser: {
        response: boolean;
      };
    }

    try {
      const roleMutation = `
        mutation ($idUser: Int!) {
          deleteRoleUserByUser(deleteRoleUserByUserInput:{
            idUser: $idUser
          }) {
            response
          }
        }
      `;

      const variables = {
        idUser: kickUserAllTeamsInput.idUser
      };

      const validate = await this.teamsService.kickUserAllTeams(kickUserAllTeamsInput);
      if (validate) {
        const validateRole: RoleResponse = await request('http://localhost:3003/graphql', roleMutation, variables);

        if (!validateRole.deleteRoleUserByUser.response) {
          return { response: false };
        } else {
          return { response: true };
        }
      } else {
        return { response: false };
      }

    } catch (error) {
      const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
      if (errorMessage === 'Error desconocido') {
        throw new Error(error.message);
      }
      throw new Error(errorMessage);
    }
  }

  @Mutation((returns) => ResponseTeams)
  async kickUser(@Args('kickUserInput') kickUserInput: KickUserInput) {
    console.log('[*] kickUser');

    interface RoleResponse {
      deleteRoleUserByUser: {
        response: boolean;
      };
    }

    try {
      const roleMutation = `
        mutation ($idUser: Int!) {
          deleteRoleUserByUser(deleteRoleUserByUserInput:{
            idUser: $idUser
          }) {
            response
          }
        }
      `;

      const variables = {
        idUser: kickUserInput.idUser
      };

      const validateRole: RoleResponse = await request('http://localhost:3002/graphql', roleMutation, variables);

      if (!validateRole.deleteRoleUserByUser.response) {
        return { response: false };
      }

      const validate = await this.teamsService.kickUser(kickUserInput);
      if (validate) {
        return { response: true };
      } else {
        return { response: false };
      }
    } catch (error) {
      const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
      if (errorMessage === 'Error desconocido') {
        throw new Error(error.message);
      }
      throw new Error(errorMessage);
    }
  }

  @Mutation((returns) => ResponseTeams)
  async updateTeam(@Args('updateTeamInput') updateTeamInput: UpdateTeamInput) {
    console.log('[*] updateTeam');
    try {
      const validate = await this.teamsService.updateTeam(updateTeamInput);
      if (validate) {
        return { response: true };
      } else {
        return { response: false };
      }
    } catch (error) {
      const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
      if (errorMessage === 'Error desconocido') {
        throw new Error(error.message);
      }
      throw new Error(errorMessage);
    }
  }

  @Mutation((returns) => ResponseTeams)
  async changeCreator(@Args('changeCreatorInput') changeCreatorInput: ChangeCreatorInput) {
    console.log('[*] changeCreator');
    try {
      const validate = await this.teamsService.changeCreator(changeCreatorInput);
      if (validate) {
        return { response: true };
      } else {
        return { response: false };
      }
    } catch (error) {
      const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
      if (errorMessage === 'Error desconocido') {
        throw new Error(error.message);
      }
      throw new Error(errorMessage);
    }
  }
}