/**
 * SubmitResultPanel - Displays submission results
 * 
 * Backend "submit" response shape (from runJudge):
 *   {
 *     verdict: "Accepted" | "Wrong Answer" | "Runtime Error" | "Time Limit Exceeded" | "Compilation Error",
 *     passed: boolean,
 *     details: {
 *       passed: boolean,
 *       totalCases: number,
 *       testCasesPassed: number,
 *       failedIndex: number,         // -1 if all passed
 *       userOutput: string | null,
 *       expectedOutput: string | null,
 *       input: string (if failed)    // added by runJudge
 *     },
 *     actualOutput: string,
 *     expectedOutput: string,
 *     rawResponse: { output, error, status, exit_code, signal, time, total, memory }
 *   }
 */

function SubmitResultPanel({ submitResult, darkMode }) {
    if (!submitResult) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-16">
                <svg className={`w-14 h-14 mb-4 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Click <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>"Submit"</span> to evaluate your solution
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                    Your code will run against all test cases (visible + hidden)
                </p>
            </div>
        );
    }

    // Handle string error responses
    if (typeof submitResult === 'string') {
        return (
            <div className={`rounded-xl border p-5 ${darkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🔴</span>
                    <h4 className={`font-bold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>Error</h4>
                </div>
                <p className={`text-sm font-mono ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{submitResult}</p>
            </div>
        );
    }

    const isAccepted = submitResult.passed === true || submitResult.verdict === 'Accepted';
    const verdict = submitResult.verdict || (isAccepted ? 'Accepted' : 'Error');
    const details = submitResult.details || {};
    const rawResponse = submitResult.rawResponse || {};

    // Extract execution stats from rawResponse
    const executionTime = rawResponse.time ? `${(parseFloat(rawResponse.time) * 1000).toFixed(0)} ms` : null;
    const totalTime = rawResponse.total ? `${(parseFloat(rawResponse.total) * 1000).toFixed(0)} ms` : null;
    const memoryUsage = rawResponse.memory ? `${(parseFloat(rawResponse.memory) / 1024).toFixed(1)} MB` : null;

    const getVerdictStyle = () => {
        switch (verdict) {
            case 'Accepted':
                return {
                    bg: darkMode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200',
                    text: darkMode ? 'text-emerald-400' : 'text-emerald-700',
                    icon: '🎉',
                    gradient: 'from-emerald-500 to-emerald-600',
                };
            case 'Wrong Answer':
                return {
                    bg: darkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200',
                    text: darkMode ? 'text-red-400' : 'text-red-700',
                    icon: '❌',
                    gradient: 'from-red-500 to-red-600',
                };
            case 'Time Limit Exceeded':
                return {
                    bg: darkMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200',
                    text: darkMode ? 'text-amber-400' : 'text-amber-700',
                    icon: '⏱️',
                    gradient: 'from-amber-500 to-amber-600',
                };
            case 'Runtime Error':
                return {
                    bg: darkMode ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200',
                    text: darkMode ? 'text-orange-400' : 'text-orange-700',
                    icon: '💥',
                    gradient: 'from-orange-500 to-orange-600',
                };
            case 'Compilation Error':
                return {
                    bg: darkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200',
                    text: darkMode ? 'text-red-400' : 'text-red-700',
                    icon: '🔴',
                    gradient: 'from-red-500 to-red-600',
                };
            default:
                return {
                    bg: darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200',
                    text: darkMode ? 'text-slate-300' : 'text-slate-700',
                    icon: '❓',
                    gradient: 'from-slate-500 to-slate-600',
                };
        }
    };

    const style = getVerdictStyle();
    const passedCount = details.testCasesPassed ?? 0;
    const totalCases = details.totalCases ?? 0;
    const progressPercent = totalCases > 0 ? (passedCount / totalCases) * 100 : 0;

    return (
        <div className="space-y-4">
            {/* Verdict Banner */}
            <div className={`rounded-xl border p-5 ${style.bg}`}>
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl sm:text-2xl">{style.icon}</span>
                    <h3 className={`text-lg sm:text-xl font-extrabold ${style.text}`}>{verdict}</h3>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Test Cases Progress */}
                <div className={`rounded-xl border p-4 ${darkMode ? 'bg-slate-800/50 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
                    <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        Test Cases
                    </div>
                    <div className={`text-xl sm:text-2xl font-extrabold mb-2 ${isAccepted ? (darkMode ? 'text-emerald-400' : 'text-emerald-600') : (darkMode ? 'text-red-400' : 'text-red-600')}`}>
                        {passedCount}<span className={`text-sm font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>/{totalCases}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div
                            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${style.gradient}`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Runtime */}
                {executionTime && (
                    <div className={`rounded-xl border p-4 ${darkMode ? 'bg-slate-800/50 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
                        <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Runtime
                        </div>
                        <div className={`text-xl sm:text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {executionTime}
                        </div>
                        {totalTime && (
                            <div className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                Total: {totalTime}
                            </div>
                        )}
                    </div>
                )}

                {/* Memory */}
                {memoryUsage && (
                    <div className={`rounded-xl border p-4 ${darkMode ? 'bg-slate-800/50 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
                        <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Memory
                        </div>
                        <div className={`text-xl sm:text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {memoryUsage}
                        </div>
                        <div className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {rawResponse.memory} KB
                        </div>
                    </div>
                )}
            </div>

            {/* Failed Test Case Details */}
            {!isAccepted && details.failedIndex !== undefined && details.failedIndex !== -1 && (
                <div className={`rounded-xl border p-4 ${darkMode ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                    <h5 className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        Failed at Test Case #{details.failedIndex + 1}
                    </h5>
                    <div className="space-y-2 font-mono text-xs">
                        {details.input && (
                            <div className="flex gap-2">
                                <span className={`font-bold flex-shrink-0 w-20 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Input</span>
                                <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{details.input}</span>
                            </div>
                        )}
                        {details.expectedOutput && (
                            <div className="flex gap-2">
                                <span className={`font-bold flex-shrink-0 w-20 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Expected</span>
                                <span className={`${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{details.expectedOutput}</span>
                            </div>
                        )}
                        {details.userOutput && (
                            <div className="flex gap-2">
                                <span className={`font-bold flex-shrink-0 w-20 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Output</span>
                                <span className={`${darkMode ? 'text-red-400' : 'text-red-600'}`}>{details.userOutput}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Error details (for Runtime/Compilation errors) */}
            {(verdict === 'Runtime Error' || verdict === 'Compilation Error') && details && typeof details === 'string' && (
                <div className={`rounded-xl border p-4 overflow-x-auto ${darkMode ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                    <h5 className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        Error Details
                    </h5>
                    <pre className={`text-xs font-mono whitespace-pre-wrap ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                        {details}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default SubmitResultPanel;
