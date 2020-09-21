import MeetingMongoDB from "../DataSources/MongoDB/MeetingMongoDB.data-sources";
import saveMeetingInteractor from "./createMeeting.interactor";
import getMeetingsByUsersInteractor from "./getMeetingsByUsers.interactor";

/**
 * MongoDB Interactors
 */
const meetingRepository = new MeetingMongoDB();
export const saveMeeting = saveMeetingInteractor(meetingRepository);
export const getMeetingsByUsers = getMeetingsByUsersInteractor(meetingRepository);