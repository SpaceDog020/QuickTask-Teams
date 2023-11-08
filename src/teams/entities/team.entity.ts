import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, Index } from 'typeorm';

@Entity()
@Index(["name", "idCreator"], { unique: true })
@ObjectType()
export class Team {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  description: string;

  @Column('integer', { array: true })
  @Field((type) => [Int])
  idUsers: number[];

  @Column()
  @Field((type) => Int)
  idCreator: number;
}

@ObjectType()
export class ResponseTeams {
  @Field()
  response: boolean;
}

@ObjectType()
export class TeamUsersResponse {
  @Field(() => [Int])
  userIds: number[];
}