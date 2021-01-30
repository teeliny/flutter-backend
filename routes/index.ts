import express, {Request, Response} from 'express';
import { addNewData, getAllData } from '../controller';
import {IOutput, IBody} from "../interface/typings";

const router = express.Router();

//Get all the data in the database
router.get('/', function getRoute(_req: Request, res: Response) {
  const data = getAllData();
  if (!data.data) res.status(400).send({message: 'Oops! something went wrong' });
  res.status(200).send({ ...data });
});

//Post data in the database
router.post('/validate-rule', function postRoute(req: Request, res: Response) {
  const body = req.body;
  const {output, code} = addNewData(body);
  res.status(code).send({ ...output });
});

export default router;