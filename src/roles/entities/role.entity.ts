import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(["idTeam", "idUser"])
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  role: string;

  @Column()
  @Field((type) => Int)
  idTeam: number;

  @Column()
  @Field((type) => Int)
  idUser: number;
}