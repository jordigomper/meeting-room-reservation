import IMeeting from "../Domain/Meeting.interface";
import MeetingRepository from "../Domain/Meeting.repository";

const getMeetingsSortByDate = (
  meetingRepository: MeetingRepository
) => async (): Promise<IMeeting[]> => {
  return await meetingRepository.getMeetingsSortByDate();
};

export default getMeetingsSortByDate;