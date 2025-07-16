
import React, { useMemo, useState, useEffect } from 'react';
import { Workout } from '../types';
import { ICONS } from '../constants';

interface HistoryViewProps {
    workouts: Workout[];
    setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
    onAddToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ workouts, setWorkouts, onAddToast }) => {

    // Use state to track when the Recharts library is loaded.
    const [rechartsIsLoaded, setRechartsIsLoaded] = useState(!!(window as any).Recharts);

    useEffect(() => {
        if (rechartsIsLoaded) return;
        
        const intervalId = setInterval(() => {
            if ((window as any).Recharts) {
                setRechartsIsLoaded(true);
                clearInterval(intervalId);
            }
        }, 100);

        return () => clearInterval(intervalId);
    }, [rechartsIsLoaded]);

    // Destructure Recharts components only when it's loaded.
    const { 
        LineChart = null,
        Line = null,
        XAxis = null,
        YAxis = null,
        CartesianGrid = null,
        Tooltip = null,
        Legend = null,
        ResponsiveContainer = null
    } = rechartsIsLoaded ? (window as any).Recharts : {};

    const stats = useMemo(() => {
        const totalSets = workouts.reduce((acc, w) => acc + w.exercises.reduce((acc2, ex) => acc2 + ex.sets.length, 0), 0);
        const lastWorkout = workouts.length > 0 ? new Date(workouts[0].date).toLocaleDateString('pl-PL') : 'Brak';
        return {
            totalWorkouts: workouts.length,
            totalSets,
            lastWorkout
        };
    }, [workouts]);

    const chartData = useMemo(() => {
        if (!rechartsIsLoaded) {
            return [];
        }
        
        const exerciseData: { [key: string]: { date: Date, weight: number }[] } = {};
        
        workouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
                if (exercise.sets.length > 0) {
                    if (!exerciseData[exercise.name]) {
                        exerciseData[exercise.name] = [];
                    }
                    const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
                    exerciseData[exercise.name].push({
                        date: new Date(workout.date), // Store as Date object for correct sorting
                        weight: maxWeight,
                    });
                }
            });
        });
        
        return Object.entries(exerciseData)
            .filter(([, data]) => data.length >= 2) // only show charts for exercises with at least 2 data points
            .map(([name, data]) => ({
                name,
                data: data
                    .sort((a, b) => a.date.getTime() - b.date.getTime()) // Sort by date
                    .map(d => ({ // Then format date for display
                        weight: d.weight,
                        date: d.date.toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' })
                    })),
            }))
            .slice(0, 4); // show top 4 charts

    }, [workouts, rechartsIsLoaded]);

    const deleteWorkout = (id: number) => {
        setWorkouts(prev => prev.filter(w => w.id !== id));
        onAddToast('Trening usunięty', 'info');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Historia Treningów</h2>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-sm text-slate-400">Treningi</div>
                    <div className="text-3xl font-bold text-white">{stats.totalWorkouts}</div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-sm text-slate-400">Serie</div>
                    <div className="text-3xl font-bold text-white">{stats.totalSets}</div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-sm text-slate-400">Ostatni trening</div>
                    <div className="text-3xl font-bold text-white">{stats.lastWorkout}</div>
                </div>
            </div>

            {/* Charts */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Postępy</h3>
                 {!rechartsIsLoaded ? (
                    <div className="bg-slate-900/50 p-4 rounded-lg text-center text-slate-400">
                        Ładowanie biblioteki wykresów...
                    </div>
                ) : chartData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {chartData.map(({ name, data }) => (
                            <div key={name} className="bg-slate-900/50 p-4 rounded-lg">
                                <h4 className="font-semibold text-purple-300 mb-4">{name}</h4>
                                {ResponsiveContainer && LineChart && (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={data}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kg`} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                                            <Legend wrapperStyle={{fontSize: "14px"}} />
                                            <Line type="monotone" dataKey="weight" name="Max ciężar" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        ))}
                    </div>
                 ) : (
                    <div className="bg-slate-900/50 p-4 rounded-lg text-center text-slate-400">
                        Brak wystarczających danych do wyświetlenia postępów. Zapisz przynajmniej dwa treningi z tym samym ćwiczeniem.
                    </div>
                )}
            </div>

            {/* History List */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Lista Treningów</h3>
                {workouts.length > 0 ? workouts.map(workout => (
                    <div key={workout.id} className="bg-slate-900/50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-semibold text-white">{workout.planName}</h4>
                                <p className="text-sm text-slate-400">{new Date(workout.date).toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <button onClick={() => deleteWorkout(workout.id)} className="btn-icon-danger">{ICONS.trash}</button>
                        </div>
                        <div className="space-y-2">
                        {workout.exercises.map((ex, i) => ex.sets.length > 0 && (
                            <div key={i}>
                                <p className="text-sm font-medium text-purple-300">{ex.name}</p>
                                <div className="text-xs text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
                                    {ex.sets.map((set, setI) => (
                                        <span key={setI}>{`${set.weight}kg \u00D7 ${set.reps}`}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                )) : <p className="text-slate-400 text-center py-8">Brak zapisanych treningów.</p>}
            </div>
        </div>
    );
};

export default HistoryView;
