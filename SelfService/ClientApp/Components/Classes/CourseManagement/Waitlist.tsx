/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: Waitlist.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import Media from 'react-media';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
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
import EmailModal from '../../Generic/EmailModal';

// Types
import { EmailProviderOption } from '../../../Types/Enum/EmailProviderOption';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IEmailSettings } from '../../../Types/InstitutionSettings/IEmailSettings';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IStudentWaitlist } from '../../../Types/Classes/IStudentWaitlist';
import { IWaitlist } from '../../../Types/Classes/IWaitlist';
import { IWaitlistResources } from '../../../Types/Resources/Classes/IWaitlistResources';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Classes/Waitlist';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import Store from '../../../Stores/CourseManagementStore';

// #endregion Imports

// #region Types
export interface IWaitlistProps {
    myPosition: number;
    sectionId: number;
}

interface IWaitlistState {
    allSelected: boolean;
    componentError: boolean;
    isLoading: boolean;
    isLoadingSave: boolean;
    isStudentSelected: boolean;
    resources?: IWaitlistResources;
    selectStatus?: IDropDownOption[];
    waitListDetail?: IWaitlist;

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
    listTyle: {
        [theme.breakpoints.down('sm')]: {
            display: 'block!important'
        },
        listStyleType: 'none',
        margin: 0,
        padding: 0
    },
    marginLeft: {
        marginLeft: Tokens.borderWidthThickest
    },
    nameStyle: {
        marginBottom: Tokens.spacing40
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '20%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '30%'
            }
        }
    }
}));

type PropsWithStyles = IWaitlistProps & WithStyles<typeof styles>;
// #endregion

