import { PomodoroSessionRepository } from "@/repository/PomodoroSessionRepository";
import { SubjectRepository } from "@/repository/SubjectRepository";
import { PomodoroSession } from "@/models/PomodoroSession";
import { Subject } from "@/models/Subject";
import { BSON } from "realm";

export interface DailyStats {
  date: string;
  totalMinutes: number;
  sessionsCount: number;
  subjects: {
    [subjectId: string]: {
      minutes: number;
      sessionsCount: number;
      subjectName: string;
    };
  };
}

export interface SubjectStats {
  subjectId: string;
  subjectName: string;
  totalMinutes: number;
  totalSessions: number;
  averageSessionLength: number;
  dailyStats: DailyStats[];
}

export interface OverallStats {
  totalMinutes: number;
  totalSessions: number;
  averageSessionLength: number;
  averageDailyMinutes: number;
  mostActiveDay: string;
  mostActiveSubject: string;
  studyStreak: number;
  dailyStats: DailyStats[];
  subjectStats: SubjectStats[];
}

export class HistoryService {
  private sessionRepo: PomodoroSessionRepository;
  private subjectRepo: SubjectRepository;

  constructor() {
    this.sessionRepo = new PomodoroSessionRepository();
    this.subjectRepo = new SubjectRepository();
  }

  getOverallStats(daysBack: number = 7): OverallStats {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const sessions = this.sessionRepo.getSessionsByDateRange(startDate, endDate);
    const subjects = this.subjectRepo.getAll();

    const dailyStats = this.aggregateDailyStats(Array.from(sessions), Array.from(subjects));
    const subjectStats = this.aggregateSubjectStats(Array.from(sessions), Array.from(subjects), startDate, endDate);

    const totalMinutes = Array.from(sessions).reduce((sum: number, session: PomodoroSession) => {
      const durationInSeconds = session.duration - session.remainingTime;
      const durationInMinutes = Math.round(durationInSeconds / 60);
      return sum + durationInMinutes;
    }, 0);

    const totalSessions = sessions.length;
    const averageSessionLength = totalSessions > 0 ? totalMinutes / totalSessions : 0;
    const averageDailyMinutes = dailyStats.length > 0 ? totalMinutes / dailyStats.length : 0;

    const mostActiveDay = this.findMostActiveDay(dailyStats);
    const mostActiveSubject = this.findMostActiveSubject(subjectStats);
    const studyStreak = this.calculateStudyStreak();

    return {
      totalMinutes,
      totalSessions,
      averageSessionLength,
      averageDailyMinutes,
      mostActiveDay,
      mostActiveSubject,
      studyStreak,
      dailyStats,
      subjectStats,
    };
  }

  getSubjectStats(subjectId: string, daysBack: number = 7): SubjectStats | null {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const subjectObjectId = new BSON.ObjectId(subjectId);
    const sessions = this.sessionRepo.getBySubject(subjectObjectId);
    const subject = this.subjectRepo.getById(subjectObjectId);

    if (!subject || sessions.length === 0) {
      return null;
    }

    const dailyStats = this.aggregateDailyStats(Array.from(sessions), [subject]);
    const totalMinutes = Array.from(sessions).reduce((sum: number, session: PomodoroSession) => {
      const durationInSeconds = session.duration - session.remainingTime;
      const durationInMinutes = Math.round(durationInSeconds / 60);
      return sum + durationInMinutes;
    }, 0);

    const totalSessions = sessions.length;
    const averageSessionLength = totalSessions > 0 ? totalMinutes / totalSessions : 0;

    return {
      subjectId,
      subjectName: subject.name,
      totalMinutes,
      totalSessions,
      averageSessionLength,
      dailyStats,
    };
  }

  private aggregateDailyStats(sessions: PomodoroSession[], subjects: Subject[]): DailyStats[] {
    const dailyMap = new Map<string, DailyStats>();

    sessions.forEach(session => {
      const sessionDate = new Date(session.startTime);
      const dateKey = sessionDate.toISOString().split('T')[0];
      
      const durationInSeconds = session.duration - session.remainingTime;
      const durationInMinutes = Math.round(durationInSeconds / 60);
      let subject: Subject | null = null;
      if (session.subjectId) {
        subject = subjects.find(s =>
          s._id instanceof BSON.ObjectId && session.subjectId instanceof BSON.ObjectId
            ? s._id.equals(session.subjectId)
            : s._id.toString() === session.subjectId.toString()
        ) || null;
      }
      
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          date: dateKey,
          totalMinutes: 0,
          sessionsCount: 0,
          subjects: {},
        });
      }

      const dayStats = dailyMap.get(dateKey)!;
      dayStats.totalMinutes += durationInMinutes;
      dayStats.sessionsCount += 1;

