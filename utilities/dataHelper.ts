import fs from "fs";

export function obtainData() {
  const filePath = "./database/data.json";
  const fileContent = fs.readFileSync(filePath, {
    encoding: "utf8",
    flag: "r",
  });
  const data = JSON.parse(fileContent);
  return data;
}