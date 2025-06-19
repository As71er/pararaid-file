import fs from "fs/promises";
import { handleCommand } from "./commands/commandHandler.js";
import { readFileContent } from "./utils/fileUtils.js";

(async () => {
  const FILE_PATH = "./pararaid.txt";

  try {
    const fileHandler = await fs.open(FILE_PATH, "r");

    fileHandler.on("change", async () => {
      try {
        const fileBuffer = await readFileContent(fileHandler);
        const command = fileBuffer.toString("utf-8");

        if (command) await handleCommand(command);
      } catch (err) {
        console.error("Failed to process command:", err.message);
      }
    });

    const watcher = fs.watch(FILE_PATH);
    let debounceTimer = null;

    for await (const event of watcher) {
      if (debounceTimer) continue;

      if (event.eventType === "change") {
        debounceTimer = setTimeout(() => {
          debounceTimer = null;

          fileHandler.emit("change");
        }, 100);
      }
    }
  } catch (err) {
    console.error("Error initializing app:", err.message);
  } finally {
    try {
      await fileHandler?.close();
      console.log(`FileHandler for ${FILE_PATH} closed.`);
    } catch (err) {
      console.error("Error while closing file:", err.message);
    }
  }
})();
