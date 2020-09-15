import IUser from '../../User/Domain/User.interface';

interface IMeeting {
  id: string,
  name: string,
  startAt: string,
  finishAt: string,
  assistants: IUser[]
}

export default IMeeting;