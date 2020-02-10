import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { User } from './User';
import { Note } from './Note';
import { Image } from './Image';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity('categories')
export class Category {
  @Field()
  @PrimaryGeneratedColumn('uuid', {
    name: 'category_id'
  })
  categoryId: string;

  @Field()
  @Column('varchar', {
    length: 100,
    name: 'name',
    nullable: false,
    unique: true
  })
  name: string;

  @Field(() => Image)
  @ManyToOne(() => Image)
  @JoinColumn({ name: 'image_id' })
  logo: Image;

  @Column('uuid', { nullable: false, name: 'image_id' })
  imageId: string;

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

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.categories
  )
  @JoinColumn({ name: 'user_id' })
  createdBy: User;

  @Column('uuid', { nullable: false, name: 'user_id' })
  userId: string;

  @Field(() => [Note], { nullable: true })
  @OneToMany(
    () => Note,
    note => note.category
  )
  notes?: Note[];
}
