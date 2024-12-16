/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ManageAssistants.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import PeopleSearch from '@hedtech/powercampus-design-system/react/components/PeopleSearch';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import EmailModal from '../../Generic/EmailModal';
import ManageAssistantsTable, { IManageAssistantsTableResProps } from './ManageAssistantsTable';

// Types
import { EmailProviderOption } from '../../../Types/Enum/EmailProviderOption';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IConfirmationDialogResources } from '../../../Types/Resources/Generic/IConfirmationDialogResources';
import { IEmailSettings } from '../../../Types/InstitutionSettings/IEmailSettings';
import { IFacultyAssistant, IFacultyAssistantDetail } from '../../../Types/FacultyAssistants/IFacultyAssistant';
import { IFacultyAssistants } from '../../../Types/FacultyAssistants/IFacultyAssistants';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IManageAssistantsResources } from '../../../Types/Resources/Classes/IManageAssistantsResources';
import { IPeopleSearchModalResources } from '@hedtech/powercampus-design-system/types/PeopleSearch/IPeopleSearchResources';
import { IPeopleSearchModel } from '@hedtech/powercampus-design-system/types/PeopleSearch/IPeopleSearchModel';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Classes/ManageAssistants';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import PeopleSearchActions from '@hedtech/powercampus-design-system/flux/actions/PeopleSearchActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import PeopleSearchStore from '@hedtech/powercampus-design-system/flux/stores/PeopleSearchStore';
import Store from '../../../Stores/CourseManagementStore';
// #endregion Imports

// #region Types
export interface IManageAssistantsProps {
    hasActivitiesClaim?: boolean;
    hasActivityGradesClaim?: boolean;
    hasAlertsClaim?: boolean;
    hasAssistantRole?: boolean;
    hasClassListClaim?: boolean;
    hasDailyAttendanceClaim?: boolean;
    hasDashboardNotesClaim?: boolean;
    hasGradeMappingsClaim?: boolean;
    hasOverallAttendanceClaim?: boolean;
    hasOverallGradesClaim?: boolean;
    hasOverallGradesSubmissionClaim?: boolean;
    hasWaitListClaim?: boolean;
    instructorIds?: number[];
    myPosition: number;
    sectionId: number;
    onViewDossier?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IManageAssistantsResProps extends IManageAssistantsResources {
    deleteMessageConfirmation: IConfirmationDialogResources;
    manageAssistantsTable: IManageAssistantsTableResProps;
    peopleSearchModal: IPeopleSearchModalResources;
}

interface IManageAssistantsState {
    allSelected: boolean;
    componentError: boolean;
    facultyAssistants?: IFacultyAssistantDetail[];
    isAssistantSelected: boolean;
    isDeleteModalOpen: boolean;
    isLoading: boolean;
    isLoadingAdd: boolean;
    isLoadingSave: boolean;
    peopleSearchModalOpen: boolean;
    resources?: IManageAssistantsResProps;
    selectedPerson?: IPeopleSearchModel;

    // #region Email Modal
    emailSettings?: IEmailSettings;
    openEmailModal: boolean;
    recipientsEmailAddresses: string[];
    // #endregion Email Modal
}

const styles = (theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th': {
                width: '20%'
            }
        }
    }
});

