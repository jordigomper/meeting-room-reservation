import IUser from "../../User/Domain/User.interface";
import IMeeting from "../Domain/Meeting.interface";
import MeetingRepository from "../Domain/Meeting.repository";
import saveMeeting from "../Interactors/createMeeting.interactor";

describe("Meeting business requirements", () => {
  it('Se puede crear una reunión', async () => {
    const assistants: IUser = {
      id: 'fake-id',
      name: 'fake-name',
    };
    const meeting: IMeeting = {
      id: 'fake-meeting-id',
      name: 'fake-meeting-name',
      startAt: '2020-10-13T10:00:00.000Z',
      finishAt: '2020-10-13T11:00:00.000Z',
      assistants: [assistants],
    };
    const MeetingRepositoryMock: MeetingRepository = {
      save: (meeting: IMeeting) => Promise.resolve(true),
      getMeetingByUser: (users: IUser[]) => Promise.resolve([]),
    };
    expect(await saveMeeting(MeetingRepositoryMock)(meeting)).toBeTruthy();
  }); 
  describe('El horario laboral es de 9:00 hasta las 18:00. Ninguna reunion puede empezar antes o acabar después de esas horas', () => {
    it('debería dar error si la hora de inicio es menor a las 9A.M.', async (done) => {
      const assistants: IUser = {
        id: 'fake-id',
        name: 'fake-name',
      };
      const meeting: IMeeting = {
        id: 'fake-meeting-id',
        name: 'fake-meeting-name',
        startAt: '2020-10-13T08:00:00.000Z',
        finishAt: '2020-10-13T11:00:00.000Z',
        assistants: [assistants],
      };
      const MeetingRepositoryMock: MeetingRepository = {
        save: (meeting: IMeeting) => Promise.resolve(true),
        getMeetingByUser: (users: IUser[]) => Promise.resolve([]),
      };
      try {
        await saveMeeting(MeetingRepositoryMock)(meeting);
      } catch (error) {
        expect(error).toEqual('No se pueden crear reuniónes fuera del rango establecido');
        done();
      }
    });
    it('debería dar error si la hora de finalziación es mayor a las 6P.M.', async (done) => {
      const assistants: IUser = {
        id: 'fake-id',
        name: 'fake-name',
      };
      const meeting: IMeeting = {
        id: 'fake-meeting-id',
        name: 'fake-meeting-name',
        startAt: '2020-10-13T10:00:00.000Z',
        finishAt: '2020-10-13T19:00:00.000Z',
        assistants: [assistants],
      };
      const MeetingRepositoryMock: MeetingRepository = {
        save: (meeting: IMeeting) => Promise.resolve(true),
        getMeetingByUser: (users: IUser[]) => Promise.resolve([]),
      };
      try {
        await saveMeeting(MeetingRepositoryMock)(meeting);
      } catch (error) {
        expect(error).toEqual('No se pueden crear reuniónes fuera del rango establecido');
        done();
      }
    });
  });
  it('El momento de inicio de una reunión debe ser siempre estrictamente inferior que el momento de finalización de la misma reunión', async (done) => {
    const assistants: IUser = {
      id: 'fake-id',
      name: 'fake-name',
    };
    const meeting: IMeeting = {
      id: 'fake-meeting-id',
      name: 'fake-meeting-name',
      startAt: '2020-10-13T10:00:00.000Z',
      finishAt: '2020-10-13T10:05:00.000Z',
      assistants: [assistants],
    };
    const MeetingRepositoryMock: MeetingRepository = {
      save: (meeting: IMeeting) => Promise.resolve(true),
      getMeetingByUser: (users: IUser[]) => Promise.resolve([]),
    };
    try {
      await saveMeeting(MeetingRepositoryMock)(meeting);
    } catch (error) {
      expect(error).toEqual('La duración mínima de la reunión debe de ser de 30 minutos.');
      done();
    }
  });
  it('Una reunión debe empezar y terminar en el mismo día (no pueden crearse reuniones que empiecen en el día i y terminen en el día i+1)', async (done) => {
    const assistants: IUser = {
      id: 'fake-id',
      name: 'fake-name',
    };
    const meeting: IMeeting = {
      id: 'fake-meeting-id',
      name: 'fake-meeting-name',
      startAt: '2020-10-13T10:00:00.000Z',
      finishAt: '2020-10-14T11:00:00.000Z',
      assistants: [assistants],
    };
    const MeetingRepositoryMock: MeetingRepository = {
      save: (meeting: IMeeting) => Promise.resolve(true),
      getMeetingByUser: (users: IUser[]) => Promise.resolve([]),
    };
    try {
      await saveMeeting(MeetingRepositoryMock)(meeting);
    } catch (error) {
      expect(error).toEqual('La duración máxima de una reunión es de 8 horas.');
      done();
    }
  });
  it('Una reunión tiene que ser atendida por mínimo un usuario, sin límite de participantes', async (done) => {
    const meeting: IMeeting = {
      id: 'fake-meeting-id',
      name: 'fake-meeting-name',
      startAt: '2020-10-13T10:00:00.000Z',
      finishAt: '2020-10-13T11:00:00.000Z',
      assistants: [],
    };
    const MeetingRepositoryMock: MeetingRepository = {
      save: (meeting: IMeeting) => Promise.resolve(true),
      getMeetingByUser: (users: IUser[]) => Promise.resolve([]),
    };

    try {
      await saveMeeting(MeetingRepositoryMock)(meeting);
    } catch (error) {
      expect(error).toEqual('Se ha de añadir mínimo un participante en la reunión.');
      done();
    }
  });
  it('Cada usuario puede crear reuniones, pero la reunion solo se creara si todos los participantes tienen disponibilidad', async (done) => {
    const assistants: IUser = {
      id: 'fake-id-assistant',
      name: 'fake-name',
    };
    const userWithoutFreeTime: IUser = {
      id: 'fake-id-assistant-without-availability',
      name: 'fake-name',
    };
    const meetingFakeDB = [{
      id: 'fake-meeting-id',
      name: 'fake-meeting-name',
      startAt: '2020-10-13T10:00:00.000Z',
      finishAt: '2020-10-13T11:00:00.000Z',
      assistants: [userWithoutFreeTime],
    }];
    const meeting: IMeeting = {
      id: 'fake-meeting-id',
      name: 'fake-meeting-name',
      startAt: '2020-10-13T09:00:00.000Z',
      finishAt: '2020-10-13T12:00:00.000Z',
      assistants: [assistants, userWithoutFreeTime],
    };
    const MeetingRepositoryMock: MeetingRepository = {
      save: (meeting: IMeeting) => {
        meetingFakeDB.push(meeting); 
        return Promise.resolve(true);
      },
      getMeetingByUser: (users: IUser[]) => {
        const meetingsByUsers = meetingFakeDB.filter((meeting: IMeeting) => 
          meeting.assistants.some((assistants: IUser) => 
            users.some((user: IUser) => assistants.id === user.id )));
        return Promise.resolve(meetingsByUsers);
      },
    };
    try {
      await saveMeeting(MeetingRepositoryMock)(meeting);
    } catch (error) {
      expect(error).toEqual('Hay usuarios que no tiene disponibilidad para esta reunión.');
      done();
    }
  });
});