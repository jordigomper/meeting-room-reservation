import mongoose, { Document, Schema } from "mongoose";
import UserSchema from "../../../User/DataSources/MongoDB/UserMongoDB.schema";
import IMeeting from "../../Domain/Meeting.interface";

interface MeetingWrapper extends Document, IMeeting {
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