import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

type NotificationPayload = {
  title: string;
  body: string;
};

let notificationHandlerConfigured = false;

function ensureNotificationHandler() {
  if (notificationHandlerConfigured || Platform.OS === 'web') {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  notificationHandlerConfigured = true;
}

export async function sendLocalFeedbackNotification({ title, body }: NotificationPayload) {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    ensureNotificationHandler();

    const currentPermissions = await Notifications.getPermissionsAsync();
    const granted = currentPermissions.granted
      ? currentPermissions
      : await Notifications.requestPermissionsAsync();

    if (!granted.granted) {
      return false;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger: null,
    });

    return true;
  } catch {
    return false;
  }
}
