import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';

@Resolver()
export class RolesResolver {
  constructor(
    private readonly rolesService: RolesService
  ) {}

  @Query((returns) => [Role])
  roles() {
    console.log('[*] roles');
    return this.rolesService.findAll();
  }

  @Query((returns) => [Role])
  rolesByUserId(@Args('id', { type: () => Int }) id: number) {
    console.log('[*] rolesByUserId');
    return this.rolesService.findRolesByUserId(id);
  }

  @Query((returns) => Role)
  role(@Args('id', { type: () => Int }) id: number) {
    console.log('[*] role');
    return this.rolesService.findRoleById(id);
  }

  @Query((returns) => [Role])
  rolesByTeamId(@Args('id', { type: () => Int }) id: number) {
    console.log('[*] rolesByTeamId');
    return this.rolesService.findRolesByTeamId(id);
  }

}
