import { useRealm } from "@/database/RealmContext";
import { PomodoroSessionRepository, SubjectRepository } from "@/repository";

export function useRepositories() {
  const realm = useRealm();

  return {
    pomodoroSessionRepository: new PomodoroSessionRepository(realm),
    subjectRepository: new SubjectRepository(realm),
  };
}
