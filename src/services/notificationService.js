import notifee, { TriggerType, RepeatFrequency, AndroidImportance } from '@notifee/react-native';
import { t } from 'i18next';

const dayMapping = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

export async function createNotificationChannel() {
  const channelId = 'default';
  const channelName = t('notification.channelName', 'Daily Reminders');
  await notifee.createChannel({
    id: channelId,
    name: channelName,
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
}

export async function scheduleWeeklyNotifications(dayIds, time, isEnabled) {
  await createNotificationChannel();
  await notifee.cancelAllNotifications();

  if (!isEnabled || !dayIds || dayIds.length === 0 || !time) {
    console.log('Notificações desabilitadas ou sem dados para agendar.');
    return;
  }

  console.log('Tentando agendar notificações para os dias:', dayIds, 'às', time.toLocaleTimeString());

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

    console.log(`Agendando notificação para o dia ID: ${dayId} (Dia da semana: ${dayOfWeek}). Disparar em: ${triggerDate.toLocaleString()}`);

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
      repeatFrequency: RepeatFrequency.WEEKLY,
    };

    try {
      await notifee.createTriggerNotification(
        {
          title: t('notification.title', 'Study Reminder'),
          body: t('notification.body', 'It\'s time for your scheduled study!'),
          android: {
            channelId: 'default',
            smallIcon: 'ic_notification',
            pressAction: {
              id: 'default',
            },
          },
        },
        trigger
      );
      console.log(`Notificação agendada com sucesso para ${dayId}.`);
    } catch (e) {
      console.error(`Erro ao criar notificação para ${dayId}:`, e);
    }
  }

  await checkPendingNotifications();
}

export async function checkPendingNotifications() {
  const triggerNotifications = await notifee.getTriggerNotifications();
  console.log('--- Notificações AGENDADAS pelo Notifee:');
  if (triggerNotifications.length === 0) {
    console.log('Nenhuma notificação agendada no momento.');
  } else {
    triggerNotifications.forEach(notification => {
      const notificationId = notification.notification?.id || 'N/A';
      const notificationTitle = notification.notification?.title || 'N/A';
      const repeatType = notification.trigger.repeatFrequency === RepeatFrequency.WEEKLY ? 'Semanal' : 'Não';

      console.log(`ID: ${notificationId}, Título: ${notificationTitle}, Trigger Time: ${new Date(notification.trigger.timestamp).toLocaleString()}, Repeat: ${repeatType}`);
    });
  }
  console.log('--- FIM da lista de notificações agendadas.');
}