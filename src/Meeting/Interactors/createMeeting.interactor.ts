import { DateTime } from "luxon";
import IUser from "../../User/Domain/User.interface";
import IMeeting from "../Domain/Meeting.interface";
import MeetingRepository from "../Domain/Meeting.repository";

const saveMeeting = (
  meetingRepository: MeetingRepository
) => async (meeting: IMeeting): Promise<boolean> => {
  const startAtISODataTime: DateTime = parseToISODataTime(meeting.startAt);
  const finishAtISODataTime: DateTime = parseToISODataTime(meeting.finishAt);
  checkBusinessRulesOfMeetingTimeFormat(startAtISODataTime, finishAtISODataTime);
  await checkBusinessRulesOfUsers(meeting.assistants, meetingRepository, startAtISODataTime, finishAtISODataTime);
  return meetingRepository.save(meeting);
};

export default saveMeeting;

/**
 * 
 * Utils
 */

function parseToISODataTime(dataTime: string): DateTime {
  return DateTime.fromISO(dataTime, { setZone: true });
}

async function checkBusinessRulesOfUsers(assistants: IUser[], meetingRepository: MeetingRepository, startAtISODataTime: DateTime, finishAtISODataTime: DateTime) {
  if (haveUsers(assistants))
    throw 'Se ha de añadir mínimo un participante en la reunión.';

  const meetingsByUser: IMeeting[] = await meetingRepository.getMeetingByUsers(assistants);

  meetingsByUser.map((meeting: IMeeting) => {
    const meetingStartDataTime = parseToISODataTime(meeting.startAt);
    const meetingFinishDataTime = parseToISODataTime(meeting.finishAt);

    if (isMeetingsInSameTime(startAtISODataTime, finishAtISODataTime, meetingStartDataTime, meetingFinishDataTime)) {
      throw 'Hay usuarios que no tiene disponibilidad para esta reunión.';
    }
  });
}

function checkBusinessRulesOfMeetingTimeFormat(startAtISODataTime: DateTime, finishAtISODataTime: DateTime) {
  if (isOutTime(startAtISODataTime, finishAtISODataTime))
    throw 'No se pueden crear reuniónes fuera del rango establecido';
  if (isTheMinimumMeetingTimeInsufficient(finishAtISODataTime, startAtISODataTime))
    throw 'La duración mínima de la reunión debe de ser de 30 minutos.';
  if (isTheMaximumTimeExceeded(finishAtISODataTime, startAtISODataTime))
    throw 'La duración máxima de una reunión es de 8 horas.';
}

function isMeetingsInSameTime(startAtISODataTime: DateTime, finishAtISODataTime: DateTime, meetingStartDataTime: DateTime, meetingFinishDataTime: DateTime) {
  return startAtISODataTime.diff(meetingStartDataTime, 'hour').hours < 0
    && meetingFinishDataTime.diff(finishAtISODataTime, 'hour').hours < 0
    || startAtISODataTime.diff(meetingStartDataTime, 'hour').hours > 0
    || meetingFinishDataTime.diff(finishAtISODataTime, 'hour').hours > 0;
}

function haveUsers(assistants: IUser[]) {
  return !assistants.length;
}

function isTheMaximumTimeExceeded(finishAtISODataTime: DateTime, startAtISODataTime: DateTime) {
  return finishAtISODataTime.diff(startAtISODataTime, 'day').days > 1;
}

function isTheMinimumMeetingTimeInsufficient(finishAtISODataTime: DateTime, startAtISODataTime: DateTime) {
  return finishAtISODataTime.diff(startAtISODataTime, 'minute').minutes < 30;
}

function isOutTime(startAtISODataTime: DateTime, finishAtISODataTime: DateTime) {
  return startAtISODataTime.hour < 9 || finishAtISODataTime.hour > 18;
}
