import express from 'express';
var router = express.Router();
import { addNewData, getAllData } from '../controller';


//Get all the Company in the database
router.get('/', getAllData);

//Get all the Company in the database
router.post('/', addNewData);

export default router;