import IUser from "../../User/domain/User.interface";
import saveMeeting from "../application/createMeeting.interactor";
import { MeetingBusinessErrorMessages } from "../domain/MeetingBusinessErrorMessages";
import IMeeting from "../domain/Meeting.interface";
import MeetingRepository from "../domain/Meeting.repository";

class MeetingRepositoryMock implements MeetingRepository {
  meetingFakeDB: IMeeting[] = [];

  save(meeting: IMeeting): Promise<IMeeting> {
    this.meetingFakeDB.push(meeting); 
    return Promise.resolve(meeting);
  }

  getMeetingsByUsers(usersID: string[]): Promise<IMeeting[]> {
    const meetingsByUsers = this.meetingFakeDB.filter((meeting: IMeeting) => 
      meeting.assistants.some((assistants: IUser) => 
        usersID.some((userID: string) => assistants.id === userID )));
    return Promise.resolve(meetingsByUsers);
  }
}

function meetingFactory(meeting?: Partial<IMeeting>): IMeeting {
  return {
    id: meeting.id || `${Math.random() * 100000}`,
    name: meeting.name || 'fake-meeting-name',
    startAt: meeting.startAt || '2020-10-13T10:00:00.000Z',
    finishAt: meeting.finishAt || '2020-10-13T11:00:00.000Z',
    assistants: meeting.assistants || [{
      id: 'fake-id',
      name: 'fake-name',
    }],
  };
}

describe("Meeting business requirements", () => {

  let saveMeetingCommand;
    
  beforeEach(() => {
    saveMeetingCommand = saveMeeting(new MeetingRepositoryMock());
  });

  it('Se puede crear una reunión', async () => {
    const meeting: IMeeting = meetingFactory({});
    expect(await saveMeeting(new MeetingRepositoryMock())(meeting)).toBeTruthy();
  }); 

  describe('El horario laboral es de 9:00 hasta las 18:00. Ninguna reunion puede empezar antes o acabar después de esas horas', () => {

    it('debería dar error si la hora de inicio es menor a las 9A.M.', async () => {
      const meeting: IMeeting = meetingFactory({ startAt: '2020-10-13T08:00:00.000Z' });
      await expect(() => saveMeetingCommand(meeting)).rejects.toThrowError(MeetingBusinessErrorMessages.OutTimeMessage);
    });
    
    it('debería dar error si la hora de finalziación es mayor a las 6P.M.', async () => {
      const meeting: IMeeting = meetingFactory({ finishAt: '2020-10-13T19:00:00.000Z' });
      await expect(() => saveMeetingCommand(meeting)).rejects.toThrowError(MeetingBusinessErrorMessages.OutTimeMessage);
    });

  });

  it('El momento de inicio de una reunión debe ser siempre estrictamente inferior que el momento de finalización de la misma reunión', async () => {
    const meeting: IMeeting = meetingFactory({
      startAt: '2020-10-13T10:00:00.000Z',
      finishAt: '2020-10-13T10:05:00.000Z',
    });
    await expect(() => saveMeetingCommand(meeting)).rejects.toThrowError(MeetingBusinessErrorMessages.MinimumTimeInsufficient);
  });

  it('Una reunión debe empezar y terminar en el mismo día (no pueden crearse reuniónes que empiecen en el día i y terminen en el día i+1)', async () => {
    const meeting: IMeeting = meetingFactory({
      startAt: '2020-10-13T10:00:00.000Z',
      finishAt: '2020-10-14T11:00:00.000Z',
    });
    await expect(() => saveMeetingCommand(meeting)).rejects.toThrowError(MeetingBusinessErrorMessages.MaxTimeExceeded);
  });

  it('Una reunión tiene que ser atendida por mínimo un usuario, sin límite de participantes', async () => {
    const meeting: IMeeting = meetingFactory({
      assistants: [],
    });
    await expect(() => saveMeetingCommand(meeting)).rejects.toThrowError(MeetingBusinessErrorMessages.NoUsers);
  });

  it('Cada usuario puede crear reuniónes, pero la reunion solo se creara si todos los participantes tienen disponibilidad', async () => {
    const user: IUser = {
      id: 'fake-id-assistant',
      name: 'fake-name',
    };

    const userWithoutFreeTime: IUser = {
      id: 'fake-id-assistant-without-availability',
      name: 'fake-name',
    };

    const meeting1: IMeeting = meetingFactory({
      startAt: '2020-10-13T10:00:00.000Z',
      finishAt: '2020-10-13T12:00:00.000Z',
      assistants: [userWithoutFreeTime],
    });

    const meeting: IMeeting = meetingFactory({
      startAt: '2020-10-13T09:00:00.000Z',
      finishAt: '2020-10-13T12:00:00.000Z',
      assistants: [user, userWithoutFreeTime],
    });

    await saveMeetingCommand(meeting1);
    await expect(() => saveMeetingCommand(meeting)).rejects.toThrowError(MeetingBusinessErrorMessages.UnavailableUser);
  });
});