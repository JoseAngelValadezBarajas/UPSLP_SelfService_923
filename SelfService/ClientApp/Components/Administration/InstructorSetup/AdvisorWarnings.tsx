/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: AdvisorWarnings.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IAdvisorWarnings } from '../../../Types/InstitutionSettings/IAdvisorWarnings';
import { IAdvisorWarningsSave } from '../../../Types/InstitutionSettings/IAdvisorWarningsSave';
import { IAdvisorWarningsResources } from '../../../Types/Resources/Administration/IAdvisorWarningsResources';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/AdvisorWarnings';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IAdvisorWarningsProps {
    lblSuccessSave: string;
}

interface IAdvisorWarningsState {
    advisorWarnings?: IAdvisorWarnings;
    componentError: boolean;

    resources?: IAdvisorWarningsResources;
}

const styles = ((theme: Theme) => createStyles({
    marginTop: {
        [theme.breakpoints.down('md')]: {
            marginTop: `-${Tokens.spacing30}`
        }
    },
    tableAlerts: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '20%'
            }
        }
    },
    tableHeader: {
        verticalAlign: 'middle'
    }
}));
type PropsWithStyles = IAdvisorWarningsProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class AdvisorWarnings extends React.Component<PropsWithStyles, IAdvisorWarningsState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IAdvisorWarningsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'AdvisorWarnings';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IAdvisorWarningsState {
        let resources: IAdvisorWarningsResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            advisorWarnings: undefined,
            componentError: false,

            resources: resources
        };
    }

    // #region Events
    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                advisorWarnings
            } = this.state;

            const id: string = event.target.id;
            const value: number = Number(event.target.value);
            if (advisorWarnings) {
                switch (id) {
                    case 'txtExcusedAbsence':
                        advisorWarnings.excusedAbsences = value;
                        break;
                    case 'txtExcusedTardiness':
                        advisorWarnings.excusedTardiness = value;
                        break;
                    case 'txtUnexcusedAbsence':
                        advisorWarnings.unexcusedAbsences = value;
                        break;
                    case 'txtUnexcusedTardiness':
                        advisorWarnings.unexcusedTardiness = value;
                        break;
                }
                this.setState({
                    advisorWarnings: advisorWarnings
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onEnableCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                advisorWarnings
            } = this.state;

            const checked: boolean = event.target.checked;
            if (advisorWarnings) {
                switch (event.target.id) {
                    case 'chkEnableAttendance':
                        advisorWarnings.showAttendance = checked;
                        break;
                    case 'chkEnableAlerts':
                        advisorWarnings.showViolations = checked;
                        break;
                    case 'chkEnableGrades':
                        advisorWarnings.showGrades = checked;
                        break;
                }
                this.setState({
                    advisorWarnings: advisorWarnings
                });
            }

        } catch (e) {
            this.logError(LogData.fromException(this.onEnableCheckboxChange.name, e));
        }
    };

    private onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                advisorWarnings
            } = this.state;

            const ids: string[] = event.target.id.split('_');
            const checked: boolean = event.target.checked;
            if (advisorWarnings) {
                switch (ids[1]) {
                    case 'alert':
                        if (advisorWarnings.violations
                            && advisorWarnings.violations.length > 0) {
                            advisorWarnings.violations[Number(ids[2])].isInclude = checked;
                        }
                        break;
                    case 'grade':
                        if (advisorWarnings.creditTypes
                            && advisorWarnings.creditTypes.length > 0
                            && advisorWarnings.creditTypes[Number(ids[2])].grades
                            && advisorWarnings.creditTypes[Number(ids[2])].grades.length > 0
                            && ids.length > 3) {
                            advisorWarnings.creditTypes[Number(ids[2])].grades[Number(ids[3])].complement = checked;
                        }
                        break;
                }

                this.setState({
                    advisorWarnings: advisorWarnings
                });
            }

        } catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onSaveWarnings = (): void => {
        try {
            const {
                advisorWarnings
            } = this.state;

            if (advisorWarnings) {
                LayoutActions.setLoading(true);
                const advisorWarningsSave: IAdvisorWarningsSave = {
                    excusedAbsences: advisorWarnings.excusedAbsences,
                    excusedTardiness: advisorWarnings.excusedTardiness,
                    selectedGrades: [],
                    selectedViolations: [],
                    showAttendance: advisorWarnings.showAttendance,
                    showGrades: advisorWarnings.showGrades,
                    showViolations: advisorWarnings.showViolations,
                    unexcusedAbsences: advisorWarnings.unexcusedAbsences,
                    unexcusedTardiness: advisorWarnings.unexcusedTardiness
                };
                if (advisorWarnings.violations && advisorWarnings.violations.length > 0) {
                    advisorWarnings.violations.forEach(alert => {
                        if (alert.isInclude) {
                            advisorWarningsSave.selectedViolations.push(Number(alert.id));
                        }
                    });
                }
                if (advisorWarnings.creditTypes && advisorWarnings.creditTypes.length > 0) {
                    advisorWarnings.creditTypes.forEach(credit => {
                        if (credit.grades && credit.grades.length > 0) {
                            credit.grades.forEach(grade => {
                                if (Boolean(grade.complement)) {
                                    advisorWarningsSave.selectedGrades.push(Number(grade.value));
                                }
                            });
                        }
                    });
                }
                Requests.postSaveSettings(advisorWarningsSave, this.resolveOnSaveWarnings, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveWarnings.name, e));
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
                const advisorWarnings: IAdvisorWarnings = result.data;
                this.setState({
                    advisorWarnings: advisorWarnings
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

    private resolveOnSaveWarnings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveOnSaveWarnings.name);

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
            this.logError(LogData.fromException(this.resolveOnSaveWarnings.name, e));
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
            advisorWarnings,
            componentError,

            resources
        } = this.state;

        const {
            classes
        } = this.props;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            if (advisorWarnings) {
                contentPage = (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Text size="large">
                                            {resources.lblInstructions}
                                        </Text>
                                        <br />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Text size="h2">
                                            {resources.lblAttendanceSettings}
                                        </Text>
                                        <Divider noMarginBottom />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Checkbox
                                                    id="chkEnableAttendance"
                                                    checked={advisorWarnings.showAttendance}
                                                    label={resources.lblEnableAttendanceWarning}
                                                    onChange={this.onEnableCheckboxChange}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={4} md={3}>
                                                <TextField
                                                    disabled={!advisorWarnings.showAttendance}
                                                    id="txtExcusedAbsence"
                                                    label={resources.lblExcusedAbsences}
                                                    maxCharacters={3}
                                                    numeric
                                                    value={advisorWarnings.excusedAbsences ? advisorWarnings.excusedAbsences : ''}
                                                    onChange={this.onChangeTextField}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={3}>
                                                <TextField
                                                    disabled={!advisorWarnings.showAttendance}
                                                    id="txtExcusedTardiness"
                                                    label={resources.lblExcusedTardiness}
                                                    maxCharacters={3}
                                                    numeric
                                                    value={advisorWarnings.excusedTardiness ? advisorWarnings.excusedTardiness : ''}
                                                    onChange={this.onChangeTextField}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={4} md={3}>
                                                <TextField
                                                    disabled={!advisorWarnings.showAttendance}
                                                    id="txtUnexcusedAbsence"
                                                    label={resources.lblUnexcusedAbsences}
                                                    maxCharacters={3}
                                                    numeric
                                                    value={advisorWarnings.unexcusedAbsences ? advisorWarnings.unexcusedAbsences : ''}
                                                    onChange={this.onChangeTextField}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={3}>
                                                <TextField
                                                    disabled={!advisorWarnings.showAttendance}
                                                    id="txtUnexcusedTardiness"
                                                    label={resources.lblUnexcusedTardiness}
                                                    maxCharacters={3}
                                                    numeric
                                                    value={advisorWarnings.unexcusedTardiness ? advisorWarnings.unexcusedTardiness : ''}
                                                    onChange={this.onChangeTextField}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Text size="h2">
                                            {resources.lblAlertSettings}
                                        </Text>
                                        <Divider noMarginBottom />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Checkbox
                                            id="chkEnableAlerts"
                                            checked={advisorWarnings.showViolations}
                                            label={resources.lblEnableAlertWarning}
                                            onChange={this.onEnableCheckboxChange}
                                        />
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Table
                                                    breakpoint="sm"
                                                    classes={{ root: classes.tableAlerts }}
                                                    id="tblAlertWarnings"
                                                >
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell component="th">
                                                                <span >
                                                                    {resources.lblAlerts}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell component="th">
                                                                <span>
                                                                    {resources.lblStatus}
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    {advisorWarnings.violations && advisorWarnings.violations.length > 0 ?
                                                        (
                                                            <TableBody>
                                                                {advisorWarnings.violations.map((row, i) => (
                                                                    <TableRow key={`alert_${i}`}>
                                                                        <TableCell columnName={resources.lblAlerts}>
                                                                            <Checkbox
                                                                                checked={row.isInclude}
                                                                                disabled={!advisorWarnings.showViolations}
                                                                                id={`chk_alert_${i}`}
                                                                                label={row.description}
                                                                                onChange={this.onCheckboxChange}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell columnName={resources.lblStatus}>
                                                                            <StatusLabel
                                                                                id={`stslblAlert_${i}`}
                                                                                text={row.isActive ? resources.lblActive : resources.lblInactive}
                                                                                type={row.isActive ? 'success' : 'draft'}
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        ) : undefined}
                                                </Table>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Text size="h2">
                                            {resources.lblGradeSettings}
                                        </Text>
                                        <Divider noMarginBottom />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Checkbox
                                                    id="chkEnableGrades"
                                                    checked={advisorWarnings.showGrades}
                                                    label={resources.lblEnableGradeWarning}
                                                    onChange={this.onEnableCheckboxChange}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                {advisorWarnings.creditTypes && advisorWarnings.creditTypes.length > 0 ?
                                                    advisorWarnings.creditTypes.map((creditType, i) => (
                                                        <ExpansionPanel
                                                            key={`grade_${i}`}
                                                            header={(
                                                                <Grid
                                                                    container
                                                                    spacing={3}
                                                                    justifyContent="space-between"
                                                                    alignItems="center"
                                                                >
                                                                    <Grid item>
                                                                        <Text
                                                                            display="inline"
                                                                            verticalAlign="middle"
                                                                        >
                                                                            {creditType.description}
                                                                        </Text>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <StatusLabel
                                                                            id={`stslblGrade_${i}`}
                                                                            text={Boolean(creditType.complement) ?
                                                                                resources.lblActive : resources.lblInactive}
                                                                            type={Boolean(creditType.complement) ?
                                                                                'success' : 'draft'}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            )}
                                                        >
                                                            {creditType.grades && creditType.grades.length > 0 ?
                                                                (creditType.grades.map((grade, j) => (
                                                                    <Grid
                                                                        container
                                                                        key={`chk_grade_${i}_${j}`}
                                                                        spacing={3}
                                                                    >
                                                                        <Grid item xs={12}>
                                                                            <Checkbox
                                                                                checked={Boolean(grade.complement)}
                                                                                disabled={!advisorWarnings.showGrades}
                                                                                id={`chk_grade_${i}_${j}`}
                                                                                label={grade.description}
                                                                                onChange={this.onCheckboxChange}
                                                                            />
                                                                        </Grid>
                                                                    </Grid>
                                                                ))) : undefined
                                                            }
                                                        </ExpansionPanel>
                                                    )) : undefined}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <br />
                        <br />
                        <Grid container>
                            <Grid item xs>
                                <Button
                                    id="btnSaveSettings"
                                    onClick={this.onSaveWarnings}
                                >
                                    {resources.btnSave}
                                </Button>
                            </Grid>
                        </Grid>
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
export default withStyles(styles)(AdvisorWarnings);