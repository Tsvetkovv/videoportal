import mongoose, { Schema } from 'mongoose';

const UserProfileSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  displayName: {
    type: String,
  },
  picture: {
    type: String,
  },
  gender: {
    type: String,
  },
  location: {
    type: String,
  },
  website: {
    type: String,
  },
});

delete mongoose.connection.models.UserProfile;
export default mongoose.model('UserProfile', UserProfileSchema);
export { UserProfileSchema };
