import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '@/components/layout/ScreenContainer';
import ScreenTitle from '@/components/layout/ScreenTitle';
import ThemedSwitch from '@/components/ui/ThemedSwitch';
import { useAdaptiveTheme, useSettings } from '@/hooks';
import { webPalette } from '../../constants/webPalette';

export default function SettingsScreen() {
  const { settings, updatePreferences, resetToDefaults } = useSettings();
  const { ui } = useAdaptiveTheme();
  const [showResetModal, setShowResetModal] = React.useState(false);

  const preferences = settings.preferences;
  const resetConfirmationMessage = 'Tem certeza que deseja restaurar todas as configurações para os valores padrão?';

  const renderToggle = (
    label: string,
    value: boolean,
    onPress: () => void,
    description: string,
  ) => (
    <View style={[styles.toggleRow, { borderColor: ui.colors.borderSoft, padding: ui.spacing.sm }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.toggleLabel, { color: ui.colors.textPrimary, fontSize: ui.typography.body }]}>{label}</Text>
        <Text style={[styles.toggleDescription, { color: ui.colors.textSecondary, fontSize: ui.typography.small }]}>{description}</Text>
      </View>
      <ThemedSwitch
        value={value}
        onValueChange={onPress}
        trackOff={ui.switch.trackOff}
        trackOn={ui.switch.trackOn}
        thumbOff={ui.switch.thumbOff}
        thumbOn={ui.switch.thumbOn}
        darkMode={ui.mode.dark}
      />
    </View>
  );

  const handleReset = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    resetToDefaults();
    setShowResetModal(false);
  };

  return (
    <ScreenContainer>
      <ScreenTitle icon="settings" title="Configurações" subtitle="Ajuste notificações e comportamento do sistema" />

      <View style={[styles.warningCard, { borderRadius: ui.shape.radius }]}> 
        <Text style={styles.warningTitle}>⚠️ Painel Cognitivo</Text>
        <Text style={styles.warningText}>As configurações de acessibilidade estão disponíveis na aba Painel.</Text>
      </View>

      <View style={[styles.section, { borderColor: ui.colors.border, borderWidth: ui.borders.width, borderRadius: ui.shape.radius, backgroundColor: ui.colors.surface, padding: ui.spacing.md }]}>
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="notifications" size={20} color={ui.colors.accent} />
          <Text style={[styles.sectionTitle, { color: ui.colors.textPrimary, fontSize: ui.typography.h3 }]}>Notificações</Text>
        </View>
        {renderToggle(
          'Ativar notificações',
          preferences.notifications,
          () => updatePreferences({ notifications: !preferences.notifications }),
          'Receba alertas sobre tarefas e timers',
        )}
      </View>

      <View style={[styles.section, { borderColor: ui.colors.border, borderWidth: ui.borders.width, borderRadius: ui.shape.radius, backgroundColor: ui.colors.surface, padding: ui.spacing.md }]}>
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="volume-up" size={20} color={ui.colors.accent} />
          <Text style={[styles.sectionTitle, { color: ui.colors.textPrimary, fontSize: ui.typography.h3 }]}>Sons e Efeitos</Text>
        </View>
        {renderToggle(
          'Efeitos sonoros',
          preferences.soundEffects,
          () => updatePreferences({ soundEffects: !preferences.soundEffects }),
          'Sons ao completar tarefas e finalizar timers',
        )}
      </View>

      <View style={[styles.section, { borderColor: ui.colors.border, borderWidth: ui.borders.width, borderRadius: ui.shape.radius, backgroundColor: ui.colors.surface, padding: ui.spacing.md }]}>
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="emoji-events" size={20} color={ui.colors.accent} />
          <Text style={[styles.sectionTitle, { color: ui.colors.textPrimary, fontSize: ui.typography.h3 }]}>Apoio Cognitivo</Text>
        </View>
        {renderToggle(
          'Mensagens de incentivo',
          preferences.encouragementMessages,
          () => updatePreferences({ encouragementMessages: !preferences.encouragementMessages }),
          'Receba feedback positivo ao concluir atividades',
        )}
        {renderToggle(
          'Avisos de transição',
          preferences.transitionWarnings,
          () => updatePreferences({ transitionWarnings: !preferences.transitionWarnings }),
          'Notificações suaves antes de mudanças de atividade',
        )}
      </View>

      <View style={[styles.section, { borderColor: ui.colors.border, borderWidth: ui.borders.width, borderRadius: ui.shape.radius, backgroundColor: ui.colors.surface, padding: ui.spacing.md }]}>
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="undo" size={20} color={ui.colors.accent} />
          <Text style={[styles.sectionTitle, { color: ui.colors.textPrimary, fontSize: ui.typography.h3 }]}>Restaurar Padrões</Text>
        </View>
        <Text style={[styles.sectionDescription, { color: ui.colors.textSecondary, fontSize: ui.typography.small }]}>Esta ação irá restaurar todas as configurações de acessibilidade e preferências para os valores padrão.</Text>
        <Pressable style={styles.dangerBtn} onPress={handleReset}>
          <View style={styles.resetBtnContent}>
            <MaterialIcons name="restart-alt" size={16} color="#dc2626" />
            <Text style={styles.dangerBtnText}>Restaurar Configurações Padrão</Text>
          </View>
        </Pressable>
      </View>

      {ui.content.showSupportPanels ? <View style={[styles.infoCard, { borderRadius: ui.shape.radius }]}>
        <Text style={styles.infoTitle}>💡 Configurações salvas automaticamente</Text>
        <Text style={styles.infoText}>Suas preferências persistem mesmo após fechar e reabrir a aplicação.</Text>
      </View> : null}

      <Modal visible={showResetModal} transparent animationType="fade" onRequestClose={() => setShowResetModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: ui.colors.surface, borderColor: ui.colors.border, borderRadius: ui.shape.radius }]}>
            <Text style={[styles.modalTitle, { color: ui.colors.textPrimary }]}>Restaurar Configurações</Text>
            <Text style={[styles.modalMessage, { color: ui.colors.textSecondary }]}>{resetConfirmationMessage}</Text>
            <View style={styles.modalActions}>
              <Pressable style={[styles.modalCancelBtn, { borderColor: ui.colors.border }]} onPress={() => setShowResetModal(false)}>
                <Text style={[styles.modalCancelBtnText, { color: ui.colors.textPrimary }]}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.modalConfirmBtn} onPress={confirmReset}>
                <Text style={styles.modalConfirmBtnText}>Restaurar</Text>
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
    gap: 12,
    backgroundColor: webPalette.bg,
  },
  warningCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f59e0b',
    backgroundColor: '#fef3c7',
    padding: 12,
    gap: 4,
  },
  warningTitle: {
    fontWeight: '700',
    color: '#92400e',
  },
  warningText: {
    color: '#92400e',
  },
  section: {
    borderWidth: 1,
    borderColor: webPalette.border,
    borderRadius: 12,
    backgroundColor: webPalette.white,
    padding: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionDescription: {
    color: webPalette.textSecondary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: webPalette.borderSoft,
    borderRadius: 10,
    padding: 10,
  },
  toggleLabel: {
    fontWeight: '700',
  },
  toggleDescription: {
    color: webPalette.textSecondary,
    marginTop: 2,
  },
  dangerBtn: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dc2626',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  dangerBtnText: {
    color: '#dc2626',
    fontWeight: '700',
  },
  resetBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f48fb1',
    backgroundColor: '#fce4ec',
    padding: 12,
    gap: 4,
  },
  infoTitle: {
    color: '#880e4f',
    fontWeight: '700',
  },
  infoText: {
    color: '#ad1457',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalMessage: {
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  modalCancelBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalCancelBtnText: {
    fontWeight: '600',
  },
  modalConfirmBtn: {
    borderRadius: 8,
    backgroundColor: '#dc2626',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalConfirmBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
