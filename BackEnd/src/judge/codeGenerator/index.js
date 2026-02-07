
import { generateCppCode } from "./cpp.generator.js";
import { generatePythonCode } from "./python.generator.js";

export const generateCode = (language, userCode, problemSignature) => {
    switch (language.toLowerCase()) {
        case 'cpp':
        case 'c++':
            return generateCppCode(userCode, problemSignature);
        case 'python':
        case 'python3':
            return generatePythonCode(userCode, problemSignature);
        default:
            return null;
    }
}
