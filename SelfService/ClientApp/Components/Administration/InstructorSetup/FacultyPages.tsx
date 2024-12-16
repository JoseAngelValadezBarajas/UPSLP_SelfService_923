/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: FacultyPages.tsx
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
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IFacultyPages } from '../../../Types/InstitutionSettings/IFacultyPages';
import { IFacultyPagesResources } from '../../../Types/Resources/Administration/IFacultyPagesResources';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/FacultyPages';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IFacultyPagesProps {
    lblSuccessSave: string;
}

interface IFacultyPagesState {
    anchorEl: any;
    componentError: boolean;
    openInfo: boolean;
    facultyPages?: IFacultyPages;
    resources?: IFacultyPagesResources;
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
    },
    popperText: {
        maxWidth: '15rem'
    },
    errorText: {
        marginBottom: Tokens.spacing30,
        marginTop: Tokens.spacing30
    },
});
type PropsWithStyles = IFacultyPagesProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class FacultyPages extends React.Component<PropsWithStyles, IFacultyPagesState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IFacultyPagesState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'FacultyPages';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IFacultyPagesState {
        let resources: IFacultyPagesResources | undefined;
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
                facultyPages
            } = this.state;

            const checked: boolean = event.target.checked;

            if (facultyPages) {
                switch (event.target.id) {
                    case 'chkMidtermGrades':
                        facultyPages.midtermGrades = checked;
                        break;
                    case 'chkEnableProjectedGrade':
                        facultyPages.enableProjectedGrade = checked;
                        break;
                    case 'chkEnableActivityGradeComments':
                        facultyPages.enableActivityGradeComments = checked;
                        break;
                    case 'chkInstructorChangeOfWaitlist':
                        facultyPages.instructorChangeOfWaitlist = checked;
                        break;
                    case 'chkShowDailyAttendance':
                        facultyPages.showDailyAttendance = checked;
                        break;
                    case 'chkShowOverallAttendance':
                        facultyPages.showOverallAttendance = checked;
                        break;
                }
                this.setState({
                    facultyPages: facultyPages
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onSaveSettings = (): void => {
        try {
            const {
                facultyPages
            } = this.state;
            let isValid: boolean = true;
            if (facultyPages) {
                if (!facultyPages.showOverallAttendance && !facultyPages.showDailyAttendance) {
                    isValid = false
                }
                if (isValid) {
                    LayoutActions.showPageLoader();
                    Requests.postSaveSettings(facultyPages, this.resolvePostSaveSettings, this.logError);
                }
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
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
    private resolveGetSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSettings.name);

            if (result?.status) {
                const facultyPages: IFacultyPages = result.data;
                this.setState({
                    facultyPages: facultyPages
                }, () => LayoutActions.hidePageLoader());
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

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

    private resolvePostSaveSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveSettings.name);

            if (result?.status) {
                const {
                    lblSuccessSave
                } = this.props;

                LayoutActions.hidePageLoader();
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
            anchorEl,
            componentError,
            openInfo,
            facultyPages,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources && facultyPages) {
            contentPage = (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Grid container spacing={3}>
                                <Grid item xs>
                                    <Text size="h4">
                                        {resources.lblDescription}
                                    </Text>
                                    <br />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Text size="h3">
                                        {resources.lblCourseManagement}
                                    </Text>
                                    <Divider noMarginBottom />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        id="chkMidtermGrades"
                                        checked={facultyPages.midtermGrades}
                                        label={resources.lblMidtermGrades}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        id="chkEnableProjectedGrade"
                                        checked={facultyPages.enableProjectedGrade}
                                        label={resources.lblEnableProjectedGrade}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        id="chkEnableActivityGradeComments"
                                        checked={facultyPages.enableActivityGradeComments}
                                        label={resources.lblEnableActivityGradeComments}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        id="chkInstructorChangeOfWaitlist"
                                        checked={facultyPages.instructorChangeOfWaitlist}
                                        label={resources.lblInstructorChangeOfWaitlist}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <br />
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={10}>
                                    <Text size="h3" display="inline">
                                        {resources.lblAttendance}
                                    </Text>
                                    <div className={classes.iconInfo}>
                                        <Tooltip
                                            id="InfoIcon"
                                            placement="top"
                                            title={resources.btnMoreInformation}
                                        >
                                            <IconButton
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
                                            id="popAttendance"
                                            open={openInfo}
                                            placement="bottom-start"
                                            anchorEl={anchorEl}
                                            onClickAway={this.onClosePopper}
                                            text={resources.lblInformationAttendance}
                                            transition={false}
                                            TextTypographyProps={{ className: classes.popperText }}
                                        />
                                    </div>
                                    <Divider noMarginBottom />
                                </Grid>
                            </Grid>
                            {(!facultyPages.showOverallAttendance && !facultyPages.showDailyAttendance) && (<Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                        <Text className={classes.errorText} color="error">
                                            {resources.lblAttendanceError}
                                        </Text>
                                </Grid>
                            </Grid>
                            )}
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        id="chkShowOverallAttendance"
                                        checked={facultyPages.showOverallAttendance}
                                        label={resources.lblShowOverallAttendance}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Checkbox
                                        id="chkShowDailyAttendance"
                                        checked={facultyPages.showDailyAttendance}
                                        label={resources.lblShowDailyAttendance}
                                        onChange={this.onCheckboxChange}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <br />
                    <br />
                    <Grid container>
                        <Grid item xs>
                            <Button
                                id="btnSaveFacultyPages"
                                onClick={this.onSaveSettings}
                            >
                                {resources.btnSave}
                            </Button>
                        </Grid>
                    </Grid>
                </>
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
export default withStyles(styles)(FacultyPages);