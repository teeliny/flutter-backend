import {Request, Response} from 'express';

import fs from "fs";

import { obtainData } from "../utilities/dataHelper";

const values = obtainData();
interface Company {
  organization: string;
  createdAt: string;
  updatedAt: string;
  products: string[];
  marketValue: string;
  address: string;
  ceo: string;
  country: string;
  id: number;
  noOfEmployees: number;
  employees: string[];
}

//Add New Data to the database
export function addNewData(req: Request, res: Response) {
  const currentLength = values.length;
  const companyDetail: Company = {
    organization: req.body.organization,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    products: req.body.products,
    marketValue: req.body.marketValue,
    address: req.body.address,
    ceo: req.body.ceo,
    country: req.body.country,
    id: currentLength + 1,
    noOfEmployees: req.body.noOfEmployees,
    employees: req.body.employees,
  }
  values.push(companyDetail);
  console.log(values);

  const newJson = JSON.stringify(values, null, 2);
  fs.writeFileSync("./database/data.json", newJson);

  res.status(201).send({values});
}

//Get all the Data in the database
export function getAllData(_req: Request, res: Response)  {
  if (values.length === 0) {
    return res.status(400).send("No valid field");
  }
  res.status(200).send(values);
}