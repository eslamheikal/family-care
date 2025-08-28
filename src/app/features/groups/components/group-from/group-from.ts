import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputLabel } from '../../../shared/components/input-label/input-label';
import { Group } from '../../../../core/models/group.model';
import { Subject, takeUntil } from 'rxjs';
import { GroupService } from '../../../../core/services/group.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CourseService } from '../../../../core/services/course.service';
import { TeacherService } from '../../../../core/services/teacher.service';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { DropdownProps, getDropdownOptions } from '../../../shared/props/dropdown.props';
import { DialogButtons } from '../../../shared/components/dialog-buttons/dialog-buttons';

@Component({
  selector: 'app-group-from',
  imports: [
    CommonModule, 
    DialogModule, 
    InputTextModule, 
    ReactiveFormsModule, 
    InputLabel, 
    TranslateModule, 
    Dropdown,
    DialogButtons
  ],
  templateUrl: './group-from.html',
  styleUrl: './group-from.scss'
})
export class GroupFromComponent {

  //#region Properties
  @Input() showDialog = false;
  @Input() group: Group = {} as Group;
  groupForm!: FormGroup;
  destroy$ = new Subject<void>();

  coursesOptions: DropdownProps[] = [];
  teachersOptions: DropdownProps[] = [];

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  //#endregion

  //#region Services
  private groupService = inject(GroupService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  private courseService = inject(CourseService);
  private teacherService = inject(TeacherService);
  //#endregion

  //#region Methods

  constructor(){
    this.initForm();
  }

  ngOnInit() {
    this.loadCourses();
    this.setupCourseChangeListener();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['showDialog'] && !this.group.id) {
      this.groupForm?.reset();
    }

    if (changes['group'] && this.group.id > 0) {
      this.groupForm?.patchValue(this.group);
      // Load teachers for the existing course when editing
      if (this.group.courseId) {
        this.loadTeachersByCourse(this.group.courseId);
      }
    }
  }

  initForm() {
    this.groupForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(2)]],
      courseId: ['', [Validators.required]],
      teacherId: ['', [Validators.required]],
      capacity: [0],
    });
  }

  hasId() {
    return this.groupForm.get('id')?.value;
  }

  getFormControl(name: string) {
    return this.groupForm.get(name) as FormControl;
  }

  loadCourses() {
    this.loader.show();
    this.courseService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(courses => {
        this.coursesOptions = getDropdownOptions(courses);
      }, _ => { }, () => this.loader.hide());
  }

  setupCourseChangeListener() {
    this.groupForm.get('courseId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(courseId => {
        if (courseId) {
          this.loadTeachersByCourse(courseId);
        } else {
          this.teachersOptions = [];
        }
        // Reset teacher selection when course changes
        this.groupForm.get('teacherId')?.setValue('');
      });
  }

  loadTeachersByCourse(courseId: number) {
    this.loader.show();
    this.teacherService.getTeachersByCourseId(courseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(teachers => {

        this.teachersOptions = getDropdownOptions(teachers);
        this.groupForm.get('teacherId')?.setValue(this.group.teacherId);

      }, _ => { }, () => this.loader.hide());
  }

  save() {
    if (this.groupForm.valid) {
      this.loader.show();

      const GroupData = this.groupForm.value as Group;
      GroupData.id = 0;
      GroupData.capacity = Number(GroupData.capacity) ?? 0;

      this.groupService.add(GroupData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.onSave.emit();
            this.groupForm.reset();
            this.toaster.showSuccess(this.translate.instant('groups.saveSuccess'));
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  update() {
    if (this.groupForm.valid) {
      this.loader.show();

      const GroupData = this.groupForm.value as Group;
      GroupData.numberOfStudents = Number(GroupData.numberOfStudents) ?? 0;

      this.groupService.update(GroupData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.groupForm.reset();
            this.onSave.emit();
            this.toaster.showSuccess(this.translate.instant('groups.updateSuccess'));
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  cancel() {
    this.groupForm.reset();
    this.onCancel.emit();
  }

  onAdd() {
    this.groupForm.reset();
    this.groupForm.get('id')?.setValue(0);
    this.showDialog = true;
  }

  onEdit(event: Group) {
    this.groupForm.patchValue(event);
    this.showDialog = true;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

}
