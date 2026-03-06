# hackathon-app

Aplicativo mobile/web (React Native + Expo + Expo Router) do projeto MindEase.

Esta aplicacao replica os principais modulos funcionais do `hackathon-web` com foco em acessibilidade cognitiva, personalizacao de interface e suporte a produtividade.

## Objetivo do projeto

Entregar uma experiencia de estudo/organizacao com ajustes de acessibilidade para perfis neurodivergentes, incluindo:

- reducao de distracoes (modo foco)
- ajuste visual (modo escuro, monocromatico, contraste)
- configuracao de tipografia e espacamento
- gestao de tarefas (Kanban) e foco com Pomodoro

## Modulos disponiveis

- `Home`
- `Plataforma`
- `Painel Cognitivo`
- `Organizador de Tarefas` (Kanban + Pomodoro)
- `Perfil`
- `Configuracoes`

## Stack

- `expo` + `react-native`
- `expo-router` (navegacao por abas)
- `@react-native-async-storage/async-storage` (persistencia local)
- `react-native-reanimated` (base para animacoes)
- `@expo/vector-icons` (icones)

## Requisitos

- Node.js 18+
- npm 9+
- Expo CLI via `npx expo`
- (Opcional) Android Studio / Xcode para emuladores nativos

## Como executar

```bash
npm install
npm run start
```

Atalhos:

- `npm run android`
- `npm run ios`
- `npm run web`

## Scripts disponiveis

- `npm run start`: inicia o Metro/Expo
- `npm run android`: abre no Android
- `npm run ios`: abre no iOS
- `npm run web`: abre no navegador
- `npm run lint`: executa lint (Expo ESLint)
- `npm run test`: placeholder (ainda sem suite real)

## Estrutura principal

- `app/`: rotas do Expo Router
- `app/(tabs)/`: telas principais por aba
- `components/layout/`: componentes base de layout (`ScreenContainer`, `ScreenTitle`)
- `hooks/`: hooks de dominio e persistencia
- `types/`: tipagens centrais (`settings`, `tasks`, `profile`)
- `constants/`: tokens de tema, chaves de storage e constantes visuais
- `services/storage.ts`: camada de acesso ao storage

## Arquitetura e estado

- Persistencia local centralizada com `AsyncStorage`.
- Hooks de dominio:
  - `hooks/useSettings.ts`
  - `hooks/useTasks.ts`
  - `hooks/useProfile.ts`
- Tema adaptativo e regras de exibicao em `hooks/useAdaptiveTheme.ts`.
- Layout compartilhado para todas as telas em `components/layout/ScreenContainer.tsx`.

## Acessibilidade e personalizacao

Configuracoes controladas no Painel Cognitivo:

- `Nível de Complexidade`: simples, moderado, detalhado
- `Modo Foco`: reduz distrações e limita elementos secundarios
- `Modo Monocromatico`: neutraliza paleta colorida
- `Modo Escuro`
- `Contraste`, `Tamanho da Fonte` e `Espacamento`
- `Animacoes` (habilita/desabilita efeitos visuais)
- `VLibras` via toggle

## Comportamentos importantes

- Conteudos de `Perfil`, `Tarefas` e `Configuracoes` persistem entre sessoes.
- Componentes e cards usam cores do tema para respeitar modo escuro e monocromatico.
- Modais de tarefas/configuracoes/plataforma possuem comportamento responsivo para mobile/tablet/web.

## Troubleshooting rapido

- Limpar cache do Expo:

```bash
npx expo start -c
```

- Se algo nao refletir no app web, recarregue com hard refresh no navegador.
- Em caso de inconsistencias de dependencias:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Relacao com hackathon-web

Este app e a contraparte em React Native do `hackathon-web`. A ideia e manter paridade funcional entre modulos principais, adaptando UX e layout para ambiente mobile/tablet.
