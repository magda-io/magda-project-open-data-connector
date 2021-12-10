function trimString(str: string) {
    if (!str) {
        return "";
    }
    if (typeof str === "string") {
        return str.trim();
    } else {
        return str + "";
    }
}

export default trimString;
