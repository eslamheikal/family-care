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
import { User } from '../../../../core/models/user.model';

// Core Services
import { AuthService } from '../../../../core/authorization/auth.service';
import { UserService } from '../../../../core/services/user.service';

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
import { Visits } from '../../../../core/models/visits.model';
import { PermissionService } from '../../../../core/authorization/permission.service';
import { UserForm } from '../user-form/user-form';
import { Relation, RelationService } from '../../../../core/enums/relation.enum';

// Interfaces
interface UserProfileState {
  showEditInfoDialog: boolean;
  showUserAttachmentDialog: boolean;
  disablePage: boolean;
  activeTab: string;
}

@Component({
  selector: 'app-user-profile',
  imports: [
    TabsModule,
    TooltipModule,
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
    UserForm,
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfile implements OnInit, OnDestroy {

  //#region ViewChild
  @ViewChild('fileInput') fileInput!: ElementRef;
  //#endregion

  //#region Properties
  private readonly destroy$ = new Subject<void>();

  // State management
  private readonly state: UserProfileState = {
    showEditInfoDialog: false,
    showUserAttachmentDialog: false,
    disablePage: false,
    activeTab: 'users.formTitle'
  };

  // Data management
  public user: User = {} as User;
  public visits: Visits[] = [];
  public profileHeader: ProfileHeader = {} as ProfileHeader;

  //#region Services
  private readonly userService = inject(UserService);
  private readonly loader = inject(LoaderService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toaster = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly confirmService = inject(ConfirmService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly genderService = inject(GenderService);
  private readonly relationService = inject(RelationService);
  public readonly permissionService = inject(PermissionService);
  //#endregion

  // Tab configuration
  readonly tabs: PersonalTab[] = [
    { label: 'users.formTitle', icon: 'fas fa-user' },
    { label: 'shared.tabs.comingVisits', icon: 'fas fa-calendar-alt' },
    { label: 'shared.tabs.attachments', icon: 'fas fa-paperclip' },
  ];

  // Table configuration
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
        const userId = Number(params['id']);
        this.loadUser(userId);
      });
  }

  private loadUser(userId: number): void {
    this.showLoader();

    this.userService.get(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: User) => this.handleUserLoaded(user),
        error: () => { },
        complete: () => this.hideLoader()
      });
  }

  private handleUserLoaded(user: User): void {
    this.user = { ...user };
    this.user.age = this.getAge(this.user.birthDate || null);

    this.updateProfileHeader(user);

    if (user.id === 0) {
      this.toaster.showError(this.translate.instant('users.notFound'));
      this.state.disablePage = true;
    }

    this.cdr.detectChanges();
  }

  private updateProfileHeader(user: User): void {
    this.profileHeader = {
      fullName: user.name,
      code: this.getRelation(user.relation!) || '',
      image: 'assets/icons/avatar-student.svg',
      dateOfBirth: user.birthDate || null
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
  //#endregion

  //#region Dialog Management
  onCloseEditDialog(): void {
    this.state.showEditInfoDialog = false;
  }

  onCloseAttachmentDialog(): void {
    this.state.showUserAttachmentDialog = false;
  }

  reloadUser(): void {
    this.loadUser(this.user.id);
  }
  //#endregion

  //#region User Info Methods
  getAge(birthDate: string | null): number {
    return birthDate ? DateHelper.getAge(birthDate) : 0;
  }

  getDate(date: string): string {
    return DateHelper.displayDate(date) || '';
  }

  getGender(gender: GenderEnum): string {
    return this.genderService.getGender(gender);
  }

  getRelation(relation: Relation): string {
    return this.relationService.getRelation(relation);
  }

  onEditUser(): void {
    this.confirmService.confirmEdit(() => {
      this.user = { ...this.user };
      this.state.showEditInfoDialog = true;
    });
  }
  //#endregion

}
