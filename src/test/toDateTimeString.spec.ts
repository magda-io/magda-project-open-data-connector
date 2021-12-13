import {} from "mocha";
import { expect } from "chai";
import setupDayjs from "../setupDayjs";
setupDayjs("Australia/Sydney");

import toDateTimeString from "../toDateTimeString";

describe("Test toDateTimeString", () => {
    it("should parse date time string without timezone properly", () => {
        const dateTimeStr = toDateTimeString("2013-07-28");
        expect(dateTimeStr).to.equal("2013-07-28T00:00:00+10:00");
    });

    it("should return undefined for empty value", () => {
        const dateTimeStr = toDateTimeString(null);
        expect(dateTimeStr).to.be.undefined;
    });

    it("should parse 6 Mar 17 21:22 UT correctly", () => {
        const dateTimeStr = toDateTimeString("6 Mar 17 21:22 UT");
        expect(dateTimeStr).to.equal("2017-03-07T08:22:00+11:00");
    });

    it("should parse 6 Mar 17 21:22 correctly", () => {
        const dateTimeStr = toDateTimeString("6 Mar 17 21:22");
        expect(dateTimeStr).to.equal("2017-03-06T21:22:00+11:00");
    });

    it("should return original input string if it's already in ISO 8601 format", () => {
        const dateTimeStr = toDateTimeString("2021-09-03T06:07:01.000Z");
        expect(dateTimeStr).to.equal("2021-09-03T06:07:01.000Z");
    });
});
