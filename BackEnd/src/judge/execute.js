import { getLanguageVersion } from "../utils/language.js";
import { compileCode } from "./compile.js";
import { generateCode } from "./codeGenerator/index.js";
import { combineInputs } from "./inputBuilder/combineInput.js";

// Helper to run a batch of inputs against a code snippet
export const executeBatch = async ({ language, code, testCases, problemSignature }) => {
    try {
        const version = getLanguageVersion(language);
        if (!version) {
            throw new Error(`Unsupported language: ${language}`);
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
            language: language,
            version: version,
            files: [{ content: finalCode }],
            stdin: stdin,
        };

        const response = await compileCode(payload);

        if (!response.run) {
            return {
                success: false,
                output: null,
                error: "Compilation Error: No response from compiler service",
                rawResponse: response
            };
        }

        const { code: runCode, signal, stderr, stdout } = response.run;

        if (runCode !== 0 || signal !== null) {
            let verdict = "Runtime Error";
            let msg = stderr || stdout;

            if (signal === "SIGXCPU" || signal === "SIGKILL") verdict = "Time Limit Exceeded";
            else if (signal === "SIGSEGV") verdict = "Runtime Error (SIGSEGV)";

            return {
                success: false,
                output: stdout, // Return partial output if any
                error: `${verdict}: ${msg}`,
                rawResponse: response
            };
        }

        return {
            success: true,
            output: stdout,
            error: null,
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