      if (subject && session.subjectId) {
        const subjectId = subject._id.toString();
        if (!dayStats.subjects[subjectId]) {
          dayStats.subjects[subjectId] = {
            minutes: 0,
            sessionsCount: 0,
            subjectName: subject.name,
          };
        }
        dayStats.subjects[subjectId].minutes += durationInMinutes;
        dayStats.subjects[subjectId].sessionsCount += 1;
      }
    });

    return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  private aggregateSubjectStats(sessions: PomodoroSession[], subjects: Subject[], startDate: Date, endDate: Date): SubjectStats[] {
    const subjectMap = new Map<string, SubjectStats>();

    subjects.forEach(subject => {
      const subjectSessions = sessions.filter(session => {
        return session.subjectId && subject._id &&
          (session.subjectId instanceof BSON.ObjectId && subject._id instanceof BSON.ObjectId
            ? session.subjectId.equals(subject._id)
            : session.subjectId.toString() === subject._id.toString()
          );
      });
      
      if (subjectSessions.length > 0) {
        const totalMinutes = subjectSessions.reduce((sum: number, session: PomodoroSession) => {
          const durationInSeconds = session.duration - session.remainingTime;
          const durationInMinutes = Math.round(durationInSeconds / 60);
          return sum + durationInMinutes;
        }, 0);

        const totalSessions = subjectSessions.length;
        const averageSessionLength = totalSessions > 0 ? totalMinutes / totalSessions : 0;

        subjectMap.set(subject._id.toString(), {
          subjectId: subject._id.toString(),
          subjectName: subject.name,
          totalMinutes,
          totalSessions,
          averageSessionLength,
          dailyStats: this.aggregateDailyStats(subjectSessions, [subject]),
        });
      }
    });

    return Array.from(subjectMap.values()).sort((a, b) => b.totalMinutes - a.totalMinutes);
  }

  private findMostActiveDay(dailyStats: DailyStats[]): string {
    if (dailyStats.length === 0) return 'None';
    
    const mostActive = dailyStats.reduce((max, day) => 
      day.totalMinutes > max.totalMinutes ? day : max
    );
    
    return mostActive.date;
  }

  private findMostActiveSubject(subjectStats: SubjectStats[]): string {
    if (subjectStats.length === 0) return 'None';
    
    const mostActive = subjectStats.reduce((max, subject) => 
      subject.totalMinutes > max.totalMinutes ? subject : max
    );
    
    return mostActive.subjectName;
  }

  formatMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  }

  formatDate(dateString: string, locale: string = 'en'): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getSubjectComparisonData(daysBack: number = 7): { labels: string[], data: number[] } {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const sessions = this.sessionRepo.getSessionsByDateRange(startDate, endDate);
    const subjects = Array.from(this.subjectRepo.getAll());

    const subjectMinutes: { [key: string]: number } = {};

    subjects.forEach(subject => {
      const subjectSessions = Array.from(sessions).filter(session => 
        session.subjectId && session.subjectId.equals(subject._id)
      );
      
      const totalMinutes = subjectSessions.reduce((sum: number, session: PomodoroSession) => {
        const durationInSeconds = session.duration - session.remainingTime;
        const durationInMinutes = Math.round(durationInSeconds / 60);
        return sum + durationInMinutes;
      }, 0);

      if (totalMinutes > 0) {
        subjectMinutes[subject.name] = totalMinutes;
      }
    });

    const labels = Object.keys(subjectMinutes);
    const data = Object.values(subjectMinutes);

    return { labels, data };
  }

  getCalendarData(daysBack: number = 30): { date: string; minutes: number; sessions: number; subjects: { [subjectId: string]: { minutes: number; sessionsCount: number; subjectName: string } } }[] {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const sessions = this.sessionRepo.getSessionsByDateRange(startDate, endDate);
    const subjects = Array.from(this.subjectRepo.getAll());
    const dailyMap = new Map<string, { minutes: number; sessions: number; subjects: { [subjectId: string]: { minutes: number; sessionsCount: number; subjectName: string } } }>();

    for (let i = 0; i <= daysBack; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateKey = currentDate.toISOString().split('T')[0];
      dailyMap.set(dateKey, { minutes: 0, sessions: 0, subjects: {} });
    }

    Array.from(sessions).forEach(session => {
      const sessionDate = new Date(session.startTime);
      const dateKey = sessionDate.toISOString().split('T')[0];
      
      if (dailyMap.has(dateKey)) {
        const dayData = dailyMap.get(dateKey)!;
        const durationInSeconds = session.duration - session.remainingTime;
        const durationInMinutes = Math.round(durationInSeconds / 60);
        dayData.minutes += durationInMinutes;
        dayData.sessions += 1;

        if (session.subjectId) {
          const subject = subjects.find(s => s._id.equals(session.subjectId!));
          if (subject) {
            const subjectId = subject._id.toString();
            if (!dayData.subjects[subjectId]) {
              dayData.subjects[subjectId] = {
                minutes: 0,
                sessionsCount: 0,
                subjectName: subject.name,
              };
            }
            dayData.subjects[subjectId].minutes += durationInMinutes;
            dayData.subjects[subjectId].sessionsCount += 1;
          }
        }
      }
    });

    return Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      minutes: data.minutes,
      sessions: data.sessions,
      subjects: data.subjects
    }));
  }

  private calculateStudyStreak(): number {
    const today = new Date();
    let currentDate = new Date(today);
    let streak = 0;

    while (true) {
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);

      const daySessions = this.sessionRepo.getSessionsByDateRange(startOfDay, endOfDay);
      
      if (daySessions.length === 0) {
        break;
      }

      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }
} 