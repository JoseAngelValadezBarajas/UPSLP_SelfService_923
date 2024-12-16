/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: StudentRecords.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IStudentRecords } from '../../../Types/InstitutionSettings/IStudentRecords';
import { IStudentRecordsResources } from '../../../Types/Resources/Administration/IStudentRecordsResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/StudentRecords';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IStudentRecordsProps {
    lblSuccessSave: string;
}

interface IStudentRecordsState {
    anchorEl: any;
    componentError: boolean;
    openInfo: boolean;
    studentRecords?: IStudentRecords;
    resources?: IStudentRecordsResources;
}

const styles = createStyles({
    indentBlock: {
        paddingLeft: `${Tokens.spacing60}!important`
    },
    icon: {
        cursor: 'pointer'
    },
    iconInfo: {
        display: 'inline-flex',
        verticalAlign: 'middle'
    },
    popperText: {
        maxWidth: '15rem'
    }
});

type PropsWithStyles = IStudentRecordsProps & WithStyles<typeof styles>;

// #endregion Types

// #region Component
class StudentRecords extends React.Component<PropsWithStyles, IStudentRecordsState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IStudentRecordsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'StudentRecords';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IStudentRecordsState {
        let resources: IStudentRecordsResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            anchorEl: null,
            componentError: false,
            openInfo: false,
            resources: resources
        };
    }

    // #region Events
    private onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                studentRecords
            } = this.state;

            if (studentRecords) {
                switch (event.target.id) {
                    case 'chkDateOfBirth':
                        studentRecords.showDateOfBirth = !studentRecords.showDateOfBirth;
                        break;
                    case 'chkDateForTerms':
                        studentRecords.showDatesForTerms = !studentRecords.showDatesForTerms;
                        break;
                    case 'chkFiceCode':
                        studentRecords.showFiceCode = !studentRecords.showFiceCode;
                        break;
                    case 'chkGovermentID':
                        studentRecords.showGovernmentId = !studentRecords.showGovernmentId;
                        break;
                    case 'chkTotalsAtEnd':
                        studentRecords.showTotalsAtEnd = !studentRecords.showTotalsAtEnd;
                        break;
                    case 'chkCoursesInProgress':
                        studentRecords.showCoursesInProgress = !studentRecords.showCoursesInProgress;
                        break;
                    case 'chkClassRankSize':
                        studentRecords.showClassInformation = !studentRecords.showClassInformation;
                        break;
                    case 'chkAlternateGrade':
                        studentRecords.showAlternateGrade = !studentRecords.showAlternateGrade;
                        break;
                    case 'chkLegend':
                        studentRecords.showLegend = !studentRecords.showLegend;
                        break;
                    case 'chkDispMidGrades':
                        studentRecords.displayMidSessionGrades = !studentRecords.displayMidSessionGrades;
                        break;
                    case 'chkDispInstName':
                        studentRecords.displayInstitutionName = !studentRecords.displayInstitutionName;
                        if (!studentRecords.displayInstitutionName) {
                            studentRecords.displayInstitutionAddress = false;
                        }
                        break;
                    case 'chkDispInstAddress':
                        studentRecords.displayInstitutionAddress = !studentRecords.displayInstitutionAddress;
                        if (studentRecords.displayInstitutionAddress) {
                            studentRecords.displayInstitutionName = true;
                        }
                        break;
                    case 'chkAllowStudentsOnStopList':
                        studentRecords.allowStudentOnStopList = !studentRecords.allowStudentOnStopList;
                        break;
                    case 'chkDispSeqNumber':
                        studentRecords.showSequence = !studentRecords.showSequence;
                        break;
                    case 'chkShowPicture':
                        studentRecords.showStudentPicture = !studentRecords.showStudentPicture;
                        break;
                }
                this.setState({
                    studentRecords: studentRecords
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onChangeLegend = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                studentRecords
            } = this.state;

            if (studentRecords) {
                studentRecords.legend = event.target.value;
                this.setState({
                    studentRecords: studentRecords
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeLegend.name, e));
        }
    };

    private onSaveSettings = (): void => {
        try {
            const {
                studentRecords
            } = this.state;

            if (studentRecords && !studentRecords.errorMaximumNumberPlans) {
                Requests.postSaveSettings(studentRecords, this.resolvePostSaveSettings, this.logError);
                LayoutActions.setLoading(true);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
        }
    };

    private onChangeTextfield = (maximumNumberPlans: number | string) => {
        try {
            const {
                studentRecords
            } = this.state;
            if (studentRecords) {
                studentRecords.maximumNumberPlans = maximumNumberPlans;
                studentRecords.errorMaximumNumberPlans = false;
            }
            this.setState({
                studentRecords
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextfield.name, e));
        }
    };

    private onBlurTextfield = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const {
                studentRecords
            } = this.state;

            if (studentRecords) {
                if (event.target.value === '') {
                    studentRecords.errorMaximumNumberPlans = true;
                }
                else {
                    studentRecords.errorMaximumNumberPlans = false;
                }
            }
            this.setState({
                studentRecords
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlurTextfield.name, e));
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
    // #endregion Events

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name);

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

    private resolveGetSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSettings.name);

            if (result?.status) {
                const studentRecords: IStudentRecords = result.data;
                this.setState({
                    studentRecords: studentRecords
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

    private resolvePostSaveSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveSettings.name);

            if (result?.status) {
                const {
                    lblSuccessSave
                } = this.props;

                LayoutActions.setLoading(false);
                LayoutActions.setAlert({
                    message: lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveSettings.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getSettings(this.resolveGetSettings, this.logError);
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
            componentError,
            openInfo,
            anchorEl,
            studentRecords,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources && studentRecords) {
            contentPage = (
                <Grid container spacing={3}>
                    <Grid item xs>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Text size="large">
                                    {resources.lblDescription}
                                </Text>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Text size="h2">
                                    {resources.lblPictures}
                                </Text>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container className={classes.indentBlock} spacing={3}>
                            <Grid item xs={12}>
                                <Checkbox
                                    id="chkShowPicture"
                                    checked={studentRecords.showStudentPicture}
                                    label={resources.lblShowStudentPicture}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Text size="h2">
                                    {resources.lblTranscriptDispOptions}
                                </Text>
                                <Divider />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container className={classes.indentBlock} spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Checkbox
                                    id="chkDateOfBirth"
                                    checked={studentRecords.showDateOfBirth}
                                    label={resources.lblDateOfBirth}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Checkbox
                                    id="chkDateForTerms"
                                    checked={studentRecords.showDatesForTerms}
                                    label={resources.lblDateForTerms}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Checkbox
                                    id="chkFiceCode"
                                    checked={studentRecords.showFiceCode}
                                    label={resources.lblFiceCode}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Checkbox
                                    id="chkGovermentID"
                                    checked={studentRecords.showGovernmentId}
                                    label={resources.lblGovermentId}
                                    onChange={this.onCheckboxChange}

                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Checkbox
                                    id="chkTotalsAtEnd"
                                    checked={studentRecords.showTotalsAtEnd}
                                    label={resources.lblTotalsEnd}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Checkbox
                                    id="chkCoursesInProgress"
                                    checked={studentRecords.showCoursesInProgress}
                                    label={resources.lblCoursesInProgress}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Checkbox
                                    id="chkClassRankSize"
                                    checked={studentRecords.showClassInformation}
                                    label={resources.lblClassRankSize}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Checkbox
                                    id="chkLegend"
                                    checked={studentRecords.showLegend}
                                    label={resources.lblLegend}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Checkbox
                                    id="chkAllowStudentsOnStopList"
                                    checked={studentRecords.allowStudentOnStopList}
                                    label={resources.lblAllowStudentOnStopList}
                                    onChange={this.onCheckboxChange}
                                />
                                <Tooltip
                                    id="InfoIcon"
                                    placement="top"
                                    title={resources.btnMoreInfo}
                                >
                                    <IconButton
                                        aria-label={resources.lblInfoAllowStudentOnStopList}
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
                                    id="popAllowStudentsOnStopList"
                                    open={openInfo}
                                    placement="bottom-start"
                                    anchorEl={anchorEl}
                                    onClickAway={this.onClosePopper}
                                    text={resources.lblInfoAllowStudentOnStopList}
                                    transition={false}
                                    TextTypographyProps={{ className: classes.popperText }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs>
                                <TextField
                                    id="txtLegendMessage"
                                    label={resources.lblLegendMessage}
                                    maxCharacters={4000}
                                    multiline
                                    minRows={4}
                                    value={studentRecords.legend ? studentRecords.legend : ''}
                                    onChange={this.onChangeLegend}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Text size="h2">
                                    {resources.lblGradeReport}
                                </Text>
                                <Divider />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3} className={classes.indentBlock}>
                            <Grid item xs={12} sm={6}>
                                <Checkbox
                                    id="chkDispMidGrades"
                                    checked={studentRecords.displayMidSessionGrades}
                                    label={resources.lblDispMidGrades}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Text size="h3">
                                    {resources.lblPrintingOptions}
                                </Text>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container className={classes.indentBlock} spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Checkbox
                                    id="chkDispInstName"
                                    checked={studentRecords.displayInstitutionName}
                                    label={resources.lblDispInstName}
                                    onChange={this.onCheckboxChange}
                                />
                                <Grid container className={classes.indentBlock} spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Checkbox
                                            checked={studentRecords.displayInstitutionAddress}
                                            disabled={!studentRecords.displayInstitutionName}
                                            id="chkDispInstAddress"
                                            label={resources.lblDispInstAddress}
                                            onChange={this.onCheckboxChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Text size="h2">
                                    {resources.lblAcademicPlan}
                                </Text>
                                <Divider />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container className={classes.indentBlock} >
                            <Grid item xs={12} sm={6}>
                                <Checkbox
                                    id="chkDispSeqNumber"
                                    checked={studentRecords.showSequence}
                                    label={resources.lblDispSeqNumber}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Text size="h2">
                                    {resources.lblWhatIf}
                                </Text>
                                <Divider />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container className={classes.indentBlock} >
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    error={studentRecords.errorMaximumNumberPlans}
                                    helperText={studentRecords.errorMaximumNumberPlans ?
                                        resources.lblErrorMaximumNumberPlans : undefined}
                                    id="txtMaximumNumberPlans"
                                    label={resources.lblMaximumNumberPlans}
                                    max={99}
                                    min={0}
                                    onBlur={this.onBlurTextfield}
                                    onChange={this.onChangeTextfield}
                                    precision={0}
                                    step={1}
                                    type="number"
                                    value={studentRecords.maximumNumberPlans}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Button
                                    id="btnSaveStudentRecords"
                                    onClick={this.onSaveSettings}
                                >
                                    {resources.lblSave}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            );
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
export default withStyles(styles)(StudentRecords);