/**
 * TestResultPanel - Displays run code results
 * 
 * Backend "run" response shape (from runTest):
 *   { success: bool, userOutput: string, expectedOutput: string, userError: string, compilationError: string|null }
 * 
 * rawResponse from compiler API (nested inside execution):
 *   { output, error, status, exit_code, signal, time, total, memory }
 * 
 * We also receive the customTestcases to display input context.
 */

function TestResultPanel({ runResult, testCases = [], darkMode }) {
    if (!runResult) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-16">
                <svg className={`w-14 h-14 mb-4 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Click <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>"Run"</span> to test your code
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                    Your code will be tested against visible test cases
                </p>
            </div>
        );
    }

    const hasCompilationError = runResult.compilationError;
    const isSuccess = runResult.success && !hasCompilationError;
    // Only treat it as a runtime error if it's NOT a success AND NOT a compilation error
    const hasError = !isSuccess && runResult.userError && !hasCompilationError;

    // Parse outputs - they may be multi-line with test case outputs separated by newlines
    const userOutputLines = runResult.userOutput ? runResult.userOutput.trim().split('\n').filter(l => l.trim()) : [];
    const expectedOutputLines = runResult.expectedOutput ? runResult.expectedOutput.trim().split('\n').filter(l => l.trim()) : [];

    // Compare outputs per test case
    const testCaseResults = testCases.map((tc, i) => ({
        input: tc.input,
        expected: expectedOutputLines[i] || tc.output || '—',
        actual: userOutputLines[i] || '—',
        passed: userOutputLines[i] !== undefined && expectedOutputLines[i] !== undefined
            ? userOutputLines[i].trim() === expectedOutputLines[i].trim()
            : false,
    }));

    const allPassed = isSuccess && testCaseResults.every(tc => tc.passed);

    return (
        <div className="space-y-4">
            {/* Status Banner */}
            <div className={`rounded-xl border p-4 transition-colors
                ${hasCompilationError
                    ? (darkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200')
                    : hasError
                        ? (darkMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200')
                        : allPassed
                            ? (darkMode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200')
                            : (darkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200')
                }`}
            >
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                        {hasCompilationError ? '🔴' : hasError ? '⚠️' : allPassed ? '✅' : '❌'}
                    </span>
                    <h4 className={`font-bold text-base
                        ${hasCompilationError
                            ? (darkMode ? 'text-red-400' : 'text-red-700')
                            : hasError
                                ? (darkMode ? 'text-amber-400' : 'text-amber-700')
                                : allPassed
                                    ? (darkMode ? 'text-emerald-400' : 'text-emerald-700')
                                    : (darkMode ? 'text-red-400' : 'text-red-700')
                        }`}
                    >
                        {hasCompilationError ? 'Compilation Error'
                            : hasError ? 'Runtime Error'
                                : allPassed ? 'All Test Cases Passed!'
                                    : 'Wrong Answer'}
                    </h4>
                </div>
            </div>

            {/* Compilation Error Details */}
            {hasCompilationError && (
                <div className={`rounded-xl border p-4 overflow-x-auto
                    ${darkMode ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                    <h5 className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        Error Output
                    </h5>
                    <pre className={`text-xs font-mono whitespace-pre-wrap ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                        {runResult.compilationError}
                    </pre>
                </div>
            )}

            {/* Runtime Error Details */}
            {hasError && !hasCompilationError && (
                <div className={`rounded-xl border p-4 overflow-x-auto
                    ${darkMode ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                    <h5 className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        Error Output
                    </h5>
                    <pre className={`text-xs font-mono whitespace-pre-wrap ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                        {runResult.userError}
                    </pre>
                </div>
            )}

            {/* Test Case Results */}
            {!hasCompilationError && testCaseResults.length > 0 && (
                <div className="space-y-3">
                    {testCaseResults.map((tc, i) => (
                        <div
                            key={i}
                            className={`rounded-xl border p-4 transition-colors
                                ${tc.passed
                                    ? (darkMode ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-200/60')
                                    : (darkMode ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50/50 border-red-200/60')
                                }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    Case {i + 1}
                                </span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md
                                    ${tc.passed
                                        ? (darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700')
                                        : (darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700')
                                    }`}
                                >
                                    {tc.passed ? '✓ Passed' : '✗ Failed'}
                                </span>
                            </div>
                            <div className="space-y-2 font-mono text-[10px] sm:text-xs">
                                <div className="flex gap-2">
                                    <span className={`font-bold flex-shrink-0 w-14 sm:w-20 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Input</span>
                                    <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{tc.input}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`font-bold flex-shrink-0 w-14 sm:w-20 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Expected</span>
                                    <span className={`${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{tc.expected}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`font-bold flex-shrink-0 w-14 sm:w-20 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Output</span>
                                    <span className={`${tc.passed
                                        ? (darkMode ? 'text-emerald-400' : 'text-emerald-600')
                                        : (darkMode ? 'text-red-400' : 'text-red-600')
                                        }`}>{tc.actual}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TestResultPanel;
