/* Copyright 2019 - 2021  Ellucian Company L.P. and its affiliates.
 * File: ConEdDefaults.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IConEdDefaults, RegistrationType } from '../../../Types/ConEdDefaults/IConEdDefaults';
import { IConEdDefaultsResources } from '../../../Types/Resources/Administration/IConEdDefaultsResources';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/ConEdDefaults';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
// #endregion Imports

// #region Types
export interface IConEdDefaultsProps {
    lblSuccessSave: string;
}

interface IConEdDefaultsState {
    componentError: boolean;
    resources?: IConEdDefaultsResources;
    showErrorMsg: boolean;
    conEdDefaults?: IConEdDefaults;
}

const styles = createStyles({
    indentBlock: {
        paddingLeft: `${Tokens.spacing60}!important`
    },
    spaceBlocks: {
        paddingTop: Tokens.spacing40
    }
});

type PropsWithStyles = IConEdDefaultsProps & WithStyles<typeof styles>;

// #endregion Types

// #region Component
class ConEdDefaults extends React.Component<PropsWithStyles, IConEdDefaultsState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IConEdDefaultsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'ConEdDefaults';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IConEdDefaultsState {
        let resources: IConEdDefaultsResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            resources: resources,
            showErrorMsg: false
        };
    }

    // #region Events
    private onDropdownChange = (option: IDropDownOption, id: string): void => {
        try {
            const {
                conEdDefaults
            } = this.state;

            if (conEdDefaults) {

                switch (id) {
                    case 'ddlDefaultApplicationDecision':
                        conEdDefaults.applicationDecision = option.value.toString();
                        break;

                    case 'ddlDefaultApplicationStatus':
                        conEdDefaults.applicationStatus = option.value.toString();
                        break;

                    case 'ddlDefaultClassLevel':
                        conEdDefaults.classLevelId = option.value.toString();
                        break;

                    case 'ddlDefaultCollege':
                        conEdDefaults.collegeId = option.value.toString();
                        break;

                    case 'ddlDefaultCurriculum':
                        conEdDefaults.curriculumId = option.value.toString();
                        break;

                    case 'ddlDefaultDegree':
                        conEdDefaults.degreeId = option.value.toString();
                        break;

                    case 'ddlDefaultDepartment':
                        conEdDefaults.departmentId = option.value.toString();
                        break;

                    case 'ddlDefaultNonTradProgram':
                        conEdDefaults.nonTradProgramId = option.value.toString();
                        break;

                    case 'ddlDefaultPopulation':
                        conEdDefaults.populationId = option.value.toString();
                        break;

                    case 'ddlDefaultProgram':
                        conEdDefaults.programId = option.value.toString();
                        break;
                }

                this.setState({
                    conEdDefaults: conEdDefaults
                });
            }

        }
        catch (ex) {
            this.logError(LogData.fromException(this.onDropdownChange.name, ex));
        }
    };

    private onSaveSettings = (): void => {
        try {
            const {
                resources,
                conEdDefaults
            } = this.state;

            if (conEdDefaults
                && conEdDefaults.programId
                && conEdDefaults.degreeId
                && conEdDefaults.curriculumId
                && conEdDefaults.applicationDecision
                && conEdDefaults.applicationStatus) {
                LayoutActions.setLoading(true);
                Requests.postSaveSettings(conEdDefaults, this.resolvePostSaveSettings, this.logError);
            }
            else if (resources) {
                this.setState({
                    showErrorMsg: true
                });
            }
        }
        catch (ex) {
            this.logError(LogData.fromException(this.onSaveSettings.name, ex));
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
                const resultConEdDefSettings: IConEdDefaults = result.data;
                this.setState({
                    conEdDefaults: resultConEdDefSettings
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

    private resolvePostSaveSettings = (json: string): void => {
        try {
            const {
                lblSuccessSave
            } = this.props;

            const {
                resources
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveSettings.name);

            if (result?.status) {
                if (resources) {
                    LayoutActions.setAlert({
                        message: lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                LayoutActions.setLoading(false);
            }
        }
        catch (ex) {
            this.logError(LogData.fromException(this.resolvePostSaveSettings.name, ex));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getSettings(RegistrationType.ContinuingEducation, this.resolveGetSettings, this.logError);
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
            componentError,
            resources,
            showErrorMsg,
            conEdDefaults
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources && conEdDefaults) {
            const emptyOption: IDropDownOption = {
                description: resources.lblDropDownEmptyText,
                value: ''
            };

            const errorDefaultProgram: boolean = !conEdDefaults.programId;
            const errorDefaultDegree: boolean = showErrorMsg && !conEdDefaults.degreeId;
            const errorDefaultCurriculum: boolean = showErrorMsg && !conEdDefaults.curriculumId;
            const errorDefaultApplicationDecision: boolean = showErrorMsg && !conEdDefaults.applicationDecision;
            const errorDefaultApplicationStatus: boolean = showErrorMsg && !conEdDefaults.applicationStatus;

            const programId = Number(conEdDefaults.programId);
            const degreeId = Number(conEdDefaults.degreeId);
            const curriculumId = Number(conEdDefaults.curriculumId);
            const applicationDecision = Number(conEdDefaults.applicationDecision);
            const applicationStatus = Number(conEdDefaults.applicationStatus);

            const errorDefProgram: boolean = showErrorMsg && (errorDefaultProgram || programId === 0) || (errorDefaultProgram && programId === 0);
            const errorDefDegree: boolean = showErrorMsg && (errorDefaultDegree || degreeId === 0) || (errorDefaultDegree && degreeId === 0);
            const errorDefCurriculum: boolean = showErrorMsg && (errorDefaultCurriculum || curriculumId === 0)
                || (errorDefaultCurriculum && curriculumId === 0);
            const errorDefApplicationDecision: boolean = showErrorMsg && (errorDefaultApplicationDecision || applicationDecision === 0)
                || (errorDefaultApplicationDecision && applicationDecision === 0);
            const errorDefApplicationStatus: boolean = showErrorMsg && (errorDefaultApplicationStatus || applicationStatus === 0)
                || (errorDefaultApplicationStatus && applicationStatus === 0);

            contentPage = (
                <Grid container spacing={3}>
                    <br />
                    <Grid item xs>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Text size="h4">
                                    {resources.lblLegend}
                                </Text>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    error={errorDefProgram}
                                    helperText={errorDefProgram ? resources.lblProgramRequired : undefined}
                                    id="ddlDefaultProgram"
                                    label={resources.lblProgram}
                                    options={conEdDefaults.programViewModelList}
                                    required
                                    value={conEdDefaults.programId ? conEdDefaults.programId.toString() : ''}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    error={errorDefDegree}
                                    helperText={errorDefDegree ? resources.lblDegreeRequired : undefined}
                                    id="ddlDefaultDegree"
                                    label={resources.lblDegree}
                                    options={conEdDefaults.degreeViewModelList}
                                    required
                                    value={conEdDefaults.degreeId ? conEdDefaults.degreeId.toString() : ''}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                            <Hidden smDown>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        error={errorDefCurriculum}
                                        helperText={errorDefCurriculum ? resources.lblCurriculumRequired : undefined}
                                        id="ddlDefaultCurriculum"
                                        label={resources.lblCurriculum}
                                        options={conEdDefaults.curriculumViewModelList}
                                        required
                                        value={conEdDefaults.curriculumId ? conEdDefaults.curriculumId.toString() : ''}
                                        onChange={this.onDropdownChange}
                                    />
                                </Grid>
                            </Hidden>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Hidden mdUp>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        error={errorDefCurriculum}
                                        helperText={errorDefCurriculum ? resources.lblCurriculumRequired : undefined}
                                        id="ddlDefaultCurriculum"
                                        label={resources.lblCurriculum}
                                        options={conEdDefaults.curriculumViewModelList}
                                        required
                                        value={conEdDefaults.curriculumId ? conEdDefaults.curriculumId.toString() : ''}
                                        onChange={this.onDropdownChange}
                                    />
                                </Grid>
                            </Hidden>
                            <Grid item xs={12} sm={6} md={3}>
                                <Dropdown
                                    id="ddlDefaultPopulation"
                                    emptyOption={emptyOption}
                                    label={resources.lblPopulation}
                                    options={conEdDefaults.populationViewModelList}
                                    value={conEdDefaults.populationId ? conEdDefaults.populationId.toString() : ''}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Dropdown
                                    id="ddlDefaultNonTradProgram"
                                    emptyOption={emptyOption}
                                    label={resources.lblNonTradProgram}
                                    options={conEdDefaults.nonTradProgramViewModelList}
                                    value={conEdDefaults.nonTradProgramId ? conEdDefaults.nonTradProgramId.toString() : ''}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Dropdown
                                    id="ddlDefaultClassLevel"
                                    emptyOption={emptyOption}
                                    label={resources.lblClassLevel}
                                    options={conEdDefaults.classLevelViewModelList}
                                    value={conEdDefaults.classLevelId ? conEdDefaults.classLevelId.toString() : ''}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Dropdown
                                    id="ddlDefaultDepartment"
                                    emptyOption={emptyOption}
                                    label={resources.lblDepartment}
                                    options={conEdDefaults.departmentViewModelList}
                                    value={conEdDefaults.departmentId ? conEdDefaults.departmentId.toString() : ''}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Dropdown
                                    id="ddlDefaultCollege"
                                    emptyOption={emptyOption}
                                    label={resources.lblCollege}
                                    options={conEdDefaults.collegeViewModelList}
                                    value={conEdDefaults.collegeId ? conEdDefaults.collegeId.toString() : ''}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    error={errorDefApplicationStatus}
                                    helperText={errorDefApplicationStatus ? resources.lblApplicationStatusRequired : undefined}
                                    id="ddlDefaultApplicationStatus"
                                    label={resources.lblApplicationStatus}
                                    onChange={this.onDropdownChange}
                                    options={conEdDefaults.applicationStatusViewModelList}
                                    required
                                    value={conEdDefaults.applicationStatus ? conEdDefaults.applicationStatus.toString() : ''}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    error={errorDefApplicationDecision}
                                    helperText={errorDefApplicationDecision ? resources.lblApplicationDecisionRequired : undefined}
                                    id="ddlDefaultApplicationDecision"
                                    label={resources.lblApplicationDecision}
                                    onChange={this.onDropdownChange}
                                    options={conEdDefaults.applicationDecisionViewModelList}
                                    required
                                    value={conEdDefaults.applicationDecision ? conEdDefaults.applicationDecision.toString() : ''}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <ButtonGroup id="btnConEdDefaults">
                                    <Button
                                        id="btnSaveConEdDefaults"
                                        onClick={this.onSaveSettings}
                                    >
                                        {resources.lblSaveButton}
                                    </Button>
                                </ButtonGroup>
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
export default withStyles(styles)(ConEdDefaults);