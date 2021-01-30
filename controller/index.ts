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
export function addNewData(body: IBody) {
  const {rule, data }=  body;

  // Check if there is no rule or the type of rule is a number
  if (!rule || typeof rule === 'number') {
    output.message = rule ? `rule should be an object.` : `rule is required.`;
    output.status = "error";
    output.data = null;
    return { output, code: 400 };
  }

  // Validate the keys in rule
  const defaultKeys = ['field', 'condition', 'condition_value'];
  const defaultTypes = ['string', 'string', 'string or number or object'];
  const ruleKeys = Object.keys(rule);

  // Check the key and it's corresponding type. If it's correct, remove it from defaultKeys else return code 400
  ruleKeys.map(item => {
    if ((item === 'field' && typeof rule[item] === 'string') || (item === 'condition' && typeof rule[item] === 'string') || (item === 'condition_value' && typeof rule[item] !== null)) {
      defaultKeys.splice(defaultKeys.indexOf(item), 1);
    }
    else {
      output.message = `${item} should be of type ${defaultTypes[defaultKeys.indexOf(item)]}.`;
      output.status = "error";
      output.data = null;
      return { output, code: 400 };
      // res.status(400).send({ ...output });
    }
  });

  // If all the three keys are not present return status 400
  if (ruleKeys.length !== 3 || defaultKeys.length > 0) {
    output.message = `${defaultKeys[0]} is required.`;
    output.status = "error";
    output.data = null;
    return { output, code: 400 };
    // res.status(400).send({...output});
  }
  
  // Stringify the entire path to the required field and obtain the value using eval
  const stringifyField = `data.${rule.field}`;
  const value = eval(stringifyField);

  if (!value) {
    output.message = `field ${rule.field} is missing from data.`;
    output.status = "error";
    output.data = null;
    return { output, code: 400 };
    // res.status(400).send({...output});
  }

  // Get present condition and oby=tain a boolean value if the condition is meant or not
  const mainField = rule.field;
  const presentCondition = rule.condition;
  let bool;
  
  bool = presentCondition === 'gt' ? value > rule.condition_value :
    presentCondition === 'gte' ? value >= rule.condition_value :
      presentCondition === '===' ? value === rule.condition_value :
        presentCondition === '!==' ? value !== rule.condition_value :
          presentCondition === 'contains' ? value.includes(rule.condition_value) : null;

  // If the condition is not meant
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
    // res.status(400).send({...output});
    return { output, code: 400 };
  }

  // Condition is meant
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
  // res.status(200).send({...output});
  return { output, code: 200 };
}

//Get all the Data in the database
export function getAllData()  {
  output.message = "My Rule-Validation API";
  output.status = "success";
  output.data = values[0];
  return output;
}