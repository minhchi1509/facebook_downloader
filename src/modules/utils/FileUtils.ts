import path from "path";
import fs from "fs";

class FileUtils {
  static writeToFile = (absolutePath: string, content: any) => {
    const dir = path.dirname(absolutePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(absolutePath, content);
  };

  static readObjectFromJsonFile = <T>(absolutePath: string) => {
    if (!fs.existsSync(absolutePath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(absolutePath, "utf-8")) as T;
  };
}

export default FileUtils;
