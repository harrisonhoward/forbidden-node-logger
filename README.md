Read [Github](https://github.com/Forbidden-Duck/forbidden-node-logger) README, in case of unpublished changes
# NodeJS Console Logger
A powerful and efficient JavaScript logger for NodeJS

```
npm install forbidden-node-logger
```
[![NPM Version](https://badgen.net/npm/v/forbidden-node-logger)](https://www.npmjs.com/package/forbidden-node-logger)
[![NPM Downloads](https://badgen.net/npm/dm/forbidden-node-logger)](https://www.npmjs.com/package/forbidden-node-logger)

## Getting Started

### Logger (No File Support)
```js
const NodeLogger = require("../src/index");
const Logger = new NodeLogger.Logger();
```

### Logger (File Support)
```js
const NodeLogger = require("../src/index");
const Logger = new NodeLogger.Logger({ dirPath: __dirname + "/log" });
```

### Logger Basics
```js
const NodeLogger = require("../src/index");
const Logger = new NodeLogger.Logger({ dirPath: __dirname + "/log" });

Logger.on("log", log => { /* Code */ }) // Emits when logging with any method
Logger.on("error", log => { /* Code */ }); // Emits when doing `Logger.error();`
// All log methods include an event "info", "debug" vice versa

Logger.log("Plain log");
Logger.log("&6Logger&r with &3colour");
Logger.eventLog("Log with no event emit"); // Look at "test/break.js" as why this exists

Logger.history.last(2); // Get the last 2 logs
Logger.fileHistory.getLatestLog().then(lines => Logger.eventLog(lines)); // Log an array of lines from the latest log file
```

### Avoid Unhandled Rejection
```js
const NodeLogger = require("../src/index");
const Logger = new NodeLogger.Logger({ dirPath: __dirname + "/log" });

/*
The EventEmitter will cause an unhandled rejection error
When you use Logger.error(). You need to handle the reject by not handling it
*/
Logger.on("error", () => { }); // This only applies to those who are not in need of the "error" emit

Logger.error("My Error");
```

## File Structure
```
yyyy ->
    mm ->
        dd.log
        dd-warn.log
        dd-error.log
```
### Example
```
2019 ->
    09 ->
        01.log
        01-error.log
    10 ->
        03.log
        04.log
        05.log
        06.log
        06-warn.log
        07.log
        07-error.log
2020 ->
    01 ->
        01.log
        01-error.log
    02 ->
        03.log
        04.log
        05.log
        06.log
        06-warn.log
        07.log
        07-error.log
```

## Test Scripts
In the project directory you can run the following scripts:

### `npm run log`
Will run a sample of the Logger's log methods and events\
Located at *test/log.js*

### `npm run history`
Will run a sample of Logger's history and file history\
Located at *test/history.js*

### `npm run break`
Will run a file which is designed to break Logger\
Used for educational purposes. eventLog() is to prevent this.\
Located at *test/break.js*

## Colour Codes
**PREFIX**: `&`

### Special
**RESET**: `r`\
**REVERSE**: `k`

### Format
**BOLD**: `l`\
**ITALIC**: `o`\
**UNDER**: `n`\
**STRIKE**: `m`

### Colour
**FOREGROUND**: `-`\
**BACKGROUND**: `_`\
**EXAMPLE**: `&-5`

**DARK RED**: `4`\
**BRIGHT RED**: `c`

**DARK YELLOW**: `6`\
**BRIGHT YELLOW**: `e`

**DARK GREEN**: `2`\
**BRIGHT GREEN**: `a`

**DARK CYAN**: `3`\
**BRIGHT CYAN**: `b`

**DARK BLUE**: `1`\
**BRIGHT BLUE**: `9`

**DARK PURPLE**: `5`\
**BRIGHT PURPLE**: `d`

**DARK WHITE**: `7`\
**BRIGHT WHITE**: `f`

**DARK BLACK**: `0`\
**BRIGHT BLACK**: `8`