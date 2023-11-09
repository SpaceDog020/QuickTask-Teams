import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateRoleInput {
  @IsNotEmpty()
  @Field()
  role: string;

  @IsNotEmpty()
  @Field((type) => Int)
  idTeam: number;

  @IsNotEmpty()
  @Field((type) => Int)
  idUser: number;
}