import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  ViewChild,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Modules
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

// Core Models
import { Family } from '../../../../core/models/family.model';
import { UserAttachment } from '../../../../core/models/user-attachment.model';

// Core Services
import { FamilyService } from '../../../../core/services/family.service';
import { AuthService } from '../../../../core/authorization/auth.service';

// Core Helpers
import { DateHelper } from '../../../../core/helpers/date.helper';

// Core Enums
import { GenderEnum, GenderService } from '../../../../core/enums/gender.enum';

// Shared Components
import { EditIconButton } from "../../../shared/buttons/edit-icon-button/edit-icon-button";
import { NoData } from "../../../shared/components/no-data/no-data";
import { PersonalHeader } from "../../../shared/profile/personal-header/personal-header";
import { PersonalTab, PersonalTabs } from '../../../shared/profile/personal-tabs/personal-tabs';
import { Table } from "../../../shared/components/table/table";

// Shared Services
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';

// Shared Props
import { ProfileHeader } from '../../../shared/props/profile.props';
import { TableColumn } from '../../../shared/props/table-column.props';

// Feature Components
import { FamilyForm } from '../family-form/family-form';
import { FamilyRelation, FamilyRelationService } from '../../../../core/enums/family.relation.enum';
import { FamilyMember } from '../../../../core/models/family-member.model';
import { FamilyVisits } from '../../../../core/models/family-visits.model';
import { PermissionService } from '../../../../core/authorization/permission.service';

// Interfaces
interface FamilyProfileState {
  showEditInfoDialog: boolean;
  showUserAttachmentDialog: boolean;
  disablePage: boolean;
  activeTab: string;
}

@Component({
  selector: 'app-family-profile',
  imports: [
    TabsModule,
    TooltipModule,
    FamilyForm,
    CommonModule,
    TableModule,
    TranslateModule,
    RouterModule,
    CardModule,
    EditIconButton,
    NoData,
    PersonalHeader,
    PersonalTabs,
    Table,
  ],
  templateUrl: './family-profile.html',
  styleUrl: './family-profile.scss'
})
export class FamilyProfile implements OnInit, OnDestroy {

  //#region ViewChild
  @ViewChild('fileInput') fileInput!: ElementRef;
  //#endregion

  //#region Properties
  private readonly destroy$ = new Subject<void>();

  // State management
  private readonly state: FamilyProfileState = {
    showEditInfoDialog: false,
    showUserAttachmentDialog: false,
    disablePage: false,
    activeTab: 'families.formTitle'
  };

  // Data management
  public family: Family = {} as Family;
  public visits: FamilyVisits[] = [];
  public profileHeader: ProfileHeader = {} as ProfileHeader;

  //#region Services
  private readonly familyService = inject(FamilyService);
  private readonly loader = inject(LoaderService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toaster = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly confirmService = inject(ConfirmService);
  private readonly familyRelationService = inject(FamilyRelationService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly genderService = inject(GenderService);
  public readonly permissionService = inject(PermissionService);
  //#endregion

  // Tab configuration
  readonly tabs: PersonalTab[] = [
    { label: 'families.formTitle', icon: 'fas fa-house-user' },
    { label: 'families.familyMembers', icon: 'fas fa-users' },
    { label: 'shared.tabs.comingVisits', icon: 'fas fa-calendar-alt' },
  ];

  // Table configuration
  readonly membersColumns: TableColumn[] = [
    { field: 'name', title: 'shared.labels.name', type: 'text', onClick: (row: FamilyMember) => this.onMemberClick(row) },
    { field: 'relationName', title: 'shared.labels.familyRelations', type: 'text' },
    { field: 'birthDate', title: 'shared.labels.birthDate', type: 'date' },
    { field: 'age', title: 'shared.labels.age', type: 'number' },
    { field: 'phoneNumber', title: 'shared.labels.phoneNumber', type: 'text' },
    { field: 'email', title: 'shared.labels.email', type: 'text' },
  ];

  readonly visitsColumns: TableColumn[] = [
    { field: 'memberName', title: 'shared.labels.name', type: 'text' },
    { field: 'date', title: 'shared.labels.date', type: 'date' },
    { field: 'time', title: 'shared.labels.time', type: 'text' },
    { field: 'typeLabel', title: 'shared.labels.visitType', type: 'text' },
    { field: 'statusLabel', title: 'shared.labels.visitStatus', type: 'text' },
    { field: 'location', title: 'shared.labels.location', type: 'text' },
    { field: 'cost', title: 'shared.labels.cost', type: 'number' },
  ];
  //#endregion

  //#region Getters
  get showEditInfoDialog(): boolean {
    return this.state.showEditInfoDialog;
  }

  get showUserAttachmentDialog(): boolean {
    return this.state.showUserAttachmentDialog;
  }

  get disablePage(): boolean {
    return this.state.disablePage;
  }

  get activeTab(): string {
    return this.state.activeTab;
  }

  //#endregion

  //#region Lifecycle Methods
  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

  //#region Initialization Methods
  private initializeComponent(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const familyId = Number(params['id']);
        this.loadFamily(familyId);
      });
  }

  private loadFamily(familyId: number): void {
    this.showLoader();

    this.familyService.get(familyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (family: Family) => this.handleFamilyLoaded(family),
        error: () => { },
        complete: () => this.hideLoader()
      });
  }

  private handleFamilyLoaded(family: Family): void {

    this.family = { ...family };
    this.family.familyResponsible.relationName = this.getRelation(this.family.familyResponsible.relation);
    this.family.familyMembers.forEach(member => {
      member.relationName = this.getRelation(member.relation);
      member.age = this.getAge(member.birthDate);
    });
    this.family.familyMembers = this.family.familyMembers.sort((a, b) => a.relation - b.relation);

    this.updateProfileHeader(family);

    if (family.id === 0) {
      this.toaster.showError(this.translate.instant('families.notFound'));
      this.state.disablePage = true;
    }

    this.cdr.detectChanges();
  }

  private updateProfileHeader(family: Family): void {
    this.profileHeader = {
      fullName: family.familyName,
      code: family.code as string,
      image: 'assets/icons/avatar-student.svg',
      dateOfBirth: null
    };
  }

  private showLoader(): void {
    this.loader.show();
  }

  private hideLoader(): void {
    this.loader.hide();
    this.state.showEditInfoDialog = false;
    this.state.showUserAttachmentDialog = false;
  }
  //#endregion

  //#region Tab Management
  onActiveTabChange(tab: string): void {
    this.state.activeTab = tab;
  }

  onMemberClick(member: FamilyMember): void {
    this.confirmService.confirmView(() => {
      // this.router.navigate(['/families', member.id]);
    });
  }
  //#endregion

  //#region Dialog Management
  onCloseEditDialog(): void {
    this.state.showEditInfoDialog = false;
  }

  onCloseAttachmentDialog(): void {
    this.state.showUserAttachmentDialog = false;
  }

  reloadFamily(): void {
    this.loadFamily(this.family.id);
  }
  //#endregion

  //#region Family Info Methods

  getAge(birthDate: string | null): number {
    return birthDate ? DateHelper.getAge(birthDate) : 0;
  }

  getDate(date: string): string {
    return DateHelper.displayDate(date) || '';
  }

  getGender(gender: GenderEnum): string {
    return this.genderService.getGender(gender);
  }

  getRelation(relation: FamilyRelation): string {
    return this.familyRelationService.getRelation(relation);
  }

  onEditFamily(): void {
    this.confirmService.confirmEdit(() => {
      this.family = { ...this.family };
      this.state.showEditInfoDialog = true;
    });
  }
  //#endregion

}
