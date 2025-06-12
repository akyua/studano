import notifee, { TriggerType, RepeatFrequency } from '@notifee/react-native';
import { t } from 'i18next';

const dayMapping = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

export async function scheduleWeeklyNotifications(dayIds, time, isEnabled) {
  await notifee.cancelAllNotifications();

  if (!isEnabled || !dayIds || dayIds.length === 0 || !time) {
    return;
  }

  for (const dayId of dayIds) {
    const dayOfWeek = dayMapping[dayId];
    if (dayOfWeek === undefined) continue;

    const now = new Date();
    const triggerDate = new Date();

    triggerDate.setHours(time.getHours());
    triggerDate.setMinutes(time.getMinutes());
    triggerDate.setSeconds(0);
    triggerDate.setMilliseconds(0);

    let dayDifference = dayOfWeek - now.getDay();
    if (dayDifference < 0 || (dayDifference === 0 && triggerDate.getTime() < now.getTime())) {
      dayDifference += 7;
    }
    triggerDate.setDate(now.getDate() + dayDifference);

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
      repeatFrequency: RepeatFrequency.WEEKLY,
    };

    await notifee.createTriggerNotification(
      {
        title: t('notification.title', 'Study Reminder'),
        body: t('notification.body', 'It\'s time for your scheduled study!'),
        android: {
          channelId: 'default',
          smallIcon: 'ic_notification_lamp',
          pressAction: {
            id: 'default',
          },
        },
      },
      trigger
    );
  }
}