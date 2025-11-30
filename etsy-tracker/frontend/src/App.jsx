import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import './App.css';

const API_URL = '/api';

const TASKS = [
  { id: 'messages', name: 'Check & respond to messages', frequency: 'daily', priority: 'high', time: 15 },
  { id: 'orders', name: 'Process new orders', frequency: 'daily', priority: 'high', time: 5 },
  { id: 'photo', name: 'Photograph 3-5 items', frequency: 'daily', priority: 'high', time: 30 },
  { id: 'list', name: 'List 2-3 new items', frequency: 'daily', priority: 'high', time: 30 },
  { id: 'inventory', name: 'Update inventory counts', frequency: 'daily', priority: 'high', time: 10 },
  { id: 'social', name: 'Social media post', frequency: 'daily', priority: 'medium', time: 15 },
  { id: 'sourcing', name: 'Visit tip/thrift stores', frequency: 'weekly', priority: 'high', time: 90, days: [1, 3, 6] },
  { id: 'shipping', name: 'Package & ship orders', frequency: 'weekly', priority: 'high', time: 60, days: [1, 4] },
  { id: 'seo', name: 'Update SEO tags (10-15 listings)', frequency: 'weekly', priority: 'medium', time: 45, days: [2] },
  { id: 'research', name: 'Research pricing & trends', frequency: 'weekly', priority: 'medium', time: 30, days: [5] },
  { id: 'clean', name: 'Clean & prep inventory', frequency: 'weekly', priority: 'medium', time: 60, days: [5] },
  { id: 'analytics', name: 'Review analytics & sales', frequency: 'weekly', priority: 'medium', time: 20, days: [6] },
];

function App() {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [completions, setCompletions] = useState({});
  const [stats, setStats] = useState({ listed: 0, sales: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  useEffect(() => {
    loadData();
  }, [currentWeek]);

  const loadData = async () => {
    try {
      const weekKey = format(currentWeek, 'yyyy-MM-dd');
      const response = await fetch(`${API_URL}/completions/${weekKey}`);
      if (response.ok) {
        const data = await response.json();
        setCompletions(data.completions || {});
        setStats(data.stats || { listed: 0, sales: 0, revenue: 0 });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newCompletions, newStats) => {
    try {
      const weekKey = format(currentWeek, 'yyyy-MM-dd');
      await fetch(`${API_URL}/completions/${weekKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completions: newCompletions, stats: newStats })
      });
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const toggleTask = (taskId, dayIndex) => {
    const key = `${taskId}-${dayIndex}`;
    const newCompletions = { ...completions, [key]: !completions[key] };
    setCompletions(newCompletions);
    saveData(newCompletions, stats);
  };

  const updateStats = (field, value) => {
    const newStats = { ...stats, [field]: parseInt(value) || 0 };
    setStats(newStats);
    saveData(completions, newStats);
  };

  const getTasksForDay = (dayIndex) => {
    return TASKS.filter(task => {
      if (task.frequency === 'daily') return true;
      if (task.frequency === 'weekly' && task.days) {
        return task.days.includes(dayIndex);
      }
      return false;
    });
  };

  const getDayProgress = (dayIndex) => {
    const tasksForDay = getTasksForDay(dayIndex);
    const completed = tasksForDay.filter(task => completions[`${task.id}-${dayIndex}`]).length;
    return tasksForDay.length > 0 ? (completed / tasksForDay.length) * 100 : 0;
  };

  const getWeekProgress = () => {
    const allTasks = weekDays.flatMap((_, i) => getTasksForDay(i).map(t => `${t.id}-${i}`));
    const completed = allTasks.filter(key => completions[key]).length;
    return allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>📦 Etsy Shop Tracker</h1>
          <div className="week-nav">
            <button onClick={() => setCurrentWeek(addDays(currentWeek, -7))}>← Prev</button>
            <span className="week-label">
              Week of {format(currentWeek, 'MMM d, yyyy')}
            </span>
            <button onClick={() => setCurrentWeek(addDays(currentWeek, 7))}>Next →</button>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${getWeekProgress()}%` }}></div>
            <span className="progress-text">{getWeekProgress()}% Complete</span>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="stats-cards">
          <div className="stat-card">
            <label>Items Listed</label>
            <input 
              type="number" 
              value={stats.listed} 
              onChange={(e) => updateStats('listed', e.target.value)}
              className="stat-input"
            />
          </div>
          <div className="stat-card">
            <label>Sales</label>
            <input 
              type="number" 
              value={stats.sales} 
              onChange={(e) => updateStats('sales', e.target.value)}
              className="stat-input"
            />
          </div>
          <div className="stat-card">
            <label>Revenue</label>
            <div className="revenue-input">
              <span>$</span>
              <input 
                type="number" 
                value={stats.revenue} 
                onChange={(e) => updateStats('revenue', e.target.value)}
                className="stat-input"
              />
            </div>
          </div>
        </div>

        <div className="calendar-grid">
          {weekDays.map((day, dayIndex) => {
            const tasksForDay = getTasksForDay(dayIndex);
            const progress = getDayProgress(dayIndex);
            
            return (
              <div key={dayIndex} className="day-column">
                <div className="day-header">
                  <div className="day-name">{format(day, 'EEE')}</div>
                  <div className="day-date">{format(day, 'MMM d')}</div>
                  <div className="day-progress">
                    <div className="mini-progress" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
                <div className="tasks-list">
                  {tasksForDay.map(task => {
                    const key = `${task.id}-${dayIndex}`;
                    const isComplete = completions[key];
                    
                    return (
                      <div 
                        key={task.id}
                        className={`task-item ${isComplete ? 'completed' : ''} priority-${task.priority}`}
                        onClick={() => toggleTask(task.id, dayIndex)}
                      >
                        <div className="task-checkbox">
                          {isComplete && '✓'}
                        </div>
                        <div className="task-content">
                          <div className="task-name">{task.name}</div>
                          <div className="task-time">{task.time}m</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default App;
