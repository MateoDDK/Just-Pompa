import React, { useState, useEffect } from 'react';
import { UserProfile, TrainingPlan, Workout } from '../types';
import { ICONS } from '../constants';

interface UserMenuModalProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onClose: () => void;
  onAddToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  onRestoreDefaultPlans: () => void;
  onImportData: (data: { userProfile?: UserProfile; trainingPlans?: TrainingPlan[]; workouts?: Workout[] }) => void;
  trainingPlans: TrainingPlan[];
  workouts: Workout[];
  onLogout: () => void;
}

const UserMenuModal: React.FC<UserMenuModalProps> = ({
  profile,
  onSaveProfile,
  onClose,
  onAddToast,
  onRestoreDefaultPlans,
  onImportData,
  trainingPlans,
  workouts,
  onLogout
}) => {
  const [localProfile, setLocalProfile] = useState(profile);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleSave = () => {
    onSaveProfile(localProfile);
    onAddToast('Profil został zapisany!', 'success');
  };

  const handleExport = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const data = {
        userProfile: profile,
        trainingPlans,
        workouts,
        exportDate: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `justpompa-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      onAddToast('Kopia zapasowa JSON została wyeksportowana.', 'success');
    } else { // csv
        const csvData = [['Data', 'Plan', 'Ćwiczenie', 'Seria', 'Ciężar (kg)', 'Powtórzenia', 'Objętość (kg)']];
        workouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
                if (exercise.sets.length > 0) {
                    exercise.sets.forEach((set, setIndex) => {
                        const volume = set.weight * set.reps;
                        csvData.push([
                            new Date(workout.date).toLocaleDateString('pl-PL'),
                            workout.planName,
                            exercise.name,
                            (setIndex + 1).toString(),
                            set.weight.toString(),
                            set.reps.toString(),
                            volume.toString()
                        ]);
                    });
                }
            });
        });
        const csvContent = csvData.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `justpompa-treningi-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        onAddToast('Dane CSV zostały wyeksportowane.', 'success');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        onImportData(data);
      } catch (error) {
        onAddToast('Błąd podczas importu pliku.', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
    } else {
      onAddToast('Aplikację można zainstalować z menu przeglądarki.', 'info');
    }
  };
  
  return (
    <div className="bg-slate-800 rounded-xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">👤 Menu Użytkownika</h3>
        <button onClick={onClose} className="btn-icon">{ICONS.close}</button>
      </div>
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="space-y-4">
            <h4 className="font-semibold text-purple-300">Profil</h4>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Imię</label>
                <input type="text" value={localProfile.name} onChange={e => setLocalProfile(p => ({ ...p, name: e.target.value }))} className="input" placeholder="Twoje imię" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Waga (kg)</label>
                <input type="number" value={localProfile.weight} onChange={e => setLocalProfile(p => ({ ...p, weight: e.target.value }))} className="input" placeholder="Twoja waga" />
            </div>
            <button onClick={handleSave} className="btn-secondary w-full">Zapisz profil</button>
        </div>

        {/* Data Management Section */}
        <div className="space-y-4">
            <h4 className="font-semibold text-purple-300">Zarządzanie Danymi</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button onClick={() => handleExport('json')} className="btn-secondary">Eksportuj backup (JSON)</button>
                <button onClick={() => document.getElementById('import-file')?.click()} className="btn-secondary">Importuj backup (JSON)</button>
                <input type="file" id="import-file" accept=".json" onChange={handleImport} className="hidden" />
                <button onClick={() => handleExport('csv')} className="btn-secondary">Eksportuj do CSV</button>
                <button onClick={onRestoreDefaultPlans} className="btn-secondary">Przywróć przykładowe plany</button>
            </div>
        </div>

        {/* App Section */}
        <div className="space-y-4">
            <h4 className="font-semibold text-purple-300">Aplikacja i Konto</h4>
             <button onClick={handleInstall} disabled={!deferredPrompt} className="btn-primary w-full">
                Zainstaluj Aplikację
            </button>
             <button onClick={onLogout} className="btn-danger w-full">
                Wyloguj się
            </button>
            <p className="text-xs text-slate-400 text-center">Zainstaluj aplikację, aby mieć do niej szybki dostęp z ekranu głównego.</p>
        </div>
      </div>
      <div className="mt-6 border-t border-slate-700 pt-4 flex justify-end">
          <button onClick={onClose} className="btn-primary">Zamknij</button>
      </div>
    </div>
  );
};

export default UserMenuModal;