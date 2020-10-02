const fs = require("fs");
const readLine = require("readline");

module.exports = class ReadWrite {
    /**
     * Write to a file
     * @param {String} pathToFile 
     * @param {String} line Line that is written to the file
     * @returns {Promise<true | Error>} Whether the write caused an error
    */
    static write(pathToFile, line) {
        return new Promise((resolve, reject) => {
            fs.appendFile(pathToFile, line, err => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    }

    /**
     * Read an entire file
     * @param {String} pathToFile 
     * @returns {Promise<String[]>} An array of lines
    */
    static read(pathToFile) {
        return new Promise((resolve, reject) => {
            try {
                const lines = [];
                const rl = readLine.createInterface({
                    input: fs.createReadStream(pathToFile),
                    crlfDelay: Infinity
                });
                rl.on("line", line => lines.push(line));
                rl.on("close", () => resolve(lines));
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Makes a directory if it doesn't exist
     * @param {String} pathToFile 
     * @returns {Promise<Boolean>}
    */
    static async dirIfNotExists(pathToFile) {
        if (!await fs.existsSync(pathToFile)) {
            await fs.mkdirSync(pathToFile, { recursive: true });
            return true;
        }
        return false;
    }
}