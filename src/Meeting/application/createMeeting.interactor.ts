import { DateTime } from "luxon";
import IMeeting from "../domain/Meeting.interface";
import IUser from "../../User/domain/User.interface";
import MeetingRepository from "../domain/Meeting.repository";
import { parseToISODataTime, isOutTime, isTheMinimumMeetingTimeInsufficient, maxTimeExceeded, haveUsers, areThereUsersUnavailable } from "./utils/dataTimeMath";
import { MeetingBusinessErrorMessages } from "../domain/MeetingBusinessErrorMessages";

const saveMeeting = (
  meetingRepository: MeetingRepository
) => async (meeting: IMeeting): Promise<IMeeting> => {
  const startAt: DateTime = parseToISODataTime(meeting.startAt);
  const finishAt: DateTime = parseToISODataTime(meeting.finishAt);
  const {assistants} = meeting;

  // format time of meeting constraints
  if (isOutTime(startAt, finishAt))
    throw new Error(MeetingBusinessErrorMessages.OutTimeMessage);
  if (isTheMinimumMeetingTimeInsufficient(startAt, finishAt))
    throw new Error(MeetingBusinessErrorMessages.MinimumTimeInsufficient);
  if (maxTimeExceeded(startAt, finishAt))
    throw new Error(MeetingBusinessErrorMessages.MaxTimeExceeded);

  // meeting users constraints
  if (haveUsers(assistants))
    throw new Error(MeetingBusinessErrorMessages.NoUsers);
    
  const usersID: string[] = assistants.map(({id}: IUser) => id);
  const meetingsByUser: IMeeting[] = await meetingRepository.getMeetingsByUsers(usersID);

  if(areThereUsersUnavailable(meetingsByUser, startAt, finishAt)) 
    throw new Error(MeetingBusinessErrorMessages.UnavailableUser);

  return await meetingRepository.save(meeting);
};

export default saveMeeting;