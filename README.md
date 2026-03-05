# hackathon-app

Versão mobile (React Native + Expo Router) do projeto `hackathon-web`, adaptada para manter os mesmos módulos funcionais.

## Módulos disponíveis

- Home
- Plataforma
- Painel Cognitivo
- Organizador de Tarefas (Kanban + Pomodoro)
- Perfil
- Configurações

## Rodando localmente

```bash
npm install
npm run start
```

Atalhos úteis:

- `npm run android`
- `npm run ios`
- `npm run web`

## Observações

- Estado principal persistido com `AsyncStorage` (tarefas, perfil e configurações).
- Navegação por abas no topo usando `expo-router`.

## Arquitetura atual

- Layout reutilizável de telas em `components/layout/ScreenContainer.tsx` e `components/layout/ScreenTitle.tsx`.
- Persistência centralizada com `hooks/usePersistentState.ts` + chaves em `constants/storageKeys.ts`.
- Hooks de domínio:
	- `hooks/useSettings.ts`
	- `hooks/useTasks.ts`
	- `hooks/useProfile.ts`
- Tipos de domínio centralizados em `types/` (`settings.ts`, `tasks.ts`, `profile.ts`).
- Barrel files para imports limpos:
	- `hooks/index.ts`
	- `types/index.ts`
- Integração VLibras por toggle do Painel em `components/VLibrasWidget.tsx`.
