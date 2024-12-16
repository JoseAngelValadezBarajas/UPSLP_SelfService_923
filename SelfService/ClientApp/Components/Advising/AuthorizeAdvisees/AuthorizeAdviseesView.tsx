/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AuthorizeAdviseesView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Dossier from '@hedtech/powercampus-design-system/react/components/Dossier';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';

// Internal components
import AdviseesSearchOptions, { IAdviseesSearchOptionsResProps } from '../ManageAdvisees/AdviseesSearchOptions';
import AuthorizeAdviseesTable, { IAuthorizeAdviseesTableResProps } from './AuthorizeAdviseesTable';
import EmailModal from '../../Generic/EmailModal';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';

// Types
import { AdviseeList } from '../../../Types/Enum/AdviseeList';
import { DossierType } from '@hedtech/powercampus-design-system/types/Dossier/DossierType';
import { EmailProviderOption } from '../../../Types/Enum/EmailProviderOption';
import { IAdvancedSearchAdvising } from '../../../Types/Advisees/IAdvancedSearchAdvising';
import { IAdviseeAdvancedSearch } from '../../../Types/Advisees/IAdviseeAdvancedSearch';
import { IAdviseeBasicSearch } from '../../../Types/Advisees/IAdviseeBasicSearch';
import { IAdviseeClaimSetting } from '../../../Types/Advisees/IAdviseeClaimSetting';
import { IAdviseeSearchCriteria } from '../../../Types/Advisees/IAdviseeSearchCriteria';
import { IAdviseesPermissions } from '../../../Types/Permissions/IAdviseesPermissions';
import { IAuthorizeAdviseesList } from '../../../Types/Advisees/IAuthorizeAdviseesList';
import { IAuthorizeAdviseesResources } from '../../../Types/Resources/Advising/IAuthorizeAdviseesResources';
import { IAuthorizeRegistration } from '../../../Types/Advisees/IAuthorizeRegistration';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IEmailSettings } from '../../../Types/InstitutionSettings/IEmailSettings';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Requests
import Requests from '../../../Requests/Advising/AuthorizeAdvisees';
import RequestsAdvisees from '../../../Requests/Advising/ManageAdvisees';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IAuthorizeAdviseesRes extends IAuthorizeAdviseesResources {
    adviseesSearchOptions: IAdviseesSearchOptionsResProps;
    authorizeAdviseesTable: IAuthorizeAdviseesTableResProps;
}

interface IAuthorizeAdviseesState {
    advancedSearchAdvisee: IAdvancedSearchAdvising;
    adviseesList?: IAuthorizeAdviseesList;
    adviseeClaimSetting?: IAdviseeClaimSetting;
    chkHeaderMyAdvisees: boolean;
    componentError: boolean;
    cultures: ICultures;
    firstLoad: boolean;
    firstLoadHasData: boolean;
    hasSearched: boolean;
    isAdvancedSearchUsed: boolean;
    isAdviseeSelected: boolean;
    isAuthorizable: boolean;
    isUnauthorizable: boolean;
    keyword: string;
    listOptionSelected: number;
    openAdvancedSearchModal: boolean;
    openSearchConfirmation: boolean;
    openSearchModal: boolean;
    page: number;
    periods?: IDropDownOption[];
    periodSelected: number;
    permissions?: IAdviseesPermissions;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    resources?: IAuthorizeAdviseesRes;

    // #region Dossier
    dossierPersonId: number;
    openDossierModal: boolean;
    // #endregion Dossier

    // #region Email Modal
    openEmailModal: boolean;
    recipientsEmailAddresses: string[];
    // #endregion Email Modal
}

const styles = createStyles({
    cardStyle: {
        marginBottom: Tokens.spacing80
    }
});

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion Types

// #region Component
class AuthorizeAdviseesView extends React.Component<PropsWithStyles, IAuthorizeAdviseesState> {
    private idModule: string;
    private idPage: string;
    private listOptions: IDropDownOption[];
    private newAdvancedSearchAdvisee: IAdvancedSearchAdvising;
    private initialPage: number;
    private initialRowsPerPage: number;
    private rowsPerPageOptions: number[];

