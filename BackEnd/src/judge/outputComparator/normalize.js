
export const normalizeOutput = (output) => {
    if (!output) return "";
    return output.trim().replace(/\r\n/g, '\n');
};
