import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../services/axiosClient';
import Navbar from '../components/Navbar';

const getDifficultyStyle = (difficulty, darkMode) => {
    switch (difficulty?.toLowerCase()) {
        case 'easy': return { dot: 'bg-emerald-500', text: darkMode ? 'text-emerald-400' : 'text-emerald-600' };
        case 'medium': return { dot: 'bg-amber-500', text: darkMode ? 'text-amber-400' : 'text-amber-600' };
        case 'hard': return { dot: 'bg-red-500', text: darkMode ? 'text-red-400' : 'text-red-600' };
        default: return { dot: 'bg-slate-400', text: darkMode ? 'text-slate-400' : 'text-slate-500' };
    }
};

function Homepage() {
    const { user } = useSelector((state) => state.auth);
    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [tagFilter, setTagFilter] = useState('all');
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const { data } = await axiosClient.get('/problem/getAllProblem');
                setProblems(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching problems:', error);
                setProblems([]);
            }
        };

        const fetchSolvedProblems = async () => {
            try {
                const { data } = await axiosClient.get('/problem/problemSolvedByUser');
                setSolvedProblems(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching solved problems:', error);
                setSolvedProblems([]);
            }
        };

        const loadData = async () => {
            await fetchProblems();
            if (user) await fetchSolvedProblems();
        };

        loadData();
    }, [user]);

    const solvedIds = new Set(solvedProblems.map(sp => sp._id));

    const filteredProblems = problems.filter(problem => {
        if (activeTab === 'solved' && !solvedIds.has(problem._id)) return false;
        if (difficultyFilter !== 'all' && problem.difficulty !== difficultyFilter) return false;
        if (tagFilter !== 'all' && problem.tags !== tagFilter) return false;
        if (search.trim() && !problem.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
        return true;
    });

    const solvedCount = problems.filter(p => solvedIds.has(p._id)).length;
    const easyCount = problems.filter(p => p.difficulty === 'easy').length;
    const mediumCount = problems.filter(p => p.difficulty === 'medium').length;
    const hardCount = problems.filter(p => p.difficulty === 'hard').length;

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-indigo-50/30'}`}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

            {/* Background effects */}
            <div className={`fixed top-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px] pointer-events-none ${darkMode ? 'bg-indigo-500/5' : 'bg-indigo-400/5'}`} />
            <div className={`fixed bottom-[-15%] left-[-5%] w-[35vw] h-[35vw] rounded-full blur-[80px] pointer-events-none ${darkMode ? 'bg-purple-500/5' : 'bg-purple-400/5'}`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

                {/* Welcome */}
                <div className="mb-8">
                    <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">{user?.firstName || 'Coder'}</span>
                    </h1>
                    <p className={`mt-1 text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Track your progress and keep solving.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                    {[
                        { label: 'Total', value: problems.length, sub: `${solvedCount} solved`, gradient: darkMode ? 'from-slate-700 to-slate-800' : 'from-slate-600 to-slate-800', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
                        { label: 'Easy', value: easyCount, sub: null, gradient: 'from-emerald-500 to-emerald-700', icon: 'M5 13l4 4L19 7' },
                        { label: 'Medium', value: mediumCount, sub: null, gradient: 'from-amber-500 to-amber-700', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                        { label: 'Hard', value: hardCount, sub: null, gradient: 'from-red-500 to-red-700', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' },
                    ].map((stat, i) => (
                        <div key={i} className={`rounded-2xl border p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200
                            ${darkMode
                                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                : 'bg-white border-slate-200/60'
                            }`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm`}>
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                                    </svg>
                                </div>
                                {stat.sub && (
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg
                                        ${darkMode ? 'text-indigo-400 bg-indigo-500/10' : 'text-indigo-600 bg-indigo-50'}`}>
                                        {stat.sub}
                                    </span>
                                )}
                            </div>
                            <div className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</div>
                            <div className={`text-xs font-medium mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{stat.label} Problems</div>
                        </div>
                    ))}
                </div>

                {/* Tabs + Search + Filters Row */}
                <div className="flex flex-col gap-4 mb-6">
                    {/* Tabs Row */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {[
                            { key: 'all', label: 'All Problems', count: problems.length },
                            { key: 'solved', label: 'Solved', count: solvedCount },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                                    ${activeTab === tab.key
                                        ? (darkMode
                                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-sm'
                                            : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20')
                                        : (darkMode
                                            ? 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-slate-300'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-800 shadow-sm')
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-md font-bold
                                    ${activeTab === tab.key
                                        ? (darkMode ? 'bg-indigo-500/30 text-indigo-300' : 'bg-white/20 text-white')
                                        : (darkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-100 text-slate-500')
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search + Filters */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <svg className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search problems..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all duration-200
                                    ${darkMode
                                        ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 hover:border-slate-300'
                                    }`}
                            />
                        </div>

                        {/* Difficulty Filter */}
                        <select
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                            className={`px-3 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all cursor-pointer
                                ${darkMode
                                    ? 'bg-slate-900 border-slate-700 text-slate-300 focus:border-indigo-500'
                                    : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500 hover:border-slate-300'
                                }`}
                        >
                            <option value="all">All Levels</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>

                        {/* Tag Filter */}
                        <select
                            value={tagFilter}
                            onChange={(e) => setTagFilter(e.target.value)}
                            className={`px-3 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all cursor-pointer
                                ${darkMode
                                    ? 'bg-slate-900 border-slate-700 text-slate-300 focus:border-indigo-500'
                                    : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500 hover:border-slate-300'
                                }`}
                        >
                            <option value="all">All Tags</option>
                            <option value="array">Array</option>
                            <option value="linkedList">Linked List</option>
                            <option value="graph">Graph</option>
                            <option value="dp">DP</option>
                        </select>

                        {/* Count */}
                        <div className={`hidden sm:block text-xs font-medium ml-auto ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>

                {/* Problems Table */}
                <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300
                    ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/60'}`}>

                    {/* Table Header */}
                    <div className={`hidden sm:grid sm:grid-cols-[minmax(0,1fr)_100px_100px_80px] gap-4 px-6 py-3 border-b text-xs font-bold uppercase tracking-wider
                        ${darkMode
                            ? 'bg-slate-800/50 border-slate-800 text-slate-500'
                            : 'bg-slate-50/80 border-slate-100 text-slate-500'
                        }`}>
                        <span>Title</span>
                        <span>Difficulty</span>
                        <span>Tag</span>
                        <span className="text-right">Status</span>
                    </div>

                    {/* Rows */}
                    {filteredProblems.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <svg className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No problems found</p>
                            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>Try adjusting your filters or search query</p>
                        </div>
                    ) : (
                        filteredProblems.map((problem, idx) => {
                            const diffStyle = getDifficultyStyle(problem.difficulty, darkMode);
                            const isSolved = solvedIds.has(problem._id);

                            return (
                                <NavLink
                                    key={problem._id}
                                    to={`/problem/${problem._id}`}
                                    className={`block sm:grid sm:grid-cols-[minmax(0,1fr)_100px_100px_80px] gap-4 px-5 sm:px-6 py-4 items-center transition-colors cursor-pointer group
                                        ${idx !== filteredProblems.length - 1
                                            ? (darkMode ? 'border-b border-slate-800' : 'border-b border-slate-100')
                                            : ''
                                        }
                                        ${darkMode ? 'hover:bg-slate-800/60' : 'hover:bg-indigo-50/40'}`}
                                >
                                    {/* Title */}
                                    <div className="flex items-center gap-3 mb-2 sm:mb-0 min-w-0">
                                        <span className={`text-xs font-bold w-6 text-right hidden sm:block flex-shrink-0 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>{idx + 1}</span>
                                        <h3 className={`text-sm font-semibold transition-colors truncate
                                            ${darkMode
                                                ? 'text-slate-200 group-hover:text-indigo-400'
                                                : 'text-slate-800 group-hover:text-indigo-700'
                                            }`}>
                                            {problem.title}
                                        </h3>
                                    </div>

                                    {/* Difficulty */}
                                    <div className="inline-flex sm:flex items-center gap-1.5 mr-2 sm:mr-0 mb-2 sm:mb-0">
                                        <span className={`w-1.5 h-1.5 rounded-full ${diffStyle.dot}`} />
                                        <span className={`text-xs font-semibold capitalize ${diffStyle.text}`}>{problem.difficulty}</span>
                                    </div>

                                    {/* Tag */}
                                    <div className="inline-flex sm:flex mb-2 sm:mb-0">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize
                                            ${darkMode ? 'text-slate-400 bg-slate-800' : 'text-slate-500 bg-slate-100'}`}>
                                            {problem.tags}
                                        </span>
                                    </div>

                                    {/* Status */}
                                    <div className="sm:text-right">
                                        {isSolved ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Solved
                                            </span>
                                        ) : (
                                            <span className={`text-xs font-medium ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>—</span>
                                        )}
                                    </div>
                                </NavLink>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default Homepage;