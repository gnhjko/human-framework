//http://codegists.com/snippet/typescript/timespants_ranwahle_typescript
/*********************************************************
 
.Net like TimeSpan class in typescript
 
Author: Ran Wahle
 
 
*********************************************************/
const MILLISECONDS_IN_A_SECOND: number = 1000;
const SECONDS_IN_A_MINUTE: number = 60;
const MINUTES_IN_AN_HOUR: number = 60;
const HOURS_IN_A_DAY: number = 24;
const DAYS_IN_A_WEEK: number = 7;
const DAYS_IN_A_MONTH: number = 30;
const DAYS_IN_A_YEAR: number = 365;

const MILLISECONDS_IN_A_MINUTE = MILLISECONDS_IN_A_SECOND * SECONDS_IN_A_MINUTE;
const MILLISECONDS_IN_AN_HOUR = MILLISECONDS_IN_A_MINUTE * MINUTES_IN_AN_HOUR;
const MILLISECONDS_IN_A_DAY = MILLISECONDS_IN_AN_HOUR * HOURS_IN_A_DAY;
const MILLISECONDS_IN_A_WEEK = MILLISECONDS_IN_A_DAY * DAYS_IN_A_WEEK;
const MILLISECONDS_IN_A_MONTH = MILLISECONDS_IN_A_DAY * DAYS_IN_A_MONTH;
const MILLISECONDS_IN_A_YEAR = MILLISECONDS_IN_A_DAY * DAYS_IN_A_YEAR;

const UNITS = {
    SECOND: 'second',
    MINUTE: 'minute',
    HOUR: 'hour',
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year'
};

interface DivisionResult {
    modulu: number;
    addition: number;
}

/**
 * The time span class represents a time delta (an AMOUNT of time that can be converted to milliseconds).
 */
export class TimeSpan {
    /**
     * the entire span in milliseconds
     */
    private _totalMilliseconds: number;

    /**
     * time-parts of the time span, together they can be converted into total milliseconds.
     */
    private _milliseconds: number;
    private _seconds: number;
    private _minutes: number;
    private _hours: number;
    private _days: number;

    constructor(milliseconds: number = 0) {
        this._seconds = 0;
        this._minutes = 0;
        this._hours = 0;
        this._days = 0;

        // this setter will call recalculateTimeParts
        this.milliseconds = milliseconds;
    }

    static fromSeconds(seconds: number): TimeSpan {
        return new TimeSpan(seconds * 1000);
    }

    static fromIntervalWithUnit(interval: number, unit: string) {
        switch (unit) {
            case UNITS.SECOND:
                return new TimeSpan(interval * 1000);
            case UNITS.MINUTE:
                return new TimeSpan(interval * MILLISECONDS_IN_A_MINUTE);
            case UNITS.HOUR:
                return new TimeSpan(interval * MILLISECONDS_IN_AN_HOUR);
            case UNITS.DAY:
                return new TimeSpan(interval * MILLISECONDS_IN_A_DAY);
            case UNITS.WEEK:
                return new TimeSpan(interval * MILLISECONDS_IN_A_WEEK);
            case UNITS.MONTH:
                return new TimeSpan(interval * MILLISECONDS_IN_A_MONTH);
            case UNITS.YEAR:
                return new TimeSpan(interval * MILLISECONDS_IN_A_YEAR);
            default:
                throw new Error('no such unit');
        }

        // default

    }

    /**
     * Static constructors of "natural" timespans.
     */
    static Day(): TimeSpan {
        return new TimeSpan(MILLISECONDS_IN_A_DAY);
    }

    static Hour(): TimeSpan {
        return new TimeSpan(MILLISECONDS_IN_AN_HOUR);
    }

    static Week(): TimeSpan {
        return new TimeSpan(MILLISECONDS_IN_A_WEEK);
    }

    static Month(): TimeSpan {
        let now: any = new Date();
        let aMonthAgo: any = new Date();
        aMonthAgo.setMonth(aMonthAgo.getMonth() - 1);
        return new TimeSpan(now - aMonthAgo);
    }

    static Year() {
        let now: any = new Date();
        let aYearAgo: any = new Date();
        aYearAgo.setYear(aYearAgo.getFullYear() - 1);
        return new TimeSpan(now - aYearAgo);
    }

    /**
     * Add and subtract a timespan to a javascript date
     */
    public addTo(date: Date): Date {
        // add the entire timespan in milliseconds to the javascript.Date's ms-part (it works because javascript.Date knows how to overflow)
        date.setMilliseconds(date.getMilliseconds() + this.inMilliseconds);
        return date;
    }

    public subtructFrom(date: Date): Date {
        // subtract the entire timespan in milliseconds from the javascript.Date's ms-part (it works because javascript.Date knows how to overflow)
        date.setMilliseconds(date.getMilliseconds() - this.inMilliseconds);
        return date;
    }

