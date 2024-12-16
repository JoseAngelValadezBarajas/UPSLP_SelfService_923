/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: GiftBatchDefaults.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IGiftBatchDefaultsResources } from '../../../Types/Resources/Administration/IGiftBatchDefaultsResources';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IDonationSettings } from '../../../Types/InstitutionSettings/IDonationSettings';
import { IDonationSettingsValidations } from '../../../Types/InstitutionSettings/IDonationSettingsValidations';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../../Requests/Administration/GiftBatchDefaults';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IGiftBatchDefaultsState {
    acknowledgePrints?: IDropDownOption[];
    acknowledgeResponsibles?: IDropDownOption[];
    acknowledgeTypes?: IDropDownOption[];
    allocations?: IDropDownOption[];
    appeals?: IDropDownOption[];
    campaigns?: IDropDownOption[];
    giftTypes?: IDropDownOption[];
    hasPaymentProviderUrl: boolean;
    isLoading: boolean;
    isLoadingOptions: boolean;
    isLoadingSave: boolean;
    methodHows?: IDropDownOption[];
    methodWhens?: IDropDownOption[];
    methodWhos?: IDropDownOption[];
    offices?: IDropDownOption[];
    operators?: IDropDownOption[];
    programs?: IDropDownOption[];
    projects?: IDropDownOption[];
    receiptPrints?: IDropDownOption[];
    resources?: IGiftBatchDefaultsResources;
    settings?: IDonationSettings;
    settingsValidations: IDonationSettingsValidations;
    solicitorMethods?: IDropDownOption[];
    solicitors?: IDropDownOption[];
    sources?: IDropDownOption[];
    tenders?: IDropDownOption[];
}
// #endregion Types

// #region Component
class GiftBatchDefaults extends React.Component<any, IGiftBatchDefaultsState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IGiftBatchDefaultsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'GiftBatchDefaults';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IGiftBatchDefaultsState {
        let resources: IGiftBatchDefaultsResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            hasPaymentProviderUrl: true,
            isLoading: true,
            isLoadingOptions: false,
            isLoadingSave: false,
            resources: resources,
            settingsValidations: {
                campaignModified: false,
                descriptionModified: false,
                officeModified: false,
                operatorModified: false,
                projectModified: false,
                receiptPrintModified: false,
                solicitorModified: false
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
                    case 'ddlOperator':
                        settings.operator = Number(optionSelected.value);
                        settingsValidations.operatorModified = true;
                        break;
                    case 'ddlOffice':
                        settings.office = Number(optionSelected.value);
                        settingsValidations.officeModified = true;
                        break;
                    case 'ddlSource':
                        settings.source = Number(optionSelected.value);
                        break;
                    case 'ddlTender':
                        settings.tender = Number(optionSelected.value);
                        break;
                    case 'ddlProject':
                        settings.project = Number(optionSelected.value);
                        settingsValidations.projectModified = true;
                        break;
                    case 'ddlAppeal':
                        settings.appeal = Number(optionSelected.value);
                        break;
                    case 'ddlCampaign':
                        settings.campaign = Number(optionSelected.value);
                        settingsValidations.campaignModified = true;
                        break;
                    case 'ddlAllocation':
                        settings.allocation = Number(optionSelected.value);
                        break;
                    case 'ddlGiftType':
                        settings.giftType = Number(optionSelected.value);
                        break;
                    case 'ddlProgram':
                        settings.program = Number(optionSelected.value);
                        break;
                    case 'ddlMethodHow':
                        settings.methodHow = Number(optionSelected.value);
                        break;
                    case 'ddlMethodWho':
                        settings.methodWho = Number(optionSelected.value);
                        break;
                    case 'ddlMethodWhen':
                        settings.methodWhen = Number(optionSelected.value);
                        break;
                    case 'ddlSolicitor':
                        settings.solicitor = Number(optionSelected.value);
                        settingsValidations.solicitorModified = true;
                        break;
                    case 'ddlSolicitorMethod':
                        settings.solicitorMethod = Number(optionSelected.value);
                        break;
                    case 'ddlReceiptPrint':
                        settings.receiptPrint = Number(optionSelected.value);
                        settingsValidations.receiptPrintModified = true;
                        break;
                    case 'ddlAcknowledgePrint':
                        settings.acknowledgePrint = Number(optionSelected.value);
                        break;
                    case 'ddlAcknowledgeType':
                        settings.acknowledgeType = Number(optionSelected.value);
                        break;
                    case 'ddlAcknowledgeResponsible':
                        settings.acknowledgeResponsible = Number(optionSelected.value);
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

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                settings,
                settingsValidations
            } = this.state;

