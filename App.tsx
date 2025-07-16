
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, TrainingPlan, Workout, Tab, Toast, ModalType, User } from './types';
import { getDefaultTrainingPlans, ICONS } from './constants';
import UserMenuModal from './components/UserMenuModal';
import PlanFormModal from './components/PlanFormModal';
import ActiveWorkout from './components/ActiveWorkout';
import HistoryView from './components/HistoryView';
import ToastComponent from './components/Toast';
import AuthModal from './components/AuthModal';
import { LegalModal, TermsContent, PrivacyContent } from './components/LegalModal';

const App: React.FC = () => {
    // App State
    const [currentTab, setCurrentTab] = useState<Tab>('plans');
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [modal, setModal] = useState<ModalType>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // User and Data State
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', weight: '' });
    const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);

    // Initial load from localStorage
    useEffect(() => {
        const savedUsers = localStorage.getItem('justpompa-users');
        const allUsers = savedUsers ? JSON.parse(savedUsers) : [];
        setUsers(allUsers);

        const lastUserEmail = localStorage.getItem('justpompa-lastUser');
        if (lastUserEmail) {
            const user = allUsers.find((u: User) => u.email === lastUserEmail);
            if (user) {
                setCurrentUser(user);
                setUserProfile(user.profile);
                setTrainingPlans(user.plans);
                setWorkouts(user.workouts);
            }
        }
        setIsInitialized(true);
    }, []);

    // Persist users data to localStorage
    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('justpompa-users', JSON.stringify(users));
    }, [users, isInitialized]);
    
    // Update current user's data when it changes
    useEffect(() => {
        if (!isInitialized || !currentUser) return;

        const updatedUser = {
            ...currentUser,
            profile: userProfile,
            plans: trainingPlans,
            workouts: workouts,
        };
        
        // Avoid unnecessary updates if data hasn't changed
        if (JSON.stringify(currentUser) !== JSON.stringify(updatedUser)) {
             setUsers(prevUsers => prevUsers.map(u => u.email === currentUser.email ? updatedUser : u));
             setCurrentUser(updatedUser);
        }

    }, [userProfile, trainingPlans, workouts]);


    const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
        const icons = { success: ICONS.success, error: ICONS.error, info: ICONS.info, warning: ICONS.warning };
        const newToast: Toast = { id: Date.now(), message, type, icon: icons[type] };
        setToasts(prev => [...prev, newToast]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== newToast.id)), 5000);
    }, []);

    const handleRegister = ({ name, email, password }: { name: string; email: string; password: string }) => {
        if (users.some(u => u.email === email)) {
            addToast('Użytkownik o tym adresie email już istnieje.', 'error');
            return;
        }
        const newUser: User = {
            email,
            password,
            profile: { name, weight: '' },
            plans: getDefaultTrainingPlans(),
            workouts: [],
        };
        setUsers(prev => [...prev, newUser]);
        
        // Log the user in directly
        setCurrentUser(newUser);
        setUserProfile(newUser.profile);
        setTrainingPlans(newUser.plans);
        setWorkouts(newUser.workouts);
        localStorage.setItem('justpompa-lastUser', newUser.email);
        
        setModal(null);
        addToast(`Konto utworzone! Witaj, ${name}!`, 'success');
    };

    const handleLogin = (email: string, password: string) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setCurrentUser(user);
            setUserProfile(user.profile);
            setTrainingPlans(user.plans);
            setWorkouts(user.workouts);
            localStorage.setItem('justpompa-lastUser', user.email);
            setModal(null);
            addToast(`Zalogowano pomyślnie! Witaj, ${user.profile.name || 'użytkowniku'}!`, 'success');
        } else {
            addToast('Nieprawidłowy email lub hasło.', 'error');
        }
    };
    
    const handleLogout = () => {
        addToast(`Do zobaczenia!`, 'info');
        setCurrentUser(null);
        setUserProfile({ name: '', weight: '' });
        setTrainingPlans([]);
        setWorkouts([]);
        setCurrentWorkout(null);
        localStorage.removeItem('justpompa-lastUser');
        setModal(null);
    };
    
    const startWorkout = (planId: number) => {
        const plan = trainingPlans.find(p => p.id === planId);
        if (!plan) return;

        setCurrentWorkout({
            id: Date.now(),
            planId: plan.id,
            planName: plan.name,
            date: new Date().toISOString().split('T')[0],
            exercises: plan.exercises.map(name => ({ name, sets: [] }))
        });
        setCurrentTab('workout');
        addToast(`Rozpoczęto trening: ${plan.name}`, 'success');
    };
    
    const finishWorkout = (finishedWorkout: Workout) => {
        setWorkouts(prev => [finishedWorkout, ...prev]);
        setCurrentWorkout(null);
        setCurrentTab('history');
        addToast('Trening zakończony! Dobra robota!', 'success');
    };
    
    const addPlan = (plan: Omit<TrainingPlan, 'id'>) => {
        const newPlan = { ...plan, id: Date.now() };
        setTrainingPlans(prev => [...prev, newPlan]);
        addToast('Nowy plan został dodany!', 'success');
    };

    const updatePlan = (updatedPlan: TrainingPlan) => {
        setTrainingPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
        addToast('Plan został zaktualizowany!', 'success');
    };

    const deletePlan = (planId: number) => {
        setModal({
            type: 'confirm',
            title: 'Usuń plan',
            message: 'Czy na pewno chcesz usunąć ten plan treningowy? Ta akcja jest nieodwracalna.',
            onConfirm: () => {
                setTrainingPlans(prev => prev.filter(p => p.id !== planId));
                addToast('Plan został usunięty.', 'info');
                setModal(null);
            }
        });
    };
    
    const renderContent = () => {
        if (!currentUser) {
            return (
                <div className="text-center py-16 px-6 bg-slate-800 rounded-lg">
                    <span className="text-6xl">👋</span>
                    <h2 className="text-2xl font-bold text-white mt-4">Witaj w Just Pompa!</h2>
                    <p className="text-slate-400 mb-6">Zaloguj się lub zarejestruj, aby zapisywać swoje postępy i tworzyć plany treningowe.</p>
                    <button onClick={() => setModal({ type: 'auth' })} className="btn-primary">
                        Zaloguj się / Zarejestruj
                    </button>
                </div>
            );
        }

        switch (currentTab) {
            case 'plans':
                return (
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h2 className="text-2xl font-bold text-white">Plany Treningowe</h2>
                            <button onClick={() => setModal({ type: 'addPlan' })} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                                {ICONS.plus} Nowy Plan
                            </button>
                        </div>
                        {trainingPlans.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {trainingPlans.map(plan => (
                                    <div key={plan.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-purple-500 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-semibold text-white flex-1 pr-2">{plan.name}</h3>
                                            <div className="flex gap-2 flex-wrap justify-end">
                                                <button onClick={() => setModal({ type: 'editPlan', planId: plan.id })} className="btn-icon" title="Edytuj">{ICONS.edit}</button>
                                                <button onClick={() => deletePlan(plan.id)} className="btn-icon-danger" title="Usuń">{ICONS.trash}</button>
                                                <button onClick={() => startWorkout(plan.id)} className="btn-primary text-sm" title="Rozpocznij trening">{ICONS.play} Start</button>
                                            </div>
                                        </div>
                                        <div className="text-purple-300 text-sm">{plan.exercises.length} ćwiczeń</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-16 px-6 bg-slate-800 rounded-lg">
                                <h3 className="text-xl font-semibold text-white mb-2">Brak planów treningowych</h3>
                                <p className="text-slate-400 mb-4">Stwórz swój pierwszy plan lub wygeneruj go z pomocą AI!</p>
                                <button onClick={() => setModal({ type: 'addPlan' })} className="btn-primary">
                                    Stwórz pierwszy plan
                                </button>
                            </div>
                        )}
                    </div>
                );
            case 'workout':
                return currentWorkout ? (
                    <ActiveWorkout 
                        workout={currentWorkout} 
                        onFinishWorkout={finishWorkout}
                        workoutsHistory={workouts}
                        onAddToast={addToast}
                    />
                ) : (
                    <div className="text-center py-16 px-6 bg-slate-800 rounded-lg">
                        <span className="text-6xl">🏋️</span>
                        <h2 className="text-2xl font-bold text-white mt-4">Brak aktywnego treningu</h2>
                        <p className="text-slate-400">Wybierz plan i rozpocznij trening, aby robić postępy!</p>
                        <button onClick={() => setCurrentTab('plans')} className="mt-4 btn-primary">
                            Wybierz plan
                        </button>
                    </div>
                );
            case 'history':
                return <HistoryView workouts={workouts} setWorkouts={setWorkouts} onAddToast={addToast} />;
        }
    };
    
    const getModalContent = () => {
        if (!modal) return null;
    
        switch (modal.type) {
            case 'auth':
                return <AuthModal
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                    onClose={() => setModal(null)}
                />;
            case 'userMenu':
                return currentUser ? <UserMenuModal
                    profile={userProfile}
                    onSaveProfile={setUserProfile}
                    onClose={() => setModal(null)}
                    onAddToast={addToast}
                    onRestoreDefaultPlans={() => {
                        setTrainingPlans(prev => [...prev, ...getDefaultTrainingPlans().filter(dp => !prev.some(p => p.name === dp.name))]);
                        addToast('Przykładowe plany zostały dodane!', 'success');
                    }}
                    onImportData={(data) => {
                        if (data.userProfile) setUserProfile(data.userProfile);
                        if (data.trainingPlans) setTrainingPlans(data.trainingPlans);
                        if (data.workouts) setWorkouts(data.workouts);
                        addToast('Dane zaimportowane pomyślnie!', 'success');
                    }}
                    trainingPlans={trainingPlans}
                    workouts={workouts}
                    onLogout={handleLogout}
                /> : null;
            case 'addPlan':
                 return <PlanFormModal
                    onClose={() => setModal(null)}
                    onSave={addPlan}
                    onAddToast={addToast}
                />;
            case 'editPlan':
                const planToEdit = trainingPlans.find(p => p.id === (modal as {planId: number}).planId);
                return planToEdit ? <PlanFormModal
                    onClose={() => setModal(null)}
                    onSave={(planData) => updatePlan({ ...planData, id: planToEdit.id })}
                    onAddToast={addToast}
                    existingPlan={planToEdit}
                /> : null;
            case 'confirm':
                const { title, message, onConfirm } = modal;
                return (
                    <div className="bg-slate-800 p-6 rounded-lg max-w-sm w-full mx-4 border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
                        <p className="text-slate-300 mb-6">{message}</p>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setModal(null)} className="btn-secondary">Anuluj</button>
                            <button onClick={onConfirm} className="btn-danger">Potwierdź</button>
                        </div>
                    </div>
                );
             case 'installInstructions':
                 return (
                    <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full mx-4 border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4">📱 Jak zainstalować Just Pompa</h3>
                        <div className="space-y-4 text-slate-300">
                           <p>Aby zainstalować aplikację na swoim urządzeniu i korzystać z niej jak z natywnej aplikacji, postępuj zgodnie z instrukcjami dla swojej przeglądarki.</p>
                           <div>
                                <h4 className="font-semibold text-white">Chrome (Desktop/Android)</h4>
                                <p>Kliknij ikonę instalacji (komputer z strzałką w dół) po prawej stronie paska adresu, a następnie 'Zainstaluj'.</p>
                           </div>
                           <div>
                                <h4 className="font-semibold text-white">Safari (iOS)</h4>
                                <p>Kliknij przycisk Udostępnij, przewiń w dół i wybierz 'Dodaj do ekranu początkowego'.</p>
                           </div>
                        </div>
                         <div className="flex justify-end mt-6">
                             <button onClick={() => setModal(null)} className="btn-primary">Rozumiem</button>
                         </div>
                    </div>
                 );
            case 'terms':
                return <LegalModal title="Regulamin" onClose={() => setModal(null)} content={<TermsContent />} />;
            case 'privacy':
                return <LegalModal title="Polityka Prywatności" onClose={() => setModal(null)} content={<PrivacyContent />} />;
            default:
                return null;
        }
    }
    
    if (!isInitialized) {
        return <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white">Ładowanie...</div>;
    }
    
    const tabTranslations: {[key in Tab]: string} = {
        plans: 'Plany',
        workout: 'Trening',
        history: 'Historia'
    };

    return (
        <div className="min-h-screen bg-slate-900">
            <div className="container mx-auto p-4 max-w-4xl">
                {/* Header */}
                <header className="text-center my-8">
                    <div className="flex items-center justify-center gap-4 mb-2">
                         <span className="text-purple-400 text-5xl">💪</span>
                         <h1 className="text-4xl font-extrabold text-white tracking-tight">Just Pompa</h1>
                         <button 
                            onClick={() => setModal({ type: currentUser ? 'userMenu' : 'auth' })} 
                            className="p-3 bg-slate-800 rounded-full text-purple-300 hover:bg-slate-700 transition-colors" 
                            title="Menu użytkownika"
                        >
                            {ICONS.user}
                        </button>
                    </div>
                     <p className="text-purple-200">
                        {currentUser ? `Witaj, ${userProfile.name || 'użytkowniku'}!` : "Witaj!"} Rób pompę na maxa!
                    </p>
                </header>

                {/* Navigation Tabs */}
                <nav className="bg-slate-800 p-2 rounded-xl flex gap-2 mb-6">
                    {(['plans', 'workout', 'history'] as Tab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setCurrentTab(tab)}
                            disabled={!currentUser}
                            className={`flex-1 py-3 px-4 rounded-lg transition-all font-semibold text-sm sm:text-base capitalize ${
                                currentTab === tab ? 'bg-purple-600 text-white shadow-lg' : 'bg-transparent text-slate-300 hover:bg-slate-700'
                            } disabled:text-slate-500 disabled:hover:bg-transparent`}
                        >
                            {tabTranslations[tab]}
                        </button>
                    ))}
                </nav>

                {/* Main Content */}
                <main className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-slate-700/50 min-h-[400px]">
                    {renderContent()}
                </main>

                <footer className="text-center text-slate-500 mt-8 text-sm space-y-2">
                    <p>Stworzone z ❤️ przez Mateusza Dudka.</p>
                    <p className="font-semibold text-slate-400">Dla wszystkich Pompujących!</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setModal({ type: 'terms' })} className="hover:text-slate-300 transition-colors underline">Regulamin</button>
                        <button onClick={() => setModal({ type: 'privacy' })} className="hover:text-slate-300 transition-colors underline">Polityka Prywatności</button>
                    </div>
                </footer>
            </div>
            
             {/* Modal container */}
            {modal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 backdrop-blur-sm" onClick={() => setModal(null)}>
                    <div onClick={e => e.stopPropagation()}>
                        {getModalContent()}
                    </div>
                </div>
            )}
            
            {/* Toast Notifications */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <ToastComponent key={toast.id} {...toast} onClose={() => setToasts(p => p.filter(t => t.id !== toast.id))} />
                ))}
            </div>
        </div>
    );
};

// Button component styles for reusability
const globalStyles = `
.btn-primary { @apply bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all hover:bg-purple-500 active:bg-purple-700 active:scale-95 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2; }
.btn-secondary { @apply bg-slate-700 text-slate-200 font-semibold py-2 px-4 rounded-lg transition-all hover:bg-slate-600 active:bg-slate-800 active:scale-95 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2; }
.btn-danger { @apply bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all hover:bg-red-500 active:bg-red-700 active:scale-95 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2; }
.btn-icon { @apply bg-slate-700 text-slate-300 p-2 rounded-lg transition-colors hover:bg-slate-600 hover:text-white; }
.btn-icon-danger { @apply bg-slate-700 text-red-400 p-2 rounded-lg transition-colors hover:bg-red-600 hover:text-white; }
.input { @apply bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 transition-colors; }
`;

const StyleInjector: React.FC = () => {
    return <style>{globalStyles}</style>;
}

const AppWithStyles: React.FC = () => (
    <>
        <StyleInjector />
        <App />
    </>
)


export default AppWithStyles;
