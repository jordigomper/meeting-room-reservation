import { Router, Response, Request } from 'express';
import { saveMeetingCommand, getMeetingsByUsers } from '../../application/index';
import Meeting from '../../domain/Meeting.interface';
import { extractArray } from './utils/queryParams';
 
const Api = Router(); 

const saveMeetingController = async (req: Request, res: Response) => {
  try {
    const meeting: Meeting = req.body;  
    const response = await saveMeetingCommand(meeting);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};
const getMeetingsByUsersController = async (req: Request, res: Response) => {
  try {
    const usersID: string[] = extractArray(req);
    const response: Meeting[] = await getMeetingsByUsers(usersID);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

Api.route('/meet')
  .post(saveMeetingController)
  .get(getMeetingsByUsersController);

export default Api;