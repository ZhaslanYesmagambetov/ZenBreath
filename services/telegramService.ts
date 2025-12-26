
// Use the type-safe window.Telegram.WebApp if available, otherwise mock it for development
const tg = (window as any).Telegram?.WebApp;

export const telegramService = {
  ready: () => tg?.ready(),
  expand: () => tg?.expand(),
  setHeaderColor: (color: string) => tg?.setHeaderColor(color),
  hapticFeedback: (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
    if (tg?.HapticFeedback) {
      if (['light', 'medium', 'heavy'].includes(type)) {
        tg.HapticFeedback.impactOccurred(type);
      } else if (['success', 'warning', 'error'].includes(type)) {
        tg.HapticFeedback.notificationOccurred(type);
      }
    }
  },
  close: () => tg?.close(),
  isAvailable: () => !!tg
};
