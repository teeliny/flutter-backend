import {Request, Response} from 'express';
import { obtainData } from "../utilities/dataHelper";
import {IOutput, IBody} from "../interface/typings";

const values = obtainData();

const output: IOutput = {
  "message": "",
  "status": "",
  "data": "",
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
  
  const stringifyField = `data.${rule.field}`;
  const value = eval(stringifyField);

  if (!value) {
    output.message = `field ${rule.field} is missing from data.`;
    output.status = "error";
    output.data = null;
    res.status(400).send({...output});
  }
  const mainField = rule.field;
  const presentCondition = rule.condition;
  let bool;
  
  bool = presentCondition === 'gt' ? value > rule.condition_value :
    presentCondition === 'gte' ? value >= rule.condition_value :
      presentCondition === '===' ? value === rule.condition_value :
        presentCondition === '!==' ? value !== rule.condition_value :
          presentCondition === 'contains' ? value.includes(rule.condition_value) : null;


  if (!bool) {
    output.message = `field ${rule.field} failed validation.`;
    output.status =  "error",
    output.data = {
      validation: {
        error: false,
        field: rule.field,
        field_value: value,
        condition: rule.condition,
        condition_value: rule.condition_value
      }
    }
    res.status(400).send({...output});
  }

  output.message = `field ${mainField} successfully validated.`;
  output.status = 'success';
  output.data = {
    validation: {
      error: false,
      field: `${mainField}`,
      field_value: value,
      condition: rule.condition,
      condition_value: rule.condition_value
    }
  }
  res.status(200).send({...output});
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