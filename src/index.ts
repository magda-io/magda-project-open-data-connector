import { addJwtSecretFromEnvVar } from "@magda/utils";
import createTransformer from "./createTransformer";
import {
    JsonConnector,
    AuthorizedRegistryClient as Registry
} from "@magda/connector-sdk";
import ProjectOpenData from "./ProjectOpenData";
import organizationAspectBuilders from "./organizationAspectBuilders";
import datasetAspectBuilders from "./datasetAspectBuilders";
import distributionAspectBuilders from "./distributionAspectBuilders";
import yargs from "yargs";
import { setDefaultTimeZone } from "./dayJsUtils";

const argv = addJwtSecretFromEnvVar(
    yargs
        .config()
        .help()
        .option("id", {
            describe:
                "The ID of this connector. Datasets created by this connector will have an ID prefixed with this ID.",
            type: "string",
            demandOption: true
        })
        .option("name", {
            describe:
                "The name of this connector, to be displayed to users to indicate the source of datasets.",
            type: "string",
            demandOption: true
        })
        .option("sourceUrl", {
            describe: "The URL of the data.json file.",
            type: "string",
            demandOption: true
        })
        .option("registryUrl", {
            describe:
                "The base URL of the registry to which to write data from CSW.",
            type: "string",
            default: "http://localhost:6101/v0"
        })
        .option("interactive", {
            describe:
                "Run the connector in an interactive mode with a REST API, instead of running a batch connection job.",
            type: "boolean",
            default: false
        })
        .option("listenPort", {
            describe:
                "The port on which to run the REST API when in interactive model.",
            type: "number",
            default: 6113
        })
        .option("timeout", {
            describe:
                "When in --interactive mode, the time in seconds to wait without servicing an REST API request before shutting down. If 0, there is no timeout and the process will never shut down.",
            type: "number",
            default: 0
        })
        .option("jwtSecret", {
            describe: "The shared secret for intra-network communication",
            type: "string"
        })
        .option("userId", {
            describe:
                "The user id to use when making authenticated requests to the registry",
            type: "string",
            demand: true,
            default:
                process.env.USER_ID || process.env.npm_package_config_userId
        })
        .option("tenantId", {
            describe:
                "The magda tenant id to use when making requests to the registry",
            type: "number",
            demand: true
        })
        .option("defaultTimeZone", {
            describe:
                "The default time zone that will be used when timezone information is not available from source data fields",
            type: "string",
            demand: true,
            default:
                process.env.DEFAULT_TIMEZONE ||
                process.env.npm_package_config_defaultTimeZone
        }).argv
);

if (argv.defaultTimeZone) {
    console.log(`Setting default timezone to ${argv.defaultTimeZone}`);
    setDefaultTimeZone(argv.defaultTimeZone);
} else {
    console.log("Skip setting default timezone.");
}

const source = new ProjectOpenData({
    id: argv.id,
    name: argv.name,
    url: argv.sourceUrl
});

const registry = new Registry({
    baseUrl: argv.registryUrl,
    jwtSecret: argv.jwtSecret,
    userId: argv.userId,
    tenantId: argv.tenantId
});

const transformerOptions = {
    id: argv.id,
    name: argv.name,
    sourceUrl: argv.sourceUrl,
    registryUrl: argv.registryUrl,
    datasetAspectBuilders,
    distributionAspectBuilders,
    organizationAspectBuilders,
    tenantId: argv.tenantId
};

const transformer = createTransformer(transformerOptions);

const connector = new JsonConnector({
    source: source,
    transformer: transformer,
    registry: registry
});

if (!argv.interactive) {
    connector
        .run()
        .then(result => {
            console.log(result.summarize());
        })
        .catch(e => {
            console.error(e);
            process.exit(1);
        });
} else {
    connector.runInteractive({
        timeoutSeconds: argv.timeout,
        listenPort: argv.listenPort,
        transformerOptions: transformerOptions
    });
}
