import mongoose, { Document, Schema } from "mongoose";
import UserSchema from "../../../../User/infrastructure/db/mongo/UserMongoDB.schema";
import Meeting from "../../../domain/Meeting.interface";

interface MeetingWrapper extends Document, Meeting {
  id: string,
}

const MeetingSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  startAt: { type: String, required: true },
  finishAt: { type: String, required: true },
  assistants: { type: [UserSchema], required: true },
});

export default mongoose.model<MeetingWrapper>("MeetingModel", MeetingSchema);