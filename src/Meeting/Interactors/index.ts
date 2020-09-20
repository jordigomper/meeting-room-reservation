import MeetingMongoDB from "../DataSources/MongoDB/MeetingMongoDB.data-sources";
import saveMeetingInteractor from "./createMeeting.interactor";
import getMeetingsSortByDateInteractor from "./getMeetingsSortByDate.interactor";
import getMeetingsByUsersInteractor from "./getMeetingsByUsers.interactor";

const meetingRepository = new MeetingMongoDB();
export const saveMeeting = saveMeetingInteractor(meetingRepository);
export const getMeetingsSortByDate = getMeetingsSortByDateInteractor(meetingRepository);
export const getMeetingsByUsers = getMeetingsByUsersInteractor(meetingRepository);