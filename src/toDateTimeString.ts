import { getDayJs, getDefaultTimeZone } from "./dayJsUtils";
import { Dayjs } from "dayjs";

const ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;
const ISO_8601 = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;

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
        } else {
            dateTime = dayjs(dateStr);
        }

        if (dateTime && dateTime.isValid()) {
            return dateTime.toISOString();
        } else {
            return undefined;
        }
    } catch (e) {
        console.log(e);
        return undefined;
    }
}

export default toDateTimeString;
