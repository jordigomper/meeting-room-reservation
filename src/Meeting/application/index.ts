import MeetingMongoDB from "../infrastructure/db/mongo/MeetingMongoDB.data-sources";
import CreateMeetingCommand from "./CreateMeeting.command";
import getMeetingsByUsersCommand from "./getMeetingsByUsers.command";

/**
 * MongoDB Interactors
 */
const meetingRepository = new MeetingMongoDB();
export const saveMeetingCommand = new CreateMeetingCommand(meetingRepository);
export const getMeetingsByUsers = getMeetingsByUsersCommand(meetingRepository);