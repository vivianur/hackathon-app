import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '@/components/layout/ScreenContainer';
import ScreenTitle from '@/components/layout/ScreenTitle';
import ThemedSwitch from '@/components/ui/ThemedSwitch';
import { useAdaptiveTheme, useSettings } from '@/hooks';

export default function DashboardScreen() {
  const {
    settings,
    setComplexityLevel,
    toggleFocusMode,
    toggleDetailedMode,
    toggleDarkMode,
    setFontSize,
    setSpacing,
    setContrastLevel,
    toggleAnimations,
    toggleCognitiveAlerts,
    toggleVlibras,
  } = useSettings();
  const { ui } = useAdaptiveTheme();

  const renderOptions = <T extends string>(
    label: string,
    icon: React.ComponentProps<typeof MaterialIcons>['name'],
    options: { value: T; title: string }[],
    currentValue: T,
    onChange: (value: T) => void,
  ) => (
    <View style={[styles.section, { borderColor: ui.colors.border, backgroundColor: ui.colors.surface, padding: ui.spacing.md }]}>
      <View style={styles.sectionTitleRow}>
        <MaterialIcons name={icon} size={20} color={ui.colors.accent} />
        <Text style={[styles.sectionTitle, { color: ui.colors.textPrimary, fontSize: ui.typography.h3 }]}>{label}</Text>
      </View>
      <View style={styles.optionsRow}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.optionBtn,
              { borderColor: ui.colors.border, backgroundColor: ui.colors.surface, paddingVertical: ui.spacing.sm - 2 },
              currentValue === option.value && styles.optionBtnActive,
              currentValue === option.value && { backgroundColor: ui.colors.accent, borderColor: ui.colors.accent },
            ]}
            onPress={() => onChange(option.value)}>
            <Text
              style={[
                styles.optionText,
                { color: ui.colors.textPrimary, fontSize: ui.typography.small },
                currentValue === option.value && styles.optionTextActive,
              ]}>
              {option.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderToggle = (label: string, value: boolean, onPress: () => void, description?: string) => (
    <View style={[styles.toggleRow, { borderColor: ui.colors.borderSoft, padding: ui.spacing.sm }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.toggleLabel, { color: ui.colors.textPrimary, fontSize: ui.typography.body }]}>{label}</Text>
        {description ? <Text style={[styles.toggleDescription, { color: ui.colors.textSecondary, fontSize: ui.typography.small }]}>{description}</Text> : null}
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

  return (
    <ScreenContainer>
      <ScreenTitle
        icon="dashboard"
        title="Painel Cognitivo"
        subtitle="Personalize sua experiência para atender suas necessidades cognitivas"
      />

      <View style={[styles.successAlert, { padding: ui.spacing.sm }]}> 
        <Text style={[styles.successAlertText, { fontSize: ui.typography.small }]}>Todas as configurações são salvas automaticamente e aplicadas em tempo real.</Text>
      </View>

      {renderOptions(
        'Nível de Complexidade',
        'text-fields',
        [
          { value: 'simple', title: 'Simples' },
          { value: 'moderate', title: 'Padrão' },
          { value: 'detailed', title: 'Detalhado' },
        ],
        settings.complexityLevel,
        setComplexityLevel,
      )}

      <View style={[styles.section, { borderColor: ui.colors.border, backgroundColor: ui.colors.surface, padding: ui.spacing.md }]}> 
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="visibility" size={20} color={ui.colors.accent} />
          <Text style={[styles.sectionTitle, { color: ui.colors.textPrimary, fontSize: ui.typography.h3 }]}>Modos de Visualização</Text>
        </View>
        {renderToggle('Modo Foco', settings.focusMode, toggleFocusMode, 'Esconde distrações e destaca o conteúdo principal')}
        {renderToggle('Modo Monocromático', settings.detailedMode, toggleDetailedMode, 'Remove todas as cores da interface')}
        {renderToggle('Modo Escuro', settings.darkMode, toggleDarkMode, 'Reduz o brilho da tela')}
      </View>

      {renderOptions(
        'Tamanho da Fonte',
        'text-fields',
        [
          { value: 'small', title: 'Pequeno' },
          { value: 'medium', title: 'Médio' },
          { value: 'large', title: 'Grande' },
          { value: 'extra-large', title: 'Extra Grande' },
        ],
        settings.fontSize,
        setFontSize,
      )}

      {renderOptions(
        'Espaçamento',
        'space-bar',
        [
          { value: 'compact', title: 'Compacto' },
          { value: 'comfortable', title: 'Confortável' },
          { value: 'spacious', title: 'Espaçoso' },
        ],
        settings.spacing,
        setSpacing,
      )}

      {renderOptions(
        'Contraste',
        'contrast',
        [
          { value: 'low', title: 'Baixo' },
          { value: 'medium', title: 'Padrão' },
        ],
        settings.contrastLevel,
        setContrastLevel,
      )}

      <View style={[styles.section, { borderColor: ui.colors.border, backgroundColor: ui.colors.surface, padding: ui.spacing.md }]}> 
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="accessible" size={20} color={ui.colors.accent} />
          <Text style={[styles.sectionTitle, { color: ui.colors.textPrimary, fontSize: ui.typography.h3 }]}>Recursos Adicionais</Text>
        </View>
        {renderToggle('Animações', settings.animationsEnabled, toggleAnimations)}
        {renderToggle('Alertas Cognitivos', settings.cognitiveAlerts, toggleCognitiveAlerts)}
        {renderToggle('VLibras (Libras)', settings.vlibrasEnabled, toggleVlibras)}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    backgroundColor: '#f5f7fb',
  },
  successAlert: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#66bb6a',
    borderRadius: 10,
    padding: 10,
  },
  successAlertText: {
    color: '#1b5e20',
    fontWeight: '600',
  },
  section: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    backgroundColor: '#ffffff',
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
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionBtn: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  optionBtnActive: {
    backgroundColor: '#be0079',
    borderColor: '#be0079',
  },
  optionText: {
    color: '#111827',
    fontWeight: '600',
  },
  optionTextActive: {
    color: '#fff',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
  },
  toggleLabel: {
    fontWeight: '700',
  },
  toggleDescription: {
    color: '#6b7280',
    marginTop: 2,
  },
});
