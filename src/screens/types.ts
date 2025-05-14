import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackElements, SideBarDrawerElements } from "@/navigation/types";

export type HomeScreenProps = NativeStackScreenProps<HomeStackElements, "Main">;

export type SubjectsScreenProps = NativeStackScreenProps<SideBarDrawerElements, "Subjects">;

export type SchedulesScreenProps = NativeStackScreenProps<SideBarDrawerElements, "Schedules">;

export type HistoryScreenProps = NativeStackScreenProps<SideBarDrawerElements, "History">;
