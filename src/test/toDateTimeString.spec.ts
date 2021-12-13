import {} from "mocha";
import { expect } from "chai";
import { setDefaultTimeZone } from "../dayJsUtils";
setDefaultTimeZone("Australia/Sydney");

import toDateTimeString from "../toDateTimeString";

describe("Test toDateTimeString", () => {
    it("should parse date time string 2013-07-28 (a non-daylight saving date) without timezone properly", () => {
        const dateTimeStr = toDateTimeString("2013-07-28");
        expect(dateTimeStr).to.equal("2013-07-27T14:00:00.000Z");
    });

    it("should parse date time string 2013-12-28 (a daylight saving date) without timezone properly", () => {
        const dateTimeStr = toDateTimeString("2013-12-28");
        expect(dateTimeStr).to.equal("2013-12-27T13:00:00.000Z");
    });

    it("should return undefined for empty value", () => {
        const dateTimeStr = toDateTimeString(null);
        expect(dateTimeStr).to.be.undefined;
    });

    it("should parse 6 Mar 17 21:22 UTC correctly", () => {
        const dateTimeStr = toDateTimeString("6 Mar 17 21:22 UTC");
        // UTC should be used rater than assume default timezone
        expect(dateTimeStr).to.equal("2017-03-06T21:22:00.000Z");
    });

    it("should parse 6 Mar 17 21:22 -05:00 correctly", () => {
        const dateTimeStr = toDateTimeString("6 Mar 17 21:22 -05:00");
        // `-05:00` should be used rater than assume default timezone
        expect(dateTimeStr).to.equal("2017-03-07T02:22:00.000Z");
    });

    it("should parse 6 Mar 17 21:22 correctly (assume default timezone)", () => {
        const dateTimeStr = toDateTimeString("6 Mar 17 21:22");
        expect(dateTimeStr).to.equal("2017-03-06T10:22:00.000Z");
    });

    it("should return original input string if it's already in ISO 8601 format", () => {
        const dateTimeStr = toDateTimeString("2021-09-03T06:07:01.000Z");
        expect(dateTimeStr).to.equal("2021-09-03T06:07:01.000Z");
    });

    it("should parse invalud string as undefined", () => {
        const dateTimeStr = toDateTimeString("6sdds23232");
        expect(dateTimeStr).to.be.undefined;
    });
});
