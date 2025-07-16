import React from 'react';
import { ICONS } from '../constants';

interface LegalModalProps {
  title: string;
  content: React.ReactNode;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ title, content, onClose }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] flex flex-col border border-slate-700">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <button onClick={onClose} className="btn-icon">{ICONS.close}</button>
      </div>
      <div className="overflow-y-auto pr-4 text-slate-300 space-y-4 text-sm">
        {content}
      </div>
      <div className="mt-6 border-t border-slate-700 pt-4 flex justify-end flex-shrink-0">
        <button onClick={onClose} className="btn-primary">Zamknij</button>
      </div>
    </div>
  );
};

export const TermsContent: React.FC = () => (
    <>
        <p className="font-semibold text-white">1. Postanowienia ogólne</p>
        <p>Aplikacja "Just Pompa" jest narzędziem hobbystycznym, stworzonym w celach edukacyjnych i demonstracyjnych. Korzystanie z aplikacji jest w pełni dobrowolne i darmowe.</p>

        <p className="font-semibold text-white">2. Odpowiedzialność</p>
        <p>Autor, Mateusz Dudek, nie ponosi odpowiedzialności za jakiekolwiek kontuzje, problemy zdrowotne lub inne szkody wynikłe z korzystania z planów treningowych lub funkcji aplikacji. Plany treningowe, w tym te generowane przez AI, mają charakter wyłącznie poglądowy. Przed rozpoczęciem jakiejkolwiek aktywności fizycznej skonsultuj się z lekarzem lub certyfikowanym trenerem personalnym. Użytkownik korzysta z aplikacji na własną odpowiedzialność.</p>

        <p className="font-semibold text-white">3. Dane Użytkownika</p>
        <p>Wszystkie dane wprowadzane przez użytkownika, w tym dane logowania, informacje o profilu, plany treningowe i historia treningów, są przechowywane wyłącznie lokalnie w pamięci przeglądarki internetowej (localStorage) na urządzeniu użytkownika. Autor nie ma dostępu do tych danych.</p>
        
        <p className="font-semibold text-white">4. Postanowienia końcowe</p>
        <p>Autor zastrzega sobie prawo do wprowadzania zmian w aplikacji i regulaminie bez wcześniejszego powiadomienia. Korzystając z aplikacji, akceptujesz niniejszy regulamin.</p>
    </>
);

export const PrivacyContent: React.FC = () => (
    <>
        <p className="font-semibold text-white">1. Administrator Danych</p>
        <p>W kontekście tej hobbystycznej aplikacji, nie ma formalnego administratora danych. Wszystkie dane są zarządzane i przechowywane lokalnie na Twoim urządzeniu. Autor aplikacji, Mateusz Dudek, nie ma do nich dostępu.</p>

        <p className="font-semibold text-white">2. Jakie dane są przetwarzane?</p>
        <p>Aplikacja "Just Pompa" przechowuje następujące dane w pamięci Twojej przeglądarki (localStorage):</p>
        <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Dane konta:</strong> Adres e-mail i hasło (w formie jawnej, co jest uproszczeniem dla celów projektu hobbystycznego - w prawdziwych aplikacjach hasła są hashowane).</li>
            <li><strong>Dane profilowe:</strong> Imię oraz waga, jeśli je podasz.</li>
            <li><strong>Dane treningowe:</strong> Stworzone plany treningowe oraz historia wykonanych treningów i serii.</li>
        </ul>
        
        <p className="font-semibold text-white">3. Cel przetwarzania danych</p>
        <p>Dane są przechowywane wyłącznie w celu zapewnienia funkcjonowania aplikacji, tj. umożliwienia logowania, personalizacji oraz śledzenia postępów treningowych. Dane te nie są wysyłane na żadne zewnętrzne serwery ani udostępniane stronom trzecim.</p>

        <p className="font-semibold text-white">4. Bezpieczeństwo Danych</p>
        <p>Bezpieczeństwo Twoich danych zależy od bezpieczeństwa Twojego urządzenia i przeglądarki. Ponieważ dane są przechowywane lokalnie, usunięcie danych przeglądarki (np. ciasteczek i danych witryn) spowoduje trwałe usunięcie wszystkich Twoich informacji z aplikacji "Just Pompa".</p>

        <p className="font-semibold text-white">5. Prawa Użytkownika</p>
        <p>Masz pełną kontrolę nad swoimi danymi. W każdej chwili możesz je usunąć poprzez wyczyszczenie danych przeglądarki dla tej strony. Aplikacja udostępnia również funkcje eksportu danych do pliku JSON lub CSV, co pozwala na stworzenie kopii zapasowej.</p>
    </>
);
