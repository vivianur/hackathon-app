import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ScreenContainer from '@/components/layout/ScreenContainer';
import ScreenTitle from '@/components/layout/ScreenTitle';
import { useAdaptiveTheme, useProfile } from '@/hooks';
import { webPalette } from '../../constants/webPalette';

export default function ProfileScreen() {
  const { profile, updateProfile, toggleNeurodivergence, updateStudyRoutine } = useProfile();
  const { ui } = useAdaptiveTheme();
  const [isEditing, setIsEditing] = React.useState(false);
  const [nameDraft, setNameDraft] = React.useState(profile.name);
  const [emailDraft, setEmailDraft] = React.useState(profile.email);

  React.useEffect(() => {
    setNameDraft(profile.name);
    setEmailDraft(profile.email);
  }, [profile.name, profile.email]);

  const neurodivergenceOptions = [
    'TDAH',
    'TEA (Autismo)',
    'Dislexia',
    'Ansiedade',
    'Burnout',
    'Sobrecarga Sensorial',
    'Outro',
  ];

  const save = () => {
    updateProfile({ name: nameDraft, email: emailDraft });
    setIsEditing(false);
  };

  const cancel = () => {
    setNameDraft(profile.name);
    setEmailDraft(profile.email);
    setIsEditing(false);
  };

  return (
    <ScreenContainer>
      <ScreenTitle icon="person" title="Perfil do Usuário" subtitle="Gerencie suas informações e preferências pessoais" />

      <View style={[styles.profileCard, { borderColor: ui.colors.border, borderWidth: ui.borders.width, borderRadius: ui.shape.radius, backgroundColor: ui.colors.surface, padding: ui.spacing.md }]}>
        <View style={[styles.avatar, { backgroundColor: ui.colors.accent }]}>
          <Text style={styles.avatarText}>{profile.name.slice(0, 1).toUpperCase()}</Text>
        </View>
        <Text style={[styles.profileName, { color: ui.colors.textPrimary, fontSize: ui.typography.h2 }]}>{profile.name}</Text>
        <Text style={[styles.profileEmail, { color: ui.colors.textSecondary, fontSize: ui.typography.small }]}>{profile.email}</Text>

        <TextInput
          value={nameDraft}
          onChangeText={setNameDraft}
          editable={isEditing}
          placeholder="Nome"
          style={[styles.input, { borderColor: ui.colors.border, backgroundColor: ui.colors.surface, fontSize: ui.typography.body, color: ui.colors.textPrimary }]}
        />
        <TextInput
          value={emailDraft}
          onChangeText={setEmailDraft}
          editable={isEditing}
          placeholder="Email"
          style={[styles.input, { borderColor: ui.colors.border, backgroundColor: ui.colors.surface, fontSize: ui.typography.body, color: ui.colors.textPrimary }]}
        />

        <View style={styles.actionsRow}>
          {!isEditing ? (
            <Pressable style={[styles.primaryBtn, { backgroundColor: ui.colors.accent }]} onPress={() => setIsEditing(true)}>
              <Text style={styles.primaryBtnText}>Editar Perfil</Text>
            </Pressable>
          ) : (
            <>
              <Pressable style={styles.secondaryBtn} onPress={cancel}>
                <Text style={styles.secondaryBtnText}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.primaryBtn, { backgroundColor: ui.colors.accent }]} onPress={save}>
                <Text style={styles.primaryBtnText}>Salvar Alterações</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      <View style={[styles.section, { borderColor: ui.colors.border, borderWidth: ui.borders.width, borderRadius: ui.shape.radius, backgroundColor: ui.colors.surface, padding: ui.spacing.md }]}>
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="psychology" size={20} color={ui.colors.accent} />
          <Text style={[styles.sectionTitle, { color: ui.colors.textPrimary, fontSize: ui.typography.h3 }]}>Neurodivergências</Text>
        </View>
        {ui.content.showSecondaryText ? <Text style={[styles.sectionSub, { color: ui.colors.textSecondary, fontSize: ui.typography.small }]}>Identifique suas necessidades para personalizar melhor sua experiência.</Text> : null}
        <View style={styles.chipsWrap}>
          {neurodivergenceOptions.map((option) => {
            const selected = profile.neurodivergence.includes(option);
            return (
              <Pressable
                key={option}
                style={[
                  styles.chip,
                  { borderColor: ui.colors.border, backgroundColor: ui.colors.surface },
                  selected && styles.chipActive,
                  selected && { backgroundColor: ui.colors.accent, borderColor: ui.colors.accent },
                ]}
                onPress={() => toggleNeurodivergence(option)}>
                <Text style={[styles.chipText, { color: ui.colors.textPrimary, fontSize: ui.typography.small }, selected && styles.chipTextActive]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.section, { borderColor: ui.colors.border, borderWidth: ui.borders.width, borderRadius: ui.shape.radius, backgroundColor: ui.colors.surface, padding: ui.spacing.md }]}>
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="access-time" size={20} color={ui.colors.accent} />
          <Text style={[styles.sectionTitle, { color: ui.colors.textPrimary, fontSize: ui.typography.h3 }]}>Rotina de Estudo</Text>
        </View>

        <Text style={styles.fieldLabel}>Período Preferido</Text>
        <View style={styles.rowWrap}>
          {[
            { value: 'morning', label: 'Manhã' },
            { value: 'afternoon', label: 'Tarde' },
            { value: 'evening', label: 'Noite' },
            { value: 'night', label: 'Madrugada' },
          ].map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.optionBtn,
                profile.studyRoutine.preferredStudyTime === option.value && styles.optionBtnActive,
              ]}
              onPress={() =>
                updateStudyRoutine({ preferredStudyTime: option.value as 'morning' | 'afternoon' | 'evening' | 'night' })
              }>
              <Text style={[
                styles.optionText,
                profile.studyRoutine.preferredStudyTime === option.value && styles.optionTextActive,
              ]}>{option.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Técnica de Foco</Text>
        <View style={styles.rowWrap}>
          {[
            { value: 'pomodoro', label: 'Pomodoro (25min)' },
            { value: 'custom', label: 'Personalizado' },
            { value: 'flexible', label: 'Flexível' },
          ].map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.optionBtn,
                profile.studyRoutine.focusTechnique === option.value && styles.optionBtnActive,
              ]}
              onPress={() =>
                updateStudyRoutine({ focusTechnique: option.value as 'pomodoro' | 'custom' | 'flexible' })
              }>
              <Text style={[
                styles.optionText,
                profile.studyRoutine.focusTechnique === option.value && styles.optionTextActive,
              ]}>{option.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Duração da Sessão (min)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(profile.studyRoutine.sessionDuration)}
          onChangeText={(value) => updateStudyRoutine({ sessionDuration: Number(value) || 25 })}
        />

        <Text style={styles.fieldLabel}>Duração da Pausa (min)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(profile.studyRoutine.breakDuration)}
          onChangeText={(value) => updateStudyRoutine({ breakDuration: Number(value) || 5 })}
        />
      </View>

      {ui.content.showSupportPanels ? <View style={[styles.tipCard, { backgroundColor: ui.colors.accent, borderRadius: ui.shape.radius }]}>
        <View style={styles.tipTitleRow}>
          <MaterialIcons name="local-cafe" size={18} color="#fff" />
          <Text style={styles.tipTitle}>Lembre-se de fazer pausas!</Text>
        </View>
        <Text style={styles.tipText}>Seu bem-estar é fundamental para uma produtividade sustentável.</Text>
      </View> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    backgroundColor: webPalette.bg,
  },
  profileCard: {
    borderWidth: 1,
    borderColor: webPalette.border,
    borderRadius: 12,
    backgroundColor: webPalette.white,
    padding: 12,
    gap: 8,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: webPalette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileEmail: {
    color: webPalette.textSecondary,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: webPalette.border,
    borderRadius: 8,
    padding: 10,
    backgroundColor: webPalette.white,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  primaryBtn: {
    backgroundColor: webPalette.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    backgroundColor: webPalette.white,
  },
  secondaryBtnText: {
    color: webPalette.textPrimary,
    fontWeight: '600',
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
  sectionSub: {
    color: webPalette.textSecondary,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: webPalette.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: webPalette.white,
  },
  chipActive: {
    backgroundColor: webPalette.primary,
    borderColor: webPalette.primary,
  },
  chipText: {
    color: webPalette.textPrimary,
    fontWeight: '600',
    fontSize: 12,
  },
  chipTextActive: {
    color: '#fff',
  },
  fieldLabel: {
    fontWeight: '700',
    marginTop: 4,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionBtn: {
    borderWidth: 1,
    borderColor: webPalette.border,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: webPalette.white,
  },
  optionBtnActive: {
    backgroundColor: webPalette.primary,
    borderColor: webPalette.primary,
  },
  optionText: {
    color: webPalette.textPrimary,
    fontWeight: '600',
    fontSize: 12,
  },
  optionTextActive: {
    color: '#fff',
  },
  tipCard: {
    borderRadius: 12,
    backgroundColor: webPalette.primary,
    padding: 14,
    gap: 4,
  },
  tipTitle: {
    color: '#fff',
    fontWeight: '700',
  },
  tipTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tipText: {
    color: '#fff',
  },
});