// #region Component
class Waitlist extends React.Component<PropsWithStyles, IWaitlistState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;
    private personIds: number[];

    public readonly state: Readonly<IWaitlistState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Classes';
        this.idPage = 'Waitlist';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.personIds = [];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IWaitlistState {
        let resources: IWaitlistResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = Store.getResources(this.props.myPosition);
        }
        return {
            allSelected: false,
            componentError: false,
            isLoading: true,
            isLoadingSave: false,
            isStudentSelected: false,
            resources: resources,

            // #region Email Modal
            openEmailModal: false,
            recipientsEmailAddresses: []
            // #endregion Email Modal
        };
    }

    // #region Events
    private onSelectAll = (): void => {
        try {
            const {
                allSelected,
                isStudentSelected,
                waitListDetail
            } = this.state;

            if (waitListDetail?.students) {
                let selectAll: boolean = false;
                if (allSelected || !isStudentSelected) {
                    selectAll = !allSelected;
                }
                waitListDetail.students.forEach(student => student.checked = selectAll);
                this.setState({
                    allSelected: selectAll,
                    isStudentSelected: selectAll,
                    waitListDetail: waitListDetail
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSelectAll.name, e));
        }
    };

    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                waitListDetail
            } = this.state;

            if (waitListDetail?.students) {
                const personId: number = Number(event.currentTarget.dataset.id);
                const student: IStudentWaitlist | undefined = waitListDetail.students.find(a => a.personId === personId);
                if (student) {
                    student.checked = !student.checked;
                    const isStudentSelected: boolean = waitListDetail.students.findIndex(student => student.checked) >= 0;
                    const oneNotSelected: boolean = waitListDetail.students.findIndex(student => !student.checked) >= 0;
                    this.setState({
                        allSelected: !oneNotSelected,
                        isStudentSelected: isStudentSelected,
                        waitListDetail: waitListDetail
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onChangeWaitingStatus = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                waitListDetail
            } = this.state;

            const data: string[] = id.split('_');
            const row: number = Number(data[1]);
            const personId: number = Number(data[2]);

            if (optionSelected && waitListDetail && waitListDetail.students) {
                waitListDetail.students[row].statusCode = optionSelected.value === 'P' ? optionSelected.value : 'W';

                this.personIds.push(personId);

                this.setState({
                    waitListDetail: waitListDetail
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeWaitingStatus.name, e));
        }
    };

    private onSaveWaitListStatus = (): void => {
        try {
            const {
                sectionId
            } = this.props;

            if (this.personIds.length > 0) {
                this.showLoaderSave();
                Requests.editStatusWaitlist(sectionId, this.personIds, this.resolveEditStatusWaitlist);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveWaitListStatus.name, e));
        }
    };

    // #region Email Modal
    private onOpenEmailModal = (emailAddresses: string[]): void => {
        try {
            const {
                waitListDetail
            } = this.state;

            if (waitListDetail) {
                const emailSettings: IEmailSettings = waitListDetail.emailSettings;
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
    private setSelects = (): void => {
        try {
            const {
                resources
            } = this.state;
            if (resources) {
                const selectStatus: IDropDownOption[] = [
                    { value: 'W', description: resources.lblWaiting },
                    { value: 'P', description: resources.lblPending }
                ];
                this.setState({
                    selectStatus: selectStatus
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setSelects.name, e));
        }
    };
    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingSave: false
        });
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private hideLoaderSave = (): void => {
        this.setState({
            isLoadingSave: false
        });
    };

    private showLoaderSave = (): void => {
        this.setState({
            isLoadingSave: true
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
    private resolveGetWaitlist = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetWaitlist.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    waitListDetail: result.data
                }, this.hideLoader);
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetWaitlist.name, e));
        }
    };

    private resolveEditStatusWaitlist = (json: string): void => {
        try {
            const {
                sectionId
            } = this.props;
            const {
                resources
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveEditStatusWaitlist.name, this.hideAllLoaders);

            if (result?.status && resources) {
                if (result.data.result) {
                    this.personIds.pop();
                    LayoutActions.setAlert({
                        message: resources.lblUpdateSuccessful,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                    this.hideLoaderSave();
                    LayoutActions.setLoading(true);
                    Requests.getWaitlist(sectionId, this.resolveGetWaitlist);
                }
                else {
                    LayoutActions.setAlert({
                        message: Format.toString(resources.lblNotEnoughSeats, [result.data.updateResult]),
                        messageType: ResultType.error,
                        snackbar: true
                    } as IAlert);
                    this.hideLoaderSave();
                    LayoutActions.setLoading(false);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveEditStatusWaitlist.name, e));
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
                }, this.setSelects);
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
            else {
                this.setSelects();
            }

            Requests.getWaitlist(sectionId, this.resolveGetWaitlist);
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
            classes
        } = this.props;

        const {
            allSelected,
            componentError,
            isLoading,
            isLoadingSave,
            isStudentSelected,
            resources,
            selectStatus,
            waitListDetail,

            // #region Email Modal
            recipientsEmailAddresses,
            openEmailModal
            // #endregion Email Modal
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let emailModal: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (
                <ContainerLoader id="ldrWaitlist" height="md" />
            );
        }
        else if (!componentError && resources) {
            if (waitListDetail?.students && waitListDetail.studentCount > 0) {
                const onClickEmail = (): void => {
                    const emails: string[] = [];
                    waitListDetail.students.forEach(status => {
                        if (status.checked && status.emailAddress) {
                            emails.push(status.emailAddress);
                        }
                    });
                    if (waitListDetail.emailSettings.emailProvider === EmailProviderOption.External) {
                        window.open(Format.toString(waitListDetail.emailSettings.staffUrl, [emails.join(waitListDetail.emailSettings.staffSeparator)]),
                            waitListDetail.emailSettings.staffUrl.toLowerCase() === 'mailto:{0}' ? '_self' : '_blank');
                    }
                    else {
                        this.onOpenEmailModal(emails);
                    }
                };

                contentPage = (
                    <>
                        <Hidden smDown>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item xs>
                                    <Checkbox
                                        checked={allSelected || isStudentSelected}
                                        classes={{
                                            focused: classes.checkboxHeader,
                                            root: classes.checkboxHeader
                                        }}
                                        id="chkSelectAll"
                                        indeterminate={!allSelected && isStudentSelected}
                                        inputProps={{
                                            'aria-label': this.layoutResources?.lblSelectAll
                                        }}
                                        onChange={this.onSelectAll}
                                    />
                                    <Tooltip
                                        id="tltEmailSelected"
                                        title={resources.lblEmailButton}
                                        placement="top"
                                    >
                                        <div className={classes.inline}>
                                            <IconButton
                                                alt={resources.lblEmailButton}
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
                            </Grid>
                        </Hidden>
                        <Hidden mdUp>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item xs className={classes.marginLeft}>
                                    <Checkbox
                                        checked={allSelected || isStudentSelected}
                                        classes={{
                                            focused: classes.checkboxHeader,
                                            root: classes.checkboxHeader
                                        }}
                                        id="chkSelectAll"
                                        indeterminate={!allSelected && isStudentSelected}
                                        inputProps={{
                                            'aria-label': this.layoutResources?.lblSelectAll
                                        }}
                                        onChange={this.onSelectAll}
                                    />
                                    <Tooltip
                                        id="tltEmailSelected"
                                        title={resources.lblEmailButton}
                                        placement="top"
                                    >
                                        <div className={classes.inline}>
                                            <IconButton
                                                alt={resources.lblEmailButton}
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
                            </Grid>
                        </Hidden>
                        <Table
                            breakpoint="sm"
                            classes={{ root: classes.table }}
                            id="tblWaitList"
                            variant="expansionPanels"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th">
                                        {resources.lblNameDetail}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblCurriculumDetail}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblClassLevelDetail}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblDateAddedDetail}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblCreditTypeDetail}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblCreditsDetail}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblRankDetail}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblAttemptsDetail}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblStatusDetail}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {waitListDetail.students.map((row, j) =>
                                (
                                    <TableExpandableRow key={`studentsList_${row.personId}_${j}`}>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                        >
                                            <AvatarText
                                                CheckboxProps={{
                                                    checked: Boolean(row.checked),
                                                    id: `chkStudentName_${j}`,
                                                    inputProps: {
                                                        'aria-label': Format.toString(resources.formatSelectStudent, [row.fullName]),
                                                        'data-id': row.personId
                                                    },
                                                    onChange: this.onChangeCheckbox
                                                }}
                                                avatarInfo={row}
                                                complement={row.withdrawn ? (
                                                    <StatusLabel
                                                        id={`stsLblStudentStatus_${j}`}
                                                        text={resources.lblWithdrawn}
                                                        type="draft"
                                                    />
                                                ) : undefined}
                                                id={`avtStudent_${j}`}
                                            />
                                        </TableCell>
                                        <TableCell
                                            columnName={resources.lblCurriculumDetail}
                                        >
                                            <ul className={classes.listTyle}>
                                                {row.studentAcademicRecords ? row.studentAcademicRecords.map((students, i) => (
                                                    <li
                                                        className={classes.nameStyle}
                                                        key={`description_${row.personId}_${i}`}
                                                    >
                                                        {students.pdcDescription}
                                                    </li>

                                                )) : undefined}
                                            </ul>
                                        </TableCell>
                                        <TableCell
                                            columnName={resources.lblClassLevelDetail}
                                        >
                                            <ul className={classes.listTyle}>
                                                {row.studentAcademicRecords ? row.studentAcademicRecords.map((students, i) => (
                                                    <li
                                                        className={classes.nameStyle}
                                                        key={`class_${row.personId}_${i}`}
                                                    >
                                                        {students.classLevel}
                                                    </li>

                                                )) : undefined}
                                            </ul>
                                        </TableCell>
                                        <TableCell
                                            columnName={resources.lblDateAddedDetail}
                                        >
                                            <span>
                                                {row.dateAdded}
                                            </span>
                                        </TableCell>
                                        <TableCell
                                            columnName={resources.lblCreditTypeDetail}
                                        >
                                            <span>
                                                {row.creditType}
                                            </span>
                                        </TableCell>
                                        <TableCell
                                            columnName={resources.lblCreditsDetail}
                                        >
                                            <span>
                                                {row.credits}
                                            </span>
                                        </TableCell>
                                        <TableCell
                                            columnName={resources.lblRankDetail}
                                        >
                                            <span>
                                                {row.rank}
                                            </span>
                                        </TableCell>
                                        <TableCell
                                            columnName={resources.lblAttemptsDetail}
                                        >
                                            <span>
                                                {row.attempts}
                                            </span>
                                        </TableCell>

                                        <TableEditableCell
                                            columnName={resources.lblStatusDetail}
                                            content={(
                                                <span>
                                                    {row.statusCode === 'P' ?
                                                        resources.lblPending : resources.lblWaiting}
                                                </span>
                                            )}
                                            edit={row.isEditable}
                                            editableComponent={(
                                                <Dropdown
                                                    id={`ddlStatusWaitList_${j}_${row.personId}`}
                                                    label=""
                                                    options={selectStatus}
                                                    size="small"
                                                    value={row.statusCode}
                                                    onChange={this.onChangeWaitingStatus}
                                                />
                                            )}
                                        />
                                    </TableExpandableRow>
                                )
                                )}
                            </TableBody>
                        </Table>
                        <br />
                        <Media query={Tokens.mqXSmall}>
                            {(matches: boolean): JSX.Element => matches ? (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Text display="inline">
                                            {Format.toString(resources.formatTotalStudents, [waitListDetail.studentCount])}
                                        </Text>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ButtonGroup id="btnEnrollmentActions">
                                            {waitListDetail.allowSave ?
                                                (
                                                    <Button
                                                        id="btnSaveEnrollment"
                                                        loading={isLoadingSave}
                                                        onClick={this.onSaveWaitListStatus}
                                                    >
                                                        {resources.lblSaveButton}
                                                    </Button>
                                                ) : undefined}
                                        </ButtonGroup>
                                    </Grid>
                                </Grid >
                            ) :
                                (
                                    <Grid container justifyContent="space-between">
                                        <Grid item>
                                            <ButtonGroup id="btnEnrollmentActions">
                                                {waitListDetail.allowSave ?
                                                    (
                                                        <Button
                                                            id="btnSaveEnrollment"
                                                            loading={isLoadingSave}
                                                            onClick={this.onSaveWaitListStatus}
                                                        >
                                                            {resources.lblSaveButton}
                                                        </Button>
                                                    ) : undefined}
                                            </ButtonGroup>
                                        </Grid>
                                        <Grid item>
                                            <Text align="right" display="inline">
                                                {Format.toString(resources.formatTotalStudents, [waitListDetail.studentCount])}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                )
                            }
                        </Media>
                    </>
                );

                if (openEmailModal) {
                    emailModal = (
                        <EmailModal
                            emailSettings={waitListDetail.emailSettings}
                            onClose={this.onCloseEmailModal}
                            recipientsEmailAddresses={recipientsEmailAddresses}
                        />
                    );
                }
            }
            else {
                contentPage = (
                    <Illustration
                        color="secondary"
                        height="lg"
                        internalName="no-enrolled"
                        text={resources.lblNoResults}
                    />
                );
            }
        }

        return (
            <>
                {contentPage}
                {emailModal}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(Waitlist);