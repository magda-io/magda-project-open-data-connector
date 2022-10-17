# 2.0.0

-   Upgrade to typescript 4 & webpack 5
-   Upgrade @magda dependencies to v2
-   Release all artifacts to GitHub Container Registry (instead of docker.io & https://charts.magda.io)
-   Upgrade API version for CronJob to batch/v1 (for k8s v1.25 support)

# 1.1.0

-   Switch to github container registry
-   Use Node 16
-   Multi-arch docker image release
-   #16 strip html tags from license field
-   trim publisher name to avoid unnecessary blank
-   #1 make sure generated date string that doesn't match JSON schema (ISO 8601 format)

# 1.0.0

-   Upgrade dependencies
-   Upgrade CI scripts
-   Related to https://github.com/magda-io/magda/issues/3229, Use magda-common for docker image related logic
