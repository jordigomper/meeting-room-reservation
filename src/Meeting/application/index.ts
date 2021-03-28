import MeetingMongoDB from "../infrastructure/db/mongo/MeetingMongoDB.data-sources";
import SaveMeetingCommand from "./createMeeting.command";
import getMeetingsByUsersCommand from "./getMeetingsByUsers.command";

/**
 * MongoDB Interactors
 */
const meetingRepository = new MeetingMongoDB();
export const saveMeetingCommand = new SaveMeetingCommand(meetingRepository);
export const getMeetingsByUsers = getMeetingsByUsersCommand(meetingRepository);