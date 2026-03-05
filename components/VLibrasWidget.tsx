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

const VLibrasScriptId = 'vlibras-plugin-script';
const VLibrasAppUrl = 'https://vlibras.gov.br/app';
const VLibrasScriptUrl = `${VLibrasAppUrl}/vlibras-plugin.js`;

function ensureContainer() {
  let container = document.querySelector('[vw]') as HTMLElement | null;

  if (!container) {
    container = document.createElement('div');
    container.setAttribute('vw', '');

    const accessButton = document.createElement('div');
    accessButton.setAttribute('vw-access-button', '');
    accessButton.className = 'active';

    const pluginWrapper = document.createElement('div');
    pluginWrapper.setAttribute('vw-plugin-wrapper', '');

    const pluginTopWrapper = document.createElement('div');
    pluginTopWrapper.className = 'vw-plugin-top-wrapper';

    pluginWrapper.appendChild(pluginTopWrapper);
    container.appendChild(accessButton);
    container.appendChild(pluginWrapper);
    document.body.appendChild(container);
  }

  return container;
}

function initWidget() {
  if (window.__vlibrasWidgetInitialized) {
    return;
  }

  if (window.VLibras?.Widget) {
    new window.VLibras.Widget(VLibrasAppUrl);
    window.__vlibrasWidgetInitialized = true;
  }
}

export default function VLibrasWidget() {
  const { settings } = useSettings();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const container = ensureContainer();

    if (settings.vlibrasEnabled) {
      container.style.display = 'block';
      container.classList.add('enabled');

      if (window.VLibras?.Widget) {
        initWidget();
      } else {
        let script = document.getElementById(VLibrasScriptId) as HTMLScriptElement | null;

        if (!script) {
          script = document.createElement('script');
          script.id = VLibrasScriptId;
          script.src = VLibrasScriptUrl;
          script.async = true;
          script.onload = () => initWidget();
          document.body.appendChild(script);
        }
      }
    } else {
      container.style.display = 'none';
      container.classList.remove('enabled');
    }
  }, [settings.vlibrasEnabled]);

  return null;
}
