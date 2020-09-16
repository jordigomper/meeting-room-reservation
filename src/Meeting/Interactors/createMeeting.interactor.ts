import { DateTime } from "luxon";
import IMeeting from "../Domain/Meeting.interface";
import MeetingRepository from "../Domain/Meeting.repository";

const saveMeeting = (
  meetingRepository: MeetingRepository
) => async (meeting: IMeeting): Promise<boolean> => {
  const {startAt, finishAt} = meeting;
  if(DateTime.fromISO(startAt, { setZone: true }).hour < 9 || DateTime.fromISO(finishAt, { setZone: true }).hour  > 18) throw 'No se pueden crear reuniónes fuera del rango establecido';
  return meetingRepository.save(meeting);
};

export default saveMeeting;