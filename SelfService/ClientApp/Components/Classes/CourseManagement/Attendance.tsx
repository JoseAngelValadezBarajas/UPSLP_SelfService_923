/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: Attendance.tsx
 * Type: Container component */

// #region Imports
import moment from 'moment';
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableEditableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import EmailModal from '../../Generic/EmailModal';

// Types
import { EmailProviderOption } from '../../../Types/Enum/EmailProviderOption';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IAttendance } from '../../../Types/Section/IAttendance';
import { IAttendanceResources } from '../../../Types/Resources/Classes/IAttendanceResources';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IEmailSettings } from '../../../Types/InstitutionSettings/IEmailSettings';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Classes/Attendance';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import Store from '../../../Stores/CourseManagementStore';

// #endregion Imports

// #region Types
export interface IAttendanceProps {
    cultures: ICultures;
    myPosition: number;
    sectionId: number;
    onDownloadModal: () => void;
}

interface IAttendanceRes extends IAttendanceResources {
}

interface IAttendanceState {
    attendanceList?: IAttendance;
    checkboxHeader: boolean;
    componentError: boolean;
    date: string;
    isIndeterminate: boolean;
    isLoading: boolean;
    isStudentSelected: boolean;
    showDailyAttendance?: boolean;
    showOverallAttendance?: boolean;
    resources?: IAttendanceRes;

    // #region Date Modal
    dateIndex?: number;
    dateModal: boolean;
    dateSelected?: string;
    // #endregion Date Modal

    // #region Email Modal
    openEmailModal: boolean;
    recipientsEmailAddresses: string[];
    // #endregion Email Modal
}

const styles = (theme: Theme) => createStyles({
    checkboxHeader: {
        [theme.breakpoints.down('sm')]: {
            marginLeft: `${Tokens.spacing35}!important`
        },
        marginLeft: `${Tokens.spacing40}!important`
    },
    containerDate: {
        paddingLeft: Tokens.spacing30
    },
    containerDateButton: {
        alignItems: 'center',
        display: 'flex',
        width: '100%'
    },
    containerDateMobile: {
        display: 'flex',
        flexDirection: 'column'
    },
    dropDownLimited: {
        width: '160px'
    },
    iconHeader: {
        display: 'inline',
        marginLeft: Tokens.spacing30
    },
    inline: {
        display: 'inline'
    },
    margin: {
        marginLeft: Tokens.sizingXLarge
    },
    marginLeft: {
        marginLeft: Tokens.sizingXSmall
    },
    marginRight: {
        marginRight: Tokens.sizingXxLarge
    },
    sizeDisplay: {
        marginTop: Tokens.spacing40,
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        },
        [theme.breakpoints.up('sm')]: {
            textAlign: 'right'
        }
    },
    table: {
        [theme.breakpoints.up('sm')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '30%'
            }
        }
    }
});