    public readonly state: Readonly<IAuthorizeAdviseesState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Advising';
        this.idPage = 'AuthorizeAdvisees';
        this.listOptions = [];
        this.newAdvancedSearchAdvisee = {
            advisorSelected: -2,
            campusSelected: -2,
            classLevelSelected: -2,
            classYearSelected: -2,
            collegeSelected: -2,
            curriculumSelected: -2,
            degreeSelected: -2,
            departmentSelected: -2,
            eventSelected: -2,
            filterSelected: -2,
            firstName: '',
            hasScheduleRequestsClaim: false,
            id: '',
            lastName: '',
            lastNamePrefix: '',
            middleName: '',
            programSelected: -2,
            sectionSelected: '-2',
            sessionSelected: -2,
            statusSelected: -2,
            subTypeSelected: -2,
            yearTermSelected: -2
        };
        this.initialPage = 0;
        this.initialRowsPerPage = 5;
        this.rowsPerPageOptions = [this.initialRowsPerPage, 10, 15, 20, 25, 50];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IAuthorizeAdviseesState {
        let resources: IAuthorizeAdviseesRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            advancedSearchAdvisee: { ...this.newAdvancedSearchAdvisee },
            adviseesList: undefined,
            chkHeaderMyAdvisees: false,
            componentError: false,
            cultures: LayoutStore.getCultures(),
            firstLoad: true,
            firstLoadHasData: false,
            hasSearched: false,
            isAdvancedSearchUsed: false,
            isAdviseeSelected: false,
            isAuthorizable: false,
            isUnauthorizable: false,
            keyword: '',
            listOptionSelected: -1,
            openAdvancedSearchModal: false,
            openSearchConfirmation: false,
            openSearchModal: false,
            page: this.initialPage,
            periods: undefined,
            periodSelected: 0,
            permissions: undefined,
            rowsPerPage: this.initialRowsPerPage,
            rowsPerPageOptions: [],
            resources: resources,

            // #region Dossier
            dossierPersonId: 0,
            openDossierModal: false,
            // #endregion Dossier

            // #region Email Modal
            openEmailModal: false,
            recipientsEmailAddresses: []
            // #endregion Email Modal
        };
    }

    // #region Events

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

    private onChangeListRdoB = (event: any): void => {
        try {
            this.setState({
                advancedSearchAdvisee: { ...this.newAdvancedSearchAdvisee },
                adviseesList: undefined,
                firstLoad: true,
                firstLoadHasData: false,
                hasSearched: false,
                keyword: '',
                listOptionSelected: Number(event.target.value),
                page: this.initialPage,
                rowsPerPage: this.initialRowsPerPage,
                rowsPerPageOptions: []
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeListRdoB.name, e));
        }
    };

    private onChangeCheckHeader = (): void => {
        try {
            const {
                adviseesList,
                chkHeaderMyAdvisees,
                isAuthorizable,
                isUnauthorizable
            } = this.state;

            let newAuthorizable: boolean = isAuthorizable;
            let newUnauthorizable: boolean = isUnauthorizable;
            if (adviseesList && adviseesList.advisees && adviseesList.advisees.length > 0) {
                const oneSelected: boolean = adviseesList.advisees.findIndex(advisee => advisee.checkbox) >= 0;
                const newChecked: boolean = !(chkHeaderMyAdvisees || oneSelected);
                adviseesList.advisees.forEach(advisee => {
                    advisee.checkbox = newChecked;
                    if (advisee.checkbox) {
                        if (advisee.registrationAuthorizationId) {
                            newUnauthorizable = true;
                        }
                        else {
                            newAuthorizable = true;
                        }
                    }
                });
                if (!chkHeaderMyAdvisees === false) {
                    newAuthorizable = false;
                    newUnauthorizable = false;
                }

                this.setState({
                    adviseesList: adviseesList,
                    chkHeaderMyAdvisees: newChecked,
                    isAdviseeSelected: newChecked,
                    isAuthorizable: newAuthorizable,
                    isUnauthorizable: newUnauthorizable
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckHeader.name, e));
        }
    };

    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                adviseesList,
                isAdviseeSelected,
                isAuthorizable,
                isUnauthorizable
            } = this.state;

            if (adviseesList && adviseesList.advisees && adviseesList.advisees.length > 0) {
                const id: string[] = event.target.id.split('_');
                adviseesList.advisees[Number(id[2])].checkbox = !adviseesList.advisees[Number(id[2])].checkbox;
                const oneNotSelected: boolean = adviseesList.advisees.findIndex(advisee => !advisee.checkbox) >= 0;

                let newAdviseeSelected: boolean = isAdviseeSelected;
                let newAdviseeIndex: number = -1;
                let newAuthorizable: boolean = isAuthorizable;
                let newUnauthorizable: boolean = isUnauthorizable;

                if (adviseesList.advisees[Number(id[2])].checkbox) {
                    newAdviseeSelected = true;
                    if (adviseesList.advisees[Number(id[2])].registrationAuthorizationId) {
                        newUnauthorizable = true;
                        newAuthorizable = Boolean(adviseesList.advisees.some(advisee => advisee.checkbox && !advisee.registrationAuthorizationId));
                    }
                    else {
                        newAuthorizable = true;
                        newUnauthorizable = Boolean(adviseesList.advisees.some(advisee => advisee.checkbox && advisee.registrationAuthorizationId));
                    }
                }
                else {
                    newAdviseeIndex = adviseesList.advisees.findIndex(advisee => advisee.checkbox);
                    if (newAdviseeIndex > -1) {
                        newAdviseeSelected = true;
                        if (adviseesList.advisees[newAdviseeIndex].registrationAuthorizationId) {
                            newUnauthorizable = true;
                            newAuthorizable = Boolean(adviseesList.advisees.some(advisee =>
                                advisee.checkbox && !advisee.registrationAuthorizationId));
                        }
                        else {
                            newAuthorizable = true;
                            newUnauthorizable = Boolean(adviseesList.advisees.some(advisee =>
                                advisee.checkbox && advisee.registrationAuthorizationId));
                        }
                    }
                    else {
                        newAdviseeSelected = false;
                        newAuthorizable = false;
                        newUnauthorizable = false;
                    }
                }

                this.setState({
                    adviseesList,
                    chkHeaderMyAdvisees: !oneNotSelected,
                    isAdviseeSelected: newAdviseeSelected,
                    isAuthorizable: newAuthorizable,
                    isUnauthorizable: newUnauthorizable
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onChangeDropdown = (option: IDropDownOption, id: string): void => {
        try {
            const {
                advancedSearchAdvisee,
                isAdvancedSearchUsed
            } = this.state;
            switch (id) {
                case 'ddlAuhtorizePeriods':
                    LayoutActions.setLoading(true);
                    this.setState({
                        page: this.initialPage,
                        periodSelected: Number(option.value),
                        rowsPerPage: this.initialRowsPerPage
                    }, () => {
                        if (isAdvancedSearchUsed) {
                            this.setAdvancedSearch();
                        }
                        else {
                            this.setBasicSearch();
                        }
                    });
                    break;
                case 'ddlAdviseesListOptions':
                    if (option) {
                        LayoutActions.setLoading(true);
                        RequestsAdvisees.getClaimSettings(Number(option.value), true, this.resolveGetClaimSettings);
                        this.setState({
                            advancedSearchAdvisee: { ...this.newAdvancedSearchAdvisee },
                            adviseesList: undefined,
                            firstLoad: true,
                            firstLoadHasData: false,
                            hasSearched: false,
                            keyword: '',
                            listOptionSelected: Number(option.value),
                            page: this.initialPage,
                            rowsPerPage: this.initialRowsPerPage,
                            rowsPerPageOptions: []
                        });
                    }
                    break;
                case 'ddlFilters':
                case 'ddlFilters_AdvancedSearchModal':
                    advancedSearchAdvisee.filterSelected = Number(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'ddlYearTerm':
                case 'ddlYearTerm_AdvancedSearchModal':
                    advancedSearchAdvisee.yearTermSelected = Number(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'ddlSession':
                case 'ddlSession_AdvancedSearchModal':
                    advancedSearchAdvisee.sessionSelected = Number(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'ddlEvent':
                case 'ddlEvent_AdvancedSearchModal':
                    advancedSearchAdvisee.eventSelected = Number(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'ddlSubType':
                case 'ddlSubType_AdvancedSearchModal':
                    advancedSearchAdvisee.subTypeSelected = Number(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'ddlSection':
                case 'ddlSection_AdvancedSearchModal':
                    advancedSearchAdvisee.sectionSelected = String(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'ddlName':
                case 'ddlName_AdvancedSearchModal':
                    advancedSearchAdvisee.advisorSelected = Number(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'ddlClassYear':
                case 'ddlClassYear_AdvancedSearchModal':
                    advancedSearchAdvisee.classYearSelected = Number(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'ddlCollege':
                case 'ddlCollege_AdvancedSearchModal':
                    advancedSearchAdvisee.collegeSelected = Number(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'ddlCampus':
                case 'ddlCampus_AdvancedSearchModal':
                    advancedSearchAdvisee.campusSelected = Number(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'ddlProgram':
                case 'ddlProgram_AdvancedSearchModal':
                    advancedSearchAdvisee.programSelected = Number(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'ddlDepartment':
                case 'ddlDepartment_AdvancedSearchModal':
                    advancedSearchAdvisee.departmentSelected = Number(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'ddlDegree':
                case 'ddlDegree_AdvancedSearchModal':
                    advancedSearchAdvisee.degreeSelected = Number(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'ddlClassLevel':
                case 'ddlClassLevel_AdvancedSearchModal':
                    advancedSearchAdvisee.classLevelSelected = Number(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'ddlCurriculum':
                case 'ddlCurriculum_AdvancedSearchModal':
                    advancedSearchAdvisee.curriculumSelected = Number(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'ddlStatus':
                case 'ddlStatus_AdvancedSearchModal':
                    advancedSearchAdvisee.statusSelected = Number(option.value);
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropdown.name, e));
        }
    };

    // #region Pagination
    private getRowsPerPageOptions = (maxValue: number): number[] => {
        const rowsPerPageOptions: number[] = [];
        try {
            this.rowsPerPageOptions.forEach(option => {
                if (option < maxValue) {
                    rowsPerPageOptions.push(option);
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.getRowsPerPageOptions.name, e));
        }
        return rowsPerPageOptions;
    };

    private onChangePage = (_event: any, pageNumber: number): void => {
        try {
            this.setState({
                page: pageNumber
            }, () => {
                if (this.state.isAdvancedSearchUsed) {
                    this.setAdvancedSearch();
                }
                else {
                    this.setBasicSearch();
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePage.name, e));
        }
    };

    private onChangeRowsPerPage = (event: any): void => {
        try {
            this.setState({
                page: this.initialPage,
                rowsPerPage: Number(event.target.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRowsPerPage.name, e));
        }
    };
    // #endregion Pagination

    private onClickAuthorize = (): void => {
        try {
            const {
                adviseesList,
                periodSelected
            } = this.state;

            const authorizeRegistrations: IAuthorizeRegistration[] = [];
            if (adviseesList && adviseesList.advisees && adviseesList.advisees.length > 0) {
                adviseesList.advisees.forEach(advisee => {
                    if (advisee.checkbox && !advisee.registrationAuthorizationId) {
                        authorizeRegistrations.push({
                            personId: advisee.personId,
                            sessionPeriodId: periodSelected
                        });
                    }
                });
            }
            if (authorizeRegistrations.length > 0) {
                LayoutActions.setLoading(true);
                Requests.saveAuthorization(authorizeRegistrations,
                    this.resolveSaveAuthorization,
                    this.logError
                );
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickAuthorize.name, e));
        }
    };

    private onClickUnauthorize = (): void => {
        try {
            const {
                adviseesList,
                periodSelected
            } = this.state;

            const authorizeRegistrations: IAuthorizeRegistration[] = [];
            if (adviseesList && adviseesList.advisees && adviseesList.advisees.length > 0) {
                adviseesList.advisees.forEach(advisee => {
                    if (advisee.checkbox && advisee.registrationAuthorizationId) {
                        authorizeRegistrations.push({
                            authorizationRegistrationId: advisee.registrationAuthorizationId,
                            personId: advisee.personId,
                            sessionPeriodId: periodSelected
                        });
                    }
                });
            }
            if (authorizeRegistrations.length > 0) {
                LayoutActions.setLoading(true);
                Requests.deleteAuthorization(authorizeRegistrations,
                    this.resolveDeleteAuthorization,
                    this.logError
                );
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickUnauthorize.name, e));
        }
    };

    private onClear = (): void => {
        try {
            this.setState({
                keyword: ''
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClear.name, e));
        }
    };

    private onClearClickModal = (): void => {
        try {
            this.setState({
                keyword: ''
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearClickModal.name, e));
        }
    };

    private onCloseModal = (modalName: string): void => {
        try {
            switch (modalName) {
                case 'AdvancedSearch':
                    this.setState({
                        openAdvancedSearchModal: false
                    });
                    break;
                case 'AdviseesSearchModal':
                    this.setState({
                        openSearchModal: false
                    });
                    break;
                case 'ConfirmationModal':
                    this.setState({
                        openSearchConfirmation: false
                    });
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseModal.name, e));
        }
    };

    private onButtonClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                advancedSearchAdvisee,
                keyword
            } = this.state;
            const id: string = event.currentTarget.id;
            switch (id) {
                case 'btnClear':
                case 'btnClear_AdvancedSearchModal':
                    const newAdvancedSearchAdvisee: IAdvancedSearchAdvising = {
                        ...this.newAdvancedSearchAdvisee,
                        campus: advancedSearchAdvisee.campus,
                        classLevels: advancedSearchAdvisee.classLevels,
                        classYears: advancedSearchAdvisee.classYears,
                        colleges: advancedSearchAdvisee.colleges,
                        curriculums: advancedSearchAdvisee.curriculums,
                        degrees: advancedSearchAdvisee.degrees,
                        departments: advancedSearchAdvisee.departments,
                        events: advancedSearchAdvisee.events,
                        hasScheduleRequestsClaim: advancedSearchAdvisee.hasScheduleRequestsClaim,
                        programs: advancedSearchAdvisee.programs,
                        sections: advancedSearchAdvisee.sections,
                        sessions: advancedSearchAdvisee.sessions,
                        status: advancedSearchAdvisee.status,
                        subTypes: advancedSearchAdvisee.subTypes,
                        yearTerms: advancedSearchAdvisee.yearTerms
                    };
                    this.setState({
                        advancedSearchAdvisee: newAdvancedSearchAdvisee
                    });
                    break;
                case 'btnSearch':
                case 'btnSearch_AdvancedSearchModal':
                    if (advancedSearchAdvisee.advisorSelected > -2
                        || advancedSearchAdvisee.campusSelected > -2
                        || advancedSearchAdvisee.classLevelSelected > -2
                        || advancedSearchAdvisee.classYearSelected > -2
                        || advancedSearchAdvisee.collegeSelected > -2
                        || advancedSearchAdvisee.curriculumSelected > -2
                        || advancedSearchAdvisee.degreeSelected > -2
                        || advancedSearchAdvisee.departmentSelected > -2
                        || advancedSearchAdvisee.eventSelected > -2
                        || advancedSearchAdvisee.filterSelected > -2
                        || advancedSearchAdvisee.programSelected > -2
                        || advancedSearchAdvisee.sectionSelected != '-2'
                        || advancedSearchAdvisee.sessionSelected > -2
                        || advancedSearchAdvisee.statusSelected > -2
                        || advancedSearchAdvisee.subTypeSelected > -2
                        || advancedSearchAdvisee.yearTermSelected > -2
                        || advancedSearchAdvisee.firstName
                        || advancedSearchAdvisee.id
                        || advancedSearchAdvisee.lastName
                        || advancedSearchAdvisee.lastNamePrefix
                        || advancedSearchAdvisee.middleName
                    ) {
                        this.setState({
                            openAdvancedSearchModal: false,
                            openSearchModal: false,
                            page: this.initialPage,
                            rowsPerPage: this.initialRowsPerPage
                        }, this.setAdvancedSearch);
                    }
                    break;
                case 'btnRetrieveAll':
                    this.setState({
                        openSearchConfirmation: true
                    });
                    break;
                case 'btnApply':
                    if (keyword && keyword !== '') {
                        this.setState({
                            openSearchModal: false,
                            page: this.initialPage,
                            rowsPerPage: this.initialRowsPerPage
                        }, this.setBasicSearch);
                    }
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onButtonClick.name, e));
        }
    };

    private onOpenModal = (event: React.MouseEvent<HTMLAnchorElement>): void => {
        try {
            const id: string = event.currentTarget.id;
            switch (id) {
                case 'lnkAdvancedSearch':
                    const {
                        listOptionSelected
                    } = this.state;
                    LayoutActions.setLoading(true);
                    RequestsAdvisees.getAdvancedSearchOptions(listOptionSelected,
                        this.resolveGetAdvancedSearch);
                    break;
                case 'btnFilterSearch':
                    this.setState({
                        openSearchModal: true
                    });
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenModal.name, e));
        }
    };

    private onChangeTextField = (event: any): void => {
        try {
            const {
                advancedSearchAdvisee
            } = this.state;
            const id: string = event.target.id;
            switch (id) {
                case 'txtSearchOptions':
                    this.setState({
                        keyword: event.target.value
                    });
                    break;
                case 'txtLastName':
                case 'txtLastName_AdvancedSearchModal':
                    advancedSearchAdvisee.lastName = event.target.value;
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'txtLastNamePrefix':
                case 'txtLastNamePrefix_AdvancedSearchModal':
                    advancedSearchAdvisee.lastNamePrefix = event.target.value;
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'txtMiddleName':
                case 'txtMiddleName_AdvancedSearchModal':
                    advancedSearchAdvisee.middleName = event.target.value;
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'txtFirstName':
                case 'txtFirstName_AdvancedSearchModal':
                    advancedSearchAdvisee.firstName = event.target.value;
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
                case 'txtId':
                case 'txtId_AdvancedSearchModal':
                    advancedSearchAdvisee.id = event.target.value;
                    this.setState({
                        advancedSearchAdvisee
                    });
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onEnterSearch = (searchValue: string): void => {
        try {
            const {
            } = this.state;
            const keyword: string = searchValue;
            if (keyword && keyword !== '') {
                this.setState({
                    page: this.initialPage,
                    rowsPerPage: this.initialRowsPerPage
                }, this.setBasicSearch);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEnterSearch.name, e));
        }
    };

    private onSearchAll = (): void => {
        try {
            this.setState({
                keyword: '',
                openAdvancedSearchModal: false,
                openSearchConfirmation: false,
                openSearchModal: false,
                page: this.initialPage,
                rowsPerPage: this.initialRowsPerPage
            }, this.setBasicSearch);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearchAll.name, e));
        }
    };

    // #region Email Modal
    private onOpenEmailModal = (emailAddresses: string[]): void => {
        try {
            const {
                adviseeClaimSetting
            } = this.state;

            if (adviseeClaimSetting) {
                const emailSettings: IEmailSettings = adviseeClaimSetting.emailSettings;
                if (emailSettings.emailProvider === EmailProviderOption.SelfService) {
                    LayoutActions.showPageLoader();
                    this.setState({
                        recipientsEmailAddresses: emailAddresses,
                        openEmailModal: true
                    });
                }
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

    // #region Functions
    private setBasicSearch = (): void => {
        try {
            const {
                keyword,
                listOptionSelected,
                page,
                periodSelected,
                rowsPerPage
            } = this.state;

            if (listOptionSelected >= 0 && listOptionSelected <= 8) {
                LayoutActions.setLoading(true);
                this.setState({
                    advancedSearchAdvisee: { ...this.newAdvancedSearchAdvisee },
                    isAdvancedSearchUsed: false
                });
                const adviseeSearch: IAdviseeBasicSearch = {
                    keyword: keyword,
                    length: rowsPerPage,
                    sessionPeriodId: periodSelected,
                    startIndex: page * rowsPerPage,
                    view: listOptionSelected
                };
                RequestsAdvisees.getAdvisees(adviseeSearch,
                    this.resolveGetAdvisees);
            } else {
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setBasicSearch.name, e));
        }
    };

    private setAdvancedSearch = (): void => {
        try {
            const {
                advancedSearchAdvisee,
                listOptionSelected,
                page,
                periodSelected,
                rowsPerPage
            } = this.state;

            if (listOptionSelected >= 0 && listOptionSelected <= 8) {
                const newCriteria: IAdviseeSearchCriteria = {
                    advisorId: advancedSearchAdvisee.advisorSelected,
                    campus: advancedSearchAdvisee.campusSelected,
                    classLevel: advancedSearchAdvisee.classLevelSelected,
                    classYear: advancedSearchAdvisee.classYearSelected,
                    college: advancedSearchAdvisee.collegeSelected,
                    curriculum: advancedSearchAdvisee.curriculumSelected,
                    degree: advancedSearchAdvisee.degreeSelected,
                    department: advancedSearchAdvisee.departmentSelected,
                    displayName: advancedSearchAdvisee.firstName,
                    eventId: advancedSearchAdvisee.eventSelected,
                    eventSubtype: advancedSearchAdvisee.subTypeSelected,
                    fulltimePartTime: advancedSearchAdvisee.statusSelected,
                    lastName: advancedSearchAdvisee.lastName,
                    lastNamePrefix: advancedSearchAdvisee.lastNamePrefix,
                    middleName: advancedSearchAdvisee.middleName,
                    peopleId: advancedSearchAdvisee.id,
                    program: advancedSearchAdvisee.programSelected,
                    section: advancedSearchAdvisee.sectionSelected,
                    sessionId: advancedSearchAdvisee.sessionSelected,
                    termPeriodId: advancedSearchAdvisee.yearTermSelected
                };
                LayoutActions.setLoading(true);
                this.setState({
                    isAdvancedSearchUsed: true,
                    keyword: ''
                }, () => {
                    const adviseeAdvancedSearch: IAdviseeAdvancedSearch = {
                        criteria: newCriteria,
                        filter: advancedSearchAdvisee.filterSelected,
                        length: rowsPerPage,
                        sessionPeriodId: periodSelected,
                        startIndex: page * rowsPerPage,
                        view: listOptionSelected
                    };
                    RequestsAdvisees.postAdvancedSearch(adviseeAdvancedSearch,
                        this.resolveGetAdvisees
                    );
                });
            }
            else {
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setAdvancedSearch.name, e));
        }
    };
    // #endregion Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetAdvisees = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAdvisees.name);

            if (result?.status) {
                const adviseesList: IAuthorizeAdviseesList = result.data;
                if (adviseesList && adviseesList.advisees && adviseesList.advisees.length > 0) {
                    const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(adviseesList.overallCount);

                    adviseesList.advisees.forEach(advisee => {
                        advisee.isApproved = Boolean(advisee.registrationAuthorizationId);
                        advisee.checkbox = false;
                    });

                    this.setState({
                        adviseesList: adviseesList,
                        chkHeaderMyAdvisees: false,
                        hasSearched: true,
                        isAdviseeSelected: false,
                        isAuthorizable: false,
                        isUnauthorizable: false,
                        rowsPerPageOptions: rowsPerPageOptions
                    }, () => LayoutActions.setLoading(false));

                    // If it is the first load, we save it if the response has records
                    if (this.state.firstLoad) {
                        this.setState({
                            firstLoad: false,
                            firstLoadHasData: adviseesList.advisees.length > 0
                        });
                    }
                }
                else {
                    this.setState({
                        adviseesList: undefined,
                        firstLoad: false,
                        firstLoadHasData: false,
                        hasSearched: true,
                        isAuthorizable: false,
                        isUnauthorizable: false
                    }, () => LayoutActions.setLoading(false));
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAdvisees.name, e));
        }
    };

    private resolveGetPeriods = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPeriods.name);

            if (result?.status) {
                const periods: IDropDownOption[] = result.data;
                if (periods && periods.length > 0) {
                    this.setState({
                        periods: periods,
                        periodSelected: Number(periods[0].value)
                    }, () => LayoutActions.setLoading(false));
                }
                else {
                    LayoutActions.setLoading(false);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPeriods.name, e));
        }
    };

    private resolveGetAdvancedSearch = (json: string): void => {
        try {
            const {
                advancedSearchAdvisee
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAdvancedSearch.name);

            if (result?.status) {
                const newAdvancedSearchAdvisee: IAdvancedSearchAdvising = {
                    ...advancedSearchAdvisee,
                    advisors: result.data.advisors,
                    campus: result.data.campus,
                    classLevels: result.data.classLevels,
                    classYears: result.data.classYears,
                    colleges: result.data.colleges,
                    curriculums: result.data.curriculums,
                    degrees: result.data.degrees,
                    departments: result.data.departments,
                    events: result.data.events,
                    hasScheduleRequestsClaim: result.data.hasScheduleRequestsClaim,
                    programs: result.data.programs,
                    sections: result.data.sections,
                    sessions: result.data.sessions,
                    status: result.data.status,
                    subTypes: result.data.subTypes,
                    yearTerms: result.data.yearTerms
                };
                this.setState({
                    advancedSearchAdvisee: newAdvancedSearchAdvisee
                }, () => {
                    LayoutActions.setLoading(false);
                    this.setState({
                        openAdvancedSearchModal: true
                    });
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAdvancedSearch.name, e));
        }
    };

    private resolveSaveAuthorization = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveAuthorization.name);

            if (result?.status && result.data) {
                const {
                    adviseesList,
                    resources
                } = this.state;
                let newIsUnauthorized: boolean = false;
                let newIsAuthorized: boolean = false;
                const authorizeRegistrations: IAuthorizeRegistration[] = result.data;
                if (adviseesList && adviseesList.advisees && adviseesList.advisees.length > 0) {
                    adviseesList.advisees.forEach(advisee => {
                        const authRegistration: IAuthorizeRegistration | undefined = authorizeRegistrations.find(x =>
                            advisee.personId === x.personId);
                        if (authRegistration) {
                            advisee.registrationAuthorizationId = authRegistration.authorizationRegistrationId;
                        }
                        if (advisee.checkbox) {
                            if (advisee.registrationAuthorizationId) {
                                newIsUnauthorized = true;
                            } else {
                                newIsAuthorized = true;
                            }
                        }
                    });
                }
                this.setState({
                    adviseesList,
                    isAuthorizable: newIsAuthorized,
                    isUnauthorizable: newIsUnauthorized
                }, () => {
                    LayoutActions.setLoading(false);
                    if (resources) {
                        LayoutActions.setAlert({
                            message: resources.authorizeAdviseesTable.lblAuthorized,
                            messageType: ResultType.success,
                            snackbar: true
                        });
                    }
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveAuthorization.name, e));
        }
    };

    private resolveDeleteAuthorization = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveDeleteAuthorization.name);

            if (result?.status && result.data) {
                const {
                    adviseesList,
                    resources
                } = this.state;
                const authorizeRegistrations: IAuthorizeRegistration[] = result.data;
                let newIsUnauthorized: boolean = false;
                let newIsAuthorized: boolean = false;
                if (adviseesList && adviseesList.advisees && adviseesList.advisees.length > 0) {
                    adviseesList.advisees.forEach(advisee => {
                        const authRegistration: IAuthorizeRegistration | undefined = authorizeRegistrations.find(x =>
                            advisee.personId === x.personId);
                        if (authRegistration) {
                            advisee.registrationAuthorizationId = undefined;
                        }
                        if (advisee.checkbox) {
                            if (advisee.registrationAuthorizationId) {
                                newIsUnauthorized = true;
                            } else {
                                newIsAuthorized = true;
                            }
                        }
                    });
                }
                this.setState({
                    adviseesList,
                    isAuthorizable: newIsAuthorized,
                    isUnauthorizable: newIsUnauthorized
                }, () => {
                    LayoutActions.setLoading(false);
                    if (resources) {
                        LayoutActions.setAlert({
                            message: resources.authorizeAdviseesTable.lblUnauthorized,
                            messageType: ResultType.success,
                            snackbar: true
                        });
                    }
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveDeleteAuthorization.name, e));
        }
    };

    private resolveGetClaimSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetClaimSettings.name);

            if (result?.status) {
                this.setState({
                    adviseeClaimSetting: result.data
                }, () => {
                    Requests.getPeriods(this.resolveGetPeriods, this.logError);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetClaimSettings.name, e));
        }
    };

    private resolveLayoutReady = (): void => {
        try {
            const {
                permissions,
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;

                if (permissions) {
                    if (permissions.myAdvisees) {
                        this.listOptions.push({
                            description: resources.lblMyAdvisees,
                            value: AdviseeList.myAdvisees
                        });
                    }
                    if (permissions.myStudents) {
                        this.listOptions.push({
                            description: resources.lblMyStudents,
                            value: AdviseeList.myStudents
                        });
                    }
                    if (permissions.myAssociations) {
                        this.listOptions.push({
                            description: resources.lblMyAssociations,
                            value: AdviseeList.myAssociations
                        });
                    }
                    if (permissions.allStudents) {
                        this.listOptions.push({
                            description: resources.lblAllStudents,
                            value: AdviseeList.allStudents
                        });
                    }
                    if (permissions.formerAdvisees) {
                        this.listOptions.push({
                            description: resources.lblFormerAdvisees,
                            value: AdviseeList.formerAdvisees
                        });
                    }
                    if (permissions.alumni) {
                        this.listOptions.push({
                            description: resources.lblAlumni,
                            value: AdviseeList.alumni
                        });

                    }
                    if (permissions.myCampus) {
                        this.listOptions.push({
                            description: resources.lblMyCampus,
                            value: AdviseeList.myCampus
                        });
                    }
                    if (permissions.myDepartment) {
                        this.listOptions.push({
                            description: resources.lblMyDepartment,
                            value: AdviseeList.myDepartment
                        });
                    }
                    if (permissions.mySharedAdvisees) {
                        this.listOptions.push({
                            description: resources.lblMySharedAdvisees,
                            value: AdviseeList.mySharedAdvisees
                        });
                    }

                    const hdnTabId: HTMLInputElement | undefined =
                        document.getElementById('hdnTabId') as HTMLInputElement;
                    let listOptionSelected: number = -1;
                    if (this.listOptions.length > 0) {
                        if (hdnTabId && hdnTabId.value && this.listOptions.some(option => Number(option.value) === Number(hdnTabId.value))) {
                            listOptionSelected = Number(hdnTabId.value);
                            hdnTabId.remove();
                        }
                        else {
                            listOptionSelected = Number(this.listOptions[0].value);
                        }
                    }
                    this.setState({
                        listOptionSelected
                    }, () => {
                        if (listOptionSelected > -1) {
                            RequestsAdvisees.getClaimSettings(listOptionSelected, true, this.resolveGetClaimSettings);
                        }
                        else {
                            Requests.getPeriods(this.resolveGetPeriods, this.logError);
                        }
                    });
                }
                else {
                    this.logError(LogData.noPermissions(this.resolveLayoutReady.name));
                }
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IAuthorizeAdviseesRes | undefined = LayoutStore.getResources();
        const permissions: IAdviseesPermissions | undefined = LayoutStore.getPermissions();
        const cultures: ICultures = LayoutStore.getCultures();
        if (ready) {
            this.setState({
                cultures: cultures,
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
            advancedSearchAdvisee,
            adviseesList,
            adviseeClaimSetting,
            chkHeaderMyAdvisees,
            componentError,
            cultures,
            firstLoadHasData,
            hasSearched,
            isAdviseeSelected,
            isAuthorizable,
            isUnauthorizable,
            keyword,
            listOptionSelected,
            openAdvancedSearchModal,
            openSearchModal,
            openSearchConfirmation,
            page,
            periods,
            periodSelected,
            rowsPerPage,
            rowsPerPageOptions,
            resources,

            // #region Dossier
            dossierPersonId,
            openDossierModal,
            // #endregion Dossier

            // #region Email Modal
            recipientsEmailAddresses,
            openEmailModal
            // #endregion Email Modal
        } = this.state;

        const {
            classes
        } = this.props;

        const onCloseConfirmation = (): void => {
            this.onCloseModal('ConfirmationModal');
        };

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            let content: JSX.Element | undefined;
            if (listOptionSelected !== -1) {
                if ((adviseesList
                    && adviseesList.advisees
                    && adviseesList.advisees.length > 0
                    && adviseeClaimSetting)
                    || firstLoadHasData
                    && (periods && periods.length > 0)) {
                    if (listOptionSelected >= 0 && listOptionSelected <= 8) {
                        content = (
                            <>
                                <br />
                                <Grid container>
                                    <Grid item xs>
                                        <AuthorizeAdviseesTable
                                            adviseeClaimSetting={adviseeClaimSetting}
                                            adviseesList={adviseesList}
                                            checkboxHeader={chkHeaderMyAdvisees}
                                            isAdviseeSelected={isAdviseeSelected}
                                            isAuthorizable={isAuthorizable}
                                            isUnauthorizable={isUnauthorizable}
                                            numberCulture={cultures.numberCulture}
                                            page={page}
                                            periods={periods}
                                            periodSelected={periodSelected}
                                            resources={resources.authorizeAdviseesTable}
                                            rowsPerPage={rowsPerPage}
                                            onChangeChkbox={this.onChangeCheckbox}
                                            onChangeChkboxAll={this.onChangeCheckHeader}
                                            onChangeDropdown={this.onChangeDropdown}
                                            onClickAuthorize={this.onClickAuthorize}
                                            onClickUnauthorize={this.onClickUnauthorize}
                                            onOpenEmailModal={this.onOpenEmailModal}
                                            onViewDossier={this.onViewDossier}
                                        />
                                    </Grid >
                                </Grid >
                                {rowsPerPage > 0 && (
                                    <Grid container>
                                        <Grid item xs>
                                            <Pagination
                                                count={adviseesList ? adviseesList.overallCount : 0}
                                                page={page}
                                                rowsPerPage={rowsPerPage}
                                                rowsPerPageOptions={rowsPerPageOptions}
                                                onPageChange={this.onChangePage}
                                                onRowsPerPageChange={this.onChangeRowsPerPage}
                                            />
                                        </Grid>
                                    </Grid >
                                )}
                            </>
                        );
                    }
                }
                else {
                    if (!hasSearched) {
                        content = (
                            <Illustration
                                color="secondary"
                                name="no-search-results"
                                text={resources.lblSearchInstructions}
                            />
                        );
                    }
                    else {
                        content = (
                            <Illustration
                                color="secondary"
                                name="no-search-results"
                                text={resources.lblNoAdvisees}
                            />
                        );
                    }
                }
            }
            contentPage = (listOptionSelected > -1 ? (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <AdviseesSearchOptions
                                advancedSearchAdvisee={advancedSearchAdvisee}
                                hidePendingSchedulesOption={true}
                                keyword={keyword}
                                listOptions={this.listOptions}
                                listOptionSelected={listOptionSelected}
                                openAdvancedSearchModal={openAdvancedSearchModal}
                                openSearchModal={openSearchModal}
                                resources={resources.adviseesSearchOptions}
                                onButtonClick={this.onButtonClick}
                                onChangeDropdown={this.onChangeDropdown}
                                onChangeListRdoB={this.onChangeListRdoB}
                                onChangeTextField={this.onChangeTextField}
                                onClear={this.onClear}
                                onCloseModal={this.onCloseModal}
                                onEnterSearch={this.onEnterSearch}
                                onOpenModal={this.onOpenModal}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Card className={classes.cardStyle}>
                                <CardContent>
                                    {content}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Dossier
                        key={`Dossier_${dossierPersonId}`}
                        dossierType={DossierType.Student}
                        open={openDossierModal}
                        personId={dossierPersonId}
                        onClose={this.onCloseDossierModal}
                    />
                    {openSearchConfirmation && (
                        <ConfirmationDialog
                            contentText={resources.lblConfirmationSearch}
                            open={openSearchConfirmation}
                            primaryActionOnClick={this.onSearchAll}
                            primaryActionText={resources.lblSearch}
                            secondaryActionOnClick={onCloseConfirmation}
                            secondaryActionText={resources.lblCancel}
                            title={resources.lblConfirmTitle}
                        />
                    )}
                    {openEmailModal && adviseeClaimSetting && (
                        <EmailModal
                            emailSettings={adviseeClaimSetting.emailSettings}
                            onClose={this.onCloseEmailModal}
                            recipientsEmailAddresses={recipientsEmailAddresses}
                        />
                    )}
                </>
            ) : (
                    <Illustration
                        color="secondary"
                        name="under-maintenance"
                        text={resources.lblEmptyState}
                    />
                )
            );
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

const AuthorizeAdviseesViewWithLayout = withLayout(withStyles(styles)(AuthorizeAdviseesView));
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<AuthorizeAdviseesViewWithLayout />, document.getElementById('root'));