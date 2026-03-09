import { executeBatch } from "./execute.js";

// Logic to handle "Run Code" request
export const runTest = async ({ language, code, input, problemSignature, referenceSolution }) => {
    try {

        // let testCases = [];
        // if (Array.isArray(input)) {
            // Assume input is already an array of {input: "..."} objects
          const  testCases = input;
        // } else {
        //     // Backward compatibility: Input is a single string
        //     testCases = [{ input: input }];
        // }

        // 2. Run User Code
        const userExecutionPromise = executeBatch({
            language,
            code,
            testCases: testCases,
            problemSignature
        });


        let expectedExecutionPromise = Promise.resolve(null);

        if (referenceSolution && referenceSolution.length > 0) {

            const refSol = referenceSolution.find(s => s.language === language) || referenceSolution[0];

            if (refSol) {
                expectedExecutionPromise = executeBatch({
                    language: refSol.language,
                    code: refSol.completeCode,
                    testCases: testCases,
                    problemSignature
                });
            }
        }

        const [userResult, expectedResult] = await Promise.all([userExecutionPromise, expectedExecutionPromise]);

        return {
            success: true,
            userOutput: userResult.output,
            userError: userResult.error,
            expectedOutput: expectedResult ? expectedResult.output : null,
            expectedError: expectedResult ? expectedResult.error : null,
            compilationError: !userResult.success && userResult.error.includes("Compilation") ? userResult.error : null
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};