type PropsWithStyles = IManageAssistantsProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class ManageAssistants extends React.Component<PropsWithStyles, IManageAssistantsState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;
    private facultyIndex: number;

    public readonly state: Readonly<IManageAssistantsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Classes';
        this.idPage = 'ManageAssistants';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.facultyIndex = -1;
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        PeopleSearchStore.addSelectedPersonListener(this.onSelect);
        // #endregion State Management Listeners
    }

    private getInitialState(): IManageAssistantsState {
        let resources: IManageAssistantsResProps | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = Store.getResources(this.props.myPosition);
        }
        return {
            allSelected: false,
            componentError: false,
            isAssistantSelected: false,
            isDeleteModalOpen: false,
            isLoading: true,
            isLoadingAdd: false,
            isLoadingSave: false,
            peopleSearchModalOpen: false,
            resources: resources,

            // #region Email Modal
            openEmailModal: false,
            recipientsEmailAddresses: []
            // #endregion Email Modal
        };
    }

    // #region Events
    private onAdd = (): void => {
        try {
            const {
                instructorIds,
                sectionId
            } = this.props;
            const {
                facultyAssistants,
                resources,
                selectedPerson
            } = this.state;
            if (selectedPerson) {
                const assistantExists: boolean = (facultyAssistants && facultyAssistants.length > 0) ?
                    facultyAssistants.some(faculty => faculty.assistantId === selectedPerson.personId) : false;
                const instructorExists: boolean = (instructorIds && instructorIds.length > 0) ?
                    instructorIds.some(i => i === selectedPerson.personId) : false;
                if (assistantExists || instructorExists) {
                    this.onCloseSearch();
                    this.hideLoaderAdd();
                    if (this.layoutResources && resources) {
                        LayoutActions.setAlert({
                            message: assistantExists ?
                                resources.lblFacultyAlreadyAdded : resources.lblPersonIsFaculty,
                            messageType: ResultType.error,
                            snackbar: true
                        } as IAlert);
                    }
                }
                else {
                    const facultyAssistants: IFacultyAssistant[] = [];
                    facultyAssistants.push({
                        assistantId: selectedPerson.personId,
                        canAccessActivityGrades: false,
                        canAccessAttendance: false,
                        canAccessClassList: false,
                        canAccessDashboardNotes: false,
                        canAccessOverallGrades: false,
                        canAccessViolations: false,
                        canAccessWaitlist: false,
                        canSetupActivities: false,
                        canSetupGradeMappings: false,
                        canSubmitOverallGrades: false,
                        canTakeDailyAttendance: false,
                        facultyAssistantId: 0,
                        facultyId: 0,
                        sectionId: sectionId
                    });
                    this.showLoaderAdd();
                    Requests.saveFacultyAssistant(facultyAssistants, this.resolveSaveFacultyAssistant);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdd.name, e));
        }
    };

    private onCloseSearch = (): void => {
        try {
            LayoutStore.abort();
            PeopleSearchActions.setEmptySearch();
            this.setState({
                peopleSearchModalOpen: false,
                selectedPerson: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSearch.name, e));
        }
    };

    private onCloseDeleteModal = (): void => {
        try {
            this.facultyIndex = -1;
            this.setState({
                isDeleteModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSearch.name, e));
        }
    };

    private onSave = (): void => {
        try {
            const {
                facultyAssistants
            } = this.state;

            const {
                sectionId
            } = this.props;

            if (facultyAssistants && facultyAssistants.length > 0) {
                const faculties: IFacultyAssistant[] = [];
                facultyAssistants.forEach(faculty => {
                    if (faculty.isModified) {
                        faculties.push({
                            ...faculty,
                            sectionId: sectionId
                        });
                    }
                });
                if (faculties.length > 0) {
                    this.showLoaderSave();
                    Requests.saveFacultyAssistant(faculties, this.resolveSaveFacultyAssistant);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSave.name, e));
        }
    };

    private onDeleteConfirm = (): void => {
        try {
            const {
                facultyAssistants
            } = this.state;

            const {
                sectionId
            } = this.props;

            if (facultyAssistants && facultyAssistants.length > 0 && this.facultyIndex > -1) {
                const faculty: IFacultyAssistantDetail = facultyAssistants[this.facultyIndex];
                this.setState({
                    isDeleteModalOpen: false
                }, () => {
                    this.showLoader();
                    Requests.deleteFacultyAssistant(faculty.facultyAssistantId,
                        faculty.assistantId,
                        sectionId,
                        this.resolveDeleteFacultyAssistant);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteConfirm.name, e));
        }
    };

    private onSearch = (): void => {
        try {
            this.setState({
                peopleSearchModalOpen: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearch.name, e));
        }
    };

    private onDelete = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const id: number = Number(event.currentTarget.id.split('_')[1]);
            this.facultyIndex = id;
            this.setState({
                isDeleteModalOpen: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDelete.name, e));
        }
    };

    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                facultyAssistants
            } = this.state;
            const ids: string[] = event.currentTarget.id.split('_');
            const id: number = Number(ids[2]);

            if (facultyAssistants && facultyAssistants.length > 0) {
                facultyAssistants[id].isModified = true;
                switch (ids[1]) {
                    case 'dashboardNotes':
                        facultyAssistants[id].canAccessDashboardNotes = event.target.checked;
                        break;
                    case 'classList':
                        facultyAssistants[id].canAccessClassList = event.target.checked;
                        break;
                    case 'waitlist':
                        facultyAssistants[id].canAccessWaitlist = event.target.checked;
                        break;
                    case 'violations':
                        facultyAssistants[id].canAccessViolations = event.target.checked;
                        break;
                    case 'overallAttendance':
                        facultyAssistants[id].canAccessAttendance = event.target.checked;
                        break;
                    case 'dailyAttendance':
                        facultyAssistants[id].canTakeDailyAttendance = event.target.checked;
                        break;
                    case 'activities':
                        facultyAssistants[id].canSetupActivities = event.target.checked;
                        break;
                    case 'gradeMappings':
                        facultyAssistants[id].canSetupGradeMappings = event.target.checked;
                        break;
                    case 'activityGrades':
                        facultyAssistants[id].canAccessActivityGrades = event.target.checked;
                        break;
                    case 'overallGrades':
                        facultyAssistants[id].canAccessOverallGrades = event.target.checked;
                        break;
                    case 'submitOverallGrades':
                        facultyAssistants[id].canSubmitOverallGrades = event.target.checked;
                        break;
                }
            }
            this.setState({
                facultyAssistants: facultyAssistants
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onChangeAssistantCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                facultyAssistants
            } = this.state;

            if (facultyAssistants) {
                const facultyAssistantId: number = Number(event.currentTarget.dataset.id);
                const student: IFacultyAssistantDetail | undefined = facultyAssistants.find(a => a.facultyAssistantId === facultyAssistantId);
                if (student) {
                    student.checkbox = !student.checkbox;
                    const isAssistantSelected: boolean = facultyAssistants.findIndex(assistant => assistant.checkbox) >= 0;
                    const oneNotSelected: boolean = facultyAssistants.findIndex(assistant => !assistant.checkbox) >= 0;
                    this.setState({
                        allSelected: !oneNotSelected,
                        facultyAssistants: facultyAssistants,
                        isAssistantSelected: isAssistantSelected
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeAssistantCheckbox.name, e));
        }
    };

    private onSelectAll = (): void => {
        try {
            const {
                allSelected,
                facultyAssistants,
                isAssistantSelected
            } = this.state;

            if (facultyAssistants) {
                let selectAll: boolean = false;
                if (allSelected || !isAssistantSelected) {
                    selectAll = !allSelected;
                }
                facultyAssistants.forEach(assistant => assistant.checkbox = selectAll);
                this.setState({
                    allSelected: selectAll,
                    facultyAssistants: facultyAssistants,
                    isAssistantSelected: selectAll
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSelectAll.name, e));
        }
    };

    private onSelect = (): void => {
        try {
            const person: IPeopleSearchModel | undefined = PeopleSearchStore.getSelectedPerson();
            this.setState({
                selectedPerson: person
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSelect.name, e));
        }
    };

    // #region Email Modal
    private onOpenEmailModal = (emailAddresses: string[]): void => {
        try {
            const {
                emailSettings
            } = this.state;

            if (emailSettings?.emailProvider === EmailProviderOption.SelfService) {
                LayoutActions.showPageLoader();
                this.setState({
                    recipientsEmailAddresses: emailAddresses,
                    openEmailModal: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenEmailModal.name, e));
        }
    };

    private onCloseEmailModal = (): void => {
        try {
            this.setState({
                openEmailModal: false,
                recipientsEmailAddresses: []
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseEmailModal.name, e));
        }
    };
    // #endregion Email Modal
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingAdd: false,
            isLoadingSave: false
        });
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private showLoader = (): void => {
        this.setState({
            isLoading: true
        });
    };

    private hideLoaderAdd = (): void => {
        this.setState({
            isLoadingAdd: false
        });
    };

    private showLoaderAdd = (): void => {
        this.setState({
            isLoadingAdd: true
        });
    };

    private hideLoaderSave = (): void => {
        this.setState({
            isLoadingSave: false
        });
    };

    private showLoaderSave = (): void => {
        this.setState({
            isLoadingSave: true
        });
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                Store.setResources(this.props.myPosition, result.data);
                this.setState({
                    resources: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveDeleteFacultyAssistant = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveDeleteFacultyAssistant.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    facultyAssistants
                } = this.state;
                if (this.layoutResources) {
                    LayoutActions.setAlert({
                        message: this.layoutResources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                if (facultyAssistants && facultyAssistants.length > 0) {
                    facultyAssistants.splice(this.facultyIndex, 1);
                    this.setState({
                        facultyAssistants: facultyAssistants
                    });
                    this.facultyIndex = -1;
                    this.hideLoader();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveDeleteFacultyAssistant.name, e));
        }
    };

    private resolveGetFacultyAssistants = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetFacultyAssistants.name, this.hideAllLoaders);

            if (result?.status) {
                const facultyAssistantList: IFacultyAssistants | undefined = result.data;
                if (facultyAssistantList) {
                    this.setState({
                        facultyAssistants: facultyAssistantList.facultyAssistants,
                        emailSettings: facultyAssistantList.emailSettings
                    });
                }
                this.hideLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetFacultyAssistants.name, e));
        }
    };

    private resolveSaveFacultyAssistant = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveFacultyAssistant.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    peopleSearchModalOpen
                } = this.state;
                if (this.layoutResources) {
                    LayoutActions.setAlert({
                        message: this.layoutResources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                if (peopleSearchModalOpen) {
                    this.onCloseSearch();
                    this.hideLoaderAdd();
                    this.showLoader();
                    Requests.getFacultyAssistants(this.props.sectionId, this.resolveGetFacultyAssistants);
                }
                else {
                    this.hideLoaderSave();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveFacultyAssistant.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            const {
                sectionId
            } = this.props;
            const {
                resources
            } = this.state;

            if (!resources) {
                RequestsLayout.getResources(this.idModule, this.idPage,
                    this.resolveGetResources,
                    this.logError);
            }
            Requests.getFacultyAssistants(sectionId, this.resolveGetFacultyAssistants);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }

    public componentWillUnmount(): void {
        PeopleSearchStore.removeSelectedPersonListener(this.onSelect);
    }

    public componentDidCatch(error, info): void {
        this.setState({
            componentError: true
        }, () => {
            this.logError(LogData.fromComponentException(this.componentDidCatch.name, error, info));
            this.redirectError(500);
        });
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            allSelected,
            componentError,
            emailSettings,
            facultyAssistants,
            isAssistantSelected,
            isDeleteModalOpen,
            isLoading,
            isLoadingAdd,
            isLoadingSave,
            peopleSearchModalOpen,
            resources,

            // #region Email Modal
            recipientsEmailAddresses,
            openEmailModal
            // #endregion Email Modal
        } = this.state;

        const {
            hasActivitiesClaim,
            hasActivityGradesClaim,
            hasAlertsClaim,
            hasAssistantRole,
            hasClassListClaim,
            hasDailyAttendanceClaim,
            hasDashboardNotesClaim,
            hasGradeMappingsClaim,
            hasOverallAttendanceClaim,
            hasOverallGradesClaim,
            hasOverallGradesSubmissionClaim,
            hasWaitListClaim,
            onViewDossier
        } = this.props;

        let contentPage: JSX.Element | undefined;
        let emailModal: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (
                <ContainerLoader id="ldrManageAssistants" height="md" />
            );
        }
        else if (!componentError && resources) {
            if (!hasAssistantRole) {
                contentPage = (
                    <Grid item xs={12}>
                        <Illustration
                            color="secondary"
                            name="under-maintenance"
                            text={resources.lblNoDefaultRole}
                        />
                    </Grid>
                );
            }
            else if (hasDashboardNotesClaim
                || hasClassListClaim
                || hasWaitListClaim
                || hasAlertsClaim
                || hasOverallAttendanceClaim
                || hasDailyAttendanceClaim
                || hasActivitiesClaim
                || hasGradeMappingsClaim
                || hasActivityGradesClaim
                || hasOverallGradesClaim
                || hasOverallGradesSubmissionClaim) {
                contentPage = (
                    <>
                        <Grid container>
                            <Grid item xs>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Tooltip
                                            id="tltSearch"
                                            title={resources.btnSearch}
                                            placement="top"
                                        >
                                            <IconButton
                                                aria-label={resources.btnSearch}
                                                onClick={this.onSearch}
                                                id="btnSearch"
                                            >
                                                <Icon name="add" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                                {facultyAssistants && facultyAssistants.length ? (
                                    <>
                                        <ManageAssistantsTable
                                            allSelected={allSelected}
                                            emailSettings={emailSettings}
                                            facultyAssistants={facultyAssistants}
                                            hasActivitiesClaim={hasActivitiesClaim}
                                            hasActivityGradesClaim={hasActivityGradesClaim}
                                            hasAlertsClaim={hasAlertsClaim}
                                            hasClassListClaim={hasClassListClaim}
                                            hasDailyAttendanceClaim={hasDailyAttendanceClaim}
                                            hasDashboardNotesClaim={hasDashboardNotesClaim}
                                            hasGradeMappingsClaim={hasGradeMappingsClaim}
                                            hasOverallAttendanceClaim={hasOverallAttendanceClaim}
                                            hasOverallGradesClaim={hasOverallGradesClaim}
                                            hasOverallGradesSubmissionClaim={hasOverallGradesSubmissionClaim}
                                            hasWaitListClaim={hasWaitListClaim}
                                            isAssistantSelected={isAssistantSelected}
                                            isLoadingSave={isLoadingSave}
                                            resources={resources.manageAssistantsTable}
                                            onChangeAssistantCheckbox={this.onChangeAssistantCheckbox}
                                            onChangeCheckbox={this.onChangeCheckbox}
                                            onDelete={this.onDelete}
                                            onOpenEmailModal={this.onOpenEmailModal}
                                            onSave={this.onSave}
                                            onSelectAll={this.onSelectAll}
                                            onViewDossier={onViewDossier}
                                        />
                                        <ConfirmationDialog
                                            contentText={Format.toString(resources.deleteMessageConfirmation.formatContent,
                                                [this.facultyIndex > -1 ? facultyAssistants[this.facultyIndex].assistant.fullName : ''])}
                                            open={isDeleteModalOpen}
                                            primaryActionOnClick={this.onCloseDeleteModal}
                                            primaryActionText={resources.deleteMessageConfirmation.btnDecline}
                                            secondaryActionOnClick={this.onDeleteConfirm}
                                            secondaryActionText={resources.deleteMessageConfirmation.btnAccept}
                                            title={resources.deleteMessageConfirmation.lblTitle}
                                        />
                                    </>
                                ) : (
                                    <Illustration
                                        color="secondary"
                                        height="lg"
                                        internalName="no-enrolled"
                                        text={resources.lblNoResults}
                                    />
                                )}
                            </Grid>
                        </Grid>
                        <PeopleSearch
                            isLoadingAccept={isLoadingAdd}
                            modalResources={resources.peopleSearchModal}
                            open={peopleSearchModalOpen}
                            onAccept={this.onAdd}
                            onClose={this.onCloseSearch}
                        />
                    </>
                );

                if (openEmailModal && emailSettings) {
                    emailModal = (
                        <EmailModal
                            emailSettings={emailSettings}
                            onClose={this.onCloseEmailModal}
                            recipientsEmailAddresses={recipientsEmailAddresses}
                        />
                    );
                }
            }
            else {
                contentPage = (
                    <Grid item xs={12}>
                        <Illustration
                            color="secondary"
                            name="under-maintenance"
                            text={resources.lblNoClaims}
                        />
                    </Grid>
                );
            }
        }

        return (
            <>
                {contentPage}
                {emailModal}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(ManageAssistants);