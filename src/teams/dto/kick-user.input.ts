import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class KickUserInput {
  @IsNotEmpty()
  @Field((type) => Int)
  idTeam: number;

  @IsNotEmpty()
  @Field((type) => Int)
  idUser: number;
}