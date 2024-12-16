/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: courseView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Search from '@hedtech/powercampus-design-system/react/core/Search';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import CourseCards from './CourseCards';
import CourseDetailModal from '../../Generic/CourseDetailModal';
import CourseSearchOptions from './CourseSearchOptions';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import ShareSearchCourseLinkModal from './ShareSearchCourseLinkModal';

// #region Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ICourseCatalog } from '../../../Types/Course/ICourseCatalog';
import { ICourseCatalogSearch } from '../../../Types/Course/ICourseCatalogSearch';
import { ICourseResources } from '../../../Types/Resources/Search/ICourseResources';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Requests
import RequestsCourse from '../../../Requests/Search/Course';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface ICourseState {
    availableClassLevel: IDropDownOption[];
    availableColleges: IDropDownOption[];
    availableCreditType: IDropDownOption[];
    availableCurriculum: IDropDownOption[];
    availableDepartment: IDropDownOption[];
    availableProgram: IDropDownOption[];
    availablePopulation: IDropDownOption[];
    availableSubtype: IDropDownOption[];
    availableNonTraditional: IDropDownOption[];
    componentError: boolean;
    courseCode?: string;
    courseDetail?: ICourseCatalog;
    courseDetailModalOpen?: boolean;
    cultures: ICultures;
    keywords?: string;
    openShareSearchCourseModal: boolean;
    resultsTotal: number;
    searchResultsList?: ICourseCatalog[];
    selectedClassLevel?: string | number;
    selectedCollege?: string | number;
    selectedCreditType?: string | number;
    selectedCurriculum?: string | number;
    selectedDepartment?: string | number;
    selectedProgram?: string | number;
    selectedPopulation?: string | number;
    selectedSubtype?: string | number;
    selectedNonTraditional?: string | number;
    urlToShare?: string;

    // #region Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    // #endregion Pagination

    resources?: ICourseResources;
}

const styles = ((theme: Theme) => createStyles({
    container: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap-reverse',
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
            flexWrap: 'wrap'
        }
    }
}));

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion Types

// #region Component
class CourseView extends React.Component<PropsWithStyles, ICourseState> {
    private idModule: string;
    private idPage: string;

    // #region Pagination
    private preservePage: boolean;
    private preserveRowsPerPage: boolean;
    private rowsPerPageOptions: number[];
    // #endregion Pagination

    public readonly state: Readonly<ICourseState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Search';
        this.idPage = 'Course';

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

