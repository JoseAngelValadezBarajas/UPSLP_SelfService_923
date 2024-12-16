/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Settings1098T.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';

// Internal components
import AgreementForm1098TEdit, { IAgreementForm1098TEditResProps } from './AgreementForm1098TEdit';
import TaxYearsettings, { ITaxYearSettingsResProps } from './TaxYearsettings';
import TaxYearSettingsEdit, { ITaxYearsettingsEditResProps } from './TaxYearsettingsEdit';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { AgreementStatus } from '../../../Types/Agreements/IAgreement';
import { IAgreementDetail } from '../../../Types/Agreements/IAgreementDetail';
import { IAgreementDetailValidations } from '../../../Types/Agreements/IAgreementDetailValidations';
import { IConfirmationDialogResources } from '../../../Types/Resources/Generic/IConfirmationDialogResources';
import { ITaxYearSetting } from '../../../Types/TaxYearSetting/ITaxYearSetting';
import { ITaxYearSettingDetail } from '../../../Types/TaxYearSetting/ITaxYearSettingDetail';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/Settings1098T';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface ISettings1098TProps {
    lblDropDownEmptyText: string;
    lblSuccessSave: string;
}

interface ISettings1098TRes {
    agreementForm1098TEdit: IAgreementForm1098TEditResProps;
    deleteTaxYearSettingConfirmation: IConfirmationDialogResources;
    taxYearSettings: ITaxYearSettingsResProps;
    taxYearsettingsEdit: ITaxYearsettingsEditResProps;
}

interface ISettings1098TState {
    agreementOriginal?: IAgreementDetail;
    agreementSelected?: IAgreementDetail;
    agreementValidations?: IAgreementDetailValidations;
    componentError: boolean;
    confirmationModal: boolean;
    idToDetele: number;
    isLoading: boolean;
    nameToDelete: string;
    pdfFiles?: IDropDownOption[];
    resources?: ISettings1098TRes;
    taxYears?: IDropDownOption[];
    taxYearSettingDetail?: ITaxYearSettingDetail;
    taxYearSettingEditModal: boolean;
    taxYearSettings?: ITaxYearSetting[];
    xmlFiles?: IDropDownOption[];
}
// #endregion Types

