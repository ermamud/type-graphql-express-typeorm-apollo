import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class JwtReponse {
  @Field()
  accessToken: string;

  @Field()
  expiresIn: Date;
}
