import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) { }

    async findAll(): Promise<Role[]> {
        return this.roleRepository.find();
    }

    async findRolesByUserId(userId: number): Promise<Role[]> {
        return this.roleRepository.createQueryBuilder('role')
            .where(`:userId = ANY(role."idUser")`, { userId })
            .getMany();
    }

    async findRoleById(id: number): Promise<Role> {
        return this.roleRepository.findOne({
            where: {
                id
            }
        });
    }

    async findRolesByTeamId(idTeam: number): Promise<Role[]> {
        return this.roleRepository.createQueryBuilder('role')
            .where(`:idTeam = ANY(role."idTeam")`, { idTeam })
            .getMany();
    }

}
