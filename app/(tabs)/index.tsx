import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { webPalette } from '../../constants/webPalette';
import { useAdaptiveTheme } from '@/hooks';

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

export default function HomeScreen() {
  const router = useRouter();
  const { ui } = useAdaptiveTheme();
  const isMonochrome = ui.mode.monochrome;
  const featureAccentColor = isMonochrome ? ui.colors.accent : undefined;

  const features: { title: string; description: string; path: string; color: string; icon: MaterialIconName }[] = [
    {
      title: 'Plataforma',
      description: 'Explore ferramentas e recursos disponíveis na plataforma',
      path: '/(tabs)/plataforma',
      color: featureAccentColor ?? webPalette.primary,
      icon: 'language',
    },
    {
      title: 'Organizador de Tarefas',
      description: 'Gerencie atividades com suporte Kanban e timer Pomodoro',
      path: '/(tabs)/tasks',
      color: featureAccentColor ?? webPalette.task,
      icon: 'assignment',
    },
    {
      title: 'Painel Cognitivo',
      description: 'Personalize a interface de acordo com suas necessidades cognitivas',
      path: '/(tabs)/dashboard',
      color: featureAccentColor ?? webPalette.panel,
      icon: 'dashboard',
    },
    {
      title: 'Perfil',
      description: 'Configure suas preferências e rotina de estudos',
      path: '/(tabs)/profile',
      color: featureAccentColor ?? webPalette.profile,
      icon: 'person',
    },
    {
      title: 'Configurações',
      description: 'Ajuste notificações e preferências do sistema',
      path: '/(tabs)/settings',
      color: featureAccentColor ?? webPalette.settings,
      icon: 'settings',
    },
  ];

  const highlights = [
    'Interface personalizável para acessibilidade cognitiva',
    'Kanban visual com suporte a Pomodoro',
    'Alertas cognitivos e mensagens de incentivo',
    'Modo foco para reduzir distrações',
  ];

  return (
    <ScreenContainer gap={ui.spacing.lg}>
      <View style={[styles.hero, { borderRadius: ui.shape.radius }]}> 
        <MaterialIcons name="psychology" size={48} color={ui.colors.accent} style={styles.brandIcon} />
        <Text style={[styles.title, { color: ui.colors.textPrimary, fontSize: ui.typography.h1 }]}>MindEase</Text>
        {ui.content.showSecondaryText ? <Text style={[styles.subtitle, { color: ui.colors.textSecondary, fontSize: ui.typography.body }]}>Plataforma de Acessibilidade Cognitiva</Text> : null}
        <Text style={[styles.description, { color: ui.colors.textSecondary, fontSize: ui.typography.small }] }>
          Desenvolvida para facilitar a vida acadêmica e profissional de pessoas neurodivergentes e/ou com desafios de processamento cognitivo.
        </Text>
      </View>

      <View style={styles.grid}>
        {features.map((feature) => (
          <Pressable
            key={feature.path}
            style={[styles.card, { borderColor: feature.color, borderWidth: ui.borders.width, backgroundColor: ui.colors.surface, padding: ui.spacing.md, borderRadius: ui.shape.radius }]}
            onPress={() => router.push(feature.path as never)}>
            <View style={styles.cardHeader}>
              <MaterialIcons name={feature.icon} size={20} color={feature.color} />
              <Text style={[styles.cardTitle, { color: feature.color, fontSize: ui.typography.h3 }]}>{feature.title}</Text>
            </View>
            {ui.content.showSecondaryText ? <Text style={[styles.cardDescription, { color: ui.colors.textSecondary, fontSize: ui.typography.small }]}>{feature.description}</Text> : null}
          </Pressable>
        ))}
      </View>

      {ui.content.showSupportPanels ? <View style={[styles.highlightBox, { borderRadius: ui.shape.radius, borderWidth: ui.borders.width, backgroundColor: isMonochrome ? ui.colors.surface : webPalette.gradientStart, borderColor: isMonochrome ? ui.colors.border : webPalette.gradientEnd }]}>
        <Text style={[styles.highlightTitle, { color: isMonochrome ? ui.colors.textPrimary : '#fff' }]}>🎯 Recursos Principais</Text>
        {highlights.map((item) => (
          <Text key={item} style={[styles.highlightItem, { color: isMonochrome ? ui.colors.textSecondary : '#fff' }]}>
            • {item}
          </Text>
        ))}
      </View> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    backgroundColor: webPalette.bg,
  },
  hero: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  brandIcon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: webPalette.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: webPalette.textSecondary,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: webPalette.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  grid: {
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    backgroundColor: webPalette.white,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  cardDescription: {
    marginTop: 6,
    color: webPalette.textSecondary,
    lineHeight: 20,
  },
  highlightBox: {
    backgroundColor: webPalette.gradientStart,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: webPalette.gradientEnd,
  },
  highlightTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  highlightItem: {
    color: '#fff',
    marginTop: 4,
    lineHeight: 20,
  },
});
