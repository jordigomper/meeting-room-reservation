import { Schema } from "mongoose";

const UserSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
});

export default UserSchema;