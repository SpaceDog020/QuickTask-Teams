import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class UpdateTeamInput{
    @Field((type) => Int)
    idTeam: number;
    
    @Field((type) => Int)
    idUser: number;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    description: string;
}