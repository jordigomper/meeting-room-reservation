import IUser from "../../User/Domain/User.interface";
import IMeeting from "./Meeting.interface";

interface MeetingRepository {
  save(meeting: IMeeting): Promise<IMeeting>,
  getMeetingsByUsers(users: IUser[]): Promise<IMeeting[]>,
  getMeetingsSortByDate(): Promise<IMeeting[]>,
}
export default MeetingRepository;