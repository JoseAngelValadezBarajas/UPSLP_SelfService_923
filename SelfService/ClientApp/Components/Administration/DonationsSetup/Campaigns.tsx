/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Campaigns.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Internal components
import AddCampaign, { IAddCampaignResProps } from './AddCampaign';
import CampaignsTable, { ICampaignsTableResProps } from './CampaignsTable';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ICampaignsResources } from '../../../Types/Resources/Administration/ICampaignsResources';
import { IInstitutionSettingFilter, InstitutionSettingFilterType } from '../../../Types/InstitutionSettings/IInstitutionSettingFilter';
import { IInstitutionSettingFilterModel } from '../../../Types/InstitutionSettings/IInstitutionSettingFilterModel';
import { IConfirmationDialogResources } from '../../../Types/Resources/Generic/IConfirmationDialogResources';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../../Requests/Administration/Campaigns';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface ICampaignsProps {
}

interface ICampaignsRes extends ICampaignsResources {
    addCampaign: IAddCampaignResProps;
    campaignsTable: ICampaignsTableResProps;
    deleteCampaignConfirmation: IConfirmationDialogResources;
}

interface ICampaignsState {
    campaigns?: IInstitutionSettingFilter[];
    componentError: boolean;
    hasPaymentUrl?: boolean;
    isAddModal: boolean;
    isDeleteModal: boolean;
    isDuplicated: boolean;
    isInvalid: boolean;
    isLoading: boolean;
    isLoadingSave: boolean;
    pcCampaigns?: IDropDownOption[];
    resources?: ICampaignsRes;
    selectedCampaign: IDropDownOption;
}
// #endregion Types

