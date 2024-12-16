/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: SectionView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Internal components
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import SectionCard, { ISectionCardResProps } from '../../Generic/SectionCard';
import SectionDetailModal, { ISectionDetailModalResProps } from '../../Generic/SectionDetailModal';
import AdvancedSearchModal, { IAdvancedSearchOptionModalResProps } from '../../Registration/Courses/AdvancedSearchModal';
import ShareSearchCourseLinkModal from '../Course/ShareSearchCourseLinkModal';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Search from '@hedtech/powercampus-design-system/react/core/Search';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { IAdvancedSearch } from '../../../Types/Section/IAdvancedSearch';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';
import { ISectionResources } from '../../../Types/Resources/Search/ISectionResources';
import { ISectionSearchOption } from '../../../Types/Section/ISectionSearchOption';
import { IShareSearchCourseLinkModalResources } from '../../../Types/Resources/Search/ICourseResources';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Requests
import RequestsSection from '../../../Requests/Generic/Section';
import RequestsCourses from '../../../Requests/Registration/Courses';
import Requests from '../../../Requests/Search/Section';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface ISectionRes extends ISectionResources {
    advancedSearchModal: IAdvancedSearchOptionModalResProps;
    sectionDetailModal: ISectionDetailModalResProps;
    sectionCard: ISectionCardResProps;
    shareSearchCourseLinkModalResources: IShareSearchCourseLinkModalResources;
}

interface ISectionState {
    advancedSearchModalOpen: boolean;
    advancedSearchOptions?: ISectionSearchOption;
    advancedSearchSelected: IAdvancedSearch;
    componentError: boolean;
    cultures: ICultures;
    isEmptySearch: boolean;
    isNoResults: boolean;
    openShareSearchCourseModal: boolean;
    overallCount: number;
    sectionDetail?: ISectionDetail;
    sectionModalOpen: boolean;
    sections?: ISection[];
    urlToShare?: string;

    // #region Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    // #endregion Pagination

    resources?: ISectionRes;
}

const styles = createStyles({
    inline: {
        display: 'inline'
    },
    marginLeft: {
        display: 'inline',
        marginLeft: Tokens.sizingSmall
    }
});

type PropsWithStyles = WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
class SectionView extends React.Component<PropsWithStyles, ISectionState> {
    private idModule: string;
    private idPage: string;
    private eventId: string;
    private instructorId?: number;
    private campusId: string;
    private classLevel: string;
    private college: string;
    private creditType: string;
    private curriculum: string;
    private department: string;
    private endDate: string;
    private endTime: string;
    private eventSubType: string;
    private eventType: string;
    private generalEd: string;
    private keywords: string;
    private meeting: string;
    private nonTradProgram: string;
    private period: string;
    private population: string;
    private program: string;
    private session: string;
    private startDate: string;
    private startTime: string;
    private status: string;
    private academicTerm: string;
    private academicYear: string;

    // #region Pagination
    private preservePage: boolean;
    private preserveRowsPerPage: boolean;
    private rowsPerPageOptions: number[];
    // #endregion Pagination

    public readonly state: Readonly<ISectionState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Search';
        this.idPage = 'Section';
        this.eventId = '';
        this.campusId = '';
        this.classLevel = '';
        this.college = '';
        this.creditType = '';
        this.curriculum = '';
        this.department = '';
        this.endDate = '';
        this.endTime = '';
        this.eventSubType = '';
        this.eventType = '';
        this.generalEd = '';
        this.keywords = '';
        this.meeting = '';
        this.nonTradProgram = '';
        this.period = '';
        this.population = '';
        this.program = '';
        this.session = '';
        this.startDate = '';
        this.startTime = '';
        this.status = '';
        this.academicTerm = '';
        this.academicYear = '';

