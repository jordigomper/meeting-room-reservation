import { Router, Response, Request } from 'express';
import { createMeetingCommand, getMeetingsByUsersCommand } from '../../application/index';
import Meeting from '../../domain/Meeting.interface';
import { extractArray } from './utils/queryParams';
 
const Api = Router(); 

const createMeetingController = async (req: Request, res: Response) => {
  try {
    const meeting: Meeting = req.body;  
    const response = await createMeetingCommand.exec(meeting);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
const getMeetingsByUsersController = async (req: Request, res: Response) => {
  try {
    const usersID: string[] = extractArray(req);
    const response: Meeting[] = await getMeetingsByUsersCommand.exec(usersID);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

Api.route('/meet')
  .post(createMeetingController)
  .get(getMeetingsByUsersController);

export default Api;