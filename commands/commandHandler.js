import { COMMANDS } from "./commands.js";

async function handleCommand(command) {
  for (const key in COMMANDS) {
    const cmd = COMMANDS[key];

    if (command.startsWith(cmd.string)) {
      if (typeof cmd.handle === "function") {
        await cmd.handle(command);
        return;
      }
    }
  }

  console.error("Command not recognized. Use 'help' for a list of commands.");
}

export { handleCommand };
