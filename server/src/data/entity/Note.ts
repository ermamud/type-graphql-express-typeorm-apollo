import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn
} from 'typeorm';
import { Category } from './Category';
import { User } from './User';
import { Image } from './Image';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity('notes')
export class Note {
  @Field()
  @PrimaryGeneratedColumn('uuid', {
    name: 'note_id'
  })
  noteId: string;

  @Field()
  @Index()
  @Column('varchar', {
    length: 120,
    name: 'title',
    nullable: false
  })
  title: string;

  @Field()
  @Column('text', {
    name: 'content',
    nullable: true
  })
  content: string;

  @Field(() => Category)
  @ManyToOne(
    () => Category,
    category => category.notes
  )
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column('uuid', { nullable: false, name: 'category_id' })
  categoryId: string;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.notes
  )
  @JoinColumn({ name: 'user_id' })
  createdBy: User;

  @Column('uuid', { nullable: false, name: 'user_id' })
  userId: string;

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

  @Field(() => [Image], { nullable: true })
  @ManyToMany(() => Image)
  @JoinTable({
    name: 'notes_images'
  })
  images?: Image[];
}
