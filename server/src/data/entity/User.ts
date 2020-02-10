import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Category } from './Category';
import { Note } from './Note';
import { ObjectType, Field } from 'type-graphql';
import { Image } from './Image';

@ObjectType()
@Entity('users')
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid', {
    name: 'user_id'
  })
  userId: string;

  @Field()
  @Column('varchar', {
    length: 70,
    name: 'first_name',
    nullable: false
  })
  firstName: string;

  @Field()
  @Column('varchar', {
    length: 70,
    name: 'last_name',
    nullable: false
  })
  lastName: string;

  @Field()
  @Column('varchar', {
    length: 70,
    name: 'email',
    nullable: false,
    unique: true
  })
  email: string;

  @Field()
  @Column('tinyint', {
    name: 'is_admin',
    nullable: false,
    default: false
  })
  isAdmin: boolean;

  @Field(() => Image)
  @ManyToOne(() => Image, { nullable: true })
  @JoinColumn({ name: 'image_id' })
  avatar?: Image;

  @Column('uuid', { nullable: true, name: 'image_id' })
  imageId: string;


  @Column('text', {
    name: 'password_hash',
    nullable: false
  })
  passswordHash: string;

  @Column('varchar', {
    length: 100,
    name: 'password_salt',
    nullable: false
  })
  passwordSalt: string;

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

  @Field(() => [Category], { nullable: true })
  @OneToMany(
    () => Category,
    category => category.createdBy
  )
  categories?: Category[];

  @Field(() => [Note], { nullable: true })
  @OneToMany(
    () => Note,
    note => note.createdBy
  )
  notes?: Note[];
}
