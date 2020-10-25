import { EventEmitter } from "events";

declare function NodeLogger(options: object, seperator: string): NodeLogger.Logger;

declare namespace NodeLogger {
    type Key = number;
    type LoggerPrefixFunction = () => string;
    type LoggerTypes = "none" | "info" | "debug" | "warn" | "error";
    interface LoggerOptions {
        prefix?: LoggerPrefixFunction,
        dirPath?: string
    }

    export class Logger extends EventEmitter {
        constructor(options?: LoggerOptions, seperator?: string);
        private _seperator: string;
        private _prefix: LoggerPrefixFunction;
        private _dirPath: string;
        private _history: LogHistory;
        private _fileHistory: FileHistory | undefined;
        public log(type: LoggerTypes, ...log: (string | object)[]): Log;
        public eventLog(type: LoggerTypes, ...log: (string | object)[]): Log;
        public info(...log: (string | object)[]): Log;
        public debug(...log: (string | object)[]): Log;
        public warn(...log: (string | object)[]): Log;
        public error(...log: (string | object)[]): Log;
        public readonly CONFIG: object;
        public readonly history: LogHistory;
        public readonly fileHistory: FileHistory;
        public readonly prefix: LoggerPrefixFunction;
        public readonly dirPath: string;
        public readonly seperator: string;
    }

    export class Log {
        constructor(prefix: string, seperator: string, type: LoggerTypes, ...logs: (string | object)[]);
        private _prefix: string;
        private _seperator: string;
        private _type: LoggerTypes;
        private _log: string;
        private _dateAdded: number;
        public format(): string;
        public clean(): string;
        public readonly prefix: string;
        public readonly seperator: string;
        public readonly type: LoggerTypes;
        public readonly log: string;
        public readonly dateAdded: number;
        public readonly _CODES: object[];
    }

    export class LogHistory extends Map<Key, Log> {
        constructor(maxSize: number);
        private _maxSize: number;
        private _index: number;
        public add(log: Log): this;
        public _set(key: Key, log: Log): this;
        public get(key: Key | Log): Log | undefined;
        public getKey(log: Log): Key | undefined;
        public find(callbackFn: (value: Log, key: Key, collection: this) => boolean): Log | undefined;
        public find<T>(callbackFn: (this: T, value: Log, key: Key, collection: this) => boolean, thisArg: T): Log | undefined;
        public filter(callbackFn: (value: Log, key: Key, collection: this) => boolean): this;
        public filter<T>(callbackFn: (this: T, value: Log, key: Key, collection: this) => boolean, thisArg: T): this;
        public map<T>(callbackFn: (value: Log, key: Key, collection: this) => T): T[];
        public map<This, T>(callbackFn: (this: This, value: Log, key: Key, collection: this, thisArg: This) => T);
        public delete(key: Key | Log): boolean;
        public clear(): void;
        public first(): Log;
        public first(amount: number): Log[];
        public last(): Log;
        public last(amount: number): Log[];
        public toArray(): Log[];
    }

    export class ReadWrite {
        public static write(pathToFile: string, line: string): Promise<true | Error>;
        public static read(pathToFile: string): Promise<string[]>;
        public static dirIfNotExists(pathToFile: string): Promise<boolean>;
    }

    export class FileHistory {
        constructor(dirPath: string, Logger: Logger);
        private dirPath: string;
        private Logger: Logger;
        private year: () => number;
        private month: () => string;
        private day: () => string;
        private _handleCatch(err: Error): void;
        public getLatestLog(): Promise<void | string[]>;
        public getLogByDay(day?: number, month?: number, year?: number): Promise<void | string[]>;
        public getLogsByMonth(month?: number, year?: number): Promise<object>;
        public getLogsByYear(year?: number): Promise<object>;
    }
}

export = NodeLogger;