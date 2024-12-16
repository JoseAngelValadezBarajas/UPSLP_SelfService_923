/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: Form.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IFormResources } from '../../../Types/Resources/Administration/IFormResources';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IFormSettings } from '../../../Types/InstitutionSettings/IFormSettings';
import { IFormSettingsValidations } from '../../../Types/InstitutionSettings/IFormSettingsValidations';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../../Requests/Administration/Form';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IFormState {
    emailTypes?: IDropDownOption[];
    isLoading: boolean;
    isLoadingOptions: boolean;
    isLoadingSave: boolean;
    resources?: IFormResources;
    settings?: IFormSettings;
    settingsValidations: IFormSettingsValidations;
}
// #endregion Types

// #region Component
class Form extends React.Component<any, IFormState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IFormState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'Form';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IFormState {
        let resources: IFormResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            isLoading: true,
            isLoadingOptions: false,
            isLoadingSave: false,
            resources: resources,
            settingsValidations: {
                emailTypeModified: false
            }
        };
    }

    // #region Events
    private onChangeDropdown = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                settings,
                settingsValidations
            } = this.state;

            if (settings) {
                switch (id) {
                    case 'ddlEmailType':
                        settings.emailType = Number(optionSelected.value);
                        settingsValidations.emailTypeModified = true;
                        break;
                }
                this.setState({
                    settings: settings
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropdown.name, e));
        }
    };

    private onSaveSettings = (): void => {
        try {
            const {
                settings,
                settingsValidations
            } = this.state;

            if (settings) {
                settingsValidations.emailTypeModified = true;
                this.setState({
                    settingsValidations: settingsValidations
                });

                if (Boolean(settings.emailType)) {
                    this.showLoaderSave();
                    Requests.saveSettings(settings, this.resolveSaveSettings);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
        }
    };
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingOptions: false,
            isLoadingSave: false
        });
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private hideLoaderOptions = (): void => {
        this.setState({
            isLoadingOptions: false
        });
    };

    private hideLoaderSave = (): void => {
        this.setState({
            isLoadingSave: false
        });
    };

    private showLoaderOptions = (): void => {
        this.setState({
            isLoadingOptions: true
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
        LayoutActions.setLogData(logData);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetResources.name,
                this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    resources: result.data
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetOptions.name,
                this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    emailTypes: result.data.emailTypes
                }, this.hideLoaderOptions);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetOptions.name, e));
        }
    };

    private resolveGetSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetSettings.name.toString(),
                this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    settings: result.data.settings
                }, this.hideLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

    private resolveSaveSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveSaveSettings.name,
                this.hideAllLoaders);
            if (result?.status) {
                if (this.layoutResources) {
                    LayoutActions.setAlert({
                        message: this.layoutResources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                this.hideLoaderSave();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveSettings.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage, this.resolveGetResources);
            Requests.getSettings(this.resolveGetSettings);
            this.showLoaderOptions();
            Requests.getOptions(this.resolveGetOptions);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            emailTypes,
            isLoading,
            isLoadingOptions,
            isLoadingSave,
            resources,
            settings,
            settingsValidations,
           
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (resources) {
            if (isLoading) {
                contentPage = (<ContainerLoader id="ldrForm" height="md" />);
            }
            else if (settings) {
                const emptyOption: IDropDownOption = {
                    description: this.layoutResources?.lblDropDownEmptyText ?? '',
                    value: 0
                };

                // #region Validations
                let errorEmailType: boolean = false;
                if (settingsValidations.emailTypeModified) {
                    errorEmailType = !Boolean(settings.emailType);
                }
                // #endregion Validations

                contentPage = (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Text size="h4">
                                            {resources.lblFormMessage}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Text size="h3">
                                            {resources.lblEmail}
                                        </Text>
                                        <Divider />
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid item xs>
                                    <Grid container>
                                        <Grid item xs={12} sm={6}>
                                            <Dropdown
                                                disabled={isLoadingSave}
                                                emptyOption={emptyOption}
                                                error={errorEmailType}
                                                helperText={errorEmailType ?
                                                    resources.lblEmailTypeRequired
                                                    : undefined}
                                                id="ddlEmailType"
                                                label={resources.lblEmailType}
                                                loading={isLoadingOptions}
                                                options={emailTypes}
                                                required
                                                value={settings.emailType}
                                                onChange={this.onChangeDropdown}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid item xs>
                                    <Button
                                        id="btnSaveFormSettings"
                                        loading={isLoadingSave}
                                        onClick={this.onSaveSettings}
                                    >
                                        {resources.btnSave}
                                    </Button>
                                </Grid>
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
export default Form;