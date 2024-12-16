/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: SetupApprovalsView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Dossier from '@hedtech/powercampus-design-system/react/components/Dossier';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import StepProgress, { Step, StepContent, StepLabel } from '@hedtech/powercampus-design-system/react/core/StepProgress';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import SectionDetailModal, { ISectionDetailModalResProps } from '../../Generic/SectionDetailModal';

// Internal components
import SectionApprovalCard, { ISectionApprovalCardResProps } from './SectionApprovalCard';

// Types
import { CourseManagementMainFilter } from '../../../Types/Permissions/ICourseManagementMainPermissions';
import { DossierType } from '@hedtech/powercampus-design-system/types/Dossier/DossierType';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDepartmentPermissions } from '../../../Types/Permissions/IDepartmentPermissions';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ISectionApproval, ISectionDepartmentHead } from '../../../Types/Section/ISectionDepartmentHead';
import { ISectionCourseManagement } from '../../../Types/Section/ISectionCourseManagement';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';
import { ISetupApprovalsResources } from '../../../Types/Resources/Department/ISetupApprovalsResources';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../../Requests/Department/SetupApprovals';
import RequestsSection from '../../../Requests/Generic/Section';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface ISetupApprovalsRes extends ISetupApprovalsResources {
    sectionApprovalCard: ISectionApprovalCardResProps;
    sectionDetailModal: ISectionDetailModalResProps;
}

interface ISetupApprovalsState {
    componentError: boolean;
    departments?: IDropDownOption[];
    departmentSelected?: IDropDownOption;
    faculties?: IDropDownOption[];
    facultySelected?: IDropDownOption;
    filters?: IDropDownOption[];
    filterSelected?: IDropDownOption;
    hasDossierClaim: boolean;
    isLoading: boolean;
    isLoadingContent: boolean;
    isLoadingFilter: boolean;
    isLoadingPeriods: boolean;
    noPeriods?: boolean;
    optionsOpen: boolean;
    periods?: IDropDownOption[];
    periodSelected?: IDropDownOption;
    permissions?: IDepartmentPermissions;
    resources?: ISetupApprovalsRes;
    sectionDetail?: ISectionDetail;
    sectionModalOpen: boolean;
    sectionsByDepartment?: ISectionDepartmentHead[];
    years?: IDropDownOption[];
    yearSelected?: IDropDownOption;

    // #region Dossier
    dossierPersonId: number;
    openDossierModal: boolean;
    // #endregion Dossier
}

const styles = createStyles({
    optionsStepProgress: {
        padding: 0
    }
});

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion Types

