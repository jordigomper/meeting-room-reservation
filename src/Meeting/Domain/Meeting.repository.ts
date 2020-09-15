import IMeeting from "./Meeting.interface";

interface MeetingRepository {
  save(meeting: IMeeting): Promise<boolean>,
}
export default MeetingRepository;