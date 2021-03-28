import Meeting from "../domain/Meeting.interface";
import MeetingRepository from "../domain/Meeting.repository";

class GetMeetingsByUserCommand {
  constructor(private meetingRepository: MeetingRepository) {}

  async exec(usersID: string[]): Promise<Meeting[]> {
    return await this.meetingRepository.getMeetingsByUsers(usersID);
  }
}

export default GetMeetingsByUserCommand;