import MeetingRepository from '../../../domain/Meeting.repository';
import Meeting from '../../../domain/Meeting.interface';
import MeetingModel from './MeetingMongoDB.schema';

class MeetingMongoDB implements MeetingRepository {
  public async save(meeting: Meeting): Promise<Meeting> {
    const newMeeting = new MeetingModel(meeting);
    return await newMeeting.save();
  }
  public async getMeetingsByUsers(usersID: string[]): Promise<Meeting[]> {
    const criteria = usersID.length > 0 
                      ? {'assistants.id': [...usersID]} 
                      : null;
    return await MeetingModel.find(criteria, null, {sort: {startAt: 1}});
  }
}

export default MeetingMongoDB;