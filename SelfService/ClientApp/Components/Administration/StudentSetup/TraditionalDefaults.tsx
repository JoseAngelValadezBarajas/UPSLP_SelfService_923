/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: TraditionalDefaults.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ITraditionalDefaultsResources } from '../../../Types/Resources/Administration/ITraditionalDefaultsResources';
import { ITraditionalDefaults, RegistrationType } from '../../../Types/TraditionalDefaults/ITraditionalDefaults';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/TraditionalDefaults';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface ITraditionalDefaultsProps {
    lblSuccessSave: string;
}

interface ITraditionalDefaultsState {
    componentError: boolean;
    resources?: ITraditionalDefaultsResources;
    showErrorMsg: boolean;
    traditionalDefaults?: ITraditionalDefaults;
}
// #endregion Types

// #region Component
class TraditionalDefaults extends React.Component<ITraditionalDefaultsProps, ITraditionalDefaultsState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<ITraditionalDefaultsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'TraditionalDefaults';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): ITraditionalDefaultsState {
        let resources: ITraditionalDefaultsResources | undefined;
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
    private onChangeCreditLimits = (event: any): void => {
        try {
            const {
                traditionalDefaults
            } = this.state;

            if (traditionalDefaults && (event.target.value.match(/^[0123456789,.]*$/g) || event.target.value === '')) {
                traditionalDefaults.creditLimit = event.target.value;
                this.setState({
                    traditionalDefaults: traditionalDefaults
                });
            }
        }
        catch (ex) {
            this.logError(LogData.fromException(this.onChangeCreditLimits.name, ex));
        }
    };

    private onCheckboxChange = (event: any): void => {
        try {
            const {
                traditionalDefaults
            } = this.state;

            if (traditionalDefaults && event.target.id && event.target.id !== '') {
                traditionalDefaults.allowDefaultRegistration = event.target.checked;
                this.setState({
                    traditionalDefaults: traditionalDefaults
                });
            }
        }
        catch (ex) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, ex));
        }
    };

    private onDropdownChange = (option: IDropDownOption, id: string): void => {
        try {
            const {
                traditionalDefaults
            } = this.state;

            if (traditionalDefaults) {

                switch (id) {
                    case 'ddlDefaultClassLevel':
                        traditionalDefaults.classLevelId = option.value.toString();
                        break;

                    case 'ddlDefaultCollege':
                        traditionalDefaults.collegeId = option.value.toString();
                        break;

                    case 'ddlDefaultCurriculum':
                        traditionalDefaults.curriculumId = option.value.toString();
                        break;

                    case 'ddlDefaultDegree':
                        traditionalDefaults.degreeId = option.value.toString();
                        break;

                    case 'ddlDefaultDepartment':
                        traditionalDefaults.departmentId = option.value.toString();
                        break;

                    case 'ddlDefaultPopulation':
                        traditionalDefaults.populationId = option.value.toString();
                        break;

                    case 'ddlDefaultProgram':
                        traditionalDefaults.programId = option.value.toString();
                        break;
                }

                this.setState({
                    traditionalDefaults: traditionalDefaults
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
                traditionalDefaults
            } = this.state;

            if (traditionalDefaults
                && traditionalDefaults.programId
                && traditionalDefaults.degreeId
                && traditionalDefaults.curriculumId) {
                LayoutActions.setLoading(true);
                Requests.postSaveSettings(traditionalDefaults, this.resolvePostSaveSettings, this.logError);
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
                const resultTradDefSettings: ITraditionalDefaults = result.data;
                this.setState({
                    traditionalDefaults: resultTradDefSettings
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
            Requests.getSettings(RegistrationType.Traditional, this.resolveGetSettings, this.logError);
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
            traditionalDefaults
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources && traditionalDefaults) {
            let emptyOption: IDropDownOption;
            emptyOption = {
                description: resources.lblDropDownEmptyText,
                value: ''
            };

            const errorDefaultProgram: boolean = !traditionalDefaults.programId;
            const errorDefaultDegree: boolean = showErrorMsg && !traditionalDefaults.degreeId;
            const errorDefaultCurriculum: boolean = showErrorMsg && !traditionalDefaults.curriculumId;

            const programId = Number(traditionalDefaults.programId);
            const degreeId = Number(traditionalDefaults.degreeId);
            const curriculumId = Number(traditionalDefaults.curriculumId);

            const errorDefProgram: boolean = showErrorMsg && (errorDefaultProgram || programId === 0) || (errorDefaultProgram && programId === 0);
            const errorDefDegree: boolean = showErrorMsg && (errorDefaultDegree || degreeId === 0) || (errorDefaultDegree && degreeId === 0);
            const errorDefCurriculum: boolean = showErrorMsg && (errorDefaultCurriculum || curriculumId === 0)
                || (errorDefaultCurriculum && curriculumId === 0);

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
                            <Grid item xs={12}>
                                <Checkbox
                                    checked={traditionalDefaults.allowDefaultRegistration}
                                    id="chkTradDefault"
                                    label={resources.lblCheckBoxText}
                                    onChange={this.onCheckboxChange}
                                />
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
                                    options={traditionalDefaults.programViewModelList}
                                    required
                                    value={traditionalDefaults.programId ? traditionalDefaults.programId.toString() : ''}
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
                                    options={traditionalDefaults.degreeViewModelList}
                                    required
                                    value={traditionalDefaults.degreeId ? traditionalDefaults.degreeId.toString() : ''}
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
                                        options={traditionalDefaults.curriculumViewModelList}
                                        required
                                        value={traditionalDefaults.curriculumId ? traditionalDefaults.curriculumId.toString() : ''}
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
                                        options={traditionalDefaults.curriculumViewModelList}
                                        required
                                        value={traditionalDefaults.curriculumId ? traditionalDefaults.curriculumId.toString() : ''}
                                        onChange={this.onDropdownChange}
                                    />
                                </Grid>
                            </Hidden>
                            <Grid item xs={12} sm={6} md={3}>
                                <Dropdown
                                    id="ddlDefaultPopulation"
                                    emptyOption={emptyOption}
                                    label={resources.lblPopulation}
                                    options={traditionalDefaults.populationViewModelList}
                                    value={traditionalDefaults.populationId ? traditionalDefaults.populationId.toString() : ''}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Dropdown
                                    id="ddlDefaultClassLevel"
                                    emptyOption={emptyOption}
                                    label={resources.lblClassLevel}
                                    options={traditionalDefaults.classLevelViewModelList}
                                    value={traditionalDefaults.classLevelId ? traditionalDefaults.classLevelId.toString() : ''}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Dropdown
                                    id="ddlDefaultDepartment"
                                    emptyOption={emptyOption}
                                    label={resources.lblDepartment}
                                    options={traditionalDefaults.departmentViewModelList}
                                    value={traditionalDefaults.departmentId ? traditionalDefaults.departmentId.toString() : ''}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Dropdown
                                    id="ddlDefaultCollege"
                                    emptyOption={emptyOption}
                                    label={resources.lblCollege}
                                    options={traditionalDefaults.collegeViewModelList}
                                    value={traditionalDefaults.collegeId ? traditionalDefaults.collegeId.toString() : ''}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id="txtCreditLimit"
                                    label={resources.lblCreditLimits}
                                    type="text"
                                    value={traditionalDefaults.creditLimit}
                                    onChange={this.onChangeCreditLimits}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <ButtonGroup id="btnTraditionalDefaults">
                                    <Button
                                        id="btnSaveTraditionalDefaults"
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
export default TraditionalDefaults;