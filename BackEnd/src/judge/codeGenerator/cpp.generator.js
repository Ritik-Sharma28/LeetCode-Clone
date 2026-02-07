
const generateInputReader = (args) => {
    let readerCode = "";
    args.forEach((arg) => {
        if (arg.type === "int") {
            readerCode += `
        int ${arg.name};
        cin >> ${arg.name};
      `;
        } else if (arg.type === "vector<int>") {
            readerCode += `
        int n_${arg.name};
        cin >> n_${arg.name};
        vector<int> ${arg.name}(n_${arg.name});
        for(int i = 0; i < n_${arg.name}; i++) cin >> ${arg.name}[i];
      `;
        }
        // Add more types as needed (string, etc.)
    });
    return readerCode;
};

const generateFunctionCall = (functionName, args) => {
    const argNames = args.map(arg => arg.name).join(", ");
    return `sol.${functionName}(${argNames})`;
}

const generateOutputPrinter = (returnType) => {
    if (returnType === "vector<int>") {
        return `
        for(size_t i=0; i<result.size(); i++) {
            cout << result[i] << (i == result.size() - 1 ? "" : " ");
        }
        cout << endl;
        `;
    } else if (returnType === "int") {
        return `cout << result << endl;`;
    }
    // Add more types
    return `cout << result << endl;`;
}

export const generateCppCode = (userCode, problemSignature) => {
    const { functionName, returnType, args } = problemSignature;

    const inputReader = generateInputReader(args);
    const functionCall = generateFunctionCall(functionName, args);
    const outputPrinter = generateOutputPrinter(returnType);

    return `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <unordered_map>
#include <set>
#include <unordered_set>

using namespace std;

${userCode}

int main() {
    int T;
    if (!(cin >> T)) return 0;
    
    Solution sol;
    
    while(T--) {
        ${inputReader}
        
        ${returnType} result = ${functionCall};
        
        ${outputPrinter}
    }
    return 0;
}
`;
};
