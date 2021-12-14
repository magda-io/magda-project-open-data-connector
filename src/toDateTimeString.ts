import { getDayJs, getDefaultTimeZone } from "./dayJsUtils";
import { Dayjs } from "dayjs";

const ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;
const ISO_8601 = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;
const offset = /[-+]\d\d(:{0,1})\d\d/;

//const supportDateFormats = ["DD MMM YY HH:mm", "D MMM YY HH:mm"];

function hasTimezoneInfo(dateStr: string) {
    if (dateStr.match(offset)) {
        return true;
    }
    if (dateStr.match(/(utc|gmt)/i)) {
        return true;
    }
    return false;
}

function toDateTimeString(dateStr: string): string {
    if (!dateStr) {
        return undefined;
    }
    // if it's already ISO 8601, do nothing
    if (ISO_8601_FULL.test(dateStr)) {
        return dateStr;
    }
    try {
        const dayjs = getDayJs();
        let dateTime: Dayjs;
        if (ISO_8601.test(dateStr)) {
            dateTime = dayjs.tz(dateStr, getDefaultTimeZone());
        } else if (hasTimezoneInfo(dateStr)) {
            dateTime = dayjs(dateStr);
        } else {
            // no timezone offset in input string, we manually append defaultTimeZone offset
            const offset = dayjs
                .tz(undefined, getDefaultTimeZone())
                .format("ZZ");
            dateTime = dayjs(dateStr + " " + offset);
        }

        if (dateTime && dateTime.isValid()) {
            return dateTime.toISOString();
        } else {
            return undefined;
        }
    } catch (e) {
        return undefined;
    }
}

export default toDateTimeString;
