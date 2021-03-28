import User from '../../User/domain/User.interface';

interface Meeting {
  id: string,
  name: string,
  startAt: string,
  finishAt: string,
  assistants: User[]
}

export default Meeting;