import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Modal, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LineChart, BarChart } from "react-native-chart-kit";
import { useTranslation } from "react-i18next";
import { HistoryScreenProps } from "./types";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderComponent from '@/components/HeaderComponent';
import { HistoryService } from '@/services/historyService';
import { Subject } from '@/models/Subject';
import { useQuery } from '@/database/RealmContext';
import { PomodoroSession } from '@/models/PomodoroSession';
import { useTheme } from '@/context/ThemeContext';
import i18n from '../../i18n';

const chartWidth = Math.max(Dimensions.get("window").width - 32, 800);
const chartHeight = 220;

const historyService = new HistoryService();

function getAllSubjects(): Subject[] {
  return Array.from((historyService as any).subjectRepo.getAll()) as Subject[];
}

type TimeRange = '7' | '14' | '30';

interface DayDetail {
  date: string;
  minutes: number;
  sessions: number;
  subjects: { name: string; minutes: number }[];
}

const HistoryScreen = (props: HistoryScreenProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('7');
  const [activeTab, setActiveTab] = useState<'line' | 'bar' | 'calendar'>('line');
  const [selectedDay, setSelectedDay] = useState<DayDetail | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const sessions = useQuery(PomodoroSession);
  const subjects = getAllSubjects();
  const overallStats = historyService.getOverallStats(parseInt(timeRange));
  const subjectComparison = historyService.getSubjectComparisonData(parseInt(timeRange));
  const calendarData = historyService.getCalendarData(parseInt(timeRange));
  
  const subjectStatsMap: { [id: string]: any } = {};
  subjects.forEach(subject => {
    subjectStatsMap[subject._id.toString()] = historyService.getSubjectStats(subject._id.toString(), parseInt(timeRange));
  });

  const chartData = selectedSubjectId === 'all'
    ? overallStats.dailyStats
    : subjectStatsMap[selectedSubjectId]?.dailyStats || [];

  const labels = chartData.map((day: any) => historyService.formatDate(day.date, i18n.language));
  const data = chartData.map((day: any) => day.totalMinutes);

  const handleDayPress = (day: any) => {
    if (day.minutes > 0) {
      const dayDetail: DayDetail = {
        date: day.date,
        minutes: day.minutes,
        sessions: day.sessions,
        subjects: day.subjects ? Object.values(day.subjects).map((subject: any) => ({
          name: subject.subjectName,
          minutes: subject.minutes
        })) : []
      };
      setSelectedDay(dayDetail);
      setModalVisible(true);
    }
  };

  const renderLineChart = () => (
    <View style={styles.chartContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
      >
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data,
                color: () => colors.primary,
                strokeWidth: 2,
              },
            ],
          }}
          width={chartWidth}
          height={chartHeight}
          yAxisSuffix="m"
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            color: (opacity = 1) => colors.primary,
            labelColor: (opacity = 1) => colors.text,
            style: { borderRadius: 16 },
            propsForDots: { r: "4", strokeWidth: "2", stroke: colors.primary },
          }}
          bezier
          style={styles.chart}
        />
      </ScrollView>
      <Text style={[styles.summary, { color: colors.textSecondary }]}>
        {selectedSubjectId === 'all'
          ? `${t('history.total_time')}: ${historyService.formatMinutes(overallStats.totalMinutes)}`
          : subjectStatsMap[selectedSubjectId]
            ? `${subjectStatsMap[selectedSubjectId].subjectName}: ${historyService.formatMinutes(subjectStatsMap[selectedSubjectId].totalMinutes)}`
            : ''}
      </Text>
    </View>
  );

  const renderBarChart = () => (
    <View style={styles.chartContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
      >
        <BarChart
          data={{
            labels: subjectComparison.labels,
            datasets: [
              {
                data: subjectComparison.data,
              },
            ],
          }}
          width={chartWidth}
          height={chartHeight}
          yAxisSuffix="m"
          yAxisLabel=""
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            color: (opacity = 1) => colors.primary,
            labelColor: (opacity = 1) => colors.text,
            style: { borderRadius: 16 },
          }}
          style={styles.chart}
        />
      </ScrollView>
      <Text style={[styles.summary, { color: colors.textSecondary }]}>
        {t('history.subject_comparison')} {timeRange} {t('history.days')}
      </Text>
    </View>
  );

  const renderCalendar = () => (
    <View style={styles.calendarContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.calendarGrid}>
          {calendarData.map((day, index) => (
            <TouchableOpacity 
              key={day.date} 
              style={[
                styles.calendarDay, 
                { backgroundColor: day.minutes > 0 ? colors.primary : colors.surface }
              ]}
              onPress={() => handleDayPress(day)}
            >
              <Text style={[
                styles.calendarDayText,
                { color: day.minutes > 0 ? colors.surface : colors.text }
              ]}>
                {new Date(day.date).getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Text style={[styles.summary, { color: colors.textSecondary }]}>
        {t('history.study_calendar')} {timeRange} {t('history.days')}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: colors.background }]}>
      <HeaderComponent />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>{t('history.pomodoro_time_per_day')}</Text>
        
        <View style={[styles.streakContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.streakContent}>
            <Image source={require('../../assets/images/fire.png')} style={styles.streakIcon} />
            <Text style={[styles.streakText, { color: colors.text }]}>
              {overallStats.studyStreak} {overallStats.studyStreak === 1 ? t('history.study_streak_text') : t('history.study_streak_text_plural')}
            </Text>
          </View>
        </View>

        <View style={[styles.timeRangeContainer, { backgroundColor: colors.surface }]}>
          <TouchableOpacity 
            style={[
              styles.timeRangeButton, 
              { backgroundColor: timeRange === '7' ? colors.primary : 'transparent' }
            ]} 
            onPress={() => setTimeRange('7')}
          >
            <Text style={[
              styles.timeRangeText, 
              { color: timeRange === '7' ? colors.surface : colors.textSecondary }
            ]}>7D</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.timeRangeButton, 
              { backgroundColor: timeRange === '14' ? colors.primary : 'transparent' }
            ]} 
            onPress={() => setTimeRange('14')}
          >
            <Text style={[
              styles.timeRangeText, 
              { color: timeRange === '14' ? colors.surface : colors.textSecondary }
            ]}>14D</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.timeRangeButton, 
              { backgroundColor: timeRange === '30' ? colors.primary : 'transparent' }
            ]} 
            onPress={() => setTimeRange('30')}
          >
            <Text style={[
              styles.timeRangeText, 
              { color: timeRange === '30' ? colors.surface : colors.textSecondary }
            ]}>30D</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
          <TouchableOpacity 
            style={[
              styles.tabButton, 
              { backgroundColor: activeTab === 'line' ? colors.primary : 'transparent' }
            ]} 
            onPress={() => setActiveTab('line')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'line' ? colors.surface : colors.textSecondary }
            ]}>{t('history.timeline')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tabButton, 
              { backgroundColor: activeTab === 'bar' ? colors.primary : 'transparent' }
            ]} 
            onPress={() => setActiveTab('bar')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'bar' ? colors.surface : colors.textSecondary }
            ]}>{t('history.subjects')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tabButton, 
              { backgroundColor: activeTab === 'calendar' ? colors.primary : 'transparent' }
            ]} 
            onPress={() => setActiveTab('calendar')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'calendar' ? colors.surface : colors.textSecondary }
            ]}>{t('history.calendar')}</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'line' && (
          <>
            <Picker
              selectedValue={selectedSubjectId}
              style={[styles.picker, { color: colors.text }]}
              onValueChange={setSelectedSubjectId}
            >
              <Picker.Item label={t('history.all_subjects')} value="all" />
              {subjects.map(subject => (
                <Picker.Item key={subject._id.toString()} label={subject.name} value={subject._id.toString()} />
              ))}
            </Picker>
            {chartData.length > 0 ? renderLineChart() : (
              <Text style={[styles.noDataText, { color: colors.textSecondary }]}>{t('history.no_sessions_found')}</Text>
            )}
          </>
        )}

        {activeTab === 'bar' && (
          subjectComparison.data.length > 0 ? renderBarChart() : (
            <Text style={[styles.noDataText, { color: colors.textSecondary }]}>{t('history.no_subject_data')}</Text>
          )
        )}

        {activeTab === 'calendar' && renderCalendar()}

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedDay ? new Date(selectedDay.date).toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : 'en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : ''}
              </Text>
              
              {selectedDay && (
                <>
                  <Text style={[styles.modalTotal, { color: colors.text }]}>
                    {t('history.total')}: {historyService.formatMinutes(selectedDay.minutes)} ({selectedDay.sessions} {t('history.sessions')})
                  </Text>
                  
                  {selectedDay.subjects.length > 0 && (
                    <View style={styles.modalSubjects}>
                      <Text style={[styles.modalSubjectsTitle, { color: colors.text }]}>{t('history.subjects_label')}</Text>
                      {selectedDay.subjects.map((subject, index) => (
                        <Text key={index} style={[styles.modalSubjectItem, { color: colors.textSecondary }]}>
                          • {subject.name}: {historyService.formatMinutes(subject.minutes)}
                        </Text>
                      ))}
                    </View>
                  )}
                </>
              )}
              
              <TouchableOpacity 
                style={[styles.modalCloseButton, { backgroundColor: colors.primary }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalCloseButtonText, { color: colors.surface }]}>{t('history.close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  streakContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    padding: 4,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTimeRangeButton: {
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTimeRangeText: {
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTabButton: {
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
  },
  picker: {
    width: '100%',
    marginBottom: 16,
  },
  chartContainer: {
    width: '100%',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  summary: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  calendarContainer: {
    width: '100%',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: Math.max(chartWidth, 800),
    paddingHorizontal: 8,
  },
  calendarDay: {
    width: 30,
    height: 30,
    margin: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 300,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalTotal: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalSubjects: {
    marginBottom: 20,
  },
  modalSubjectsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalSubjectItem: {
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 8,
  },
  modalCloseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    marginTop: 32,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HistoryScreen;
