/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: PeriodFilters.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Collapse from '@hedtech/powercampus-design-system/react/core/Collapse';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import List, { ListItem, ListItemText } from '@hedtech/powercampus-design-system/react/core/List';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import PeriodFiltersEdit, { IPeriodFiltersEditResProps } from './PeriodFiltersEdit';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPeriodArea } from '../../../Types/Periods/IPeriodArea';
import { IPeriodFilter } from '../../../Types/Periods/IPeriodFilter';
import { IPeriodFiltersResources } from '../../../Types/Resources/Administration/IPeriodFiltersResources';
import { ISessionPeriodFilter } from '../../../Types/Periods/ISessionPeriodFilter';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/PeriodFilters';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IPeriodFiltersProps {
    lblSuccessSave: string;
}

interface IPeriodFiltersRes extends IPeriodFiltersResources {
    periodFiltersEdit: IPeriodFiltersEditResProps;
}

interface IPeriodFiltersState {
    areasOpenStatus: boolean[];
    componentError: boolean;
    idAreaSelected?: number;
    isLoading: boolean;
    isLoadingPeriodFilters: boolean;
    isLoadingSwitch: boolean;
    isLoadingYears: boolean;
    periodAreas: IPeriodArea[];
    periodFilters?: IPeriodFilter[];
    positionChanges: number[];
    resources?: IPeriodFiltersRes;
    withRelated?: boolean;
    years?: IDropDownOption[];
    yearSelected?: string;
}
// #endregion Types

