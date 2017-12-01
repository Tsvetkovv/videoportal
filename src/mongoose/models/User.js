import bcrypt from 'bcrypt-nodejs';
import mongoose, { Schema } from 'mongoose';
import { USER_ROLES } from '../../constants';

import Video from './Video';

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: USER_ROLES.user,
      enum: Object.values(USER_ROLES),
    },
    password: {
      type: String,
      required: true,
    },
    favoriteVideos: [
      {
        type: Schema.ObjectId,
        ref: 'Video',
        unique: true,
      },
    ],
  },
  {
    toObject: {
      transform: (doc, ret) => {
        ret.id = ret._id; // eslint-disable-line  no-underscore-dangle, no-param-reassign
        delete ret._id; // eslint-disable-line  no-underscore-dangle, no-param-reassign
      },
    },
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id; // eslint-disable-line  no-underscore-dangle, no-param-reassign
        delete ret._id; // eslint-disable-line  no-underscore-dangle, no-param-reassign
      },
    },
  },
);

class UserClass {
  get id() {
    return this._id; // eslint-disable-line no-underscore-dangle
  }

  comparePassword(v) {
    return bcrypt.compareSync(v, this.password);
  }

  static generateHash(v) {
    return bcrypt.hashSync(v, bcrypt.genSaltSync(8), null);
  }

  static getFullProfile(query) {
    return this.findOne(query)
      .populate('claimedVideos')
      .populate({
        path: 'favoriteVideos',
        populate: { path: 'author' },
      });
  }

  async addToFavorite(videoId) {
    return this.update(
      {
        $addToSet: {
          favoriteVideos: videoId,
        },
      },
      {
        safe: true,
      },
    );
  }

  async removeFromFavorite(videoId) {
    return this.update(
      {
        $pull: {
          favoriteVideos: videoId,
        },
      },
      {
        safe: true,
      },
    );
  }

  async claim(videoId) {
    await Video.findByIdAndUpdate(
      videoId,
      {
        $addToSet: {
          claimedBy: this.id,
        },
      },
      {
        safe: true,
      },
    );

    return true;
  }

  async like(videoId) {
    return Video.findOneAndUpdate(
      videoId,
      {
        $addToSet: {
          likedBy: this.id,
        },
        $pull: {
          dislikedBy: this.id,
        },
      },
      {
        safe: true,
      },
    );
  }

  async dislike(videoId) {
    return Video.findOneAndUpdate(
      videoId,
      {
        $addToSet: {
          dislikedBy: this.id,
        },
        $pull: {
          likedBy: this.id,
        },
      },
      {
        safe: true,
      },
    );
  }
}

UserSchema.loadClass(UserClass);

delete mongoose.connection.models.User;
export default mongoose.model('User', UserSchema);
