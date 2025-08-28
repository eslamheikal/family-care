import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LoaderService } from '../../../shared/services/loader.service';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { LabelDatePicker } from '../../../shared/components/label-date-picker/label-date-picker';
import { LabelTimePicker } from '../../../shared/components/label-time-picker/label-time-picker';
import { DropdownProps, getDropdownOptions } from '../../../shared/props/dropdown.props';
import { SessionSearchCriteria } from '../../../../core/models/session-search-criteria.model';
import { SessionService } from '../../../../core/services/session.service';
import { DialogButtons } from '../../../shared/components/dialog-buttons/dialog-buttons';
import { ToastService } from '../../../shared/services/toast.service';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { StatusService } from '../../../../core/services/status.service';

@Component({
  selector: 'session-search-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogButtons,
    Dropdown,
    LabelDatePicker,
    LabelTimePicker,
  ],
  templateUrl: './session-search-dialog.html',
  styleUrl: './session-search-dialog.scss'
})
export class SessionSearchDialog implements OnInit {

  @Input() showDialog = false;
  @Input() currentCriteria: SessionSearchCriteria = {};
  @Output() onSearch = new EventEmitter<SessionSearchCriteria>();
  @Output() onCancel = new EventEmitter<void>();

  searchForm!: FormGroup;
  destroy$ = new Subject<void>();


  // Services
  private fb = inject(FormBuilder);
  private loader = inject(LoaderService);
  private sessionService = inject(SessionService);
  private translateService = inject(TranslateService);
  private toaster = inject(ToastService);
  private statusService = inject(StatusService);

  // Dropdown options
  coursesOptions: DropdownProps[] = [];
  groupsOptions: DropdownProps[] = [];
  roomsOptions: DropdownProps[] = [];
  statusOptions: DropdownProps[] = this.statusService.getSessionStatusOptions();

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.loadLookups();
  }

  ngOnChanges() {
    if (this.showDialog && this.currentCriteria) {
      this.populateFormWithCriteria();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.searchForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      courseId: [''],
      groupId: [''],
      roomId: [''],
      startTime: [''],
      endTime: [''],
      status: ['']
    });
  }

  loadLookups() {
    this.loader.show();

    this.sessionService.getLookups().pipe(takeUntil(this.destroy$)).subscribe(lookups => {
      this.coursesOptions = getDropdownOptions(lookups.courses);
      this.groupsOptions = getDropdownOptions(lookups.groups);
      this.roomsOptions = getDropdownOptions(lookups.rooms);
    }, () => { }, () => this.loader.hide());

  }

  getFormControl(name: string): FormControl {
    return this.searchForm.get(name) as FormControl;
  }

  performSearch() {

    // check at least one field is filled
    const searchCriteria = this.searchForm.value;
    const isEmpty = Object.values(searchCriteria).every(value => value === '' || value === null || value === undefined);
    if (isEmpty) {
      this.toaster.showError(this.translateService.instant('sessions.search.atLeastOneFieldRequired'));
      return;
    }

    if (this.searchForm.valid) {
      const searchCriteria: SessionSearchCriteria = this.searchForm.value;

      // Remove empty values
      Object.keys(searchCriteria).forEach(key => {
        if (searchCriteria[key as keyof SessionSearchCriteria] === '' ||
          searchCriteria[key as keyof SessionSearchCriteria] === null ||
          searchCriteria[key as keyof SessionSearchCriteria] === undefined) {
          delete searchCriteria[key as keyof SessionSearchCriteria];
        }
      });

      searchCriteria.startDate = DateHelper.toDateOnly(searchCriteria.startDate);
      searchCriteria.endDate = DateHelper.toDateOnly(searchCriteria.endDate);
      searchCriteria.startTime = TimeHelper.toTimeOnly(searchCriteria.startTime);
      searchCriteria.endTime = TimeHelper.toTimeOnly(searchCriteria.endTime);

      searchCriteria.courseName = this.coursesOptions.find(c => c.value === searchCriteria.courseId)?.label;
      searchCriteria.groupName = this.groupsOptions.find(g => g.value === searchCriteria.groupId)?.label;
      searchCriteria.roomName = this.roomsOptions.find(r => r.value === searchCriteria.roomId)?.label;
      searchCriteria.statusName = this.statusService.getSessionStatusName(searchCriteria.status!);

      this.onSearch.emit(searchCriteria);
    }
  }

  clearSearch() {
    this.searchForm.reset();
  }

  populateFormWithCriteria() {
    if (this.currentCriteria) {

      const currentCriteria = { ...this.currentCriteria } as any;
      currentCriteria.startDate = DateHelper.toDatePicker(currentCriteria.startDate);
      currentCriteria.endDate = DateHelper.toDatePicker(currentCriteria.endDate);

      currentCriteria.startTime = TimeHelper.toTimePicker(currentCriteria.startTime);
      currentCriteria.endTime = TimeHelper.toTimePicker(currentCriteria.endTime);

      this.searchForm.patchValue(currentCriteria);

      this.searchForm.updateValueAndValidity();
    }
  }

  cancel() {
    this.onCancel.emit();
    this.showDialog = false;
  }
} 