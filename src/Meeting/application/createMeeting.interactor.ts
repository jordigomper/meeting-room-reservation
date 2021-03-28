import { DateTime } from "luxon";
import IMeeting from "../domain/Meeting.interface";
import IUser from "../../User/domain/User.interface";
import MeetingRepository from "../domain/Meeting.repository";
import { parseToISODataTime, isOutTime, isTheMinimumMeetingTimeInsufficient, maxTimeExceeded, haveUsers, areThereUsersUnavailable } from "./utils/dataTimeMath";
import { MeetingErrorMessages } from "./MeetingErrorMessages";

const saveMeeting = (
  meetingRepository: MeetingRepository
) => async (meeting: IMeeting): Promise<IMeeting> => {
  const startAt: DateTime = parseToISODataTime(meeting.startAt);
  const finishAt: DateTime = parseToISODataTime(meeting.finishAt);
  const {assistants} = meeting;

  // format time of meeting constraints
  if (isOutTime(startAt, finishAt))
    throw new Error(MeetingErrorMessages.OutTimeMessage);
  if (isTheMinimumMeetingTimeInsufficient(startAt, finishAt))
    throw new Error(MeetingErrorMessages.MinimumTimeInsufficient);
  if (maxTimeExceeded(startAt, finishAt))
    throw new Error(MeetingErrorMessages.MaxTimeExceeded);

  // meeting users constraints
  if (haveUsers(assistants))
    throw new Error(MeetingErrorMessages.NoUsers);
    
  const usersID: string[] = assistants.map(({id}: IUser) => id);
  const meetingsByUser: IMeeting[] = await meetingRepository.getMeetingsByUsers(usersID);

  if(areThereUsersUnavailable(meetingsByUser, startAt, finishAt)) 
    throw new Error(MeetingErrorMessages.UnavailableUser);

  return await meetingRepository.save(meeting);
};

export default saveMeeting;