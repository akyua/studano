import { useState, useEffect } from "react";
import { useRealm, useQuery } from "@/database/RealmContext";
import { Subject } from "@/models/Subject";
import { User } from "@/models/User";
import { BSON } from "realm";
import { SubjectRepository } from "@/repository/SubjectRepository";
import { UserPreferencesRepository } from "@/repository/UserPreferencesRepository";
import { DatabaseLogger } from "@/utils/databaseLogger";
import { useTranslation } from "react-i18next";

export function useSelectedSubject() {
  const { t } = useTranslation();
  const realm = useRealm();
  const subjects = useQuery(Subject);
  const users = useQuery(User);
  const subjectRepo = new SubjectRepository();
  const preferencesRepo = new UserPreferencesRepository();

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);

  const currentUser = users[0];

  useEffect(() => {
    if (currentUser && subjects.length > 0) {
      initializeSelectedSubject();
    }
  }, [currentUser, subjects, t]);

  const initializeSelectedSubject = async () => {
    try {
      DatabaseLogger.logHook("useSelectedSubject", "initialize");

      if (!currentUser) {
        DatabaseLogger.logHook("useSelectedSubject", "noUser");
        setIsLoading(false);
        return;
      }

      const lastSelectedSubjectId = preferencesRepo.getLastSelectedSubjectId(currentUser._id);
      DatabaseLogger.logHook("useSelectedSubject", "getStoredSubject", {
        subjectId: lastSelectedSubjectId?.toString(),
      });

      if (lastSelectedSubjectId && subjects.length > 0) {
        const subject = subjectRepo.getById(lastSelectedSubjectId);
        if (subject) {
          const result = {
            id: subject._id.toString(),
            name: subject.name,
          };

          DatabaseLogger.logHook("useSelectedSubject", "restoreSubject", undefined, result);
          setSelectedSubject(subject);
          setIsLoading(false);
          return;
        }
      }

      const defaultSubjectName = t('subjects.defaultSubjectName', 'Default');
      const generalSubject = subjectRepo.getByName(defaultSubjectName);
      if (generalSubject) {
        const result = {
          id: generalSubject._id.toString(),
          name: generalSubject.name,
        };

        DatabaseLogger.logHook("useSelectedSubject", "useGeneralSubject", undefined, result);
        setSelectedSubject(generalSubject);
        preferencesRepo.updateLastSelectedSubject(currentUser._id, generalSubject._id);
      } else if (subjects.length > 0) {
        const result = {
          id: subjects[0]._id.toString(),
          name: subjects[0].name,
        };

        DatabaseLogger.logHook("useSelectedSubject", "useFirstSubject", undefined, result);
        setSelectedSubject(subjects[0]);
        preferencesRepo.updateLastSelectedSubject(currentUser._id, subjects[0]._id);
      }

      setIsLoading(false);
    } catch (error) {
      DatabaseLogger.logHook("useSelectedSubject", "initialize", undefined, undefined, error);
      setIsLoading(false);
    }
  };

  const changeSelectedSubject = async (subject: Subject | null) => {
    try {
      const request = subject
        ? {
            id: subject._id.toString(),
            name: subject.name,
          }
        : "null";

      DatabaseLogger.logHook("useSelectedSubject", "changeSubject", request);

      setSelectedSubject(subject);
      setForceUpdate(prev => prev + 1);

      if (currentUser) {
        if (subject) {
          preferencesRepo.updateLastSelectedSubject(currentUser._id, subject._id);
          DatabaseLogger.logHook("useSelectedSubject", "saveSubject", {
            subjectId: subject._id.toString(),
          });
        } else {
          preferencesRepo.updateLastSelectedSubject(currentUser._id, undefined);
          DatabaseLogger.logHook("useSelectedSubject", "clearSubject");
        }
      }
    } catch (error) {
      DatabaseLogger.logHook("useSelectedSubject", "changeSubject", undefined, undefined, error);
    }
  };

  const createGeneralSubject = async () => {
    try {
      DatabaseLogger.logHook("useSelectedSubject", "createGeneralSubject");

      const defaultSubjectName = t('subjects.defaultSubjectName', 'Default');
      const generalSubject = subjectRepo.create(defaultSubjectName, "#007AFF");
      setSelectedSubject(generalSubject);

      if (currentUser) {
        preferencesRepo.updateLastSelectedSubject(currentUser._id, generalSubject._id);
      }

      const result = {
        id: generalSubject._id.toString(),
        name: generalSubject.name,
      };

      DatabaseLogger.logHook("useSelectedSubject", "createGeneralSubject", undefined, result);
      return generalSubject;
    } catch (error) {
      DatabaseLogger.logHook(
        "useSelectedSubject",
        "createGeneralSubject",
        undefined,
        undefined,
        error,
      );
      return null;
    }
  };

  return {
    selectedSubject,
    isLoading,
    changeSelectedSubject,
    createGeneralSubject,
    forceUpdate,
  };
}

