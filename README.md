# [Practice] Pararaid Terminal

## File Management Practice

An application that watches over the changes made in a file. What is written in the specified file in `app.js` through the `FILE_PATH` constant will be read as a command according to the definitions in `commandConstants.js`. It includes basic operations such as **writing**, **reading**, **modifying**, and **deletion**, each with its respective structure and description when using the `help` command. This project was created to practice the basics of the `fs` (file system) module provided by Node.js, along with a bit of event-driven programming concepts.

## Initialization

To run this project locally:

1. **Clone the repository**

```bash
git clone https://github.com/your-username/pararaid-file.git
```

2. **Navigate to the project directory**

```bash
cd pararaid-file
```

3. **Create the text file**

Make sure to specify the file path in `app.js` by setting the `FILE_PATH` constant. This will be the file the application watches to read the commands.

```bash
touch file-name.txt
```

4. **Run the application**

```bash
node app.js
```

### Handling duplicate events

While monitoring changes in a file using `fs.watch()` or `fs.promises.watch()` with Node.js, it is possible for the application to detect the same event more than once when the file is saved. This occurs due to how operating systems and text editors handle the save operation internally. A partial workaround involves implementing a **debouncer** to add a brief delay before processing the `change` event, helping to prevent duplicate executions.
