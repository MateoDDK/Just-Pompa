import React from 'react';

export interface UserProfile {
    name: string;
    weight: string;
}

export interface TrainingPlan {
    id: number;
    name: string;
    exercises: string[];
}

export interface Set {
    weight: number;
    reps: number;
}

export interface Exercise {
    name:string;
    sets: Set[];
}

export interface Workout {
    id: number;
    planId: number;
    planName: string;
    date: string; // YYYY-MM-DD
    exercises: Exercise[];
    duration?: number; // in seconds
    completedAt?: string; // ISO string
}

export interface User {
    email: string;
    password: string; // W prawdziwej aplikacji byłby to hash
    profile: UserProfile;
    plans: TrainingPlan[];
    workouts: Workout[];
}

export type Tab = 'plans' | 'workout' | 'history';

export type Toast = {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    icon: React.ReactNode;
};

export type ModalType =
  | { type: 'userMenu' }
  | { type: 'addPlan' }
  | { type: 'editPlan'; planId: number }
  | { type: 'editWorkout'; workoutIndex: number }
  | { type: 'confirm'; title: string; message: string; onConfirm: () => void }
  | { type: 'installInstructions' }
  | { type: 'auth' }
  | { type: 'terms' }
  | { type: 'privacy' }
  | null;