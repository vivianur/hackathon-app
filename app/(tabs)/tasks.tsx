import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import ScreenContainer from '@/components/layout/ScreenContainer';
import ScreenTitle from '@/components/layout/ScreenTitle';
import ChecklistEditor from '@/components/tasks/ChecklistEditor';
import TransitionWarningCard from '@/components/tasks/TransitionWarningCard';
import { getGuidedChecklistLabels } from '@/constants/checklistTemplates';
import {
  useAdaptiveTheme,
  useFeedbackCenter,
  usePomodoroSession,
  useProfile,
  useSettings,
  useTasks,
} from '@/hooks';
import type { Task } from '@/types';
import { webPalette } from '../../constants/webPalette';

const TABLET_BREAKPOINT = 768;
const IPAD_AIR_MIN_SIDE = 820;
const IPAD_PRO_MIN_SIDE = 1024;
const IPAD_AIR_MIN_LONG_SIDE = 1180;
const IPAD_PRO_MIN_LONG_SIDE = 1366;
const TASKS_MODAL_SHIFT_IPAD_MINI = 70;
const TASKS_MODAL_SHIFT_IPAD_AIR = 140;
const TASKS_MODAL_SHIFT_IPAD_PRO = 230;

type PomodoroTimerProps = {
  accentColor: string;
  surfaceColor: string;
  borderColor: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
  focusDurationMinutes: number;
  breakDurationMinutes: number;
  transitionWarningsEnabled: boolean;
  onComplete: (completedPhase: 'focus' | 'break') => void | Promise<void>;
};

function PomodoroTimer({
  accentColor,
  surfaceColor,
  borderColor,
  textPrimaryColor,
  textSecondaryColor,
  focusDurationMinutes,
  breakDurationMinutes,
  transitionWarningsEnabled,
  onComplete,
}: PomodoroTimerProps) {
  const {
    phase,
    secondsRemaining,
    running,
    warningVisible,
    warningMessage,
    start,
    pause,
    reset,
    dismissWarning,
  } = usePomodoroSession({
    focusDurationMinutes,
    breakDurationMinutes,
    transitionWarningsEnabled,
    onComplete,
  });

  const minutes = String(Math.floor(secondsRemaining / 60)).padStart(2, '0');
  const remainingSeconds = String(secondsRemaining % 60).padStart(2, '0');
  const phaseLabel = phase === 'focus' ? 'Foco' : 'Pausa';

  return (
    <>
      <View style={[styles.timerCard, { borderColor, backgroundColor: surfaceColor }]}>
        <View style={styles.timerTitleRow}>
          <MaterialIcons name="timer" size={18} color={accentColor} />
          <Text style={[styles.timerTitle, { color: textPrimaryColor }]}>Pomodoro</Text>
        </View>
        <Text style={[styles.timerPhase, { color: textPrimaryColor }]}>Sessao atual: {phaseLabel}</Text>
        <Text style={[styles.timerValue, { color: textPrimaryColor }]}>
          {minutes}:{remainingSeconds}
        </Text>
        <Text style={[styles.timerMeta, { color: textSecondaryColor }]}>
          Foco: {focusDurationMinutes} min | Pausa: {breakDurationMinutes} min
        </Text>
        <View style={styles.timerActions}>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: accentColor }]}
            onPress={running ? pause : start}>
            <Text style={styles.primaryBtnText}>{running ? 'Pausar' : 'Iniciar'}</Text>
          </Pressable>
          <Pressable
            style={[
              styles.secondaryBtn,
              { borderColor, backgroundColor: surfaceColor },
            ]}
            onPress={reset}>
            <Text style={[styles.secondaryBtnText, { color: textPrimaryColor }]}>Reset</Text>
          </Pressable>
        </View>
      </View>

      {warningVisible && warningMessage ? (
        <TransitionWarningCard message={warningMessage} onDismiss={dismissWarning} />
      ) : null}
    </>
  );
}