// #region Component
class Settings1098T extends React.Component<ISettings1098TProps, ISettings1098TState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<ISettings1098TState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'Settings1098T';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): ISettings1098TState {
        let isLoading: boolean = true;
        let resources: ISettings1098TRes | undefined;
        if (this.state) {
            isLoading = this.state.isLoading;
            resources = this.state.resources;
        }
        return {
            componentError: false,
            confirmationModal: false,
            idToDetele: 0,
            isLoading: isLoading,
            nameToDelete: '',
            resources: resources,
            taxYearSettingEditModal: false
        };
    }

    // #region Events

    // #region Agreement
    private onCancelAgreement = (): void => {
        try {
            const {
                agreementOriginal
            } = this.state;

            this.setState({
                agreementSelected: Object.assign({}, agreementOriginal),
                agreementValidations: this.getDefaultValidations()
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelAgreement.name, e));
        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                agreementSelected,
                agreementValidations
            } = this.state;

            const id: string = event.target.id;
            const value: string = event.target.value;
            if (agreementSelected && agreementValidations) {
                switch (id) {
                    case 'txtAcceptance':
                        if (value.length <= 255) {
                            agreementSelected.acceptance = value;
                        }
                        agreementValidations.acceptanceModified = true;
                        break;
                    case 'txtContent':
                        agreementSelected.content = value;
                        agreementValidations.contentModified = true;
                        break;
                    case 'txtTitle':
                        if (value.length <= 255) {
                            agreementSelected.title = value;
                        }
                        agreementValidations.titleModified = true;
                        break;
                }
                this.setState({
                    agreementSelected: agreementSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onChangeAgreementStatus = (): void => {
        try {
            const {
                agreementSelected
            } = this.state;

            if (agreementSelected && agreementSelected.id > 0) {
                const agreementStatus: AgreementStatus = agreementSelected.status === AgreementStatus.Inactive ?
                    AgreementStatus.Active
                    : AgreementStatus.Inactive;
                Requests.postPostStatusAgreementForm1098T(agreementSelected.id, agreementStatus, this.resolvePostStatusAgreement, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeAgreementStatus.name, e));
        }
    };

    private onSaveAgreement = (): void => {
        try {
            const {
                agreementSelected
            } = this.state;

            if (agreementSelected && this.validateSave()) {
                LayoutActions.setLoading(true);
                Requests.postSaveAgreementForm1098T(
                    agreementSelected,
                    agreementSelected.id > 0 ? agreementSelected.status : AgreementStatus.Inactive,
                    this.resolvePostSaveAgreement,
                    this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveAgreement.name, e));
        }
    };
    // #endregion Agreement

    // #region TaxYearSettings

    // #region New-Edit
    private onCancelTaxYearSetting = (): void => {
        try {
            this.setState({
                pdfFiles: undefined,
                taxYears: undefined,
                taxYearSettingDetail: undefined,
                taxYearSettingEditModal: false,
                xmlFiles: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelTaxYearSetting.name, e));
        }
    };

    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                taxYearSettingDetail
            } = this.state;

            const id: string = event.target.id;
            if (taxYearSettingDetail) {
                switch (id) {
                    case 'chkActive':
                        taxYearSettingDetail.isActive = !taxYearSettingDetail.isActive;
                        break;
                }
                this.setState({
                    taxYearSettingDetail: taxYearSettingDetail
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onChangeDropdown = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                taxYearSettingDetail
            } = this.state;

            if (taxYearSettingDetail) {
                switch (id) {
                    case 'ddlTaxYear':
                        taxYearSettingDetail.taxYear = String(optionSelected.value);
                        taxYearSettingDetail.taxYearModified = true;
                        Requests.postValidateTaxYear(taxYearSettingDetail.taxYear, this.resolvePostValidateTaxYear, this.logError);
                        break;
                    case 'ddlXmlFileName':
                        taxYearSettingDetail.xmlFileName = String(optionSelected.value);
                        taxYearSettingDetail.xmlFileNameModified = true;
                        break;
                    case 'ddlPdfFileName':
                        taxYearSettingDetail.pdfFileName = String(optionSelected.value);
                        taxYearSettingDetail.pdfFileNameModified = true;
                        break;
                }
                this.setState({
                    taxYearSettingDetail: taxYearSettingDetail
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropdown.name, e));
        }
    };

    private onSaveTaxYearSetting = (): void => {
        try {
            const {
                taxYearSettingDetail
            } = this.state;

            if (taxYearSettingDetail) {
                taxYearSettingDetail.pdfFileNameModified = true;
                taxYearSettingDetail.taxYearModified = true;
                taxYearSettingDetail.xmlFileNameModified = true;

                this.setState({
                    taxYearSettingDetail: taxYearSettingDetail
                });

                if (taxYearSettingDetail.taxYear
                    && !taxYearSettingDetail.taxYearDuplicated
                    && taxYearSettingDetail.xmlFileNameModified
                    && taxYearSettingDetail.pdfFileName) {
                    LayoutActions.setLoading(true);
                    Requests.postSaveTaxYearSetting(taxYearSettingDetail, this.resolvePostSaveTaxYearSetting, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveTaxYearSetting.name, e));
        }
    };
    // #endregion New-Edit

    private onAddTaxYearSetting = (): void => {
        try {
            LayoutActions.setLoading(true);
            Requests.getTaxYearSetting(0, this.resolveGetTaxYearSettingDetail, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddTaxYearSetting.name, e));
        }
    };

    private onClickTaxYearSetting = (event: React.MouseEvent<HTMLAnchorElement>): void => {
        try {
            LayoutActions.setLoading(true);
            const id: string[] = event.currentTarget.id.split('_');
            Requests.getTaxYearSetting(Number(id[1]), this.resolveGetTaxYearSettingDetail, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickTaxYearSetting.name, e));
        }
    };

    private onCloseDeleteConfirmModal = (): void => {
        try {
            this.setState({
                confirmationModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteConfirmModal.name, e));
        }
    };

    private onDeleteConfirm = (): void => {
        try {
            const {
                idToDetele
            } = this.state;

            Requests.postDeleteTaxYearSetting(idToDetele, this.resolvePostDeleteTaxYearSetting, this.logError);

            this.setState({
                confirmationModal: false,
                idToDetele: 0,
                nameToDelete: ''
            });
            LayoutActions.setLoading(true);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteConfirm.name, e));
        }
    };

    private onDeleteItem = (event: any): void => {
        try {
            const value: string[] = event.currentTarget.id.split('_');
            const id: number = Number(value[1]);
            const name: string = value[2];

            this.setState({
                confirmationModal: true,
                idToDetele: id,
                nameToDelete: name
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteItem.name, e));
        }
    };
    // #endregion TaxYearSettings

    // #endregion Events

    // #region Functions
    private getDefaultValidations(): IAgreementDetailValidations {
        return {
            acceptanceModified: false,
            contentModified: false,
            nameModified: false,
            titleModified: false,

            nameDuplicated: false
        } as IAgreementDetailValidations;
    }

    private validateSave = (): boolean => {
        const {
            agreementSelected,
            agreementValidations
        } = this.state;

        let result: boolean = false;
        if (agreementSelected && agreementValidations) {
            // Validate save
            agreementValidations.acceptanceModified = true;
            agreementValidations.contentModified = true;
            agreementValidations.titleModified = true;

            this.setState({
                agreementValidations: agreementValidations
            });

            if (Boolean(agreementSelected.acceptance)
                && Boolean(agreementSelected.content)
                && Boolean(agreementSelected.title)) {
                result = true;
            }
        }
        return result;
    };
    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
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

    private showError(message?: string): void {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetAgreement = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAgreement.name, this.hideAllLoaders);

            if (result?.status) {
                const agreementDetail: IAgreementDetail = result.data;
                this.setState({
                    agreementOriginal: Object.assign({}, agreementDetail),
                    agreementSelected: agreementDetail,
                    agreementValidations: this.getDefaultValidations()
                });

                Requests.getTaxYearSettings(this.resolveGetTaxYearSettings, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAgreement.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => {
                    Requests.getAgreementForm1098T(this.resolveGetAgreement, this.logError);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetTaxYearSettingDetail = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetTaxYearSettingDetail.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    pdfFiles: result.data.pdfFiles,
                    taxYears: result.data.taxYears,
                    taxYearSettingDetail: result.data.taxYearSettingDetail,
                    taxYearSettingEditModal: true,
                    xmlFiles: result.data.xmlFiles
                });
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetTaxYearSettingDetail.name, e));
        }
    };

    private resolveGetTaxYearSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetTaxYearSettings.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    isLoading: false,
                    taxYearSettings: result.data
                }, () => {
                    LayoutActions.setLoading(false);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetTaxYearSettings.name, e));
        }
    };

    private resolvePostDeleteTaxYearSetting = (json: string): void => {
        try {
            const {
                lblSuccessSave
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDeleteTaxYearSetting.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    LayoutActions.setAlert({
                        message: lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                    LayoutActions.setLoading(true);
                    Requests.getTaxYearSettings(this.resolveGetTaxYearSettings, this.logError);
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostDeleteTaxYearSetting.name, e));
        }
    };

    private resolvePostSaveAgreement = (json: string): void => {
        try {
            const {
                lblSuccessSave
            } = this.props;
            const {
                agreementSelected
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveAgreement.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data.result) {
                    if (agreementSelected) {
                        agreementSelected.id = result.data.id;
                    }
                    this.setState({
                        agreementOriginal: Object.assign({}, agreementSelected),
                        agreementValidations: this.getDefaultValidations()
                    }, () => {
                        LayoutActions.setAlert({
                            message: lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    });
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveAgreement.name, e));
        }
    };

    private resolvePostSaveTaxYearSetting = (json: string): void => {
        try {
            const {
                lblSuccessSave
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveTaxYearSetting.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    this.setState({
                        pdfFiles: undefined,
                        taxYears: undefined,
                        taxYearSettingDetail: undefined,
                        taxYearSettingEditModal: false,
                        xmlFiles: undefined
                    }, () => {
                        LayoutActions.setAlert({
                            message: lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                        LayoutActions.setLoading(true);
                        Requests.getTaxYearSettings(this.resolveGetTaxYearSettings, this.logError);
                    });
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveTaxYearSetting.name, e));
        }
    };

    private resolvePostStatusAgreement = (json: string): void => {
        try {
            const {
                agreementSelected
            } = this.state;
            const {
                lblSuccessSave
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostStatusAgreement.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    if (agreementSelected) {
                        const agreementStatus: AgreementStatus = agreementSelected.status === AgreementStatus.Inactive ?
                            AgreementStatus.Active
                            : AgreementStatus.Inactive;
                        agreementSelected.status = agreementStatus;
                        this.setState({
                            agreementOriginal: Object.assign({}, agreementSelected)
                        });
                    }
                    LayoutActions.setAlert({
                        message: lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostStatusAgreement.name, e));
        }
    };

    private resolvePostValidateTaxYear = (json: string): void => {
        try {
            const {
                taxYearSettingDetail
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostValidateTaxYear.name, this.hideAllLoaders);

            if (result?.status) {
                if (taxYearSettingDetail) {
                    taxYearSettingDetail.taxYearDuplicated = !result.data;
                }
                this.setState({
                    taxYearSettingDetail: taxYearSettingDetail
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostValidateTaxYear.name, e));
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
            lblDropDownEmptyText
        } = this.props;

        const {
            agreementSelected,
            agreementValidations,
            componentError,
            confirmationModal,
            isLoading,
            nameToDelete,
            pdfFiles,
            resources,
            taxYears,
            taxYearSettingDetail,
            taxYearSettingEditModal,
            taxYearSettings,
            xmlFiles
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            if (!isLoading) {
                contentPage = (
                    <>
                        {agreementSelected && agreementValidations && (
                            <AgreementForm1098TEdit
                                agreement={agreementSelected}
                                agreementValidations={agreementValidations}
                                resources={resources.agreementForm1098TEdit}
                                onCancel={this.onCancelAgreement}
                                onChangeStatus={this.onChangeAgreementStatus}
                                onChangeTextField={this.onChangeTextField}
                                onSave={this.onSaveAgreement}
                            />
                        )}
                        <TaxYearsettings
                            resources={resources.taxYearSettings}
                            taxYearSettings={taxYearSettings}
                            onAdd={this.onAddTaxYearSetting}
                            onDelete={this.onDeleteItem}
                            onEdit={this.onClickTaxYearSetting}
                        />
                        {taxYearSettingDetail && (
                            <TaxYearSettingsEdit
                                lblDropDownEmptyText={lblDropDownEmptyText}
                                open={taxYearSettingEditModal}
                                pdfFiles={pdfFiles}
                                resources={resources.taxYearsettingsEdit}
                                taxYears={taxYears}
                                taxYearSetting={taxYearSettingDetail}
                                xmlFiles={xmlFiles}
                                onCancel={this.onCancelTaxYearSetting}
                                onChangeCheckbox={this.onChangeCheckbox}
                                onChangeDropdown={this.onChangeDropdown}
                                onSave={this.onSaveTaxYearSetting}
                            />
                        )}
                        {confirmationModal && (
                            <ConfirmationDialog
                                contentText={Format.toString(resources.deleteTaxYearSettingConfirmation.formatContent, [nameToDelete])}
                                open={confirmationModal}
                                primaryActionOnClick={this.onCloseDeleteConfirmModal}
                                primaryActionText={resources.deleteTaxYearSettingConfirmation.btnDecline}
                                secondaryActionOnClick={this.onDeleteConfirm}
                                secondaryActionText={resources.deleteTaxYearSettingConfirmation.btnAccept}
                                title={resources.deleteTaxYearSettingConfirmation.lblTitle}
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
export default Settings1098T;