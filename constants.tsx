
import React from 'react';
import { TrainingPlan } from './types';

export const POPULAR_EXERCISES = [
    'Squat (Przysiad ze sztangą na plecach)', 'Deadlift (Martwy ciąg klasyczny)', 'Bench Press (Wyciskanie sztangi na ławce płaskiej)', 'Overhead Press (Wyciskanie żołnierskie)',
    'Pull-ups (Podciąganie na drążku)', 'Barbell Row (Wiosłowanie sztangą w opadzie tułowia)', 'Dips (Pompki na poręczach)',
    'Lat Pulldown (Ściąganie drążka wyciągu górnego)', 'Incline Dumbbell Press (Wyciskanie hantli na ławce skośnej)', 
    'Lateral Raises (Wznosy hantli na boki)', 'Lunges (Wykroki z hantlami)', 'Hack Squat (Hack przysiad)', 'Face Pulls (Przyciąganie linek do twarzy)',
    'Hamstring Curls (Uginanie podudzi na maszynie)', 'Spider Curls (Uginanie ramion w opadzie na ławce skośnej)', 'Hammer Curls (Uginanie ramion chwytem młotkowym)',
    'Incline Curls (Uginanie ramion na ławce skośnej)', 'Cable Tricep Pushdown (Prostowanie ramion z linką wyciągu)', 'Katana Extension (Wyciskanie francuskie jednorącz)',
    'Skullcrushers (Wyciskanie francuskie sztangą leżąc)', 'Cable Crunches (Brzuszki na wyciągu)',
    'Dumbbell Press (Wyciskanie hantli leżąc)', 'Romanian Deadlift (Martwy ciąg rumuński)', 'Barbell Curl (Uginanie bicepsa sztangą)', 
    'French Press (Wyciskanie francuskie)', 'Leg Press (Wyciskanie na nogi)', 'Calf Raises (Wspięcia na łydki)', 'Plank (Deska)', 'Crunches (Brzuszki)',
    'Machine Press (Wyciskanie na maszynie)', 'Dumbbell Flyes (Rozpiętki z hantlami)', 'One-Arm Row (Wiosłowanie hantlem)', 'Bulgarian Split Squat (Przysiad bułgarski)', 
    'Dumbbell Curls (Uginanie bicepsa hantlami)', 'Shoulder Press (Wyciskanie hantli nad głowę)', 'Close-Grip Bench Press (Wyciskanie wąskim chwytem)',
    'Wide-Grip Pulldown (Ściąganie szerokim chwytem)', 'Preacher Curls (Uginanie na modlitewniku)', 'Tricep Dips (Dipy na triceps)',
    'Front Squats (Przysiad z przodu)', 'Sumo Deadlift (Martwy ciąg sumo)', 'Push-ups (Pompki)'
];

export const getDefaultTrainingPlans = (): TrainingPlan[] => [
    {
        id: Date.now() + 1,
        name: "🏋️ ZESTAW A - Przysiad i wyciskanie poziome",
        exercises: [
            "Squat (Przysiad ze sztangą na plecach)",
            "Bench Press (Wyciskanie sztangi na ławce płaskiej)",
            "Lat Pulldown (Ściąganie drążka wyciągu górnego)",
            "Lateral Raises (Wznosy hantli na boki)",
            "Hamstring Curls (Uginanie podudzi na maszynie)",
            "Spider Curls (Uginanie ramion w opadzie na ławce skośnej)",
            "Cable Tricep Pushdown (Prostowanie ramion z linką wyciągu)"
        ]
    },
    {
        id: Date.now() + 2,
        name: "💪 ZESTAW B - Martwy ciąg i praca z hantlami",
        exercises: [
            "Deadlift (Martwy ciąg klasyczny)",
            "Incline Dumbbell Press (Wyciskanie hantli na ławce skośnej)",
            "Barbell Row (Wiosłowanie sztangą w opadzie tułowia)",
            "Lunges (Wykroki z hantlami)",
            "Hammer Curls (Uginanie ramion chwytem młotkowym)",
            "Katana Extension (Wyciskanie francuskie jednorącz)",
            "Cable Crunches (Brzuszki na wyciągu)"
        ]
    },
    {
        id: Date.now() + 3,
        name: "🚀 ZESTAW C - Wyciskanie pionowe i praca unilateralna",
        exercises: [
            "Overhead Press (Wyciskanie żołnierskie)",
            "Pull-ups (Podciąganie na drążku)",
            "Hack Squat (Hack przysiad)",
            "Dips (Pompki na poręczach)",
            "Face Pulls (Przyciąganie linek do twarzy)",
            "Incline Curls (Uginanie ramion na ławce skośnej)",
            "Skullcrushers (Wyciskanie francuskie sztangą leżąc)"
        ]
    }
];

export const ICONS = {
    user: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    plus: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>,
    trash: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>,
    edit: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>,
    copy: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H4z" /></svg>,
    play: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>,
    check: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>,
    close: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    sparkles: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L11 15l-4 6h10l-4-6 4.293-4.293a1 1 0 011.414 0L21 12M18 5l-2.293-2.293a1 1 0 00-1.414 0L11 6l4 6h-6l4-6L12 3" /></svg>,
    success: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    error: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    info: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    warning: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
};