import { DateTime } from "luxon";
import Meeting from "../domain/Meeting.interface";
import User from "../../User/domain/User.interface";
import MeetingRepository from "../domain/Meeting.repository";
import { parseToISODataTime, isOutTime, isTheMinimumMeetingTimeInsufficient, maxTimeExceeded as isMaxTimeExceeded, haveUsers, areThereUsersUnavailable } from "./utils/meetingBusinessContraints";
import { MeetingBusinessErrorMessages } from "../domain/MeetingBusinessErrorMessages";

class CreateMeetingCommand {
  constructor(private meetingRepository: MeetingRepository) {} 

  async exec(meeting: Meeting): Promise<Meeting> {
    const startAt: DateTime = parseToISODataTime(meeting.startAt);
    const finishAt: DateTime = parseToISODataTime(meeting.finishAt);
    const {assistants} = meeting;

    // format time of meeting constraints
    if (isOutTime(startAt, finishAt))
      throw new Error(MeetingBusinessErrorMessages.OutTimeMessage);
    if (isTheMinimumMeetingTimeInsufficient(startAt, finishAt))
      throw new Error(MeetingBusinessErrorMessages.MinimumTimeInsufficient);
    if (isMaxTimeExceeded(startAt, finishAt))
      throw new Error(MeetingBusinessErrorMessages.MaxTimeExceeded);

    // meeting users constraints
    if (haveUsers(assistants))
      throw new Error(MeetingBusinessErrorMessages.NoUsers);
      
    const meetingsByUser: Meeting[] = await this.getMeetingByUser(assistants);

    if(areThereUsersUnavailable(meetingsByUser, startAt, finishAt)) 
      throw new Error(MeetingBusinessErrorMessages.UnavailableUser);

    return await this.meetingRepository.save(meeting);
  }


  private async getMeetingByUser(assistants: User[]) {
    const usersID: string[] = assistants.map(({ id }: User) => id);
    const meetingsByUser: Meeting[] = await this.meetingRepository.getMeetingsByUsers(usersID);
    return meetingsByUser;
  }
} 

export default CreateMeetingCommand;