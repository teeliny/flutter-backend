import {Request, Response} from 'express';

import fs from "fs";

import { obtainData } from "../utilities/dataHelper";

const values = obtainData();

interface IOutput {
  "message": string,
  "status": string,
  "data": string | object | number | null,
}
const output: IOutput = {
  "message": "",
  "status": "",
  "data": "",
}

interface IRule {
  field: string,
  condition: string,
  condition_value: string | number | object,
}
interface IData {
  [key: string]: string | number | object | null | any
}

interface IBody {
  rule: IRule,
  data: IData
}

//Add New Data to the database
export function addNewData(req: Request, res: Response) {
  const { rule, data }: IBody = req.body;
  if (!rule || typeof rule === 'number') {
    output.message = rule ? `rule should be an object.` : `rule is required.`;
    output.status = "error";
    output.data = null;
    res.status(400).send({...output});
  }
  // Validate the keys in rule
  const defaultKeys = ['field', 'condition', 'condition_value'];
  const defaultTypes = ['string', 'string', 'string or number or object'];
  const ruleKeys = Object.keys(rule);

  ruleKeys.map(item => {
    if ((item === 'field' && typeof rule[item] === 'string') || (item === 'condition' && typeof rule[item] === 'string') || (item === 'condition_value' && typeof rule[item] !== null)) {
      defaultKeys.splice(defaultKeys.indexOf(item), 1);
    }
    else {
      output.message = `${item} should be of type ${defaultTypes[defaultKeys.indexOf(item)]}.`;
      output.status = "error";
      output.data = null;
      res.status(400).send({...output});
    }

  })
  if (ruleKeys.length !== 3 || defaultKeys.length > 0) {
    output.message = `${defaultKeys[0]} is required.`;
    output.status = "error";
    output.data = null;
    res.status(400).send({...output});
  }
  const mainField = rule.field.split('.');
  const fieldArray = mainField.map(item => [item]);
  

  console.log(fieldArray);

  res.status(201).send({data: 'working'});
}

//Get all the Data in the database
export function getAllData(_req: Request, res: Response)  {
  if (values.length === 0) {
    return res.status(400).send("No valid field");
  }
  output.message = "My Rule-Validation API";
  output.status = "success";
  output.data = values[0];
  res.status(200).send(output);
}