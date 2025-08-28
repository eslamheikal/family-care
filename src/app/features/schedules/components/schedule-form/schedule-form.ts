import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScheduleService } from '../../../../core/services/schedule.service';
import { ClassSchedule } from '../../../../core/models/class-schedule.model';
import { ScheduleLookup } from '../../../../core/models/schedule-lookup.model';
import { CommonModule } from '@angular/common';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { LabelTimePicker } from '../../../shared/components/label-time-picker/label-time-picker';
import { LabelDatePicker } from '../../../shared/components/label-date-picker/label-date-picker';
import { DropdownProps } from '../../../shared/props/dropdown.props';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { ClassScheduleStatus } from '../../../../core/enums/class-schedule-status.enum';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { ColorPickerModule } from 'primeng/colorpicker';
import { WeekDaysService } from '../../../../core/services/week-days.service';
import { DialogButtons } from '../../../shared/components/dialog-buttons/dialog-buttons';
import { ConfirmService } from '../../../shared/services/confirm.serivce';

@Component({
  selector: 'schedule-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogButtons,
    TranslateModule,
    Dropdown,
    LabelTimePicker,
    LabelDatePicker,
    ColorPickerModule
  ],
  templateUrl: './schedule-form.html',
  styleUrl: './schedule-form.scss'
})
export class ScheduleForm {

  //#region Properties
  @Input() showDialog = false;
  @Input() schedule: ClassSchedule = {} as ClassSchedule;
  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  lookups: ScheduleLookup = {} as ScheduleLookup;
  scheduleForm!: FormGroup;
  destroy$ = new Subject<void>();

  //#region Services
  private scheduleService = inject(ScheduleService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  private cd = inject(ChangeDetectorRef);
  private weekDaysService = inject(WeekDaysService);
  private confirmService = inject(ConfirmService);
  //#endregion

  // Dropdown options
  dayOptions: DropdownProps[] = this.weekDaysService.getDayOptions();
  //#endregion

  //#region Methods

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.loadLookups();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showDialog'] && this.showDialog && !this.schedule.id) {
      this.scheduleForm?.reset();
      this.scheduleForm?.patchValue({} as ClassSchedule);
    }

    if (changes['schedule'] && this.schedule.id > 0) {
      this.cd.detectChanges();

      // Convert time strings to Date objects for the form controls
      const scheduleForForm = { ...this.schedule } as any;
      scheduleForForm.startTime = TimeHelper.toTimePicker(scheduleForForm.startTime);
      scheduleForForm.endTime = TimeHelper.toTimePicker(scheduleForForm.endTime);
      scheduleForForm.startDate = DateHelper.toDatePicker(scheduleForForm.startDate);
      scheduleForForm.endDate = DateHelper.toDatePicker(scheduleForForm.endDate);

      this.scheduleForm?.patchValue(scheduleForForm);
    }
  }

  initForm() {
    this.scheduleForm = this.fb.group({
      id: [0],
      roomId: [0, [Validators.required]],
      groupId: [0, [Validators.required]],
      day: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null],
      color: ['#f5f5f5']
    });
  }

  hasId() {
    return this.schedule.id > 0;
  }

  getFormControl(name: string) {
    return this.scheduleForm.get(name) as FormControl;
  }

  loadLookups() {
    this.loader.show();
    this.scheduleService.getLookups().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.lookups = res;
      this.loader.hide();
      // Trigger change detection after loading lookups
      this.cd.detectChanges();
    });
  }

  getDropdownOptions(name: string): DropdownProps[] {
    if (!this.lookups) {
      return [{ label: this.translate.instant('shared.dropdown.selectHere'), value: null }];
    }

    const data = this.lookups[name as keyof ScheduleLookup];
    if (!data) {
      return [{ label: this.translate.instant('shared.dropdown.selectHere'), value: null }];
    }

    const options = (data as any[]).map((item: any) => ({
      label: item.name || item.title || item.label,
      value: item.id || item.value
    }));

    // Add default option at the beginning
    return [
      { label: this.translate.instant('shared.dropdown.selectHere'), value: null },
      ...options
    ];
  }

  save() {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }

    const schedule = this.scheduleForm.value as ClassSchedule;
    schedule.id = 0;
    schedule.status = ClassScheduleStatus.New;
    schedule.startDate = DateHelper.toDateOnly(schedule.startDate);
    schedule.endDate = DateHelper.toDateOnly(schedule.endDate);

    // Convert Date objects to TimeOnly compatible format (HH:mm:ss)
    (schedule as any).startTime = TimeHelper.toTimeOnly(schedule.startTime);
    (schedule as any).endTime = TimeHelper.toTimeOnly(schedule.endTime);

    this.loader.show();

    this.scheduleService.create(schedule).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      
      if (res) {
        this.toaster.showSuccess(this.translate.instant('schedules.saveSuccess'));
        this.scheduleForm.reset();
        this.onSave.emit();
      }

    }, (err: any) => { }, () => this.loader.hide());

  }

  update() {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }

    const schedule = this.scheduleForm.value as ClassSchedule;
    schedule.startDate = DateHelper.toDateOnly(schedule.startDate);
    schedule.endDate = DateHelper.toDateOnly(schedule.endDate);

    // Convert Date objects to TimeOnly compatible format (HH:mm:ss)
    (schedule as any).startTime = TimeHelper.toTimeOnly(schedule.startTime);
    (schedule as any).endTime = TimeHelper.toTimeOnly(schedule.endTime);

    this.loader.show();
    this.scheduleService.update(schedule).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

      if (res) {
        this.toaster.showSuccess(this.translate.instant('schedules.updateSuccess'));
        this.scheduleForm.reset();
        this.onSave.emit();
      }

    }, (err: any) => { }, () => this.loader.hide());

  }

  cancel() {
    if (this.scheduleForm.dirty) {  
    this.confirmService.confirm(this.translate.instant('shared.dialogs.unsavedChanges'), () => {
      this.scheduleForm.reset();
        this.onCancel.emit();
      });
    } else {
      this.onCancel.emit();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
