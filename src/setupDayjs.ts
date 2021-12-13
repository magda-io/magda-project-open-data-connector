import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

function setupDayjs(defaultTimeZone: string) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(customParseFormat);
    dayjs.tz.setDefault(defaultTimeZone);
}

export default setupDayjs;
