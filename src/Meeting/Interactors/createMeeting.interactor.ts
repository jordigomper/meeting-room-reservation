import { DateTime } from "luxon";
import IMeeting from "../Domain/Meeting.interface";
import MeetingRepository from "../Domain/Meeting.repository";

const saveMeeting = (
  meetingRepository: MeetingRepository
) => async (meeting: IMeeting): Promise<boolean> => {
  const startAtISODataTime = DateTime.fromISO(meeting.startAt, { setZone: true });
  const finishAtISODataTime = DateTime.fromISO(meeting.finishAt, { setZone: true });
  const {assistants} = meeting;
  if(startAtISODataTime.hour < 9 || finishAtISODataTime.hour  > 18) throw 'No se pueden crear reuniónes fuera del rango establecido';
  if(finishAtISODataTime.diff(startAtISODataTime, 'minute').values.minutes < 30) throw 'La duración mínima de la reunión debe de ser de 30 minutos.';
  if(finishAtISODataTime.diff(startAtISODataTime, 'day').values.days > 1) throw 'La duración máxima de una reunión es de 8 horas.';
  if(!assistants.length) throw 'Se ha de añadir mínimo un participante en la reunión.';
  return meetingRepository.save(meeting);
};

export default saveMeeting;