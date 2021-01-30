export interface IOutput {
  "message": string,
  "status": string,
  "data": string | object | number | null,
}

export interface IRule {
  field: string,
  condition: string,
  condition_value: string | number | object,
}
export interface IData {
  [key: string]: string | number | object | null | any
}

export interface IBody {
  rule: IRule,
  data: IData
}