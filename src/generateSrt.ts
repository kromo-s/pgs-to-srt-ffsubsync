import fs from "fs";
import { timestampToSrt } from "./util";

export const generateSrt = (timestamps: number[], outputName: string) =>
  new Promise<string>((resolve) => {
    if (fs.existsSync(outputName)) {
      console.log(`${outputName} already exists, skipping...`);

      resolve(outputName);
      return;
    }

    const srtTimestamps = timestamps.map(timestampToSrt);

    const lines = [];

    let counter = 1;
    for (let i = 0; i < srtTimestamps.length; i += 2) {
      lines.push(`${counter.toString()}\n`);
      lines.push(`${srtTimestamps[i]} --> ${srtTimestamps[i + 1]}\n`);
      lines.push(`${counter}\n\n`);

      counter += 1;
    }

    const outputStream = fs
      .createWriteStream(outputName)
      .on("finish", () => {
        console.log(`Generated ${outputName}`);
        resolve(outputName);
      })
      .on("error", (e) => {
        console.error(e);

        resolve("");
      });

    lines.forEach((line) => {
      outputStream.write(line);
    });

    outputStream.end();
  });
