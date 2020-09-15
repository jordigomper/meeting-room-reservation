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
    };
    expect(await saveMeeting(MeetingRepositoryMock)(meeting)).toBeTruthy();
  }); 
  // xit('El horario laboral es de 9:00 hasta las 18:00. Ninguna reunion puede empezar antes o acabar después de esas horas', () => {});
  // xit('El momento de inicio de una reunión debe ser siempre estrictamente inferior que el momento de finalización de la misma reunión', () => {});
  // xit('Una reunión debe empezar y terminar en el mismo día (no pueden crearse reuniones que empiecen en el día i y terminen en el día i+1)', () => {});
  // xit('Una reunión tiene que ser atendida por mínimo un usuario, sin límite de participantes', () => {});
  // xit('Cada usuario puede crear reuniones, pero la reunion solo se creara si todos los participantes tienen disponibilidad', () => {});
});