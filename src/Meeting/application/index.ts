import MeetingMongoDB from "../infrastructure/db/mongo/MeetingMongoDB.data-sources";
import saveMeetingCommand from "./createMeeting.command";
import getMeetingsByUsersCommand from "./getMeetingsByUsers.command";

/**
 * MongoDB Interactors
 */
const meetingRepository = new MeetingMongoDB();
export const saveMeeting = saveMeetingCommand(meetingRepository);
export const getMeetingsByUsers = getMeetingsByUsersCommand(meetingRepository);