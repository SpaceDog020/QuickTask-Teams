import { Injectable } from '@nestjs/common';
import { CreateTeamInput } from './dto/create-team.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { AddUserInput } from './dto/add-user.input';
import { DeleteTeamInput } from './dto/delete-team.input';
import { KickUserInput } from './dto/kick-user.input';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) 
    private teamsRepository: Repository<Team>,
  ) {}

  async findAll(): Promise<Team[]> {
    return this.teamsRepository.find();
  }

  async findTeamById(id: number): Promise<Team> {
    return this.teamsRepository.findOne({
        where: {
            id
        }
    });
  }

  async createTeam(createTeamInput: CreateTeamInput): Promise<Team> {
    const newTeam = this.teamsRepository.create();
    newTeam.name = createTeamInput.name;
    newTeam.description = createTeamInput.description;
    newTeam.idUsers = [createTeamInput.idUser];
    newTeam.idCreator = createTeamInput.idUser;
    return this.teamsRepository.save(newTeam);
  }

  async addUsers(addUserInput: AddUserInput): Promise<Team> {
    const idTeam = addUserInput.idTeam;
    const idUser = addUserInput.idUser;
    const team = await this.teamsRepository.findOne({
      where: {
          id: idTeam
      }
    });

    if(!team){
      throw new Error('team does not exist');
    }else{
      const exist = await team.idUsers.find(id => id === idUser);
      if(exist){
          throw new Error('user already exists');
      }else{
          team.idUsers.push(idUser);
          await this.teamsRepository.save(team);
          return team;
      }
    }
  }

  async deleteTeam(deleteTeamInput: DeleteTeamInput): Promise<boolean>{
    const idTeam = deleteTeamInput.idTeam;
    const team = await this.teamsRepository.findOne({
      where: {
          id: idTeam
      }
    });

    if(!team){
      throw new Error('team does not exist');
    }else{
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

    if(!team){
      throw new Error('team does not exist');
    }else{
      if(team.idCreator === idUser){
        throw new Error('you cannot kick creator');
      }else{
        const exist = await team.idUsers.find(id => id === idUser);
        if(!exist){
            throw new Error('user does not exist');
        }else{
            team.idUsers = team.idUsers.filter(id => id !== idUser);
            await this.teamsRepository.save(team);
            return team;
        }
      }
    }
  }
}
