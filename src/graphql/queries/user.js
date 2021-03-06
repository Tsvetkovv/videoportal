import { GraphQLString } from 'graphql';
import UserType from '../types/UserType';
import { User, Video } from '../../mongoose/models';
import ErrorType from '../types/ErrorType';

const userQuery = {
  type: UserType,
  args: {
    id: { type: GraphQLString },
  },
  resolve: async ({ req }, { id }) => {
    const errors = [];
    const userId = id || req.user.id;

    let user = null;

    const foundUser = await User.getFullProfile({
      _id: userId,
    });

    if (foundUser) {
      user = foundUser;
      user.ownVideos = await Video.find({ author: user.id });
    } else {
      errors.push({
        key: 'notFound',
        message: `User is not found with id: ${userId}`,
      });
    }

    if (errors.length) {
      throw new ErrorType(errors);
    }
    return user;
  },
};

export default userQuery;
