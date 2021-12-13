import dayjs from "dayjs";

const ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

function toDateTimeString(dateStr: string): string {
    if (!dateStr) {
        return undefined;
    }
    // if it's already ISO 8601, do nothing
    if (ISO_8601_FULL.test(dateStr)) {
        return dateStr;
    }
    try {
        const dateTime = dayjs(dateStr);
        if (dateTime.isValid()) {
            return dateTime.format();
        } else {
            return undefined;
        }
    } catch (e) {
        console.log(e);
        return undefined;
    }
}

export default toDateTimeString;
