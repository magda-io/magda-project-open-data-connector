import { AspectBuilder, cleanOrgTitle } from "@magda/connector-sdk";
import ProjectOpenDataTransformer from "./ProjectOpenDataTransformer";
import moment from "moment";
import URI from "urijs";
import jsonpath from "jsonpath";
import lodash from "lodash";
import striptags from "striptags";

export interface CreateTransformerOptions {
    id: string;
    name: string;
    sourceUrl: string;
    datasetAspectBuilders: AspectBuilder[];
    distributionAspectBuilders: AspectBuilder[];
    organizationAspectBuilders: AspectBuilder[];
    tenantId: number;
}

export default function createTransformer({
    id,
    name,
    sourceUrl,
    datasetAspectBuilders,
    distributionAspectBuilders,
    organizationAspectBuilders,
    tenantId
}: CreateTransformerOptions) {
    return new ProjectOpenDataTransformer({
        sourceId: id,
        datasetAspectBuilders: datasetAspectBuilders,
        distributionAspectBuilders: distributionAspectBuilders,
        organizationAspectBuilders: organizationAspectBuilders,
        tenantId: tenantId,
        libraries: {
            moment: moment,
            cleanOrgTitle: cleanOrgTitle,
            URI: URI,
            jsonpath,
            lodash,
            striptags,
            projectOpenData: Object.freeze({
                id: id,
                name: name,
                url: sourceUrl
            })
        }
    });
}