export default function TasksScreen() {
  const { tasks, addTask, updateTaskStatus, toggleChecklistItem, removeTask } = useTasks();
  const { settings } = useSettings();
  const { profile } = useProfile();
  const { celebratePomodoroCompletion, celebrateTaskCompletion } = useFeedbackCenter();
  const { ui } = useAdaptiveTheme();
  const isMonochrome = ui.mode.monochrome;
  const { width, height } = useWindowDimensions();
  const isBelowTablet = width < TABLET_BREAKPOINT;
  const isTabletOrLarger = width >= TABLET_BREAKPOINT;
  const shorterSide = Math.min(width, height);
  const longerSide = Math.max(width, height);
  const guidedChecklistLabels = React.useMemo(() => getGuidedChecklistLabels(), []);
  const tabletModalVerticalShift = !isTabletOrLarger
    ? 0
    : shorterSide >= IPAD_PRO_MIN_SIDE || longerSide >= IPAD_PRO_MIN_LONG_SIDE
      ? TASKS_MODAL_SHIFT_IPAD_PRO
      : shorterSide >= IPAD_AIR_MIN_SIDE || longerSide >= IPAD_AIR_MIN_LONG_SIDE
        ? TASKS_MODAL_SHIFT_IPAD_AIR
        : TASKS_MODAL_SHIFT_IPAD_MINI;
  const [openModal, setOpenModal] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [useGuidedChecklist, setUseGuidedChecklist] = React.useState(true);

  const grouped = {
    todo: tasks.filter((item) => item.status === 'todo'),
    'in-progress': tasks.filter((item) => item.status === 'in-progress'),
    done: tasks.filter((item) => item.status === 'done'),
  };

  const columns = [
    { key: 'todo', title: 'A Fazer', color: isMonochrome ? ui.colors.border : '#ed6c02' },
    {
      key: 'in-progress',
      title: 'Em Progresso',
      color: isMonochrome ? ui.colors.border : webPalette.primary,
    },
    { key: 'done', title: 'Concluido', color: isMonochrome ? ui.colors.border : '#2e7d32' },
  ];

  const deleteActionColor = isMonochrome ? ui.colors.border : '#dc2626';
  const deleteActionTextColor = isMonochrome ? ui.colors.textPrimary : '#fff';
  const statusMeta = {
    todo: { label: 'A Fazer', color: isMonochrome ? ui.colors.accent : '#ed6c02' },
    'in-progress': {
      label: 'Em Progresso',
      color: isMonochrome ? ui.colors.accent : webPalette.primary,
    },
    done: { label: 'Concluido', color: isMonochrome ? ui.colors.accent : '#2e7d32' },
  } as const;

  const createTask = () => {
    if (!title.trim()) return;

    addTask(
      title,
      description,
      useGuidedChecklist ? [...guidedChecklistLabels] : []
    );
    setTitle('');
    setDescription('');
    setUseGuidedChecklist(true);
    setOpenModal(false);
  };

  const handleTaskStatusChange = async (
    task: Task,
    nextStatus: 'todo' | 'in-progress' | 'done'
  ) => {
    updateTaskStatus(task.id, nextStatus);

    if (task.status !== 'done' && nextStatus === 'done') {
      await celebrateTaskCompletion({
        ...settings.preferences,
        seed: task.createdAt,
      });
    }
  };

  const renderTaskCard = (task: Task, compact = false) => (
    <View
      key={task.id}
      style={[
        styles.taskCard,
        compact && styles.taskCardCompact,
        { borderColor: ui.colors.borderSoft, backgroundColor: ui.colors.surface },
      ]}>
      <Text style={[styles.taskTitle, { color: ui.colors.textPrimary }]}>{task.title}</Text>
      {task.description ? (
        <Text style={[styles.taskDescription, { color: ui.colors.textSecondary }]}>
          {task.description}
        </Text>
      ) : null}

      {task.checklist.length > 0 ? (
        <View style={styles.checklistWrap}>
          {task.checklist.map((item) => (
            <Pressable
              key={item.id}
              style={styles.checklistItem}
              onPress={() => toggleChecklistItem(task.id, item.id)}>
              <MaterialIcons
                name={item.done ? 'check-box' : 'check-box-outline-blank'}
                size={18}
                color={item.done ? ui.colors.accent : ui.colors.textSecondary}
              />
              <Text
                style={[
                  styles.checklistText,
                  { color: ui.colors.textPrimary, fontSize: ui.typography.small },
                  item.done && styles.checklistTextDone,
                ]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={styles.taskActions}>
        <Pressable
          style={[
            styles.stageBtn,
            { borderColor: ui.colors.border, backgroundColor: ui.colors.surface },
            task.status === 'todo' && {
              backgroundColor: statusMeta.todo.color,
              borderColor: statusMeta.todo.color,
            },
          ]}
          onPress={() => void handleTaskStatusChange(task, 'todo')}>
          <Text
            style={[
              styles.stageBtnText,
              { color: ui.colors.textPrimary },
              task.status === 'todo' && {
                color: isMonochrome ? ui.colors.textPrimary : '#fff',
              },
            ]}>
            {statusMeta.todo.label}
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.stageBtn,
            { borderColor: ui.colors.border, backgroundColor: ui.colors.surface },
            task.status === 'in-progress' && {
              backgroundColor: statusMeta['in-progress'].color,
              borderColor: statusMeta['in-progress'].color,
            },
          ]}
          onPress={() => void handleTaskStatusChange(task, 'in-progress')}>
          <Text
            style={[
              styles.stageBtnText,
              { color: ui.colors.textPrimary },
              task.status === 'in-progress' && {
                color: isMonochrome ? ui.colors.textPrimary : '#fff',
              },
            ]}>
            {statusMeta['in-progress'].label}
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.stageBtn,
            { borderColor: ui.colors.border, backgroundColor: ui.colors.surface },
            task.status === 'done' && {
              backgroundColor: statusMeta.done.color,
              borderColor: statusMeta.done.color,
            },
          ]}
          onPress={() => void handleTaskStatusChange(task, 'done')}>
          <Text
            style={[
              styles.stageBtnText,
              { color: ui.colors.textPrimary },
              task.status === 'done' && {
                color: isMonochrome ? ui.colors.textPrimary : '#fff',
              },
            ]}>
            {statusMeta.done.label}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.deleteBtn, { backgroundColor: deleteActionColor }]}
          onPress={() => removeTask(task.id)}>
          <View style={styles.actionBtnContent}>
            <MaterialIcons name="delete" size={14} color={deleteActionTextColor} />
            <Text style={[styles.deleteBtnText, { color: deleteActionTextColor }]}>
              Excluir
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <View style={[styles.header, isBelowTablet && styles.headerMobile]}>
        <View>
          <ScreenTitle
            icon="assignment"
            title="Organizador de Tarefas"
            subtitle="Gerencie suas atividades com suporte cognitivo"
          />
        </View>
        <Pressable
          style={[
            styles.primaryBtn,
            { backgroundColor: ui.colors.accent },
            isBelowTablet && styles.newTaskBtnMobile,
          ]}
          onPress={() => setOpenModal(true)}>
          <View style={styles.actionBtnContent}>
            <MaterialIcons name="add" size={16} color="#fff" />
            <Text style={styles.primaryBtnText}>Nova Tarefa</Text>
          </View>
        </Pressable>
      </View>

      <PomodoroTimer
        accentColor={ui.colors.accent}
        surfaceColor={ui.colors.surface}
        borderColor={ui.colors.border}
        textPrimaryColor={ui.colors.textPrimary}
        textSecondaryColor={ui.colors.textSecondary}
        focusDurationMinutes={profile.studyRoutine.sessionDuration}
        breakDurationMinutes={profile.studyRoutine.breakDuration}
        transitionWarningsEnabled={settings.preferences.transitionWarnings}
        onComplete={(completedPhase) =>
          celebratePomodoroCompletion({
            ...settings.preferences,
            phase: completedPhase,
            seed: Date.now(),
          })
        }
      />

      <View style={styles.kanbanContainer}>
        {columns.map((column) => (
          <View
            key={column.key}
            style={[
              styles.column,
              {
                borderTopColor: column.color,
                borderColor: ui.colors.border,
                backgroundColor: ui.colors.surface,
              },
            ]}>
            <Text style={[styles.columnTitle, { color: ui.colors.textPrimary }]}>
              {column.title}
            </Text>
            {(grouped[column.key as keyof typeof grouped] || []).length === 0 ? (
              <Text style={[styles.emptyText, { color: ui.colors.textSecondary }]}>
                Nenhuma tarefa
              </Text>
            ) : (
              (grouped[column.key as keyof typeof grouped] || []).map((task) =>
                renderTaskCard(task, true)
              )
            )}
          </View>
        ))}
      </View>

      {ui.content.showSupportPanels ? (
        <View
          style={[
            styles.tipCard,
            { backgroundColor: ui.colors.accent, borderRadius: ui.shape.radius },
          ]}>
          <Text style={styles.tipTitle}>Dicas para melhor produtividade</Text>
          <Text style={styles.tipItem}>• Divida tarefas grandes em subtarefas menores</Text>
          <Text style={styles.tipItem}>• Use o timer Pomodoro para manter o foco</Text>
          <Text style={styles.tipItem}>• Priorize 3 tarefas principais por dia</Text>
          <Text style={styles.tipItem}>• Faca pausas regulares para evitar sobrecarga</Text>
        </View>
      ) : null}

      <Modal visible={openModal} animationType="slide" transparent>
        <View style={[styles.modalOverlay, isTabletOrLarger && styles.modalOverlayWide]}>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={[
              styles.modalScrollContent,
              isTabletOrLarger && styles.modalScrollContentWide,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View
              style={[
                styles.modalCard,
                isTabletOrLarger && styles.modalCardWide,
                {
                  backgroundColor: ui.colors.surface,
                  borderColor: ui.colors.border,
                  borderWidth: ui.borders.width,
                  borderRadius: ui.shape.radius,
                },
                isTabletOrLarger && { transform: [{ translateY: -tabletModalVerticalShift }] },
              ]}>
              <Text style={[styles.modalTitle, { color: ui.colors.textPrimary }]}>
                Nova Tarefa
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Titulo da tarefa"
                placeholderTextColor={ui.colors.textSecondary}
                style={[
                  styles.input,
                  {
                    borderColor: ui.colors.border,
                    backgroundColor: ui.colors.surface,
                    color: ui.colors.textPrimary,
                  },
                ]}
              />
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Descricao (opcional)"
                placeholderTextColor={ui.colors.textSecondary}
                style={[
                  styles.input,
                  styles.inputMultiline,
                  {
                    borderColor: ui.colors.border,
                    backgroundColor: ui.colors.surface,
                    color: ui.colors.textPrimary,
                  },
                ]}
                multiline
              />

              <ChecklistEditor
                enabled={useGuidedChecklist}
                checklistLabels={guidedChecklistLabels}
                onToggle={() => setUseGuidedChecklist((prev) => !prev)}
              />

              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.secondaryBtn, { borderColor: ui.colors.border }]}
                  onPress={() => setOpenModal(false)}>
                  <Text
                    style={[styles.secondaryBtnText, { color: ui.colors.textPrimary }]}>
                    Cancelar
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.primaryBtn, { backgroundColor: ui.colors.accent }]}
                  onPress={createTask}>
                  <Text style={styles.primaryBtnText}>Salvar</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  headerMobile: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 6,
  },
  newTaskBtnMobile: {
    marginTop: 0,
    alignSelf: 'flex-start',
  },
  timerCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  timerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  timerPhase: {
    fontWeight: '600',
  },
  timerValue: {
    fontSize: 34,
    fontWeight: '700',
  },
  timerMeta: {},
  timerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  kanbanContainer: {
    gap: 10,
  },
  column: {
    borderWidth: 1,
    borderTopWidth: 4,
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  columnTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  taskCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  taskCardCompact: {
    padding: 8,
  },
  taskTitle: {
    fontWeight: '700',
  },
  taskDescription: {},
  checklistWrap: {
    gap: 6,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checklistText: {
    flex: 1,
  },
  checklistTextDone: {
    textDecorationLine: 'line-through',
    opacity: 0.75,
  },
  taskActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  stageBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  stageBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteBtn: {
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyText: {},
  tipCard: {
    padding: 14,
    gap: 5,
  },
  tipTitle: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 2,
  },
  tipItem: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modalOverlayWide: {
    paddingHorizontal: 24,
  },
  modalScroll: {
    width: '100%',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalScrollContentWide: {
    paddingVertical: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    padding: 14,
    gap: 10,
  },
  modalCardWide: {
    maxWidth: 460,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  primaryBtn: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontWeight: '600',
  },
  actionBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
