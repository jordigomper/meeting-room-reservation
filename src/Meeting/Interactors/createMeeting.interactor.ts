import { DateTime } from "luxon";
import IMeeting from "../Domain/Meeting.interface";
import MeetingRepository from "../Domain/Meeting.repository";

const saveMeeting = (
  meetingRepository: MeetingRepository
) => async (meeting: IMeeting): Promise<boolean> => {
  const startAtISODataTime = DateTime.fromISO(meeting.startAt, { setZone: true });
  const finishAtISODataTime = DateTime.fromISO(meeting.finishAt, { setZone: true });
  if(startAtISODataTime.hour < 9 || finishAtISODataTime.hour  > 18) throw 'No se pueden crear reuniónes fuera del rango establecido';
  return meetingRepository.save(meeting);
};

export default saveMeeting;