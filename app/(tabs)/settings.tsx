import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import ScreenContainer from '@/components/layout/ScreenContainer';
import ScreenTitle from '@/components/layout/ScreenTitle';
import ThemedSwitch from '@/components/ui/ThemedSwitch';
import { useAdaptiveTheme, useSettings } from '@/hooks';
import { webPalette } from '../../constants/webPalette';

const TABLET_BREAKPOINT = 768;
const IPAD_AIR_MIN_SIDE = 820;
const IPAD_PRO_MIN_SIDE = 1024;
const IPAD_AIR_MIN_LONG_SIDE = 1180;
const IPAD_PRO_MIN_LONG_SIDE = 1366;
const SETTINGS_MODAL_SHIFT_IPAD_MINI = 85;
const SETTINGS_MODAL_SHIFT_IPAD_AIR = 155;
const SETTINGS_MODAL_SHIFT_IPAD_PRO = 245;

export default function SettingsScreen() {
  const { settings, updatePreferences, resetToDefaults } = useSettings();
  const { ui } = useAdaptiveTheme();
  const { width, height } = useWindowDimensions();
  const isTabletOrLarger = width >= TABLET_BREAKPOINT;
  const shorterSide = Math.min(width, height);
  const longerSide = Math.max(width, height);
  const tabletModalVerticalShift = !isTabletOrLarger
    ? 0
    : shorterSide >= IPAD_PRO_MIN_SIDE || longerSide >= IPAD_PRO_MIN_LONG_SIDE
      ? SETTINGS_MODAL_SHIFT_IPAD_PRO
      : shorterSide >= IPAD_AIR_MIN_SIDE || longerSide >= IPAD_AIR_MIN_LONG_SIDE
        ? SETTINGS_MODAL_SHIFT_IPAD_AIR
        : SETTINGS_MODAL_SHIFT_IPAD_MINI;
  const [showResetModal, setShowResetModal] = React.useState(false);

  const alertCardBg = ui.mode.monochrome
    ? (ui.mode.dark ? 'rgba(120,120,120,0.31)' : 'rgba(150,150,150,0.31)')
    : 'rgba(255,121,197,0.31)';
  const alertCardBorder = ui.mode.monochrome
    ? (ui.mode.dark ? '#aaaaaa' : '#555555')
    : (ui.mode.dark ? '#ff00d0' : '#be0078cc');
  const alertTitleColor = ui.mode.monochrome
    ? (ui.mode.dark ? '#cccccc' : '#555555')
    : (ui.mode.dark ? '#ff00d0' : '#be0078cc');

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

      <View style={[styles.warningCard, { borderRadius: ui.shape.radius, backgroundColor: alertCardBg, borderColor: alertCardBorder }]}>
        <View style={styles.alertTitleRow}>
          <MaterialIcons name="warning-amber" size={18} color={alertTitleColor} />
          <Text style={[styles.warningText, { color: ui.colors.textPrimary }]}>As configurações de acessibilidade estão disponíveis no Painel Cognitivo</Text>
        </View>
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

      {ui.content.showSupportPanels ? <View style={[styles.infoCard, { borderRadius: ui.shape.radius, backgroundColor: alertCardBg, borderColor: alertCardBorder }]}>
        <View style={styles.alertTitleRow}>
          <MaterialIcons name="info-outline" size={18} color={alertTitleColor} />
          <Text style={[styles.infoText, { color: ui.colors.textPrimary }]}>Suas preferências persistem mesmo após fechar e reabrir a aplicação.</Text>
        </View>
      </View> : null}

      <Modal visible={showResetModal} transparent animationType="fade" onRequestClose={() => setShowResetModal(false)}>
        <View style={[styles.modalOverlay, isTabletOrLarger && styles.modalOverlayWide]}>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={[styles.modalScrollContent, isTabletOrLarger && styles.modalScrollContentWide]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.modalCard,
                { backgroundColor: ui.colors.surface, borderColor: ui.colors.border, borderRadius: ui.shape.radius },
                isTabletOrLarger && { transform: [{ translateY: -tabletModalVerticalShift }] },
              ]}
            >
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
          </ScrollView>
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
    padding: 12,
    gap: 4,
  },
  warningTitle: {
    fontWeight: '700',
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  warningText: {},
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
    padding: 12,
    gap: 4,
  },
  infoTitle: {
    fontWeight: '700',
  },
  infoText: {},
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
