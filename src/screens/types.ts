import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackElements, SideBarDrawerElements } from "@/navigation/types";

export type HomeScreenProps = NativeStackScreenProps<HomeStackElements, "Main">;

export type SubjectsScreenProps = NativeStackScreenProps<SideBarDrawerElements, "Subjects">;
