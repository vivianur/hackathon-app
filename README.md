# MindEase App

Aplicativo mobile/web em `React Native + Expo` do projeto MindEase, focado em acessibilidade cognitiva para pessoas neurodivergentes.

O app entrega uma experiência de organização e estudo com personalização visual, persistência local, Kanban simplificado, Pomodoro adaptado e recursos complementares de acessibilidade.

## Objetivo

Atender os requisitos do hackathon de acessibilidade cognitiva com foco em:

- redução de distrações e previsibilidade da interface
- personalização de contraste, fonte, espaçamento e complexidade
- organização de tarefas com suporte cognitivo
- persistência de perfil, rotina e preferências
- recursos complementares de acessibilidade, incluindo `VLibras`

## Módulos

- `Home`
- `Plataforma`
- `Painel Cognitivo`
- `Organizador de Tarefas`
- `Perfil`
- `Configuracoes`

## Funcionalidades implementadas

### Painel Cognitivo

- nível de complexidade da interface
- modo foco
- modo monocromático
- modo escuro
- contraste, fonte e espaçamento ajustáveis
- controle de animações
- toggle de `VLibras`

### Organizador de Tarefas

- Kanban simplificado com colunas `A Fazer`, `Em Progresso` e `Concluído`
- criação de tarefas com checklist guiado
- checklist visual para reduzir sobrecarga cognitiva
- feedback de conclusão com mensagem e som, conforme preferências

### Pomodoro

- duração de foco e pausa ligada a `Perfil > Rotina de Estudo`
- aviso de transição 1 minuto antes da troca de fase
- troca automática entre foco e pausa ao concluir a sessão
- feedback de conclusão com mensagem, som e notificação local no mobile quando permitido

### Perfil e persistência

- perfil do usuário persistente
- seleção de neurodivergências
- rotina de estudo persistente
- preferências globais salvas em `AsyncStorage`

### Configurações

- notificações
- efeitos sonoros
- mensagens de incentivo
- avisos de transição
- restauração para padrões

## VLibras

O suporte a `VLibras` neste projeto ficou restrito ao `web`.

- `Web`: usa o widget oficial do `VLibras`, carregado por script externo.
- `Mobile`: não há widget integrado. O toggle existe apenas como preferência persistida, mas o recurso deve ser considerado indisponível fora do navegador.

### Limitações conhecidas do VLibras

- o widget oficial documentado e usado neste projeto é voltado a página web
- no web, o launcher depende de recursos externos do `vlibras.gov.br`
- se o script remoto falhar, for bloqueado ou demorar a carregar, o ícone pode não aparecer imediatamente
- no mobile, o app não exibe launcher nem widget do `VLibras`

## Stack

- `expo`
- `react-native`
- `expo-router`
- `@react-native-async-storage/async-storage`
- `expo-notifications`
- `expo-audio`
- `react-native-reanimated`
- `@expo/vector-icons`

## Requisitos

- Node.js 18+
- npm 9+
- Expo CLI via `npx expo`
- opcionalmente Android Studio / Xcode para emuladores nativos

## Como executar

```bash
npm install
npm run start
```

Atalhos:

- `npm run android`
- `npm run ios`
- `npm run web`

## Scripts

- `npm run start`: inicia o Expo
- `npm run android`: abre no Android
- `npm run ios`: abre no iOS
- `npm run web`: abre no navegador
- `npm run lint`: executa o ESLint
- `npm run test`: executa a suite Jest

## Testes

O projeto agora possui uma base mínima real de testes com:

- `jest-expo`
- `@testing-library/react-native`

Cobertura atual principal:

- `SettingsProvider`
- camada de feedback cognitivo
- `useTasks`
- `usePomodoroSession`

## Estrutura principal

- `app/`: rotas do Expo Router
- `app/(tabs)/`: telas principais
- `components/layout/`: layout compartilhado
- `components/tasks/`: UI de checklist e avisos de transição
- `components/ui/`: switches e banner de feedback
- `hooks/`: hooks de domínio e comportamento
- `services/feedback/`: som, notificações e mensagens
- `types/`: tipos centrais
- `constants/`: chaves, temas e templates

## Arquitetura e estado

- persistência local centralizada com `AsyncStorage`
- hooks de domínio:
  - `hooks/useSettings.ts`
  - `hooks/useTasks.ts`
  - `hooks/useProfile.ts`
  - `hooks/usePomodoroSession.ts`
- tema adaptativo em `hooks/useAdaptiveTheme.ts`
- feedback cognitivo centralizado em `hooks/useFeedbackCenter.tsx`
- layout compartilhado em `components/layout/ScreenContainer.tsx`

## Troubleshooting rápido

Limpar cache do Expo:

```bash
npx expo start -c
```

Se o app web não refletir mudanças:

- faça hard refresh no navegador

Se houver problema de dependências:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Relação com hackathon-web

Este app é a contraparte em React Native do `hackathon-web`. A proposta é manter coerência funcional entre web e mobile, adaptando layout e interações para cada ambiente.
