import { Routes } from "@angular/router";
import { StudentsList } from "./components/students-list/students-list";
import { StudentProfile } from "./components/student-profile/student-profile";
import { TitleResolver } from "../../core/resolvers/title.resolver";

export const STUDENTS_ROUTES: Routes = [
  {
    path: '',
    component: StudentsList,
    resolve: { title: TitleResolver },
    data: {
      subtitle: 'students.all'
    }
  },
  {
    path: ':id',
    component: StudentProfile,
    resolve: { title: TitleResolver },
    data: {
      subtitle: 'students.formTitle'
    }
  }
];