// #region Component
class PeriodFilters extends React.Component<IPeriodFiltersProps, IPeriodFiltersState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IPeriodFiltersState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'PeriodFilters';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IPeriodFiltersState {
        let resources: IPeriodFiltersRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            areasOpenStatus: [false, false, false, false, false],
            componentError: false,
            isLoading: true,
            isLoadingPeriodFilters: false,
            isLoadingSwitch: false,
            isLoadingYears: false,
            periodAreas: [],
            positionChanges: [],
            resources: resources
        };
    }

    // #region Events
    private onChangeOpenStatus = (event: React.MouseEvent<HTMLElement>): void => {
        const {
            areasOpenStatus
        } = this.state;

        const index: string[] = event.currentTarget.id.split('_');

        areasOpenStatus[index[1]] = !areasOpenStatus[index[1]];

        this.setState({
            areasOpenStatus: areasOpenStatus
        });
    };

    private onChangeYear = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                idAreaSelected
            } = this.state;

            if (idAreaSelected) {
                const yearSelected: string = String(optionSelected.value);
                this.showLoaderPeriodFilters();
                Requests.postPeriodFilters(idAreaSelected, yearSelected, this.resolvePostOnlyPeriodFilters, this.logError);
                this.setState({
                    yearSelected: yearSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeYear.name, e));
        }
    };

    private onChangeEnableDisable = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                idAreaSelected,
                periodFilters,
                positionChanges
            } = this.state;

            const id: string[] = event.target.id.split('_');
            const position: number = Number(id[1]);
            const periodFilterId: number = Number(id[2]);
            const isActive: boolean = !Boolean(event.target.value);

            if (periodFilters) {
                const periodFilter: IPeriodFilter | undefined = periodFilters.find(pf => pf.id === periodFilterId);
                if (periodFilter && idAreaSelected) {
                    positionChanges.push(periodFilterId);
                    this.showLoaderSwitch();
                    Requests.postSavePeriodFilter({
                        id: idAreaSelected,
                        isEnabled: position === 0 ? isActive : periodFilter.isIncluded,
                        isEnabledRelated: position === 1 ? isActive : periodFilter.isRelatedIncluded,
                        periodFilterId: periodFilterId,
                        relatedModified: position === 1
                    },
                        this.resolvePostSavePeriodFilter,
                        this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeEnableDisable.name, e));
        }
    };

    private onClickArea = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const idAreaSelected: number = Number(event.currentTarget.dataset.id);

            this.setState({
                idAreaSelected: idAreaSelected
            });

            this.showLoaderYears();
            Requests.postPeriodFilters(idAreaSelected, '', this.resolvePostPeriodFilters, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickArea.name, e));
        }
    };

    private onClose = (): void => {
        try {
            this.setState({
                idAreaSelected: undefined,
                periodFilters: undefined,
                withRelated: undefined,
                years: undefined,
                yearSelected: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClose.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private getSubAreaName = (area: number): string => {
        const {
            resources
        } = this.state;

        let name: string = '';
        if (resources) {
            switch (area) {
                case 0:
                    name = resources.lblAreaStudent;
                    break;
                case 1:
                    name = resources.lblAreaCourseManagement;
                    break;
                case 2:
                    name = resources.lblAreaPlanning;
                    break;
                case 3:
                    name = resources.lblAreaAdvising;
                    break;
                case 4:
                    name = resources.lblAreaDossier;
                    break;
                case 5:
                    name = resources.lblAreaGeneral;
                    break;
            }
        }
        return name;
    };

    private getAreaName = (area: number): string => {
        const {
            resources
        } = this.state;

        let name: string = '';
        if (resources) {
            switch (area) {
                case 1:
                    name = resources.lblDegreeRequirements;
                    break;
                case 2:
                    name = resources.lblWhatIf;
                    break;
                case 3:
                    name = resources.lblSectionSearch;
                    break;
                case 4:
                    name = resources.lblCourseManagement;
                    break;
                case 5:
                    name = resources.lblTraditionalRegistration;
                    break;
                case 6:
                    name = resources.lblGradeReport;
                    break;
                // 7, does not exist
                case 8:
                    name = resources.lblDepartmentHead;
                    break;
                case 9:
                    name = resources.lblMyAdvisees;
                    break;
                case 10:
                    name = resources.lblFormerAdvisees;
                    break;
                case 11:
                    name = resources.lblAllStudents;
                    break;
                case 12:
                    name = resources.lblMyAssociations;
                    break;
                case 13:
                    name = resources.lblStudentDirectory;
                    break;
                case 14:
                    name = resources.lblDossierStudentCourseSchedule;
                    break;
                case 15:
                    name = resources.lblStudentsMyDepartment;
                    break;
                case 16:
                    name = resources.lblStudentsMyCampus;
                    break;
                case 17:
                    name = resources.lblAuthorizeRegistration;
                    break;
                case 18:
                    name = resources.lblDossierFacultyCourseSchedule;
                    break;
                case 19:
                    name = resources.lblAlternateGrade;
                    break;
                case 20:
                    name = resources.lblChecklist;
                    break;
                case 21:
                    name = resources.lblCourseMaterials;
                    break;
            }
        }
        return name;
    };
    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingPeriodFilters: false,
            isLoadingSwitch: false,
            isLoadingYears: false
        });
    };

    private hideLoaderYears = (): void => {
        this.setState({
            isLoadingYears: false
        });
    };

    private hideLoaderPeriodFilters = (): void => {
        this.setState({
            isLoadingPeriodFilters: false
        });
    };

    private hideLoaderSwitch = (): void => {
        this.setState({
            isLoadingSwitch: false
        });
    };

    private showLoaderYears = (): void => {
        this.setState({
            isLoadingYears: true
        });
    };

    private showLoaderPeriodFilters = (): void => {
        this.setState({
            isLoadingPeriodFilters: true
        });
    };

    private showLoaderSwitch = (): void => {
        this.setState({
            isLoadingSwitch: true
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
    private resolveGetPeriodAreas = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPeriodAreas.name);

            if (result?.status) {
                const periodAreas: IPeriodArea[] = result.data;
                this.setState({
                    isLoading: false,
                    periodAreas: periodAreas
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPeriodAreas.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    resources: result.data
                });
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolvePostOnlyPeriodFilters = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostOnlyPeriodFilters.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    periodFilters: result.data.periods
                }, this.hideLoaderPeriodFilters);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostOnlyPeriodFilters.name, e));
        }
    };

    private resolvePostPeriodFilters = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostPeriodFilters.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    periodFilters: result.data.periods,
                    withRelated: result.data.withRelated,
                    years: result.data.yearsList,
                    yearSelected: result.data.year
                }, this.hideLoaderYears);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostPeriodFilters.name, e));
        }
    };

    private resolvePostSavePeriodFilter = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSavePeriodFilter.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data.result) {
                    const {
                        periodFilters,
                        positionChanges
                    } = this.state;
                    const sessionPeriodFilter: ISessionPeriodFilter = result.data.sessionPeriodFilter;

                    if (periodFilters) {
                        const periodFilter: IPeriodFilter | undefined = periodFilters.find(pf => pf.id === sessionPeriodFilter.periodFilterId);
                        if (periodFilter) {
                            periodFilter.isIncluded = sessionPeriodFilter.isEnabled;
                            periodFilter.isRelatedIncluded = sessionPeriodFilter.isEnabledRelated;
                            const iPosition: number = positionChanges.findIndex(p => p === sessionPeriodFilter.periodFilterId);
                            if (iPosition >= 0) {
                                positionChanges.splice(iPosition, 1);
                            }
                            this.setState({
                                periodFilters: periodFilters
                            }, () => {
                                if (positionChanges.length === 0) {
                                    this.hideLoaderSwitch();
                                }
                            });
                        }
                    }
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSavePeriodFilter.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getPeriodAreas(this.resolveGetPeriodAreas, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
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
            areasOpenStatus,
            componentError,
            idAreaSelected,
            isLoading,
            isLoadingPeriodFilters,
            isLoadingSwitch,
            isLoadingYears,
            periodAreas,
            periodFilters,
            positionChanges,
            resources,
            withRelated,
            years,
            yearSelected
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            if (!isLoading) {
                if (idAreaSelected && periodFilters && years && yearSelected && withRelated !== undefined) {
                    contentPage = (
                        <PeriodFiltersEdit
                            isLoadingPeriodFilters={isLoadingPeriodFilters}
                            isLoadingSwitch={isLoadingSwitch}
                            isLoadingYears={isLoadingYears}
                            periodFilters={periodFilters}
                            positionChanges={positionChanges}
                            resources={resources.periodFiltersEdit}
                            title={this.getAreaName(idAreaSelected)}
                            withRelated={withRelated}
                            years={years}
                            yearSelected={yearSelected}
                            onChangeEnableDisable={this.onChangeEnableDisable}
                            onChangeYear={this.onChangeYear}
                            onClose={this.onClose}
                        />
                    );
                }
                else if (periodAreas) {
                    const periodAreasList: JSX.Element[] = periodAreas.map((subarea, iSubarea) =>
                        (
                            <React.Fragment key={`subareaContainer_${iSubarea}`}>
                                <ListItem
                                    button
                                    divider
                                    id={`subareaItem_${iSubarea}`}
                                    onClick={this.onChangeOpenStatus}
                                >
                                    <ListItemText
                                        disableTypography
                                        id={`subareaText_${iSubarea}`}
                                        key={`subareaText_${iSubarea}`}
                                        primary={(
                                            <Text size="h4">
                                                {this.getSubAreaName(subarea.subarea)}
                                            </Text>
                                        )}
                                    />
                                    {areasOpenStatus[iSubarea] ? <Icon name="chevron-up" /> : <Icon name="chevron-down" />}
                                </ListItem>
                                <Collapse in={areasOpenStatus[iSubarea]}>
                                    <List id={`areaList_${iSubarea}`}>
                                        {subarea.areas.map((area, iArea) => (
                                            <ListItem
                                                id={`areaItem_${iSubarea}_${iArea}`}
                                                noHover
                                                key={`areaItem_${iSubarea}_${iArea}`}
                                            >
                                                <ListItemText
                                                    disableTypography
                                                    id={`areaText_${iSubarea}_${iArea}`}
                                                    primary={(
                                                        <Button
                                                            data-id={area.id}
                                                            align="left"
                                                            id={`btnArea_${iSubarea}_${iArea}`}
                                                            textVariantStyling="inherit"
                                                            variant="text"
                                                            onClick={this.onClickArea}
                                                        >
                                                            {this.getAreaName(area.id)}
                                                        </Button>
                                                    )}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </React.Fragment>
                        ));

                    contentPage = (
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Text size="large">
                                    {resources.lblLegend}
                                </Text>
                                <br />
                                <List id="lstPeriodFilters">
                                    {periodAreasList}
                                </List>
                            </Grid>
                        </Grid>
                    );
                }
            }
            else {
                contentPage = (<ContainerLoader id="ldrPeriodFiltersAreas" height="md" />);
            }
        }

        return (
            <>
                {contentPage}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default PeriodFilters;