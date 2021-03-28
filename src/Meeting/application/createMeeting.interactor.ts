import { DateTime } from "luxon";
import IMeeting from "../domain/Meeting.interface";
import IUser from "../../User/domain/User.interface";
import MeetingRepository from "../domain/Meeting.repository";
import { parseToISODataTime, isOutTime, isTheMinimumMeetingTimeInsufficient, isSameDay, haveUsers, areThereUsersUnavailable } from "./utils/dataTimeMath";

const saveMeeting = (
  meetingRepository: MeetingRepository
) => async (meeting: IMeeting): Promise<IMeeting> => {
  const startAt: DateTime = parseToISODataTime(meeting.startAt);
  const finishAt: DateTime = parseToISODataTime(meeting.finishAt);
  const {assistants} = meeting;

  // format time of meeting constraints
  if (isOutTime(startAt, finishAt))
    throw new Error('No se pueden crear reuniónes fuera del rango establecido');
  if (isTheMinimumMeetingTimeInsufficient(startAt, finishAt))
    throw new Error('La duración mínima de la reunión debe de ser de 30 minutos.');
  if (!isSameDay(startAt, finishAt))
    throw new Error('La reunión no puede exceder de un día.');

  // meeting users constraints
  if (haveUsers(assistants))
    throw new Error('Se ha de añadir mínimo un participante en la reunión.');
    
  const usersID: string[] = assistants.map(({id}: IUser) => id);
  const meetingsByUser: IMeeting[] = await meetingRepository.getMeetingsByUsers(usersID);
  if(areThereUsersUnavailable(meetingsByUser, startAt, finishAt)) 
    throw new Error('Hay usuarios que no tiene disponibilidad para esta reunión.');

  return await meetingRepository.save(meeting);
};

export default saveMeeting;