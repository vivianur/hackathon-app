import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useSettings } from '@/hooks';

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };
    __vlibrasWidgetInitialized?: boolean;
  }
}

const VLibrasAppUrl = 'https://vlibras.gov.br/app';
const VLibrasAccessIconUrl = `${VLibrasAppUrl}/assets/access_icon.svg`;
const VLibrasFallbackButtonId = 'vlibras-fallback-button';

function getLauncherOffsets() {
  const isMobileViewport = window.innerWidth <= 768;

  return {
    right: '20px',
    bottom: isMobileViewport ? '300px' : '200px',
  };
}

function getContainer() {
  return (
    (document.getElementById('vlibras-root') as HTMLElement | null) ||
    (document.querySelector('[vw]') as HTMLElement | null)
  );
}

function ensureFallbackButton() {
  let fallbackButton = document.getElementById(VLibrasFallbackButtonId) as HTMLButtonElement | null;

  if (!fallbackButton) {
    fallbackButton = document.createElement('button');
    fallbackButton.id = VLibrasFallbackButtonId;
    fallbackButton.type = 'button';
    fallbackButton.setAttribute('aria-label', 'Abrir VLibras');

    const accessIcon = document.createElement('img');
    accessIcon.src = VLibrasAccessIconUrl;
    accessIcon.alt = '';
    accessIcon.width = 40;
    accessIcon.height = 40;
    accessIcon.style.display = 'block';
    accessIcon.style.maxWidth = '40px';
    accessIcon.style.maxHeight = '40px';
    fallbackButton.appendChild(accessIcon);

    const { right, bottom } = getLauncherOffsets();

    fallbackButton.style.position = 'fixed';
    fallbackButton.style.right = right;
    fallbackButton.style.bottom = bottom;
    fallbackButton.style.zIndex = '2147483647';
    fallbackButton.style.height = '40px';
    fallbackButton.style.width = '40px';
    fallbackButton.style.minWidth = '40px';
    fallbackButton.style.border = 'none';
    fallbackButton.style.borderRadius = '8px';
    fallbackButton.style.padding = '0';
    fallbackButton.style.background = 'transparent';
    fallbackButton.style.cursor = 'pointer';
    fallbackButton.style.overflow = 'hidden';
    fallbackButton.style.display = 'none';

    fallbackButton.addEventListener('click', () => {
      const accessButton = document.querySelector('[vw-access-button]') as HTMLElement | null;
      if (accessButton) {
        accessButton.click();
        return;
      }

      const pluginTop = document.querySelector('.vw-plugin-top-wrapper') as HTMLElement | null;
      if (pluginTop) {
        pluginTop.click();
      }
    });

    document.body.appendChild(fallbackButton);
  }

  return fallbackButton;
}

function setFallbackButtonVisible(visible: boolean) {
  const fallbackButton = ensureFallbackButton();
  const { right, bottom } = getLauncherOffsets();

  fallbackButton.style.right = right;
  fallbackButton.style.bottom = bottom;
  fallbackButton.style.display = visible ? 'inline-flex' : 'none';
  fallbackButton.style.alignItems = 'center';
  fallbackButton.style.justifyContent = 'center';
}

function syncLauncherVisibility(enabled: boolean) {
  setFallbackButtonVisible(enabled);
}

function applyWidgetStyles() {
  const container = getContainer();
  const accessButton = document.querySelector('[vw-access-button]') as HTMLElement | null;
  const { right, bottom } = getLauncherOffsets();

  if (container) {
    container.style.position = 'fixed';
    container.style.right = right;
    container.style.bottom = bottom;
    container.style.zIndex = '2147483647';
    container.style.display = 'block';
    container.style.visibility = 'visible';
  }

  if (accessButton) {
    accessButton.style.position = 'fixed';
    accessButton.style.right = right;
    accessButton.style.bottom = bottom;
    accessButton.style.zIndex = '2147483647';
    accessButton.style.display = 'block';
    accessButton.style.visibility = 'visible';
    accessButton.style.opacity = '1';
    accessButton.style.pointerEvents = 'auto';
    accessButton.style.minWidth = '52px';
    accessButton.style.minHeight = '52px';
  }
}

function initWidget() {
  if (!window.__vlibrasWidgetInitialized && window.VLibras?.Widget) {
    new window.VLibras.Widget(VLibrasAppUrl);
    window.__vlibrasWidgetInitialized = true;
  }
}

export default function VLibrasWidget() {
  const { settings, ready } = useSettings();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    if (!ready) {
      return;
    }

    const container = getContainer();
    if (!container) {
      return;
    }

    let styleInterval: ReturnType<typeof setInterval> | undefined;

    if (settings.vlibrasEnabled) {
      container.style.display = 'block';
      container.classList.add('enabled');

      initWidget();
      applyWidgetStyles();
      syncLauncherVisibility(true);

      styleInterval = setInterval(() => {
        applyWidgetStyles();
      }, 900);
    } else {
      container.style.display = 'none';
      container.classList.remove('enabled');
      syncLauncherVisibility(false);
    }

    return () => {
      if (styleInterval) clearInterval(styleInterval);
    };
  }, [ready, settings.vlibrasEnabled]);

  return null;
}
