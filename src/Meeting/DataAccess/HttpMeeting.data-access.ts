import { Router, Response, Request } from 'express';
import { saveMeeting, getMeetingsByUsers } from '../Interactors/index';
import IMeeting from '../Domain/Meeting.interface';
import { extractArray } from './utils/queryParams';
 
const Api = Router(); 

const saveMeetingController = async (req: Request, res: Response) => {
  try {
    const meeting: IMeeting = req.body;  
    const response = await saveMeeting(meeting);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};
const getMeetingsByUsersController = async (req: Request, res: Response) => {
  try {
    const usersID: string[] = extractArray(req);
    const response: IMeeting[] = await getMeetingsByUsers(usersID);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

Api.route('/meet')
  .post(saveMeetingController)
  .get(getMeetingsByUsersController);

export default Api;