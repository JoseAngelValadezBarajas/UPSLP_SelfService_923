/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: OverallGrades.tsx
 * Type: Container component */

// #region Imports
import React, { RefObject } from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import { Comments } from '@hedtech/powercampus-design-system/react/core/IconSvg';
import { NotificationBadge } from '@hedtech/powercampus-design-system/react/core/Badge';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableEditableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import ChangeGradeModal from './OverallGradesChangeModal';
import CourseStatisticsModal, { ICourseStatisticsModalResProps } from './CourseStatisticsModal';
import EmailModal from '../../Generic/EmailModal';
import GradeCommentsModal, { IGradeCommentsModalResProps } from './GradeCommentsModal';
import OverallGradesApplied from './OverallGradesApplied';

// Types
import { EmailProviderOption } from '../../../Types/Enum/EmailProviderOption';
import { GradeCommentsModalTab } from '../../../Types/Enum/GradeCommentsModalTab';
import { GradeType } from '../../../Types/Enum/GradeType';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';
import { ICourseStatisticsList } from '../../../Types/Section/ICourseStatisticsList';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IEmailSettings } from '../../../Types/InstitutionSettings/IEmailSettings';
import { IGradeComment } from '../../../Types/Classes/IGradeComment';
import { IGradeCommentsDetail } from '../../../Types/Classes/IGradeCommentsDetail';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IOverallGradeList } from '../../../Types/Section/IOverallGradeList';
import { IOverallGradeListTerm } from '../../../Types/Section/IOverallGradeListTerm';
import { IOverallGradesChange } from '../../../Types/Section/IOverallGradesChange';
import { IOverallGradesResources } from '../../../Types/Resources/Classes/IOverallGradesResources';
import { IOverallGradesSaveChange } from '../../../Types/Section/IOverallGradesSaveChange';
import { ISectionApproveGrade } from '../../../Types/Section/ISectionApproveGrade';
import { ISectionOverallGradeList } from '../../../Types/Section/ISectionOverallGradeList';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Classes/OverallGrades';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import Store from '../../../Stores/CourseManagementStore';
// #endregion Imports

// #region Types
export interface IOverallGradesProps {
    hasSubmit?: boolean;
    isAssistant?: boolean;
    isCourseManagement?: boolean;
    myPosition: number;
    periodDescription: string;
    sectionDescription: string;
    sectionId: number;
    onDownloadModal?: () => void;
    onDownloadStatisticsModal?: (defaultName: string) => void;
}

interface IOverallGradesRes extends IOverallGradesResources {
    courseStatisticsModal: ICourseStatisticsModalResProps;
    gradeCommentsModal: IGradeCommentsModalResProps;
}

interface IOverallGradesState {
    checkboxHeader: boolean;
    componentError: boolean;
    courseStatisticsList?: ICourseStatisticsList;
    creditTypeValues: IDropDownOption[];
    expanded: boolean;
    changeGradeOptions?: IOverallGradesChange;
    changeGradeValues: IOverallGradesSaveChange;
    isCourseStatisticsModal: boolean;
    isChangeGradeModal: boolean;
    isGradeCommentsModal: boolean;
    isIndeterminate: boolean;
    isLoading: boolean;
    isLoadingSave: boolean;
    isLoadingSubmitFinal: boolean;
    isLoadingSubmitMidterm: boolean;
    isMidterm: boolean;
    isMidtermChange: boolean;
    midtermComment?: IGradeCommentsDetail;
    finalComment?: IGradeCommentsDetail;
    isReasonError: boolean;
    isAutomaticOverallGrades: boolean;
    isStudentSelected: boolean;
    isWithdrawn: boolean;
    overallGradeList?: ISectionOverallGradeList;
    personInfo?: IAvatar;
    peopleId?: string;
    tabSelected: GradeCommentsModalTab;
    termSelected: string;
    resources?: IOverallGradesRes;

    // #region Email Modal
    openEmailModal: boolean;
    recipientsEmailAddresses: string[];
    // #endregion Email Modal
}

const styles = ((theme: Theme) => createStyles({
    checkboxHeader: {
        [theme.breakpoints.down('sm')]: {
            marginLeft: `${Tokens.spacing35}!important`
        },
        marginLeft: `${Tokens.spacing40}!important`
    },
    iconHeader: {
        display: 'inline',
        marginLeft: Tokens.spacing30
    },
    inline: {
        display: 'inline'
    },
    marginLeft: {
        marginLeft: Tokens.sizingXSmall
    },
    marginRight: {
        marginRight: Tokens.sizingXxLarge
    },
    table: {
        [theme.breakpoints.up('sm')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '25%'
            },
            // Alignment
            '& > tbody > tr > td:not([data-actionmenu]):nth-child(n+2)': {
                textAlign: 'center'
            },
            '& > thead > tr > th:not([data-actionmenu]):nth-child(n+2)': {
                textAlign: 'center'
            }
        }
    }
}));

