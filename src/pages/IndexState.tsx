import { useAuthState } from './state/useAuthState';
import { useCatalogState } from './state/useCatalogState';
import { useUserDataState } from './state/useUserDataState';
import { useAppSettingsState } from './state/useAppSettingsState';

export const useIndexState = () => {
  const authState = useAuthState();
  const catalogState = useCatalogState();
  const userDataState = useUserDataState();
  const appSettingsState = useAppSettingsState();

  return {
    ...authState,
    ...catalogState,
    ...userDataState,
    ...appSettingsState,
  };
};
