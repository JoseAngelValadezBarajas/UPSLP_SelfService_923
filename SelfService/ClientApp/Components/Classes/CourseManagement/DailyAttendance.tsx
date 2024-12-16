/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: DailyAttendance.tsx
 * Type: Container component */

// #region Imports
import classnames from 'classnames';
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Collapse from '@hedtech/powercampus-design-system/react/core/Collapse';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IDailyAttendanceResources } from '../../../Types/Resources/Classes/IDailyAttendanceResources';
import { IAttendanceDaily } from '../../../Types/Section/IAttendanceDaily';
import { IAttendanceDailyCalendar } from '../../../Types/Section/IAttendanceDailyCalendar';
import { IAttendanceDailySave } from '../../../Types/Section/IAttendanceDailySave';
import { IAttendanceSectionMeeting } from '../../../Types/Section/IAttendanceSectionMeeting';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Internal components
import DailyAttendanceTable, { IDailyAttendanceTableResProps } from './DailyAttendanceTable';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Classes/DailyAttendance';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import Actions from '../../../Actions/CourseManagementActions';
import Store from '../../../Stores/CourseManagementStore';
// #endregion Imports

// #region Types
export interface IDailyAttendanceProps {
    cultures: ICultures;
    includeLocation: boolean;
    includeNotes: boolean;
    includeStudents: boolean;
    includeTakeAttendance: boolean;
    inDashboard?: boolean;
    myPosition: number;
    sectionId: number;
    onDownloadDailyAttendance: (defaultName: string, nameSelected: string) => void;
}

interface IDailyAttendanceRes extends IDailyAttendanceResources {
    dailyAttendanceTable: IDailyAttendanceTableResProps;
    formatDailyAttendance: string;
}

interface IDailyAttendanceState {
    attendanceDaily?: IAttendanceDaily;
    attendanceDailyCalendar?: IAttendanceDailyCalendar;
    attendanceDailyEndDate: string;
    attendanceDailySave: IAttendanceDailySave[];
    attendanceDailySaveBatch: IAttendanceDailySave;
    attendanceDailyStartDate: string;
    calendarKey: number;
    componentError: boolean;
    endDate: string;
    isLoading: boolean;
    isLoadingHours: boolean;
    isLoadingTable: boolean;
    resources?: IDailyAttendanceRes;
    showAttendanceDaily: boolean;
    showCalendar: boolean;
    startDate: string;
    statusAttendanceSelected: string;

    // #region Notes
    calendarKeySelected?: number;
    editNotesModal: boolean;
    isLoadingSaveNotes: boolean;
    notesSelected?: string;
    // #endregion Notes
}

const styles = ((theme: any) => createStyles({
    cardsContainer: {
        [theme.breakpoints.up('sm')]: {
            maxHeight: '200px'
        },
        height: '100%',
        marginTop: Tokens.spacing40,
        maxHeight: '400px',
        overflowX: 'hidden',
        overflowY: 'auto'
    },
    datePickerContainer: {
        [theme.breakpoints.up('sm')]: {
            height: '100%'
        },
        alignItems: 'center',
        display: 'flex',
        height: 'auto',
        width: '100%'
    },
    green: {
        borderLeftColor: `${Tokens.colorFillAlertSuccess}!important`
    },
    legendMissingIndicator: {
        backgroundColor: Tokens.tangerine200,
        borderTopLeftRadius: '12px',
        height: Tokens.spacing50,
        marginLeft: Tokens.spacing35,
        width: Tokens.spacing50
    },
    legendSelectedIndicator: {
        backgroundColor: theme.palette.ctaColor.base,
        borderRadius: '50%',
        height: Tokens.spacing50,
        marginLeft: Tokens.spacing35,
        width: Tokens.spacing50
    },
    legendTakenIndicator: {
        backgroundColor: Tokens.kiwi200,
        height: Tokens.spacing50,
        width: Tokens.spacing50
    },
    marginTop: {
        [theme.breakpoints.up('md')]: {
            marginTop: Tokens.spacing50
        }
    },
    meetingCard: {
        borderLeft: `thick solid ${Tokens.fountain600}`,
        marginBottom: Tokens.spacing50,
        paddingLeft: Tokens.spacing40,
        paddingTop: Tokens.spacing30
    },
    red: {
        borderLeftColor: `${Tokens.colorFillAlertError}!important`
    },
    textMultiline: {
        height: '300px'
    },
    textWithBreak: {
        whiteSpace: 'pre-line'
    },
    toggleCalendar: {
        marginRight: Tokens.spacing40
    },
    dailyAttendanceCalendar: {
        '& .DayPicker-Day--missing:not(.DayPicker-Day--outside):not(.DayPicker-Day--selected)': {
            '&:hover': {
                backgroundColor: Tokens.colorBrandNeutral250
            },
            backgroundColor: Tokens.tangerine200,
            border: `${Tokens.borderWidthThicker} solid ${Tokens.colorBrandNeutral100}`,
            borderRadius: `${Tokens.spacingReset}`,
            borderTopLeftRadius: '25px'
        },
        '& .DayPicker-Day--taken:not(.DayPicker-Day--outside):not(.DayPicker-Day--selected)': {
            '&:hover': {
                backgroundColor: Tokens.colorBrandNeutral250
            },
            backgroundColor: Tokens.kiwi200,
            border: `${Tokens.borderWidthThicker} solid ${Tokens.colorBrandNeutral100}`,
            borderRadius: `${Tokens.spacingReset}`
        }
    }
}));

