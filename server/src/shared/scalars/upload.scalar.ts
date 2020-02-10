import { GraphQLScalarType, GraphQLError } from 'graphql';
import { Upload } from '../interfaces/upload.interface';

export const ObjectUploadScalar = new GraphQLScalarType({
  name: 'ObjectUpload',
  description: '',
  async parseValue(value: Promise<Upload>) {
    const upload = await value;

    return upload;
  },
  serialize(value) {
    throw new GraphQLError('Upload literal unsupported.', value);
  },
  parseLiteral(value) {
    throw new GraphQLError('Upload serialization unsupported.', value);
  }
});
