import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LineChart, BarChart } from "react-native-chart-kit";
import { useTranslation } from "react-i18next";
import { HistoryScreenProps } from "./types";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderComponent from '@/components/HeaderComponent';
import { HistoryService } from '@/services/historyService';
import { Subject } from '@/models/Subject';
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
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('7');
  const [activeTab, setActiveTab] = useState<'line' | 'bar' | 'calendar'>('line');
  const [selectedDay, setSelectedDay] = useState<DayDetail | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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
                color: () => `rgba(0, 0, 0, 1)`,
                strokeWidth: 2,
              },
            ],
          }}
          width={chartWidth}
          height={chartHeight}
          yAxisSuffix="m"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "4", strokeWidth: "2", stroke: "#000000" },
          }}
          bezier
          style={styles.chart}
        />
      </ScrollView>
      <Text style={styles.summary}>
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
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          style={styles.chart}
        />
      </ScrollView>
      <Text style={styles.summary}>
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
                { backgroundColor: day.minutes > 0 ? '#000000' : '#f0f0f0' }
              ]}
              onPress={() => handleDayPress(day)}
            >
              <Text style={[
                styles.calendarDayText,
                { color: day.minutes > 0 ? '#ffffff' : '#333333' }
              ]}>
                {new Date(day.date).getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Text style={styles.summary}>
        {t('history.study_calendar')} {timeRange} {t('history.days')}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <HeaderComponent />
      <View style={styles.container}>
        <Text style={styles.title}>{t('history.pomodoro_time_per_day')}</Text>
        
        <View style={styles.streakContainer}>
          <Text style={styles.streakText}>
            🔥 {overallStats.studyStreak} {overallStats.studyStreak === 1 ? t('history.study_streak_text') : t('history.study_streak_text_plural')}
          </Text>
        </View>

        <View style={styles.timeRangeContainer}>
          <TouchableOpacity 
            style={[styles.timeRangeButton, timeRange === '7' && styles.activeTimeRangeButton]} 
            onPress={() => setTimeRange('7')}
          >
            <Text style={[styles.timeRangeText, timeRange === '7' && styles.activeTimeRangeText]}>7D</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.timeRangeButton, timeRange === '14' && styles.activeTimeRangeButton]} 
            onPress={() => setTimeRange('14')}
          >
            <Text style={[styles.timeRangeText, timeRange === '14' && styles.activeTimeRangeText]}>14D</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.timeRangeButton, timeRange === '30' && styles.activeTimeRangeButton]} 
            onPress={() => setTimeRange('30')}
          >
            <Text style={[styles.timeRangeText, timeRange === '30' && styles.activeTimeRangeText]}>30D</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'line' && styles.activeTabButton]} 
            onPress={() => setActiveTab('line')}
          >
            <Text style={[styles.tabText, activeTab === 'line' && styles.activeTabText]}>{t('history.timeline')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'bar' && styles.activeTabButton]} 
            onPress={() => setActiveTab('bar')}
          >
            <Text style={[styles.tabText, activeTab === 'bar' && styles.activeTabText]}>{t('history.subjects')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'calendar' && styles.activeTabButton]} 
            onPress={() => setActiveTab('calendar')}
          >
            <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>{t('history.calendar')}</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'line' && (
          <>
            <Picker
              selectedValue={selectedSubjectId}
              style={styles.picker}
              onValueChange={setSelectedSubjectId}
            >
              <Picker.Item label={t('history.all_subjects')} value="all" />
              {subjects.map(subject => (
                <Picker.Item key={subject._id.toString()} label={subject.name} value={subject._id.toString()} />
              ))}
            </Picker>
            {chartData.length > 0 ? renderLineChart() : (
              <Text style={styles.noDataText}>{t('history.no_sessions_found')}</Text>
            )}
          </>
        )}

        {activeTab === 'bar' && (
          subjectComparison.data.length > 0 ? renderBarChart() : (
            <Text style={styles.noDataText}>{t('history.no_subject_data')}</Text>
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
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedDay ? new Date(selectedDay.date).toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : 'en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : ''}
              </Text>
              
              {selectedDay && (
                <>
                  <Text style={styles.modalTotal}>
                    {t('history.total')}: {historyService.formatMinutes(selectedDay.minutes)} ({selectedDay.sessions} {t('history.sessions')})
                  </Text>
                  
                  {selectedDay.subjects.length > 0 && (
                    <View style={styles.modalSubjects}>
                      <Text style={styles.modalSubjectsTitle}>{t('history.subjects_label')}</Text>
                      {selectedDay.subjects.map((subject, index) => (
                        <Text key={index} style={styles.modalSubjectItem}>
                          • {subject.name}: {historyService.formatMinutes(subject.minutes)}
                        </Text>
                      ))}
                    </View>
                  )}
                </>
              )}
              
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>{t('history.close')}</Text>
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
    color: "black",
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  streakContainer: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#000000',
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  activeTimeRangeText: {
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#000000',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  activeTabText: {
    color: 'white',
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
    color: 'black',
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
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 300,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalTotal: {
    fontSize: 16,
    color: 'black',
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
    color: 'black',
    marginBottom: 8,
  },
  modalSubjectItem: {
    fontSize: 14,
    color: 'black',
    marginBottom: 4,
    paddingLeft: 8,
  },
  modalCloseButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    marginTop: 32,
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});

export default HistoryScreen;
