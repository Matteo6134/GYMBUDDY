export type Language = 'en' | 'it' | 'pl';

export const TRANSLATIONS = {
    en: {
        // General
        loading: "Loading...",
        success: "Success",
        error: "Error",
        cancel: "Cancel",
        back: "BACK",
        next: "NEXT",
        next_step: "NEXT STEP",
        finish: "FINISH",
        start: "START",
        resume: "RESUME",
        view: "VIEW",

        // Units
        hrs: "hrs",
        yrs: "yrs",
        wk: "/wk",
        x_wk: "x/wk",
        weekDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

        // Onboarding
        welcome: "Welcome to GymBuddy.",
        lets_start: "Let's Start.",
        name_label: "Your Name",
        name_placeholder: "Name",
        gender_label: "Gender",
        male: "MALE",
        female: "FEMALE",
        year_birth: "Year of Birth",

        body_stats: "Body Stats",
        required_calcs: "Required for calculations.",
        height: "Height",
        weight: "Weight",

        lifestyle: "Lifestyle",
        sleep: "Sleep",
        water: "Water",
        experience: "Experience",
        diet: "Diet",
        diet_options: ['Omnivore', 'Vegetarian', 'Vegan', 'Keto', 'Paleo'],
        other_activity: "Other Activity",
        frequency: "Frequency",
        bad_habits_q: "Any bad habits?",
        bad_habit_options: ["Smoker", "Alcohol", "Junk Food", "Late Night Snacks"],
        smoker: "Smoker",

        your_goal: "Your Goal",
        what_to_build: "What exactly do you want to build?",
        training_days: "Training Days",
        goals: {
            muscle: "Muscle Building",
            strength: "Strength",
            weight_loss: "Weight Loss",
            endurance: "Endurance",
            health: "General Health"
        },
        primary_focus: "Primary Focus",
        focus_options: [
            '🍑 Glutes / Ass',
            '💪 Arms (Bi/Tri)',
            '🦍 Chest',
            '🧱 Back',
            '🦵 Legs (Quads)',
            '🔻 V-Taper',
            '🍫 Abs / Core'
        ],
        bigger_focus_q: "Where do you want to get BIGGER?",
        select_multiple: "Select multiple if needed.",
        ai_thinking: "AI THINKING...",
        start_training: "START WORKOUT",

        // Dashboard
        greeting: "Hi",
        ready_crush: "Ready to crush it?",
        your_week: "YOUR WEEK",
        today_badge: "TODAY",
        rest_day: "Rest Day",
        exercises_count: "Exercises",

        // Settings / Profile
        settings_title: "Profile",
        your_profile: "Your Profile",
        edit_profile: "EDIT FULL PROFILE",
        regenerate_plan: "Regenerate Plan",
        update_regenerate: "UPDATE WEIGHT & REGENERATE",
        weight_update_label: "Current Weight Update",
        reset_all: "RESET ALL DATA",
        factory_reset: "Factory Reset",
        factory_reset_desc: "This will wipe all data and send you back to Onboarding.",
        reset_confirm: "Reset Everything",
        regenerate_button: "Regenerate",
        plan_updated_msg: "Your plan has been updated!",
        regenerate_error_msg: "Failed to regenerate plan.",
        go_to_onboarding: "Go to Onboarding",
        onboarding_redirect_msg: "To ensure consistent AI plans, please use Onboarding to reset major stats.",
        stress_label: "STRESS",
        regenerate_desc_template: "This will create a new {goal} plan based on your new weight of {weight}kg. Previous progress for this week will be reset.",

        // Active Mode
        finish_workout: "FINISH WORKOUT",
        exercises_left: "EXERCISES LEFT",
        no_workout: "No workout for today.",
        go_back: "Go Back",

        // Timer
        rest_timer: "REST TIMER",
        skip: "SKIP",
        add_15s: "+15s",

        // Edit Workout
        save: "SAVE",
        delete: "DELETE",
        exercise_name: "EXERCISE NAME",
        sets: "SETS",
        reps: "REPS",
        rest: "REST",
        confirm_delete: "Confirm Delete",
        delete_exercise_desc: "Remove this exercise?",
        discard_changes: "Discard Changes?",
        unsaved_changes_desc: "You have unsaved changes. Are you sure you want to go back?",
        discard: "Discard",
        keep_editing: "Keep Editing",
        add_exercise: "Add First Exercise",
        no_exercises: "No exercises.",
        day_name_placeholder: "Day Name"
    },
    it: {
        // General
        loading: "Caricamento...",
        success: "Successo",
        error: "Errore",
        cancel: "Annulla",
        back: "INDIETRO",
        next: "AVANTI",
        next_step: "PROSSIMO STEP",
        finish: "FINE",
        start: "INIZIA",
        resume: "RIPRENDI",
        view: "VEDI",

        // Units
        hrs: "ore",
        yrs: "anni",
        wk: "/sett",
        x_wk: "x/sett",
        weekDays: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],

        // Onboarding
        welcome: "Benvenuto in GymBuddy.",
        lets_start: "Iniziamo.",
        name_label: "Il tuo Nome",
        name_placeholder: "Nome",
        gender_label: "Genere",
        male: "UOMO",
        female: "DONNA",
        year_birth: "Anno di Nascita",

        body_stats: "Statistiche Corpo",
        required_calcs: "Richiesto per i calcoli.",
        height: "Altezza",
        weight: "Peso",

        lifestyle: "Stile di Vita",
        sleep: "Sonno",
        water: "Acqua",
        experience: "Esperienza",
        diet: "Dieta",
        diet_options: ['Onnivoro', 'Vegetariano', 'Vegano', 'Cheto', 'Paleo'],
        other_activity: "Altra Attività",
        frequency: "Frequenza",
        bad_habits_q: "Qualche vizio?",
        bad_habit_options: ["Fumatore", "Alcol", "Cibo Spazzatura", "Spuntini Notturni"],
        smoker: "Fumatore",

        your_goal: "Il Tuo Obiettivo",
        what_to_build: "Cosa vuoi costruire esattamente?",
        training_days: "Giorni di Allenamento",
        goals: {
            muscle: "Costruzione Muscolare",
            strength: "Forza",
            weight_loss: "Perdita Peso",
            endurance: "Resistenza",
            health: "Salute Generale"
        },
        primary_focus: "Focus Primario",
        focus_options: [
            '🍑 Glutei',
            '💪 Braccia (Bi/Tri)',
            '🦍 Petto',
            '🧱 Schiena',
            '🦵 Gambe',
            '🔻 V-Taper',
            '🍫 Addominali / Core'
        ],
        bigger_focus_q: "Dove vuoi diventare più GROSSO?",
        select_multiple: "Seleziona più di uno se necessario.",
        ai_thinking: "L'AI STA PENSANDO...",
        start_training: "INIZIA ALLENAMENTO",

        // Dashboard
        greeting: "Ciao",
        ready_crush: "Pronto a spaccare?",
        your_week: "LA TUA SETTIMANA",
        today_badge: "OGGI",
        rest_day: "Giorno di Riposo",
        exercises_count: "Esercizi",

        // Settings / Profile
        settings_title: "Profilo",
        your_profile: "Il Tuo Profilo",
        edit_profile: "MODIFICA PROFILO COMPLETO",
        regenerate_plan: "Rigenera Piano",
        update_regenerate: "AGGIORNA PESO & RIGENERA",
        weight_update_label: "Aggiorna Peso Corrente",
        reset_all: "RESETTA TUTTO",
        factory_reset: "Ripristino Dati",
        factory_reset_desc: "Questo cancellerà tutti i dati e ti riporterà all'Onboarding.",
        reset_confirm: "Resetta Tutto",
        regenerate_button: "Rigenera",
        plan_updated_msg: "Il tuo piano è stato aggiornato!",
        regenerate_error_msg: "Impossibile rigenerare il piano.",
        go_to_onboarding: "Vai all'Onboarding",
        onboarding_redirect_msg: "Per garantire piani AI coerenti, usa l'Onboarding per resettare le statistiche principali.",
        stress_label: "STRESS",
        regenerate_desc_template: "Questo creerà un nuovo piano {goal} basato sul tuo nuovo peso di {weight}kg. Il progresso di questa settimana verrà resettato.",

        // Active Mode
        finish_workout: "TERMINA ALLENAMENTO",
        exercises_left: "ESERCIZI RIMASTI",
        no_workout: "Nessun allenamento per oggi.",
        go_back: "Torna Indietro",

        // Timer
        rest_timer: "TIMER RIPOSO",
        skip: "SALTA",
        add_15s: "+15s",

        // Edit Workout
        save: "SALVA",
        delete: "ELIMINA",
        exercise_name: "NOME ESERCIZIO",
        sets: "SERIE",
        reps: "RIP.",
        rest: "RECUPERO",
        confirm_delete: "Conferma Eliminazione",
        delete_exercise_desc: "Rimuovere questo esercizio?",
        discard_changes: "Annullare le modifiche?",
        unsaved_changes_desc: "Hai modifiche non salvate. Sei sicuro di voler tornare indietro?",
        discard: "Annulla",
        keep_editing: "Continua a modificare",
        add_exercise: "Aggiungi Primo Esercizio",
        no_exercises: "Nessun esercizio.",
        day_name_placeholder: "Nome Giorno"
    },
    pl: {
        // General
        loading: "Ładowanie...",
        success: "Sukces",
        error: "Błąd",
        cancel: "Anuluj",
        back: "WRÓĆ",
        next: "DALEJ",
        next_step: "NASTĘPNY KROK",
        finish: "KONIEC",
        start: "START",
        resume: "WZNÓW",
        view: "ZOBACZ",

        // Units
        hrs: "godz",
        yrs: "lat",
        wk: "/tydz",
        x_wk: "x/tydz",
        weekDays: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],

        // Onboarding
        welcome: "Witaj w GymBuddy.",
        lets_start: "Zaczynamy.",
        name_label: "Twoje Imię",
        name_placeholder: "Imię",
        gender_label: "Płeć",
        male: "MĘŻCZYZNA",
        female: "KOBIETA",
        year_birth: "Rok Urodzenia",

        body_stats: "Statystyki Ciała",
        required_calcs: "Wymagane do obliczeń.",
        height: "Wzrost",
        weight: "Waga",

        lifestyle: "Styl Życia",
        sleep: "Sen",
        water: "Woda",
        experience: "Doświadczenie",
        diet: "Dieta",
        diet_options: ['Wszystkożerca', 'Wegetarianin', 'Weganin', 'Keto', 'Paleo'],
        other_activity: "Inna Aktywność",
        frequency: "Częstotliwość",
        bad_habits_q: "Jakieś złe nawyki?",
        bad_habit_options: ["Palenie", "Alkohol", "Śmieciowe jedzenie", "Nocne podjadanie"],
        smoker: "Palacz",

        your_goal: "Twój Cel",
        what_to_build: "Co chcesz zbudować?",
        training_days: "Dni Treningowe",
        goals: {
            muscle: "Budowa Mięśni",
            strength: "Siła",
            weight_loss: "Odchudzanie",
            endurance: "Wytrzymałość",
            health: "Ogólne Zdrowie"
        },
        primary_focus: "Główny Cel",
        focus_options: [
            '🍑 Pośladki',
            '💪 Ramiona (Bi/Tri)',
            '🦍 Klatka',
            '🧱 Plecy',
            '🦵 Nogi',
            '🔻 V-Taper',
            '🍫 Brzuch / Core'
        ],
        bigger_focus_q: "Gdzie chcesz urosnąć?",
        select_multiple: "Wybierz kilka, jeśli potrzebujesz.",
        ai_thinking: "AI MYŚLI...",
        start_training: "ROZPOCZNIJ TRENING",

        // Dashboard
        greeting: "Cześć",
        ready_crush: "Gotowy na wycisk?",
        your_week: "TWÓJ TYDZIEŃ",
        today_badge: "DZISIAJ",
        rest_day: "Dzień Odpoczynku",
        exercises_count: "Ćwiczenia",

        // Settings / Profile
        settings_title: "Profil",
        your_profile: "Twój Profil",
        edit_profile: "EDYTUJ PEŁNY PROFIL",
        regenerate_plan: "Wygeneruj Plan Ponownie",
        update_regenerate: "AKTUALIZUJ WAGĘ I WYGENERUJ",
        weight_update_label: "Aktualizacja Wagi",
        reset_all: "RESETUJ WSZYSTKO",
        factory_reset: "Reset Fabryczny",
        factory_reset_desc: "To usunie wszystkie dane i przeniesie Cię do Onboardingu.",
        reset_confirm: "Resetuj Wszystko",
        regenerate_button: "Wygeneruj ponownie",
        plan_updated_msg: "Twój plan został zaktualizowany!",
        regenerate_error_msg: "Nie udało się wygenerować planu.",
        go_to_onboarding: "Idź do Onboardingu",
        onboarding_redirect_msg: "Aby zapewnić spójne plany AI, użyj Onboardingu, aby zresetować główne statystyki.",
        stress_label: "STRES",
        regenerate_desc_template: "To utworzy nowy plan {goal} na podstawie Twojej nowej wagi {weight}kg. Dotychczasowe postępy w tym tygodniu zostaną zresetowane.",

        // Active Mode
        finish_workout: "ZAKOŃCZ TRENING",
        exercises_left: "POZOSTAŁO ĆWICZEŃ",
        no_workout: "Brak treningu na dziś.",
        go_back: "Wróć",

        // Timer
        rest_timer: "CZAS ODPOCZYNKU",
        skip: "POMIŃ",
        add_15s: "+15s",

        // Edit Workout
        save: "ZAPISZ",
        delete: "USUŃ",
        exercise_name: "NAZWA ĆWICZENIA",
        sets: "SERIE",
        reps: "POWT.",
        rest: "PRZERWA",
        confirm_delete: "Potwierdź usunięcie",
        delete_exercise_desc: "Czy na pewno chcesz usunąć to ćwiczenie?",
        discard_changes: "Odrzucić zmiany?",
        unsaved_changes_desc: "Masz niezapisane zmiany. Czy na pewno chcesz wyjść?",
        discard: "Odrzuć",
        keep_editing: "Edytuj dalej",
        add_exercise: "Dodaj Pierwsze Ćwiczenie",
        no_exercises: "Brak ćwiczeń.",
        day_name_placeholder: "Nazwa Dnia"
    }
};
