import { DateTime } from "luxon";
import IUser from "../../User/Domain/User.interface";
import IMeeting from "../Domain/Meeting.interface";
import MeetingRepository from "../Domain/Meeting.repository";

const saveMeeting = (
  meetingRepository: MeetingRepository
) => async (meeting: IMeeting): Promise<IMeeting> => {
  const startAt: DateTime = parseToISODataTime(meeting.startAt);
  const finishAt: DateTime = parseToISODataTime(meeting.finishAt);
  const {assistants} = meeting;

  // format time of meeting constraints
  if (isOutTime(startAt, finishAt))
    throw 'No se pueden crear reuniónes fuera del rango establecido';
  if (isTheMinimumMeetingTimeInsufficient(startAt, finishAt))
    throw 'La duración mínima de la reunión debe de ser de 30 minutos.';
  if (!isSameDay(startAt, finishAt))
    throw 'La reunión no puede exceder de un día.';

  // meeting users constraints
  if (haveUsers(assistants))
    throw 'Se ha de añadir mínimo un participante en la reunión.';
  const meetingsByUser: IMeeting[] = await meetingRepository.getMeetingsByUsers(assistants);
  if(areThereUsersUnavailable(meetingsByUser, startAt, finishAt)) 
    throw 'Hay usuarios que no tiene disponibilidad para esta reunión.';

  return await meetingRepository.save(meeting);
};

export default saveMeeting;

/**
 * 
 * Utils
 */
function parseToISODataTime(dataTime: string): DateTime {
  return DateTime.fromISO(dataTime, { setZone: true });
}

function isMeetingsInSameTime(startAtDate1: DateTime, finishAtDate1: DateTime, startAtDate2: DateTime, finishAtDate2: DateTime) {
  return isSameDay(startAtDate1, startAtDate2) && timeOverlaps(startAtDate1, finishAtDate1, startAtDate2, finishAtDate2);
}

function haveUsers(assistants: IUser[]) {
  return !assistants.length;
}

function isTheMinimumMeetingTimeInsufficient(startAt: DateTime, finishAt: DateTime) {
  return finishAt.diff(startAt, 'minute').minutes < 30;
}

function isOutTime(startAt: DateTime, finishAt: DateTime) {
  return startAt.hour < 9 || finishAt.hour > 18;
}

function isSameDay(date1: DateTime, date2: DateTime): boolean {
  return date1.hasSame(date2, 'day') && date1.hasSame(date2, 'month') && date1.hasSame(date2, 'year');
}

export function timeOverlaps(startAtDate1: DateTime, finishAtDate1: DateTime, startAtDate2: DateTime, finishAtDate2: DateTime): boolean {
          // empieza misma hora
  return startAtDate1.hasSame(startAtDate2, 'minute') 
          || finishAtDate1.hasSame(finishAtDate2, 'minute')
          // empieza antes acaba igual o después
          || startAtDate2.diff(startAtDate1, 'hour').hours > 0
          && startAtDate2.diff(finishAtDate1, 'hour').hours <= 0
          // empieza en mitad de una reuniçon
          || startAtDate2.diff(startAtDate1, 'hour').hours < 0
          && finishAtDate2.diff(startAtDate1, 'hour').hours > 0;
}

function areThereUsersUnavailable(meetingsByUser: IMeeting[], startAt: DateTime, finishAt: DateTime): boolean {
  return meetingsByUser.some((meeting: IMeeting) => {
    const meetingStartDataTime = parseToISODataTime(meeting.startAt);
    const meetingFinishDataTime = parseToISODataTime(meeting.finishAt);
    return isMeetingsInSameTime(startAt, finishAt, meetingStartDataTime, meetingFinishDataTime);
  });
}