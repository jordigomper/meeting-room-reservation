import { DateTime } from "luxon";
import IUser from "../../../User/domain/User.interface";
import IMeeting from "../../domain/Meeting.interface";

export function parseToISODataTime(dataTime: string): DateTime {
  return DateTime.fromISO(dataTime, { setZone: true });
}
export function haveUsers(assistants: IUser[]): boolean {
  return !assistants.length;
}
export function isTheMinimumMeetingTimeInsufficient(startAt: DateTime, finishAt: DateTime): boolean {
  return finishAt.diff(startAt, 'minute').minutes < 30;
}
export function isOutTime(startAt: DateTime, finishAt: DateTime): boolean {
  return startAt.hour < 9 || finishAt.hour > 18;
}
function isSameDay(date1: DateTime, date2: DateTime): boolean {
  return date1.hasSame(date2, 'day') && date1.hasSame(date2, 'month') && date1.hasSame(date2, 'year');
}
export function maxTimeExceeded(date1: DateTime, date2: DateTime): boolean {
  return !isSameDay(date1, date2);
}
export function areThereUsersUnavailable(meetingsByUser: IMeeting[], startAt: DateTime, finishAt: DateTime): boolean {
  return meetingsByUser.some((meeting: IMeeting) => {
    const meetingStartDataTime = parseToISODataTime(meeting.startAt);
    const meetingFinishDataTime = parseToISODataTime(meeting.finishAt);
    return isMeetingsInSameTime(startAt, finishAt, meetingStartDataTime, meetingFinishDataTime);
  });
}
function timeOverlaps(startAtDate1: DateTime, finishAtDate1: DateTime, startAtDate2: DateTime, finishAtDate2: DateTime): boolean {
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
function isMeetingsInSameTime(startAtDate1: DateTime, finishAtDate1: DateTime, startAtDate2: DateTime, finishAtDate2: DateTime) {
  return isSameDay(startAtDate1, startAtDate2) && timeOverlaps(startAtDate1, finishAtDate1, startAtDate2, finishAtDate2);
}
