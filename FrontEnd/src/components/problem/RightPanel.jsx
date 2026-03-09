import { useState } from 'react';
import CodeEditor from './CodeEditor';
import CustomTestcasePanel from './CustomTestcasePanel';
import TestResultPanel from './TestResultPanel';
import SubmitResultPanel from './SubmitResultPanel';
import ActionBar from './ActionBar';

const RIGHT_TABS = [
    { key: 'code', label: 'Code', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { key: 'testcases', label: 'Testcases', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
    { key: 'test_result', label: 'Test Result', icon: 'M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5' },
    { key: 'submit_result', label: 'Submit Result', icon: 'M4.5 12.75l6 6 9-13.5' },
];

function RightPanel({
    code,
    selectedLanguage,
    onCodeChange,
    onLanguageChange,
    onRun,
    onSubmit,
    loading,
    runResult,
    submitResult,
    customTestcases,
    setCustomTestcases,
    darkMode,
    activeRightTab,
    setActiveRightTab,
}) {
    return (
        <div className="flex-1 flex flex-col min-h-0">
            {/* Tab Navigation */}
            <div className={`flex items-center gap-1 px-2 sm:px-3 py-2 border-b overflow-x-auto scrollbar-none
                ${darkMode
                    ? 'bg-slate-900/60 border-slate-700/60'
                    : 'bg-slate-50/60 border-slate-200/60'
                }`}
            >
                {RIGHT_TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveRightTab(tab.key)}
                        className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-200
                            ${activeRightTab === tab.key
                                ? (darkMode
                                    ? 'bg-indigo-500/15 text-indigo-400 shadow-sm'
                                    : 'bg-indigo-50 text-indigo-700 shadow-sm')
                                : (darkMode
                                    ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/80'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100')
                            }`}
                    >
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                        </svg>
                        {tab.label}
                        {/* Show dot indicator for results */}
                        {tab.key === 'test_result' && runResult && (
                            <span className={`w-1.5 h-1.5 rounded-full ${runResult.success ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        )}
                        {tab.key === 'submit_result' && submitResult && (
                            <span className={`w-1.5 h-1.5 rounded-full ${submitResult.passed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 flex flex-col min-h-0">
                {activeRightTab === 'code' && (
                    <CodeEditor
                        code={code}
                        selectedLanguage={selectedLanguage}
                        onCodeChange={onCodeChange}
                        onLanguageChange={onLanguageChange}
                        darkMode={darkMode}
                    />
                )}

                {activeRightTab === 'testcases' && (
                    <CustomTestcasePanel
                        testcases={customTestcases}
                        setTestcases={setCustomTestcases}
                        darkMode={darkMode}
                    />
                )}

                {activeRightTab === 'test_result' && (
                    <div className="flex-1 overflow-y-auto p-3 sm:p-5">
                        <TestResultPanel runResult={runResult} testCases={customTestcases} darkMode={darkMode} />
                    </div>
                )}

                {activeRightTab === 'submit_result' && (
                    <div className="flex-1 overflow-y-auto p-3 sm:p-5">
                        <SubmitResultPanel submitResult={submitResult} darkMode={darkMode} />
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <ActionBar
                onRun={onRun}
                onSubmit={onSubmit}
                onConsole={() => setActiveRightTab('testcases')}
                loading={loading}
                darkMode={darkMode}
            />
        </div>
    );
}

export default RightPanel;
