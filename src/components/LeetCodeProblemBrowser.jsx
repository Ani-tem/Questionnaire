import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ExternalLink, Search, Filter, Loader2 } from 'lucide-react';

const LeetCodeProblemBrowser = () => {
  const [timeFrame, setTimeFrame] = useState('30');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('frequency');
  const [sortOrder, setSortOrder] = useState('desc');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [problemsData, setProblemsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load problems data based on timeframe
  const loadProblemsData = async (timeframe) => {
    setLoading(true);
    setError(null);
    
    try {
      let data;
      
      switch (timeframe) {
        case '30':
          // Import your 30-day JSON file
          data = await import('../data/30days.json');
          break;
        case '90':
          // Import your 3-month JSON file
          data = await import('../data/3months.json');
          break;
        case '180':
          // Import your 6-month JSON file
          data = await import('../data/6months.json');
          break;
        default:
          // You can combine all or use the largest dataset
          data = await import('../data/6months.json');
          break;
      }
      
      setProblemsData(data.default || data);
    } catch (err) {
      setError(`Failed to load ${timeframe} data: ${err.message}`);
      console.error('Error loading problems data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data when timeframe changes
  useEffect(() => {
    loadProblemsData(timeFrame);
  }, [timeFrame]);

  const filteredAndSortedProblems = useMemo(() => {
    if (!problemsData.length) return [];

    let filtered = [...problemsData];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(problem => 
        problem.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.Topics.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by difficulty
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(problem => 
        problem.Difficulty.toLowerCase() === difficultyFilter
      );
    }

    // Sort problems
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'frequency') {
        aValue = a.Frequency;
        bValue = b.Frequency;
      } else if (sortBy === 'acceptance') {
        aValue = a["Acceptance Rate"];
        bValue = b["Acceptance Rate"];
      } else if (sortBy === 'title') {
        aValue = a.Title.toLowerCase();
        bValue = b.Title.toLowerCase();
      }

      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [problemsData, searchTerm, sortBy, sortOrder, difficultyFilter]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'text-green-400 bg-green-900/30 border-green-500/30';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30';
      case 'HARD': return 'text-red-400 bg-red-900/30 border-red-500/30';
      default: return 'text-gray-400 bg-gray-800/30 border-gray-500/30';
    }
  };

  const getTimeFrameLabel = (timeframe) => {
    switch (timeframe) {
      case '30': return '30 Days';
      case '90': return '3 Months';
      case '180': return '6 Months';
      default: return 'All Problems';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-move"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-black via-red-900/20 to-black border-b border-red-500/20 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600/5 to-transparent animate-pulse-glow"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-5xl font-bold text-center mb-4 animate-title-glow">
            <span className="bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent">
               Google Questionaire
            </span>
          </h1>
          <p className="text-center text-gray-300 text-lg animate-subtitle-fade">
            Practice problems sorted by frequency and difficulty
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900/50 backdrop-blur-xl shadow-lg border-b border-red-500/20 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            
            {/* Time Frame Selector */}
            <div className="flex items-center gap-3 animate-control-slide-in">
              <label className="font-medium text-gray-200">Time Frame:</label>
              <div className="relative group">
                <select 
                  value={timeFrame} 
                  onChange={(e) => setTimeFrame(e.target.value)}
                  className="appearance-none bg-gray-800/70 border border-gray-600/50 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-white backdrop-blur-sm hover:bg-gray-800/90 hover:border-red-500/50"
                  disabled={loading}
                >
                  <option value="30">30 Days</option>
                  <option value="90">3 Months</option>
                  <option value="180">6 Months</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 pointer-events-none text-gray-400 group-hover:text-red-400 transition-colors duration-300" />
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 animate-control-slide-in" style={{ animationDelay: '0.1s' }}>
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800/70 border border-gray-600/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-gray-800/90 hover:border-red-500/50"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-3 animate-control-slide-in" style={{ animationDelay: '0.2s' }}>
              <Filter className="h-4 w-4 text-gray-400" />
              <select 
                value={difficultyFilter} 
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="appearance-none bg-gray-800/70 border border-gray-600/50 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-white backdrop-blur-sm hover:bg-gray-800/90 hover:border-red-500/50"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-3 animate-control-slide-in" style={{ animationDelay: '0.3s' }}>
              <label className="font-medium text-gray-200">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-800/70 border border-gray-600/50 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-white backdrop-blur-sm hover:bg-gray-800/90 hover:border-red-500/50"
              >
                <option value="frequency">Frequency</option>
                <option value="acceptance">Acceptance Rate</option>
                <option value="title">Title</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="px-4 py-2 bg-gray-800/70 border border-gray-600/50 rounded-lg hover:bg-red-900/30 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm"
              >
                {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-red-500" />
            <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-red-500/30 animate-ping"></div>
          </div>
          <span className="ml-4 text-gray-300 text-lg">Loading {getTimeFrameLabel(timeFrame)} problems...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-red-300 backdrop-blur-sm animate-error-shake">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Problems List */}
      {!loading && !error && (
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-8 animate-stats-fade">
            <div className="flex items-center justify-between bg-gray-900/30 rounded-lg p-4 backdrop-blur-sm border border-gray-700/50">
              <p className="text-gray-200">
                Showing <span className="font-bold text-red-400 animate-number-glow">{filteredAndSortedProblems.length}</span> problems
                {timeFrame !== 'all' && (
                  <span className="text-gray-400"> from {getTimeFrameLabel(timeFrame)}</span>
                )}
              </p>
              {problemsData.length > 0 && (
                <div className="text-sm text-gray-400">
                  Total in dataset: <span className="text-red-400 font-semibold">{problemsData.length}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {filteredAndSortedProblems.map((problem, index) => (
              <div 
                key={index} 
                className="bg-gray-900/40 border border-gray-700/50 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 transform hover:-translate-y-2 hover:bg-gray-900/60 backdrop-blur-sm animate-card-appear group"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">
                        {problem.Title}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(problem.Difficulty)} transition-all duration-300 group-hover:scale-105`}>
                        {problem.Difficulty}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-8 text-sm text-gray-300 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-400">Frequency:</span>
                        <span className="text-red-400 font-bold text-lg animate-pulse">{problem.Frequency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-400">Acceptance:</span>
                        <span className="text-green-400 font-bold text-lg">
                          {(problem["Acceptance Rate"] * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {problem.Topics && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {problem.Topics.split(', ').map((topic, topicIndex) => (
                          <span 
                            key={topicIndex}
                            className="px-3 py-1 bg-gray-800/50 text-gray-300 text-xs rounded-full border border-gray-600/30 hover:bg-red-900/30 hover:border-red-500/50 hover:text-red-300 transition-all duration-300 transform hover:scale-105 cursor-default"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <a
                    href={problem.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-red-500/30 active:scale-95 font-semibold"
                  >
                    <span>Solve</span>
                    <ExternalLink className="h-4 w-4 animate-bounce" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedProblems.length === 0 && !loading && (
            <div className="text-center py-16 animate-empty-state">
              <div className="text-gray-600 text-8xl mb-6 animate-bounce">🔍</div>
              <p className="text-gray-400 text-xl mb-2">No problems found matching your criteria.</p>
              <p className="text-gray-500 text-sm">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      )}

     
    </div>
  );
};

export default LeetCodeProblemBrowser;