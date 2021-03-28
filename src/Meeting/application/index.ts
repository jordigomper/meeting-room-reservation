import MeetingMongoDB from "../infrastructure/db/mongo/MeetingMongoDB.data-sources";
import CreateMeetingCommand from "./CreateMeeting.command";
import GetMeetingsByUsersCommand from "./GetMeetingsByUsers.command";

/**
 * MongoDB Interactors
 */
const meetingRepository = new MeetingMongoDB();
export const createMeetingCommand = new CreateMeetingCommand(meetingRepository);
export const getMeetingsByUsersCommand = new GetMeetingsByUsersCommand(meetingRepository);