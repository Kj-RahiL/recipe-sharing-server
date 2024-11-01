import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';
import { USER_Role, USER_Status } from './user.constant';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: [true, 'name is required'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      select: 0,
    },
    phone: {
      type: String,
    },
    image: {
      type: String,
      required: [true, 'Password is required'],
    }, 
    bio: { type: String, default: '' }, 
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: Object.keys(USER_Role),
      default: USER_Role.user,
    },
    passwordChangeAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['in-progress','blocked'],
      default: 'in-progress',
    },
    isPaid:{ type: Boolean, default: false},
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);


// query middleware
userSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('save', async function (next) {
  const user = this;

  // Only hash the password if it is being modified
  if (!user.isModified('password')) {
    return next();
  }

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
})

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

export const User = model<TUser>('User', userSchema);