type PropsWithStyles = IAttendanceProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class Attendance extends React.Component<PropsWithStyles, IAttendanceState> {
    private dateFormat: string;
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IAttendanceState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.dateFormat = 'YYYY-MM-DD';
        this.idModule = 'Classes';
        this.idPage = 'Attendance';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IAttendanceState {
        let resources: IAttendanceRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = Store.getResources(this.props.myPosition);
        }
        return {
            checkboxHeader: false,
            componentError: false,
            date: moment().format(this.dateFormat),
            isIndeterminate: false,
            isLoading: true,
            isStudentSelected: false,
            resources: resources,

            // #region Date Modal
            dateModal: false,
            // #endregion Date Modal

            // #region Email Modal
            openEmailModal: false,
            recipientsEmailAddresses: []
            // #endregion Email Modal
        };
    }

    // #region Events
    private onChangeAttendanceOverall = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                attendanceList
            } = this.state;

            const data: string[] = id.split('_');
            const row: number = Number(data[1]);

            if (optionSelected && attendanceList) {
                attendanceList.studentList[row].overallAtendanceSelected = Number(optionSelected.value);
                attendanceList.studentList[row].sectionAttendanceId = Number(optionSelected.value);
                attendanceList.studentList[row].isModified = true;
                attendanceList.studentList[row].isModified = true;
                attendanceList.studentList[row].isInvalidDate = false;
                attendanceList.studentList[row].dateKey++;

                if (!attendanceList.studentList[row].lastAttendedDate
                    || attendanceList.studentList[row].lastAttendedDate.length === 0) {
                    attendanceList.studentList[row].lastAttendedDate = String(moment().format(this.dateFormat));
                }
                this.setState({
                    attendanceList: attendanceList
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeAttendanceOverall.name, e));
        }
    };

    private onChangeCheckHeaderOverallAttendance = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                attendanceList,
                isIndeterminate
            } = this.state;

            let chkboxHeader: boolean = event.target.checked;
            if (attendanceList) {
                if (isIndeterminate) {
                    chkboxHeader = false;
                }
                attendanceList.studentList.forEach(student => student.checkbox = chkboxHeader);
                this.setState({
                    attendanceList: attendanceList,
                    isIndeterminate: false,
                    checkboxHeader: chkboxHeader,
                    isStudentSelected: chkboxHeader
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckHeaderOverallAttendance.name, e));
        }
    };

    private onChangeCheckboxOverallAttendance = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                attendanceList
            } = this.state;

            let isIndeterminate: boolean = false;
            let checkboxHeader: boolean = true;
            if (attendanceList && attendanceList.studentList.length > 0) {
                const id: string[] = event.target.id.split('_');
                attendanceList.studentList[Number(id[2])].checkbox = !attendanceList.studentList[Number(id[2])].checkbox;
                if (attendanceList.studentList.findIndex(s => s.checkbox === false || s.checkbox === undefined) !== -1) {
                    checkboxHeader = false;
                }
                if (attendanceList.studentList.findIndex(s => s.checkbox === true) !== -1) {
                    isIndeterminate = true;
                }
                this.setState({
                    attendanceList: attendanceList,
                    checkboxHeader: checkboxHeader,
                    isIndeterminate: isIndeterminate,
                    isStudentSelected: attendanceList.studentList.find(students => students.checkbox) ? true : false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckboxOverallAttendance.name, e));
        }
    };

    private onChangeDateTime = (date: string, id: string, isValid: boolean): void => {
        try {
            const {
                attendanceList
            } = this.state;

            const data: string[] = id.split('_');
            const row: number = Number(data[1]);
            if (isValid) {
                if (attendanceList) {
                    attendanceList.studentList[row].lastAttendedDate = date;
                    attendanceList.studentList[row].isModified = true;
                    attendanceList.studentList[row].isInvalidDate = false;
                    this.setState({
                        attendanceList: attendanceList
                    });
                }
            }
            else {
                if (attendanceList) {
                    if (date !== '') {
                        attendanceList.studentList[row].isModified = true;
                        attendanceList.studentList[row].isInvalidDate = true;
                        this.setState({
                            attendanceList: attendanceList
                        });
                    }
                    else {
                        attendanceList.studentList[row].isModified = true;
                        attendanceList.studentList[row].isInvalidDate = false;
                        attendanceList.studentList[row].lastAttendedDate = date;
                        this.setState({
                            attendanceList: attendanceList
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDateTime.name, e));
        }
    };

    private onSaveAttendanceList = (): void => {
        try {
            const {
                attendanceList
            } = this.state;

            if (attendanceList && !attendanceList.studentList.find(x => x.isInvalidDate)) {
                this.isLoading();
                Requests.postSaveAttendance(attendanceList.studentList.filter(x => x.isModified), this.resolvePostAttendance);
            }
            else {
                this.hideLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveAttendanceList.name, e));
        }
    };

    // #region Date Modal
    private onChangeDate = (date: string, _id: string, _isValid: boolean): void => {
        try {
            this.setState({
                dateSelected: date
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDate.name, e));
        }
    };

    private onClearDate = (): void => {
        try {
            const {
                attendanceList,
                dateIndex
            } = this.state;

            if (attendanceList && dateIndex !== undefined) {
                attendanceList.studentList[dateIndex].lastAttendedDate = '';
                attendanceList.studentList[dateIndex].isModified = true;
                this.setState({
                    attendanceList: attendanceList,
                    dateIndex: undefined,
                    dateModal: false,
                    dateSelected: undefined
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearDate.name, e));
        }
    };

    private onCloseDate = (): void => {
        try {
            this.setState({
                dateIndex: undefined,
                dateModal: false,
                dateSelected: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDate.name, e));
        }
    };

    private onOkDate = (): void => {
        try {
            const {
                attendanceList,
                dateIndex,
                dateSelected
            } = this.state;

            if (attendanceList && dateIndex !== undefined) {
                attendanceList.studentList[dateIndex].lastAttendedDate = dateSelected ? dateSelected : '';
                attendanceList.studentList[dateIndex].isModified = true;
                this.setState({
                    attendanceList: attendanceList,
                    dateIndex: undefined,
                    dateModal: false,
                    dateSelected: undefined
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOkDate.name, e));
        }
    };

    private onOpenDate = (position: number): void => {
        try {
            const {
                attendanceList
            } = this.state;

            if (attendanceList) {
                this.setState({
                    dateIndex: position,
                    dateModal: true,
                    dateSelected: attendanceList.studentList[position].lastAttendedDate
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDate.name, e));
        }
    };
    // #endregion Date Modal

    // #region Email Modal
    private onOpenEmailModal = (emailAddresses: string[]): void => {
        try {
            const {
                attendanceList
            } = this.state;

            if (attendanceList) {
                const emailSettings: IEmailSettings = attendanceList.emailSettings;
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

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private isLoading = (): void => {
        this.setState({
            isLoading: true
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
    private resolveGetAttendance = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAttendance.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    const attendanceList: IAttendance = result.data;
                    attendanceList.studentList.forEach(student => {
                        student.dateKey = Math.floor(Math.random() * 100);
                    });
                    this.setState({
                        attendanceList: attendanceList,
                        showDailyAttendance: result.data.showDailyAttendance,
                        showOverallAttendance: result.data.showOverallAttendance
                    }, this.hideLoader);
                }
                else {
                    this.hideLoader();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAttendance.name, e));
        }
    };

    private resolvePostAttendance = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostAttendance.name, this.hideAllLoaders);

            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                this.hideLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostAttendance.name, e));
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
            Requests.getAttendance(sectionId, this.resolveGetAttendance);
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
            onDownloadModal
        } = this.props;

        const {
            attendanceList,
            checkboxHeader,
            componentError,
            isIndeterminate,
            isLoading,
            isStudentSelected,
            showDailyAttendance,
            showOverallAttendance,
            resources,

            // #region Date Modal
            dateModal,
            dateSelected,
            // #endregion Date Modal

            // #region Email Modal
            recipientsEmailAddresses,
            openEmailModal
            // #endregion Email Modal
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (
                <ContainerLoader id="ldrAttendance" height="md" />
            );
        }
        else if (!componentError && resources) {
            if (attendanceList && attendanceList.studentList.length > 0) {
                const years: number = 10;
                const dateMin: any = moment().add(-years, 'years');
                const dateMax: any = moment().add(years, 'years');
                const dateMinFormat: string = dateMin.format(cultures.shortDatePattern.toUpperCase());
                const dateMaxFormat: any = dateMax.format(cultures.shortDatePattern.toUpperCase());

                const emptyOption: IDropDownOption = {
                    description: resources.lblDropDownEmptyText,
                    value: ''
                };

                const onClickEmail = (): void => {
                    if (attendanceList.studentList) {
                        const emails: string[] = [];
                        attendanceList.studentList.forEach(status => {
                            if (status.checkbox && status.email) {
                                emails.push(status.email);
                            }
                        });

                        if (attendanceList.emailSettings.emailProvider === EmailProviderOption.External) {
                            window.open(Format.toString(attendanceList.emailSettings.staffUrl, [emails.join(attendanceList.emailSettings.staffSeparator)]),
                                attendanceList.emailSettings.staffUrl.toLowerCase() === 'mailto:{0}' ? '_self' : '_blank');
                        }
                        else {
                            this.onOpenEmailModal(emails);
                        }
                    }
                };

                const changeDateModal: JSX.Element = (
                    <Modal
                        header={resources.lblLastDateAttended}
                        id="changeDateModal"
                        footer={(
                            <ButtonGroup id="bgDateModal">
                                <Button
                                    color="secondary"
                                    id="btnClearDate"
                                    onClick={this.onClearDate}
                                >
                                    {resources.btnClear}
                                </Button>
                                <Button
                                    id="btnChangeDate"
                                    onClick={this.onOkDate}
                                >
                                    {resources.btnOk}
                                </Button>
                            </ButtonGroup>
                        )}
                        maxWidth="xs"
                        open={dateModal}
                        onClose={this.onCloseDate}
                    >
                        <Grid container justifyContent="center">
                            <Grid item>
                                <DatePicker
                                    culture={cultures.dateTimeCulture}
                                    format={cultures.shortDatePattern}
                                    id="dtpChangeDate"
                                    selectedDates={dateSelected ? [dateSelected] : undefined}
                                    value={dateSelected || ''}
                                    variant="standalone"
                                    yearsAfter={years}
                                    yearsBefore={years}
                                    onChange={this.onChangeDate}
                                />
                            </Grid>
                        </Grid>
                    </Modal>
                );

                let emailModal: JSX.Element | undefined;
                if (openEmailModal) {
                    emailModal = (
                        <EmailModal
                            emailSettings={attendanceList.emailSettings}
                            onClose={this.onCloseEmailModal}
                            recipientsEmailAddresses={recipientsEmailAddresses}
                        />
                    );
                }

                contentPage = (
                    <>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Hidden smDown>
                                <Grid item >
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
                                        onChange={this.onChangeCheckHeaderOverallAttendance}
                                    />
                                    <Tooltip
                                        id="tltEmailSelected"
                                        title={resources.lblEmailSelect}
                                        placement="top"
                                    >
                                        <div className={classes.inline}>
                                            <IconButton
                                                alt={resources.lblEmailSelect}
                                                classes={{ root: classes.iconHeader }}
                                                color="secondary"
                                                disabled={!isStudentSelected}
                                                onClick={onClickEmail}
                                                id="EmailSelectedBtn"
                                            >
                                                <Icon large name="email" />
                                            </IconButton>
                                        </div>
                                    </Tooltip>
                                </Grid>
                                <Grid item className={classes.marginRight}>
                                    <Grid container>
                                        <Grid item>
                                            <Button
                                                IconProps={{
                                                    name: 'download'
                                                }}
                                                id="download"
                                                align="left"
                                                textVariantStyling="inherit"
                                                variant="text"
                                                onClick={onDownloadModal}
                                            >
                                                {resources.lblDownload}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Hidden>
                            <Hidden mdUp>
                                <Grid item className={classes.marginLeft}>
                                    <Checkbox
                                        checked={isIndeterminate || checkboxHeader}
                                        classes={{
                                            focused: classes.checkboxHeader,
                                            root: classes.checkboxHeader
                                        }}
                                        indeterminate={isIndeterminate && !checkboxHeader}
                                        id="chkSelectAll"
                                        inputProps={{
                                            'aria-label': this.layoutResources?.lblSelectAll
                                        }}
                                        onChange={this.onChangeCheckHeaderOverallAttendance}
                                    />
                                    <Tooltip
                                        id="tltEmailSelected"
                                        title={resources.lblEmailSelect}
                                        placement="top"
                                    >
                                        <div className={classes.inline}>
                                            <IconButton
                                                alt={resources.lblEmailSelect}
                                                classes={{ root: classes.iconHeader }}
                                                color="secondary"
                                                disabled={!isStudentSelected}
                                                onClick={onClickEmail}
                                                id="btnEmailSelected"
                                            >
                                                <Icon large name="email" />
                                            </IconButton>
                                        </div>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        alt={resources.lblDownload}
                                        classes={{ root: classes.iconHeader }}
                                        color="secondary"
                                        id="DownloadBtn"
                                        onClick={onDownloadModal}
                                    >
                                        <Icon large name="download" />
                                    </IconButton>
                                </Grid>
                            </Hidden>
                        </Grid>
                        <br />
                        <Table
                            breakpoint="sm"
                            classes={{ root: classes.table }}
                            id="tblAttendanceList"
                            variant="expansionPanels"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th">
                                        {resources.lblName}
                                    </TableCell>
                                    {showOverallAttendance && (
                                        <>
                                            <TableCell component="th">
                                                {resources.lblOverallAttendance}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblLastDateAttended}
                                            </TableCell>
                                        </>
                                    )}
                                    {showDailyAttendance && (
                                        <>
                                            <TableCell component="th" align="right">
                                                {resources.lblAbsenceExcused}
                                            </TableCell>
                                            <TableCell component="th" align="right">
                                                {resources.lblAbsenceUnexcused}
                                            </TableCell>
                                            <TableCell component="th" align="right">
                                                {resources.lblTardinessExcused}
                                            </TableCell>
                                            <TableCell component="th" align="right">
                                                {resources.lblTardinessUnexcused}
                                            </TableCell>
                                        </>
                                    )}
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attendanceList.studentList.map((student, j) => {
                                    const openDateFunc = this.onOpenDate;
                                    const callbackOpenDate = function (): void { openDateFunc(j); };
                                    return (
                                        <TableExpandableRow key={`studentsList_${student.id}${j}`}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                <AvatarText
                                                    CheckboxProps={{
                                                        checked: Boolean(student.checkbox),
                                                        id: `chkName_${student.id}_${j}`,
                                                        inputProps: {
                                                            'aria-label': Format.toString(resources.formatSelectStudent, [student.fullName])
                                                        },
                                                        onChange: this.onChangeCheckboxOverallAttendance
                                                    }}
                                                    avatarInfo={student}
                                                    complement={student.withdrawn ? (
                                                        <StatusLabel
                                                            id={`stsLbl_${j}_${student.id}`}
                                                            text={resources.lblWithdrawn}
                                                            type="draft"
                                                        />
                                                    ) : undefined}
                                                />
                                            </TableCell>
                                            {showOverallAttendance && (
                                                <>
                                                    <TableEditableCell
                                                        columnName={resources.lblOverallAttendance}
                                                        editableComponent={
                                                            (
                                                                <Dropdown
                                                                    emptyOption={emptyOption}
                                                                    id={`ddlOverallAttendance_${j}_${student.id}`}
                                                                    label=""
                                                                    options={attendanceList.attendStatusCodes}
                                                                    size="small"
                                                                    value={student.overallAtendanceSelected > 0 ? student.overallAtendanceSelected :
                                                                        student.sectionAttendanceId > 0 ? student.sectionAttendanceId : ''}
                                                                    onChange={this.onChangeAttendanceOverall}
                                                                />
                                                            )}
                                                    />
                                                    <TableEditableCell
                                                        columnName={resources.lblLastDateAttended}
                                                        editableComponent={
                                                            (
                                                                <>
                                                                    <div className={classes.containerDateMobile}>
                                                                        <div className={classes.containerDateButton}>
                                                                            <IconButton
                                                                                title={resources.lblLastDateAttended}
                                                                                onClick={callbackOpenDate}
                                                                                id={'btnDate_{i}'}
                                                                            >
                                                                                <Icon name="calendar" />
                                                                            </IconButton>
                                                                            {student.lastAttendedDate ? (
                                                                                <span className={classes.containerDate}>
                                                                                    {moment(student.lastAttendedDate, this.dateFormat)
                                                                                        .format(cultures.shortDatePattern.toUpperCase())}
                                                                                </span>
                                                                            ) : undefined}
                                                                        </div>
                                                                        {student.isModified
                                                                            && student.isInvalidDate ? (
                                                                            <Text color="error">
                                                                                {Format.toString(resources.formatDateOutOfRange,
                                                                                    [dateMinFormat, dateMaxFormat])}
                                                                            </Text>
                                                                        ) : undefined}
                                                                    </div>
                                                                </>
                                                            )}
                                                        error={student.isModified
                                                            && student.isInvalidDate}
                                                    />
                                                </>
                                            )}
                                            {showDailyAttendance && (
                                                <>
                                                    <TableCell columnName={resources.lblAbsenceExcused} align="right">
                                                        <span>
                                                            {student.excusedAbsence}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell columnName={resources.lblAbsenceUnexcused} align="right">
                                                        <span>
                                                            {student.unexcusedAbsence}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell columnName={resources.lblTardinessExcused} align="right">
                                                        <span>
                                                            {student.excusedTardiness}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell columnName={resources.lblTardinessUnexcused} align="right">
                                                        <span>
                                                            {student.unexcusedTardiness}
                                                        </span>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableExpandableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        <br />
                        <Grid container justifyContent="space-between">
                            <Grid item xs>
                                <ButtonGroup id="btnGroupAttendanceList">
                                    <Button
                                        id="btnSaveStudent"
                                        onClick={this.onSaveAttendanceList}
                                    >
                                        {resources.btnSave}
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                        {changeDateModal}
                        {emailModal}
                    </>
                );
            }
            else {
                contentPage = (
                    <Illustration
                        color="secondary"
                        height="lg"
                        internalName="no-enrolled"
                        text={resources.lblNoAttendance}
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
export default withStyles(styles)(Attendance);