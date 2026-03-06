import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import ScreenContainer from '@/components/layout/ScreenContainer';
import ScreenTitle from '@/components/layout/ScreenTitle';
import { useAdaptiveTheme } from '@/hooks';
import { webPalette } from '../../constants/webPalette';

const TABLET_BREAKPOINT = 768;
const IPAD_AIR_MIN_SIDE = 820;
const IPAD_PRO_MIN_SIDE = 1024;
const IPAD_AIR_MIN_LONG_SIDE = 1180;
const IPAD_PRO_MIN_LONG_SIDE = 1366;
const PLATFORM_MODAL_SHIFT_IPAD_MINI = 85;
const PLATFORM_MODAL_SHIFT_IPAD_AIR = 155;
const PLATFORM_MODAL_SHIFT_IPAD_PRO = 245;

type Topic = {
  titulo: string;
  descricao: string;
  aulas: string[];
};

const recursos: Topic[] = [
  {
    titulo: 'Inteligência Artificial',
    descricao: 'Conheça ferramentas e recursos de IA para otimizar seu trabalho.',
    aulas: ['Aula 1: Introdução à IA', 'Aula 2: Aprendizado Supervisionado', 'Aula 3: Redes Neurais'],
  },
  {
    titulo: 'Análise de Dados',
    descricao: 'Descubra insights poderosos através da análise de dados.',
    aulas: ['Aula 1: Estatística Básica', 'Aula 2: Limpeza de Dados', 'Aula 3: Visualização de Dados'],
  },
  {
    titulo: 'Automação',
    descricao: 'Automatize processos e aumente sua produtividade.',
    aulas: ['Aula 1: RPA Conceitos', 'Aula 2: Ferramentas de Automação', 'Aula 3: Boas Práticas'],
  },
  {
    titulo: 'Cloud Computing',
    descricao: 'Aprenda sobre soluções em nuvem e arquitetura escalável.',
    aulas: ['Aula 1: Conceitos de Nuvem', 'Aula 2: Serviços IaaS/PaaS/SaaS', 'Aula 3: Arquitetura Escalável'],
  },
  {
    titulo: 'DevOps',
    descricao: 'Melhore a integração e entrega contínua dos seus projetos.',
    aulas: ['Aula 1: Cultura DevOps', 'Aula 2: CI/CD', 'Aula 3: Observabilidade'],
  },
  {
    titulo: 'Segurança',
    descricao: 'Proteja seus sistemas com as melhores práticas de segurança.',
    aulas: ['Aula 1: Fundamentos de Segurança', 'Aula 2: Autenticação e Autorização', 'Aula 3: Monitoramento'],
  },
];

