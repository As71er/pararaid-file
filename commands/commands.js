import {
  ADD_TO_FILE,
  CREATE_FILE,
  DELETE_FILE,
  FLAG_PREFIX,
  HELP,
  READ_FILE,
  RENAME_FILE,
  RENAME_FILE_OPERATOR,
} from "./commandConstants.js";

import {
  addToFile,
  createFile,
  deleteFile,
  displayGenericError,
  readFile,
  renameFile,
} from "../utils/fileUtils.js";

function extractFlagsAndClean(commandString, commandName, validFlags) {
  const remaining = commandString.substring(commandName.length + 1).trim();
  const elements = remaining.split(" ");

  const flagsFound = elements
    .filter((e) => e.startsWith(FLAG_PREFIX))
    .map((f) => f.slice(1))
    .filter((f) => validFlags.includes(f));

  const firstArgIndex = elements.findIndex((e) => !e.startsWith(FLAG_PREFIX));
  const cleanedArgs = elements.slice(firstArgIndex).join(" ");
  const firstSpaceIdx = cleanedArgs.indexOf(" ");

  if (firstSpaceIdx === -1) {
    return { error: "Couldn't parse the file path and content." };
  }

  const filePath = cleanedArgs.substring(0, firstSpaceIdx);
  const content = cleanedArgs.substring(firstSpaceIdx + 1);

  return { flagsFound, filePath, content };
}

function handleCreateFile(command) {
  const filePath = command.substring(COMMANDS.create.string.length + 1);

  createFile(filePath)
    .then(() => console.log("File created in", filePath))
    .catch(displayGenericError);
}

function handleReadFile(command) {
  const filePath = command.substring(COMMANDS.read.string.length + 1);

  readFile(filePath)
    .then((fileContent) => console.log(`\n\n${fileContent}\n\n`))
    .catch(displayGenericError);
}

function handleRenameFile(command) {
  const operatorIdx = command.indexOf(` ${COMMANDS.rename.operator} `);
  const oldFilePath = command.substring(
    COMMANDS.rename.string.length + 1,
    operatorIdx
  );
  const newFilePath = command.substring(
    operatorIdx + (COMMANDS.rename.operator.length + 2)
  );

  renameFile(oldFilePath, newFilePath)
    .then(() =>
      console.log(
        `File renamed, path from ${oldFilePath} to new path and name ${newFilePath}.`
      )
    )
    .catch(displayGenericError);
}

function handleAddToFile(command) {
  const { flagsFound, filePath, content, error } = extractFlagsAndClean(
    command,
    COMMANDS.add.string,
    COMMANDS.add.flags
  );

  if (error) {
    console.error(
      "Couldn't parse the command. Please check the format or how you declared the flags, if any. Use 'help' for more information."
    );
    return;
  }

  if (!filePath) {
    console.error("Path can't be empty.");
    return;
  }

  if (!content) {
    console.error("Expected content, but received nothing instead.");
    return;
  }

  let finalContent = content;
  if (flagsFound.includes("n")) finalContent = "\n" + content;

  addToFile(filePath, finalContent)
    .then(() => console.log("Information added to the file."))
    .catch(displayGenericError);
}

function handleDeleteFile(command) {
  const filePath = command.substring(COMMANDS.delete.string.length + 1);

  deleteFile(filePath)
    .then(() => console.log("File successfully deleted."))
    .catch(displayGenericError);
}

function showHelp() {
  console.log("\n\nAvailable Commands\n\n");
  Object.values(COMMANDS).forEach((cmd) => {
    console.log(
      `\n>> ${cmd.string}:\n\t${cmd.description}\n\tUsage: ${cmd.usage}`
    );
    if (cmd.flagsInfo?.length) {
      cmd.flagsInfo.forEach((flag) => {
        console.log(`\t${FLAG_PREFIX}${flag.indicator} → ${flag.description}`);
      });
    }
  });
}

const COMMANDS = {
  create: {
    string: CREATE_FILE,
    description: "Creates a file at the desired path.",
    usage: `${CREATE_FILE} [path_of_file]`,
    handle: handleCreateFile,
  },
  read: {
    string: READ_FILE,
    description: "Displays the contents of a file.",
    usage: `${READ_FILE} [path_of_file]`,
    handle: handleReadFile,
  },
  rename: {
    string: RENAME_FILE,
    operator: RENAME_FILE_OPERATOR,
    description:
      "Renames a file by specifying the current path and the new path with the new name.",
    usage: `${RENAME_FILE} [path_of_file] ${RENAME_FILE_OPERATOR} [new_path_of_file]`,
    handle: handleRenameFile,
  },
  add: {
    string: ADD_TO_FILE,
    flags: ["n"],
    flagsInfo: [
      { indicator: "n", description: "Adds the content on a new line." },
    ],
    description: "Appends new content to the specified file.",
    usage: `${ADD_TO_FILE} ${FLAG_PREFIX}[flags] [path_to_file] [content]`,
    handle: handleAddToFile,
  },
  delete: {
    string: DELETE_FILE,
    description: "Deletes a single file at the specified path.",
    usage: `${DELETE_FILE} [path_of_file]`,
    handle: handleDeleteFile,
  },
  help: {
    string: HELP,
    description: "Lists all commands and their usage.",
    usage: `${HELP}`,
    handle: showHelp,
  },
};

export { COMMANDS };
