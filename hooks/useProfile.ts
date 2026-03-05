import { STORAGE_KEYS } from '@/constants/storageKeys';
import { usePersistentState } from '@/hooks/usePersistentState';
import {
  DEFAULT_PROFILE,
  type FocusTechnique,
  type PreferredStudyTime,
  type Profile,
} from '@/types';

export function useProfile() {
  const { state: profile, setState: setProfile, ready } = usePersistentState<Profile>(
    STORAGE_KEYS.profile,
    DEFAULT_PROFILE,
  );

  const updateProfile = (patch: Partial<Pick<Profile, 'name' | 'email'>>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  };

  const toggleNeurodivergence = (value: string) => {
    setProfile((prev) => {
      const exists = prev.neurodivergence.includes(value);
      return {
        ...prev,
        neurodivergence: exists
          ? prev.neurodivergence.filter((item) => item !== value)
          : [...prev.neurodivergence, value],
      };
    });
  };

  const updateStudyRoutine = (patch: Partial<Profile['studyRoutine']>) => {
    setProfile((prev) => ({
      ...prev,
      studyRoutine: {
        ...prev.studyRoutine,
        ...patch,
      },
    }));
  };

  return { profile, ready, updateProfile, toggleNeurodivergence, updateStudyRoutine } as const;
}
