
import React, { useState, useEffect } from 'react';
import { TrainingPlan } from '../types';
import { POPULAR_EXERCISES, ICONS } from '../constants';
import { generatePlanFromPrompt } from '../services/geminiService';

interface PlanFormModalProps {
  onClose: () => void;
  onSave: (plan: Omit<TrainingPlan, 'id'>) => void;
  onAddToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  existingPlan?: TrainingPlan;
}

const PlanFormModal: React.FC<PlanFormModalProps> = ({ onClose, onSave, onAddToast, existingPlan }) => {
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState<string[]>(['']);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (existingPlan) {
      setName(existingPlan.name);
      setExercises(existingPlan.exercises);
    }
  }, [existingPlan]);

  const handleExerciseChange = (index: number, value: string) => {
    const newExercises = [...exercises];
    newExercises[index] = value;
    setExercises(newExercises);
  };

  const addExerciseInput = () => setExercises([...exercises, '']);
  const removeExerciseInput = (index: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      onAddToast('Nazwa planu jest wymagana.', 'error');
      return;
    }
    const filteredExercises = exercises.map(e => e.trim()).filter(Boolean);
    if (filteredExercises.length === 0) {
      onAddToast('Dodaj przynajmniej jedno ćwiczenie.', 'error');
      return;
    }
    onSave({ name, exercises: filteredExercises });
    onClose();
  };
  
  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
        onAddToast('Wpisz swój cel, aby AI mogło wygenerować plan.', 'warning');
        return;
    }
    setIsGenerating(true);
    try {
        const result = await generatePlanFromPrompt(aiPrompt);
        setName(result.name);
        setExercises(result.exercises);
        onAddToast('Plan wygenerowany przez AI!', 'success');
    } catch (error: any) {
        onAddToast(error.message, 'error');
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">{existingPlan ? 'Edytuj Plan' : 'Nowy Plan Treningowy'}</h3>
        <button onClick={onClose} className="btn-icon">{ICONS.close}</button>
      </div>
      
      {/* AI Generation Section */}
      <div className="mb-6 p-4 bg-purple-900/30 rounded-lg border border-purple-700">
        <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">{ICONS.sparkles} Generator Planów AI</h4>
        <p className="text-sm text-slate-400 mb-3">Opisz swój cel, a AI stworzy dla Ciebie plan. Np. "trening całego ciała 3 razy w tygodniu dla początkującego".</p>
        <div className="flex flex-col sm:flex-row gap-2">
            <input 
                type="text" 
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                className="input flex-1" 
                placeholder="Opisz swój cel treningowy..."
                disabled={isGenerating}
            />
            <button onClick={handleGenerateWithAI} className="btn-primary" disabled={isGenerating}>
                {isGenerating ? 'Generowanie...' : 'Generuj'}
            </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Nazwa planu</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" placeholder="np. Trening A - Klatka i ramiona" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Ćwiczenia</label>
          <div className="space-y-2">
            {exercises.map((exercise, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={exercise}
                  onChange={e => handleExerciseChange(index, e.target.value)}
                  className="input flex-1"
                  placeholder="Nazwa ćwiczenia"
                  list="exercises-list"
                />
                <button onClick={() => removeExerciseInput(index)} className="btn-icon-danger" disabled={exercises.length <= 1}>
                  {ICONS.trash}
                </button>
              </div>
            ))}
            <datalist id="exercises-list">
              {POPULAR_EXERCISES.map(ex => <option key={ex} value={ex} />)}
            </datalist>
          </div>
          <button onClick={addExerciseInput} className="btn-secondary mt-2 text-sm w-full sm:w-auto">
            + Dodaj ćwiczenie
          </button>
        </div>
      </div>
      <div className="mt-6 border-t border-slate-700 pt-4 flex justify-end gap-4">
        <button onClick={onClose} className="btn-secondary">Anuluj</button>
        <button onClick={handleSave} className="btn-primary">Zapisz Plan</button>
      </div>
    </div>
  );
};

export default PlanFormModal;