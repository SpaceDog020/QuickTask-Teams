import { Injectable } from '@nestjs/common';
import { CreateTeamInput } from './dto/create-team.input';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { AddUserInput } from './dto/add-user.input';
import { DeleteTeamInput } from './dto/delete-team.input';
import { KickUserInput } from './dto/kick-user.input';
import { UpdateTeamInput, ChangeCreatorInput } from './dto/update-team.input';

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

  async findTeamsByCreatorId(userId: number): Promise<Boolean> {
    const teams = await this.teamsRepository.find({
      where: {
        idCreator: userId
      }
    });
    if (teams.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async findTeamById(id: number): Promise<Team> {
    return this.teamsRepository.findOne({
      where: {
        id
      }
    });
  }

  async findTeamsByIds(ids: number[]): Promise<Team[]> {
    const teams = this.teamsRepository.find({
      where: {
        id: In(ids)
      }
    });
    if(teams) {
      return teams;
    } else {
      throw new Error('No se han encontrado equipos');
    }
  }

  async createTeam(createTeamInput: CreateTeamInput): Promise<Team> {
    const exist = await this.teamsRepository.findOne({
      where: {
        name: createTeamInput.name,
        idCreator: createTeamInput.idUser
      }
    });
    if (exist) {
      throw new Error('El equipo ya existe');
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
      throw new Error('El equipo no existe');
    } else {
      const exist = await team.idUsers.find(id => id === idUser);
      if (exist) {
        throw new Error('El usuario ya existe en el equipo');
      } else {
        team.idUsers.push(idUser);
        await this.teamsRepository.save(team);
        return team;
      }
    }
  }

  async deleteTeam(deleteTeamInput: DeleteTeamInput): Promise<boolean> {
    const idTeam = deleteTeamInput.idTeam;
    const idCreator = deleteTeamInput.idCreator;
    const team = await this.teamsRepository.findOne({
      where: {
        id: idTeam
      }
    });

    if (!team) {
      throw new Error('El equipo no existe');
    } else {
      if(team.idCreator !== idCreator) {
        throw new Error('No puedes eliminar el equipo');
      }else{
        await this.teamsRepository.delete(idTeam);
        return true;
      }
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
      throw new Error('El equipo no existe');
    } else {
      if (team.idCreator === idUser) {
        throw new Error('No puedes expulsarte a ti mismo');
      } else {
        const exist = await team.idUsers.find(id => id === idUser);
        if (!exist) {
          throw new Error('El usuario no existe en el equipo');
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
      throw new Error('El equipo no existe');
    } else {
      if (team.idCreator !== updateTeamInput.idUser) {
        throw new Error('No puedes modificar el equipo');
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

  async changeCreator(changeCreatorInput: ChangeCreatorInput): Promise<boolean> {
    const idTeam = changeCreatorInput.idTeam;
    const idUser = changeCreatorInput.idUser;
    const idNewCreator = changeCreatorInput.idNewCreator;
    console.log("idTeam", idTeam, "idUser", idUser, "idNewCreator", idNewCreator);
    const team = await this.teamsRepository.findOne({
      where: {
        id: idTeam
      }
    });

    if (!team) {
      throw new Error('El equipo no existe');
    } else {
      if (team.idCreator !== idUser) {
        throw new Error('No puedes modificar el equipo');
      } else {
        const exist = await team.idUsers.find(id => id === idNewCreator);
        if (!exist) {
          throw new Error('El usuario no existe en el equipo');
        } else {
          team.idCreator = idNewCreator;
          await this.teamsRepository.save(team);
          return true;
        }
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
      throw new Error('El equipo no existe');
    }

    return team.idUsers;
  }
}
