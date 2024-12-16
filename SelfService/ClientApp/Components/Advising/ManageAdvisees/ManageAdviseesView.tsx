/* Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
 * File: ManageAdviseesView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';

// Core components
import Dossier from '@hedtech/powercampus-design-system/react/components/Dossier';
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';

// Internal components
import AdviseesSearchOptions, { IAdviseesSearchOptionsResProps } from './AdviseesSearchOptions';
import AdviseesTable, { IAdviseesTableResProps } from './AdviseesTable';
import AdvisorsModal from './AdvisorsModal';
import DownloadModal from '../../Generic/DownloadModal';
import EmailModal from '../../Generic/EmailModal';
import PeopleSearchAssignModal, { IPeopleSearchAssignModalExtraResources, PeopleSearchAssignModalType } from '../../Generic/PeopleSearchAssignModal';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { hasSpecialChars, SpecialCharsRegExp } from '@hedtech/powercampus-design-system/helpers/CharRegExp';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import QueryString from '@hedtech/powercampus-design-system/helpers/QueryString';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Storage
import Storage from '@hedtech/powercampus-design-system/storage';
import StorageKeys from '@hedtech/powercampus-design-system/storage/StorageKeys';

// Types
import { AdviseeList } from '../../../Types/Enum/AdviseeList';
import { DossierType } from '@hedtech/powercampus-design-system/types/Dossier/DossierType';
import { DownloadView } from '../../../Types/Enum/DownloadView';
import { EmailProviderOption } from '../../../Types/Enum/EmailProviderOption';
import { IAdvancedSearchAdvising } from '../../../Types/Advisees/IAdvancedSearchAdvising';
import { IAdviseeAdvancedSearch } from '../../../Types/Advisees/IAdviseeAdvancedSearch';
import { IAdviseeBasicSearch } from '../../../Types/Advisees/IAdviseeBasicSearch';
import { IAdviseeClaimSetting } from '../../../Types/Advisees/IAdviseeClaimSetting';
import { IAdviseeSearch } from '../../../Types/Advisees/IAdviseeSearch';
import { IAdviseeSearchCriteria } from '../../../Types/Advisees/IAdviseeSearchCriteria';
import { IAdviseesPermissions } from '../../../Types/Permissions/IAdviseesPermissions';
import { IAdviseeWarning } from '../../../Types/Advisees/IAdviseeWarning';
import { IAdvising } from '../../../Types/Advising/IAdvising';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption, IDropDownOptionDownload } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IEmailSettings } from '../../../Types/InstitutionSettings/IEmailSettings';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IManageAdvisee } from '../../../Types/Advisees/IManageAdvisee';
import { IManageAdviseesList } from '../../../Types/Advisees/IManageAdviseesList';
import { IManageAdviseesResources } from '../../../Types/Resources/Advising/IManageAdviseesResources';
import { ImpersonateProcess } from '../../../Types/Enum/ImpersonateProcess';
import { IShareAdvisees } from '../../../Types/Advisees/IShareAdvisees';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Requests
import Requests from '../../../Requests/Advising/ManageAdvisees';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion

// #region Internal types
interface IManageAdviseesRes extends IManageAdviseesResources {
    adviseesSearchOptions: IAdviseesSearchOptionsResProps;
    adviseesTable: IAdviseesTableResProps;
    peopleSearchAssignModal: IPeopleSearchAssignModalExtraResources;
}

interface IManageAdviseesState {
    advancedSearchAdvisee: IAdvancedSearchAdvising;
    adviseeClaimSetting?: IAdviseeClaimSetting;
    adviseesList?: IManageAdviseesList;
    advisors?: IAvatar[];
    basicSearchSelected?: IAdvising;
    chkHeaderMyAdvisees: boolean;
    componentError: boolean;
    cultures: ICultures;
    firstLoad: boolean;
    firstLoadHasData: boolean;
    hasSearched: boolean;
    isAdvancedSearchUsed: boolean;
    isAdviseeSelected?: boolean;
    isRemoveAdvisee: boolean;
    keyword: string;
    listOptionSelected: number;
    openAdvancedSearchModal: boolean;
    openAdvisorModal: boolean;
    openRemoveConfirmation: boolean;
    openSearchConfirmation: boolean;
    openSearchModal: boolean;
    openShareAdviseeModal: boolean;
    page: number;
    permissions?: IAdviseesPermissions;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    selectedAdvisees: IManageAdvisee[];
    resources?: IManageAdviseesRes;

    // #region Dossier
    dossierPersonId: number;
    openDossierModal: boolean;
    // #endregion Dossier

    // #region Download Modal
    defaultName: string;
    downloadView: number;
    openDownloadModal: boolean;
    nameSelected: string;
    overallCount: number;
    typeSelected: number;
    // #endregion Download Modal

    // #region Email Modal
    openEmailModal: boolean;
    recipientsEmailAddresses: string[];
    // #endregion Email Modal
}

const styles = createStyles({
    cardStyleSM: {
        marginBottom: Tokens.spacing80
    }
});

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion

// #region Component
class ManageAdviseesView extends React.Component<PropsWithStyles, IManageAdviseesState> {
    private abortController: AbortController;
    private idModule: string;
    private idPage: string;
    private listOptions: IDropDownOptionDownload[];
    private newAdvancedSearchAdvisee: IAdvancedSearchAdvising;
    private initialPage: number;
    private initialRowsPerPage: number;
    private rowsPerPageOptions: number[];
    private layoutResources?: ILayoutResources;
    private adviseeSearch?: IAdviseeSearch;

    public readonly state: Readonly<IManageAdviseesState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.abortController = new AbortController();
        this.idModule = 'Advising';
        this.idPage = 'ManageAdvisees';
        this.listOptions = [];
        this.layoutResources = LayoutStore.getResourcesLayout();
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

    private getInitialState(): IManageAdviseesState {
        let resources: IManageAdviseesRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            advancedSearchAdvisee: { ...this.newAdvancedSearchAdvisee },
            adviseesList: undefined,
            basicSearchSelected: {
                displayName: '',
                lastName: '',
                lastNamePrefix: '',
                middleName: '',
                peopleId: ''
            } as IAdvising,
            chkHeaderMyAdvisees: false,
            componentError: false,
            cultures: LayoutStore.getCultures(),
            firstLoad: true,
            firstLoadHasData: false,
            hasSearched: false,
            isAdvancedSearchUsed: false,
            isAdviseeSelected: false,
            isRemoveAdvisee: false,
            keyword: '',
            listOptionSelected: -1,
            openAdvancedSearchModal: false,
            openAdvisorModal: false,
            openRemoveConfirmation: false,
            openSearchConfirmation: false,
            openSearchModal: false,
            openShareAdviseeModal: false,
            page: this.initialPage,
            permissions: undefined,
            resources: resources,
            rowsPerPage: this.initialRowsPerPage,
            rowsPerPageOptions: [],
            selectedAdvisees: [],

            // #region Dossier
            dossierPersonId: 0,
            openDossierModal: false,
            // #endregion Dossier

            // #region Download Modal
            defaultName: this.idPage,
            downloadView: 0,
            nameSelected: this.idPage,
            openDownloadModal: false,
            overallCount: 0,
            typeSelected: 0,
            // #endregion Download Modal

            // #region Email Modal
            openEmailModal: false,
            recipientsEmailAddresses: []
            // #endregion Email Modal
        };
    }

    // #region Events
    private onAbortRequest = (): void => {
        try {
            this.abortController.abort();
            this.abortController = new AbortController();
            LayoutActions.showPageLoader();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAbortRequest.name, e));
        }
    };

    // #region Pagination
    private getRowsPerPageOptions(maxValue: number): number[] {
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
    }

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

    // #region Advisee Search
    private onChangeDropdown = (option: IDropDownOption, id: string): void => {
        try {
            const {
                advancedSearchAdvisee
            } = this.state;
            switch (id) {
                case 'ddlAdviseesListOptions':
                    this.abortController.abort();
                    this.abortController = new AbortController();

                    // Clear url
                    this.adviseeSearch = undefined;
                    window.history.pushState(null, '', 'ManageAdvisees');

                    if (option) {
                        LayoutActions.showPageLoader();
                        Requests.getClaimSettings(Number(option.value), false, this.resolveGetClaimSettings);
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

    private onChangeListRdoB = (event: any): void => {
        try {
            this.abortController.abort();
            this.abortController = new AbortController();
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
                case 'btnRemoveSelected':
                    this.setState({
                        openRemoveConfirmation: true
                    });
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onButtonClick.name, e));
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

    private onCloseModal = (modalName: string): void => {
        try {
            switch (modalName) {
                case 'AdvancedSearch':
                    this.setState({
                        openAdvancedSearchModal: false,
                        openSearchModal: false
                    });
                    break;
                case 'AdviseesSearchModal':
                    this.setState({
                        openSearchConfirmation: false,
                        openSearchModal: false
                    });
                    break;
                case 'Advisors':
                    this.setState({
                        openAdvisorModal: false
                    });
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseModal.name, e));
        }
    };

    private onCloseConfirmation = (): void => {
        try {
            this.setState({
                openSearchConfirmation: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseConfirmation.name, e));
        }
    };

    private onRemoveAdvisees = (): void => {
        try {
            const {
                adviseesList
            } = this.state;

            if (adviseesList) {
                const selectedAdvisees: number[] = [];
                adviseesList.advisees.forEach(advisee => {
                    if (advisee.checkbox) {
                        selectedAdvisees.push(advisee.personId);
                    }
                });

                LayoutActions.showPageLoader();
                this.setState({
                    openRemoveConfirmation: false,
                    isRemoveAdvisee: true
                });

                Requests.removeAdvisees(selectedAdvisees, this.resolveRemoveAdvisees);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRemoveAdvisees.name, e));
        }
    };

    private onCloseRemoveConfirmation = (): void => {
        try {
            this.setState({
                openRemoveConfirmation: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseRemoveConfirmation.name, e));
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

    private onOpenModal = (event: React.MouseEvent<HTMLAnchorElement>): void => {
        try {
            const id: string = event.currentTarget.id;
            switch (id) {
                case 'lnkAdvancedSearch':
                    const {
                        listOptionSelected
                    } = this.state;
                    LayoutActions.showPageLoader();
                    Requests.getAdvancedSearchOptions(listOptionSelected,
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
    // #endregion Advisee Search

    // #region My Advisees
    private onChangeCheckHeader = (): void => {
        try {
            const {
                adviseesList,
                chkHeaderMyAdvisees
            } = this.state;

            if (adviseesList) {
                const oneSelected: boolean = adviseesList.advisees.findIndex(advisee => advisee.checkbox) >= 0;
                const newChecked: boolean = !(chkHeaderMyAdvisees || oneSelected);

                adviseesList.advisees.forEach(advisee => advisee.checkbox = newChecked);
                this.setState({
                    adviseesList: adviseesList,
                    chkHeaderMyAdvisees: newChecked,
                    isAdviseeSelected: newChecked
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
            } = this.state;

            if (adviseesList && adviseesList.advisees && adviseesList.advisees.length > 0) {
                const id: string[] = event.target.id.split('_');
                adviseesList.advisees[Number(id[2])].checkbox = !adviseesList.advisees[Number(id[2])].checkbox;
                const oneNotSelected: boolean = adviseesList.advisees.findIndex(advisee => !advisee.checkbox) >= 0;
                this.setState({
                    adviseesList: adviseesList,
                    chkHeaderMyAdvisees: !oneNotSelected,
                    isAdviseeSelected: adviseesList.advisees.find(advisee => advisee.checkbox) ? true : false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };
    // #endregion My Advisees

    // #region Download Modal
    private onChangeFileType = (optionSelected: IDropDownOption): void => {
        try {
            this.setState({
                typeSelected: Number(optionSelected.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFileType.name, e));
        }
    };

    private onChangeFileName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            if (hasSpecialChars(event.target.value)) {
                event.target.value = event.target.value.replace(SpecialCharsRegExp, '');
            }
            this.setState({
                nameSelected: event.target.value
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFileName.name, e));
        }
    };

    private onCloseDownloadModal = (): void => {
        try {
            this.setState({
                openDownloadModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDownloadModal.name, e));
        }
    };

    private onDownloadModal = (): void => {
        try {
            const {
                listOptionSelected
            } = this.state;

            const nameIndex: number = this.listOptions.findIndex(view => view.value === listOptionSelected);
            let view: number = 0;
            let name: string = this.idPage;
            if (nameIndex > -1 && this.listOptions[nameIndex].downloadText) {
                name = this.listOptions[nameIndex].downloadText + '_' + Moment().format('YYYYMMDDHHmm');
            }

            switch (listOptionSelected) {
                case AdviseeList.myAdvisees:
                    view = DownloadView.manageMyAdvisees;
                    break;
                case AdviseeList.myStudents:
                    view = DownloadView.manageMyStudents;
                    break;
                case AdviseeList.myAssociations:
                    view = DownloadView.manageMyAssociations;
                    break;
                case AdviseeList.allStudents:
                    view = DownloadView.manageAllStudents;
                    break;
                case AdviseeList.formerAdvisees:
                    view = DownloadView.manageFormerAdvisees;
                    break;
                case AdviseeList.alumni:
                    view = DownloadView.manageAlumni;
                    break;
                case AdviseeList.myCampus:
                    view = DownloadView.manageMyCampus;
                    break;
                case AdviseeList.myDepartment:
                    view = DownloadView.manageMyDepartment;
                    break;
                case AdviseeList.mySharedAdvisees:
                    view = DownloadView.manageMySharedAdvisees;
                    break;
            }

            this.setState({
                defaultName: name,
                downloadView: view,
                nameSelected: name,
                openDownloadModal: true,
                typeSelected: 0
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDownloadModal.name, e));
        }
    };
    // #endregion  Download Modal

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

    //#region People Search modal
    private onClickShareAdvisee = (): void => {
        try {
            const {
                adviseesList,
            } = this.state;
            this.setState({
                openShareAdviseeModal: true,
                selectedAdvisees: adviseesList?.advisees.filter(advisee => advisee.checkbox) ?? []
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickShareAdvisee.name, e));
        }
    };

    private onClickGetAdvisors = (event: React.MouseEvent<HTMLAnchorElement>): void => {
        try {
            const personId: number = Number(event.currentTarget.dataset.personId);
            if (personId > 0) {
                LayoutActions.showPageLoader();
                Requests.getAdvisors(personId, this.resolveGetAdvisors);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickShareAdvisee.name, e));
        }
    };

    private onClosePeopleSearchModal = (): void => {
        try {
            this.setState({
                openShareAdviseeModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePeopleSearchModal.name, e));
        }
    };

    private onFinishAdd = (): void => {
        try {
            if (this.layoutResources) {
                LayoutActions.setAlert({
                    message: this.layoutResources.lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);
            }
            LayoutActions.showPageLoader();
            if (this.state.isAdvancedSearchUsed) {
                this.setAdvancedSearch();
            }
            else {
                this.setBasicSearch();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onFinishAdd.name, e));
        }
    };

    private onAdd = (selectedPerson: any, resolver: any): void => {
        try {
            const {
                selectedAdvisees,
            } = this.state;

            if (selectedAdvisees.length > 0) {
                const shareAdvisees: IShareAdvisees = {
                    advisorId: selectedPerson.personId,
                    sharedAdviseeId: 0,
                    studentIds: selectedAdvisees.map(a => a.personId)
                };
                Requests.saveSharedAdvisees(shareAdvisees, resolver);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdd.name, e));
        }
    };
    //#endregion People Search modal

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
                rowsPerPage
            } = this.state;

            this.abortController.abort();
            this.abortController = new AbortController();
            if (listOptionSelected >= 0 && listOptionSelected <= 8) {
                LayoutActions.showPageLoader();
                this.setState({
                    advancedSearchAdvisee: { ...this.newAdvancedSearchAdvisee },
                    isAdvancedSearchUsed: false
                });
                const adviseeBasicSearch: IAdviseeBasicSearch = {
                    keyword: keyword,
                    length: rowsPerPage,
                    startIndex: page * rowsPerPage,
                    view: listOptionSelected
                };
                this.adviseeSearch = {
                    ...adviseeBasicSearch,
                    isAdvancedSearch: false
                };

                Requests.getAdvisees(adviseeBasicSearch,
                    this.resolveGetAdvisees
                );
            }
            else {
                LayoutActions.hidePageLoader();
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
                rowsPerPage
            } = this.state;

            this.abortController.abort();
            this.abortController = new AbortController();
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
                LayoutActions.showPageLoader();
                let filteredCriteria: IAdviseeSearchCriteria = {};
                for (let key in newCriteria) {
                    if (newCriteria[key] === -2 || newCriteria[key] === '') {
                        continue;
                    }
                    filteredCriteria[key] = newCriteria[key];
                }
                this.setState({
                    isAdvancedSearchUsed: true,
                    keyword: ''
                }, () => {
                    const adviseeAdvancedSearch: IAdviseeAdvancedSearch = {
                        criteria: newCriteria,
                        filter: advancedSearchAdvisee.filterSelected,
                        length: rowsPerPage,
                        startIndex: page * rowsPerPage,
                        view: listOptionSelected
                    };

                    this.adviseeSearch = {
                        ...filteredCriteria,
                        filter: advancedSearchAdvisee.filterSelected,
                        isAdvancedSearch: true,
                        length: rowsPerPage,
                        startIndex: page * rowsPerPage,
                        view: listOptionSelected,
                    };

                    Requests.postAdvancedSearch(adviseeAdvancedSearch, this.resolveGetAdvisees);
                });
            }
            else {
                LayoutActions.hidePageLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setAdvancedSearch.name, e));
        }
    };

    // Functions for errors
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }

    private showError(message?: string): void {
        LayoutActions.setAlert({
            message: message,
            messageType: ResultType.error
        } as IAlert);
    }
    // #endregion Functions

    // #region Resolvers
    private resolveGetAdvisees = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAdvisees.name);
            if (result?.status) {
                const {
                    listOptionSelected
                } = this.state;

                const adviseesList: IManageAdviseesList = result.data;
                if (adviseesList?.advisees && adviseesList.advisees.length > 0) {
                    const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(adviseesList.overallCount);
                    // Clean all checkboxes
                    adviseesList.advisees.forEach(advisee => {
                        advisee.checkbox = false;
                    });

                    this.setState({
                        adviseesList: adviseesList,
                        chkHeaderMyAdvisees: false,
                        hasSearched: true,
                        isAdviseeSelected: false,
                        rowsPerPageOptions
                    },
                        () => {
                            LayoutActions.hidePageLoader();
                            if (this.state.isRemoveAdvisee && this.layoutResources) {
                                LayoutActions.setAlert({
                                    message: this.layoutResources.lblSuccessSave,
                                    messageType: ResultType.success,
                                    snackbar: true
                                } as IAlert);
                            }

                            this.setState({
                                isRemoveAdvisee: false
                            });
                        }
                    );

                    // If it is the first load, we save it if the response has records
                    if (this.state.firstLoad) {
                        this.setState({
                            firstLoad: false,
                            firstLoadHasData: adviseesList.advisees.length > 0
                        });
                    }

                    // Send requests for the warnings for each row in the list
                    if (adviseesList.showAttendanceWarning
                        || adviseesList.showGradesWarning
                        || adviseesList.showViolationWarning) {
                        adviseesList.advisees.forEach(advisee => {
                            const data: IImpersonateInfo = {
                                personId: advisee.personId,
                                process: ImpersonateProcess.Advising,
                                viewId: listOptionSelected
                            }
                            Requests.getAdviseeWarnings(this.resolveGetAdviseeWarnings, this.abortController.signal, data);
                        });
                    }
                }
                else {
                    this.setState({
                        adviseesList: undefined,
                        firstLoad: false,
                        firstLoadHasData: false,
                        hasSearched: true,
                        isRemoveAdvisee: false
                    }, () => LayoutActions.hidePageLoader());
                }

                if (this.adviseeSearch) {
                    this.adviseeSearch.overallCount = adviseesList.overallCount;
                    const adviseeSearchFiltered = { ...this.adviseeSearch };
                    delete adviseeSearchFiltered.overallCount;
                    const urlToSearch: string = QueryString.setCurrentUrl(adviseeSearchFiltered);
                    Storage.saveToStorage(StorageKeys.urlAdvisees, urlToSearch);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAdvisees.name, e));
        }
    };

    private resolveGetAdviseeWarnings = (json: string): void => {
        try {
            const {
                adviseesList
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAdviseeWarnings.name);

            if (result?.status) {
                const warnings: IAdviseeWarning = result.data;
                if (warnings && adviseesList && adviseesList.advisees) {
                    for (const advisee of adviseesList.advisees) {
                        if (advisee.personId === warnings.personId) {
                            advisee.warnings = warnings;
                            this.setState({
                                adviseesList: adviseesList
                            });
                            break;
                        }
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAdviseeWarnings.name, e));
        }
    };

    private resolveGetClaimSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetClaimSettings.name);

            if (result?.status) {
                const adviseeClaimSetting: IAdviseeClaimSetting | undefined = result.data;
                this.setState({
                    adviseeClaimSetting
                }, () => {
                    if (this.adviseeSearch) {
                        let page: number = 0;
                        if (this.adviseeSearch.length && this.adviseeSearch.length > 0 && this.adviseeSearch.startIndex) {
                            page = Math.floor(this.adviseeSearch.startIndex / this.adviseeSearch.length);
                        }

                        if (this.adviseeSearch.isAdvancedSearch) {
                            this.setState({
                                advancedSearchAdvisee: {
                                    advisorSelected: this.adviseeSearch.advisorId ?? -2,
                                    campusSelected: this.adviseeSearch.campus ?? -2,
                                    classLevelSelected: this.adviseeSearch.classLevel ?? -2,
                                    classYearSelected: this.adviseeSearch.classYear ?? -2,
                                    collegeSelected: this.adviseeSearch.college ?? -2,
                                    curriculumSelected: this.adviseeSearch.curriculum ?? -2,
                                    degreeSelected: this.adviseeSearch.degree ?? -2,
                                    departmentSelected: this.adviseeSearch.department ?? -2,
                                    firstName: this.adviseeSearch.displayName,
                                    filterSelected: this.adviseeSearch.filter ?? -2,
                                    eventSelected: this.adviseeSearch.eventId ?? -2,
                                    subTypeSelected: this.adviseeSearch.eventSubtype ?? -2,
                                    statusSelected: this.adviseeSearch.fulltimePartTime ?? -2,
                                    lastName: this.adviseeSearch.lastName,
                                    lastNamePrefix: this.adviseeSearch.lastNamePrefix,
                                    middleName: this.adviseeSearch.middleName,
                                    id: this.adviseeSearch.peopleId,
                                    programSelected: this.adviseeSearch.program ?? -2,
                                    sectionSelected: this.adviseeSearch.section ?? '-2',
                                    sessionSelected: this.adviseeSearch.sessionId ?? -2,
                                    yearTermSelected: this.adviseeSearch.termPeriodId ?? -2,
                                    hasScheduleRequestsClaim: adviseeClaimSetting?.hasScheduleRequestsClaim ?? false
                                },
                                listOptionSelected: this.adviseeSearch.view,
                                page: page,
                                rowsPerPage: (this.adviseeSearch.length ?? this.adviseeSearch.overallCount) ?? 0
                            }, this.setAdvancedSearch);
                        }
                        else {
                            this.setState({
                                keyword: this.adviseeSearch.keyword ?? '',
                                listOptionSelected: this.adviseeSearch.view,
                                page: page,
                                rowsPerPage: (this.adviseeSearch.length ?? this.adviseeSearch.overallCount) ?? 0
                            }, this.setBasicSearch);
                        }
                    }
                    else {
                        LayoutActions.hidePageLoader();
                    }
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetClaimSettings.name, e));
        }
    };

    private resolveGetAdvisors = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAdvisors.name);

            if (result?.status) {
                this.setState({
                    advisors: result.data.advisors,
                    openAdvisorModal: true
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAdvisors.name, e));
        }
    };

    private resolveRemoveAdvisees = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveRemoveAdvisees.name);

            if (result?.status) {
                if (result.data) {
                    if (this.state.isAdvancedSearchUsed) {
                        this.setAdvancedSearch();
                    }
                    else {
                        this.setBasicSearch();
                    }
                }
                else {
                    this.showError();
                    this.setState({
                        isRemoveAdvisee: false
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveRemoveAdvisees.name, e));
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
                    LayoutActions.hidePageLoader();
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
                            downloadText: resources.lblMyAdviseesDownload,
                            value: AdviseeList.myAdvisees
                        });
                    }
                    if (permissions.myStudents) {
                        this.listOptions.push({
                            description: resources.lblMyStudents,
                            downloadText: resources.lblMyStudentsDownload,
                            value: AdviseeList.myStudents
                        });
                    }
                    if (permissions.myAssociations) {
                        this.listOptions.push({
                            description: resources.lblMyAssociations,
                            downloadText: resources.lblMyAssociationsDownload,
                            value: AdviseeList.myAssociations
                        });
                    }
                    if (permissions.allStudents) {
                        this.listOptions.push({
                            description: resources.lblAllStudents,
                            downloadText: resources.lblAllStudentsDownload,
                            value: AdviseeList.allStudents
                        });
                    }
                    if (permissions.formerAdvisees) {
                        this.listOptions.push({
                            description: resources.lblFormerAdvisees,
                            downloadText: resources.lblFormerAdviseesDownload,
                            value: AdviseeList.formerAdvisees
                        });
                    }
                    if (permissions.alumni) {
                        this.listOptions.push({
                            description: resources.lblAlumni,
                            downloadText: resources.lblAlumniDownload,
                            value: AdviseeList.alumni
                        });
                    }
                    if (permissions.myCampus) {
                        this.listOptions.push({
                            description: resources.lblMyCampus,
                            downloadText: resources.lblMyCampusDownload,
                            value: AdviseeList.myCampus
                        });
                    }
                    if (permissions.myDepartment) {
                        this.listOptions.push({
                            description: resources.lblMyDepartment,
                            downloadText: resources.lblMyDepartmentDownload,
                            value: AdviseeList.myDepartment
                        });
                    }
                    if (permissions.mySharedAdvisees) {
                        this.listOptions.push({
                            description: resources.lblMySharedAdvisees,
                            downloadText: resources.lblMySharedAdviseesDownload,
                            value: AdviseeList.mySharedAdvisees,
                        });
                    }

                    const hdnAdviseeSearch: HTMLInputElement | undefined =
                        document.getElementById('hdnAdviseeSearchId') as HTMLInputElement;

                    let listOptionSelected: number = -1;
                    if (this.listOptions.length > 0) {
                        if (hdnAdviseeSearch?.value) {
                            this.adviseeSearch = JSON.parse(String(hdnAdviseeSearch.value));
                            if (this.adviseeSearch && !this.adviseeSearch.length) {
                                this.adviseeSearch.length = this.initialRowsPerPage;
                            }
                            hdnAdviseeSearch.remove();
                            listOptionSelected = this.adviseeSearch?.view ?? 0;
                        }
                        else {
                            listOptionSelected = Number(this.listOptions[0].value);
                        }
                    }
                    this.setState({
                        listOptionSelected
                    }, () => {
                        if (listOptionSelected > -1) {
                            Requests.getClaimSettings(listOptionSelected, false, this.resolveGetClaimSettings);
                        }
                        else {
                            LayoutActions.hidePageLoader();
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

    // State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IManageAdviseesRes | undefined = LayoutStore.getResources();
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

    // Lifecycle
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

    public render(): JSX.Element {
        const {
            advancedSearchAdvisee,
            adviseesList,
            adviseeClaimSetting,
            advisors,
            chkHeaderMyAdvisees,
            componentError,
            cultures,
            firstLoadHasData,
            hasSearched,
            isAdviseeSelected,
            keyword,
            listOptionSelected,
            openAdvancedSearchModal,
            openAdvisorModal,
            openRemoveConfirmation,
            openSearchConfirmation,
            openSearchModal,
            openShareAdviseeModal,
            page,
            permissions,
            rowsPerPage,
            rowsPerPageOptions,
            selectedAdvisees,
            resources,

            // #region Dossier
            dossierPersonId,
            openDossierModal,
            // #endregion Dossier

            // #region Download Modal
            defaultName,
            downloadView,
            openDownloadModal,
            nameSelected,
            typeSelected,
            // #endregion Download Modal

            // #region Email Modal
            recipientsEmailAddresses,
            openEmailModal
            // #endregion Email Modal
        } = this.state;

        const {
            classes
        } = this.props;

        let peopleSearchModal: JSX.Element | undefined;
        let stepContent: JSX.Element[] | undefined;
        let contentPage: JSX.Element | undefined;
        if (!componentError && resources && permissions) {
            let content: JSX.Element | undefined;
            let hasFacultyDossier: boolean = false;
            switch (listOptionSelected) {
                case 0:
                    if (permissions.myAdviseesFacultyDossier) {
                        hasFacultyDossier = true;
                    }
                    break;
                case 1:
                    if (permissions.myStudentsFacultyDossier) {
                        hasFacultyDossier = true;
                    }
                    break;
                case 2:
                    if (permissions.myAssociationsFacultyDossier) {
                        hasFacultyDossier = true;
                    }
                    break;
                case 3:
                    if (permissions.allStudentsFacultyDossier) {
                        hasFacultyDossier = true;
                    }
                    break;
                case 4:
                    if (permissions.formerAdviseesFacultyDossier) {
                        hasFacultyDossier = true;
                    }
                    break;
                case 5:
                    if (permissions.alumniFacultyDossier) {
                        hasFacultyDossier = true;
                    }
                    break;
                case 6:
                    if (permissions.myDepartmentFacultyDossier) {
                        hasFacultyDossier = true;
                    }
                    break;
                case 7:
                    if (permissions.myCampusFacultyDossier) {
                        hasFacultyDossier = true;
                    }
                    break;
            };
            if (listOptionSelected !== -1) {
                if ((adviseesList
                    && adviseesList.advisees
                    && adviseesList.advisees.length > 0
                    && adviseeClaimSetting)
                    || firstLoadHasData) {
                    if (listOptionSelected >= 0 && listOptionSelected <= 8) {
                        content = (
                            <>
                                <br />
                                <Grid container>
                                    <Grid item xs>
                                        <AdviseesTable
                                            adviseeClaimSetting={adviseeClaimSetting}
                                            adviseesList={adviseesList}
                                            checkboxHeader={chkHeaderMyAdvisees}
                                            id="tblAdvising"
                                            isAdviseeSelected={isAdviseeSelected}
                                            listOptionSelected={listOptionSelected}
                                            numberCulture={cultures.numberCulture}
                                            page={page}
                                            permissions={permissions}
                                            resources={resources.adviseesTable}
                                            rowsPerPage={rowsPerPage}
                                            onAbortRequest={this.onAbortRequest}
                                            onChangeChkbox={this.onChangeCheckbox}
                                            onChangeChkHeader={this.onChangeCheckHeader}
                                            onClickGetAdvisors={this.onClickGetAdvisors}
                                            onClickRemove={this.onButtonClick}
                                            onOpenEmailModal={this.onOpenEmailModal}
                                            onClickShareAdvisee={this.onClickShareAdvisee}
                                            onDownloadModal={this.onDownloadModal}
                                            onViewDossier={this.onViewDossier}
                                        />
                                    </Grid>
                                </Grid>
                                {rowsPerPage > 0 && (
                                    <Grid container>
                                        <Grid item xs>
                                            <Pagination
                                                count={adviseesList && adviseesList.overallCount
                                                    ? adviseesList.overallCount : 0}
                                                page={page}
                                                rowsPerPage={rowsPerPage}
                                                rowsPerPageOptions={rowsPerPageOptions}
                                                onPageChange={this.onChangePage}
                                                onRowsPerPageChange={this.onChangeRowsPerPage}
                                                rowsPerPageShowAll
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

            if (openShareAdviseeModal) {
                stepContent = selectedAdvisees.map((advisee) => (
                    <Grid container key={`avatar_${advisee.personId}`}>
                        <Grid item xs={12}>
                            <AvatarText
                                ButtonProps={adviseeClaimSetting?.hasDossierClaim ? {
                                    'data-id': advisee.personId,
                                    id: `btnShareDossier_${advisee.personId}`,
                                    onClick: this.onViewDossier
                                } : undefined}
                                avatarInfo={advisee}
                            />
                            <Divider noMarginBottom />
                        </Grid>
                    </Grid>
                ));
            }
            peopleSearchModal = (
                <PeopleSearchAssignModal
                    hasDossierClaim={hasFacultyDossier}
                    stepChildren={stepContent}
                    extraResources={resources.peopleSearchAssignModal}
                    open={openShareAdviseeModal}
                    type={PeopleSearchAssignModalType.ShareAdvisee}
                    afterClose={this.onClosePeopleSearchModal}
                    afterFinish={this.onFinishAdd}
                    onAdd={this.onAdd}
                />
            );

            contentPage = (listOptionSelected > -1 ? (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <AdviseesSearchOptions
                                advancedSearchAdvisee={advancedSearchAdvisee}
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
                            <Card className={classes.cardStyleSM}>
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
                    {openDownloadModal && (
                        <DownloadModal
                            adviseeSearch={this.adviseeSearch}
                            defaultFileName={defaultName}
                            isModalOpen={openDownloadModal}
                            nameSelected={nameSelected}
                            view={downloadView}
                            onChangeFileName={this.onChangeFileName}
                            onChangeFileType={this.onChangeFileType}
                            onCloseModal={this.onCloseDownloadModal}
                            typeSelected={typeSelected}
                        />
                    )}
                    {openSearchConfirmation && (
                        <ConfirmationDialog
                            contentText={resources.lblConfirmationSearch}
                            open={openSearchConfirmation}
                            primaryActionOnClick={this.onSearchAll}
                            primaryActionText={resources.lblSearch}
                            secondaryActionOnClick={this.onCloseConfirmation}
                            secondaryActionText={resources.lblCancel}
                            title={resources.lblConfirmTitle}
                        />
                    )}
                    {openRemoveConfirmation && (
                        <ConfirmationDialog
                            contentText={resources.lblConfirmationRemove}
                            open={openRemoveConfirmation}
                            primaryActionOnClick={this.onRemoveAdvisees}
                            primaryActionText={resources.lblRemove}
                            secondaryActionOnClick={this.onCloseRemoveConfirmation}
                            secondaryActionText={resources.lblCancel}
                            title={resources.lblConfirmRemoveTitle}
                        />
                    )}
                    {openAdvisorModal && (
                        <AdvisorsModal
                            advisors={advisors ?? []}
                            hasDossierClaim={false} // Implementation in a different story
                            lblSharedWith={resources.adviseesTable.adviseesContent.lblSharedWith}
                            open={openAdvisorModal}
                            onClose={this.onCloseModal}
                            onViewDossier={this.onViewDossier}
                        />
                    )}
                    {openEmailModal && adviseeClaimSetting && (
                        <EmailModal
                            emailSettings={adviseeClaimSetting.emailSettings}
                            onClose={this.onCloseEmailModal}
                            recipientsEmailAddresses={recipientsEmailAddresses}
                        />
                    )}
                    {peopleSearchModal}
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

const ManageAdviseesViewWithLayout = withLayout(withStyles(styles)(ManageAdviseesView));
// #endregion

// RenderDOM: Component
ReactDOM.render(<ManageAdviseesViewWithLayout />, document.getElementById('root'));