type PropsWithStyles = IOverallGradesProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class OverallGrades extends React.Component<PropsWithStyles, IOverallGradesState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;
    private updatedGradeIsMidterm?: boolean;
    private midtermCommentRef: RefObject<HTMLInputElement>;
    private finalCommentRef: RefObject<HTMLInputElement>;
    private changeGradeCommentRef: RefObject<HTMLInputElement>;

    public readonly state: Readonly<IOverallGradesState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Classes';
        this.idPage = 'OverallGrades';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        this.midtermCommentRef = React.createRef();
        this.finalCommentRef = React.createRef();
        this.changeGradeCommentRef = React.createRef();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IOverallGradesState {
        let resources: IOverallGradesRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = Store.getResources(this.props.myPosition);
        }
        return {
            changeGradeValues: { grade: '' },
            checkboxHeader: false,
            componentError: false,
            creditTypeValues: [],
            expanded: false,
            isAutomaticOverallGrades: false,
            isChangeGradeModal: false,
            isCourseStatisticsModal: false,
            isGradeCommentsModal: false,
            isIndeterminate: false,
            isLoading: true,
            isLoadingSave: false,
            isLoadingSubmitFinal: false,
            isLoadingSubmitMidterm: false,
            isMidterm: false,
            isMidtermChange: false,
            isReasonError: false,
            isStudentSelected: false,
            isWithdrawn: false,
            resources: resources,
            tabSelected: GradeCommentsModalTab.Midterm,
            termSelected: '',

            // #region Email Modal
            openEmailModal: false,
            recipientsEmailAddresses: []
            // #endregion Email Modal
        };
    }

    // #region Events
    private onApplyFinal = (): void => {
        try {
            const {
                overallGradeList
            } = this.state;

            if (overallGradeList && overallGradeList.overallGradeList) {
                overallGradeList.overallGradeList.forEach(function (finalterm, row) {
                    if (finalterm.finalterm.calculatedGrade) {
                        overallGradeList.overallGradeList[row].finalterm.instructorGrade = finalterm.finalterm.calculatedGrade.toString();
                        overallGradeList.overallGradeList[row].finalterm.isModified = true;
                    }
                });
                this.setState({
                    overallGradeList: overallGradeList
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onApplyFinal.name, e));
        }
    };

    private onApplyMidterm = (): void => {
        try {
            const {
                overallGradeList
            } = this.state;

            if (overallGradeList && overallGradeList.overallGradeList) {
                overallGradeList.overallGradeList.map(function (midterm, row) {
                    if (midterm.midterm.calculatedGrade) {
                        overallGradeList.overallGradeList[row].midterm.instructorGrade = midterm.midterm.calculatedGrade.toString();
                        overallGradeList.overallGradeList[row].midterm.isModified = true;
                    }
                });
                this.setState({
                    overallGradeList: overallGradeList
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onApplyMidterm.name, e));
        }
    };

    private onApproveGrades = (): void => {
        try {
            const {
                sectionId
            } = this.props;
            const {
                overallGradeList
            } = this.state;

            if (overallGradeList) {
                const approvedGrades: ISectionApproveGrade[] = [];
                overallGradeList.overallGradeList.forEach(student => {
                    if (student.midterm && (student.midterm.isPending || student.midterm.isApproved)) {
                        approvedGrades.push({
                            comments: student.midterm.approvedComments,
                            grade: student.midterm.approvedGradeModified,
                            gradeApprovalId: student.midterm.gradeApprovalId,
                            isApprove: true,
                            isMidterm: true,
                            studentId: student.studentId
                        } as ISectionApproveGrade);
                    }
                    if (student.finalterm.isPending || student.finalterm.isApproved) {
                        approvedGrades.push({
                            comments: student.finalterm.approvedComments,
                            grade: student.finalterm.approvedGradeModified,
                            gradeApprovalId: student.finalterm.gradeApprovalId,
                            isApprove: true,
                            isMidterm: false,
                            studentId: student.studentId
                        } as ISectionApproveGrade);
                    }
                });
                if (approvedGrades.length > 0) {
                    this.showLoaderSave();
                    LayoutActions.showPageLoader();
                    Requests.postSaveStudentsGrades(sectionId, approvedGrades,
                        this.resolvePostOverallGrades);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onApproveGrades.name, e));
        }
    };

    private onChangeApprovedFinalGrade = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                overallGradeList
            } = this.state;

            const data: string[] = id.split('_');
            const row: number = Number(data[1]);

            if (optionSelected && overallGradeList && overallGradeList.overallGradeList) {
                overallGradeList.overallGradeList[row].finalterm.approvedGradeModified = optionSelected.value.toString();
                overallGradeList.overallGradeList[row].finalterm.isModified = true;

                this.setState({
                    overallGradeList: overallGradeList
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeApprovedFinalGrade.name, e));
        }
    };

    private onChangeApprovedMidtermGrade = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                overallGradeList
            } = this.state;

            const data: string[] = id.split('_');
            const row: number = Number(data[1]);

            if (optionSelected && overallGradeList && overallGradeList.overallGradeList) {
                overallGradeList.overallGradeList[row].midterm.approvedGradeModified = optionSelected.value.toString();
                overallGradeList.overallGradeList[row].midterm.isModified = true;
                this.setState({
                    overallGradeList: overallGradeList
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeApprovedMidtermGrade.name, e));
        }
    };

    private onChangeCheckHeader = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                overallGradeList,
                isIndeterminate
            } = this.state;

            let chkboxHeader: boolean = event.target.checked;
            if (overallGradeList) {
                if (isIndeterminate) {
                    chkboxHeader = false;
                }
                overallGradeList.overallGradeList.forEach(student => student.checkbox = chkboxHeader);
                this.setState({
                    checkboxHeader: chkboxHeader,
                    isIndeterminate: false,
                    isStudentSelected: chkboxHeader,
                    overallGradeList: overallGradeList
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
                overallGradeList
            } = this.state;

            let chkboxHeader: boolean = event.target.checked;
            if (overallGradeList && overallGradeList.overallGradeList.length > 0) {
                const id: string[] = event.target.id.split('_');
                overallGradeList.overallGradeList[Number(id[2])].checkbox = event.target.checked;

                if (overallGradeList.overallGradeList.some(s => s.checkbox === false || s.checkbox === undefined)) {
                    chkboxHeader = false;
                }

                let anySelected: boolean = overallGradeList.overallGradeList.some(s => s.checkbox);

                this.setState({
                    checkboxHeader: chkboxHeader,
                    isIndeterminate: anySelected,
                    isStudentSelected: anySelected,
                    overallGradeList: overallGradeList
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onChangeDropdown = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                changeGradeOptions,
                changeGradeValues,
                isMidtermChange
            } = this.state;

            if (optionSelected) {
                if (id === 'ddlGrade') {
                    changeGradeValues.grade = String(optionSelected.value);
                }
                else {
                    if (isMidtermChange && changeGradeOptions && changeGradeOptions.isMidtermGradeChangeReasonRequired
                        && Number(optionSelected.value) === 0) {
                        changeGradeValues.reasonId = Number(optionSelected.value);
                        this.setState({
                            isReasonError: true
                        });
                    }
                    else if (changeGradeOptions && changeGradeOptions.isFinalGradeChangeReasonRequired && Number(optionSelected.value) === 0) {
                        changeGradeValues.reasonId = Number(optionSelected.value);
                        this.setState({
                            isReasonError: true
                        });
                    }
                    else {
                        changeGradeValues.reasonId = Number(optionSelected.value);
                        this.setState({
                            isReasonError: false
                        });
                    }
                }
                this.setState({
                    changeGradeValues: changeGradeValues
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropdown.name, e));
        }
    };

    private onChangeFinalGrade = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                overallGradeList
            } = this.state;

            const data: string[] = id.split('_');
            const row: number = Number(data[1]);

            if (optionSelected && overallGradeList && overallGradeList.overallGradeList) {
                overallGradeList.overallGradeList[row].finalterm.instructorGrade = optionSelected.value.toString();
                overallGradeList.overallGradeList[row].finalterm.isModified = true;

                this.setState({
                    overallGradeList: overallGradeList
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFinalGrade.name, e));
        }
    };

    private onChangeMidtermGrade = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                overallGradeList
            } = this.state;

            const data: string[] = id.split('_');
            const row: number = Number(data[1]);

            if (optionSelected && overallGradeList && overallGradeList.overallGradeList) {
                overallGradeList.overallGradeList[row].midterm.instructorGrade = optionSelected.value.toString();
                overallGradeList.overallGradeList[row].midterm.isModified = true;
                this.setState({
                    overallGradeList: overallGradeList
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeMidtermGrade.name, e));
        }
    };

    private onChangeGradeClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            LayoutActions.showPageLoader();

            const {
                changeGradeValues,
                overallGradeList
            } = this.state;

            let isMidterm: boolean = false;
            let isWithdrawn: boolean = false;
            const studentId: number = Number(event.currentTarget.dataset.studentId);
            const studentGradeId: number = Number(event.currentTarget.dataset.studentGradeId);
            const transcriptDetailId: number = Number(event.currentTarget.dataset.transcriptDetailId);
            const peopleId: string = String(event.currentTarget.dataset.peopleId).trim();
            let creditTypeValues: IDropDownOption[] = [];

            if (String(event.currentTarget.dataset.withdrawn) === 'true') {
                isWithdrawn = true;
            }

            if (event.currentTarget.id.includes('lnkMidChangeGrade')) {
                isMidterm = true;
            }

            const personInfo: IAvatar = {
                colorFirstLetter: Number(event.currentTarget.dataset.colorFirstLetter),
                firstLetter: String(event.currentTarget.dataset.firstLetter),
                fullName: String(event.currentTarget.dataset.fullName),
                hasPicture: false,
                percentage: '',
                peopleId: peopleId,
                personId: studentId
            };

            changeGradeValues.studentGradeId = studentGradeId;
            changeGradeValues.isSubmit = true;
            changeGradeValues.grade = String(event.currentTarget.dataset.transcriptGrade);

            if (overallGradeList?.overallGradeList) {
                const student: IOverallGradeList | undefined = overallGradeList.overallGradeList.find(ogl => ogl.studentId === studentId);
                if (student) {
                    creditTypeValues = student.creditTypeValues.filter(ctv => ctv.value !== '');
                }
            }

            this.setState({
                creditTypeValues: creditTypeValues,
                changeGradeValues: changeGradeValues,
                isMidtermChange: isMidterm,
                isReasonError: false,
                isWithdrawn: isWithdrawn,
                peopleId: peopleId,
                personInfo: personInfo,
                termSelected: String(event.currentTarget.dataset.transcriptGrade)
            });

            if (studentGradeId > 0) {
                Requests.getChangeComments(studentGradeId, this.resolveGetChangeComments);
            }
            else if (transcriptDetailId > 0) {
                this.updatedGradeIsMidterm = isMidterm;
                Requests.postCreateStudentGrade(transcriptDetailId, isMidterm, this.resolveCreateStudentGrade);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeGradeClick.name, e));
        }
    };

    private onChangePanel = (): void => {
        try {
            const {
                expanded
            } = this.state;

            this.setState({
                expanded: !expanded
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePanel.name, e));
        }
    };

    private onClickCourseStatistics = (): void => {
        try {
            const {
                sectionId
            } = this.props;

            LayoutActions.showPageLoader();
            Requests.getCourseStatistics(sectionId, this.resolveGetStatistics);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickCourseStatistics.name, e));
        }
    };

    private onOpenGradeCommentsModal = (event: React.MouseEvent<HTMLLIElement>): void => {
        try {
            const {
                sectionId
            } = this.props;

            const {
                overallGradeList
            } = this.state;

            const personId: number = Number(event.currentTarget.dataset.studentId);
            if (overallGradeList) {
                LayoutActions.showPageLoader();
                let student: IOverallGradeList | undefined = overallGradeList.overallGradeList.find((student) => student.studentId === personId)
                if (student) {
                    student.personId = student.studentId;
                }
                this.setState({
                    personInfo: student
                });
                Requests.getStudentComments(personId, sectionId, this.resolveGetStudentComments);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenGradeCommentsModal.name, e));
        }
    };

    private onCloseCourseStatisticsModal = (): void => {
        try {
            this.setState({
                isCourseStatisticsModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseCourseStatisticsModal.name, e));
        }
    };

    private onCloseChangeGradeModal = (): void => {
        try {
            this.setState({
                changeGradeValues: { grade: '' },
                isChangeGradeModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseChangeGradeModal.name, e));
        }
    };

    private onCloseGradeCommentsModal = (): void => {
        try {
            this.setState({
                finalComment: undefined,
                isGradeCommentsModal: false,
                midtermComment: undefined,
                personInfo: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseGradeCommentsModal.name, e));
        }
    };

    private onSaveGradeCommentsModal = (): void => {
        try {
            const {
                finalComment,
                midtermComment,
                overallGradeList,
                personInfo
            } = this.state;

            const {
                sectionId
            } = this.props;

            if (midtermComment && finalComment && personInfo) {
                const comments: IGradeComment[] = [];

                if (this.midtermCommentRef.current) {
                    midtermComment.instructorComments = this.midtermCommentRef.current.value;
                }

                if (this.finalCommentRef.current) {
                    finalComment.instructorComments = this.finalCommentRef.current.value;
                }

                if (overallGradeList?.showMidtermGrade && midtermComment.instructorComments !== midtermComment.instructorCommentsBackup) {
                    comments.push({
                        comments: midtermComment.instructorComments,
                        studentGradeId: midtermComment.studentGradeId,
                        gradeType: GradeType.MidtermGrade,
                        sectionId: sectionId,
                        studentId: personInfo.personId
                    });
                }

                if (finalComment.instructorComments !== finalComment.instructorCommentsBackup) {
                    comments.push({
                        comments: finalComment.instructorComments,
                        studentGradeId: finalComment.studentGradeId,
                        gradeType: GradeType.FinalGrade,
                        sectionId: sectionId,
                        studentId: personInfo.personId
                    });
                }
                if (comments.length > 0) {
                    LayoutActions.showPageLoader();
                    Requests.updateStudentComments(comments, this.resolveUpdateStudentComments);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveGradeCommentsModal.name, e));
        }
    }

    private onChangeTab = (_event: object, value: number): void => {
        try {
            const {
                midtermComment,
                finalComment,
                tabSelected
            } = this.state;

            if (tabSelected !== value) {
                if (midtermComment && this.midtermCommentRef.current) {
                    midtermComment.instructorComments = this.midtermCommentRef.current.value;
                }

                if (finalComment && this.finalCommentRef.current) {
                    finalComment.instructorComments = this.finalCommentRef.current.value;
                }
                this.setState({
                    tabSelected: value,
                    midtermComment: midtermComment,
                    finalComment: finalComment
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTab.name, e));
        }
    }

    private onApplyGradeCommentsModal = (): void => {
        try {
            const {
                finalComment,
                midtermComment,
                overallGradeList,
                personInfo
            } = this.state;

            if (overallGradeList && personInfo) {
                let student: IOverallGradeList | undefined = overallGradeList.overallGradeList.find((student) => student.studentId === personInfo.personId)
                if (student && midtermComment && finalComment) {
                    if (this.midtermCommentRef.current) {
                        midtermComment.instructorComments = this.midtermCommentRef.current.value;
                    }

                    if (this.finalCommentRef.current) {
                        finalComment.instructorComments = this.finalCommentRef.current.value;
                    }

                    if (overallGradeList.showMidtermGrade && student.midterm) {
                        student.midterm.instructorComments = midtermComment.instructorComments;
                        student.midterm.approvedComments = midtermComment.instructorComments;
                        student.midterm.changedApplied = true;
                    }
                    student.finalterm.instructorComments = finalComment.instructorComments;
                    student.finalterm.approvedComments = finalComment.instructorComments;
                    student.finalterm.changedApplied = true;
                }
            }

            this.setState({
                finalComment: undefined,
                isGradeCommentsModal: false,
                midtermComment: undefined,
                overallGradeList: overallGradeList,
                personInfo: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onApplyGradeCommentsModal.name, e));
        }
    }

    private onSave = (): void => {
        try {
            const {
                sectionId
            } = this.props;
            const {
                overallGradeList
            } = this.state;

            if (overallGradeList) {
                overallGradeList.isSubmit = false;
                overallGradeList.submitType = 0;
                this.showLoaderSave();
                LayoutActions.showPageLoader();
                Requests.postSaveOverallGrades(sectionId, overallGradeList.isSubmit,
                    overallGradeList.submitType,
                    overallGradeList.overallGradeList,
                    this.resolvePostOverallGrades);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSave.name, e));
        }
    };

    private onSubmitModal = (): void => {
        try {
            const {
                changeGradeOptions,
                changeGradeValues,
                isMidtermChange
            } = this.state;

            if (this.changeGradeCommentRef.current) {
                changeGradeValues.narrativeGrade = this.changeGradeCommentRef.current.value;
            }

            if (changeGradeOptions?.isMidtermGradeChangeReasonRequired && isMidtermChange) {
                if (changeGradeValues.reasonId && changeGradeValues.reasonId > 0) {
                    LayoutActions.showPageLoader();
                    Requests.postSubmitChangeGrades(changeGradeValues, this.resolvePostSubmitChangeGrades);
                    this.setState({
                        changeGradeValues: changeGradeValues,
                        isReasonError: false
                    });
                }
                else {
                    this.setState({
                        changeGradeValues: changeGradeValues,
                        isReasonError: true
                    });
                }
            }
            else if (changeGradeOptions?.isFinalGradeChangeReasonRequired) {
                if (changeGradeValues.reasonId && changeGradeValues.reasonId > 0) {
                    LayoutActions.showPageLoader();
                    Requests.postSubmitChangeGrades(changeGradeValues, this.resolvePostSubmitChangeGrades);
                    this.setState({
                        changeGradeValues: changeGradeValues,
                        isReasonError: false
                    });
                }
                else {
                    this.setState({
                        changeGradeValues: changeGradeValues,
                        isReasonError: true
                    });
                }
            }
            else {
                LayoutActions.showPageLoader();
                Requests.postSubmitChangeGrades(changeGradeValues, this.resolvePostSubmitChangeGrades);
                this.setState({
                    changeGradeValues: changeGradeValues,
                    isReasonError: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSubmitModal.name, e));
        }
    };

    private onSubmitFinal = (): void => {
        try {
            const {
                sectionId
            } = this.props;
            const {
                overallGradeList
            } = this.state;

            if (overallGradeList) {
                overallGradeList.isSubmit = true;
                overallGradeList.submitType = 2;
                this.showLoaderSubmitFinal();
                LayoutActions.showPageLoader();
                overallGradeList.overallGradeList.forEach(items => {
                    if (items.finalterm.instructorGrade && items.finalterm.isAllowedToChange) {
                        items.finalterm.isModified = true;
                    }
                });
                Requests.postSaveOverallGrades(sectionId,
                    overallGradeList.isSubmit, overallGradeList.submitType, overallGradeList.overallGradeList.filter(x => x.finalterm.isModified),
                    this.resolvePostOverallGrades);
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onSubmitFinal.name, e));
        }
    };

    private onSubmitMidterm = (): void => {
        try {
            const {
                sectionId
            } = this.props;
            const {
                overallGradeList
            } = this.state;

            if (overallGradeList) {
                overallGradeList.isSubmit = true;
                overallGradeList.submitType = 1;
                this.showLoaderSubmitMidterm();
                LayoutActions.showPageLoader();
                overallGradeList.overallGradeList.forEach(items => {
                    if (items.midterm.instructorGrade && items.midterm.isAllowedToChange) {
                        items.midterm.isModified = true;
                    }
                });
                Requests.postSaveOverallGrades(sectionId, overallGradeList.isSubmit,
                    overallGradeList.submitType, overallGradeList.overallGradeList.filter(x => x.midterm.isModified),
                    this.resolvePostOverallGrades);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSubmitMidterm.name, e));
        }
    };

    // #region Email Modal
    private onOpenEmailModal = (emailAddresses: string[]): void => {
        try {
            const {
                overallGradeList
            } = this.state;

            if (overallGradeList) {
                const emailSettings: IEmailSettings = overallGradeList.emailSettings;
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

    private onClickEmail = (overallGradeList: ISectionOverallGradeList): void => {
        const emails: string[] = [];
        overallGradeList.overallGradeList.forEach(status => {
            if (status.checkbox && status.hasEmail) {
                emails.push(status.email);
            }
        });

        if (overallGradeList.emailSettings.emailProvider === EmailProviderOption.External) {
            window.open(Format.toString(overallGradeList.emailSettings.staffUrl, [emails.join(overallGradeList.emailSettings.staffSeparator)]),
                overallGradeList.emailSettings.staffUrl.toLowerCase() === 'mailto:{0}' ? '_self' : '_blank');
        }
        else {
            this.onOpenEmailModal(emails);
        }
    }
    // #endregion Events

    // #region Functions
    private getCurrentGrade(gradeListTerm: IOverallGradeListTerm): string {
        let grade: string = '';
        try {
            if (gradeListTerm.isApproved) {
                grade = gradeListTerm.approvedGrade;
            }
            else if (gradeListTerm.isPosted) {
                grade = gradeListTerm.transcriptGrade;
            }
            else if (gradeListTerm.isPending) {
                grade = gradeListTerm.approvedGrade;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.getCurrentGrade.name, e));
        }
        return grade;
    }

    private getCurrentGradeStatus(gradeListTerm: IOverallGradeListTerm, resources: IOverallGradesRes): string {
        let status: string = '';
        try {
            if (gradeListTerm.isApproved) {
                status = resources.lblIsApproved;
            }
            else if (gradeListTerm.isPosted) {
                status = resources.lblIsPosted;
            }
            else if (gradeListTerm.isPending) {
                status = resources.lblIsPending;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.getCurrentGradeStatus.name, e));
        }
        return status;
    }

    private gradeIsEditable(academicCalendarSetting: boolean, gradeListTerm: IOverallGradeListTerm): boolean {
        let isEditable: boolean = false;
        try {
            isEditable = (gradeListTerm.isPending
                || gradeListTerm.isApproved)
                && Boolean(gradeListTerm.approvedGradeModified)
                && academicCalendarSetting;
        }
        catch (e) {
            this.logError(LogData.fromException(this.gradeIsEditable.name, e));
        }
        return isEditable;
    }

    private hasCurrentGradeStatus(gradeListTerm: IOverallGradeListTerm): boolean {
        let hasStatus: boolean = false;
        try {
            hasStatus = gradeListTerm.isApproved || gradeListTerm.isPending || gradeListTerm.isPosted;
        }
        catch (e) {
            this.logError(LogData.fromException(this.hasCurrentGradeStatus.name, e));
        }
        return hasStatus;
    }
    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingSave: false,
            isLoadingSubmitFinal: false,
            isLoadingSubmitMidterm: false
        });
    };

    private showLoaderSave = (): void => {
        this.setState({
            isLoadingSave: true
        });
    };

    private showLoaderSubmitFinal = (): void => {
        this.setState({
            isLoadingSubmitFinal: true
        });
    };

    private showLoaderSubmitMidterm = (): void => {
        this.setState({
            isLoadingSubmitMidterm: true
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
    private resolveGetChangeOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetChangeOptions.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    changeGradeOptions: result.data
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetChangeOptions.name, e));
        }
    };

    private resolveGetChangeComments = (json: string): void => {
        try {
            const {
                changeGradeValues
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetChangeComments.name, this.hideAllLoaders);

            if (result?.status) {
                changeGradeValues.narrativeGrade = result.data;
                this.setState({
                    isChangeGradeModal: true,
                    changeGradeValues: changeGradeValues
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetChangeComments.name, e));
        }
    };

    private resolveCreateStudentGrade = (json: string): void => {
        try {
            const {
                changeGradeValues,
                overallGradeList,
                peopleId
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveCreateStudentGrade.name, this.hideAllLoaders);

            if (result?.status) {
                const studentGradeId: number = result.data;
                changeGradeValues.studentGradeId = studentGradeId;

                if (overallGradeList) {
                    let gradeIndex: number = overallGradeList.overallGradeList.findIndex(grade => grade.peopleId == peopleId);
                    if (this.updatedGradeIsMidterm) {
                        overallGradeList.overallGradeList[gradeIndex].midterm.studentGradeId = studentGradeId;
                    }
                    else {
                        overallGradeList.overallGradeList[gradeIndex].finalterm.studentGradeId = studentGradeId;
                    }
                }

                this.setState({
                    changeGradeValues: changeGradeValues,
                    overallGradeList: overallGradeList
                });
                Requests.getChangeComments(studentGradeId, this.resolveGetChangeComments);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetChangeComments.name, e));
        }
    };

    private resolveGetOverallGrades = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetOverallGrades.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    isCourseManagement
                } = this.props;

                const overallGradeList: ISectionOverallGradeList = result.data;
                let isAutomaticOverallGrades: boolean = false;
                if (overallGradeList?.overallGradeList && overallGradeList.overallGradeList.length > 0) {
                    if (!isCourseManagement) {
                        overallGradeList.overallGradeList.forEach(student => {
                            if (student.finalterm) {
                                student.finalterm.hasComments = Boolean(student.finalterm.instructorComments || student.finalterm.approvedComments || student.finalterm.transcriptComments);
                                student.finalterm.approvedGradeModified = student.finalterm.approvedGrade;
                            }
                            if (student.midterm) {
                                student.midterm.hasComments = Boolean(student.midterm.instructorComments || student.midterm.approvedComments || student.midterm.transcriptComments);
                                student.midterm.approvedGradeModified = student.midterm.approvedGrade;
                            }
                        });
                    }
                    else {
                        overallGradeList.overallGradeList.forEach(student => {
                            if (student.finalterm) {
                                student.finalterm.hasComments = Boolean(student.finalterm.instructorComments || student.finalterm.transcriptComments);
                            }
                            if (student.midterm) {
                                student.midterm.hasComments = Boolean(student.midterm.instructorComments || student.midterm.transcriptComments);
                            }
                        });
                    }
                }

                if (overallGradeList.assignmentDepartment) {
                    isAutomaticOverallGrades = overallGradeList.assignmentDepartment.isAutomaticOverallGrades;
                }

                if (overallGradeList.overallGradeList && (overallGradeList.isChangeGradeFaculty || overallGradeList.isChangeGradeDepartment)
                    && (overallGradeList.isMidtermOpen || overallGradeList.isFinaltermOpen)) {
                    Requests.getChangeOptions(this.resolveGetChangeOptions);
                }

                this.setState({
                    finalComment: undefined,
                    isAutomaticOverallGrades: isAutomaticOverallGrades,
                    isGradeCommentsModal: false,
                    midtermComment: undefined,
                    overallGradeList: overallGradeList,
                    personInfo: undefined
                }, this.hideAllLoaders);
                LayoutActions.hidePageLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetOverallGrades.name, e));
        }
    };

    private resolveGetStatistics = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetStatistics.name, this.hideAllLoaders);

            if (result?.status) {
                const courseStatisticsList: ICourseStatisticsList = result.data;
                courseStatisticsList.midtermGrades = result.data.midtermGrades;
                this.setState({
                    courseStatisticsList: courseStatisticsList,
                    isCourseStatisticsModal: true
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetStatistics.name, e));
        }
    };

    private resolvePostOverallGrades = (json: string): void => {
        try {
            const {
                isCourseManagement,
                sectionId
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostOverallGrades.name, this.hideAllLoaders);

            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                LayoutActions.showPageLoader();
                if (isCourseManagement) {
                    Requests.getOverallGrades(sectionId, this.resolveGetOverallGrades);
                }
                else {
                    Requests.getApproveGrades(sectionId, this.resolveGetOverallGrades);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostOverallGrades.name, e));
        }
    };

    private resolvePostSubmitChangeGrades = (json: string): void => {
        try {
            const {
                isCourseManagement,
                sectionId
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSubmitChangeGrades.name, this.hideAllLoaders);

            if (result?.status && result.data) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                LayoutActions.showPageLoader();
                if (isCourseManagement) {
                    Requests.getOverallGrades(sectionId, this.resolveGetOverallGrades);
                }
                else {
                    Requests.getApproveGrades(sectionId, this.resolveGetOverallGrades);
                }
                this.setState({
                    changeGradeValues: { grade: '' },
                    isChangeGradeModal: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSubmitChangeGrades.name, e));
        }
    };

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

    private resolveGetStudentComments = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetStudentComments.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    personInfo,
                    overallGradeList
                } = this.state;

                const gradeCommentsDetails: IGradeCommentsDetail[] = result.data;
                let midtermComment: IGradeCommentsDetail | undefined = gradeCommentsDetails.find(comment => comment.gradeType === GradeType.MidtermGrade);
                let finalComment: IGradeCommentsDetail | undefined = gradeCommentsDetails.find(comment => comment.gradeType === GradeType.FinalGrade);

                if (midtermComment) {
                    midtermComment.instructorCommentsBackup = midtermComment.instructorComments;
                }
                else {
                    midtermComment = {
                        instructorComments: '',
                        instructorCommentsBackup: '',
                        isPosted: false,
                        gradeType: GradeType.MidtermGrade,
                        studentGradeId: 0
                    } as IGradeCommentsDetail;
                }

                if (finalComment) {
                    finalComment.instructorCommentsBackup = finalComment.instructorComments;
                }
                else {
                    finalComment = {
                        instructorComments: '',
                        instructorCommentsBackup: '',
                        isPosted: false,
                        gradeType: GradeType.FinalGrade,
                        studentGradeId: 0
                    } as IGradeCommentsDetail;
                }

                if (overallGradeList && personInfo) {
                    const student: IOverallGradeList | undefined = overallGradeList.overallGradeList.find(student => student.studentId === personInfo.personId);
                    if (student) {
                        if (student.finalterm?.changedApplied) {
                            finalComment.instructorComments = student.finalterm.instructorComments;
                        }

                        if (student.midterm?.changedApplied) {
                            midtermComment.instructorComments = student.midterm.instructorComments;
                        }
                    }
                }

                this.setState({
                    midtermComment: midtermComment,
                    finalComment: finalComment,
                    isGradeCommentsModal: true,
                    tabSelected: overallGradeList?.showMidtermGrade ? GradeCommentsModalTab.Midterm : GradeCommentsModalTab.Final
                });
                LayoutActions.hidePageLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetStudentComments.name, e));
        } LayoutStore.getResourcesLayout()
    };

    private resolveUpdateStudentComments = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveUpdateStudentComments.name, this.hideAllLoaders);
            if (result?.status && result.data) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }

                LayoutActions.showPageLoader();
                Requests.getOverallGrades(this.props.sectionId, this.resolveGetOverallGrades);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveUpdateStudentComments.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            const {
                isCourseManagement,
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

            if (isCourseManagement) {
                Requests.getOverallGrades(sectionId, this.resolveGetOverallGrades);
            }
            else {
                Requests.getApproveGrades(sectionId, this.resolveGetOverallGrades);
            }
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
            classes,
            isCourseManagement,
            isAssistant,
            hasSubmit,
            periodDescription,
            sectionDescription,
            onDownloadModal,
            onDownloadStatisticsModal
        } = this.props;

        const {
            changeGradeOptions,
            changeGradeValues,
            checkboxHeader,
            componentError,
            courseStatisticsList,
            creditTypeValues,
            expanded,
            midtermComment,
            finalComment,
            isAutomaticOverallGrades,
            isChangeGradeModal,
            isCourseStatisticsModal,
            isGradeCommentsModal,
            isIndeterminate,
            isLoading,
            isLoadingSave,
            isLoadingSubmitFinal,
            isLoadingSubmitMidterm,
            isMidterm,
            isReasonError,
            isStudentSelected,
            isWithdrawn,
            overallGradeList,
            peopleId,
            personInfo,
            resources,
            tabSelected,
            termSelected,

            // #region Email Modal
            recipientsEmailAddresses,
            openEmailModal
            // #endregion Email Modal
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (
                <ContainerLoader id="ldrOverallGrades" height="md" />
            );
        }
        else if (!componentError && resources) {
            if (overallGradeList?.overallGradeList && overallGradeList.overallGradeList.length > 0) {

                let courseStatisticsModal: JSX.Element | undefined;
                if (courseStatisticsList) {
                    courseStatisticsModal = (
                        <CourseStatisticsModal
                            courseStatistics={courseStatisticsList}
                            open={isCourseStatisticsModal}
                            periodDescription={periodDescription}
                            resources={resources.courseStatisticsModal}
                            sectionDescription={sectionDescription}
                            onClose={this.onCloseCourseStatisticsModal}
                            onDownloadModal={onDownloadStatisticsModal}
                        />
                    );
                }

                let changeGradeModal: JSX.Element | undefined;
                if (isChangeGradeModal && changeGradeOptions && personInfo && peopleId) {
                    changeGradeModal = (
                        <ChangeGradeModal
                            changeGradeCommentRef={this.changeGradeCommentRef}
                            changeGradeOptions={changeGradeOptions}
                            changeGradeValues={changeGradeValues}
                            creditTypeValues={creditTypeValues}
                            finalTerm={termSelected}
                            isMidterm={isMidterm}
                            isModalOpen={isChangeGradeModal}
                            isReasonError={isReasonError}
                            isWithdrawn={isWithdrawn}
                            peopleId={peopleId}
                            person={personInfo}
                            onCancel={this.onCloseChangeGradeModal}
                            onChangeDropdown={this.onChangeDropdown}
                            onCloseModal={this.onCloseChangeGradeModal}
                            onSubmit={this.onSubmitModal}
                            resources={resources}
                        />
                    );
                }

                let gradeCommentsModal: JSX.Element | undefined;
                if (isGradeCommentsModal && midtermComment && finalComment) {
                    gradeCommentsModal = (
                        <GradeCommentsModal
                            blockCommentEdition={isAutomaticOverallGrades}
                            finalComment={finalComment}
                            isCourseManagement={isCourseManagement}
                            midtermComment={midtermComment}
                            midtermCommentRef={this.midtermCommentRef}
                            finalCommentRef={this.finalCommentRef}
                            openGradeModal={isGradeCommentsModal}
                            person={personInfo}
                            tabSelected={tabSelected}
                            resources={resources.gradeCommentsModal}
                            showMidterm={overallGradeList.showMidtermGrade}
                            onChangeTab={this.onChangeTab}
                            onApply={this.onApplyGradeCommentsModal}
                            onClose={this.onCloseGradeCommentsModal}
                            onSave={this.onSaveGradeCommentsModal}
                        />
                    );
                }

                let overallGradesApplied: JSX.Element | undefined;
                if (isAutomaticOverallGrades) {
                    overallGradesApplied = (
                        <OverallGradesApplied
                            assignment={overallGradeList.assignmentDepartment}
                            expanded={expanded}
                            onChangePanel={this.onChangePanel}
                            resources={resources}
                        />
                    );
                }

                let emailModal: JSX.Element | undefined;
                if (openEmailModal) {
                    emailModal = (
                        <EmailModal
                            emailSettings={overallGradeList.emailSettings}
                            onClose={this.onCloseEmailModal}
                            recipientsEmailAddresses={recipientsEmailAddresses}
                        />
                    );
                }

                contentPage = (
                    <>
                        {overallGradesApplied}
                        <br />
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Hidden smDown>
                                <>
                                    <Grid item>
                                        <Checkbox
                                            checked={isIndeterminate || checkboxHeader}
                                            classes={{
                                                focused: classes.checkboxHeader,
                                                root: classes.checkboxHeader
                                            }}
                                            id="chkSelectAll"
                                            indeterminate={isIndeterminate && !checkboxHeader}
                                            inputProps={{
                                                'aria-label': this.layoutResources?.lblSelectAll
                                            }}
                                            onChange={this.onChangeCheckHeader}
                                        />
                                        <Tooltip
                                            id="tltEmailSelected"
                                            title={resources.lblEmailSelect}
                                            placement="top"
                                        >
                                            <div className={classes.inline}>
                                                <IconButton
                                                    aria-label={resources.lblEmailSelect}
                                                    classes={{ root: classes.iconHeader }}
                                                    color="secondary"
                                                    disabled={!isStudentSelected}
                                                    onClick={() => { this.onClickEmail(overallGradeList) }}
                                                    id="EmailSelectedBtn"
                                                >
                                                    <Icon large name="email" />
                                                </IconButton>
                                            </div>
                                        </Tooltip>
                                    </Grid>
                                    {(onDownloadModal || onDownloadStatisticsModal) && (
                                        <Grid item className={classes.marginRight}>
                                            {onDownloadModal && (
                                                <Button
                                                    TextProps={{
                                                        display: 'inline',
                                                    }}
                                                    IconProps={{
                                                        name: 'download'
                                                    }}
                                                    id="btnDownloadGrades"
                                                    aria-label={Format.toString(resources.formatDownloadGrades, [periodDescription, sectionDescription])}
                                                    align="left"
                                                    textVariantStyling="inherit"
                                                    variant="text"
                                                    onClick={onDownloadModal}
                                                >
                                                    {resources.lblDownload}
                                                </Button>
                                            )}
                                            {onDownloadStatisticsModal && (
                                                <Tooltip
                                                    id="tltCourseStatistics"
                                                    title={resources.lblCourseStatistics}
                                                    placement="top"
                                                >
                                                    <IconButton
                                                        aria-label={resources.lblCourseStatistics}
                                                        classes={{ root: classes.iconHeader }}
                                                        color="secondary"
                                                        id="StatisticsBtn"
                                                        onClick={this.onClickCourseStatistics}
                                                    >
                                                        <Icon large name="bar-chart" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Grid>
                                    )}
                                </>
                            </Hidden>
                            <Hidden mdUp>
                                <>
                                    <Grid item className={classes.marginLeft}>
                                        <Checkbox
                                            checked={isIndeterminate || checkboxHeader}
                                            classes={{
                                                focused: classes.checkboxHeader,
                                                root: classes.checkboxHeader
                                            }}
                                            id="chkSelectAll"
                                            indeterminate={isIndeterminate && !checkboxHeader}
                                            inputProps={{
                                                'aria-label': this.layoutResources?.lblSelectAll
                                            }}
                                            onChange={this.onChangeCheckHeader}
                                        />
                                        <Tooltip
                                            id="tltEmailSelected"
                                            title={resources.lblEmailSelect}
                                            placement="top"
                                        >
                                            <div className={classes.inline}>
                                                <IconButton
                                                    aria-label={resources.lblEmailSelect}
                                                    classes={{ root: classes.iconHeader }}
                                                    color="secondary"
                                                    disabled={!isStudentSelected}
                                                    onClick={() => { this.onClickEmail(overallGradeList) }}
                                                    id="EmailSelectedBtn"
                                                >
                                                    <Icon large name="email" />
                                                </IconButton>
                                            </div>
                                        </Tooltip>
                                    </Grid>
                                    {(onDownloadModal || onDownloadStatisticsModal) && (
                                        <Grid item>
                                            <>
                                                {onDownloadModal && (
                                                    <IconButton
                                                        aria-label={resources.lblDownload}
                                                        classes={{ root: classes.iconHeader }}
                                                        color="secondary"
                                                        id="DownloadBtn"
                                                        onClick={onDownloadModal}
                                                    >
                                                        <Icon large name="download" />
                                                    </IconButton>
                                                )}
                                                {onDownloadStatisticsModal && (
                                                    <Tooltip
                                                        id="tltCourseStatistics"
                                                        title={resources.lblCourseStatistics}
                                                        placement="top"
                                                    >
                                                        <IconButton
                                                            classes={{ root: classes.iconHeader }}
                                                            alt={resources.lblCourseStatistics}
                                                            color="secondary"
                                                            id="StatisticsBtn"
                                                            onClick={this.onClickCourseStatistics}
                                                        >
                                                            <Icon large name="bar-chart" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </>
                                        </Grid>
                                    )}
                                </>
                            </Hidden>
                        </Grid>
                        <br />
                        <Table
                            breakpoint="sm"
                            classes={{ root: classes.table }}
                            id="tblOverallGrades"
                            variant="expansionPanels"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th">
                                        {resources.lblName}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblCreditType}
                                    </TableCell>
                                    {overallGradeList.showMidtermGrade ? (
                                        <>
                                            {overallGradeList.showMidtermCalculatedScore ? (
                                                <TableCell component="th">
                                                    {resources.lblMidtermCalculated}
                                                </TableCell>
                                            ) : undefined}
                                            <TableCell component="th">
                                                {isCourseManagement ? resources.lblMidtermMyGrade : resources.lblInstructorMidtermGrade}
                                            </TableCell>
                                            {!isCourseManagement ? (
                                                <TableCell component="th">
                                                    {resources.lblMidtermMyGrade}
                                                </TableCell>
                                            ) : undefined}
                                            <TableCell component="th">
                                                {resources.lblMidtermActualGrade}
                                            </TableCell>
                                        </>
                                    ) : undefined}
                                    {isCourseManagement && overallGradeList.showProjectedGrade ?
                                        (
                                            <TableCell component="th">
                                                {resources.lblProjectedGrade}
                                            </TableCell>
                                        )
                                        : undefined}
                                    {overallGradeList.showFinaltermCalculatedScore ?
                                        (
                                            <TableCell component="th">
                                                {resources.lblFinalCalculated}
                                            </TableCell>
                                        )
                                        : undefined}
                                    <TableCell component="th">
                                        {isCourseManagement ? resources.lblFinalMyGrade : resources.lblInstructorFinalGrade}
                                    </TableCell>
                                    {!isCourseManagement ? (
                                        <TableCell component="th">
                                            {resources.lblFinalMyGrade}
                                        </TableCell>
                                    ) : undefined}
                                    <TableCell component="th">
                                        {resources.lblFinalActualGrade}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblComments}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {overallGradeList.overallGradeList.map((row, i) => (
                                    <TableExpandableRow key={`studentsList_${row.peopleId}`}>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                        >
                                            <AvatarText
                                                CheckboxProps={{
                                                    checked: Boolean(row.checkbox),
                                                    id: `chkName_${row.personId}_${i}`,
                                                    inputProps: {
                                                        'aria-label': Format.toString(resources.formatSelectStudent, [row.fullName])
                                                    },
                                                    onChange: this.onChangeCheckbox
                                                }}
                                                avatarInfo={row}
                                                complement={row.withdrawn ? (
                                                    <StatusLabel
                                                        id={`stsLbl_${i}_${row.personId}`}
                                                        text={resources.lblWithdrawn}
                                                        type="draft"
                                                    />
                                                ) : undefined}
                                            />
                                        </TableCell>
                                        <TableCell columnName={resources.lblCreditType}>
                                            <span>
                                                {row.creditType}
                                            </span>
                                        </TableCell>
                                        {overallGradeList.showMidtermGrade && (
                                            <>
                                                {overallGradeList.showMidtermCalculatedScore && (
                                                    <TableCell columnName={resources.lblMidtermCalculated}>
                                                        <span>
                                                            {row.midterm.calculatedScore}
                                                        </span>
                                                    </TableCell>
                                                )}
                                                <TableEditableCell
                                                    columnName={isCourseManagement ? resources.lblMidtermMyGrade : resources.lblInstructorMidtermGrade}
                                                    content={(
                                                        <span>
                                                            {row.midterm.instructorGrade}
                                                        </span>
                                                    )}
                                                    edit={Boolean(isCourseManagement) && row.midterm.isAllowedToChange}
                                                    editableComponent={(
                                                        <Dropdown
                                                            disabled={isAutomaticOverallGrades}
                                                            id={`ddlMidtermGrade_${i}_${row.personId}`}
                                                            label=""
                                                            options={row.creditTypeValues}
                                                            size="small"
                                                            value={row.midterm.instructorGrade}
                                                            onChange={this.onChangeMidtermGrade}
                                                        />
                                                    )}
                                                />
                                                {!isCourseManagement && (
                                                    <TableEditableCell
                                                        columnName={resources.lblMidtermMyGrade}
                                                        content={(
                                                            <span>
                                                                {!this.hasCurrentGradeStatus(row.midterm) ?
                                                                    ''
                                                                    : (isCourseManagement ? Format.toString(resources.formatActualGrade,
                                                                        [
                                                                            this.getCurrentGrade(row.midterm),
                                                                            this.getCurrentGradeStatus(row.midterm, resources)
                                                                        ]) : this.getCurrentGrade(row.midterm))}
                                                            </span>
                                                        )}
                                                        edit={this.gradeIsEditable(overallGradeList.isMidtermOpen, row.midterm)}
                                                        editableComponent={(
                                                            <Dropdown
                                                                disabled={isAutomaticOverallGrades}
                                                                id={`ddlApprovedMidtermGrade_${i}_${row.personId}`}
                                                                label=""
                                                                options={row.creditTypeValues}
                                                                size="small"
                                                                value={row.midterm.approvedGradeModified}
                                                                onChange={this.onChangeApprovedMidtermGrade}
                                                            />
                                                        )}
                                                    />
                                                )}
                                                <TableCell columnName={resources.lblMidtermActualGrade}>
                                                    <span>
                                                        {this.hasCurrentGradeStatus(row.midterm) &&
                                                            (
                                                                isCourseManagement && ((!overallGradeList.isChangeGradeDepartment &&
                                                                    !overallGradeList.isChangeGradeFaculty) || !overallGradeList.isMidtermOpen) ?
                                                                    (
                                                                        <Grid container spacing={1} alignItems="center">
                                                                            <Grid item>
                                                                                <Text>
                                                                                    {this.getCurrentGrade(row.midterm)}
                                                                                </Text>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <StatusLabel
                                                                                    id={`stsLblMidterm_${i}`}
                                                                                    text={this.getCurrentGradeStatus(row.midterm, resources)}
                                                                                    type={row.midterm.isPosted ? 'success' : 'pending'}
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                    )
                                                                    :
                                                                    (
                                                                        (overallGradeList.isChangeGradeDepartment ||
                                                                            overallGradeList.isChangeGradeFaculty) && overallGradeList.isMidtermOpen && row.midterm.isPosted ?
                                                                            (
                                                                                isAssistant ? (
                                                                                    <Grid container spacing={1} alignItems="center">
                                                                                        <Grid item>
                                                                                            <Text>
                                                                                                {this.getCurrentGrade(row.midterm)}
                                                                                            </Text>
                                                                                        </Grid>
                                                                                        <Grid item>
                                                                                            <StatusLabel
                                                                                                id={`stsLblMidterm_${i}`}
                                                                                                text={this.getCurrentGradeStatus(row.midterm, resources)}
                                                                                                type={row.midterm.isPosted ? 'success' : 'pending'}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                ) : (
                                                                                    <Grid container spacing={1} alignItems="center">
                                                                                        <Grid item>
                                                                                            <Button
                                                                                                align="left"
                                                                                                data-color-first-letter={row.colorFirstLetter}
                                                                                                data-first-letter={row.firstLetter}
                                                                                                data-full-name={row.fullName}
                                                                                                data-people-id={row.peopleId}
                                                                                                data-student-grade-id={row.midterm.studentGradeId}
                                                                                                data-student-id={row.studentId}
                                                                                                data-transcript-detail-id={row.midterm.transcriptDetailId}
                                                                                                data-transcript-grade={row.midterm.transcriptGrade}
                                                                                                data-withdrawn={row.withdrawn}
                                                                                                id={`lnkMidChangeGrade_${i}`}
                                                                                                textVariantStyling="inherit"
                                                                                                variant="text"
                                                                                                onClick={this.onChangeGradeClick}
                                                                                            >
                                                                                                {this.getCurrentGrade(row.midterm)}
                                                                                            </Button>
                                                                                        </Grid>
                                                                                        <Grid item>
                                                                                            <StatusLabel
                                                                                                id={`stsLblMidterm_${i}`}
                                                                                                text={this.getCurrentGradeStatus(row.midterm, resources)}
                                                                                                type={row.midterm.isPosted ? 'success' : 'pending'}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                )
                                                                            )
                                                                            : (
                                                                                <Grid container spacing={1} alignItems="center">
                                                                                    <Grid item>
                                                                                        <Text>
                                                                                            {this.getCurrentGrade(row.midterm)}
                                                                                        </Text>
                                                                                    </Grid>
                                                                                    <Grid item>
                                                                                        <StatusLabel
                                                                                            id={`stsLblMidterm_${i}`}
                                                                                            text={this.getCurrentGradeStatus(row.midterm, resources)}
                                                                                            type={row.midterm.isPosted ? 'success' : 'pending'}
                                                                                        />
                                                                                    </Grid>
                                                                                </Grid>
                                                                            )
                                                                    )
                                                            )}
                                                    </span>
                                                </TableCell>
                                            </>
                                        )}
                                        {isCourseManagement && overallGradeList.showProjectedGrade && (
                                            <TableCell columnName={resources.lblProjectedGrade}>
                                                <span>
                                                    {row.projectedGrade}
                                                </span>
                                            </TableCell>
                                        )}
                                        {overallGradeList.showFinaltermCalculatedScore && (
                                            <TableCell columnName={resources.lblFinalCalculated}>
                                                <span>
                                                    {row.finalterm.calculatedScore}
                                                </span>
                                            </TableCell>
                                        )}
                                        <TableEditableCell
                                            columnName={isCourseManagement ? resources.lblFinalMyGrade : resources.lblInstructorFinalGrade}
                                            content={(
                                                <span>
                                                    {row.finalterm.instructorGrade}
                                                </span>
                                            )}
                                            edit={Boolean(isCourseManagement) && row.finalterm.isAllowedToChange}
                                            editableComponent={(
                                                <Dropdown
                                                    disabled={isAutomaticOverallGrades}
                                                    id={`ddlFinalGrade_${i}_${row.personId}`}
                                                    label=""
                                                    options={row.creditTypeValues}
                                                    size="small"
                                                    value={row.finalterm.instructorGrade}
                                                    onChange={this.onChangeFinalGrade}
                                                />
                                            )}
                                        />
                                        {!isCourseManagement && (
                                            <TableEditableCell
                                                columnName={resources.lblFinalMyGrade}
                                                content={(
                                                    <span>
                                                        {!this.hasCurrentGradeStatus(row.finalterm) ?
                                                            ''
                                                            : (isCourseManagement ? Format.toString(resources.formatActualGrade,
                                                                [
                                                                    this.getCurrentGrade(row.finalterm),
                                                                    this.getCurrentGradeStatus(row.finalterm, resources)
                                                                ])
                                                                : this.getCurrentGrade(row.finalterm))}
                                                    </span>
                                                )}
                                                edit={this.gradeIsEditable(overallGradeList.isFinaltermOpen, row.finalterm)}
                                                editableComponent={(
                                                    <Dropdown
                                                        disabled={isAutomaticOverallGrades}
                                                        id={`ddlApprovedFinalGrade_${i}_${row.personId}`}
                                                        label=""
                                                        options={row.creditTypeValues}
                                                        size="small"
                                                        value={row.finalterm.approvedGradeModified}
                                                        onChange={this.onChangeApprovedFinalGrade}
                                                    />
                                                )}
                                            />
                                        )}
                                        <TableCell columnName={resources.lblFinalActualGrade}>
                                            <span>
                                                {this.hasCurrentGradeStatus(row.finalterm) &&
                                                    (isCourseManagement && ((!overallGradeList.isChangeGradeDepartment &&
                                                        !overallGradeList.isChangeGradeFaculty) || !overallGradeList.isFinaltermOpen)
                                                        ? (
                                                            <Grid container spacing={1} alignItems="center">
                                                                <Grid item>
                                                                    <Text>
                                                                        {this.getCurrentGrade(row.finalterm)}
                                                                    </Text>
                                                                </Grid>
                                                                <Grid item>
                                                                    <StatusLabel
                                                                        id={`stsLblFinal_${i}`}
                                                                        text={this.getCurrentGradeStatus(row.finalterm, resources)}
                                                                        type={row.finalterm.isPosted ? 'success' : 'pending'}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        )
                                                        : (overallGradeList.isChangeGradeDepartment || overallGradeList.isChangeGradeFaculty)
                                                            && overallGradeList.isFinaltermOpen && row.finalterm.isPosted ?
                                                            (isAssistant ? (
                                                                <Grid container spacing={1} alignItems="center">
                                                                    <Grid item>
                                                                        <Text>
                                                                            {this.getCurrentGrade(row.finalterm)}
                                                                        </Text>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <StatusLabel
                                                                            id={`stsLblFinal_${i}`}
                                                                            text={this.getCurrentGradeStatus(row.finalterm, resources)}
                                                                            type={row.finalterm.isPosted ? 'success' : 'pending'}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            ) : (
                                                                <Grid container spacing={1} alignItems="center">
                                                                    <Grid item>
                                                                        <Button
                                                                            align="left"
                                                                            data-color-first-letter={row.colorFirstLetter}
                                                                            data-first-letter={row.firstLetter}
                                                                            data-full-name={row.fullName}
                                                                            data-people-id={row.peopleId}
                                                                            data-student-grade-id={row.finalterm.studentGradeId}
                                                                            data-student-id={row.studentId}
                                                                            data-transcript-detail-id={row.finalterm.transcriptDetailId}
                                                                            data-transcript-grade={row.finalterm.transcriptGrade}
                                                                            data-withdrawn={row.withdrawn}
                                                                            id={`lnkFinalChangeGrade_${i}`}
                                                                            textVariantStyling="inherit"
                                                                            variant="text"
                                                                            onClick={this.onChangeGradeClick}
                                                                        >
                                                                            {this.getCurrentGrade(row.finalterm)}
                                                                        </Button>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <StatusLabel
                                                                            id={`stsLblFinal_${i}`}
                                                                            text={this.getCurrentGradeStatus(row.finalterm, resources)}
                                                                            type={row.finalterm.isPosted ? 'success' : 'pending'}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            )
                                                            )
                                                            : (
                                                                <Grid container spacing={1} alignItems="center">
                                                                    <Grid item>
                                                                        <Text>
                                                                            {this.getCurrentGrade(row.finalterm)}
                                                                        </Text>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <StatusLabel
                                                                            id={`stsLblFinal_${i}`}
                                                                            text={this.getCurrentGradeStatus(row.finalterm, resources)}
                                                                            type={row.finalterm.isPosted ? 'success' : 'pending'}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            )
                                                    )}
                                            </span>
                                        </TableCell>
                                        <TableCell columnName={resources.lblComments}>
                                            <span>
                                                <Tooltip title={resources.lblComments}>
                                                    <IconButton
                                                        aria-label={
                                                            overallGradeList.showMidtermGrade && row.midterm.hasComments || row.finalterm.hasComments
                                                                ? resources.lblAvailableComments
                                                                : resources.lblComments
                                                        }
                                                        color="gray"
                                                        data-student-id={row.studentId}
                                                        id={`btnComments_${i}`}
                                                        onClick={this.onOpenGradeCommentsModal}
                                                    >
                                                        {(overallGradeList.showMidtermGrade && row.midterm.hasComments) || row.finalterm.hasComments ? (
                                                            <NotificationBadge>
                                                                <Comments />
                                                            </NotificationBadge>
                                                        ) : (
                                                            <Comments />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                            </span>
                                        </TableCell>
                                    </TableExpandableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <br />
                        <Grid container alignItems="flex-end">
                            <Grid item xs>
                                {isCourseManagement ? (
                                    <ButtonGroup id="btnOverallGradesActions">
                                        {overallGradeList.showMidtermGrade && overallGradeList.showMidtermApply && (
                                            <Button
                                                id="btnApplyMidterm"
                                                onClick={this.onApplyMidterm}
                                                color="secondary"
                                            >
                                                {resources.btnApplyMidterm}
                                            </Button>
                                        )}
                                        {overallGradeList.showFinaltermApply && (
                                            <Button
                                                id="btnApplyFinal"
                                                onClick={this.onApplyFinal}
                                                color="secondary"
                                            >
                                                {resources.btnApplyFinal}
                                            </Button>
                                        )}
                                        <Button
                                            disabled={isLoadingSubmitMidterm || isLoadingSubmitFinal || isAutomaticOverallGrades}
                                            id="btnSave"
                                            loading={isLoadingSave}
                                            onClick={this.onSave}
                                        >
                                            {resources.lblSave}
                                        </Button>
                                        {overallGradeList.isMidtermOpen && overallGradeList.showMidtermGrade && hasSubmit && (
                                            <Button
                                                disabled={isLoadingSave || isLoadingSubmitFinal}
                                                id="btnSubmitMidterm"
                                                loading={isLoadingSubmitMidterm}
                                                onClick={this.onSubmitMidterm}
                                            >
                                                {resources.btnSubmitMidterm}
                                            </Button>
                                        )}
                                        {overallGradeList.isFinaltermOpen && hasSubmit && (
                                            <Button
                                                disabled={isLoadingSave || isLoadingSubmitMidterm}
                                                id="btnSubmitFinal"
                                                loading={isLoadingSubmitFinal}
                                                onClick={this.onSubmitFinal}
                                            >
                                                {resources.btnSubmitFinal}
                                            </Button>
                                        )}
                                    </ButtonGroup>
                                ) : ((overallGradeList.isFinaltermOpen || overallGradeList.isMidtermOpen) && (
                                    <Button
                                        disabled={isLoadingSave}
                                        id="btnApproveGrades"
                                        loading={isLoadingSave}
                                        onClick={this.onApproveGrades}
                                    >
                                        {resources.btnApproveGrades}
                                    </Button>
                                ))}
                            </Grid>
                        </Grid>
                        {changeGradeModal}
                        {courseStatisticsModal}
                        {emailModal}
                        {gradeCommentsModal}
                    </>
                );
            }
            else {
                contentPage = (
                    <Illustration
                        color="secondary"
                        height="lg"
                        internalName="no-enrolled"
                        text={resources.lblNoOverallGrades}
                    />
                );
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
export default withStyles(styles)(OverallGrades);