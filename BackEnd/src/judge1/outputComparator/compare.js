
import { normalizeOutput } from "./normalize.js";

export const compareOutput = (actual, expected) => {
    const cleanActual = normalizeOutput(actual);
    const cleanExpected = normalizeOutput(expected);

    // token based comparison
    const tokensActual = cleanActual.split(/\s+/).filter(t => t);
    const tokensExpected = cleanExpected.split(/\s+/).filter(t => t);

    for (let i = 0; i < tokensExpected.length; i++) {
        if (i >= tokensActual.length) {
            return {
                passed: false,
                totalCases: tokensExpected.length, 
                testCasesPassed: i,
                failedIndex: i, 
                userOutput: "End of Output",
                expectedOutput: tokensExpected[i]
            };
        }

        if (tokensActual[i] !== tokensExpected[i]) {
            return {
                passed: false,
                totalCases: tokensExpected.length,
                testCasesPassed: i,
                failedIndex: i,
                userOutput: tokensActual[i],
                expectedOutput: tokensExpected[i]
            };
        }
    }

    // Check if extra output from user
    if (tokensActual.length > tokensExpected.length) {
        return {
            passed: false,
            totalCases: tokensExpected.length,
            testCasesPassed: tokensExpected.length,
            failedIndex: tokensExpected.length,
            userOutput: tokensActual[tokensExpected.length],
            expectedOutput: "End of Output"
        };
    }

    return {
        passed: true,
        totalCases: tokensExpected.length,
        testCasesPassed: tokensExpected.length,
        failedIndex: -1,
        userOutput: null,
        expectedOutput: null
    };
};