// #region Component
class Campaigns extends React.Component<ICampaignsProps, ICampaignsState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<ICampaignsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'Campaigns';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): ICampaignsState {
        let resources: ICampaignsRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            isAddModal: false,
            isDeleteModal: false,
            isDuplicated: false,
            isInvalid: false,
            isLoading: true,
            isLoadingSave: false,
            resources: resources,
            selectedCampaign: { description: '', value: 0 }
        };
    }

    // #region Events
    private onAddCampaign = (): void => {
        try {
            this.setState({
                isAddModal: true
            });
        }
        catch (ex) {
            this.logError(LogData.fromException(this.onAddCampaign.name, ex));
        }
    };

    private onSaveAddCampaign = (): void => {
        try {
            const {
                campaigns,
                isDuplicated,
                isInvalid,
                selectedCampaign
            } = this.state;

            let newIsDuplicated: boolean = isDuplicated;
            if (campaigns) {
                newIsDuplicated = campaigns.some(campaign => Number(campaign.id) === Number(selectedCampaign.value));
            }

            if (!newIsDuplicated && !isInvalid && Number(selectedCampaign.value)) {
                this.showLoaderSave();
                const totalCampaigns: string[] = campaigns ? campaigns.map(c => c.id) : [];
                const institutionSettingFilter: IInstitutionSettingFilterModel = {
                    adds: [...totalCampaigns, String(selectedCampaign.value)],
                    filter: InstitutionSettingFilterType.Campaign
                };
                Requests.saveFilterSettings(institutionSettingFilter, this.resolveSaveFilterSettings, this.logError);
            }
            else {
                this.setState({
                    isDuplicated: newIsDuplicated
                });
            }
        }
        catch (ex) {
            this.logError(LogData.fromException(this.onSaveAddCampaign.name, ex));
        }
    };

    private onCloseAddModal = (): void => {
        try {
            this.setState({
                isAddModal: false,
                isDuplicated: false,
                isInvalid: false,
                selectedCampaign: { description: '', value: 0 }
            });
        }
        catch (ex) {
            this.logError(LogData.fromException(this.onCloseAddModal.name, ex));
        }
    };

    private onDropdownChange = (optionSelected: IDropDownOption): void => {
        try {
            this.setState({
                isDuplicated: false,
                isInvalid: Number(optionSelected.value) === 0,
                selectedCampaign: optionSelected
            });
        }
        catch (ex) {
            this.logError(LogData.fromException(this.onDropdownChange.name, ex));
        }
    };

    private onOpenDeleteModal = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                campaigns
            } = this.state;

            if (campaigns && campaigns.length > 0) {
                const id: number = Number(event.currentTarget.dataset.id);
                this.setState({
                    isDeleteModal: true,
                    selectedCampaign: {
                        description: campaigns[id].description,
                        value: campaigns[id].id
                    }
                });
            }
        }
        catch (ex) {
            this.logError(LogData.fromException(this.onOpenDeleteModal.name, ex));
        }
    };

    private onDeleteCampaign = (): void => {
        try {
            const {
                selectedCampaign,
                campaigns
            } = this.state;
            this.setState({
                isDeleteModal: false
            }, () => {
                this.showMainLoader();
                const totalCampaigns: string[] = campaigns ? campaigns.filter(f =>
                    f.id !== String(selectedCampaign.value)).map(c => c.id) : [];
                const institutionSettingFilter: IInstitutionSettingFilterModel = {
                    adds: [...totalCampaigns],
                    filter: InstitutionSettingFilterType.Campaign
                };
                Requests.saveFilterSettings(institutionSettingFilter, this.resolveSaveFilterSettings, this.logError);
            });
        }
        catch (ex) {
            this.logError(LogData.fromException(this.onDeleteCampaign.name, ex));
        }
    };

    private onCloseDeleteModal = (): void => {
        try {
            this.setState({
                isDeleteModal: false,
                selectedCampaign: { description: '', value: 0 }
            });
        }
        catch (ex) {
            this.logError(LogData.fromException(this.onCloseDeleteModal.name, ex));
        }
    };
    // #endregion Events

    // #region Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoadingSave: false,
            isLoading: false
        });
    };

    private showLoaderSave = (): void => {
        this.setState({
            isLoadingSave: true
        });
    };

    private showMainLoader = (): void => {
        this.setState({
            isLoading: true
        });
    };
    // #endregion Functions

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
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => LayoutActions.setLoading(false));
                Requests.getCampaigns(this.resolveGetCampaigns, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetCampaigns = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCampaigns.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    campaigns: result.data.campaigns,
                    pcCampaigns: result.data.pcCampaigns,
                    hasPaymentUrl: result.data.hasPaymentUrl
                });
                this.hideAllLoaders();
            }
        }
        catch (ex) {
            this.logError(LogData.fromException(this.resolveGetCampaigns.name, ex));
        }
    };

    private resolveSaveFilterSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveFilterSettings.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    campaigns,
                    isLoading,
                    selectedCampaign
                } = this.state;
                let newCampaigns: IInstitutionSettingFilter[] = [];
                if (Number(selectedCampaign.value) > 0) {
                    if (campaigns) {
                        if (isLoading) { // Is Delete campaign
                            newCampaigns = campaigns.filter(f =>
                                f.id !== String(selectedCampaign.value));
                        }
                        else { // Is Add campaign
                            newCampaigns = [...campaigns, {
                                description: selectedCampaign.description,
                                id: String(selectedCampaign.value),
                                isActive: true,
                                isInclude: true
                            }].sort((a, b) => {
                                if (a.description < b.description) {
                                    return -1;
                                }
                                if (a.description > b.description) {
                                    return 1;
                                }
                                return 0;
                            });
                        }
                    }
                    else if (!isLoading) {
                        newCampaigns.push({
                            description: selectedCampaign.description,
                            id: String(selectedCampaign.value),
                            isActive: true,
                            isInclude: true
                        });
                    }
                    this.setState({
                        isAddModal: false,
                        campaigns: newCampaigns,
                        selectedCampaign: { description: '', value: 0 }
                    }, () => {
                        if (this.layoutResources) {
                            LayoutActions.setAlert({
                                message: this.layoutResources.lblSuccessSave,
                                messageType: ResultType.success,
                                snackbar: true
                            });
                        }
                        this.hideAllLoaders();
                    });
                }
            }
        }
        catch (ex) {
            this.logError(LogData.fromException(this.resolveSaveFilterSettings.name, ex));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
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
            campaigns,
            componentError,
            hasPaymentUrl,
            isAddModal,
            isDeleteModal,
            isDuplicated,
            isInvalid,
            isLoading,
            isLoadingSave,
            pcCampaigns,
            resources,
            selectedCampaign
        } = this.state;

        const emptyOption: IDropDownOption = {
            description: this.layoutResources ? this.layoutResources.lblDropDownEmptyText : '',
            value: 0
        };

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            if (isLoading) {
                contentPage = (
                    <ContainerLoader id="ldrCampaigns" height="md" />
                );
            }
            else {
                contentPage = (
                    <>
                        <Grid container>
                            {!hasPaymentUrl && (
                                <Grid item xs={12}>
                                    <Alert
                                        id="msgNoUrlCampaigns"
                                        open={true}
                                        text={resources.lblWarningUrl}
                                        type={ResultType.warning}
                                        userDismissable={false}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Text size="h4">
                                    {resources.lblInstructions}
                                </Text>
                                {pcCampaigns && pcCampaigns.length > 0 ? (
                                    <CampaignsTable
                                        pcCampaigns={pcCampaigns}
                                        campaigns={campaigns}
                                        resources={resources.campaignsTable}
                                        onAdd={this.onAddCampaign}
                                        onDelete={this.onOpenDeleteModal}
                                    />
                                ) : (
                                        <Illustration
                                            color="secondary"
                                            name="under-maintenance"
                                            text={resources.lblEmptyState}
                                        />
                                    )}
                            </Grid>
                        </Grid>
                        {isAddModal && pcCampaigns && (
                            <AddCampaign
                                emptyOption={emptyOption}
                                isDuplicated={isDuplicated}
                                isInvalid={isInvalid}
                                isLoading={isLoadingSave}
                                open={isAddModal}
                                pcCampaigns={pcCampaigns}
                                resources={resources.addCampaign}
                                selectedCampaign={Number(selectedCampaign.value)}
                                onClose={this.onCloseAddModal}
                                onDropdownChange={this.onDropdownChange}
                                onSave={this.onSaveAddCampaign}
                            />
                        )}
                        {isDeleteModal && (
                            <ConfirmationDialog
                                contentText={Format.toString(resources.deleteCampaignConfirmation.formatContent, [
                                    selectedCampaign.description
                                ])}
                                open={isDeleteModal}
                                primaryActionOnClick={this.onCloseDeleteModal}
                                primaryActionText={resources.deleteCampaignConfirmation.btnDecline}
                                secondaryActionOnClick={this.onDeleteCampaign}
                                secondaryActionText={resources.deleteCampaignConfirmation.btnAccept}
                                title={resources.deleteCampaignConfirmation.lblTitle}
                            />
                        )}
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
export default Campaigns;