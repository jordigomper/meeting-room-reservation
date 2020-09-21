import MeetingRepository from '../../Domain/Meeting.repository';
import IMeeting from '../../Domain/Meeting.interface';
import MeetingModel from './MeetingMongoDB.schema';

class MeetingMongoDB implements MeetingRepository {
  public async save(meeting: IMeeting): Promise<IMeeting> {
    const newMeeting = new MeetingModel(meeting);
    return await newMeeting.save();
  }
  public async getMeetingsByUsers(usersID: string[]): Promise<IMeeting[]> {
    return await MeetingModel.find({'assistants.id':  usersID.map((id: string) => id)}, null, {sort: {startAt: 1}});
  }
}

export default MeetingMongoDB;