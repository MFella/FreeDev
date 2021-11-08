import { ObjectId } from 'mongoose';
import { Roles } from './roles';

export interface StoredUser {
  userId: ObjectId;
  email: string;
  role: Roles;
}
