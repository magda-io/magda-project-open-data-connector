var striptags = libraries.striptags;

return {
    title: distribution.title,
    description: distribution.description,
    accessURL: distribution.accessURL,
    downloadURL: distribution.downloadURL,
    mediaType: distribution.mediaType,
    license: dataset.license ? striptags(dataset.license) : "",
    format: distribution.format
};
