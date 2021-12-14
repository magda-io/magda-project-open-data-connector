import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

let defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

dayjs.tz.setDefault(defaultTimeZone);

export const setDefaultTimeZone = (timeZone: string) => {
    defaultTimeZone = timeZone;
    dayjs.tz.setDefault(defaultTimeZone);
};

export const getDefaultTimeZone = () => defaultTimeZone;

export const getDayJs = () => dayjs;
