import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class AddUserInput {
  @IsNotEmpty()
  @Field((type) => Int)
  idTeam: number;

  @IsNotEmpty()
  @Field()
  email: string;
}