type PropsWithStyles = IDailyAttendanceProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class DailyAttendance extends React.Component<PropsWithStyles, IDailyAttendanceState> {
    private idModule: string;
    private idPage: string;
    private noSpecialCharsForAttendanceDaily: RegExp;

    public readonly state: Readonly<IDailyAttendanceState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Classes';
        this.idPage = 'DailyAttendance';
        this.noSpecialCharsForAttendanceDaily = new RegExp(/[~<>]/g);
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IDailyAttendanceState {
        let resources: IDailyAttendanceRes | undefined;

        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = Store.getResources(this.props.myPosition);
        }
        return {
            attendanceDailyEndDate: '',
            attendanceDailySave: [],
            attendanceDailySaveBatch: {},
            attendanceDailyStartDate: '',
            calendarKey: 0,
            componentError: false,
            endDate: '',
            isLoading: true,
            isLoadingHours: false,
            isLoadingTable: false,
            resources: resources,
            showAttendanceDaily: false,
            showCalendar: false,
            startDate: '',
            statusAttendanceSelected: '',

            // #region Notes
            editNotesModal: false,
            isLoadingSaveNotes: false
            // #endregion Notes
        };
    }

    // #region Events

    // #region Notes
    private onChangeNotes = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            this.setState({
                notesSelected: event.target.value
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeNotes.name, e));
        }
    };

    private onCloseNotes = (): void => {
        try {
            if (!this.state.isLoadingSaveNotes) {
                this.setState({
                    calendarKeySelected: undefined,
                    editNotesModal: false,
                    notesSelected: undefined
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseNotes.name, e));
        }
    };

    private onEditNotes = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                attendanceDaily
            } = this.state;

            const calendarKey: number = Number(event.currentTarget.dataset.calendarKey);

            if (attendanceDaily) {
                const meeting: IAttendanceSectionMeeting | undefined =
                    attendanceDaily.sectionMeetingCalendarViewModels.find(h => h.calendarKey === calendarKey);
                if (meeting) {
                    this.setState({
                        calendarKeySelected: meeting.calendarKey,
                        editNotesModal: true,
                        notesSelected: meeting.notes
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditNotes.name, e));
        }
    };

    private onSaveNotes = (): void => {
        try {
            const {
                calendarKeySelected,
                notesSelected
            } = this.state;

            if (calendarKeySelected) {
                this.showLoaderSaveNotes();
                Requests.saveCalendarNotes(calendarKeySelected, notesSelected ? notesSelected : null, this.resolveSaveNotes);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveNotes.name, e));
        }
    };
    // #endregion Notes

    // #region Take attendance
    private onTakeAttendance = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                attendanceDaily,
                attendanceDailyCalendar
            } = this.state;

            const calendarKey: number = Number(event.currentTarget.dataset.calendarKey);

            if (attendanceDailyCalendar && attendanceDaily) {
                Actions.setDailyAttendance(attendanceDailyCalendar, attendanceDaily, calendarKey);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTakeAttendance.name, e));
        }
    };
    // #endregion Take attendance

    private onChangeApplyStatus = (optionSelected: IDropDownOption): void => {
        try {
            const {
                sectionId
            } = this.props;
            const {
                attendanceDaily,
                attendanceDailyCalendar,
                attendanceDailySaveBatch,
                calendarKey
            } = this.state;

            if (optionSelected && attendanceDaily && sectionId && attendanceDailyCalendar) {
                attendanceDaily.studentMeetingAttendanceViewModels.forEach(student => {
                    if (!student.withdrawn) {
                        student.attendanceStatus = Number(optionSelected.value);
                    }
                });
                this.setState({
                    attendanceDaily: attendanceDaily,
                    statusAttendanceSelected: String(optionSelected.value)
                });
                attendanceDailySaveBatch.calendarKey = calendarKey;
                attendanceDailySaveBatch.meetingAttendanceId = Number(optionSelected.value) === 0 ? undefined : Number(optionSelected.value);
                attendanceDailySaveBatch.meetingDate = attendanceDailyCalendar.calendarDateSelected;
                attendanceDailySaveBatch.sectionId = sectionId;
                Requests.postSaveAttendanceDailyBatch(attendanceDailySaveBatch, this.resolvePostSaveAttendanceDaily);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeApplyStatus.name, e));
        }
    };

    private onChangeAttendanceStatus = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                attendanceDaily
            } = this.state;

            const data: string[] = id.split('_');
            const row: number = Number(data[1]);

            if (optionSelected && attendanceDaily) {
                attendanceDaily.studentMeetingAttendanceViewModels[row].attendanceStatus = Number(optionSelected.value);
                this.setState({
                    attendanceDaily: attendanceDaily
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeAttendanceStatus.name, e));
        }
    };

    private onChangeDailyAttendance = (date: string): void => {
        try {
            const {
                includeStudents,
                sectionId
            } = this.props;
            const {
                attendanceDailyCalendar
            } = this.state;

            if (attendanceDailyCalendar) {
                attendanceDailyCalendar.calendarDateSelected = date;
                this.setState({
                    attendanceDailyCalendar: attendanceDailyCalendar,
                    attendanceDailyEndDate: '',
                    attendanceDailySave: [],
                    attendanceDailyStartDate: '',
                    calendarKey: 0
                }, () => {
                    this.showLoaderHours();
                    Requests.getAttendanceDailyHours(sectionId, date, includeStudents, 0, this.resolveGetAttendanceDailyHours);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDailyAttendance.name, e));
        }
    };

    private onClickMeeting = (event: any): void => {
        try {
            const {
                sectionId
            } = this.props;

            const id: string[] = event.target.parentElement.parentElement.id.split('_');
            this.showLoadingTable();
            Requests.getAttendanceStudentDaily(sectionId, Number(id[1]),
                this.resolveGetAttendanceStudentDaily);
            this.setState({
                attendanceDailyEndDate: id[3],
                attendanceDailySave: [],
                attendanceDailyStartDate: id[2],
                calendarKey: Number(id[1])
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickMeeting.name, e));
        }
    };

    private onSaveAttendanceDailyList = (): void => {
        try {
            const {
                sectionId
            } = this.props;

            const {
                attendanceDaily,
                attendanceDailyCalendar,
                attendanceDailySave,
                calendarKey
            } = this.state;

            let hasStatus: boolean = false;

            if (attendanceDaily && attendanceDailyCalendar && sectionId) {
                attendanceDaily.studentMeetingAttendanceViewModels.forEach(item => {
                    if ((item.studentMeetingAttendanceId && item.studentMeetingAttendanceId > 0)
                        || (!item.studentMeetingAttendanceId && item.attendanceStatus > 0)) {
                        this.showLoadingTable();
                        hasStatus = true;
                        attendanceDailySave.push({
                            calendarKey: calendarKey,
                            comment: item.comments,
                            meetingAttendanceId: item.attendanceStatus === 0 ? undefined : item.attendanceStatus,
                            meetingDate: attendanceDailyCalendar.calendarDateSelected,
                            sectionId: sectionId,
                            studentId: item.personId,
                            studentMeetingAttendanceId: item.studentMeetingAttendanceId
                        });
                    }
                });

                if (hasStatus) {
                    Requests.postSaveAttendanceDaily(attendanceDailySave, this.resolvePostSaveAttendanceDaily);
                }
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveAttendanceDailyList.name, e));
        }
    };

    private onTextFieldCommentsChange = (event: any): void => {
        try {
            const {
                attendanceDaily
            } = this.state;
            const data: string[] = event.target.id.split('_');
            const row: number = Number(data[1]);
            if (attendanceDaily) {
                if (!this.noSpecialCharsForAttendanceDaily.test(event.target.value)) {
                    event.target.value = event.target.value.replace(this.noSpecialCharsForAttendanceDaily, '');
                    attendanceDaily.studentMeetingAttendanceViewModels[row].comments = event.target.value;
                    this.setState({
                        attendanceDaily: attendanceDaily
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTextFieldCommentsChange.name, e));
        }
    };

    private onToggleCalendar = (): void => {
        try {
            this.setState({
                showCalendar: !this.state.showCalendar
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onToggleCalendar.name, e));
        }
    };
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingHours: false
        });
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private hideLoaderHours = (): void => {
        this.setState({
            isLoadingHours: false
        });
    };

    private hideLoadingTable = (): void => {
        this.setState({
            isLoadingTable: false
        });
    };

    private showLoadingTable = (): void => {
        this.setState({
            isLoadingTable: true
        });
    };

    private showLoaderHours = (): void => {
        this.setState({
            isLoadingHours: true
        });
    };

    private hideLoaderSaveNotes = (): void => {
        this.setState({
            isLoadingSaveNotes: false
        });
    };

    private showLoaderSaveNotes = (): void => {
        this.setState({
            isLoadingSaveNotes: true
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

    // #region Notes
    private resolveSaveNotes = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveNotes.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    attendanceDaily,
                    calendarKeySelected,
                    notesSelected
                } = this.state;

                if (attendanceDaily) {
                    const meeting: IAttendanceSectionMeeting | undefined =
                        attendanceDaily.sectionMeetingCalendarViewModels.find(h => h.calendarKey === calendarKeySelected);
                    if (meeting) {
                        meeting.notes = notesSelected;
                    }
                }
                this.setState({
                    attendanceDaily: attendanceDaily,
                    calendarKeySelected: undefined,
                    editNotesModal: false,
                    notesSelected: undefined
                }, this.hideLoaderSaveNotes);
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveNotes.name, e));
        }
    };
    // #endregion Notes

    private resolveGetAttendanceDailyCalendar = (json: string): void => {
        try {
            const {
                includeStudents,
                sectionId
            } = this.props;

            const {
                calendarKey
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAttendanceDailyCalendar.name, this.hideAllLoaders);

            if (result?.status) {
                const attendanceDailyCalendar: IAttendanceDailyCalendar | undefined = result.data;
                if (attendanceDailyCalendar && attendanceDailyCalendar.calendarDates) {
                    attendanceDailyCalendar.calendarTakenDates = [];
                    attendanceDailyCalendar.calendarMissingDates = [];
                    if (attendanceDailyCalendar.calendarDates
                        && attendanceDailyCalendar.calendarDates.length > 0) {
                        attendanceDailyCalendar.calendarDates.forEach(cd => {
                            if (cd.missingAttendance) {
                                attendanceDailyCalendar.calendarMissingDates.push(cd.calendarDate);
                            }
                            else {
                                attendanceDailyCalendar.calendarTakenDates.push(cd.calendarDate);
                            }
                        });
                    }
                    this.setState({
                        attendanceDaily: undefined,
                        attendanceDailyCalendar: attendanceDailyCalendar
                    }, () => {
                        this.hideLoader();
                        this.showLoaderHours();
                        Requests.getAttendanceDailyHours(sectionId, attendanceDailyCalendar.calendarDateSelected, includeStudents, calendarKey,
                            this.resolveGetAttendanceDailyHours);
                    });
                }
                else {
                    this.setState({
                        attendanceDaily: undefined,
                        attendanceDailyCalendar: undefined
                    }, this.hideLoader);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAttendanceDailyCalendar.name, e));
        }
    };

    private resolveGetAttendanceDailyHours = (json: string): void => {
        try {
            const {
                attendanceDailyCalendar,
                attendanceDailyEndDate,
                attendanceDailyStartDate,
                calendarKey
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAttendanceDailyHours.name, this.hideAllLoaders);

            if (result?.status) {
                const attendanceDaily: IAttendanceDaily | undefined = result.data;
                if (attendanceDaily) {
                    if (attendanceDaily.sectionMeetingCalendarViewModels
                        && attendanceDaily.sectionMeetingCalendarViewModels.length > 0) {
                        if (attendanceDailyCalendar) {
                            attendanceDailyCalendar.calendarTakenDates = [];
                            attendanceDailyCalendar.calendarMissingDates = [];
                            if (attendanceDailyCalendar.calendarDates
                                && attendanceDailyCalendar.calendarDates.length > 0) {
                                let missingAttendance: boolean = false;
                                attendanceDailyCalendar.calendarDates.forEach(cd => {
                                    if (cd.calendarDate === attendanceDaily.calendarDate) {
                                        attendanceDaily.sectionMeetingCalendarViewModels.forEach(s => {
                                            missingAttendance = missingAttendance || s.missingAttendance;
                                        });
                                        cd.missingAttendance = missingAttendance;
                                    }
                                    if (cd.missingAttendance) {
                                        attendanceDailyCalendar.calendarMissingDates.push(cd.calendarDate);
                                    }
                                    else {
                                        attendanceDailyCalendar.calendarTakenDates.push(cd.calendarDate);
                                    }
                                });
                            }
                        }
                        this.setState({
                            attendanceDaily: attendanceDaily,
                            attendanceDailyCalendar: attendanceDailyCalendar,
                            attendanceDailyEndDate: attendanceDailyEndDate !== '' ? attendanceDailyEndDate :
                                attendanceDaily.sectionMeetingCalendarViewModels[0].endTime,
                            attendanceDailyStartDate: attendanceDailyStartDate !== '' ? attendanceDailyStartDate :
                                attendanceDaily.sectionMeetingCalendarViewModels[0].startTime,
                            calendarKey: calendarKey !== 0 ? calendarKey : attendanceDaily.sectionMeetingCalendarViewModels[0].calendarKey
                        }, () => {
                            this.hideLoaderHours();
                            this.hideLoadingTable();
                        });
                    }
                    else {
                        this.setState({
                            attendanceDaily: attendanceDaily,
                            attendanceDailyEndDate: '',
                            attendanceDailyStartDate: '',
                            calendarKey: 0
                        }, () => {
                            this.hideLoaderHours();
                            this.hideLoadingTable();
                        });
                    }
                }
                else {
                    this.setState({
                        attendanceDaily: undefined,
                        attendanceDailyEndDate: '',
                        attendanceDailyStartDate: '',
                        calendarKey: 0
                    }, () => {
                        this.hideLoaderHours();
                        this.hideLoadingTable();
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAttendanceDailyHours.name, e));
        }
    };

    private resolveGetAttendanceStudentDaily = (json: string): void => {
        try {
            const {
                attendanceDaily
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAttendanceStudentDaily.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data && attendanceDaily) {
                    attendanceDaily.studentMeetingAttendanceViewModels = result.data.studentMeetingAttendanceViewModels;
                    this.setState({
                        attendanceDaily: attendanceDaily,
                        showAttendanceDaily: true
                    }, this.hideLoadingTable);
                }
                else {
                    this.hideLoadingTable();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAttendanceStudentDaily.name, e));
        }
    };

    private resolvePostSaveAttendanceDaily = (json: string): void => {
        try {
            const {
                attendanceDailyCalendar,
                calendarKey
            } = this.state;

            const {
                includeStudents,
                sectionId
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveAttendanceDaily.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data && attendanceDailyCalendar) {
                    Requests.getAttendanceDailyHours(sectionId, attendanceDailyCalendar.calendarDateSelected, includeStudents, calendarKey,
                        this.resolveGetAttendanceDailyHours);
                    const resourcesLayout = LayoutStore.getResourcesLayout();
                    if (resourcesLayout) {
                        LayoutActions.setAlert({
                            message: resourcesLayout.lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    }
                    this.setState({
                        attendanceDailySave: [],
                        statusAttendanceSelected: ''
                    });
                }
                else {
                    this.setState({
                        attendanceDailySave: [],
                        statusAttendanceSelected: ''
                    }, this.hideLoader);
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveAttendanceDaily.name, e));
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
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
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

            const dailyAttendanceCalendar: IAttendanceDailyCalendar | undefined = Store.getDailyAttendanceCalendar();
            const dailyAttendance: IAttendanceDaily | undefined = Store.getDailyAttendance();
            const calendarKey: number | undefined = Store.getCalendarKey();
            if (dailyAttendanceCalendar && dailyAttendance && calendarKey) {
                const meeting: IAttendanceSectionMeeting | undefined =
                    dailyAttendance.sectionMeetingCalendarViewModels.find(h => h.calendarKey === calendarKey);
                if (meeting) {
                    this.setState({
                        attendanceDaily: dailyAttendance,
                        attendanceDailyCalendar: dailyAttendanceCalendar,
                        attendanceDailyEndDate: meeting.endTime,
                        attendanceDailyStartDate: meeting.startTime,
                        calendarKey: meeting.calendarKey
                    }, this.hideLoader);
                    this.showLoadingTable();
                    Requests.getAttendanceStudentDaily(sectionId, calendarKey,
                        this.resolveGetAttendanceStudentDaily);
                }
            }
            else {
                Requests.getAttendanceDailyCalendar(sectionId, this.resolveGetAttendanceDailyCalendar);
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
            cultures,
            includeLocation,
            includeNotes,
            includeStudents,
            includeTakeAttendance,
            inDashboard,
            onDownloadDailyAttendance
        } = this.props;

        const {
            attendanceDaily,
            attendanceDailyCalendar,
            attendanceDailyEndDate,
            attendanceDailyStartDate,
            componentError,
            isLoading,
            isLoadingHours,
            isLoadingTable,
            resources,
            showCalendar,
            statusAttendanceSelected,

            // #region Notes
            editNotesModal,
            isLoadingSaveNotes,
            notesSelected
            // #endregion Notes
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (
                <ContainerLoader id="ldrCalendar" height="md" />
            );
        }
        else if (!componentError && resources) {
            if (attendanceDailyCalendar
                && attendanceDailyCalendar.calendarDates
                && attendanceDailyCalendar.calendarDates.length > 0
                && attendanceDailyCalendar.calendarDateSelected) {
                const getColorClass = (isCompleted: number): string => {
                    let colorClass: string = '';
                    switch (isCompleted) {
                        case 0:
                            colorClass = classes.green;
                            break;
                        case 1:
                            colorClass = classes.red;
                            break;
                    }
                    return colorClass;
                };

                const calendarDaily: JSX.Element = (
                    <div className={classes.datePickerContainer}>
                        <DatePicker
                            className={classes.dailyAttendanceCalendar}
                            culture={cultures.dateTimeCulture}
                            format={cultures.shortDatePattern}
                            id="dtpDailyAttendance"
                            dateModifiers={{
                                missing: attendanceDailyCalendar.calendarMissingDates,
                                taken: attendanceDailyCalendar.calendarTakenDates
                            }}
                            selectedDates={[attendanceDailyCalendar.calendarDateSelected]}
                            showOutsideDays={false}
                            value={attendanceDailyCalendar.calendarDateSelected}
                            variant="standalone"
                            onChange={this.onChangeDailyAttendance}
                        />
                    </div>
                );

                const calendarDailyLegend: JSX.Element = (
                    <Grid container spacing={1} wrap="nowrap" justifyContent="center">
                        <Grid item>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item>
                                    <div className={classes.legendTakenIndicator} />
                                </Grid>
                                <Grid item>
                                    <Text size="small">
                                        {resources.lblTaken}
                                    </Text>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item>
                                    <div className={classes.legendMissingIndicator} />
                                </Grid>
                                <Grid item>
                                    <Text size="small">
                                        {resources.lblMissing}
                                    </Text>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item>
                                    <div className={classes.legendSelectedIndicator} />
                                </Grid>
                                <Grid item>
                                    <Text size="small">
                                        {resources.lblSelected}
                                    </Text>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                );

                contentPage = (
                    <>
                        <Grid container>
                            <Hidden xsDown>
                                <Grid item>
                                    <Grid container direction="column" spacing={0}>
                                        <Grid item>
                                            {calendarDaily}
                                        </Grid>
                                        <Grid item>
                                            {calendarDailyLegend}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Hidden>
                            <Grid item xs={12} sm className={classes.marginTop}>
                                <Text size="h3">
                                    <Hidden smUp>
                                        <IconButton
                                            className={classes.toggleCalendar}
                                            id="btnShowCalendar"
                                            onClick={this.onToggleCalendar}
                                            title={showCalendar ? resources.lblHideCalendar : resources.lblShowCalendar}
                                        >
                                            <Icon name="calendar" />
                                        </IconButton>
                                    </Hidden>
                                    {!isLoadingHours && attendanceDaily ? attendanceDaily.longDate : ''}
                                </Text>
                                <Hidden smUp>
                                    <Collapse in={showCalendar}>
                                        {calendarDaily}
                                        {calendarDailyLegend}
                                    </Collapse>
                                </Hidden>
                                {isLoadingHours ? (
                                    <ContainerLoader id="ldrHours" height="sm" />
                                ) : (attendanceDaily && (
                                    <>
                                        <div className={classes.cardsContainer}>
                                            {attendanceDaily.sectionMeetingCalendarViewModels.map((meeting, iMeeting) => {
                                                const idParagraph: string = `prgbHour_${meeting.calendarKey}_${meeting.startTime}_${meeting.endTime}`;
                                                return (
                                                    <div
                                                        className={classnames(classes.meetingCard,
                                                            getColorClass(Number(meeting.missingAttendance)))}
                                                        key={`meeting_${meeting.calendarKey}`}
                                                    >
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12}>
                                                                <Grid container spacing={0} wrap="nowrap">
                                                                    <Grid item>
                                                                        <Icon
                                                                            marginRight2
                                                                            name="calendar"
                                                                            verticalAlign="middle"
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs>
                                                                        {includeStudents ? (
                                                                            <Paragraph
                                                                                display="inline"
                                                                                id={idParagraph}
                                                                                text={Format.toString(resources.formatDailyCalendar,
                                                                                    [meeting.startTime, meeting.endTime])}
                                                                                events={[this.onClickMeeting]}
                                                                            />
                                                                        ) : (
                                                                            <>
                                                                                <Text
                                                                                    display="inline"
                                                                                    id={`txtHour_${iMeeting}`}
                                                                                >
                                                                                    {Format.toString(resources.formatDailyCalendarHours,
                                                                                        [meeting.startTime, meeting.endTime])}
                                                                                </Text>
                                                                                {includeTakeAttendance && (
                                                                                    <Button
                                                                                        align="left"
                                                                                        data-calendar-key={meeting.calendarKey}
                                                                                        id={`lnkTakeAttendance_${iMeeting}`}
                                                                                        textVariantStyling="inherit"
                                                                                        variant="text"
                                                                                        onClick={this.onTakeAttendance}
                                                                                    >
                                                                                        {resources.lblTakeAttendance}
                                                                                    </Button>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            {includeLocation && (
                                                                <Grid item xs={12}>
                                                                    <Text
                                                                        IconProps={{
                                                                            name: 'location'
                                                                        }}
                                                                        display="inline"
                                                                    >
                                                                        {Format.toString(resources.formatOrganization,
                                                                            [meeting.campusName])}
                                                                        {meeting.buildingName ?
                                                                            Format.toString(resources.formatBuilding,
                                                                                [meeting.buildingName])
                                                                            : ''}
                                                                        {meeting.floorId ?
                                                                            Format.toString(resources.formatFloor,
                                                                                [meeting.floorId])
                                                                            : ''}
                                                                        {meeting.roomId ?
                                                                            Format.toString(resources.formatRoom,
                                                                                [meeting.roomId])
                                                                            : ''}
                                                                    </Text>
                                                                </Grid>
                                                            )}
                                                            {includeNotes && (
                                                                <Grid item xs={12}>
                                                                    <Grid container spacing={0} wrap="nowrap">
                                                                        <Grid item>
                                                                            <Icon
                                                                                marginRight2
                                                                                verticalAlign="middle"
                                                                                name="note"
                                                                            />
                                                                        </Grid>
                                                                        <Grid item xs>
                                                                            {meeting.notes ? (
                                                                                <>
                                                                                    <Text className={classes.textWithBreak} display="inline">
                                                                                        {meeting.notes.length > 140 ?
                                                                                            Format.toString(resources.formatTruncatedNotes,
                                                                                                [meeting.notes.substring(0, 140)])
                                                                                            : meeting.notes}
                                                                                    </Text>
                                                                                    <Button
                                                                                        align="left"
                                                                                        data-calendar-key={meeting.calendarKey}
                                                                                        id={`lnkEditNotes_${iMeeting}`}
                                                                                        textVariantStyling="inherit"
                                                                                        variant="text"
                                                                                        onClick={this.onEditNotes}
                                                                                    >
                                                                                        {resources.btnEditNotes}
                                                                                    </Button>
                                                                                </>
                                                                            ) : (
                                                                                <Button
                                                                                    align="left"
                                                                                    data-calendar-key={meeting.calendarKey}
                                                                                    id={`lnkAddNotes_${iMeeting}`}
                                                                                    textVariantStyling="inherit"
                                                                                    variant="text"
                                                                                    onClick={this.onEditNotes}
                                                                                >
                                                                                    {resources.btnAddNotes}
                                                                                </Button>
                                                                            )}
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            )}
                                                        </Grid>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                ))}
                            </Grid>
                        </Grid>
                        <Modal
                            disableHeaderTypography
                            id="editNotesModal"
                            header={(
                                <Text size="h2">
                                    {editNotesModal ?
                                        (notesSelected ? resources.lblEditNotes : resources.lblAddNotes)
                                        : undefined}
                                </Text>
                            )}
                            footer={(
                                <ButtonGroup id="btgNotes">
                                    <Button
                                        disabled={isLoadingSaveNotes}
                                        id={'btnCancel'}
                                        color="secondary"
                                        onClick={this.onCloseNotes}
                                    >
                                        {resources.btnCancel}
                                    </Button>
                                    <Button
                                        id={'btnSave'}
                                        loading={isLoadingSaveNotes}
                                        onClick={this.onSaveNotes}
                                    >
                                        {resources.btnSave}
                                    </Button>
                                </ButtonGroup>
                            )}
                            maxWidth="md"
                            open={editNotesModal}
                            onClose={this.onCloseNotes}
                        >
                            <Grid container>
                                <Grid item xs>
                                    <TextField
                                        classes={{ inputMultiline: classes.textMultiline }}
                                        disabled={isLoadingSaveNotes}
                                        id="txtNotes"
                                        label={resources.lblNotes}
                                        multiline
                                        value={notesSelected}
                                        onChange={this.onChangeNotes}
                                    />
                                </Grid>
                            </Grid>
                        </Modal>
                        {includeStudents && !isLoadingHours && attendanceDaily && (
                            <>
                                <Grid container>
                                    <Grid item>
                                        <Text size="h4">
                                            {Format.toString(resources.formatDailyAttendance,
                                                [attendanceDailyStartDate, attendanceDailyEndDate])}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <DailyAttendanceTable
                                    attendanceStatus={attendanceDaily.listOptionViewModel}
                                    attendanceStudentList={attendanceDaily}
                                    isLoadingTable={isLoadingTable}
                                    statusAttendanceSelected={statusAttendanceSelected}
                                    resources={resources.dailyAttendanceTable}
                                    onChangeApplyStatus={this.onChangeApplyStatus}
                                    onChangeAttendanceStatus={this.onChangeAttendanceStatus}
                                    onDownloadDailyAttendance={onDownloadDailyAttendance}
                                    onSaveAttendanceDailyList={this.onSaveAttendanceDailyList}
                                    onTextFieldChange={this.onTextFieldCommentsChange}
                                />
                            </>
                        )}
                    </>
                );
            }
            else {
                contentPage = (
                    <>
                        {!includeStudents ? (<br />) : undefined}
                        <Illustration
                            height={inDashboard ? "sm" : "lg"}
                            name={inDashboard ? "calendar" : "empty-calendar"}
                            text={resources.lblNoDailyAttendance}
                        />
                        {!includeStudents ? (<br />) : undefined}
                    </>
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
export default withStyles(styles)(DailyAttendance);