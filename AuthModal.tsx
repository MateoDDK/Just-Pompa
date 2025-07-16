
import React, { useState } from 'react';
import { ICONS } from '../constants';

interface AuthModalProps {
    onLogin: (email: string, password: string) => void;
    onRegister: (newUser: { name: string; email: string; password: string }) => void;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onLogin, onRegister, onClose }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoginView) {
            onLogin(email, password);
        } else {
            if (!name.trim()) {
                 alert("Proszę podać imię."); // Idealnie byłoby użyć tosta
                 return;
            }
            if (password !== confirmPassword) {
                alert("Hasła nie są zgodne!"); // Idealnie byłoby użyć tosta
                return;
            }
            onRegister({ name, email, password });
        }
    };

    return (
        <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4 border border-slate-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">{isLoginView ? 'Logowanie' : 'Rejestracja'}</h3>
                <button onClick={onClose} className="btn-icon">{ICONS.close}</button>
            </div>

            <div className="flex bg-slate-700 rounded-lg p-1 mb-6">
                <button
                    onClick={() => setIsLoginView(true)}
                    className={`flex-1 p-2 rounded-md font-semibold text-sm transition-colors ${isLoginView ? 'bg-purple-600 text-white' : 'text-slate-300'}`}
                >
                    Logowanie
                </button>
                <button
                    onClick={() => setIsLoginView(false)}
                    className={`flex-1 p-2 rounded-md font-semibold text-sm transition-colors ${!isLoginView ? 'bg-purple-600 text-white' : 'text-slate-300'}`}
                >
                    Rejestracja
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginView && (
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Imię</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input"
                            placeholder="Jak masz na imię?"
                            required
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                        placeholder="twoj@email.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Hasło</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        placeholder="••••••••"
                        required
                    />
                </div>
                {!isLoginView && (
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Potwierdź hasło</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                )}
                <div className="pt-2">
                    <button type="submit" className="btn-primary w-full">
                        {isLoginView ? 'Zaloguj się' : 'Stwórz konto'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AuthModal;
