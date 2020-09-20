import IUser from "../../User/Domain/User.interface";
import IMeeting from "../Domain/Meeting.interface";
import MeetingRepository from "../Domain/Meeting.repository";

const getMeetingsByUser = (
  meetingRepository: MeetingRepository
) => async (users: IUser[]): Promise<IMeeting[]> => {
  return await meetingRepository.getMeetingsByUsers(users);
};

export default getMeetingsByUser;