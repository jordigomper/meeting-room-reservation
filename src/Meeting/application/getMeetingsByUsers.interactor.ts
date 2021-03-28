import IMeeting from "../domain/Meeting.interface";
import MeetingRepository from "../domain/Meeting.repository";

const getMeetingsByUser = (
  meetingRepository: MeetingRepository
) => async (usersID: string[]): Promise<IMeeting[]> => {
  return await meetingRepository.getMeetingsByUsers(usersID);
};

export default getMeetingsByUser;