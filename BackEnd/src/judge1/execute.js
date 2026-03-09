import { getOnlineCompilerId } from "./utils/languageMap.js";
import { compileCode } from "./compile.js";
import { generateCode } from "./codeGenerator/index.js";
import { combineInputs } from "./inputBuilder/combineInput.js";

// Helper to run a batch of inputs against a code snippet
export const executeBatch = async ({ language, code, testCases, problemSignature }) => {
    try {
        const compilerId = getOnlineCompilerId(language);
        if (!compilerId) {
            throw new Error(`Unsupported language for onlinecompiler.io: ${language}`);
        }

        const inputs = testCases.map(tc => tc.input);
        const stdin = combineInputs(inputs);

        if (!problemSignature) {
            throw new Error("Problem signature is required for code generation.");
        }

        const finalCode = generateCode(language, code, problemSignature);
        if (!finalCode) {
            throw new Error(`Code generation failed for ${language}`);
        }

        const payload = {
            compiler: compilerId,
            code: finalCode,
            input: stdin,
        };

        const response = await compileCode(payload);

        if (!response) {
            return {
                success: false,
                output: null,
                error: "Execution Error: No response from compiler service",
                rawResponse: response
            };
        }

        const { output, error: execError, status, exit_code, signal } = response;

        if (status !== "success" || exit_code !== 0 || signal !== null) {
            let verdict = "Runtime Error";
            let msg = execError || output;

            if (exit_code === 137 || signal === 9) verdict = "Time Limit Exceeded";
            else if (exit_code === 139 || signal === 11) verdict = "Runtime Error (SIGSEGV)";
            else if (exit_code === 124) verdict = "Time Limit Exceeded";

            return {
                success: false,
                output: output, // Return partial output if any
                error: `${verdict}: ${msg}`,
                rawResponse: response
            };
        }

        return {
            success: true,
            output: output,
            error: execError || null, // pass along the warning but keep success true
            rawResponse: response
        };

    } catch (error) {
        return {
            success: false,
            output: null,
            error: error.message
        };
    }
};
