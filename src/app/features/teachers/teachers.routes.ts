import { Routes } from "@angular/router";
import { TeachersList } from "./components/teachers-list/teachers-list";
import { TeacherProfile } from "./components/teacher-profile/teacher-profile";
import { TitleResolver } from "../../core/resolvers/title.resolver";

export const TEACHERS_ROUTES: Routes = [
  {
    path: '',
    component: TeachersList,
    resolve: { title: TitleResolver },
    data: {
      subtitle: 'teachers.all'
    }
  },
  {
    path: ':id',
    component: TeacherProfile,
    resolve: { title: TitleResolver },
    data: {
      subtitle: 'teachers.formTitle'
    }
  }
];