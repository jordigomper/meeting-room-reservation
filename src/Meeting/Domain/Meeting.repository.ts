import IUser from "../../User/Domain/User.interface";
import IMeeting from "./Meeting.interface";

interface MeetingRepository {
  save(meeting: IMeeting): Promise<boolean>,
  getMeetingByUser(users: IUser[]): Promise<IMeeting[]>,
}
export default MeetingRepository;