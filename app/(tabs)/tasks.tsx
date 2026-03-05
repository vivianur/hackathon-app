import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import ScreenContainer from '@/components/layout/ScreenContainer';
import ScreenTitle from '@/components/layout/ScreenTitle';
import { useAdaptiveTheme, useTasks } from '@/hooks';
import { webPalette } from '../../constants/webPalette';

function PomodoroTimer() {
  const [seconds, setSeconds] = React.useState(25 * 60);
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remainingSeconds = String(seconds % 60).padStart(2, '0');

  return (
    <View style={styles.timerCard}>
      <Text style={styles.timerTitle}>Pomodoro</Text>
      <Text style={styles.timerValue}>{minutes}:{remainingSeconds}</Text>
      <View style={styles.timerActions}>
        <Pressable style={styles.primaryBtn} onPress={() => setRunning((prev) => !prev)}>
          <Text style={styles.primaryBtnText}>{running ? 'Pausar' : 'Iniciar'}</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => { setRunning(false); setSeconds(25 * 60); }}>
          <Text style={styles.secondaryBtnText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function TasksScreen() {
  const { tasks, addTask, updateTaskStatus, removeTask } = useTasks();
  const { ui } = useAdaptiveTheme();
  const { width } = useWindowDimensions();
  const isBelowTablet = width < 768;
  const [openModal, setOpenModal] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const grouped = {
    todo: tasks.filter((item) => item.status === 'todo'),
    'in-progress': tasks.filter((item) => item.status === 'in-progress'),
    done: tasks.filter((item) => item.status === 'done'),
  };

  const createTask = () => {
    if (!title.trim()) return;
    addTask(title, description);
    setTitle('');
    setDescription('');
    setOpenModal(false);
  };

  const renderTaskCard = (
    task: { id: string; title: string; description?: string; status: 'todo' | 'in-progress' | 'done' },
    compact = false,
  ) => (
    <View key={task.id} style={[styles.taskCard, compact && styles.taskCardCompact]}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      {task.description ? <Text style={styles.taskDescription}>{task.description}</Text> : null}
      <View style={styles.taskActions}>
        <Pressable style={styles.stageBtn} onPress={() => updateTaskStatus(task.id, 'todo')}>
          <Text style={styles.stageBtnText}>A Fazer</Text>
        </Pressable>
        <Pressable style={styles.stageBtn} onPress={() => updateTaskStatus(task.id, 'in-progress')}>
          <Text style={styles.stageBtnText}>Em Progresso</Text>
        </Pressable>
        <Pressable style={styles.stageBtn} onPress={() => updateTaskStatus(task.id, 'done')}>
          <Text style={styles.stageBtnText}>Concluído</Text>
        </Pressable>
        <Pressable style={styles.deleteBtn} onPress={() => removeTask(task.id)}>
          <View style={styles.actionBtnContent}>
            <MaterialIcons name="delete" size={14} color="#fff" />
            <Text style={styles.deleteBtnText}>Excluir</Text>
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
        <Pressable style={[styles.primaryBtn, { backgroundColor: ui.colors.accent }, isBelowTablet && styles.newTaskBtnMobile]} onPress={() => setOpenModal(true)}>
          <View style={styles.actionBtnContent}>
            <MaterialIcons name="add" size={16} color="#fff" />
            <Text style={styles.primaryBtnText}>Nova Tarefa</Text>
          </View>
        </Pressable>
      </View>

      <PomodoroTimer />

      <View style={styles.kanbanContainer}>
        {[
          { key: 'todo', title: 'A Fazer', color: '#ed6c02' },
          { key: 'in-progress', title: 'Em Progresso', color: webPalette.primary },
          { key: 'done', title: 'Concluído', color: '#2e7d32' },
        ].map((column) => (
          <View key={column.key} style={[styles.column, { borderTopColor: column.color }]}>
            <Text style={styles.columnTitle}>{column.title}</Text>
            {(grouped[column.key as keyof typeof grouped] || []).length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma tarefa</Text>
            ) : (
              (grouped[column.key as keyof typeof grouped] || []).map((task) => renderTaskCard(task, true))
            )}
          </View>
        ))}
      </View>

      {ui.content.showSupportPanels ? <View style={[styles.tipCard, { backgroundColor: ui.colors.accent, borderRadius: ui.shape.radius }]}>
        <Text style={styles.tipTitle}>💡 Dicas para Melhor Produtividade</Text>
        <Text style={styles.tipItem}>• Divida tarefas grandes em subtarefas menores</Text>
        <Text style={styles.tipItem}>• Use o timer Pomodoro para manter o foco</Text>
        <Text style={styles.tipItem}>• Priorize 3 tarefas principais por dia</Text>
        <Text style={styles.tipItem}>• Faça pausas regulares para evitar sobrecarga</Text>
      </View> : null}

      <Modal visible={openModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nova Tarefa</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Título da tarefa"
              style={styles.input}
            />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Descrição (opcional)"
              style={[styles.input, styles.inputMultiline]}
              multiline
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.secondaryBtn} onPress={() => setOpenModal(false)}>
                <Text style={styles.secondaryBtnText}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.primaryBtn, { backgroundColor: ui.colors.accent }]} onPress={createTask}>
                <Text style={styles.primaryBtnText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 10,
    backgroundColor: webPalette.bg,
  },
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
    borderColor: webPalette.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: webPalette.white,
    gap: 8,
  },
  timerTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  timerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerValue: {
    fontSize: 34,
    fontWeight: '700',
  },
  timerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  kanbanContainer: {
    gap: 10,
  },
  column: {
    borderWidth: 1,
    borderColor: webPalette.border,
    borderTopWidth: 4,
    borderRadius: 12,
    padding: 10,
    gap: 8,
    backgroundColor: webPalette.white,
  },
  columnTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  taskCard: {
    borderWidth: 1,
    borderColor: webPalette.borderSoft,
    borderRadius: 10,
    padding: 10,
    gap: 6,
    backgroundColor: webPalette.white,
  },
  taskCardCompact: {
    padding: 8,
  },
  taskTitle: {
    fontWeight: '700',
  },
  taskDescription: {
    color: webPalette.textSecondary,
  },
  taskActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  stageBtn: {
    borderWidth: 1,
    borderColor: webPalette.border,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: webPalette.white,
  },
  stageBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteBtn: {
    borderRadius: 8,
    backgroundColor: '#dc2626',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyText: {
    color: webPalette.textSecondary,
  },
  tipCard: {
    borderRadius: 12,
    backgroundColor: webPalette.info,
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
  modalCard: {
    backgroundColor: webPalette.white,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: webPalette.border,
    borderRadius: 8,
    padding: 10,
    backgroundColor: webPalette.white,
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
    backgroundColor: webPalette.primary,
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
    borderColor: webPalette.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: webPalette.white,
  },
  secondaryBtnText: {
    color: webPalette.textPrimary,
    fontWeight: '600',
  },
  actionBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
