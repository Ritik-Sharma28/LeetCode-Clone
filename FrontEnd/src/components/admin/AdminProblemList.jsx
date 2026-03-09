import { useState } from 'react';

const DIFFICULTY_OPTIONS = ['', 'easy', 'medium', 'hard'];
const TAG_OPTIONS = ['', 'array', 'linkedList', 'graph', 'dp'];

const getDifficultyStyle = (d, dark) => {
    switch (d) {
        case 'easy': return dark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600';
        case 'medium': return dark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600';
        case 'hard': return dark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-600';
        default: return dark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500';
    }
};

function AdminProblemList({ problems, selectedId, onSelect, onCreate, darkMode }) {
    const [search, setSearch] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('');
    const [filterTag, setFilterTag] = useState('');

    const filtered = (problems || []).filter(p => {
        if (search && !p.title?.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterDifficulty && p.difficulty !== filterDifficulty) return false;
        if (filterTag && p.tags !== filterTag) return false;
        return true;
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b
                ${darkMode ? 'border-slate-700/60' : 'border-slate-200/60'}`}>
                <h2 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Problems ({filtered.length})
                </h2>
                <button
                    onClick={onCreate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New
                </button>
            </div>

            {/* Search + Filters */}
            <div className={`px-3 py-2.5 space-y-2 border-b ${darkMode ? 'border-slate-700/60' : 'border-slate-200/60'}`}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search problems..."
                    className={`w-full px-3 py-2 rounded-lg text-xs outline-none border transition-colors
                        ${darkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-300 placeholder:text-slate-600 focus:border-indigo-500/50'
                            : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400'
                        }`}
                />
                <div className="flex gap-2">
                    <select
                        value={filterDifficulty}
                        onChange={(e) => setFilterDifficulty(e.target.value)}
                        className={`flex-1 px-2 py-1.5 rounded-lg text-xs outline-none border transition-colors
                            ${darkMode
                                ? 'bg-slate-800 border-slate-700 text-slate-300'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                    >
                        <option value="">All Difficulty</option>
                        {DIFFICULTY_OPTIONS.filter(Boolean).map(d => (
                            <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                        ))}
                    </select>
                    <select
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                        className={`flex-1 px-2 py-1.5 rounded-lg text-xs outline-none border transition-colors
                            ${darkMode
                                ? 'bg-slate-800 border-slate-700 text-slate-300'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                    >
                        <option value="">All Tags</option>
                        {TAG_OPTIONS.filter(Boolean).map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Problem List */}
            <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                    <div className={`flex items-center justify-center py-12 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        No problems found
                    </div>
                ) : (
                    filtered.map((p) => (
                        <button
                            key={p._id}
                            onClick={() => onSelect(p._id)}
                            className={`w-full text-left px-4 py-3 border-b transition-colors
                                ${selectedId === p._id
                                    ? (darkMode ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200')
                                    : (darkMode ? 'border-slate-800 hover:bg-slate-800/60' : 'border-slate-100 hover:bg-slate-50')
                                }`}
                        >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                <h3 className={`text-xs font-bold leading-tight line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {p.title}
                                </h3>
                                <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold capitalize ${getDifficultyStyle(p.difficulty, darkMode)}`}>
                                    {p.difficulty}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {p.tags && (
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded
                                        ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                        {p.tags}
                                    </span>
                                )}
                                {p.problemCreator && (
                                    <span className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        by {p.problemCreator.firstName || p.problemCreator.emailId}
                                    </span>
                                )}
                                {p.createdAt && (
                                    <span className={`text-[10px] ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                        {formatDate(p.createdAt)}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}

export default AdminProblemList;
