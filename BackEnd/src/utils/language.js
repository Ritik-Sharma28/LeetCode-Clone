export const languageVersions = {
    java: "15.0.2",
    python: "3.10.0",
    cpp: "10.2.0",
    "c++": "10.2.0"
}

export const getLanguageVersion = (language) => {
    return languageVersions[language.toLowerCase()];
}
