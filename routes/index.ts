import express from 'express';
import { addNewData, getAllData } from '../controller';

const router = express.Router();

//Get all the data in the database
router.get('/', getAllData);

//Post data in the database
router.post('/validate-rule', addNewData);

export default router;