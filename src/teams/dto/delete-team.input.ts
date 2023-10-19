import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class DeleteTeamInput {
    @IsNotEmpty()
    @Field((type) => Int)
    idTeam: number;
}