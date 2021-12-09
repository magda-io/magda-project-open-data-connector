import { AsyncPage, formatServiceError, retry, request } from "@magda/utils";
import { ConnectorSource } from "@magda/connector-sdk";
import TurndownService from "turndown";
import trimString from "./trimString";

export default class ProjectOpenData implements ConnectorSource {
    public readonly id: string;
    public readonly name: string;

    private url: string;
    private secondsBetweenRetries: number;
    private maxRetries: number;
    private dataPromise: Promise<object>;
    private turndownService = new TurndownService();

    // project open data spec allows URLs for licences
    // ArcGIS creates custom URLs rather than using https://project-open-data.cio.gov/open-licenses/ lookup table
    getDatasetLicence(data: any): Promise<any> {
        if (data.dataset) {
            data.dataset = Promise.all(
                data.dataset.map((dataset: any) => {
                    return new Promise(resolve => {
                        // don't bother visiting creativecommons urls
                        if (
                            dataset.license &&
                            dataset.license.startsWith("http") &&
                            !dataset.license.includes("creativecommons")
                        ) {
                            request(
                                dataset.license,
                                { json: true },
                                (error, response, body) => {
                                    if (error) {
                                        console.log(error);
                                        return resolve(dataset);
                                    } else {
                                        if (body && body.description) {
                                            let foundLink = false;
                                            if (
                                                body.description.match(
                                                    /https?:\/\/[^ "<]*/g
                                                )
                                            ) {
                                                foundLink = body.description
                                                    .match(
                                                        /https?:\/\/[^ "<]*/g
                                                    )
                                                    .some((link: String) => {
                                                        if (
                                                            link.includes(
                                                                "creativecommons.org/licenses"
                                                            ) ||
                                                            link.includes(
                                                                "opendefinition.org/licenses/"
                                                            )
                                                        ) {
                                                            foundLink = true;
                                                            dataset.license = link;
                                                            return true;
                                                        }
                                                        return false;
                                                    });
                                            }
                                            if (!foundLink) {
                                                dataset.license = this.turndownService.turndown(
                                                    body.description
                                                );
                                            }
                                            return resolve(dataset);
                                        }
                                        return resolve(dataset);
                                    }
                                }
                            );
                        } else {
                            return resolve(dataset);
                        }
                    });
                })
            );
        }
        return data;
    }

    constructor(options: ProjectOpenDataOptions) {
        this.id = options.id;
        this.name = options.name;
        this.url = options.url;
        this.secondsBetweenRetries = options.secondsBetweenRetries || 10;
        this.maxRetries = options.maxRetries || 10;

        const operation = () =>
            new Promise<object>((resolve, reject) => {
                request(this.url, { json: true }, (error, response, body) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(this.cleanUpSourceData(body));
                });
            });

        this.dataPromise = retry(
            operation,
            this.secondsBetweenRetries,
            this.maxRetries,
            (e, retriesLeft) =>
                console.log(
                    formatServiceError(
                        `Failed to GET ${this.url}.`,
                        e,
                        retriesLeft
                    )
                )
        ).then(data => this.getDatasetLicence(data));
    }

    private cleanUpSourceData(data: any) {
        if (!data?.dataset?.length) {
            return data;
        }
        for (let i = 0; i < data.dataset.length; i++) {
            const dataset = data.dataset[i];
            if (dataset?.publisher?.name) {
                data.dataset[i].publisher.name = trimString(
                    dataset.publisher.name
                );
            }
        }
        return data;
    }

    public getJsonDatasets(): AsyncPage<any[]> {
        return AsyncPage.singlePromise<object[]>(
            this.dataPromise.then((response: any) => response.dataset || [])
        );
    }

    public getJsonDataset(id: string): Promise<any> {
        return this.dataPromise.then((response: any) => {
            if (!response || !response.dataset) {
                return undefined;
            }

            return response.dataset.filter(
                (dataset: any) => dataset.identifier === id
            )[0];
        });
    }

    public searchDatasetsByTitle(
        title: string,
        maxResults: number
    ): AsyncPage<any[]> {
        const promise = this.dataPromise.then((response: any) => {
            if (!response || !response.dataset) {
                return undefined;
            }

            const lowercaseTitle = title.toLowerCase();
            return response.dataset
                .filter(
                    (dataset: any) =>
                        dataset.title.toLowerCase().indexOf(lowercaseTitle) >= 0
                )
                .slice(0, maxResults);
        });

        return AsyncPage.singlePromise<any[]>(promise);
    }

    public getJsonDistributions(dataset: any): AsyncPage<any[]> {
        return AsyncPage.single<object[]>(dataset.distribution || []);
    }

    // TODO: we could make this source have first-class organizations pretty easily.
    // something like this:
    // protected getJsonFirstClassOrganizations(): AsyncPage<any[]> {
    //     return AsyncPage.singlePromise<object[]>(this.dataPromise.then((response: any) => {
    //         const orgs = new Set<string>();
    //         const datasets: any = response.dataset;
    //         datasets.forEach((dataset: any) => {
    //             if (dataset.publisher && dataset.publisher.name) {
    //                 orgs.add(dataset.publisher.name);
    //             }
    //         });
    //         return [...orgs].map(name => ({name: name}));
    //     }));
    // }

    public readonly hasFirstClassOrganizations: boolean = false;

    public getJsonFirstClassOrganizations(): AsyncPage<any[]> {
        return undefined;
    }

    public getJsonFirstClassOrganization(id: string): Promise<any> {
        return undefined;
    }

    public searchFirstClassOrganizationsByTitle(
        title: string,
        maxResults: number
    ): AsyncPage<any[]> {
        return undefined;
    }

    public getJsonDatasetPublisherId(dataset: any): any {
        if (!dataset.publisher) {
            return undefined;
        }
        return dataset.publisher.name;
    }

    public getJsonDatasetPublisher(dataset: any): Promise<any> {
        const publisher = {
            ...dataset.publisher,
            contactPoint: dataset.contactPoint
        };
        return publisher;
    }
}

export interface ProjectOpenDataOptions {
    id: string;
    name: string;
    url: string;
    secondsBetweenRetries?: number;
    maxRetries?: number;
}
