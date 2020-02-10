import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity('images')
export class Image {
  @Field()
  @PrimaryGeneratedColumn('uuid', {
    name: 'image_id'
  })
  imageId: string;

  @Field()
  @Column('varchar', {
    length: 100,
    name: 'name',
    nullable: false
  })
  name: string;

  @Field()
  @Column('blob', {
    name: 'image',
    nullable: false
  })
  image: string;

  @Field()
  @Column('varchar', {
    length: 100,
    name: 'mime_type',
    nullable: false
  })
  mimeType: string;

  @Field()
  @CreateDateColumn({
    nullable: false,
    name: 'created_at'
  })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({
    nullable: false,
    name: 'updated_at'
  })
  updatedAt: Date;
}
