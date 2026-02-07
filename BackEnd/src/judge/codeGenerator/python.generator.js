
const generateInputReader = (args) => {
    let code = "";
    args.forEach(arg => {
        if (arg.type === "int") {
            code += `        ${arg.name} = int(sys.stdin.readline())\n`;
        } else if (arg.type === "list[int]" || arg.type === "vector<int>") {
            code += `        n_${arg.name} = int(sys.stdin.readline())\n`;
            code += `        ${arg.name} = list(map(int, sys.stdin.readline().split()))\n`;
        } else if (arg.type === "string") {
            code += `        ${arg.name} = sys.stdin.readline().strip()\n`;
        }
    });
    return code;
};

export const generatePythonCode = (userCode, problemSignature) => {
    const { functionName, returnType, args } = problemSignature;

    const reader = generateInputReader(args);
    const call = `result = sol.${functionName}(${args.map(a => a.name).join(", ")})`;

    // Output formatting
    let printer = `print(result)`;
    if (returnType === "list[int]" || returnType === "vector<int>") {
        printer = `print(" ".join(map(str, result)))`;
    }

    return `import sys
from typing import List

# User Code
${userCode}

if __name__ == "__main__":
    line = sys.stdin.readline()
    if not line:
        exit(0)
    T = int(line.strip())
    
    sol = Solution()
    
    for _ in range(T):
${reader}
        ${call}
        ${printer}
`;
}
