/* Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
* File: TransferCoursesView.tsx
* Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import SimpleDialog from '@hedtech/powercampus-design-system/react/core/SimpleDialog';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import Search from '@hedtech/powercampus-design-system/react/core/Search';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import CourseDetailModal, { ICourseDetailModalResProps } from '../../Generic/CourseDetailModal';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ITransferCourseEquivalenciesResources } from '../../../Types/Resources/Planning/ITransferCourseEquivalenciesResources';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ICourseCatalog } from '../../../Types/Course/ICourseCatalog';
import { ITransferCourseEvent } from '../../../Types/Course/ITransferCourseEvent';
import { IOrganization } from '../../../Types/Organization/IOrganization';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { withWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Requests
import Requests from '../../../Requests/Planning/TransferCourses';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface ITransferCoursesRes extends ITransferCourseEquivalenciesResources {
    courseDetailModal: ICourseDetailModalResProps;
}

interface ITransferCoursesState {
    anchorEl: any;
    courseDetail?: ICourseCatalog;
    courseDetailModalOpen?: boolean;
    cultures: ICultures;
    isLoading: boolean;
    keywords?: string;
    openInfo: boolean;
    organizationCity?: string;
    organizationCountry?: string;
    organizationId?: number;
    organizationList?: IOrganization[];
    organizationName?: string;
    organizationTotal?: number;
    organizationState?: string;
    showCourses: boolean;
    transferCourseEvents?: ITransferCourseEvent[];
    transferCourseTotal?: number;

    // #region Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];

    pageCourse: number;
    rowsPerPageCourse: number;
    rowsPerPageOptionsCourse: number[];

    preservePage: boolean;
    preserveRowsPerPage: boolean;
    // #endregion Pagination

    resources?: ITransferCoursesRes;
}

const styles = ((theme: Theme) => createStyles({
    border: {
        [theme.breakpoints.down('xs')]: {
            borderColor: Tokens.colorBrandNeutral400
        },
        borderColor: `${Tokens.colorBrandNeutral300}!important`,
        borderRadius: `${Tokens.spacing40}!important`,
        borderStyle: 'solid',
        borderWidth: 'thin',
        display: 'inline-flex',
        marginRight: '3.4375rem',
        marginTop: `${Tokens.spacing40}!important`,
        padding: '0.625rem',
        width: '100%'
    },
    container: {
        [theme.breakpoints.down('xs')]: {
            marginLeft: `${Tokens.spacing40}!important`,
            marginTop: `${Tokens.spacing40}!important`
        },
        justifyContent: 'flex',
        width: '100%'
    },
    icon: {
        cursor: 'pointer'
    },
    iconContainer: {
        alignItems: 'center',
        display: 'inline-flex'
    },
    iconCourse: {
        display: 'inline-flex',
        paddingRight: `${Tokens.spacing40}!important`
    },
    iconInfo: {
        display: 'inline-flex',
        verticalAlign: 'middle'
    },
    justifyCenter: {
        display: 'flex',
        justifyContent: 'center'
    },
    marginButton: {
        display: 'flex',
        marginBottom: 0
    },
    marginTop: {
        marginTop: 0
    },
    marginTopContainer: {
        [theme.breakpoints.down('xs')]: {
            marginTop: 0,
            paddingTop: 0
        },
        marginTop: `${Tokens.spacing40}!important`
    },
    popperText: {
        maxWidth: '15rem'
    },
    staticWidth1: {
        [theme.breakpoints.down('xs')]: {
            marginBottom: 0,
            paddingBottom: 0,
            width: '100%'
        },
        width: '30%'
    },
    staticWidth2: {
        [theme.breakpoints.down('xs')]: {
            marginTop: 0,
            paddingTop: 0,
            width: '100%'
        },
        width: '70%'
    },
    textUpContainer: {
        [theme.breakpoints.down('xs')]: {
            display: 'block'
        },
        alignItems: 'center',
        display: 'flex',
        marginBottom: `${Tokens.spacing40}!important`
    }
}));

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion Types

// #region Component
class TransferCoursesView extends React.Component<PropsWithStyles, ITransferCoursesState> {
    private idModule: string;
    private idPage: string;
    private initialPage: number;
    private initialRowsPerPage: number;
    private rowsPerPageOptions: number[];

    public readonly state: Readonly<ITransferCoursesState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Planning';
        this.idPage = 'TransferCourseEquivalencies';
        this.state = this.getInitialState();

        this.initialPage = 0;
        this.initialRowsPerPage = 5;
        this.rowsPerPageOptions = [this.initialRowsPerPage, 10, 15, 20, 25, 50];
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): ITransferCoursesState {
        let resources: ITransferCoursesRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            anchorEl: null,
            courseDetail: undefined,
            courseDetailModalOpen: false,
            cultures: LayoutStore.getCultures(),
            isLoading: true,
            openInfo: false,
            showCourses: false,

            // #region Pagination
            page: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: [],

            pageCourse: 0,
            rowsPerPageCourse: 5,
            rowsPerPageOptionsCourse: [],

            preservePage: false,
            preserveRowsPerPage: false,
            // #endregion Pagination

            resources: resources
        };
    }

    // #region Events
    private onSearchAllCourses = (event: any): void => {
        try {
            if (event.target.id && event.target.id !== '') {
                const id = event.target.id.split('_');
                this.setState({
                    keywords: undefined,
                    organizationId: id[1],
                    organizationName: id[2],
                    organizationCity: id[3],
                    organizationCountry: id[4],
                    organizationState: id[5],
                    showCourses: false
                });

                const {
                    page,
                    rowsPerPage
                } = this.state;

                Requests.getCatalogCourseList(Number(id[1]), '', page * rowsPerPage, rowsPerPage, this.resolveGetCatalogCourseList);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearchAllCourses.name, e));
        }
    };

    private onSearchCourse = (): void => {
        try {
            LayoutActions.showPageLoader();
            const page = 0;

            const {
                keywords,
                organizationId,
                rowsPerPage
            } = this.state;

            this.setState({
                page: page,
                showCourses: true
            });

            if (keywords && organizationId) {
                Requests.getCatalogCourseList(organizationId, keywords, page * rowsPerPage, rowsPerPage, this.resolveGetCatalogCourseList);
            }
            else if (organizationId) {
                Requests.getCatalogCourseList(organizationId, '', page * rowsPerPage, rowsPerPage, this.resolveGetCatalogCourseList);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearchCourse.name, e));
        }
    };

    private onSetCourseContent = (): void => {
        try {
            LayoutActions.showPageLoader();

            const {
                keywords,
                pageCourse,
                organizationId,
                rowsPerPageCourse
            } = this.state;

            this.setState({
                showCourses: true
            });

            if (keywords && organizationId) {
                Requests.getCatalogCourseList(organizationId, keywords, pageCourse * rowsPerPageCourse, rowsPerPageCourse, this.resolveGetCatalogCourseList);
            }
            else if (organizationId) {
                Requests.getCatalogCourseList(organizationId, '', pageCourse * rowsPerPageCourse, rowsPerPageCourse, this.resolveGetCatalogCourseList);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSetCourseContent.name, e));
        }
    };

    private onSearchAllInstitutions = (): void => {
        try {
            LayoutActions.showPageLoader();
            const page = 0;
            this.setState({
                keywords: undefined,
                page: 0
            });

            const {
                rowsPerPage
            } = this.state;

            Requests.getOrganizationList('', page * rowsPerPage, rowsPerPage, this.resolveGetOrganizationList);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearchAllInstitutions.name, e));
        }
    };

    private onSearchInstitution = (): void => {
        try {
            LayoutActions.showPageLoader();

            const page = 0;
            const rowsPerPage = 5;

            this.setState({
                page: page,
                rowsPerPage: rowsPerPage
            });

            const {
                keywords
            } = this.state;

            if (keywords) {
                Requests.getOrganizationList(keywords, page * rowsPerPage, rowsPerPage, this.resolveGetOrganizationList);
            }
            else {
                Requests.getOrganizationList('', page * rowsPerPage, rowsPerPage, this.resolveGetOrganizationList);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearchInstitution.name, e));
        }
    };

    private onSetInstitutionContent = (): void => {
        try {
            LayoutActions.showPageLoader();

            const {
                keywords,
                page,
                rowsPerPage
            } = this.state;

            if (keywords) {
                Requests.getOrganizationList(keywords, page * rowsPerPage, rowsPerPage, this.resolveGetOrganizationList);
            }
            else {
                Requests.getOrganizationList('', page * rowsPerPage, rowsPerPage, this.resolveGetOrganizationList);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSetInstitutionContent.name, e));
        }
    };

    private onShowAll = (): void => {
        try {
            this.onSearchAllInstitutions();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onShowAll.name, e));
        }
    };

    private onShowAllCourses = (): void => {
        try {
            const rowsPerPage = 5;

            this.setState({
                keywords: undefined,
                rowsPerPage: rowsPerPage,
                showCourses: true
            });

            const {
                organizationId,
                page
            } = this.state;

            if (organizationId) {
                Requests.getCatalogCourseList(organizationId, '', page * rowsPerPage, rowsPerPage, this.resolveGetCatalogCourseList);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onShowAll.name, e));
        }
    };

    private onOpenPopper = (event: any): void => {
        try {
            this.setState({
                anchorEl: event.currentTarget,
                openInfo: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPopper.name, e));
        }
    };

    private onClosePopper = (): void => {
        try {
            this.setState({
                anchorEl: null,
                openInfo: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePopper.name, e));
        }
    };

    private onOpenInfo = (): void => {
        try {
            this.setState({
                openInfo: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenInfo.name, e));
        }
    };

    private onCloseInfo = (): void => {
        try {
            this.setState({
                openInfo: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseInfo.name, e));
        }
    };

    private onChangeTextField = (event: any): void => {
        try {
            const id = event.target.id;
            switch (id) {
                case 'txtSearchInstitution':
                case 'txtSearchCourse':
                    this.setState({
                        keywords: event.target.value
                    });
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onClearSearch = (): void => {
        try {
            this.setState({
                keywords: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearSearch.name, e));
        }
    };

    private onReturnInstitutionSearch = (): void => {
        try {
            this.setState({
                keywords: undefined,
                organizationCity: undefined,
                organizationCountry: undefined,
                organizationId: undefined,
                organizationList: undefined,
                organizationName: undefined,
                organizationTotal: undefined,
                organizationState: undefined,
                page: 0,
                pageCourse: 0,
                rowsPerPage: 5,
                rowsPerPageCourse: 5,
                transferCourseEvents: undefined,
                transferCourseTotal: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onReturnInstitutionSearch.name, e));
        }
    };

    private onCloseCourseDetailModal = (): void => {
        this.setState({
            courseDetail: undefined,
            courseDetailModalOpen: false,
            page: 0
        });
    };

    private onCourseDetailButtonClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
        try {
            LayoutActions.showPageLoader();
            const id = event.currentTarget.id.split('_');
            if (id[1]) {
                Requests.getCourseDetail(id[1], this.resolveGetCourseDetail);
            }
            else {
                LayoutActions.hidePageLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCourseDetailButtonClick.name, e));
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
                page: pageNumber,
                preservePage: true,
                preserveRowsPerPage: true
            }, () => {
                this.onSetInstitutionContent();
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

    private getRowsPerPageOptionsCourse = (maxValue: number): number[] => {
        const rowsPerPageOptionsCourse: number[] = [];
        try {
            this.rowsPerPageOptions.forEach(option => {
                if (option < maxValue) {
                    rowsPerPageOptionsCourse.push(option);
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.getRowsPerPageOptionsCourse.name, e));
        }
        return rowsPerPageOptionsCourse;
    };

    private onChangePageCourse = (_event: any, pageNumber: number): void => {
        try {
            this.setState({
                pageCourse: pageNumber,
                preservePage: true,
                preserveRowsPerPage: true
            }, () => {
                this.onSetCourseContent();
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePage.name, e));
        }
    };

    private onChangeRowsPerPageCourse = (event: any): void => {
        try {
            this.setState({
                pageCourse: this.initialPage,
                rowsPerPageCourse: Number(event.target.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRowsPerPage.name, e));
        }
    };
    // #endregion Pagination
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        });
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError = (logData: ILogData): void => {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    };

    private redirectError = (code: number): void => {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    };


    // #endregion Error Functions

    // #region Resolvers
    private resolveGetCatalogCourseList = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCatalogCourseList.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
                    this.setState({
                        organizationTotal: undefined,
                        transferCourseEvents: result.data.transferCourseEvents,
                        transferCourseTotal: result.data.total
                    });
                    LayoutActions.hidePageLoader();
                }
                else {
                    this.setState({
                        isLoading: false
                    }, LayoutActions.hidePageLoader);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetCatalogCourseList.name, e));
        }
    };

    private resolveGetOrganizationList = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetOrganizationList.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
                    const {
                        preservePage,
                        preserveRowsPerPage
                    } = this.state;

                    const page: number = preservePage ? this.state.page : 0;
                    const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(result.data.total);
                    const rowsPerPage: number = preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];
                    this.setState({
                        organizationList: result.data.organizations,
                        organizationTotal: result.data.total,
                        page: page,
                        rowsPerPage: rowsPerPage,
                        rowsPerPageOptions: rowsPerPageOptions
                    });
                    LayoutActions.hidePageLoader();
                }
                else {
                    this.setState({
                        isLoading: false
                    }, LayoutActions.hidePageLoader);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetOrganizationList.name, e));
        }
    };

    private resolveLayoutReady = (): void => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
                this.setState({
                    isLoading: false
                }, LayoutActions.hidePageLoader);
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };

    private resolveGetCourseDetail = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCourseDetail.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    courseDetail: result.data,
                    courseDetailModalOpen: true
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetCourseDetail.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: ITransferCoursesRes | undefined = LayoutStore.getResources();
        const cultures: ICultures = LayoutStore.getCultures();

        if (ready) {
            this.setState({
                cultures: cultures,
                resources: resources
            }, this.resolveLayoutReady);
        }
        else {
            this.logError(LogData.layoutNoReady(this.onLayoutReady.name));
            this.redirectError(500);
        }
    };
    // #endregion State Management Events

    // #region Lifecycle
    public componentWillUnmount(): void {
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);

    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            classes
        } = this.props;

        const {
            anchorEl,
            courseDetail,
            courseDetailModalOpen,
            cultures,
            isLoading,
            keywords,
            openInfo,
            organizationCity,
            organizationCountry,
            organizationId,
            organizationList,
            organizationName,
            organizationTotal,
            organizationState,
            showCourses,
            transferCourseEvents,
            transferCourseTotal,

            // pagination
            page,
            pageCourse,
            rowsPerPage,
            rowsPerPageCourse,

            resources
        } = this.state;

        let emptyContent: JSX.Element | undefined;
        let returnLink: JSX.Element | undefined;
        let table: JSX.Element | undefined;
        let resultsText: JSX.Element | undefined;
        let courseDetailModal: JSX.Element | undefined;
        let contentPage: JSX.Element | undefined;
        const cards: JSX.Element[] | undefined = [];
        if (resources && resources.courseDetailModal) {
            if (!isLoading) {
                // return link
                if (transferCourseEvents && transferCourseEvents.length > -1) {
                    returnLink = (
                        <>
                            <Button
                                TextProps={{
                                    display: 'inline'
                                }}
                                align="left"
                                id="btnReturnInstitutionLinkId"
                                textVariantStyling="inherit"
                                variant="text"
                                onClick={this.onReturnInstitutionSearch}
                            >
                                {resources.lblTransferCourseEquivalency}
                            </Button>
                            <Text display="inline">
                                {` / ${organizationName}`}
                            </Text>
                        </>
                    );
                }

                // courses cards / table institutions
                if (transferCourseEvents && transferCourseEvents.length > 0 && showCourses) {
                    transferCourseEvents.forEach((courseEvent, i) => {
                        cards.push(
                            <React.Fragment key={`fragment_${courseEvent.id}_${i}`}>
                                <Card
                                    id={`card_${i}`}
                                    key={`card_${i}}`}
                                >
                                    <CardContent
                                        id={`cardContet_${i}`}
                                        key={`cardContent_${i}`}
                                    >
                                        <Grid
                                            container
                                            spacing={3}
                                            key={`grid_${i}`}
                                        >
                                            <div className={classes.container}>
                                                <div className={classes.textUpContainer}>
                                                    <div className={classes.staticWidth1}>

                                                        <div className={classes.iconCourse}>
                                                            <div className={classes.marginButton}>
                                                                <div className={classes.iconCourse}>
                                                                    <Icon large name="finances" />
                                                                </div>
                                                                <Text
                                                                    display="inline">
                                                                    {courseEvent.id}
                                                                </Text>
                                                            </div>
                                                        </div>
                                                        <Text>
                                                            {resources.lblMinimumGrade}
                                                            {' '}
                                                            {courseEvent.minGrade}
                                                        </Text>

                                                    </div>
                                                    <div className={classes.staticWidth2}>
                                                        <div className={classes.marginTopContainer}>
                                                            <Text>
                                                                {resources.lblEquivalentCourse}
                                                            </Text>
                                                            <div className={classes.border}>
                                                                <div>
                                                                    <Link
                                                                        id={`lnk_${courseEvent.eventId}`}
                                                                        onClick={this.onCourseDetailButtonClick}
                                                                    >
                                                                        <Text>
                                                                            {`${courseEvent.eventId}:${courseEvent.name}`}
                                                                        </Text>
                                                                    </Link>
                                                                    <Text>
                                                                        {`${resources.lblCredits}:${courseEvent.minimumCredits}`}
                                                                    </Text>
                                                                    <Text>
                                                                        {`${resources.lblDescription}
                                                                        :${courseEvent.eventDesc.length > 100 ?
                                                                                `${courseEvent.eventDesc.substr(0, 97)}...`
                                                                                : courseEvent.eventDesc}`}
                                                                    </Text>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <br />
                                        </Grid>
                                    </CardContent>
                                </Card>
                                <br />
                            </React.Fragment>
                        );
                    });
                }
                else if (organizationId === undefined && organizationList && organizationList.length > 0) {
                    table = (
                        <Card>
                            <CardContent>
                                <Table
                                    breakpoint="sm"
                                    id="tblOrganizations"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblInstitution}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblCity}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblState}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblCountry}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblSearchCourses}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {organizationList ? organizationList.map((organization, i) => (
                                            <React.Fragment key={`table_${i}`}>
                                                <TableRow
                                                    key={`tblOrganizationsRow${i}`}
                                                >
                                                    <TableCell columnName={resources.lblInstitution}>
                                                        <span>
                                                            {organization.name}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell columnName={resources.lblCity}>
                                                        <span>
                                                            {organization.address.city}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell columnName={resources.lblState}>
                                                        <span>
                                                            {organization.address.state}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell columnName={resources.lblCountry}>
                                                        <span>
                                                            {organization.address.country}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell
                                                    >
                                                        <div className={classes.justifyCenter}>
                                                            <Tooltip
                                                                id="tltSectionSearch"
                                                                title={resources.btnSearch}
                                                            >
                                                                <IconButton
                                                                    aria-label={resources.btnSearch}
                                                                    color="gray"
                                                                    data-searchview="section"
                                                                    id={`searchCourse_${organization.id}_${organization.name}_${organization.address.city}_${organization.address.country}_${organization.address.state}`}
                                                                    onClick={this.onSearchAllCourses}
                                                                >
                                                                    <Icon name="search" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        ))
                                            : undefined}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    );
                }

                // no results
                if (
                    (transferCourseEvents && transferCourseEvents.length == 0) ||
                    (organizationList && organizationList.length == 0)
                ) {
                    emptyContent = (
                        <Card>
                            <CardContent>
                                <Illustration
                                    color="secondary"
                                    name="no-search-results"
                                    text={resources.lblNoResults}
                                />
                            </CardContent>
                        </Card>
                    );
                }

                // total results
                if (transferCourseTotal !== undefined && transferCourseTotal > 0 && showCourses) {
                    let firstRow: number = pageCourse * rowsPerPageCourse + 1;
                    let lastRow: number = pageCourse * rowsPerPageCourse + rowsPerPageCourse;
                    const totalRows: number = transferCourseTotal ? transferCourseTotal : 0;
                    if (lastRow > totalRows) {
                        lastRow = totalRows;
                    }
                    if (firstRow > lastRow) {
                        firstRow = lastRow;
                    }
                    resultsText = (
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
                    );
                }
                else if (organizationTotal !== undefined && organizationTotal > 0) {
                    let firstRow: number = page * rowsPerPage + 1;
                    let lastRow: number = page * rowsPerPage + rowsPerPage;
                    const totalRows: number = organizationTotal ? organizationTotal : 0;
                    if (lastRow > totalRows) {
                        lastRow = totalRows;
                    }
                    if (firstRow > lastRow) {
                        firstRow = lastRow;
                    }
                    resultsText = (
                        <Text>
                            {Format.toString(resources.formatResultsShowing,
                                [firstRow.toLocaleString(cultures.numberCulture),
                                lastRow.toLocaleString(cultures.numberCulture),
                                totalRows.toLocaleString(cultures.numberCulture)
                                ])
                            }
                        </Text>
                    );
                }

                // course header
                let courseInfo: string = '';
                if (organizationCity) {
                    courseInfo = `${resources.lblCity}: ${organizationCity}`;
                }
                if (organizationState) {
                    courseInfo = courseInfo + ` | ${resources.lblState}: ${organizationState}`;
                }
                if (organizationCountry) {
                    courseInfo = courseInfo + ` | ${resources.lblCountry}: ${organizationCountry}`;
                }

                // course modal
                if (courseDetailModalOpen) {
                    if (courseDetail) {
                        courseDetailModal = (
                            <CourseDetailModal
                                courseDetail={courseDetail}
                                open={courseDetailModalOpen}
                                onClose={this.onCloseCourseDetailModal}
                                resources={resources.courseDetailModal}
                            />
                        );
                    }
                }

                contentPage = (
                    <>
                        <Card>
                            <CardContent>
                                {transferCourseTotal === undefined ? (
                                    <>
                                        <Grid
                                            container
                                            spacing={3}
                                        >
                                            <Grid item xs={12} md={12}>
                                                <Text
                                                    display="inline"
                                                    size="large">
                                                    {resources.lblSearchSendingInstitution}
                                                </Text>
                                                <Hidden smDown>
                                                    <Tooltip
                                                        id="InfoIcon"
                                                        placement="top"
                                                        title={resources.btnMoreInfo}
                                                    >
                                                        <IconButton
                                                            aria-label={resources.lblInfo}
                                                            color="gray"
                                                            id="btnInfo"
                                                            onClick={this.onOpenPopper}
                                                        >
                                                            <Icon
                                                                className={classes.icon}
                                                                name="info"
                                                                type={ResultType.info}
                                                            />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Popper
                                                        arrow
                                                        id="popAllowChanges"
                                                        open={openInfo}
                                                        placement="bottom-start"
                                                        anchorEl={anchorEl}
                                                        onClickAway={this.onClosePopper}
                                                        text={resources.lblInfo}
                                                        transition={false}
                                                        TextTypographyProps={{ className: classes.popperText }}
                                                    />
                                                </Hidden>
                                                <Hidden mdUp>
                                                    <Tooltip
                                                        id="InfoIcon"
                                                        placement="top"
                                                        title={resources.btnMoreInfo}
                                                    >
                                                        <IconButton
                                                            aria-label={resources.btnMoreInfo}
                                                            color="gray"
                                                            id="btnInfo"
                                                            onClick={this.onOpenInfo}
                                                        >
                                                            <Icon
                                                                className={classes.icon}
                                                                name="info"
                                                                type={ResultType.info}
                                                            />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <SimpleDialog
                                                        id="infoModal"
                                                        onClose={this.onCloseInfo}
                                                        open={openInfo}
                                                        maxWidth="md"
                                                    >
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12} md={12}>
                                                                <Text>
                                                                    {resources.lblInfo}
                                                                </Text>
                                                            </Grid>
                                                        </Grid>
                                                    </SimpleDialog>
                                                </Hidden>
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <Search
                                                    id="txtSearchInstitution"
                                                    placeholder={resources.lblInstitution}
                                                    value={keywords || ''}
                                                    onChange={this.onChangeTextField}
                                                    onClear={this.onClearSearch}
                                                    onSearchInvoked={this.onSearchInstitution}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            alignItems="flex-end"
                                            container
                                            direction="column"
                                            justifyContent="flex-end"
                                            spacing={3}
                                        >
                                            <Grid item xs={12} md={12}>
                                                <Link
                                                    id="lnkShowAll"
                                                    onClick={this.onShowAll}
                                                >
                                                    <Text color="inherit">
                                                        {resources.lblShowAll}
                                                    </Text>
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </>
                                )
                                    : (
                                        <>
                                            <Grid
                                                container
                                                spacing={3}
                                            >
                                                <Grid item xs={12} md={12} >
                                                    {returnLink}
                                                </Grid>
                                                <Grid item xs={12} md={12} >
                                                    <div className={classes.iconCourse}>
                                                        <div className={classes.marginButton}>
                                                            <div className={classes.iconCourse}>
                                                                <Icon large name="finances" />
                                                            </div>
                                                            <Text
                                                                display="inline"
                                                                size="h3">
                                                                {organizationName}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                    <div className={classes.marginTop}>
                                                        <Text>
                                                            {courseInfo}
                                                        </Text>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} md={12}>
                                                    <Search
                                                        id="txtSearchCourse"
                                                        placeholder={resources.lblTransferableCourses}
                                                        value={keywords || ''}
                                                        onChange={this.onChangeTextField}
                                                        onClear={this.onClearSearch}
                                                        onSearchInvoked={this.onSearchCourse}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                alignItems="flex-end"
                                                container
                                                direction="column"
                                                justifyContent="flex-end"
                                                spacing={3}
                                            >
                                                <Grid item xs={12} md={12}>
                                                    <Link
                                                        id="lnkShowAll"
                                                        onClick={this.onShowAllCourses}
                                                    >
                                                        <Text color="inherit">
                                                            {resources.lblShowAll}
                                                        </Text>
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        </>
                                    )}
                            </CardContent>
                        </Card>
                        <br />
                        {resultsText}
                        <br />
                        {emptyContent}
                        {table}
                        {cards}
                        {rowsPerPage > 0 && organizationTotal && organizationTotal > 0 && transferCourseTotal === undefined ? (
                            <Grid container>
                                <Grid item xs>
                                    <Pagination
                                        count={organizationTotal}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={this.getRowsPerPageOptions(organizationTotal)}
                                        onPageChange={this.onChangePage}
                                        onRowsPerPageChange={this.onChangeRowsPerPage}
                                    />
                                </Grid>
                            </Grid >
                        ) : rowsPerPage > 0 && transferCourseTotal && transferCourseTotal > 0 && showCourses ? (
                            <Grid container>
                                <Grid item xs>
                                    <Pagination
                                        count={transferCourseTotal}
                                        page={pageCourse}
                                        rowsPerPage={rowsPerPageCourse}
                                        rowsPerPageOptions={this.getRowsPerPageOptionsCourse(transferCourseTotal)}
                                        onPageChange={this.onChangePageCourse}
                                        onRowsPerPageChange={this.onChangeRowsPerPageCourse}
                                    />
                                </Grid>
                            </Grid >
                        )
                                : undefined}
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
                {courseDetailModal}
            </Layout>
        );
    }
}

const TransferCoursesViewWithLayout = withLayout(withStyles(styles)(withWidth()(TransferCoursesView)));
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<TransferCoursesViewWithLayout />, document.getElementById('root'));