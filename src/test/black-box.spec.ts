import { runConnectorTest } from "@magda/connector-test-utils";
import { MockOpenDataCatalog } from "./MockOpenDataCatalog";

const fs = require("fs");
const path = require("path");

const testDataDir = path.resolve(__dirname, "./data");

const TEST_CASES = [
    {
        input: JSON.parse(
            fs.readFileSync(path.resolve(testDataDir, "test1-input.json"))
        ),
        output: JSON.parse(
            fs.readFileSync(path.resolve(testDataDir, "test1-output.json"))
        )
    },
    // --- test strip html tags from license field
    {
        input: JSON.parse(
            fs.readFileSync(path.resolve(testDataDir, "test2-input.json"))
        ),
        output: JSON.parse(
            fs.readFileSync(path.resolve(testDataDir, "test2-output.json"))
        )
    }
];

runConnectorTest(TEST_CASES, MockOpenDataCatalog);
