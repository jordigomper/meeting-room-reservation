import MeetingRepository from '../../../domain/Meeting.repository';
import IMeeting from '../../../domain/Meeting.interface';
import MeetingModel from './MeetingMongoDB.schema';

class MeetingMongoDB implements MeetingRepository {
  public async save(meeting: IMeeting): Promise<IMeeting> {
    const newMeeting = new MeetingModel(meeting);
    return await newMeeting.save();
  }
  public async getMeetingsByUsers(usersID: string[]): Promise<IMeeting[]> {
    const criteria = usersID.length > 0 
                      ? {'assistants.id': [...usersID]} 
                      : null;
    return await MeetingModel.find(criteria, null, {sort: {startAt: 1}});
  }
}

export default MeetingMongoDB;