## Magda Project Open Data Connector

![CI Workflow](https://github.com/magda-io/magda-project-open-data-connector/workflows/Main%20CI%20Workflow/badge.svg?branch=master) [![Release](https://img.shields.io/github/release/magda-io/magda-project-open-data-connector.svg)](https://github.com/magda-io/magda-project-open-data-connector/releases)

[Magda](https://github.com/magda-io/magda) connectors go out to external datasources and copy their metadata into the Registry, so that they can be searched and have other aspects attached to them. A connector is simply a docker-based microservice that is invoked as a job. It scans the target datasource (usually an open-data portal), then completes and shuts down.

Magda project-open-data Connector is created for crawling data from `Project Open Data` portal.

### Release Registry

Since v2.0.0, we use [Github Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) as our official Helm Chart & Docker Image release registry.

It's recommended to deploy connectors with as [dependencies](https://helm.sh/docs/topics/chart_best_practices/dependencies/) of a Magda helm deployment.

```yaml
dependencies:
  - name: magda-project-open-data-connector
    version: "2.0.0"
    alias: connector-xxx
    repository: "oci://ghcr.io/magda-io/charts"
    tags:
      - connectors
      - connector-xxx
```

## Requirements

Kubernetes: `>= 1.21.0`

| Repository | Name | Version |
|------------|------|---------|
| oci://ghcr.io/magda-io/charts | magda-common | 2.1.1 |

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| config.defaultTimeZone | string | `"Australia/Sydney"` | The default time zone that will be used when timezone information is not available from source data fields. |
| config.id | string | `"default-project-open-data-connector"` |  |
| defaultImage.imagePullSecret | bool | `false` |  |
| defaultImage.pullPolicy | string | `"IfNotPresent"` |  |
| defaultImage.repository | string | `"ghcr.io/magda-io"` |  |
| defaultSettings.includeCronJobs | bool | `true` |  |
| defaultSettings.includeInitialJobs | bool | `false` |  |
| defaultTenantId | int | `0` |  |
| global.connectors.image | object | `{}` |  |
| global.image | object | `{}` |  |
| image.name | string | `"magda-project-open-data-connector"` |  |
| resources.limits.cpu | string | `"100m"` |  |
| resources.requests.cpu | string | `"50m"` |  |
| resources.requests.memory | string | `"30Mi"` |  |