    private getInitialState(): ICourseState {
        let resources: ICourseResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            availableClassLevel: [],
            availableColleges: [],
            availableCreditType: [],
            availableCurriculum: [],
            availableDepartment: [],
            availableNonTraditional: [],
            availablePopulation: [],
            availableProgram: [],
            availableSubtype: [],
            componentError: false,
            courseDetail: undefined,
            courseDetailModalOpen: false,
            cultures: LayoutStore.getCultures(),
            openShareSearchCourseModal: false,
            resources: resources,
            resultsTotal: 0,

            // #region Pagination
            page: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: []
            // #endregion Pagination
        };
    }

    // #region Events
    private onChangeDropDown = (optionSelected: IDropDownOption, id: string): void => {
        try {
            if (optionSelected) {
                switch (id) {
                    case 'ddlProgram':
                        this.setState({
                            selectedProgram: optionSelected.value
                        });
                        break;
                    case 'ddlCurriculum':
                        this.setState({
                            selectedCurriculum: optionSelected.value
                        });
                        break;
                    case 'ddlSubtype':
                        this.setState({
                            selectedSubtype: optionSelected.value
                        });
                        break;
                    case 'ddlCreditType':
                        this.setState({
                            selectedCreditType: optionSelected.value
                        });
                        break;
                    case 'ddlClassLevel':
                        this.setState({
                            selectedClassLevel: optionSelected.value
                        });
                        break;
                    case 'ddlCollege':
                        this.setState({
                            selectedCollege: optionSelected.value
                        });
                        break;
                    case 'ddlDepartment':
                        this.setState({
                            selectedDepartment: optionSelected.value
                        });
                        break;
                    case 'ddlPopulation':
                        this.setState({
                            selectedPopulation: optionSelected.value
                        });
                        break;
                    case 'ddlNonTraditional':
                        this.setState({
                            selectedNonTraditional: optionSelected.value
                        });
                        break;
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropDown.name, e));
        }
    };

    private onClearSearch = (): void => {
        try {
            this.setState({
                courseCode: undefined,
                selectedClassLevel: undefined,
                selectedCollege: undefined,
                selectedCreditType: undefined,
                selectedCurriculum: undefined,
                selectedDepartment: undefined,
                selectedNonTraditional: undefined,
                selectedPopulation: undefined,
                selectedProgram: undefined,
                selectedSubtype: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearSearch.name, e));
        }
    };

    private onChangeTextField = (event: any): void => {
        try {
            const id = event.target.id;
            switch (id) {
                case 'txtSearch':
                    this.setState({
                        keywords: event.target.value
                    });
                    break;
                case 'txtCourseCode':
                    this.setState({
                        courseCode: event.target.value
                    });
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onNewSearch = (): void => {
        try {
            this.setState({
                courseCode: undefined,
                keywords: undefined,
                searchResultsList: undefined,
                selectedClassLevel: undefined,
                selectedCollege: undefined,
                selectedCreditType: undefined,
                selectedCurriculum: undefined,
                selectedDepartment: undefined,
                selectedNonTraditional: undefined,
                selectedPopulation: undefined,
                selectedProgram: undefined,
                selectedSubtype: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onNewSearch.name, e));
        }
    };

    private onShareSearch = (): void => {
        try {
            const {
                courseCode,
                keywords,
                selectedClassLevel,
                selectedCollege,
                selectedCreditType,
                selectedCurriculum,
                selectedDepartment,
                selectedProgram,
                selectedPopulation,
                selectedSubtype,
                selectedNonTraditional
            } = this.state;

            let urlLink: string | undefined;
            urlLink = `${window.location.origin}${Constants.webUrl}/Search/Course/Share?`;

            if (courseCode) {
                urlLink = `${urlLink}&courseCode=${encodeURIComponent(courseCode)}`;
            }

            if (keywords) {
                urlLink = `${urlLink}&keywords=${encodeURIComponent(keywords)}`;
            }

            if (selectedClassLevel) {
                urlLink = `${urlLink}&classLevel=${encodeURIComponent(String(selectedClassLevel))}`;
            }

            if (selectedCollege) {
                urlLink = `${urlLink}&college=${encodeURIComponent(String(selectedCollege))}`;
            }

            if (selectedCreditType) {
                urlLink = `${urlLink}&creditType=${encodeURIComponent(String(selectedCreditType))}`;
            }

            if (selectedCurriculum) {
                urlLink = `${urlLink}&curriculum=${encodeURIComponent(String(selectedCurriculum))}`;
            }

            if (selectedDepartment) {
                urlLink = `${urlLink}&department=${encodeURIComponent(String(selectedDepartment))}`;
            }

            if (selectedProgram) {
                urlLink = `${urlLink}&program=${encodeURIComponent(String(selectedProgram))}`;
            }

            if (selectedPopulation) {
                urlLink = `${urlLink}&population=${encodeURIComponent(String(selectedPopulation))}`;
            }

            if (selectedSubtype) {
                urlLink = `${urlLink}&subType=${encodeURIComponent(String(selectedSubtype))}`;
            }

            if (selectedNonTraditional) {
                urlLink = `${urlLink}&nonTradProgram=${encodeURIComponent(String(selectedNonTraditional))}`;
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

    private onSearch = (): void => {
        try {
            const {
                courseCode,
                keywords,
                selectedClassLevel,
                selectedCollege,
                selectedCreditType,
                selectedCurriculum,
                selectedDepartment,
                selectedProgram,
                selectedPopulation,
                selectedSubtype,
                selectedNonTraditional
            } = this.state;

            LayoutActions.setLoading(true);

            const courseCatalogSearch: ICourseCatalogSearch = {};
            courseCatalogSearch.courseCode = courseCode ? String(courseCode) : undefined;
            courseCatalogSearch.classLevel = selectedClassLevel ? String(selectedClassLevel) : undefined;
            courseCatalogSearch.college = selectedCollege ? String(selectedCollege) : undefined;
            courseCatalogSearch.creditType = selectedCreditType ? String(selectedCreditType) : undefined;
            courseCatalogSearch.curriculum = selectedCurriculum ? String(selectedCurriculum) : undefined;
            courseCatalogSearch.department = selectedDepartment ? String(selectedDepartment) : undefined;
            courseCatalogSearch.subType = selectedSubtype ? String(selectedSubtype) : undefined;
            courseCatalogSearch.keywords = keywords ? String(keywords) : undefined;
            courseCatalogSearch.nonTradProgram = selectedNonTraditional ? String(selectedNonTraditional) : undefined;
            courseCatalogSearch.population = selectedPopulation ? String(selectedPopulation) : undefined;
            courseCatalogSearch.program = selectedProgram ? String(selectedProgram) : undefined;

            const newUrl = this.setQueryString('/Search/Course');
            if (newUrl) {
                window.location.assign(newUrl);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearch.name, e));
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

    private onFindCourse = (event: any): void => {
        try {
            const id = event.currentTarget.id.split('|');
            if (id && id[1]) {
                window.location.assign(`${Constants.webUrl}/Search/Section/Share?eventId=${encodeURIComponent(id[1])}`);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onFindCourse.name, e));
        }
    };

    private onClearSearchClick = (): void => {
        try {
            this.setState({
                keywords: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearSearchClick.name, e));
        }
    };

    private onClearCourseCode = (): void => {
        try {
            this.setState({
                courseCode: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearCourseCode.name, e));
        }
    };

    private onCloseCourseDetailModal = (): void => {
        try {
            this.setState({
                courseDetailModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseCourseDetailModal.name, e));
        }
    };

    private onCourseNameClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
        try {
            LayoutActions.setLoading(true);
            const id: string[] = event.currentTarget.id.split('_');
            RequestsCourse.getCourseDetail(id[3], undefined, undefined, this.resolveGetCourseDetail, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCourseNameClick.name, e));
        }
    };

    // #region Courses Pagination
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
    // #endregion Courses Pagination

    // #endregion Events

    // #region Functions
    private setContent = (): void => {
        try {
            const {
                courseCode,
                keywords,
                page,
                rowsPerPage,
                selectedClassLevel,
                selectedCollege,
                selectedCreditType,
                selectedCurriculum,
                selectedDepartment,
                selectedProgram,
                selectedPopulation,
                selectedSubtype,
                selectedNonTraditional
            } = this.state;

            LayoutActions.setLoading(true);
            const courseCatalogSearch: ICourseCatalogSearch = {};
            courseCatalogSearch.courseCode = courseCode ? String(courseCode) : undefined;
            courseCatalogSearch.classLevel = selectedClassLevel ? String(selectedClassLevel) : undefined;
            courseCatalogSearch.college = selectedCollege ? String(selectedCollege) : undefined;
            courseCatalogSearch.creditType = selectedCreditType ? String(selectedCreditType) : undefined;
            courseCatalogSearch.curriculum = selectedCurriculum ? String(selectedCurriculum) : undefined;
            courseCatalogSearch.department = selectedDepartment ? String(selectedDepartment) : undefined;
            courseCatalogSearch.subType = selectedSubtype ? String(selectedSubtype) : undefined;
            courseCatalogSearch.keywords = keywords ? String(keywords) : undefined;
            courseCatalogSearch.nonTradProgram = selectedNonTraditional ? String(selectedNonTraditional) : undefined;
            courseCatalogSearch.population = selectedPopulation ? String(selectedPopulation) : undefined;
            courseCatalogSearch.program = selectedProgram ? String(selectedProgram) : undefined;

            RequestsCourse.getCourseCatalogResults(
                courseCatalogSearch,
                page * rowsPerPage,
                rowsPerPage,
                this.resolveGetCourseCatalogResults,
                this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.setContent.name, e));
        }
    };

    private setQueryStringValues = (): void => {
        try {
            const courseCatalogSearch: ICourseCatalogSearch = {};

            const hdnClassLevel: HTMLInputElement | undefined =
                document.getElementById('hdnClassLevel') as HTMLInputElement;
            if (hdnClassLevel && hdnClassLevel.value) {
                courseCatalogSearch.classLevel = hdnClassLevel.value;
                this.setState({
                    selectedClassLevel: hdnClassLevel.value
                });
                hdnClassLevel.remove();
            }

            const hdnCollege: HTMLInputElement | undefined =
                document.getElementById('hdnCollege') as HTMLInputElement;
            if (hdnCollege && hdnCollege.value) {
                courseCatalogSearch.college = hdnCollege.value;
                this.setState({
                    selectedCollege: hdnCollege.value
                });
                hdnCollege.remove();
            }

            const hdnCourseCode: HTMLInputElement | undefined =
                document.getElementById('hdnCourseCode') as HTMLInputElement;
            if (hdnCourseCode && hdnCourseCode.value) {
                courseCatalogSearch.courseCode = hdnCourseCode.value;
                this.setState({
                    courseCode: hdnCourseCode.value
                });
                hdnCourseCode.remove();
            }

            const hdnCreditType: HTMLInputElement | undefined =
                document.getElementById('hdnCreditType') as HTMLInputElement;
            if (hdnCreditType && hdnCreditType.value) {
                courseCatalogSearch.creditType = hdnCreditType.value;
                this.setState({
                    selectedCreditType: hdnCreditType.value
                });
                hdnCreditType.remove();
            }

            const hdnCurriculum: HTMLInputElement | undefined =
                document.getElementById('hdnCurriculum') as HTMLInputElement;
            if (hdnCurriculum && hdnCurriculum.value) {
                courseCatalogSearch.curriculum = hdnCurriculum.value;
                this.setState({
                    selectedCurriculum: hdnCurriculum.value
                });
                hdnCurriculum.remove();
            }

            const hdnDepartment: HTMLInputElement | undefined =
                document.getElementById('hdnDepartment') as HTMLInputElement;
            if (hdnDepartment && hdnDepartment.value) {
                courseCatalogSearch.department = hdnDepartment.value;
                this.setState({
                    selectedDepartment: hdnDepartment.value
                });
                hdnDepartment.remove();
            }

            const hdnEventSubType: HTMLInputElement | undefined =
                document.getElementById('hdnEventSubType') as HTMLInputElement;
            if (hdnEventSubType && hdnEventSubType.value) {
                courseCatalogSearch.subType = hdnEventSubType.value;
                this.setState({
                    selectedSubtype: hdnEventSubType.value
                });
                hdnEventSubType.remove();
            }

            const hdnKeywords: HTMLInputElement | undefined =
                document.getElementById('hdnKeywords') as HTMLInputElement;
            if (hdnKeywords && hdnKeywords.value) {
                courseCatalogSearch.keywords = hdnKeywords.value;
                this.setState({
                    keywords: hdnKeywords.value
                });
                hdnKeywords.remove();
            }

            const hdnNonTradProgram: HTMLInputElement | undefined =
                document.getElementById('hdnNonTradProgram') as HTMLInputElement;
            if (hdnNonTradProgram && hdnNonTradProgram.value) {
                courseCatalogSearch.nonTradProgram = hdnNonTradProgram.value;
                this.setState({
                    selectedNonTraditional: hdnNonTradProgram.value
                });
                hdnNonTradProgram.remove();
            }

            const hdnPopulation: HTMLInputElement | undefined =
                document.getElementById('hdnPopulation') as HTMLInputElement;
            if (hdnPopulation && hdnPopulation.value) {
                courseCatalogSearch.population = hdnPopulation.value;
                this.setState({
                    selectedPopulation: hdnPopulation.value
                });
                hdnPopulation.remove();
            }

            const hdnProgram: HTMLInputElement | undefined =
                document.getElementById('hdnProgram') as HTMLInputElement;
            if (hdnProgram && hdnProgram.value) {
                courseCatalogSearch.program = hdnProgram.value;
                this.setState({
                    selectedProgram: hdnProgram.value
                });
                hdnProgram.remove();
            }

            if (courseCatalogSearch.classLevel ||
                courseCatalogSearch.college ||
                courseCatalogSearch.courseCode ||
                courseCatalogSearch.creditType ||
                courseCatalogSearch.curriculum ||
                courseCatalogSearch.department ||
                courseCatalogSearch.subType ||
                courseCatalogSearch.keywords ||
                courseCatalogSearch.nonTradProgram ||
                courseCatalogSearch.population ||
                courseCatalogSearch.program) {
                const {
                    page,
                    rowsPerPage
                } = this.state;

                RequestsCourse.getCourseCatalogResults(courseCatalogSearch, page, rowsPerPage,
                    this.resolveGetCourseCatalogResults, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setQueryStringValues.name, e));
        }
    };

    private setQueryString = (pageUrl: string): string => {
        try {
            const {
                courseCode,
                keywords,
                selectedClassLevel,
                selectedCollege,
                selectedCreditType,
                selectedCurriculum,
                selectedDepartment,
                selectedProgram,
                selectedPopulation,
                selectedSubtype,
                selectedNonTraditional
            } = this.state;

            let urlLink: string = '';
            urlLink = `${window.location.origin}${Constants.webUrl}${pageUrl}?`;

            if (courseCode) {
                urlLink = `${urlLink}&courseCode=${encodeURIComponent(courseCode)}`;
            }

            if (keywords) {
                urlLink = `${urlLink}&keywords=${encodeURIComponent(keywords)}`;
            }

            if (selectedClassLevel) {
                urlLink = `${urlLink}&classLevel=${encodeURIComponent(String(selectedClassLevel))}`;
            }

            if (selectedCollege) {
                urlLink = `${urlLink}&college=${encodeURIComponent(String(selectedCollege))}`;
            }

            if (selectedCreditType) {
                urlLink = `${urlLink}&creditType=${encodeURIComponent(String(selectedCreditType))}`;
            }

            if (selectedCurriculum) {
                urlLink = `${urlLink}&curriculum=${encodeURIComponent(String(selectedCurriculum))}`;
            }

            if (selectedDepartment) {
                urlLink = `${urlLink}&department=${encodeURIComponent(String(selectedDepartment))}`;
            }

            if (selectedProgram) {
                urlLink = `${urlLink}&program=${encodeURIComponent(String(selectedProgram))}`;
            }

            if (selectedPopulation) {
                urlLink = `${urlLink}&population=${encodeURIComponent(String(selectedPopulation))}`;
            }

            if (selectedSubtype) {
                urlLink = `${urlLink}&subType=${encodeURIComponent(String(selectedSubtype))}`;
            }

            if (selectedNonTraditional) {
                urlLink = `${urlLink}&nonTradProgram=${encodeURIComponent(String(selectedNonTraditional))}`;
            }

            return urlLink;
        }
        catch (e) {
            this.logError(LogData.fromException(this.onShareSearch.name, e));
            return '';
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
    private resolveLayoutReady = () => {
    try {
        const {
            resources
        } = this.state;

        if (resources) {
            document.title = resources.lblPageTitle;
            LayoutActions.setLoading(false);

            RequestsCourse.getSearchOptions(this.resolveGetSearchOptions, this.logError);
        }
        else {
            this.logError(LogData.noResources(this.resolveLayoutReady.name));
        }
    }
    catch (e) {
        this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
    }
};

    private resolveGetCourseCatalogResults = (json: string) => {
    try {
        const result: IJsonResult | undefined
            = Resolver(json, this.resolveGetCourseCatalogResults.name);
        if (result?.status) {
            if (result.data.courseCatalogList &&
                result.data.overallCount !== undefined) {
                const page: number = this.preservePage ? this.state.page : 0;
                const rowsPerPageOptions: number[] =
                    this.getRowsPerPageOptions(Number(result.data.overallCount));
                const rowsPerPage: number = this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];
                this.setState({
                    page: page,
                    resultsTotal: Number(result.data.overallCount),
                    rowsPerPage: rowsPerPage,
                    rowsPerPageOptions: rowsPerPageOptions,
                    searchResultsList: result.data.courseCatalogList
                }, () => LayoutActions.setLoading(false));
            }
        }
    }
    catch (e) {
        this.logError(LogData.fromException(this.resolveGetCourseCatalogResults.name, e));
    }
};

    private resolveGetSearchOptions = (json: string) => {
    try {
        const result: IJsonResult | undefined
            = Resolver(json, this.resolveGetSearchOptions.name);
        if (result?.status) {
            if (result.data.classLevels) {
                this.setState({
                    availableClassLevel: result.data.classLevels
                });
            }
            if (result.data.colleges) {
                this.setState({
                    availableColleges: result.data.colleges
                });
            }
            if (result.data.creditTypes) {
                this.setState({
                    availableCreditType: result.data.creditTypes
                });
            }
            if (result.data.curriculums) {
                this.setState({
                    availableCurriculum: result.data.curriculums
                });
            }
            if (result.data.departments) {
                this.setState({
                    availableDepartment: result.data.departments
                });
            }
            if (result.data.nontraditionalPrograms) {
                this.setState({
                    availableNonTraditional: result.data.nontraditionalPrograms
                });
            }
            if (result.data.populations) {
                this.setState({
                    availablePopulation: result.data.populations
                });
            }
            if (result.data.programs) {
                this.setState({
                    availableProgram: result.data.programs
                });
            }
            if (result.data.subTypes) {
                this.setState({
                    availableSubtype: result.data.subTypes
                });
            }
        }
    }
    catch (e) {
        this.logError(LogData.fromException(this.resolveGetSearchOptions.name, e));
    }
};

    private resolveGetCourseDetail = (json: string): void => {
    try {
        const result: IJsonResult | undefined
            = Resolver(json, this.resolveGetCourseDetail.name);
        if (result?.status) {
            this.setState({
                courseDetail: result.data,
                courseDetailModalOpen: true
            }, () => LayoutActions.setLoading(false));
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
    const resources: ICourseResources | undefined = LayoutStore.getResources();
    const cultures: ICultures = LayoutStore.getCultures();

    if (ready) {
        this.setState({
            cultures: cultures,
            resources: resources
        }, this.resolveLayoutReady);

        this.setQueryStringValues();
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
        availableClassLevel,
        availableColleges,
        availableCreditType,
        availableCurriculum,
        availableDepartment,
        availableProgram,
        availablePopulation,
        availableSubtype,
        availableNonTraditional,
        componentError,
        courseCode,
        courseDetail,
        courseDetailModalOpen,
        cultures,
        keywords,
        openShareSearchCourseModal,
        page,
        rowsPerPage,
        resultsTotal,
        rowsPerPageOptions,
        searchResultsList,
        selectedClassLevel,
        selectedCollege,
        selectedCreditType,
        selectedCurriculum,
        selectedDepartment,
        selectedProgram,
        selectedPopulation,
        selectedSubtype,
        selectedNonTraditional,
        urlToShare,

        resources
    } = this.state;

    const {
        classes
    } = this.props;

    let paginationComponent: JSX.Element | undefined;
    if (searchResultsList && searchResultsList.length > 0) {
        paginationComponent = (
            <Grid container spacing={3}>
                <Grid item xs>
                    <Pagination
                        count={resultsTotal}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={rowsPerPageOptions}
                        onPageChange={this.onChangePage}
                        onRowsPerPageChange={this.onChangeRowsPerPage}
                    />
                </Grid>
            </Grid>
        );
    }

    let results: JSX.Element | undefined;
    if (searchResultsList && resources) {
        results = (
            <CourseCards
                searchResultsList={searchResultsList}
                onCourseNameClick={this.onCourseNameClick}
                onFindCourse={this.onFindCourse}
                resources={resources.courseCardResources}
            />
        );
    }
    if (searchResultsList && searchResultsList.length === 0 && resources) {
        results = (
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

    let firstRow: number = page * rowsPerPage + 1;
    let lastRow: number = page * rowsPerPage + rowsPerPage;
    const totalRows: number = resultsTotal ? resultsTotal : 0;
    if (lastRow > totalRows) {
        lastRow = totalRows;
    }
    if (firstRow > lastRow) {
        firstRow = lastRow;
    }

    let resultsLabel: JSX.Element | undefined;
    if (resources && searchResultsList && searchResultsList.length > 0) {
        resultsLabel = (
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
        );
    }

    let courseDetailModal: JSX.Element | undefined;
    if (courseDetailModalOpen) {
        if (resources && resources.courseDetailModal && courseDetail) {
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

    let shareSearch: JSX.Element | undefined;
    if (resources && openShareSearchCourseModal && urlToShare) {
        shareSearch = (
            <ShareSearchCourseLinkModal
                open={openShareSearchCourseModal}
                urlToShare={urlToShare}
                onCloseModal={this.onCloseShareSearchModal}
                resources={resources.shareSearchCourseLinkModalResources}
            />
        );
    }

    let contentPage: JSX.Element | undefined;
    if (!componentError && resources) {
        contentPage = (
            <>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid item xs={12} md={12}>
                                    <Search
                                        id="txtSearch"
                                        value={keywords || ''}
                                        onChange={this.onChangeTextField}
                                        onClear={this.onClearSearchClick}
                                        onSearchInvoked={this.onSearch}
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
                    <br />
                    {resultsLabel}
                    <br />
                    {results}
                    {paginationComponent}
                </Grid>
                <Grid item xs={12} md={4}>
                    <CourseSearchOptions
                        availableClassLevel={availableClassLevel}
                        availableColleges={availableColleges}
                        availableCreditType={availableCreditType}
                        availableCurriculum={availableCurriculum}
                        availableDepartment={availableDepartment}
                        availableProgram={availableProgram}
                        availablePopulation={availablePopulation}
                        availableSubtype={availableSubtype}
                        availableNonTraditional={availableNonTraditional}
                        courseCode={courseCode}
                        selectedClassLevel={selectedClassLevel}
                        selectedCollege={selectedCollege}
                        selectedCreditType={selectedCreditType}
                        selectedCurriculum={selectedCurriculum}
                        selectedDepartment={selectedDepartment}
                        selectedProgram={selectedProgram}
                        selectedPopulation={selectedPopulation}
                        selectedSubtype={selectedSubtype}
                        selectedNonTraditional={selectedNonTraditional}
                        resources={resources.courseSearchOptionsResources}
                        onChangeDropDown={this.onChangeDropDown}
                        onChangeTextField={this.onChangeTextField}
                        onClearSearch={this.onClearSearch}
                        onClearCourseCode={this.onClearCourseCode}
                        onShareSearch={this.onShareSearch}
                        onSearch={this.onSearch}
                    />
                </Grid>
                {shareSearch}
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
            <Grid container spacing={3} className={classes.container}>
                {contentPage}
                {courseDetailModal}
            </Grid>
        </Layout>
    );
}
}

const CourseViewWithLayout = withLayout(withStyles(styles)(CourseView));
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<CourseViewWithLayout />, document.getElementById('root'));