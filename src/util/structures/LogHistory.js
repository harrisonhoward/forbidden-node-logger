const Log = require("./Log");

module.exports = class LogHistory extends Map {
    /**
     * 
     * @param {Number} maxSize The max size of the collection
    */
    constructor(maxSize = 1000) {
        super();
        if (!maxSize || isNaN(maxSize)) {
            throw new Error("maxSize is not a number");
        }
        this._maxSize = maxSize;
        this._index = 0;
    }

    /**
     * Add a new log to the collection
     * @param {Log} log
     * @returns {LogHistory}
    */
    add(log) {
        if (!log instanceof Log) {
            throw new Error("log is not an instance of Log");
        }
        if (this.size >= this._maxSize) {
            const entries = [...this.entries];
            super.clear();
            this._index = 0;
            for (const [key, val] of entries) {
                if (super.size >= this._maxSize - 1) {
                    break;
                }
                super.set(key, val);
            }
        }
        const key = this._index++;
        return super.set(key, log);
    }

    /**
     * Add a new log with a key
     * @param {Number} key 
     * @param {Log} log 
     * @return {LogHistory}
    */
    _set(key, log) {
        if (!log instanceof Log) {
            throw new Error("log is not an instance of Log");
        }
        if (this.size >= this._maxSize) {
            const entries = [...this.entries()];
            super.clear();
            this._index = 0;
            for (const [key, val] of entries) {
                if (super.size >= this._maxSize - 1) {
                    break;
                }
                super.set(key, val);
            }
        }
        return super.set(key, log);
    }

    /**
     * Get a log from the collection
     * @param {Number | Log} key Key used to find the value
     * @returns {Log | undefined}
    */
    get(key) {
        if (!key && isNaN(key) && !key instanceof Log) {
            throw new Error("key must be a number or an instance of Log");
        }
        for (const [ky, val] of this) {
            if (ky == key) {
                return val;
            } else if (JSON.stringify(val) == JSON.stringify(key)) {
                return val;
            }
        }
        return undefined;
    }

    /**
     * Gets the key of a log from the collection
     * @param {Log} log 
     * @returns {Number | undefined} The key
    */
    getKey(log) {
        if (!key && !key instanceof Log) {
            throw new Error("key must be a number or an instance of Log");
        }
        for (const [key, val] of this) {
            if (JSON.stringify(val) == JSON.stringify(log)) {
                return key;
            }
        }
        return undefined;
    }

    /**
     * Find a log using a callback function
     * @param {Function} callbackFn
     * @param {*} thisArg If provided it will be used as this value for each invocation of callbackFn
     * @returns {Log | undefined}
    */
    find(callbackFn, thisArg) {
        if (thisArg != undefined) {
            callbackFn = callbackFn.bind(thisArg);
        }
        for (const [key, val] of this) {
            if (callbackFn(val, key, this)) {
                return val;
            }
        }
        return undefined;
    }

    /**
     * Filter a log using a callback function
     * @param {Function} callbackFn
     * @param {*} thisArg If provided it will be used as this value for each invocation of callbackFn
     * @returns {LogHistory}
    */
    filter(callbackFn, thisArg) {
        if (thisArg != undefined) {
            callbackFn = callbackFn.bind(thisArg);
        }
        const res = new this.constructor[Symbol.species]();
        for (const [key, val] of this) {
            if (callbackFn(val, key, this)) {
                res.set(key, val);
            }
        }
        return res;
    }

    /**
     * Map the log collection with the callback function
     * @param {Function} callbackFn
     * @param {*} thisArg If provided it will be used as this value for each invocation of callbackFn
     * @returns {Array}
    */
    map(callbackFn, thisArg) {
        if (thisArg != undefined) {
            callbackFn = callbackFn.bind(thisArg);
        }
        const iterate = this.entries();
        return Array.from({ length: this.size }, () => {
            const [key, value] = iterate.next().value;
            return callbackFn(value, key, this);
        });
    }

    /**
     * Delete a log from the collection
     * @param {Number | Log} key Key used to find the value
     * @returns {Boolean} If deleted
    */
    delete(key) {
        if (!key && isNaN(key) && !key instanceof Log) {
            throw new Error("key must be a number or an instance of Log");
        }
        if (key instanceof Log) {
            key = this.getKey(key);
        }
        return super.delete(key);
    }

    /**
     * Clear the log collection
     * @returns {void}
    */
    clear() {
        super.clear();
    }

    /**
     * Get the first amount of messages added to the collection
     * @param {Number} amount 
     * @returns {Log | Array<Log>}
    */
    first(amount) {
        if (amount == undefined || isNaN(amount)) {
            return this.values().next().value;
        }
        if (amount < 0) {
            return this.last(amount * -1);
        }
        amount = Math.min(this.size, amount);
        const iterate = this.values();
        return Array.from({ length: amount }, () => iterate.next().value);
    }

    /**
     * Get the last amount of messages added to the collection
     * @param {Number} amount 
     * @returns {Log | Array<Log>}
    */
    last(amount) {
        const array = this.toArray();
        if (amount == undefined || isNaN(amount)) {
            return array[array.length - 1];
        }
        if (amount < 0) {
            return this.first(amount * -1);
        }
        if (!amount) {
            return [];
        }
        return array.slice(-amount);
    }

    toArray() {
        return [...this.values()];
    }
}