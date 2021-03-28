import Meeting from "./Meeting.interface";

interface MeetingRepository {
  save(meeting: Meeting): Promise<Meeting>,
  getMeetingsByUsers(usersID: string[]): Promise<Meeting[]>
}
export default MeetingRepository;