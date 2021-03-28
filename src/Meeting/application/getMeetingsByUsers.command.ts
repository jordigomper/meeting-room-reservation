import Meeting from "../domain/Meeting.interface";
import MeetingRepository from "../domain/Meeting.repository";

const getMeetingsByUserCommand = (
  meetingRepository: MeetingRepository
) => async (usersID: string[]): Promise<Meeting[]> => {
  return await meetingRepository.getMeetingsByUsers(usersID);
};

export default getMeetingsByUserCommand;