// #region Component
class SetupApprovalsView extends React.Component<PropsWithStyles, ISetupApprovalsState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<ISetupApprovalsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Department';
        this.idPage = 'SetupApprovals';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): ISetupApprovalsState {
        let resources: ISetupApprovalsRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            hasDossierClaim: false,
            isLoading: true,
            isLoadingContent: false,
            isLoadingFilter: false,
            isLoadingPeriods: false,
            optionsOpen: true,
            resources: resources,
            sectionModalOpen: false,

            // #region Dossier
            dossierPersonId: 0,
            openDossierModal: false
            // #endregion Dossier
        };
    }

    // #region Dossier
    private onCloseDossierModal = (): void => {
        try {
            this.setState({
                dossierPersonId: 0,
                openDossierModal: false
            });
            LayoutStore.abort();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDossierModal.name, e));
        }
    };

    private onViewDossier = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const personId: number = Number(event.currentTarget.dataset.id);
            this.setState({
                dossierPersonId: personId,
                openDossierModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewDossier.name, e));
        }
    };
    // #endregion Dossier

    // #region Events
    private onChangeDepartment = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            this.setState({
                departmentSelected: optionSelected,
                noPeriods: undefined,
                periods: undefined,
                periodSelected: undefined,
                sectionsByDepartment: undefined
            });

            if (optionSelected.value) {
                this.showLoaderPeriods();
                Requests.getPeriods({
                    departmentId: optionSelected.value
                } as ISectionCourseManagement, this.resolveGetPeriods);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDepartment.name, e));
        }
    };

    private onChangeFaculty = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            this.setState({
                facultySelected: optionSelected,
                noPeriods: undefined,
                periods: undefined,
                periodSelected: undefined,
                sectionsByDepartment: undefined
            });

            if (optionSelected.value) {
                this.showLoaderPeriods();
                Requests.getPeriods({
                    facultyId: Number(optionSelected.value)
                } as ISectionCourseManagement, this.resolveGetPeriods);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFaculty.name, e));
        }
    };

    private onChangeFilter = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                faculties,
                filterSelected,
                years
            } = this.state;

            if (filterSelected && filterSelected.value !== optionSelected.value) {
                this.setState({
                    departmentSelected: undefined,
                    facultySelected: undefined,
                    filterSelected: optionSelected,
                    noPeriods: undefined,
                    periods: undefined,
                    periodSelected: undefined,
                    sectionsByDepartment: undefined,
                    yearSelected: undefined
                });

                switch (optionSelected.value) {
                    case CourseManagementMainFilter.Faculty:
                        if (faculties === undefined) {
                            this.showLoaderFilter();
                            Requests.getFaculties(this.resolveGetFaculties);
                        }
                        break;
                    case CourseManagementMainFilter.Year:
                        if (years === undefined) {
                            this.showLoaderFilter();
                            Requests.getYears(this.resolveGetYears);
                        }
                        break;
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFilter.name, e));
        }
    };

    private onChangeOptionsExpansion = (_event: object, expanded: boolean): void => {
        try {
            this.setState({
                optionsOpen: expanded
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeOptionsExpansion.name, e));
        }
    };

    private onChangePeriod = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                departmentSelected,
                facultySelected,
                filterSelected,
                periods,
                yearSelected
            } = this.state;

            if (optionSelected && periods) {
                this.setState({
                    periodSelected: optionSelected,
                    sectionsByDepartment: undefined
                }, this.showLoaderContent);
                if (filterSelected && optionSelected.value) {
                    Requests.getSections({
                        departmentId: filterSelected.value === CourseManagementMainFilter.Department && departmentSelected ?
                            Number(departmentSelected.value) : undefined,
                        facultyId: filterSelected.value === CourseManagementMainFilter.Faculty && facultySelected ?
                            Number(facultySelected.value) : undefined,
                        sessionPeriodId: Number(optionSelected.value),
                        year: filterSelected.value === CourseManagementMainFilter.Year && yearSelected ?
                            yearSelected.value : undefined
                    } as ISectionCourseManagement, this.resolveGetSections);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePeriod.name, e));
        }
    };

    private onChangeRequireApproval = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                sectionsByDepartment
            } = this.state;

            const parts: string[] = event.target.id.split('_');
            const departmentPosition: number = Number(parts[1]);
            const sectionPosition: number = Number(parts[2]);
            const sectionId: number = Number(parts[3]);
            const requireApproval: boolean = !Boolean(event.target.value);

            if (sectionsByDepartment) {
                sectionsByDepartment[departmentPosition].sectionsApproval[sectionPosition].isLoading = true;
                Requests.saveRequireApproval(departmentPosition, sectionPosition, sectionId, requireApproval,
                    this.resolveSaveRequireApproval);
                this.setState({
                    sectionsByDepartment: sectionsByDepartment
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRequireApproval.name, e));
        }
    };

    private onChangeYear = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            this.setState({
                noPeriods: undefined,
                periods: undefined,
                periodSelected: undefined,
                sectionsByDepartment: undefined,
                yearSelected: optionSelected
            });

            if (optionSelected.value) {
                this.showLoaderPeriods();
                Requests.getPeriods({
                    year: optionSelected.value
                } as ISectionCourseManagement, this.resolveGetPeriods);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeYear.name, e));
        }
    };

    private onCloseSectionModal = (): void => {
        try {
            this.setState({
                sectionDetail: undefined,
                sectionModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSectionModal.name, e));
        }
    };

    private onViewDetails = (id: number): void => {
        try {
            LayoutActions.showPageLoader();
            RequestsSection.getSection(id, false, this.resolveGetSection);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewDetails.name, e));
        }
    };
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingContent: false,
            isLoadingFilter: false,
            isLoadingPeriods: false
        });
    };

    private hideLoaderContent = (): void => {
        this.setState({
            isLoadingContent: false
        });
    };

    private showLoaderContent = (): void => {
        this.setState({
            isLoadingContent: true
        });
    };

    private hideLoaderFilter = (): void => {
        this.setState({
            isLoadingFilter: false
        });
    };

    private showLoaderFilter = (): void => {
        this.setState({
            isLoadingFilter: true
        });
    };

    private hideLoaderPeriods = (): void => {
        this.setState({
            isLoadingPeriods: false
        });
    };

    private showLoaderPeriods = (): void => {
        this.setState({
            isLoadingPeriods: true
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

    private showError(message?: string): void {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetDepartments = (json: string): void => {
        try {
            const {
                resources
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDepartments.name, this.hideAllLoaders);

            if (result?.status) {
                const departments: IDropDownOption[] = result.data;
                if (departments && departments.length > 0 && resources) {
                    const filters: IDropDownOption[] = [];
                    filters.push({
                        description: resources.lblDepartment,
                        value: CourseManagementMainFilter.Department
                    });
                    filters.push({
                        description: resources.lblInstructor,
                        value: CourseManagementMainFilter.Faculty
                    });
                    filters.push({
                        description: resources.lblYear,
                        value: CourseManagementMainFilter.Year
                    });
                    this.setState({
                        departments: result.data,
                        filters: filters,
                        filterSelected: filters[0],
                        isLoading: false
                    }, () => {
                        this.hideLoaderFilter();
                        LayoutActions.hidePageLoader();
                    });
                }
                else {
                    this.setState({
                        isLoading: false
                    }, () => {
                        this.hideLoaderFilter();
                        LayoutActions.hidePageLoader();
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDepartments.name, e));
        }
    };

    private resolveGetFaculties = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetFaculties.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    faculties: result.data
                }, this.hideLoaderFilter);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetFaculties.name, e));
        }
    };

    private resolveGetPeriods = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPeriods.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data
                    && result.data.periods
                    && result.data.periods.length > 0) {
                    this.setState({
                        noPeriods: false,
                        periods: result.data.periods,
                        periodSelected: undefined,
                        sectionsByDepartment: undefined
                    }, this.hideLoaderPeriods);
                }
                else {
                    this.setState({
                        noPeriods: true
                    }, () => {
                        this.hideLoaderPeriods();
                        LayoutActions.hidePageLoader();
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPeriods.name, e));
        }
    };

    private resolveGetSection = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSection.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    sectionDetail: result.data,
                    sectionModalOpen: true
                });
                LayoutActions.hidePageLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSection.name, e));
        }
    };

    private resolveGetSections = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSections.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    sectionsByDepartment: result.data
                }, () => {
                    this.hideLoaderContent();
                    LayoutActions.hidePageLoader();
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSections.name, e));
        }
    };

    private resolveGetYears = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetYears.name, this.hideAllLoaders);

            if (result?.status) {
                const years: IDropDownOption[] = [];
                if (result.data) {
                    result.data.forEach(year => years.push({
                        description: year,
                        value: year
                    }));
                }
                this.setState({
                    years: years
                }, this.hideLoaderFilter);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetYears.name, e));
        }
    };

    private resolveLayoutReady = () => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
                LayoutActions.hidePageLoader();
                this.showLoaderFilter();
                Requests.getDepartments(this.resolveGetDepartments);
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };

    private resolveSaveRequireApproval = (json: string): void => {
        try {
            const {
                sectionsByDepartment,
                resources
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveRequireApproval.name, this.hideAllLoaders);

            if (result?.status) {
                if (sectionsByDepartment && resources) {
                    const section: ISectionApproval
                        = sectionsByDepartment[result.data.departmentPosition].sectionsApproval[result.data.sectionPosition];
                    if (result.data.status) {
                        section.requireApproval = !section.requireApproval;
                    }
                    else {
                        const sectionTitle: string =
                            Format.toString(resources.sectionApprovalCard.formatTitleSection, [section.eventId, section.eventName]);
                        this.showError(sectionTitle);
                    }
                    section.isLoading = false;
                    this.setState({
                        sectionsByDepartment: sectionsByDepartment
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveRequireApproval.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const permissions: IDepartmentPermissions | undefined = LayoutStore.getPermissions();
        const resources: ISetupApprovalsRes | undefined = LayoutStore.getResources();
        if (ready) {
            this.setState({
                permissions: permissions,
                resources: resources
            }, this.resolveLayoutReady);
        }
        else {
            this.setState({
                componentError: true
            }, () => this.logError(LogData.layoutNoReady(this.onLayoutReady.name)));
        }
    };
    // #endregion State Management Events

    // #region Lifecycle
    public componentWillUnmount(): void {
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);
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
            classes
        } = this.props;

        const {
            componentError,
            departments,
            departmentSelected,
            faculties,
            facultySelected,
            filters,
            filterSelected,
            isLoading,
            isLoadingContent,
            isLoadingFilter,
            isLoadingPeriods,
            noPeriods,
            optionsOpen,
            periods,
            periodSelected,
            permissions,
            resources,
            sectionsByDepartment,
            sectionDetail,
            sectionModalOpen,
            years,
            yearSelected,

            // #region Dossier
            dossierPersonId,
            openDossierModal
            // #endregion Dossier
        } = this.state;

        const resourcesLayout = LayoutStore.getResourcesLayout();
        let emptyOption: IDropDownOption;
        emptyOption = {
            description: resourcesLayout ? resourcesLayout.lblDropDownEmptyText : '',
            value: ''
        };

        let contentPage: JSX.Element | undefined;
        let dossier: JSX.Element | undefined;
        if (!componentError && permissions && resources) {
            if (!isLoading) {
                let sectionModal: JSX.Element | undefined;
                if (sectionDetail) {
                    sectionModal = (
                        <SectionDetailModal
                            open={sectionModalOpen}
                            resources={resources.sectionDetailModal}
                            section={sectionDetail}
                            onClose={this.onCloseSectionModal}
                        />
                    );
                }

                let filterOptions: JSX.Element | undefined;
                if (filters && filterSelected) {
                    filterOptions = (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Dropdown
                                    id="ddlFilter"
                                    label={resources.lblFilter}
                                    options={filters}
                                    value={filterSelected ? filterSelected.value : undefined}
                                    onChange={this.onChangeFilter}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                {filterSelected.value === CourseManagementMainFilter.Department ? (
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        id="ddlDepartment"
                                        label={resources.lblDepartment}
                                        loading={isLoadingFilter}
                                        options={departments}
                                        value={departmentSelected ? departmentSelected.value : undefined}
                                        onChange={this.onChangeDepartment}
                                    />
                                ) : undefined}
                                {filterSelected.value === CourseManagementMainFilter.Faculty ? (
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        id="ddlInstructor"
                                        label={resources.lblInstructor}
                                        loading={isLoadingFilter}
                                        options={faculties}
                                        value={facultySelected ? facultySelected.value : undefined}
                                        onChange={this.onChangeFaculty}
                                    />
                                ) : undefined}
                                {filterSelected.value === CourseManagementMainFilter.Year ? (
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        id="ddlYear"
                                        label={resources.lblYear}
                                        loading={isLoadingFilter}
                                        options={years}
                                        value={yearSelected ? yearSelected.value : undefined}
                                        onChange={this.onChangeYear}
                                    />
                                ) : undefined}
                            </Grid>
                        </Grid>
                    );
                }

                let contentOptions: JSX.Element | undefined;
                if (periods && periods.length > 0) {
                    contentOptions = (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    id="ddlPeriod"
                                    label={resources.lblPeriod}
                                    loading={isLoadingPeriods}
                                    options={periods}
                                    value={periodSelected ? periodSelected.value : undefined}
                                    onChange={this.onChangePeriod}
                                />
                            </Grid>
                        </Grid>
                    );
                }
                else if (noPeriods === undefined) {
                    contentOptions = (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    id="ddlPeriod"
                                    label={resources.lblPeriod}
                                    loading={isLoadingPeriods}
                                    options={undefined}
                                    value={undefined}
                                />
                            </Grid>
                        </Grid>
                    );
                }

                let optionsSection: JSX.Element | undefined;
                let emptyContent: JSX.Element | undefined;
                let sectionsTable: JSX.Element | JSX.Element[] | undefined;

                if (periodSelected && periodSelected.value) {
                    if (sectionsByDepartment && sectionsByDepartment.length > 0) {
                        sectionsTable = sectionsByDepartment.map((sectionByDepartment, iDepartment) => (
                            <ExpansionPanel
                                defaultExpanded
                                header={(
                                    <Text size="h3">
                                        {sectionByDepartment.departmentDesc}
                                    </Text>
                                )}
                                key={`epnlDepartment_${iDepartment}`}
                                id={`epnlDepartment_${iDepartment}`}
                            >
                                {sectionByDepartment.sectionsApproval.map((section, iSection) => (
                                    <SectionApprovalCard
                                        hasDossierClaim={permissions.setupApprovalsFacultyDossier}
                                        key={`crdSection_${iDepartment}_${iSection}`}
                                        id={`crdSection_${iDepartment}_${iSection}_${section.id}`}
                                        indexDepartment={iDepartment}
                                        indexSection={iSection}
                                        resources={resources.sectionApprovalCard}
                                        section={section}
                                        onChangeRequireApproval={this.onChangeRequireApproval}
                                        onViewDetails={this.onViewDetails}
                                        onViewDossier={this.onViewDossier}
                                    />
                                ))}
                            </ExpansionPanel>
                        ));
                    }
                    else if (isLoadingContent) {
                        emptyContent = (
                            <ContainerLoader id="ldrEmptyContent" height="md" />
                        );
                    }
                    else {
                        sectionsTable = (
                            <MessageStyled
                                classMessage="noResults"
                                message={resources.lblNoCourses}
                            />
                        );
                    }
                }
                else if (isLoadingContent) {
                    emptyContent = (
                        <ContainerLoader id="ldrEmptyContent" height="md" />
                    );
                }
                else {
                    emptyContent = (
                        <Card>
                            <CardContent>
                                <Illustration
                                    color="secondary"
                                    name="no-search-results"
                                    text={resources.lblNoFilterNoPeriod}
                                />
                            </CardContent>
                        </Card>
                    );
                }

                if (filterOptions) {
                    optionsSection = (
                        <ExpansionPanel
                            defaultExpanded
                            expanded={optionsOpen}
                            header={(
                                <Text size="h3">
                                    {resources.lblOptions}
                                </Text>
                            )}
                            onChange={this.onChangeOptionsExpansion}
                        >
                            <StepProgress
                                classes={{ root: classes.optionsStepProgress }}
                                nonLinear
                                orientation="vertical"
                            >
                                <Step active>
                                    <StepLabel>
                                        {resources.lblSelectFilter}
                                    </StepLabel>
                                    <StepContent>
                                        {filterOptions}
                                    </StepContent>
                                </Step>
                                <Step active>
                                    <StepLabel>
                                        {resources.lblSelectPeriod}
                                    </StepLabel>
                                    <StepContent>
                                        {contentOptions ? (
                                            <>
                                                {contentOptions}
                                            </>
                                        ) : (
                                                <MessageStyled
                                                    classMessage="noResults"
                                                    message={resources.lblNoOptions}
                                                />
                                            )}
                                    </StepContent>
                                </Step>
                            </StepProgress>
                        </ExpansionPanel>
                    );
                }
                else {
                    optionsSection = (
                        <Card>
                            <CardContent>
                                <Illustration
                                    color="secondary"
                                    name="no-search-results"
                                    text={resources.lblNoDepartments}
                                />
                            </CardContent>
                        </Card >
                    );
                    emptyContent = undefined;
                }

                dossier = (
                    <Dossier
                        key={`Dossier_${dossierPersonId}`}
                        dossierType={DossierType.Faculty}
                        open={openDossierModal}
                        personId={dossierPersonId}
                        onClose={this.onCloseDossierModal}
                    />
                );

                contentPage = (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                {optionsSection}
                            </Grid>
                            <Grid item xs={12}>
                                {sectionsTable}
                                {emptyContent}
                                {dossier}
                            </Grid>
                        </Grid>
                        {sectionModal}
                    </>
                );
            }
        }

        return (
            <Layout
                idModule={this.idModule}
                idPage={this.idPage}
                showCart
                showNotifications
            >
                {contentPage}
            </Layout>
        );
    }
}

const SetupApprovalsViewWithLayout = withLayout(withStyles(styles)(SetupApprovalsView));
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<SetupApprovalsViewWithLayout />, document.getElementById('root'));