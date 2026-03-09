import { useState } from 'react';

function CustomTestcasePanel({ testcases, setTestcases, darkMode }) {
    const [activeTab, setActiveTab] = useState(0);

    const handleInputSwitch = (index) => {
        setActiveTab(index);
    };

    const handleAddTestcase = () => {
        if (testcases.length < 4) {
            setTestcases([...testcases, { input: '' }]);
            setActiveTab(testcases.length);
        }
    };

    const handleRemoveTestcase = (index, e) => {
        e.stopPropagation();
        const newTestcases = testcases.filter((_, i) => i !== index);
        setTestcases(newTestcases);

        // Adjust active tab if needed
        if (activeTab === index) {
            setActiveTab(Math.max(0, index - 1));
        } else if (activeTab > index) {
            setActiveTab(activeTab - 1);
        }
    };

    const handleInputChange = (e) => {
        const newTestcases = [...testcases];
        newTestcases[activeTab].input = e.target.value;
        setTestcases(newTestcases);
    };

    const activeInput = testcases[activeTab] ? testcases[activeTab].input : '';

    return (
        <div className="flex-1 flex flex-col h-full bg-transparent overflow-hidden">
            {/* Top Bar: Tabs for each testcase */}
            <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 p-3 sm:p-4 pb-0`}>
                {testcases.map((tc, index) => (
                    <div
                        key={index}
                        onClick={() => handleInputSwitch(index)}
                        className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg cursor-pointer transition-colors text-xs sm:text-sm font-semibold
                            ${activeTab === index
                                ? (darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600')
                                : (darkMode ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                            }`}
                    >
                        <span>Case {index + 1}</span>
                        {/* Only allow removing if there's more than 1 testcase */}
                        {testcases.length > 1 && (
                            <button
                                onClick={(e) => handleRemoveTestcase(index, e)}
                                className={`opacity-0 group-hover:opacity-100 p-0.5 rounded transition-colors
                                    ${darkMode ? 'hover:bg-slate-700 hover:text-red-400' : 'hover:bg-slate-300 hover:text-red-500'}`}
                                title="Remove testcase"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                ))}

                {testcases.length < 4 && (
                    <button
                        onClick={handleAddTestcase}
                        className={`flex items-center justify-center p-1.5 rounded-lg transition-colors border border-dashed
                            ${darkMode
                                ? 'border-slate-600 text-slate-400 hover:text-indigo-400 hover:border-indigo-400/50 hover:bg-indigo-500/10'
                                : 'border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50'
                            }`}
                        title="Add New Testcase"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Content: Textarea for the active testcase */}
            <div className="flex-1 px-3 sm:px-4 pb-3 sm:pb-4 min-h-0">
                <div className="h-full flex flex-col">
                    <label className={`text-xs font-bold uppercase mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                        Input (Case {Math.min(activeTab + 1, testcases.length)})
                    </label>
                    <textarea
                        value={activeInput}
                        onChange={handleInputChange}
                        className={`flex-1 w-full p-3 sm:p-4 rounded-xl font-mono text-xs sm:text-sm resize-none outline-none transition-colors border
                            ${darkMode
                                ? 'bg-slate-900 border-slate-700 text-slate-300 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50'
                                : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400'
                            }`}
                        placeholder="Enter test case input here..."
                        spellCheck="false"
                    />
                </div>
            </div>
        </div>
    );
}

export default CustomTestcasePanel;
