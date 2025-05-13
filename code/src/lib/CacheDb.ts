import fs from "node:fs/promises";
import path from "node:path";

export const TIMEDIFF = 60 * 10;

export const ensureDir = async (dirPath: string): Promise<void> => {
  try {
    await fs.access(dirPath);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`Directory created: ${dirPath}`);
    } else {
      throw error;
    }
  }
};

export const deleteFile = async (fileName: string) => {
  try {
    await fs.unlink(fileName);
  } catch (error) {
    console.error(`Error deleting folder "${fileName}":`, error);
  }
};

export const clearFile = async (fileName: string) => {
  console.log("clear file: fileName: ", fileName);
  const str = fileName.substring(0, 2);
  const dir = path.join(process.cwd(), "_cache", "_dbcache", str);
  await ensureDir(dir);

  const filePath = path.join(dir, fileName) + ".txt";
  console.log("filePath clearing: ", filePath);

  await deleteFile(filePath);
};

export const saveFile = async (fileName: string, content: string) => {
  const str = fileName.substring(0, 2);
  const dir = path.join(process.cwd(), "_cache", "_dbcache", str);
  await ensureDir(dir);

  const filePath = path.join(dir, fileName) + ".txt";

  await fs.writeFile(filePath, content);
};

export const getFile = async (fileName: string) => {
  try {
    const str = fileName.substring(0, 2);
    const dir = path.join(process.cwd(), "_cache", "_dbcache", str);
    await ensureDir(dir);

    const filePath = path.join(dir, fileName) + ".txt";
    const fileContent = await fs.readFile(filePath, "utf-8");

    if (fileContent) {
      const parseContent = JSON.parse(fileContent);
      return parseContent;
    }
  } catch (err) {
    console.log("err is ", err);
    return null;
  }
  return null;
};
