export type PreferredStudyTime = 'morning' | 'afternoon' | 'evening' | 'night';
export type FocusTechnique = 'pomodoro' | 'custom' | 'flexible';

export type StudyRoutine = {
  preferredStudyTime: PreferredStudyTime;
  focusTechnique: FocusTechnique;
  sessionDuration: number;
  breakDuration: number;
};

export type Profile = {
  name: string;
  email: string;
  neurodivergence: string[];
  studyRoutine: StudyRoutine;
};

export const DEFAULT_PROFILE: Profile = {
  name: 'Usuário',
  email: 'usuario@fiap.com.br',
  neurodivergence: [],
  studyRoutine: {
    preferredStudyTime: 'morning',
    focusTechnique: 'pomodoro',
    sessionDuration: 25,
    breakDuration: 5,
  },
};