export default function PlataformaScreen() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const { ui } = useAdaptiveTheme();
  const { width, height } = useWindowDimensions();
  const isTabletOrLarger = width >= TABLET_BREAKPOINT;
  const shorterSide = Math.min(width, height);
  const longerSide = Math.max(width, height);
  const tabletModalVerticalShift = !isTabletOrLarger
    ? 0
    : shorterSide >= IPAD_PRO_MIN_SIDE || longerSide >= IPAD_PRO_MIN_LONG_SIDE
      ? PLATFORM_MODAL_SHIFT_IPAD_PRO
      : shorterSide >= IPAD_AIR_MIN_SIDE || longerSide >= IPAD_AIR_MIN_LONG_SIDE
        ? PLATFORM_MODAL_SHIFT_IPAD_AIR
        : PLATFORM_MODAL_SHIFT_IPAD_MINI;

  const handleUnavailableContent = () => {
    setShowUnavailableModal(true);
  };

  if (selectedTopic) {
    return (
      <ScreenContainer>
        <Pressable style={[styles.backBtn, { borderColor: ui.colors.border, borderWidth: ui.borders.width, borderRadius: ui.shape.radius, backgroundColor: ui.colors.surface }]} onPress={() => setSelectedTopic(null)}>
          <View style={styles.backBtnContent}>
            <MaterialIcons name="arrow-back" size={18} color={ui.colors.textPrimary} />
            <Text style={[styles.backBtnText, { color: ui.colors.textPrimary }]}>Voltar</Text>
          </View>
        </Pressable>

        <Text style={[styles.title, { color: ui.colors.textPrimary, fontSize: ui.typography.h1 }]}>{selectedTopic.titulo}</Text>
        {ui.content.showSecondaryText ? <Text style={[styles.subtitle, { color: ui.colors.textSecondary, fontSize: ui.typography.body }]}>{selectedTopic.descricao}</Text> : null}

        {selectedTopic.aulas.map((aula) => (
          <View key={aula} style={[styles.lessonCard, { borderColor: ui.colors.border, borderWidth: ui.borders.width, borderRadius: ui.shape.radius, backgroundColor: ui.colors.surface, padding: ui.spacing.md }]}>
            <View>
              <Text style={[styles.lessonTitle, { color: ui.colors.textPrimary, fontSize: ui.typography.body }]}>{aula}</Text>
              {ui.content.showSecondaryText ? <Text style={[styles.lessonSub, { color: ui.colors.textSecondary, fontSize: ui.typography.small }]}>Material e exercícios</Text> : null}
            </View>
            <View style={styles.lessonActions}>
              <Pressable style={[styles.primaryBtn, { backgroundColor: ui.colors.accent }]} onPress={handleUnavailableContent}>
                <View style={styles.actionBtnContent}>
                  <MaterialIcons name="play-circle-outline" size={16} color="#fff" />
                  <Text style={styles.primaryBtnText}>Vídeo</Text>
                </View>
              </Pressable>
              <Pressable style={[styles.primaryBtn, { backgroundColor: ui.colors.accent }]} onPress={handleUnavailableContent}>
                <View style={styles.actionBtnContent}>
                  <MaterialIcons name="text-snippet" size={16} color="#fff" />
                  <Text style={styles.primaryBtnText}>Texto</Text>
                </View>
              </Pressable>
            </View>
          </View>
        ))}

        <Modal
          visible={showUnavailableModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowUnavailableModal(false)}
        >
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
                <Pressable
                  style={styles.modalCloseBtn}
                  onPress={() => setShowUnavailableModal(false)}
                  accessibilityLabel="Fechar alerta"
                >
                  <MaterialIcons name="close" size={20} color={ui.colors.textSecondary} />
                </Pressable>

                <Text style={[styles.modalTitle, { color: ui.colors.textPrimary }]}>Conteudo indisponivel no momento</Text>
                <Text style={[styles.modalMessage, { color: ui.colors.textSecondary }]}>Desculpe, este material esta temporariamente indisponivel. Estamos trabalhando para liberar o conteudo o quanto antes. Obrigado pela compreensao.</Text>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenTitle icon="language" title="Plataforma" subtitle="Descubra novos recursos e funcionalidades" />

      {recursos.map((recurso) => (
        <Pressable
          key={recurso.titulo}
          style={[styles.card, { borderColor: ui.colors.border, borderWidth: ui.borders.width, borderRadius: ui.shape.radius, backgroundColor: ui.colors.surface, padding: ui.spacing.md }]}
          onPress={() => setSelectedTopic(recurso)}>
          <Text style={[styles.cardTitle, { color: ui.colors.textPrimary, fontSize: ui.typography.h3 }]}>{recurso.titulo}</Text>
          {ui.content.showSecondaryText ? <Text style={[styles.cardDescription, { color: ui.colors.textSecondary, fontSize: ui.typography.small }]}>{recurso.descricao}</Text> : null}
        </Pressable>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 10,
    backgroundColor: webPalette.bg,
  },
  card: {
    borderWidth: 1,
    borderColor: webPalette.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: webPalette.white,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDescription: {
    color: webPalette.textSecondary,
    lineHeight: 20,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: webPalette.border,
    backgroundColor: webPalette.white,
  },
  backBtnText: {
    color: webPalette.textPrimary,
    fontWeight: '600',
  },
  backBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lessonCard: {
    borderWidth: 1,
    borderColor: webPalette.border,
    borderRadius: 10,
    padding: 12,
    gap: 10,
    backgroundColor: webPalette.white,
  },
  lessonTitle: {
    fontWeight: '700',
    marginBottom: 2,
  },
  lessonSub: {
    color: webPalette.textSecondary,
  },
  lessonActions: {
    flexDirection: 'row',
    gap: 8,
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
  actionBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    lineHeight: 20,
    marginBottom: 16,
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
    maxWidth: 420,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  modalCloseBtn: {
    alignSelf: 'flex-end',
    padding: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalMessage: {
    lineHeight: 20,
  },
});