            const id: string = event.target.id;
            const value: string = event.target.value;
            if (settings) {
                switch (id) {
                    case 'txtDescription':
                        settings.description = value
                        settingsValidations.descriptionModified = true;
                        break;
                }
                this.setState({
                    settings: settings,
                    settingsValidations: settingsValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onSaveSettings = (): void => {
        try {
            const {
                settings,
                settingsValidations
            } = this.state;

            if (settings) {
                settingsValidations.campaignModified = true;
                settingsValidations.descriptionModified = true;
                settingsValidations.officeModified = true;
                settingsValidations.operatorModified = true;
                settingsValidations.projectModified = true;
                settingsValidations.receiptPrintModified = true;
                settingsValidations.solicitorModified = true;

                this.setState({
                    settingsValidations: settingsValidations
                });

                if (Boolean(settings.campaign) && Boolean(settings.description)
                    && Boolean(settings.office) && Boolean(settings.operator)
                    && Boolean(settings.project) && Boolean(settings.receiptPrint)
                    && Boolean(settings.solicitor)) {
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
                    acknowledgePrints: result.data.acknowledgePrints,
                    acknowledgeResponsibles: result.data.acknowledgeResponsibles,
                    acknowledgeTypes: result.data.acknowledgeTypes,
                    allocations: result.data.allocations,
                    appeals: result.data.appeals,
                    campaigns: result.data.campaigns,
                    giftTypes: result.data.giftTypes,
                    methodHows: result.data.methodHows,
                    methodWhens: result.data.methodWhens,
                    methodWhos: result.data.methodWhos,
                    offices: result.data.offices,
                    operators: result.data.operators,
                    programs: result.data.programs,
                    projects: result.data.projects,
                    receiptPrints: result.data.receiptPrints,
                    solicitors: result.data.solicitors,
                    solicitorMethods: result.data.solicitorMethods,
                    sources: result.data.sources,
                    tenders: result.data.tenders
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
                    hasPaymentProviderUrl: result.data.hasPaymentProviderUrl,
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
            acknowledgePrints,
            acknowledgeResponsibles,
            acknowledgeTypes,
            allocations,
            appeals,
            campaigns,
            giftTypes,
            hasPaymentProviderUrl,
            isLoading,
            isLoadingOptions,
            isLoadingSave,
            methodHows,
            methodWhens,
            methodWhos,
            offices,
            operators,
            programs,
            projects,
            receiptPrints,
            resources,
            settings,
            settingsValidations,
            solicitorMethods,
            solicitors,
            sources,
            tenders
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (resources) {
            if (isLoading) {
                contentPage = (<ContainerLoader id="ldrGiftBatchDefaults" height="md" />);
            }
            else if (settings) {
                const emptyOption: IDropDownOption = {
                    description: this.layoutResources?.lblDropDownEmptyText ?? '',
                    value: 0
                };

                // #region Validations
                let errorCampaign: boolean = false;
                if (settingsValidations.campaignModified) {
                    errorCampaign = !Boolean(settings.campaign);
                }

                let errorDescription: boolean = false;
                if (settingsValidations.descriptionModified) {
                    errorDescription = !Boolean(settings.description);
                }

                let errorOffice: boolean = false;
                if (settingsValidations.officeModified) {
                    errorOffice = !Boolean(settings.office);
                }

                let errorOperator: boolean = false;
                if (settingsValidations.operatorModified) {
                    errorOperator = !Boolean(settings.operator);
                }

                let errorProject: boolean = false;
                if (settingsValidations.projectModified) {
                    errorProject = !Boolean(settings.project);
                }

                let errorReceiptPrint: boolean = false;
                if (settingsValidations.receiptPrintModified) {
                    errorReceiptPrint = !Boolean(settings.receiptPrint);
                }

                let errorSolicitor: boolean = false;
                if (settingsValidations.solicitorModified) {
                    errorSolicitor = !Boolean(settings.solicitor);
                }
                // #endregion Validations

                contentPage = (
                    <>
                        <Grid container>
                            <Grid item xs={12}>
                                <Alert
                                    id="msgPaymentUrlWarning"
                                    open={!hasPaymentProviderUrl}
                                    text={resources.lblPaymentUrlWarning}
                                    type={ResultType.warning}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs>
                                <Grid container>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            error={errorOperator}
                                            helperText={errorOperator ?
                                                resources.lblOperatorRequired
                                                : undefined}
                                            id="ddlOperator"
                                            label={resources.lblOperator}
                                            loading={isLoadingOptions}
                                            options={operators}
                                            required
                                            value={settings.operator}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            error={errorOffice}
                                            helperText={errorOffice ?
                                                resources.lblOfficeRequired
                                                : undefined}
                                            id="ddlOffice"
                                            label={resources.lblOffice}
                                            loading={isLoadingOptions}
                                            options={offices}
                                            required
                                            value={settings.office}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            disabled={isLoadingSave}
                                            error={errorDescription}
                                            helperText={errorDescription ?
                                                resources.lblDescriptionRequired
                                                : undefined}
                                            id="txtDescription"
                                            label={resources.lblDescription}
                                            maxCharacters={50}
                                            required
                                            value={settings.description || ''}
                                            onChange={this.onChangeTextField}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            id="ddlSource"
                                            label={resources.lblSource}
                                            loading={isLoadingOptions}
                                            options={sources}
                                            value={settings.source}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            id="ddlTender"
                                            label={resources.lblTender}
                                            loading={isLoadingOptions}
                                            options={tenders}
                                            value={settings.tender}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            error={errorProject}
                                            helperText={errorProject ?
                                                resources.lblProjectRequired
                                                : undefined}
                                            id="ddlProject"
                                            label={resources.lblProject}
                                            loading={isLoadingOptions}
                                            options={projects}
                                            required
                                            value={settings.project}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            id="ddlAppeal"
                                            label={resources.lblAppeal}
                                            loading={isLoadingOptions}
                                            options={appeals}
                                            value={settings.appeal}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            error={errorCampaign}
                                            helperText={errorCampaign ?
                                                resources.lblCampaignRequired
                                                : undefined}
                                            id="ddlCampaign"
                                            label={resources.lblCampaign}
                                            loading={isLoadingOptions}
                                            options={campaigns}
                                            required
                                            value={settings.campaign}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            id="ddlAllocation"
                                            label={resources.lblAllocation}
                                            loading={isLoadingOptions}
                                            options={allocations}
                                            value={settings.allocation}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            id="ddlGiftType"
                                            label={resources.lblGiftType}
                                            loading={isLoadingOptions}
                                            options={giftTypes}
                                            value={settings.giftType}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            id="ddlProgram"
                                            label={resources.lblProgram}
                                            loading={isLoadingOptions}
                                            options={programs}
                                            value={settings.program}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            id="ddlMethodHow"
                                            label={resources.lblMethodHow}
                                            loading={isLoadingOptions}
                                            options={methodHows}
                                            value={settings.methodHow}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            id="ddlMethodWho"
                                            label={resources.lblMethodWho}
                                            loading={isLoadingOptions}
                                            options={methodWhos}
                                            value={settings.methodWho}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            id="ddlMethodWhen"
                                            label={resources.lblMethodWhen}
                                            loading={isLoadingOptions}
                                            options={methodWhens}
                                            value={settings.methodWhen}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            error={errorSolicitor}
                                            helperText={errorSolicitor ?
                                                resources.lblSolicitorRequired
                                                : undefined}
                                            id="ddlSolicitor"
                                            label={resources.lblSolicitor}
                                            loading={isLoadingOptions}
                                            options={solicitors}
                                            required
                                            value={settings.solicitor}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            id="ddlSolicitorMethod"
                                            label={resources.lblSolicitorMethod}
                                            loading={isLoadingOptions}
                                            options={solicitorMethods}
                                            value={settings.solicitorMethod}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            error={errorReceiptPrint}
                                            helperText={errorReceiptPrint ?
                                                resources.lblReceiptPrintRequired
                                                : undefined}
                                            id="ddlReceiptPrint"
                                            label={resources.lblReceiptPrint}
                                            loading={isLoadingOptions}
                                            options={receiptPrints}
                                            required
                                            value={settings.receiptPrint}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            id="ddlAcknowledgePrint"
                                            label={resources.lblAcknowledgePrint}
                                            loading={isLoadingOptions}
                                            options={acknowledgePrints}
                                            value={settings.acknowledgePrint}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            id="ddlAcknowledgeType"
                                            label={resources.lblAcknowledgeType}
                                            loading={isLoadingOptions}
                                            options={acknowledgeTypes}
                                            value={settings.acknowledgeType}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            emptyOption={emptyOption}
                                            id="ddlAcknowledgeResponsible"
                                            label={resources.lblAcknowledgeResponsible}
                                            loading={isLoadingOptions}
                                            options={acknowledgeResponsibles}
                                            value={settings.acknowledgeResponsible}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs>
                                <Button
                                    id="btnSaveDonationSettings"
                                    loading={isLoadingSave}
                                    onClick={this.onSaveSettings}
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
export default GiftBatchDefaults;