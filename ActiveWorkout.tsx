
import React, { useState, useEffect, useMemo } from 'react';
import { Workout, Exercise, Set } from '../types';
import { ICONS } from '../constants';

interface ActiveWorkoutProps {
    workout: Workout;
    onFinishWorkout: (workout: Workout) => void;
    workoutsHistory: Workout[];
    onAddToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({ workout, onFinishWorkout, workoutsHistory, onAddToast }) => {
    const [currentWorkout, setCurrentWorkout] = useState<Workout>(workout);
    const [workoutElapsed, setWorkoutElapsed] = useState(0);
    const [restRemaining, setRestRemaining] = useState(0);

    // Workout Timer
    useEffect(() => {
        const timer = setInterval(() => setWorkoutElapsed(p => p + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    // Rest Timer
    useEffect(() => {
        if (restRemaining > 0) {
            const timer = setInterval(() => {
                setRestRemaining(p => {
                    if (p - 1 <= 0) {
                        onAddToast('Koniec przerwy!', 'info');
                        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
                        return 0;
                    }
                    return p - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [restRemaining, onAddToast]);
    
    const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

    const addSet = (exerciseIndex: number, set: Set) => {
        const newExercises = [...currentWorkout.exercises];
        newExercises[exerciseIndex].sets.push(set);
        setCurrentWorkout({ ...currentWorkout, exercises: newExercises });
        setRestRemaining(120); // Start 2-min rest timer
        onAddToast(`Seria dodana: ${set.weight}kg \u00D7 ${set.reps}`, 'success');
    };
    
    const removeSet = (exerciseIndex: number, setIndex: number) => {
        const newExercises = [...currentWorkout.exercises];
        newExercises[exerciseIndex].sets.splice(setIndex, 1);
        setCurrentWorkout({ ...currentWorkout, exercises: newExercises });
    };

    const handleFinish = () => {
        onFinishWorkout({ ...currentWorkout, duration: workoutElapsed, completedAt: new Date().toISOString() });
    };

    const lastWorkoutData = useMemo(() => {
        const data = new Map<string, { date: string; sets: Set[] }>();
        for (const exercise of workout.exercises) {
            const last = workoutsHistory.find(w => w.exercises.some(e => e.name === exercise.name && e.sets.length > 0));
            if (last) {
                const lastEx = last.exercises.find(e => e.name === exercise.name);
                if (lastEx) {
                    data.set(exercise.name, { date: last.date, sets: lastEx.sets });
                }
            }
        }
        return data;
    }, [workout.exercises, workoutsHistory]);
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white">{currentWorkout.planName}</h2>
                <button onClick={handleFinish} className="btn-primary w-full sm:w-auto">Zakończ Trening</button>
            </div>

            {/* Timers */}
            <div className="bg-slate-900/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center">
                    <div className="text-sm text-slate-400">Czas treningu</div>
                    <div className="text-3xl font-bold text-white">{formatTime(workoutElapsed)}</div>
                </div>
                <div className={`text-center transition-opacity ${restRemaining > 0 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="text-sm text-purple-300">Przerwa</div>
                    <div className="text-3xl font-bold text-purple-400">{formatTime(restRemaining)}</div>
                </div>
                <div className="flex gap-2">
                    {[60, 120, 180].map(time => (
                        <button key={time} onClick={() => setRestRemaining(time)} className="btn-secondary text-xs">{time/60}min</button>
                    ))}
                    <button onClick={() => setRestRemaining(0)} className="btn-danger text-xs">Stop</button>
                </div>
            </div>

            {currentWorkout.exercises.map((exercise, index) => (
                <ExerciseCard 
                    key={index} 
                    exercise={exercise} 
                    exerciseIndex={index}
                    onAddSet={addSet}
                    onRemoveSet={removeSet}
                    lastData={lastWorkoutData.get(exercise.name)}
                />
            ))}
        </div>
    );
};


interface ExerciseCardProps {
    exercise: Exercise;
    exerciseIndex: number;
    onAddSet: (exerciseIndex: number, set: Set) => void;
    onRemoveSet: (exerciseIndex: number, setIndex: number) => void;
    lastData?: { date: string; sets: Set[] };
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, exerciseIndex, onAddSet, onRemoveSet, lastData }) => {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    
    useEffect(() => {
        if(lastData && lastData.sets.length > 0) {
            setWeight(String(lastData.sets[lastData.sets.length - 1].weight));
            setReps(String(lastData.sets[lastData.sets.length - 1].reps));
        }
    }, [lastData]);
    
    const handleAddSet = () => {
        if (Number(weight) > 0 && Number(reps) > 0) {
            onAddSet(exerciseIndex, { weight: Number(weight), reps: Number(reps) });
            // Don't clear inputs, user might want to repeat
        }
    };
    
    const copyLastSet = (set: Set) => {
        setWeight(String(set.weight));
        setReps(String(set.reps));
    };

    return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h4 className="font-semibold text-white mb-3 text-lg">{exercise.name}</h4>
            
            {lastData && (
                <div className="mb-4 p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-xs text-slate-400 mb-2">{`Ostatnio (${new Date(lastData.date).toLocaleDateString('pl-PL')}):`}</p>
                    <div className="flex flex-wrap gap-2">
                        {lastData.sets.map((set, i) => (
                            <button key={i} onClick={() => copyLastSet(set)} className="text-xs bg-purple-900/70 text-purple-200 px-2 py-1 rounded hover:bg-purple-800 transition-colors">
                                {`${set.weight}kg \u00D7 ${set.reps}`}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-2 mb-4">
                {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="flex justify-between items-center bg-slate-700/50 p-2 rounded">
                        <span className="text-slate-300">
                            {`Seria ${setIndex + 1}: `}
                            <span className="font-bold text-white">{`${set.weight}kg`}</span>
                            {` \u00D7 `}
                            <span className="font-bold text-white">{set.reps}</span>
                            {` powtórzeń`}
                        </span>
                        <button onClick={() => onRemoveSet(exerciseIndex, setIndex)} className="btn-icon-danger">
                            {ICONS.trash}
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="kg" className="input flex-1" />
                <input type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="powtórzeń" className="input flex-1" />
                <button onClick={handleAddSet} className="btn-primary sm:w-auto">+ Dodaj Serię</button>
            </div>
        </div>
    );
};

export default ActiveWorkout;
