import { Injectable } from '@nestjs/common';
import { CreateTeamInput } from './dto/create-team.input';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { AddUserInput } from './dto/add-user.input';
import { DeleteTeamInput } from './dto/delete-team.input';
import { KickUserInput } from './dto/kick-user.input';
import { UpdateTeamInput } from './dto/update-team.input';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) { }

  async findAll(): Promise<Team[]> {
    return this.teamsRepository.find();
  }

  async findTeamsByUserId(userId: number): Promise<Team[]> {
    return this.teamsRepository.createQueryBuilder('team')
      .where(`:userId = ANY(team."idUsers")`, { userId })
      .getMany();
  }

  async findTeamById(id: number): Promise<Team> {
    return this.teamsRepository.findOne({
      where: {
        id
      }
    });
  }

  async createTeam(createTeamInput: CreateTeamInput): Promise<Team> {
    const exist = await this.teamsRepository.findOne({
      where: {
        name: createTeamInput.name,
        idCreator: createTeamInput.idUser
      }
    });
    if (exist) {
      throw new Error('team already exists');
    } else {
      const newTeam = this.teamsRepository.create();
      newTeam.name = createTeamInput.name;
      newTeam.description = createTeamInput.description;
      newTeam.idUsers = [createTeamInput.idUser];
      newTeam.idCreator = createTeamInput.idUser;
      return this.teamsRepository.save(newTeam);
    }
  }

  async addUsers(addUserInput: AddUserInput): Promise<Team> {
    const idTeam = addUserInput.idTeam;
    const idUser = addUserInput.idUser;
    const team = await this.teamsRepository.findOne({
      where: {
        id: idTeam
      }
    });

    if (!team) {
      throw new Error('team does not exist');
    } else {
      const exist = await team.idUsers.find(id => id === idUser);
      if (exist) {
        throw new Error('user already exists');
      } else {
        team.idUsers.push(idUser);
        await this.teamsRepository.save(team);
        return team;
      }
    }
  }

  async deleteTeam(deleteTeamInput: DeleteTeamInput): Promise<boolean> {
    const idTeam = deleteTeamInput.idTeam;
    const team = await this.teamsRepository.findOne({
      where: {
        id: idTeam
      }
    });

    if (!team) {
      throw new Error('team does not exist');
    } else {
      await this.teamsRepository.delete(idTeam);
      return true;
    }
  }

  async kickUser(kickUserInput: KickUserInput): Promise<Team> {
    const idTeam = kickUserInput.idTeam;
    const idUser = kickUserInput.idUser;
    const team = await this.teamsRepository.findOne({
      where: {
        id: idTeam
      }
    });

    if (!team) {
      throw new Error('team does not exist');
    } else {
      if (team.idCreator === idUser) {
        throw new Error('you cannot kick creator');
      } else {
        const exist = await team.idUsers.find(id => id === idUser);
        if (!exist) {
          throw new Error('user does not exist');
        } else {
          team.idUsers = team.idUsers.filter(id => id !== idUser);
          await this.teamsRepository.save(team);
          return team;
        }
      }
    }
  }

  async updateTeam(updateTeamInput: UpdateTeamInput): Promise<boolean> {
    const idTeam = updateTeamInput.idTeam;
    const team = await this.teamsRepository.findOne({
      where: {
        id: idTeam
      }
    });

    if (!team) {
      throw new Error('team does not exist');
    } else {
      if (team.idCreator !== updateTeamInput.idUser) {
        throw new Error('you cannot update this team');
      } else {
        if (updateTeamInput.name) {
          team.name = updateTeamInput.name;
        }
        if (updateTeamInput.description) {
          team.description = updateTeamInput.description;
        }
        await this.teamsRepository.save(team);
        return true;
      }
    }
  }

  async findUsersByTeamId(idTeam: number): Promise<number[]> {
    const team = await this.teamsRepository.findOne({
      where: {
        id: idTeam
      }
    });

    if (!team) {
      throw new Error('Team not found');
    }

    return team.idUsers;
  }
}