        // #region Pagination
        this.preservePage = false;
        this.preserveRowsPerPage = false;
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        // #endregion Pagination

        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): ISectionState {
        let resources: ISectionRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            advancedSearchModalOpen: false,
            advancedSearchSelected: {
                eventId: '',
                keywords: '',
                period: '',
                registrationType: 'TRAD',
                session: ''
            } as IAdvancedSearch,
            componentError: false,
            cultures: LayoutStore.getCultures(),
            isEmptySearch: false,
            isNoResults: false,
            openShareSearchCourseModal: false,
            overallCount: 0,
            sectionModalOpen: false,
            urlToShare: '',

            // #region Pagination
            page: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: [],
            // #endregion Pagination

            resources: resources
        };
    }

    // #region Events
    private setContent = (): void => {
        try {
            const {
                advancedSearchSelected,
                page,
                rowsPerPage
            } = this.state;

            LayoutActions.setLoading(true);
            Requests.getSearchOptions(
                advancedSearchSelected,
                page * rowsPerPage,
                rowsPerPage,
                this.resolveGetSections,
                this.logError
            );
        }
        catch (e) {
            this.logError(LogData.fromException(this.setContent.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private onOpenAdvancedSearchModal = (): void => {
        try {
            const {
                advancedSearchSelected
            } = this.state;

            if (advancedSearchSelected) {
                this.setState({
                    advancedSearchModalOpen: true,
                    advancedSearchSelected: advancedSearchSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenAdvancedSearchModal.name, e));
        }
    };

    private onClearSelectedOptions = (): void => {
        try {
            const optionsSelected: IAdvancedSearch | undefined = this.state.advancedSearchSelected;

            if (optionsSelected) {
                optionsSelected.campusId = '';
                optionsSelected.classLevel = '';
                optionsSelected.college = '';
                optionsSelected.creditType = '';
                optionsSelected.curriculum = '';
                optionsSelected.department = '';
                optionsSelected.endDate = '';
                optionsSelected.endTime = '';
                optionsSelected.eventId = '';
                optionsSelected.eventSubType = '';
                optionsSelected.eventType = '';
                optionsSelected.generalEd = '';
                optionsSelected.instructorId = undefined;
                optionsSelected.keywords = '';
                optionsSelected.meeting = '';
                optionsSelected.nonTradProgram = '';
                optionsSelected.period = '';
                optionsSelected.population = '';
                optionsSelected.program = '';
                optionsSelected.registrationType = 'TRAD';
                optionsSelected.session = '';
                optionsSelected.startDate = '';
                optionsSelected.startTime = '';
                optionsSelected.status = '';
                optionsSelected.academicTerm = '';
                optionsSelected.academicYear = '';
                this.setState({
                    advancedSearchSelected: optionsSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearSelectedOptions.name, e));
        }
    };

    private onNewSearch = (): void => {
        try {
            this.setState({
                overallCount: 0,
                sections: undefined
            }, this.onClearSelectedOptions);

        }
        catch (e) {
            this.logError(LogData.fromException(this.onNewSearch.name, e));
        }
    };

    private onCloseAdvancedSearchModal = (): void => {
        try {
            this.setState({
                advancedSearchModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAdvancedSearchModal.name, e));
        }
    };

    private onAdvancedSearchDateTimeChange = (date: string, id: string, _isValid: boolean): void => {
        try {
            const optionsSelected: IAdvancedSearch | undefined = this.state.advancedSearchSelected;
            if (optionsSelected) {
                const idSelected = id.replace('_AdvancedSearchModal', '');
                optionsSelected[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = date;
                this.setState({
                    advancedSearchSelected: optionsSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdvancedSearchDateTimeChange.name, e));
        }
    };

    private onAdvancedSearchDropdownChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const ids: string[] = id.split('_');
            id = ids.length > 1 ? ids[0] : id;
            const optionsSelected: IAdvancedSearch | undefined = this.state.advancedSearchSelected;
            if (optionsSelected) {
                optionsSelected[`${id[3].toLowerCase()}${id.substr(4, id.length - 4)}`] = optionSelected.value;
                this.setState({
                    advancedSearchSelected: optionsSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdvancedSearchDropdownChange.name, e));
        }
    };

    private onSearch = (): void => {
        try {
            const {
                advancedSearchSelected
            } = this.state;

            if (advancedSearchSelected.campusId
                || advancedSearchSelected.classLevel
                || advancedSearchSelected.college
                || advancedSearchSelected.creditType
                || advancedSearchSelected.curriculum
                || advancedSearchSelected.department
                || advancedSearchSelected.endDate
                || advancedSearchSelected.endTime
                || advancedSearchSelected.eventId
                || advancedSearchSelected.eventSubType
                || advancedSearchSelected.eventType
                || advancedSearchSelected.generalEd
                || advancedSearchSelected.generalEd
                || advancedSearchSelected.instructorId
                || advancedSearchSelected.keywords
                || advancedSearchSelected.meeting
                || advancedSearchSelected.nonTradProgram
                || advancedSearchSelected.period
                || advancedSearchSelected.population
                || advancedSearchSelected.program
                || advancedSearchSelected.session
                || advancedSearchSelected.startDate
                || advancedSearchSelected.startTime
                || advancedSearchSelected.status
                || advancedSearchSelected.academicTerm
                || advancedSearchSelected.academicYear
            ) {
                const newUrl = this.setQueryString('/Search/Section');
                if (newUrl) {
                    window.location.assign(newUrl);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdvancedSearch.name, e));
        }
    };

    private onAdvancedSearch = (): void => {
        try {
            const {
                advancedSearchSelected
            } = this.state;

            if (advancedSearchSelected.campusId
                || advancedSearchSelected.classLevel
                || advancedSearchSelected.college
                || advancedSearchSelected.creditType
                || advancedSearchSelected.curriculum
                || advancedSearchSelected.department
                || advancedSearchSelected.endDate
                || advancedSearchSelected.endTime
                || advancedSearchSelected.eventId
                || advancedSearchSelected.eventSubType
                || advancedSearchSelected.eventType
                || advancedSearchSelected.generalEd
                || advancedSearchSelected.generalEd
                || advancedSearchSelected.instructorId
                || advancedSearchSelected.keywords
                || advancedSearchSelected.meeting
                || advancedSearchSelected.nonTradProgram
                || advancedSearchSelected.period
                || advancedSearchSelected.population
                || advancedSearchSelected.program
                || advancedSearchSelected.session
                || advancedSearchSelected.startDate
                || advancedSearchSelected.startTime
                || advancedSearchSelected.status
                || advancedSearchSelected.academicTerm
                || advancedSearchSelected.academicYear
            ) {
                this.setState({
                    advancedSearchModalOpen: false,
                    isEmptySearch: false
                }, this.setContent);
            }
            else {
                this.setState({
                    advancedSearchModalOpen: false,
                    isEmptySearch: true
                });
            }
            const newUrl = this.setQueryString('/Search/Section');
            if (newUrl) {
                window.location.assign(newUrl);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdvancedSearch.name, e));
        }
    };

    private onAdvancedSearchTextFieldChange = (event: any): void => {
        try {
            const optionsSelected: IAdvancedSearch | undefined = this.state.advancedSearchSelected;
            let idSelected: string = event.target.id;
            idSelected = idSelected.replace('_AdvancedSearchModal', '');
            if (optionsSelected) {
                optionsSelected[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                this.setState({
                    advancedSearchSelected: optionsSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdvancedSearchTextFieldChange.name, e));
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
            this.preservePage = true;
            this.preserveRowsPerPage = true;

            this.setState({
                page: pageNumber
            }, this.setContent);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePage.name, e));
        }
    };

    private onChangeRowsPerPage = (event: any): void => {
        try {
            this.setState({
                page: 0,
                rowsPerPage: Number(event.target.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRowsPerPage.name, e));
        }
    };
    // #endregion Pagination

    private onViewSectionDetails = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const id: number = Number(event.currentTarget.dataset.id);
            LayoutActions.showPageLoader();
            RequestsSection.getSectionAnonymous(id, this.resolveGetSection);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewSectionDetails.name, e));
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

    private onCloseShareSearchModal = (): void => {
        try {
            this.setState({
                openShareSearchCourseModal: false,
                urlToShare: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseShareSearchModal.name, e));
        }
    };

    private onShareSearch = (): void => {
        try {
            const {
                advancedSearchSelected
            } = this.state;

            let urlLink: string | undefined;
            urlLink = `${window.location.origin}${Constants.webUrl}/Search/Section/Share?`;

            for (const field in advancedSearchSelected) {
                if (advancedSearchSelected[field] && field !== 'registrationType' && field !== 'endDateKey' && field !== 'startDateKey' ) {
                    urlLink = `${urlLink}&${field}=${encodeURIComponent(advancedSearchSelected[field])}`;
                }
            }
            this.setState({
                openShareSearchCourseModal: true,
                urlToShare: urlLink
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onShareSearch.name, e));
        }
    };

    private onClearCourseCode = (): void => {
        try {
            const {
                advancedSearchSelected
            } = this.state;

            if (advancedSearchSelected) {
                advancedSearchSelected.eventId = '';
            }

            this.setState({
                advancedSearchSelected
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearCourseCode.name, e));
        }
    };

    private onClearKeywords = (): void => {
        try {
            const {
                advancedSearchSelected
            } = this.state;

            if (advancedSearchSelected) {
                advancedSearchSelected.keywords = '';
            }

            this.setState({
                advancedSearchSelected
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearKeywords.name, e));
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

    private setQueryString = (pageUrl: string): string => {
        try {
            const {
                advancedSearchSelected
            } = this.state;

            let urlLink: string = '';
            urlLink = `${window.location.origin}${Constants.webUrl}${pageUrl}?`;

            for (const field in advancedSearchSelected) {
                if (advancedSearchSelected[field] && field !== 'registrationType' && field !== 'endDateKey' && field !== 'startDateKey') {
                    urlLink = `${urlLink}&${field}=${encodeURIComponent(advancedSearchSelected[field])}`;
                }
            }
            return urlLink;
        }
        catch (e) {
            this.logError(LogData.fromException(this.onShareSearch.name, e));
            return '';
        }
    };
    // #endregion Error Functions

    // #region Resolvers
    private resolveLayoutReady = (): void => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
                RequestsCourses.getAdvancedSearchOptions(this.resolveGetAdvancedSearchOptions, this.logError);
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };

    private resolveGetAdvancedSearchOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAdvancedSearchOptions.name);
            if (result?.status) {
                const {
                    advancedSearchSelected,
                    resources
                } = this.state;

                const advancedSearchOptions: ISectionSearchOption = result.data;
                if (resources && advancedSearchOptions) {
                    if (advancedSearchOptions.status) {
                        advancedSearchOptions.status[0].description = resources.advancedSearchModal.lblOpen;
                        advancedSearchOptions.status[1].description = resources.advancedSearchModal.lblClosed;
                        advancedSearchOptions.status[2].description = resources.advancedSearchModal.lblWaitlist;
                    }
                }

                // #region Set Viewbag
                advancedSearchSelected.eventId = this.eventId;
                advancedSearchSelected.instructorId = this.instructorId;
                advancedSearchSelected.campusId = this.campusId;
                advancedSearchSelected.classLevel = this.classLevel;
                advancedSearchSelected.college = this.college;
                advancedSearchSelected.creditType = this.creditType;
                advancedSearchSelected.curriculum = this.curriculum;
                advancedSearchSelected.department = this.department;
                advancedSearchSelected.endDate = this.endDate;
                advancedSearchSelected.endTime = this.endTime;
                advancedSearchSelected.eventSubType = this.eventSubType;
                advancedSearchSelected.eventType = this.eventType;
                advancedSearchSelected.generalEd = this.generalEd;
                advancedSearchSelected.keywords = this.keywords;
                advancedSearchSelected.meeting = this.meeting;
                advancedSearchSelected.nonTradProgram = this.nonTradProgram;
                advancedSearchSelected.period = this.period;
                advancedSearchSelected.population = this.population;
                advancedSearchSelected.program = this.program;
                advancedSearchSelected.session = this.session;
                advancedSearchSelected.startDate = this.startDate;
                advancedSearchSelected.startTime = this.startTime;
                advancedSearchSelected.status = this.status;
                advancedSearchSelected.academicTerm = this.academicTerm;
                advancedSearchSelected.academicYear = this.academicYear;
                // #endregion Set Viewbag

                this.setState({
                    advancedSearchOptions,
                    advancedSearchSelected
                }, () => {
                    if (this.eventId
                        || this.instructorId
                        || this.campusId
                        || this.classLevel
                        || this.college
                        || this.creditType
                        || this.curriculum
                        || this.department
                        || this.endDate
                        || this.endTime
                        || this.eventSubType
                        || this.eventType
                        || this.generalEd
                        || this.keywords
                        || this.meeting
                        || this.nonTradProgram
                        || this.period
                        || this.population
                        || this.program
                        || this.session
                        || this.startDate
                        || this.startTime
                        || this.status
                        || this.academicTerm
                        || this.academicYear
                    ) {
                        this.setContent();
                    }
                    else {
                        LayoutActions.setLoading(false);
                    }
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAdvancedSearchOptions.name, e));
        }
    };

    private resolveGetSections = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSections.name);
            if (result?.status) {
                const sections: ISection[] | undefined = result.data.sections;
                const overallCount: number = result.data.overallCount ? result.data.overallCount : 0;
                const page: number = this.preservePage ? this.state.page : 0;
                const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(overallCount);
                const rowsPerPage: number = this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];
                this.setState({
                    advancedSearchModalOpen: false,
                    isNoResults: !sections,
                    overallCount: overallCount,
                    page: page,
                    rowsPerPage: rowsPerPage,
                    rowsPerPageOptions: rowsPerPageOptions,
                    sections: sections
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSections.name, e));
        }
    };

    private resolveGetSection = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSection.name);
            if (result?.status) {
                this.setState({
                    sectionDetail: result.data,
                    sectionModalOpen: true
                }, () => {
                    LayoutActions.setLoading(false);
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSection.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: ISectionRes | undefined = LayoutStore.getResources();
        const cultures: ICultures = LayoutStore.getCultures();

        if (ready) {
            this.setState({
                cultures: cultures,
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

    public componentDidMount(): void {
        try {
            const hdnEventId: HTMLInputElement | undefined =
                document.getElementById('hdnEventId') as HTMLInputElement;
            if (hdnEventId) {
                this.eventId = String(hdnEventId.value);
                hdnEventId.remove();
            }
            const hdnInstructorId: HTMLInputElement | undefined =
                document.getElementById('hdnInstructorId') as HTMLInputElement;
            if (hdnInstructorId) {
                this.instructorId = isNaN(parseInt(hdnInstructorId.value)) ? undefined : parseInt(hdnInstructorId.value);
                hdnInstructorId.remove();
            }
            const hdnCampusId: HTMLInputElement | undefined =
                document.getElementById('hdnCampusId') as HTMLInputElement;
            if (hdnCampusId) {
                this.campusId = String(hdnCampusId.value);
                hdnCampusId.remove();
            }
            const hdnClassLevel: HTMLInputElement | undefined =
                document.getElementById('hdnClassLevel') as HTMLInputElement;
            if (hdnClassLevel) {
                this.classLevel = String(hdnClassLevel.value);
                hdnClassLevel.remove();
            }
            const hdnCollege: HTMLInputElement | undefined =
                document.getElementById('hdnCollege') as HTMLInputElement;
            if (hdnCollege) {
                this.college = String(hdnCollege.value);
                hdnCollege.remove();
            }
            const hdnCreditType: HTMLInputElement | undefined =
                document.getElementById('hdnCreditType') as HTMLInputElement;
            if (hdnCreditType) {
                this.creditType = String(hdnCreditType.value);
                hdnCreditType.remove();
            }
            const hdnCurriculum: HTMLInputElement | undefined =
                document.getElementById('hdnCurriculum') as HTMLInputElement;
            if (hdnCurriculum) {
                this.curriculum = String(hdnCurriculum.value);
                hdnCurriculum.remove();
            }
            const hdnDepartment: HTMLInputElement | undefined =
                document.getElementById('hdnDepartment') as HTMLInputElement;
            if (hdnDepartment) {
                this.department = String(hdnDepartment.value);
                hdnDepartment.remove();
            }
            const hdnEndDate: HTMLInputElement | undefined =
                document.getElementById('hdnEndDate') as HTMLInputElement;
            if (hdnEndDate) {
                this.endDate = String(hdnEndDate.value);
                hdnEndDate.remove();
            }
            const hdnEndTime: HTMLInputElement | undefined =
                document.getElementById('hdnEndTime') as HTMLInputElement;
            if (hdnEndTime) {
                this.endTime = String(hdnEndTime.value);
                hdnEndTime.remove();
            }
            const hdnEventSubType: HTMLInputElement | undefined =
                document.getElementById('hdnEventSubType') as HTMLInputElement;
            if (hdnEventSubType) {
                this.eventSubType = String(hdnEventSubType.value);
                hdnEventSubType.remove();
            }
            const hdnEventType: HTMLInputElement | undefined =
                document.getElementById('hdnEventType') as HTMLInputElement;
            if (hdnEventType) {
                this.eventType = String(hdnEventType.value);
                hdnEventType.remove();
            }
            const hdnGeneralEd: HTMLInputElement | undefined =
                document.getElementById('hdnGeneralEd') as HTMLInputElement;
            if (hdnGeneralEd) {
                this.generalEd = String(hdnGeneralEd.value);
                hdnGeneralEd.remove();
            }
            const hdnKeywords: HTMLInputElement | undefined =
                document.getElementById('hdnKeywords') as HTMLInputElement;
            if (hdnKeywords) {
                this.keywords = String(hdnKeywords.value);
                hdnKeywords.remove();
            }
            const hdnMeeting: HTMLInputElement | undefined =
                document.getElementById('hdnMeeting') as HTMLInputElement;
            if (hdnMeeting) {
                this.meeting = String(hdnMeeting.value);
                hdnMeeting.remove();
            }
            const hdnNonTradProgram: HTMLInputElement | undefined =
                document.getElementById('hdnNonTradProgram') as HTMLInputElement;
            if (hdnNonTradProgram) {
                this.nonTradProgram = String(hdnNonTradProgram.value);
                hdnNonTradProgram.remove();
            }
            const hdnPeriod: HTMLInputElement | undefined =
                document.getElementById('hdnPeriod') as HTMLInputElement;
            if (hdnPeriod) {
                this.period = String(hdnPeriod.value);
                hdnPeriod.remove();
            }
            const hdnYear: HTMLInputElement | undefined =
                document.getElementById('hdnYear') as HTMLInputElement;
            if (hdnYear) {
                this.academicYear = String(hdnYear.value);
                hdnYear.remove();
            }
            const hdnTerm: HTMLInputElement | undefined =
                document.getElementById('hdnTerm') as HTMLInputElement;
            if (hdnTerm) {
                this.academicTerm = String(hdnTerm.value);
                hdnTerm.remove();
            }
            const hdnPopulation: HTMLInputElement | undefined =
                document.getElementById('hdnPopulation') as HTMLInputElement;
            if (hdnPopulation) {
                this.population = String(hdnPopulation.value);
                hdnPopulation.remove();
            }
            const hdnProgram: HTMLInputElement | undefined =
                document.getElementById('hdnProgram') as HTMLInputElement;
            if (hdnProgram) {
                this.program = String(hdnProgram.value);
                hdnProgram.remove();
            }
            const hdnSession: HTMLInputElement | undefined =
                document.getElementById('hdnSession') as HTMLInputElement;
            if (hdnSession) {
                this.session = String(hdnSession.value);
                hdnSession.remove();
            }
            const hdnStartDate: HTMLInputElement | undefined =
                document.getElementById('hdnStartDate') as HTMLInputElement;
            if (hdnStartDate) {
                this.startDate = String(hdnStartDate.value);
                hdnStartDate.remove();
            }
            const hdnStartTime: HTMLInputElement | undefined =
                document.getElementById('hdnStartTime') as HTMLInputElement;
            if (hdnStartTime) {
                this.startTime = String(hdnStartTime.value);
                hdnStartTime.remove();
            }
            const hdnStatus: HTMLInputElement | undefined =
                document.getElementById('hdnStatus') as HTMLInputElement;
            if (hdnStatus) {
                this.status = String(hdnStatus.value);
                hdnStatus.remove();
            }
            if (this.period === '' && this.academicYear && this.academicTerm) {
                this.period = this.academicYear + '/' + this.academicTerm;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            advancedSearchModalOpen,
            advancedSearchOptions,
            advancedSearchSelected,
            componentError,
            cultures,
            isEmptySearch,
            isNoResults,
            openShareSearchCourseModal,
            overallCount,
            sectionDetail,
            sectionModalOpen,
            sections,
            urlToShare,

            // #region Pagination
            page,
            rowsPerPage,
            // #endregion Pagination

            resources
        } = this.state;

        const {
            classes,
            width
        } = this.props;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {

            const emptyOption: IDropDownOption = {
                description: resources.lblSelect,
                value: ''
            };

            // #region Sections
            let firstRow: number = page * rowsPerPage + 1;
            let lastRow: number = page * rowsPerPage + rowsPerPage;
            const totalRows: number = overallCount;
            if (lastRow > totalRows) {
                lastRow = totalRows;
            }
            if (firstRow > lastRow) {
                firstRow = lastRow;
            }

            let sectionsList: JSX.Element | undefined;
            if (sections && sections.length > 0) {
                sectionsList = (
                    <>
                        <Grid container>
                            <Grid item>
                                <Text
                                    display="inline"
                                    id="txtFormatResults"
                                >
                                    {Format.toString(resources.formatResultsShowing,
                                        [firstRow.toLocaleString(cultures.numberCulture),
                                        lastRow.toLocaleString(cultures.numberCulture),
                                        totalRows.toLocaleString(cultures.numberCulture)
                                        ])
                                    }
                                </Text>
                            </Grid>
                        </Grid>
                        {sections.map((section, sectionIndex) => (
                            <SectionCard
                                currencySymbol={cultures.currencySymbol}
                                key={`sectionCard_${sectionIndex}`}
                                id={`sectionCard_${sectionIndex}`}
                                numberCulture={cultures.numberCulture}
                                resources={resources.sectionCard}
                                section={section}
                                showYearTermSession
                                withCard
                                onViewSectionDetails={this.onViewSectionDetails}
                            />
                        ))}
                        {rowsPerPage > 0 ? (
                            <Grid container>
                                <Grid item xs>
                                    <Pagination
                                        count={totalRows}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={this.getRowsPerPageOptions(totalRows)}
                                        onPageChange={this.onChangePage}
                                        onRowsPerPageChange={this.onChangeRowsPerPage}
                                    />
                                </Grid>
                            </Grid >
                        ) : undefined}
                    </>
                );
            }
            else if (isEmptySearch) {
                sectionsList = (
                    <MessageStyled
                        classMessage="noResults"
                        message={resources.lblSpecifySearch}
                    />
                );
            } else if (isNoResults) {
                sectionsList = (
                    <Grid container>
                        <Grid item xs>
                            <Card>
                                <CardContent>
                                    <Illustration
                                        name="no-search-results"
                                        text={resources.lblNoResults}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                );
            }
            // #endregion Sections

            // #region Advanced Search Modal
            let sectionsOptionsModal: JSX.Element | undefined;
            if (advancedSearchModalOpen && advancedSearchOptions) {
                sectionsOptionsModal = (
                    <AdvancedSearchModal
                        advancedSearchSelected={advancedSearchSelected}
                        data={advancedSearchOptions}
                        dateTimeCulture={cultures.dateTimeCulture}
                        isConEd={false}
                        noDefaultPeriod
                        open={advancedSearchModalOpen}
                        resources={resources.advancedSearchModal}
                        shortDatePattern={cultures.shortDatePattern}
                        onClear={this.onClearSelectedOptions}
                        onClose={this.onCloseAdvancedSearchModal}
                        onDateTimeChange={this.onAdvancedSearchDateTimeChange}
                        onDropdownChange={this.onAdvancedSearchDropdownChange}
                        onSearch={this.onAdvancedSearch}
                        onTextFieldChange={this.onAdvancedSearchTextFieldChange}
                    />
                );
            }
            // #endregion Advanced Search Modal

            // #region Section Detail modal
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
            // #endregion Section Detail modal

            // #region Share Search
            let shareSection: JSX.Element | undefined;
            if (urlToShare) {
                shareSection = (
                    <ShareSearchCourseLinkModal
                        open={openShareSearchCourseModal}
                        urlToShare={urlToShare}
                        onCloseModal={this.onCloseShareSearchModal}
                        resources={resources.shareSearchCourseLinkModalResources}
                    />
                );
            }
            // #endregion Share Search

            contentPage = (
                <>
                    <Grid
                        container
                        spacing={3}
                        direction={isWidthUp('sm', width) ? 'row' : 'column-reverse'}
                    >
                        <Grid item xs={12} md={8} >
                            <Grid container spacing={3}>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Grid container spacing={3}>
                                                <Grid item xs>
                                                    <Search
                                                        id="txtKeywords"
                                                        value={advancedSearchSelected.keywords}
                                                        onChange={this.onAdvancedSearchTextFieldChange}
                                                        onClear={this.onClearKeywords}
                                                        onSearchInvoked={this.onAdvancedSearch}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                container
                                                justifyContent="space-between"
                                                spacing={3}
                                            >
                                                <Grid item>
                                                    <Button
                                                        align="left"
                                                        id="btnAdvancedSearch"
                                                        textVariantStyling="inherit"
                                                        variant="text"
                                                        onClick={this.onOpenAdvancedSearchModal}
                                                    >
                                                        {resources.lblAdvancedSearch}
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        align="left"
                                                        id="btnNewSearch"
                                                        textVariantStyling="inherit"
                                                        variant="text"
                                                        onClick={this.onNewSearch}
                                                    >
                                                        {resources.lblNewSearch}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs>
                                    <br />
                                    {sectionsList}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <ExpansionPanel
                                id="epSectionFilters"
                                key="epSectionFilters"
                                defaultExpanded={isWidthUp('sm', width)}
                                header={(
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Text size="h3">
                                                {resources.lblFilters}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                )}
                            >
                                <Grid container spacing={3}>
                                    <Grid item xs>
                                        <TextField
                                            id="txtEventId"
                                            placeholder={resources.lblCourseCode}
                                            type="search"
                                            onChange={this.onAdvancedSearchTextFieldChange}
                                            onEnterPress={this.onAdvancedSearch}
                                            value={advancedSearchSelected.eventId}
                                            onClearClick={this.onClearCourseCode}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs>
                                        <Dropdown
                                            emptyOption={emptyOption}
                                            id="ddlPeriod"
                                            label={resources.lblPeriod}
                                            options={advancedSearchOptions ? advancedSearchOptions.periods : []}
                                            value={advancedSearchSelected.period ? advancedSearchSelected.period :
                                                advancedSearchSelected.academicTerm && advancedSearchSelected.academicYear ?
                                                    `${advancedSearchSelected.academicYear}/${advancedSearchSelected.academicTerm}` :
                                                    undefined}
                                            onChange={this.onAdvancedSearchDropdownChange}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs>
                                        <Dropdown
                                            emptyOption={emptyOption}
                                            id="ddlSession"
                                            label={resources.lblSession}
                                            options={advancedSearchOptions ? advancedSearchOptions.sessions : []}
                                            value={advancedSearchSelected.session}
                                            onChange={this.onAdvancedSearchDropdownChange}
                                        />
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={3}>
                                    <Grid item xs>
                                        <Button
                                            className={classes.inline}
                                            color="secondary"
                                            fluid
                                            id="btnShareSearch"
                                            onClick={this.onShareSearch}
                                        >
                                            <Icon name="share" />
                                            <div className={classes.marginLeft}>
                                                {resources.lblShareSearch}
                                            </div>
                                        </Button>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={3}>
                                    <Grid item xs>
                                        <Button
                                            fluid
                                            id="btnSearch_sectionView"
                                            onClick={this.onSearch}
                                        >
                                            {resources.btnSearch}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </ExpansionPanel>
                        </Grid>
                    </Grid>
                    {sectionsOptionsModal}
                    {sectionModal}
                    {shareSection}
                </>
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

const SectionViewWithLayout = withLayout(withStyles(styles)(withWidth()(SectionView)));
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<SectionViewWithLayout />, document.getElementById('root'));