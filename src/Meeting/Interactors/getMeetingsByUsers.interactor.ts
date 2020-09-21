import IMeeting from "../Domain/Meeting.interface";
import MeetingRepository from "../Domain/Meeting.repository";

const getMeetingsByUser = (
  meetingRepository: MeetingRepository
) => async (usersID: string[]): Promise<IMeeting[]> => {
  return await meetingRepository.getMeetingsByUsers(usersID);
};

export default getMeetingsByUser;