    /**
     * Create a timespan from two javascript dates/numbers.
     */
    public static Subtract(date1: any, date2: any) {
        let milliseconds: number = date1 - date2;
        return new TimeSpan(milliseconds);
    }

    /**
     * Time parts accessors
     */
    get days(): number {
        return this._days;
    }
    set days(value: number) {
        if (isNaN(value)) {
            value = 0;
        }
        this._days = value;
        this.recalculateTimeParts();
    }

    get hours(): number {
        return this._hours;
    }
    set hours(value: number) {
        if (isNaN(value)) {
            value = 0;
        }
        this._hours = value;
        this.recalculateTimeParts();
    }

    get minutes(): number {
        return this._minutes;
    }
    set minutes(value: number) {
        if (isNaN(value)) {
            value = 0;
        }
        this._minutes = value;
        this.recalculateTimeParts();
    }

    get seconds(): number {
        return this._seconds;
    }
    set seconds(value: number) {
        this._seconds = value;
        this.recalculateTimeParts();
    }

    get milliseconds(): number {
        return this._milliseconds;
    }
    set milliseconds(value: number) {
        if (isNaN(value)) {
            value = 0;
        }
        this._milliseconds = value;
        this.recalculateTimeParts();
    }

    /**
     * Converters, get the entire time span in these units
     */
    get inMilliseconds() {
        return this._totalMilliseconds;
    }

    get inSeconds() {
        return Math.round(this._totalMilliseconds / MILLISECONDS_IN_A_SECOND);
    }

    get inMinutes() {
        return Math.round(this._totalMilliseconds / MILLISECONDS_IN_A_MINUTE);
    }

    get inHours() {
        return Math.round(this._totalMilliseconds / MILLISECONDS_IN_AN_HOUR);
    }

    get inDays() {
        return Math.round(this._totalMilliseconds / MILLISECONDS_IN_A_DAY);
    }

    get inWeeks() {
        return Math.round(this._totalMilliseconds / MILLISECONDS_IN_A_WEEK);
    }

    get inMonths() {
        return Math.round(this._totalMilliseconds / MILLISECONDS_IN_A_MONTH);
    }

    get inYears() {
        return Math.round(this._totalMilliseconds / MILLISECONDS_IN_A_YEAR);
    }

    /**
     * in use in archer, we describe an interval as "10 days" or "2 weeks", preferring the largest unit possible.
     */
    get crudeUnit() {
        let units = [UNITS.YEAR, UNITS.MONTH, UNITS.WEEK, UNITS.DAY, UNITS.HOUR, UNITS.MINUTE];
        let intervals = [this.inYears, this.inMonths, this.inWeeks, this.inDays, this.inHours, this.inMinutes];

        for (let i = 0; i < intervals.length; i++) {
            if (intervals[i] > 0) {
                return {
                    interval: intervals[i],
                    unit: units[i]
                };
            }
        }

        // default
        return {
            interval: 0,
            unit: 'day'
        };
    }

    /**
     * divides a number with carry (modulu part).
     * returns both the addition (rounded division result) and the modulu (carry).
     */
    private divide(origValue: number, maxValue: number): DivisionResult {
        return {
            modulu: origValue % maxValue,
            addition: Math.floor(origValue / maxValue)
        };
    }

    /**
     * when a part of the time span is set (or the entire time span is set in the ctor)
     * this method recalculates the logical parts of the time span (days, minutes, hours, seconds, milliseconds)
     */
    private recalculateTimeParts() {
        let newMilliseconds: DivisionResult = this.divide(this._milliseconds, MILLISECONDS_IN_A_SECOND);
        this._milliseconds = newMilliseconds.modulu;
        this._seconds += newMilliseconds.addition;

        let newSeconds: DivisionResult = this.divide(this._seconds, SECONDS_IN_A_MINUTE);
        this._seconds = newSeconds.modulu;
        this._minutes += newSeconds.addition;

        let newMinutes: DivisionResult = this.divide(this._minutes, MINUTES_IN_AN_HOUR);
        this._minutes = newMinutes.modulu;
        this._hours += newMinutes.addition;

        let newDays: DivisionResult = this.divide(this._hours, HOURS_IN_A_DAY);
        this._hours = newDays.modulu;
        this._days += newDays.addition;

        this._totalMilliseconds = (
            this.days * MILLISECONDS_IN_A_DAY +
            this.hours * MILLISECONDS_IN_AN_HOUR +
            this.minutes * MILLISECONDS_IN_A_MINUTE +
            this.seconds * MILLISECONDS_IN_A_SECOND +
            this.milliseconds);
    }



}