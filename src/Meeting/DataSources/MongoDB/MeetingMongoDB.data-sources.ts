import MeetingRepository from '../../Domain/Meeting.repository';
import IUser from '../../../User/Domain/User.interface';
import IMeeting from '../../Domain/Meeting.interface';
import MeetingModel from './MeetingMongoDB.schema';

class MeetingMongoDB implements MeetingRepository {
  public async save(meeting: IMeeting): Promise<IMeeting> {
    const newMeeting = new MeetingModel(meeting);
    return await newMeeting.save();
  }
  public async getMeetingsByUsers(users: IUser[]): Promise<IMeeting[]> {
    return await MeetingModel.find({'assistants.id':  users.map(({id}:IUser) => id)});
  }
  public async getMeetingsSortByDate(): Promise<IMeeting[]> {
    return await MeetingModel.find({}, null, {sort: {startAt: 1}});
  }
}

export default MeetingMongoDB;