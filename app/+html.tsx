import { ScrollViewStyleReset } from 'expo-router/html';

const VLibrasAppUrl = 'https://vlibras.gov.br/app';
const VLibrasScriptUrl = `${VLibrasAppUrl}/vlibras-plugin.js`;
const vwAttr = { vw: '' } as Record<string, string>;
const vwAccessButtonAttr = { 'vw-access-button': '' } as Record<string, string>;
const vwPluginWrapperAttr = { 'vw-plugin-wrapper': '' } as Record<string, string>;
const vlibrasBootstrapCode = `(function () {
  var APP_URL = '${VLibrasAppUrl}';
  var attempts = 0;
  var maxAttempts = 40;

  function initWidget() {
    attempts += 1;
    var hasConstructor = !!(window.VLibras && window.VLibras.Widget);
    console.warn('[VLibras][html] init attempt', { attempts: attempts, hasConstructor: hasConstructor });

    if (!hasConstructor) {
      return false;
    }

    if (!window.__vlibrasWidgetInitialized) {
      new window.VLibras.Widget(APP_URL);
      window.__vlibrasWidgetInitialized = true;
      console.warn('[VLibras][html] widget initialized');
    }

    return true;
  }

  function scheduleInit() {
    if (initWidget()) {
      return;
    }

    var interval = setInterval(function () {
      if (initWidget() || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 250);
  }

  if (document.readyState === 'complete') {
    scheduleInit();
  } else {
    window.addEventListener('load', scheduleInit, { once: true });
  }
})();`;

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <ScrollViewStyleReset />
      </head>
      <body>
        {children}

        {/* VLibras base structure keeps widget compatible with browser-only initialization flow. */}
        <div {...vwAttr} id="vlibras-root" className="enabled">
          <div {...vwAccessButtonAttr} className="active" />
          <div {...vwPluginWrapperAttr}>
            <div className="vw-plugin-top-wrapper" />
          </div>
        </div>

        <script id="vlibras-plugin-script" src={VLibrasScriptUrl} />
        <script dangerouslySetInnerHTML={{ __html: vlibrasBootstrapCode }} />
      </body>
    </html>
  );
}
