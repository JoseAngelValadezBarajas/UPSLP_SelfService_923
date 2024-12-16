/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ApplicationFormView.tsx
 * Type: Container component */

// #region Imports
import moment from 'moment';
import React, { RefObject } from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';

// Internal Components
import PaymentDetailModal from '../../Generic/PaymentDetailModal';
import ProcessPaymentModal from '../../Generic/ProcessPaymentModal';
import SignIn from '../../Generic/SignIn';
import SignUp from '../../Generic/SignUp';
import AddressSearchModal from './AddressSearchModal';
import ApplicationHandler from './ApplicationHandler';
import Attachments from './Attachments';
import ConfirmationSavedModal from './ConfirmationSavedModal';
import ETSSearchModal from './ETSSearchModal';

// Generic components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Table, { TableBody, TableCell, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// #region Types
import { IAddress } from '../../../Types/Account/IAddress';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IApplication } from '../../../Types/Applications/IApplication';
import { IApplicationActivity } from '../../../Types/Applications/IApplicationActivity';
import { IApplicationAddress } from '../../../Types/Applications/IApplicationAddress';
import { IApplicationAttachment } from '../../../Types/Applications/IApplicationAttachment';
import { IApplicationEducation } from '../../../Types/Applications/IApplicationEducation';
import { IApplicationEmergencyContact } from '../../../Types/Applications/IApplicationEmergencyContact';
import { IApplicationEmployment } from '../../../Types/Applications/IApplicationEmployment';
import { IApplicationErrors } from '../../../Types/Applications/IApplicationErrors';
import { IApplicationForm } from '../../../Types/Form/IApplicationForm';
import { IApplicationFormResources } from '../../../Types/Resources/Admissions/IApplicationFormResources';
import { IApplicationIpeds } from '../../../Types/Applications/IApplicationIpeds';
import { IApplicationPhoneList } from '../../../Types/Applications/IApplicationPhoneList';
import { IApplicationProgram } from '../../../Types/Applications/IApplicationProgram';
import { IApplicationRelative } from '../../../Types/Applications/IApplicationRelative';
import { IApplicationResidency } from '../../../Types/Applications/IApplicationResidency';
import { IApplicationUserDefined } from '../../../Types/Applications/IApplicationUserDefined';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDataForm } from '../../../Types/Form/IDataForm';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IFieldForm } from '../../../Types/Form/IFieldForm';
import { IFieldsGroup } from '../../../Types/Form/IFieldsGroup';
import { IGroupErrors } from '../../../Types/Applications/IApplicationErrors';
import { IInstitution } from '../../../Types/Applications/IInstitution';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPaymentInfo } from '../../../Types/Payment/IPaymentInfo';
import { IPaymentTransaction } from '../../../Types/Payment/IPaymentTransaction';
import { ISavedApplication } from '../../../Types/Applications/ISavedApplication';
import { ITestScore } from '../../../Types/Applications/ITestScore';
import { PaymentOrigin } from '../../../Types/Enum/PaymentOrigin';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
// #endregion Types

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Requests
import Requests from '../../../Requests/Admissions/ApplicationForm';
import RequestsApplication from '../../../Requests/Admissions/Applications';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

interface IApplicationFormState {
    // Address Search Modal
    addresses?: IAddress[];
    openAddressSearchModal: boolean;
    hasSearchZipCode: boolean;
    selectedZipCode?: string;

    // Account
    hasPersonId: boolean;
    showSignIn: boolean;
    showSignUp: boolean;

    // Application
    activeStep: number;
    application: IApplication;
    applicationId?: number;
    componentError: boolean;
    components?: IApplicationForm;
    cultures: ICultures;
    dateTimeCulture: string;
    errors: IApplicationErrors[];
    expanded: boolean | string;
    expansionPanelHeaders: string[];
    firstDayOfWeek: number;
    openNotAvailableModal: boolean;
    resources?: IApplicationFormResources;
    rowsPerPageOptions: number[];
    shortDatePattern: string;

    // Attachments
    attachments: IApplicationAttachment[];
    attachmentsTotalSize?: string;
    attachmentsTotalSizeNumber: number;
    fileId?: number;
    fileName?: string;
    fileSelector?: any;
    openRemoveAttachmentDialog: boolean;
    openSupportedFilesModal: boolean;
    showAttachments: boolean;
    totalNumberOfAttachments: number;

    // ETS Search Modal
    countries?: IDropDownOption[];
    institutions?: IInstitution[];
    openETSSearchModal: boolean;
    pageNumber: number;
    pageSize: number;
    selectedCity?: string;
    selectedCountry?: number;
    selectedEtsCode?: string;
    selectedFieldId?: string;
    selectedInstitutionName?: string;
    selectedState?: number;
    states?: IDropDownOption[];
    total: number;

    // Payment
    paymentDetailModalOpen: boolean;
    paymentInfo?: IPaymentInfo;
    paymentModalOpenFail: boolean;
    paymentModalOpenProcess: boolean;
    paymentModalOpenSuccess: boolean;
    paymentTransaction?: IPaymentTransaction;
    returnUrl?: string;

    // Save
    changeEmailText: boolean;
    confirmationMessage?: string;
    emailField?: string;
    emptyEmailField: boolean;
    invalidEmail: boolean;
    openConfirmationSavedModal: boolean;
    openEmailModal: boolean;
    saveMessage?: string;
    showSaveButton: boolean;
    token?: string;

    // Settings
    governmentIdFormat: string;

    // ReCatpcha
    isReCaptchaSubmitApplicationEnabled: boolean;
    reCaptchaError: boolean;
    reCaptchaSiteKey: string;
    uiCulture: string;
}
// #endregion Types

// #region Component
class ApplicationFormView extends React.Component<any, IApplicationFormState> {
    private idMainPage: string;
    private idModule: string;
    private idPage: string;
    private rowsPerPageOptions: number[];
    private reCaptchaRef: RefObject<any>;

    public readonly state: Readonly<IApplicationFormState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idMainPage = 'Applications';
        this.idModule = 'Admissions';
        this.idPage = 'ApplicationForm';
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        this.state = this.getInitialState();
        this.reCaptchaRef = React.createRef();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IApplicationFormState {
        let resources: IApplicationFormResources | undefined;
        let isReCaptchaSubmitApplicationEnabled: boolean = false;

        let reCaptchaSiteKey: string = '';
        if (this.state) {
            resources = this.state.resources;
            isReCaptchaSubmitApplicationEnabled = this.state.isReCaptchaSubmitApplicationEnabled;
            reCaptchaSiteKey = this.state.reCaptchaSiteKey;
        }

        const cultures: ICultures = LayoutStore.getCultures();

        return {
            activeStep: 0,
            addresses: [],
            application: {
                addresses: [],
                education: [],
                employments: [],
                phones: [{ isPrimary: true }],
                testScores: [],
                userDefined: []
            },
            attachments: [],
            attachmentsTotalSizeNumber: 0,
            changeEmailText: true,
            componentError: false,
            components: undefined,
            cultures: LayoutStore.getCultures(),
            dateTimeCulture: cultures.dateTimeCulture,
            emptyEmailField: false,
            errors: [],
            expanded: false,
            expansionPanelHeaders: [],
            firstDayOfWeek: cultures.firstDayOfWeek,
            hasPersonId: false,
            hasSearchZipCode: false,
            institutions: [],
            invalidEmail: false,
            openAddressSearchModal: false,
            openConfirmationSavedModal: false,
            openEmailModal: false,
            openETSSearchModal: false,
            openNotAvailableModal: false,
            openRemoveAttachmentDialog: false,
            openSupportedFilesModal: false,
            pageNumber: 0,
            pageSize: 5,
            resources: resources,
            rowsPerPageOptions: [],
            shortDatePattern: cultures.shortDatePattern,
            showAttachments: false,
            showSaveButton: false,
            showSignIn: false,
            showSignUp: false,
            total: 0,
            totalNumberOfAttachments: 0,

            // Payment
            paymentDetailModalOpen: false,
            paymentModalOpenFail: false,
            paymentModalOpenProcess: false,
            paymentModalOpenSuccess: false,

            // Settings
            governmentIdFormat: '',

            // ReCaptcha
            isReCaptchaSubmitApplicationEnabled: isReCaptchaSubmitApplicationEnabled,
            reCaptchaError: false,
            reCaptchaSiteKey: reCaptchaSiteKey,
            uiCulture: LayoutStore.getCultures().uiCulture
        };
    }

    // #region Events
    // #region Payment
    private onClosePaymentDetailModal = (): void => {
        try {
            this.setState({
                paymentDetailModalOpen: false,
                paymentInfo: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePaymentDetailModal.name, e));
        }
    };

    private onClosePaymentModalProcess = (): void => {
        try {
            this.setState({
                paymentModalOpenProcess: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePaymentModalProcess.name, e));
        }
    };

    private onPay = (): void => {
        try {
            const {
                paymentInfo
            } = this.state;

            if (paymentInfo) {
                this.setState({
                    paymentModalOpenProcess: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onPay.name, e));
        }
    };

    private onCloseFailedPayment = (): void => {
        try {
            window.location.href = `${Constants.webUrl}/Admissions/Applications`;
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseFailedPayment.name, e));
        }
    };
    // #endregion Payment

    // #region Attachment
    private buildFileSelector = () => {
        try {
            const fileSelector = document.createElement('input');
            const {
                components
            } = this.state;
            if (components) {
                let supportedTypes: string = '';
                if (components.fileTypes) {
                    components.fileTypes.forEach(fileType => {
                        const newFileExt = fileType.fileExtension.replace(' ', '');
                        const fileExtensions = newFileExt.split(';');
                        fileExtensions.forEach(fileExt => {
                            supportedTypes = supportedTypes + fileExt.replace('*.', '') + ',';
                        });
                    });
                    fileSelector.setAttribute('type', 'file');
                    fileSelector.setAttribute('files', supportedTypes);
                    fileSelector.onchange = this.onChangeFile.bind(this);
                }
            }
            return fileSelector;
        }
        catch (e) {
            this.logError(LogData.fromException(this.buildFileSelector.name, e));
            return null;
        }
    };

    private getMediaTypeId = (fileExtension: string): number => {
        let mediaId: number = 0;
        try {
            const {
                components
            } = this.state;

            if (components && components.fileTypes) {
                components.fileTypes.forEach(fileType => {
                    const newFileExt = fileType.fileExtension.replace(' ', '');
                    const fileExtensions = newFileExt.split(';');
                    fileExtensions.forEach(fileExt => {
                        if (fileExt.replace('*.', '') === fileExtension) {
                            mediaId = fileType.mediaTypeId;
                        }
                    });
                });
            }
            return mediaId;
        }
        catch (e) {
            this.logError(LogData.fromException(this.getMediaTypeId.name, e));
            return mediaId;
        }
    };

    private readUploadedFile = inputFile => {
        try {
            const temporaryFileReader = new FileReader();

            return new Promise(resolve => {
                temporaryFileReader.onload = () => {
                    if (temporaryFileReader.result) {
                        let encoded = temporaryFileReader.result.toString().replace(/^data:(.*,)?/, '');
                        if ((encoded.length % 4) > 0) {
                            encoded += '='.repeat(4 - (encoded.length % 4));
                        }
                        resolve(encoded);
                    }
                };
                temporaryFileReader.readAsDataURL(inputFile);
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.readUploadedFile.name, e));
            return null;
        }
    };

    private onChangeFile = async event => {
        try {
            const {
                applicationId
            } = this.state;

            event.stopPropagation();
            event.preventDefault();

            const file = event.target.files[0];
            const fileName = file.name.split('.');
            const mediaId = this.getMediaTypeId(fileName[1]);
            if (mediaId !== 0 && applicationId) {
                const {
                    attachmentsTotalSizeNumber,
                    components,
                    resources,
                    totalNumberOfAttachments
                } = this.state;

                if (components && resources) {
                    if (components.numberOfAttachments <= totalNumberOfAttachments) {
                        LayoutActions.setAlert({
                            message: Format.toString(resources.attachments.lblTotalAttachmentsError, [components.numberOfAttachments]),
                            messageType: ResultType.warning
                        } as IAlert);
                    }
                    else {
                        const bytes = (file.size / 1048576).toFixed(5);
                        if (Number(bytes) > Number(components.maxAttachmentSize)) {
                            LayoutActions.setAlert({
                                message: Format.toString(resources.attachments.lblAttachmentsSizeError, [components.maxAttachmentSize]),
                                messageType: ResultType.warning
                            } as IAlert);
                        }
                        else {
                            if (Number(bytes) + Number(attachmentsTotalSizeNumber) > Number(components.maxAttachmentSize)) {
                                LayoutActions.setAlert({
                                    message: Format.toString(resources.attachments.lblAllAttachmentsSizeError,
                                        [components.maxApplicationAttachmentSize]),
                                    messageType: ResultType.warning
                                } as IAlert);
                            }
                            else {
                                const fileContents = await this.readUploadedFile(file);
                                const newFile: IApplicationAttachment = {
                                    applicationId: applicationId,
                                    attachmentTitle: fileName[0],
                                    extension: `.${fileName[1]}`,
                                    fileContent: fileContents,
                                    fileSize: file.size,
                                    mediaTypeId: mediaId
                                };
                                LayoutActions.setLoading(true);
                                Requests.postCreateApplicationAttachment(newFile, this.resolveCreateAttachment, this.logError);
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFile.name, e));
        }
    };

    private onClickOpenFolder = (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            event.preventDefault();
            const {
                fileSelector
            } = this.state;
            fileSelector.click();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickOpenFolder.name, e));
        }
    };

    private onClickContinue = () => {
        try {
            const {
                components,
                paymentInfo
            } = this.state;

            if (components) {
                if (paymentInfo) {
                    const returnUrl =
                        `${Constants.webUrl}/Admissions/ApplicationForm/${components.applicationFormId}`;
                    this.setState({
                        paymentDetailModalOpen: true,
                        returnUrl: returnUrl,
                        showAttachments: false
                    });
                }
                else {
                    components.isCompletedApplication = true;
                    this.setState({
                        components: components,
                        showAttachments: false
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickContinue.name, e));
        }
    };

    private onClickInfo = () => {
        try {
            this.setState({
                openSupportedFilesModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickInfo.name, e));
        }
    };

    private onCloseSupportedFilesModal = () => {
        try {
            this.setState({
                openSupportedFilesModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSupportedFilesModal.name, e));
        }
    };

    private onClickRemoveAttachmentButton = (event: any) => {
        try {
            const fieldButtonId: string[] = event.target.id.split('|');
            this.setState({
                fileId: Number(fieldButtonId[1]),
                fileName: fieldButtonId[2],
                openRemoveAttachmentDialog: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickRemoveAttachmentButton.name, e));
        }
    };

    private onClickRemoveAttachment = () => {
        try {
            const {
                fileId
            } = this.state;
            LayoutActions.setLoading(true);
            Requests.postDeleteApplicationAttachment(Number(fileId), this.resolveRemoveAttachment, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickRemoveAttachment.name, e));
        }
    };

    private onCloseRemoveAttachmentModal = (): void => {
        try {
            this.setState({
                openRemoveAttachmentDialog: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseRemoveAttachmentModal.name, e));
        }
    };

    // #endregion Attachment

    // #region Account
    private onCloseSignIn = (): void => {
        try {
            this.setState({
                showSignIn: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSignIn.name, e));
        }
    };

    private onCloseSignUp = (): void => {
        try {
            this.setState({
                showSignUp: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSignUp.name, e));
        }
    };

    private onOpenSignIn = (): void => {
        try {
            this.setState({
                showSignIn: true,
                showSignUp: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenSignIn.name, e));
        }
    };

    private onOpenSignUp = (): void => {
        try {
            this.setState({
                showSignIn: false,
                showSignUp: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenSignUp.name, e));
        }
    };

    private onAfterSignUp = (userName?: string): void => {
        try {
            // After creation of new account user must be logged in
            LayoutStore.setIsAuthenticated(true);
            LayoutStore.setMenuOptions(undefined);
            if (userName) {
                this.setState({
                    emailField: userName,
                    showSignUp: false
                });
                this.onSaveEmailField();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAfterSignUp.name, e));
        }
    };

    private onAfterSignIn = (): void => {
        try {
            this.setState({
                showSignIn: false
            });
            this.onSaveApplication();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAfterSignIn.name, e));
        }
    };
    // #endregion Account

    // #region Stepper
    private onBackStep = (): void => {
        try {
            const {
                activeStep
            } = this.state;

            this.setState({
                activeStep: activeStep - 1
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBackStep.name, e));
        }
    };

    private onClickStep = (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const steps: string[] = event.currentTarget.id.split('|');
            this.setState({
                activeStep: Number(steps[1])
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickStep.name, e));
        }
    };

    private onNextStep = (): void => {
        try {
            const {
                activeStep
            } = this.state;

            this.setState({
                activeStep: activeStep + 1
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onNextStep.name, e));
        }
    };
    // #endregion  Stepper

    // #region Address
    private onCloseAddressSearchModal = (): void => {
        try {
            this.setState({
                addresses: [],
                openAddressSearchModal: false,
                hasSearchZipCode: false,
                selectedZipCode: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAddressSearchModal.name, e));
        }
    };

    private onClickZipCodeLink =
        (zipCode?: string, city?: string, stateProvinceId?: number, countryId?: number, countyId?: number) => (): void => {
            try {
                const {
                    components,
                    selectedFieldId
                } = this.state;

                if (selectedFieldId && components) {
                    const fieldId: string[] = selectedFieldId.split('|');

                    const fieldGroup: IFieldForm[] =
                        components.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields;

                    if (fieldId.length > 4) {
                        this.assignFieldValue(fieldGroup, fieldId, 'addressCityId', true, city);
                        this.assignFieldValue(fieldGroup, fieldId, 'stateProvinceId', true, stateProvinceId);
                        this.assignFieldValue(fieldGroup, fieldId, 'postalCodeId', true, zipCode);
                        this.assignFieldValue(fieldGroup, fieldId, 'addressCountyId', true, countyId);
                        this.assignFieldValue(fieldGroup, fieldId, 'addressCountryId', true, countryId);
                    }
                    else {
                        this.assignFieldValue(fieldGroup, fieldId, 'addressCityId', false, city);
                        this.assignFieldValue(fieldGroup, fieldId, 'stateProvinceId', false, stateProvinceId);
                        this.assignFieldValue(fieldGroup, fieldId, 'postalCodeId', false, zipCode);
                        this.assignFieldValue(fieldGroup, fieldId, 'addressCountyId', false, countyId);
                        this.assignFieldValue(fieldGroup, fieldId, 'addressCountryId', false, countryId);
                    }
                }

                this.setState({
                    openAddressSearchModal: false
                });
            } catch (e) {
                this.logError(LogData.fromException(this.onClickZipCodeLink.name, e));
            }
        };

    private onChangeTextFieldAddressSearch = (event: any): void => {
        try {
            if (event.target.id && event.target.id !== '') {
                switch (event.target.id) {
                    case 'txtZipCode':
                        this.setState({
                            selectedZipCode: event.target.value
                        });
                        break;
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextFieldAddressSearch.name, e));
        }
    };

    private onClearAddress = (): void => {
        try {
            this.setState({
                addresses: [],
                hasSearchZipCode: false,
                selectedZipCode: undefined
            });
        }
        catch (e) {
            throw e;
        }
    };

    private onSearchAddress = (): void => {
        try {
            LayoutActions.setLoading(true);

            const {
                pageSize,
                selectedZipCode
            } = this.state;

            Requests.getAddresses(
                0,
                pageSize,
                selectedZipCode,
                this.resolveGetAddress, this.logError);

            const {
                total
            } = this.state;

            if (total) {
                const previousSize = pageSize;
                // Fix 60
                this.setState({
                    pageSize: 0
                }, () => {
                    this.setState({
                        pageNumber: 0,
                        pageSize: previousSize
                    });
                });
            }

            this.setState({
                hasSearchZipCode: true
            });
        }
        catch (e) {
            LayoutActions.setLoading(false);
            throw e;
        }
    };
    // #endregion Address

    // #region Education
    private onChangeTextFieldETSSearch = (event: any): void => {
        try {
            if (event.target.id && event.target.id !== '') {
                switch (event.target.id) {
                    case 'txtEtsCode':
                        this.setState({
                            selectedEtsCode: event.target.value
                        });
                        break;
                    case 'txtCity':
                        this.setState({
                            selectedCity: event.target.value
                        });
                        break;
                    case 'txtInstitutionName':
                        this.setState({
                            selectedInstitutionName: event.target.value
                        });
                        break;
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextFieldETSSearch.name, e));
        }
    };

    private onCloseETSSearchModal = (): void => {
        try {
            this.setState({
                institutions: [],
                openETSSearchModal: false,
                selectedCity: undefined,
                selectedCountry: undefined,
                selectedEtsCode: undefined,
                selectedInstitutionName: undefined,
                selectedState: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseETSSearchModal.name, e));
        }
    };

    private onChangeDropDownETSSearch = (optionSelected: IDropDownOption, id: string): void => {
        try {
            if (id && id !== '') {
                switch (id) {
                    case 'ddlCountry':
                        this.setState({
                            selectedCountry: optionSelected.value === '' ? undefined :
                                Number(optionSelected.value)
                        });
                        break;
                    case 'ddlState':
                        this.setState({
                            selectedState: optionSelected.value === '' ? undefined :
                                Number(optionSelected.value)
                        });
                        break;
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropDownETSSearch.name, e));
        }
    };

    private onClearInstitution = (): void => {
        try {
            this.setState({
                institutions: [],
                selectedCity: undefined,
                selectedCountry: undefined,
                selectedEtsCode: undefined,
                selectedInstitutionName: undefined,
                selectedState: undefined
            });
        }
        catch (e) {
            throw e;
        }
    };

    private onSearchInstitution = (): void => {
        try {
            LayoutActions.setLoading(true);

            const {
                selectedCity,
                selectedEtsCode,
                selectedInstitutionName,
                selectedState,
                selectedCountry,
                pageSize
            } = this.state;

            Requests.getInstitutions(
                0,
                pageSize,
                selectedInstitutionName,
                selectedEtsCode,
                selectedCity,
                selectedState,
                selectedCountry,
                this.resolveGetInstitutions, this.logError);

            const {
                total
            } = this.state;

            if (total) {
                const previousSize = pageSize;
                // Fix 60
                this.setState({
                    pageSize: 0
                }, () => {
                    this.setState({
                        pageNumber: 0,
                        pageSize: previousSize
                    });
                });
            }
        }
        catch (e) {
            LayoutActions.setLoading(false);
            throw e;
        }
    };

    private onClickLink =
        (institutionName?: string, etsCode?: string, ficeCode?: string, city?: string, stateProvinceId?: number, countryId?: number) => (): void => {
            try {
                const {
                    components,
                    selectedFieldId
                } = this.state;

                if (selectedFieldId && components) {
                    const fieldId: string[] = selectedFieldId.split('|');

                    const fieldGroup: IFieldForm[] =
                        components.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields;

                    if (fieldId.length > 4) {
                        this.assignFieldValue(fieldGroup, fieldId, 'educationInstitutionName', true, institutionName);
                        this.assignFieldValue(fieldGroup, fieldId, 'educationEtsCodeId', true, etsCode);
                        this.assignFieldValue(fieldGroup, fieldId, 'educationFiceCode', true, ficeCode);
                        this.assignFieldValue(fieldGroup, fieldId, 'educationCityId', true, city);
                        this.assignFieldValue(fieldGroup, fieldId, 'educationStateId', true, stateProvinceId);
                        this.assignFieldValue(fieldGroup, fieldId, 'educationCountryId', true, countryId);
                    }
                    else {
                        this.assignFieldValue(fieldGroup, fieldId, 'educationInstitutionName', false, institutionName);
                        this.assignFieldValue(fieldGroup, fieldId, 'educationEtsCodeId', false, etsCode);
                        this.assignFieldValue(fieldGroup, fieldId, 'educationFiceCode', false, ficeCode);
                        this.assignFieldValue(fieldGroup, fieldId, 'educationCityId', false, city);
                        this.assignFieldValue(fieldGroup, fieldId, 'educationStateId', false, stateProvinceId);
                        this.assignFieldValue(fieldGroup, fieldId, 'educationCountryId', false, countryId);
                    }
                }

                this.setState({
                    openETSSearchModal: false
                });
            } catch (e) {
                this.logError(LogData.fromException(this.onClickLink.name, e));
            }
        };
    // #endregion Education

    // #region Phone
    private onPrimaryButtonClick = (fieldId: string[], newComponents: IApplicationForm, value: any): IApplicationForm => {
        try {
            const phoneFields: any = newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])];
            let field: any = [];
            let numRow: number = 4;

            field = newComponents;
            phoneFields.fields.forEach(function (item, row) {
                const idFields: string[] = item.data.id.split('|');
                if (fieldId[0] === idFields[0]) {
                    if (fieldId[3] !== idFields[3] || fieldId[4] !== idFields[4]) {
                        item.value = '';
                    }
                    else {
                        numRow = row;
                    }
                }
            });

            field.steps[Number(fieldId[1])].fieldsGroups[fieldId[2]].fields[Number(numRow)].value = value;
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
        return newComponents;
    };
    // #endregion Phone

    // #region Submit and Save
    private onSaveApplication = (): void => {
        try {
            const {
                components,
                resources,
                token
            } = this.state;

            if (resources) {
                const applicationTop: HTMLElement | null = document.getElementById('applicationTop');
                if (applicationTop) {
                    applicationTop.scrollIntoView();
                }
                LayoutActions.setLoading(true);
                if (components) {
                    if (components && components.layoutId) {
                        // Update saved application
                        if (token) {
                            if (components.person &&
                                (components.person.email || components.person.temporaryEmail)) {
                                const savedApplication: ISavedApplication = {
                                    applicationFormSettingId: components.applicationFormId,
                                    email: components.person.email ? components.person.email :
                                        components.person.temporaryEmail ? components.person.temporaryEmail : '',
                                    formLayoutId: components.layoutId,
                                    token: token
                                };
                                RequestsApplication.postUpdateSavedApplication(savedApplication,
                                    components, this.resolveSaveIncompleteApplication, this.logError);
                            }
                        }
                        else {
                            if (LayoutStore && !LayoutStore.getIsAuthenticated()) {
                                // If person doesn't have a person id
                                if (!components.person || !components.person.personId) {
                                    this.onOpenSignIn();
                                    LayoutActions.setLoading(false);
                                }
                            }
                            else {
                                // If user has primary email use this to populate email confirmation modal.
                                if (components.person && components.person.email) {
                                    this.setState({
                                        emailField: components.person.email,
                                        openEmailModal: true
                                    });
                                    LayoutActions.setLoading(false);
                                }
                                else if (components.person && components.person.temporaryEmail) {
                                    this.onSaveEmailField();
                                }
                                // If user has not primary email and email exist in the form with some value use it.
                                else {
                                    if (components) {
                                        let hasValueEmailField: boolean = false;
                                        components.steps.forEach(step => {
                                            step.fieldsGroups.forEach(fieldsGroup => {
                                                fieldsGroup.fields.forEach(field => {
                                                    if (field.data.id === 'emailId') {
                                                        if (field.value && !field.data.error) {
                                                            this.setState({
                                                                emailField: field.value,
                                                                openEmailModal: true
                                                            });
                                                            hasValueEmailField = true;
                                                            LayoutActions.setLoading(false);
                                                        }
                                                    }
                                                });
                                            });
                                        });
                                        // If user has not primary email and email not exist in the form or is empty don't populate it.
                                        if (!hasValueEmailField) {
                                            this.setState({
                                                openEmailModal: true
                                            });
                                            LayoutActions.setLoading(false);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveApplication.name, e));
        }
    };

    private onSaveEmailField = (): void => {
        try {
            LayoutActions.setLoading(true);

            const {
                components,
                emailField,
                invalidEmail
            } = this.state;

            if (!emailField &&
                components && components.person && !components.person.temporaryEmail) {
                this.setState({
                    emptyEmailField: true
                });
            }
            else {
                if (!invalidEmail && components && components.person) {
                    const savedApplication: ISavedApplication = {
                        applicationFormSettingId: components.applicationFormId,
                        email: emailField ? emailField :
                            components.person.temporaryEmail ? components.person.temporaryEmail : '',
                        formLayoutId: components.layoutId
                    };
                    Requests.postCreateSavedApplication(savedApplication, components, this.resolveSaveIncompleteApplication, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextFieldModal.name, e));
        }
    };

    private onSubmit = (): void => {
        try {
            const {
                application,
                components,
                governmentIdFormat
            } = this.state;

            const applicationTop: HTMLElement | null = document.getElementById('applicationTop');
            if (applicationTop) {
                applicationTop.scrollIntoView();
            }

            if (components) {
                components.steps.forEach(step => {
                    step.fieldsGroups.forEach(fieldsGroup => {
                        fieldsGroup.fields.forEach(field => {
                            let exist: boolean = false;
                            if (field.componentType === 'Dropdown') {
                                if (field.default && field.data.options) {
                                    field.data.options.forEach(option => {
                                        if (option.value.toString() === field.default.toString()) {
                                            exist = true;
                                        }
                                    });
                                }
                                if (exist) {
                                    field.value = field.value ? field.value : field.default;
                                    this.setApplicationValues(field.data.id, field.value);
                                }
                                else if (!field.default && field.value !== '') {
                                    this.setApplicationValues(field.data.id, field.value);
                                }
                            }
                            else {
                                field.value = field.value ? field.value : field.default;
                                this.setApplicationValues(field.data.id, field.value);
                            }
                        });
                    });
                });
            }

            this.setState({
                components
            });

            const {
                isReCaptchaSubmitApplicationEnabled
            } = this.state;

            let reCaptchaResponse: string = '';
            if (isReCaptchaSubmitApplicationEnabled && this.reCaptchaRef?.current) {
                reCaptchaResponse = this.reCaptchaRef.current.getValue();
                this.setState({
                    reCaptchaError: !Boolean(reCaptchaResponse)
                });
            }

            const allRequiredFields: boolean = this.reviewRequiredFields();
            if (!isReCaptchaSubmitApplicationEnabled || reCaptchaResponse) {
                this.setState({
                    reCaptchaError: false
                });

                if (allRequiredFields) {

                    // Remove non-alphanumeric characters from governmentId
                    if (application.governmentId && governmentIdFormat) {
                        let cleanGovernmentId: string = '';
                        for (let i = 0; i < governmentIdFormat.length; i++) {
                            if (governmentIdFormat[i] === 'X' || governmentIdFormat[i] === '#') {
                                cleanGovernmentId += application.governmentId[i];
                            }
                        }
                        application.governmentId = cleanGovernmentId;
                    }

                    if (application) {
                        LayoutActions.showPageLoader();
                        Requests.postSubmit(application, this.resolveSubmitApplication, this.logError);
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSubmit.name, e));
        }
    };

    private onCloseEmailModal = (): void => {
        try {
            this.setState({
                openEmailModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseEmailModal.name, e));
        }
    };

    private onCloseNotAvailableModal = (): void => {
        try {
            window.location.assign(`${Constants.webUrl}/Admissions/Applications`);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseNotAvailableModal.name, e));
        }
    };

    private onCloseConfirmationSavedModal = (): void => {
        try {
            const {
                components
            } = this.state;

            if (components) {
                const confirmationIndex: number =
                    components.fieldsGroups.findIndex(x => x.id === 'confirmationGroup');
                const finishButtonId: number =
                    components.fieldsGroups[confirmationIndex].fields.findIndex(x => x.data.id === 'finishId');
                if (confirmationIndex > -1 && finishButtonId > -1) {
                    const actionUrl: string | undefined = components.fieldsGroups[confirmationIndex].fields[finishButtonId].actionUrl;
                    if (actionUrl) {
                        window.location.assign(actionUrl);
                    }
                    else {
                        window.location.assign(`${Constants.webUrl}/Admissions/Applications`);
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseConfirmationSavedModal.name, e));
        }
    };
    // #endregion Submit and Save

    // #region Change Fields Events
    private onChangeCheckBox = (event: any): void => {
        try {
            const {
                application,
                components
            } = this.state;

            if (application && components) {
                const app: IApplication = application;
                const fieldId: string[] = event.target.id.split('|');
                const newComponents: IApplicationForm = components;
                const value: boolean = Boolean(event.target.checked);
                const evaluateAppJs = eval;

                if (fieldId.length < 5) {
                    if (fieldId && fieldId[1] && fieldId[2] && fieldId[3]) {
                        const field: IFieldForm = newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];

                        if (field.isUserDefined && field.customScript) {
                            if (value) {
                                field.value = evaluateAppJs(field.customScript);
                                field.data.error = false;
                                field.data.helperText = '';
                            }
                            else {
                                field.value = NaN;
                            }
                        }
                        else {
                            field.value = value ? value : undefined;
                        }
                    }
                }
                else {
                    const field: IFieldForm | undefined =
                        components.steps[Number(fieldId[1])].
                            fieldsGroups[Number(fieldId[2])].
                            fields.find(x =>
                                x.data.section === Number(fieldId[4]) &&
                                x.data.id.substr(0, fieldId[0].length) === fieldId[0]);
                    if (field) {
                        field.value = value;
                    }
                }

                this.setState({
                    application: app,
                    components: newComponents
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckBox.name, e));
        }
    };

    private onChangeDateTimeField = (date: string, id: string, isValid: boolean): void => {
        try {
            const {
                application,
                components,
                cultures,
                resources,
                shortDatePattern
            } = this.state;

            if (id && id !== '' && application && components) {
                const app: IApplication = application;
                const fieldId: string[] = id.split('|');
                let fieldIndex: number = 0;
                if (fieldId[4]) {
                    fieldIndex = Number(fieldId[4]) + 1;
                }
                let newComponents: IApplicationForm = components;
                const field = newComponents.steps[Number(fieldId[1])].
                    fieldsGroups[Number(fieldId[2])].
                    fields[Number(fieldId[3])];

                const dateMinFormat: string =
                    moment().add(-100, 'years').format(cultures.shortDatePattern.toUpperCase());
                const dateMaxFormat: string =
                    moment().add(100, 'years').format(cultures.shortDatePattern.toUpperCase());

                switch (fieldId[0]) {
                    case 'dateOfBirthId':
                        app.dateOfBirth = date;
                        newComponents = this.setValues(fieldId, newComponents, date);
                        if (isValid) {
                            field.data.error = false;
                            field.data.helperText = '';
                            newComponents = this.cleanErrorMessages(fieldId, newComponents);
                        }
                        else {
                            if (date) {
                                field.data.error = true;
                                if (resources) {
                                    field.data.helperText =
                                        Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat]);
                                }
                            }
                            else {
                                field.data.error = true;
                                field.data.helperText = field.data.errorMessageRequired;
                            }
                        }
                        break;
                    case 'visaExpirationDateId':
                        app.visaExpiration = date;
                        newComponents = this.setValues(fieldId, newComponents, date);
                        if (isValid) {
                            field.data.error = false;
                            field.data.helperText = '';
                            newComponents = this.cleanErrorMessages(fieldId, newComponents);
                        }
                        else {
                            if (date) {
                                field.data.error = true;
                                if (resources) {
                                    field.data.helperText =
                                        Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat]);
                                }
                            }
                            else {
                                field.data.error = true;
                                field.data.helperText = field.data.errorMessageRequired;
                            }
                        }
                        break;
                    case 'passportExpirationDateId':
                        app.passportExpiration = date;
                        newComponents = this.setValues(fieldId, newComponents, date);
                        if (isValid) {
                            field.data.error = false;
                            field.data.helperText = '';
                            newComponents = this.cleanErrorMessages(fieldId, newComponents);
                        }
                        else {
                            if (date) {
                                field.data.error = true;
                                if (resources) {
                                    field.data.helperText =
                                        Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat]);
                                }
                            }
                            else {
                                field.data.error = true;
                                field.data.helperText = field.data.errorMessageRequired;
                            }
                        }
                        break;
                    case 'testDateTakenId':
                        const fieldTestTaken: any = newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])];
                        if (!app.testScores[fieldIndex]) {
                            app.testScores[fieldIndex] = {} as ITestScore;
                        }
                        app.testScores[fieldIndex].dateTaken = date;
                        if (!isValid) {
                            field.data.error = true;
                            if (resources) {
                                field.data.helperText =
                                    Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat]);
                            }
                        }
                        if (fieldId.length > 4) {
                            fieldTestTaken.fields.forEach(function (field) {
                                const itemArrId: string[] = field.data.id.split('|');
                                if (fieldId[3] === itemArrId[3] && fieldId[4] === itemArrId[4]) {
                                    if (!isValid) {
                                        field.data.error = true;
                                        if (resources) {
                                            field.data.helperText =
                                                Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat]);
                                        }
                                    } else if (moment(date, shortDatePattern).toDate() > new Date()) {
                                        field.data.error = true;
                                        field.data.helperText =
                                            Format.toString(
                                                field.data.errorMessageRange, [
                                                newComponents.dateTimeMin,
                                                moment(new Date()).format(shortDatePattern.toUpperCase())]);
                                    } else {
                                        field.data.error = false;
                                        field.data.helperText = '';
                                        field.value = date;
                                    }
                                }
                            });
                        }
                        else {
                            fieldTestTaken.fields.forEach(function (field) {
                                const itemArrId: string[] = field.data.id.split('|');
                                if (fieldId[0] === itemArrId[0] && itemArrId.length === 1) {
                                    if (!isValid) {
                                        field.data.error = true;
                                        if (resources) {
                                            field.data.helperText =
                                                Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat]);
                                        }
                                    } else if (moment(date).toDate() > new Date()) {
                                        field.data.error = true;
                                        field.data.helperText =
                                            Format.toString(
                                                field.data.errorMessageRange, [
                                                newComponents.dateTimeMin,
                                                moment(new Date()).format(shortDatePattern.toUpperCase())]);
                                    } else {
                                        field.data.error = false;
                                        field.data.helperText = '';
                                        field.value = date;
                                    }
                                }
                            });
                        }
                        break;
                    default:
                        newComponents = this.setValues(fieldId, newComponents, date);
                        if (isValid) {
                            field.data.error = false;
                            field.data.helperText = '';
                            newComponents = this.cleanErrorMessages(fieldId, newComponents);
                        }
                        else {
                            if (date) {
                                field.data.error = true;
                                if (resources) {
                                    field.data.helperText =
                                        Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat]);
                                }
                            }
                            else {
                                if (field.isRequired) {
                                    field.data.error = true;
                                    field.data.helperText = field.data.errorMessageRequired;
                                }
                            }
                        }
                        break;
                }
                this.setState({
                    application: app,
                    components: newComponents
                });
            }
        } catch (e) {
            this.logError(LogData.fromException(this.onChangeDateTimeField.name, e));
        }
    };

    private onChangeDropDown = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                application,
                components
            } = this.state;

            if (id && id !== '' && application && components) {
                const app: IApplication = application;
                const fieldId: string[] = id.split('|');
                let fieldIndex: number = 0;
                if (fieldId[4]) {
                    fieldIndex = Number(fieldId[4]) + 1;
                }

                let valueSelected: any | undefined;
                if (optionSelected.value) {
                    switch (typeof optionSelected.value) {
                        case 'string':
                            valueSelected = String(optionSelected.value);
                            break;
                        case 'number':
                            valueSelected = Number(optionSelected.value);
                            break;
                        default:
                            valueSelected = optionSelected.value;
                            break;
                    }
                }

                switch (fieldId[0]) {
                    case 'testId':
                        if (!app.testScores[fieldIndex]) {
                            app.testScores[fieldIndex] = {} as ITestScore;
                        }
                        app.testScores[fieldIndex].id = valueSelected;
                        app.testScores[fieldIndex].typeId = 0;

                        const testScoreComponents: IFieldForm[] =
                            components.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields;
                        const score: IFieldForm | undefined =
                            testScoreComponents.find(f =>
                                f.data.id.split('|')[0] === 'testScoreId' &&
                                (f.data.id.split('|')[4] || '') === (fieldId[4] || ''));

                        if (score && valueSelected && valueSelected !== '') {
                            Requests.getValidateScoreType(
                                application.applicationId || 0,
                                app.testScores[fieldIndex].id,
                                'testScoreGroup',
                                score.data.id,
                                this.resolveValidateScore, this.logError);
                        }
                        break;
                    case 'testTypeId':
                        if (!app.testScores[fieldIndex]) {
                            app.testScores[fieldIndex] = {} as ITestScore;
                        }
                        app.testScores[fieldIndex].typeId = valueSelected;
                        break;
                    case 'hispanicGroupId':
                        if (components) {
                            // Get fieldsGroup
                            const fieldsGroup: IFieldForm[] =
                                components.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields;
                            // Get checkBoxList hispanicCheckboxListId index
                            let checkBoxListIndex: number = -1;
                            fieldsGroup.forEach((field, i) => {
                                if (field.data.id.substr(0, 'hispanicCheckboxListId'.length) === 'hispanicCheckboxListId') {
                                    checkBoxListIndex = i;
                                }
                            });
                            // Get checkBoxList hispanicCheckboxListId
                            const checkBoxListField: IFieldForm =
                                components.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[checkBoxListIndex];
                            let ipedsList: IApplicationIpeds[] | undefined = application.ipeds;
                            if (valueSelected === '1') {
                                if (checkBoxListField) {
                                    // Add category in list
                                    const ipeds: IApplicationIpeds = { ipedsEthnicityId: undefined, ipedsFederalCategoryId: 1 };
                                    if (ipedsList) {
                                        const ipedIndex: number =
                                            ipedsList.findIndex(x => x.ipedsFederalCategoryId === 1);
                                        // Category was not found, add category
                                        if (ipedIndex === -1) {
                                            ipedsList.push(ipeds);
                                        }
                                    }
                                    // ipedsList was undefined so add a new item with category
                                    else {
                                        ipedsList = [ipeds];
                                    }
                                    checkBoxListField.value = undefined;
                                }
                            }
                            if (valueSelected === '0') {
                                if (checkBoxListField) {
                                    if (ipedsList && ipedsList.length > 0) {
                                        let index: number = -1;
                                        do {
                                            index = ipedsList.findIndex(x => x.ipedsFederalCategoryId === 1);
                                            if (index > -1) {
                                                ipedsList.splice(index, 1);
                                            }
                                        } while (index > -1);
                                    }
                                    checkBoxListField.value = undefined;
                                }
                            }
                            if (valueSelected === undefined) {
                                if (checkBoxListField) {
                                    if (ipedsList && ipedsList.length > 0) {
                                        let index: number = ipedsList.length;
                                        do {
                                            ipedsList.splice(index, 1);
                                            index--;
                                        } while (ipedsList.length > 0);
                                    }
                                    checkBoxListField.value = undefined;
                                }
                            }
                            application.ipeds = ipedsList;
                            this.setState({
                                application: application,
                                components: components
                            });
                        }
                        break;
                    default:
                        break;
                }

                let newComponents: IApplicationForm = components;
                if (fieldId && fieldId[1] && fieldId[2] && fieldId[3]) {
                    newComponents = this.cleanErrorMessages(fieldId, newComponents);
                    newComponents = this.setValues(fieldId, newComponents, valueSelected);

                    const fieldGroup: any = newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])];
                    const sectionFields: any = fieldGroup.fields.filter(x => (x.data.id.split('|')[4] || '') === (fieldId[4] || ''));

                    sectionFields.forEach(field => {
                        if (fieldId[0] === 'testId' && field.childField && valueSelected && valueSelected !== '' &&
                            Number(valueSelected) > 0) {
                            Requests.getChildOptions(
                                field.childEndPoint,
                                valueSelected || 0,
                                fieldId[1],
                                fieldId[2],
                                field.childField,
                                true,
                                this.resolveGetChildOptions,
                                this.logError,
                                undefined);
                        }
                        if (fieldId[0] === 'activityTypeId' && field.childField && valueSelected && valueSelected !== '' &&
                            Number(valueSelected) > 0) {
                            Requests.getChildOptions(
                                field.childEndPoint,
                                valueSelected || 0,
                                fieldId[1],
                                fieldId[2],
                                field.childField,
                                true,
                                this.resolveGetChildOptions,
                                this.logError,
                                Number(newComponents.applicationFormId));
                        }
                        if (fieldId[0] === 'campusOptionsId' && field.childField && valueSelected && valueSelected !== '' &&
                            Number(valueSelected) > 0) {
                            Requests.getChildOptions(
                                field.childEndPoint,
                                valueSelected || 0,
                                fieldId[1],
                                fieldId[2],
                                field.childField,
                                true,
                                this.resolveGetChildOptions,
                                this.logError,
                                undefined);
                        }
                    });
                }
                this.setState({
                    application: app,
                    components: newComponents
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropDown.name, e));
        }
    };

    private onChangeListCheckbox = (event: any): void => {
        try {
            const {
                application,
                components
            } = this.state;

            const fieldId: string[] = event.currentTarget.id.split('|');
            const app: IApplication = application;

            if (application && components) {
                const childField: string[] = event.target.id.split('|');
                if (childField[1] === 'noHispanicNestedCheckboxListId') {
                    const field: IFieldForm =
                        components.steps[Number(childField[2])].
                            fieldsGroups[Number(childField[3])].
                            fields[Number(childField[4])];
                    if (!app.ipeds && field.value) {
                        const fieldGroup: IFieldsGroup =
                            components.steps[Number(childField[2])].
                                fieldsGroups[Number(childField[3])];
                        this.setIpedsValuesNestedCheckList(fieldGroup);
                    }
                    if (event.target.checked === true) {
                        let ipedNew: IApplicationIpeds = { ipedsFederalCategoryId: 0 };
                        let ipedIndex: number = -1;
                        if (childField[0] === 'child') {
                            ipedNew = {
                                ipedsEthnicityId: Number(childField[7]),
                                ipedsFederalCategoryId: Number(childField[6])
                            };
                            if (app.ipeds) {
                                ipedIndex = app.ipeds.findIndex(x => x.ipedsEthnicityId === undefined &&
                                    x.ipedsFederalCategoryId === Number(childField[6]));
                            }
                        }
                        else if (childField[0] === 'parent') {
                            ipedNew = {
                                ipedsEthnicityId: undefined,
                                ipedsFederalCategoryId: Number(childField[6])
                            };
                            if (app.ipeds) {
                                ipedIndex =
                                    app.ipeds.findIndex(x => x.ipedsFederalCategoryId ===
                                        Number(childField[6]));
                            }
                        }
                        if (app.ipeds) {
                            if (ipedIndex > -1) {
                                app.ipeds[ipedIndex] = ipedNew;
                            }
                            else {
                                app.ipeds.push(ipedNew);
                            }
                        }
                        else {
                            app.ipeds = [ipedNew];
                        }
                    }
                    else {
                        if (app.ipeds) {
                            if (childField[0] === 'child') {
                                const itemToRemove: number =
                                    app.ipeds.findIndex(x => x.ipedsEthnicityId === Number(childField[7]) &&
                                        x.ipedsFederalCategoryId === Number(childField[6]));
                                app.ipeds.splice(itemToRemove, 1);
                            }
                            else if (childField[0] === 'parent') {
                                let index: number = -1;
                                do {
                                    index = app.ipeds.findIndex(x =>
                                        x.ipedsFederalCategoryId === Number(childField[6]));
                                    if (index > -1) {
                                        app.ipeds.splice(index, 1);
                                    }
                                } while (index > -1);
                            }
                        }
                    }
                    if (childField && childField[2] && childField[3] && childField[4]) {
                        const field: IFieldForm =
                            components.steps[Number(childField[2])].
                                fieldsGroups[Number(childField[3])].
                                fields[Number(childField[4])];
                        if (app.ipeds && app.ipeds.length === 0 && field.isRequired) {
                            field.value = undefined;
                        }
                        else {
                            // change value of field
                            if (app.ipeds) {
                                field.value = undefined;
                                app.ipeds.forEach(iped => {
                                    if (iped.ipedsFederalCategoryId !== 1) {
                                        if (field.value) {
                                            field.value = field.value +
                                                `${iped.ipedsFederalCategoryId.toString()}$${iped.ipedsEthnicityId ?
                                                    iped.ipedsEthnicityId.toString() : ''},`;
                                        }
                                        else {
                                            field.value =
                                                `${iped.ipedsFederalCategoryId.toString()}$${iped.ipedsEthnicityId ?
                                                    iped.ipedsEthnicityId.toString() : ''},`;
                                        }
                                    }
                                });
                            }
                        }
                    }
                }

                switch (fieldId[0]) {
                    case 'campusId':
                        if (fieldId && fieldId[1] && fieldId[2] && fieldId[3] && fieldId[4]) {
                            const field: any =
                                components.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                            if (!app.campuses && field.value) {
                                const fieldGroup =
                                    components.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])];
                                this.reviewCampus(fieldGroup);
                            }
                        }
                        if (app.campuses) {
                            const campusIndex: number = app.campuses.findIndex(x => x === Number(fieldId[4]));
                            if (event.target.checked === true) {
                                app.campuses.push(Number(fieldId[4]));
                            }
                            else {
                                app.campuses.splice(campusIndex, 1);
                            }
                        }
                        else {
                            if (event.target.checked === true) {
                                const campus: number = Number(fieldId[4]);
                                app.campuses = [campus];
                            }
                        }
                        if (fieldId && fieldId[1] && fieldId[2] && fieldId[3] && fieldId[4]) {
                            const field: any =
                                components.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                            if (app.campuses && app.campuses.length === 0 && field.isRequired) {
                                field.value = undefined;
                                field.data.error = true;
                                field.data.helperText = field.data.errorMessageRequired;
                            }
                            else {
                                if (app.campuses) {
                                    field.value = app.campuses.toString();
                                }
                                field.data.error = false;
                                field.data.helperText = '';
                            }
                        }
                        break;
                    case 'interestId':
                        if (fieldId && fieldId[1] && fieldId[2] && fieldId[3] && fieldId[4]) {
                            const field: any =
                                components.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                            if (!app.academicInterests && field.value) {
                                const fieldGroup =
                                    components.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])];
                                this.reviewAcademicInterest(fieldGroup);
                            }
                        }
                        if (app.academicInterests) {
                            const index: number = app.academicInterests.findIndex(x => x === Number(fieldId[4]));
                            if (event.target.checked === true) {
                                app.academicInterests.push(Number(fieldId[4]));
                            }
                            else {
                                app.academicInterests.splice(index, 1);
                            }
                        }
                        else {
                            if (event.target.checked === true) {
                                app.academicInterests = [Number(fieldId[4])];
                            }
                        }
                        if (fieldId && fieldId[1] && fieldId[2] && fieldId[3] && fieldId[4]) {
                            const field: any = components.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                            if (app.academicInterests && app.academicInterests.length === 0 && field.isRequired) {
                                field.value = undefined;
                                field.data.error = true;
                                field.data.helperText = field.data.errorMessageRequired;
                            }
                            else {
                                if (app.academicInterests) {
                                    field.value = app.academicInterests.toString();
                                }
                                field.data.error = false;
                                field.data.helperText = '';
                            }
                        }
                        break;
                    case 'hispanicCheckboxListId':
                        const field: IFieldForm =
                            components.steps[Number(childField[1])].
                                fieldsGroups[Number(childField[2])].
                                fields[Number(childField[3])];
                        if (!app.ipeds && field.value) {
                            const fieldGroup: IFieldsGroup =
                                components.steps[Number(childField[1])].
                                    fieldsGroups[Number(childField[2])];
                            this.setIpedsValuesCheckList(fieldGroup);
                        }
                        const ipedNew: IApplicationIpeds = {
                            ipedsEthnicityId: Number(fieldId[4]),
                            ipedsFederalCategoryId: 1
                        };
                        if (app.ipeds) {
                            const ipedIndex: number = app.ipeds.findIndex(x => x.ipedsEthnicityId === undefined &&
                                x.ipedsFederalCategoryId === 1);
                            if (event.target.checked === true) {
                                // when exists category 1 and null, record should be updated
                                if (ipedIndex > -1) {
                                    app.ipeds[ipedIndex] = ipedNew;
                                }
                                else {
                                    app.ipeds.push(ipedNew);
                                }
                            }
                            else {
                                // remove item from list
                                const itemToRemove: number =
                                    app.ipeds.findIndex(x => x.ipedsEthnicityId === Number(fieldId[4]) &&
                                        x.ipedsFederalCategoryId === 1);
                                app.ipeds.splice(itemToRemove, 1);
                            }
                        }
                        else {
                            app.ipeds = [ipedNew];
                        }
                        // Select yes in radio buttons
                        components.steps[Number(fieldId[1])].
                            fieldsGroups[Number(fieldId[2])].fields.forEach(field => {
                                if (field.data.id === 'hispanicGroupId') {
                                    field.value = '1';
                                }
                            });
                        // Add in the list of value id's selected
                        if (fieldId && fieldId[1] && fieldId[2] && fieldId[3] && fieldId[4]) {
                            const field: IFieldForm =
                                components.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                            if (app.ipeds && app.ipeds.length === 0 && field.isRequired) {
                                field.value = undefined;
                            }
                            else {
                                // change value of field
                                if (app.ipeds) {
                                    const ipedsArray: string[] = [];
                                    app.ipeds.forEach(ethnicity => {
                                        if (ethnicity.ipedsFederalCategoryId === 1) {
                                            if (ethnicity.ipedsEthnicityId) {
                                                ipedsArray.push(ethnicity.ipedsEthnicityId.toString());
                                            }
                                        }
                                    });
                                    field.value = ipedsArray.toString();
                                }
                            }
                        }
                        break;
                }
                this.setState({
                    application: app,
                    components: components
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeListCheckbox.name, e));
        }
    };

    private onChangeRadioGroup = (event: any, value: string): void => {
        try {
            const {
                application,
                components
            } = this.state;

            if (event.target.name && event.target.name !== '' && application && components) {
                const app: IApplication = application;
                const fieldId: string[] = event.target.name.split('|');
                let newComponents: IApplicationForm = components;

                switch (fieldId[0]) {
                    case 'primaryPhoneId':
                        newComponents = this.onPrimaryButtonClick(fieldId, newComponents, value);
                        break;
                }

                newComponents = this.cleanErrorMessages(fieldId, newComponents);
                newComponents = this.setValues(fieldId, newComponents, value);

                this.setState({
                    application: app,
                    components: newComponents
                });
            }
        } catch (e) {
            this.logError(LogData.fromException(this.onChangeRadioGroup.name, e));
        }
    };

    private onChangeTextField = (event: any): void => {
        try {
            const {
                application,
                components
            } = this.state;

            console.log('onChangeTextField');

            if (event.target.id && event.target.id !== '' && application && components) {
                const app: IApplication = application;
                const fieldId: string[] = event.target.id.split('|');
                let fieldIndex: number = 0;
                if (fieldId[4]) {
                    fieldIndex = Number(fieldId[4]) + 1;
                }
                let newComponents: IApplicationForm = components;
                switch (fieldId[0]) {
                    case 'emailId':
                        if (fieldId && fieldId[1] && fieldId[2]) {
                            const field: any = newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                            if (!components.emailRegExpression || event.target.value.match(components.emailRegExpression)) {
                                field.data.error = false;
                                field.data.helperText = '';
                                field.value = event.target.value;
                                app.email = event.target.value;
                            }
                            else {
                                field.data.error = true;
                                field.data.helperText = field.data.errorMessageNotValid;
                            }
                        }
                        break;
                    case 'emergencyPhoneId':
                        if (!event.target.value.match(/^[0-9]*$/g)) {
                            const onlyNum = new RegExp(/([A-Za-zñ<> äÄëËïÏöÖüÜáÁéÉíÍóÓúÚýÝ'¿"#_-Ä-´°%;&¨Ñ,¡.*+?^=!:$(){}|[\]\/\\])/g);
                            event.target.value = event.target.value.replace(onlyNum, '');
                        }
                        break;
                    case 'firstNameId':
                        app.firstName = event.target.value;
                        break;
                    case 'formerLastNameId':
                        app.formerLastName = event.target.value;
                        break;
                    case 'governmentId':
                        if (fieldId && fieldId[1] && fieldId[2] && fieldId[3]) {
                            const field: any = newComponents.steps[Number(fieldId[1])]
                                .fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                            const governmentId: string = event.target.value;
                            if (governmentId.includes('_')) {
                                field.data.error = true;
                                field.data.helperText = field.data.errorMessageFormat;
                            }
                            else {
                                field.data.error = false;
                                field.data.helperText = '';
                            }
                            app.governmentId = governmentId;
                        }
                        break;
                    case 'lastNameId':
                        app.lastName = event.target.value;
                        break;
                    case 'lastNamePrefixId':
                        app.lastNamePrefix = event.target.value;
                        break;
                    case 'legalNameId':
                        app.legalName = event.target.value;
                        break;
                    case 'middleNameId':
                        app.middleName = event.target.value;
                        break;
                    case 'monthsInCountryId':
                        if (fieldId && fieldId[1] && fieldId[2] && fieldId[3]) {
                            if (!event.target.value.match(/^[0-9]*$/g)) {
                                const onlyNum = new RegExp(/([A-Za-zñ<> äÄëËïÏöÖüÜáÁéÉíÍóÓúÚýÝ'¿"#_-Ä-´°%;&¨Ñ,¡.*+?^=!:$(){}|[\]\/\\])/g);
                                event.target.value = event.target.value.replace(onlyNum, '');
                            }
                            const field: any = newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                            if (Number(event.target.value) >= 0 && Number(event.target.value) <= 9999) {
                                field.data.error = false;
                                field.data.helperText = '';
                                app.monthsInCountry = Number(event.target.value);
                            }
                            else {
                                if (Number(event.target.value) > 9999) {
                                    field.data.error = true;
                                    field.data.helperText = field.data.errorMessageRange;
                                }
                                else {
                                    field.data.error = true;
                                    field.data.helperText = field.data.errorMessageNumeric;
                                }
                            }
                        }
                        break;
                    case 'nickNameId':
                        app.nickname = event.target.value;
                        break;
                    case 'otherSourceId':
                        app.otherSource = event.target.value;
                        break;
                    case 'testScoreId':
                        const fieldGroupTestScore: any = newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])];

                        if (!app.testScores[fieldIndex]) {
                            app.testScores[fieldIndex] = {} as ITestScore;
                        }
                        app.testScores[fieldIndex].score = event.target.value;

                        if (fieldId.length > 4) {
                            fieldGroupTestScore.fields.forEach(function (field) {
                                const itemArrId: string[] = field.data.id.split('|');
                                if (fieldId[3] === itemArrId[3] && fieldId[4] === itemArrId[4]) {
                                    if (Number(event.target.value) > 9999) {
                                        field.data.error = true;
                                        field.data.helperText = field.data.errorMessageRange;
                                        field.value = event.target.value;
                                    } else {
                                        field.data.error = false;
                                        field.data.helperText = '';
                                        field.value = event.target.value;
                                    }
                                }
                            });
                        }
                        else {
                            fieldGroupTestScore.fields.forEach(function (field) {
                                const itemArrId: string[] = field.data.id.split('|');
                                if (fieldId[0] === itemArrId[0] && itemArrId.length === 1) {
                                    if (Number(event.target.value) > 9999) {
                                        field.data.error = true;
                                        field.data.helperText = field.data.errorMessageRange;
                                        field.value = event.target.value;
                                    } else {
                                        field.data.error = false;
                                        field.data.helperText = '';
                                        field.value = event.target.value;
                                    }
                                }
                            });
                        }
                        break;
                    case 'passportNumberId':
                        app.passportNumber = event.target.value;
                        break;
                    case 'phoneNumberId':
                        if (!event.target.value.match(/^[0-9]*$/g)) {
                            const onlyNum = new RegExp(/([A-Za-zñ<> äÄëËïÏöÖüÜáÁéÉíÍóÓúÚýÝ'¿"#_-Ä-´°%;&¨Ñ,¡.*+?^=!:$(){}|[\]\/\\])/g);
                            event.target.value = event.target.value.replace(onlyNum, '');
                        }
                        break;
                    case 'visaNumberId':
                        app.visaNumber = event.target.value;
                        break;
                    case 'numberOfHoursPerWeekId':
                        if (!event.target.value.match(/^[0-9]*$/g)) {
                            const onlyNum = new RegExp(/([A-Za-zñ<> äÄëËïÏöÖüÜáÁéÉíÍóÓúÚýÝ'¿"#_-Ä-´°%;&¨Ñ,¡.*+?^=!:$(){}|[\]\/\\])/g);
                            event.target.value = event.target.value.replace(onlyNum, '');
                        }
                        let fieldHoursPerWeek: any;
                        if (fieldId.length < 5) {
                            fieldHoursPerWeek = newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                        }
                        else {
                            fieldHoursPerWeek = newComponents.steps[Number(fieldId[1])].
                                fieldsGroups[Number(fieldId[2])].fields.find(x =>
                                    x.data.section === Number(fieldId[4]) &&
                                    x.data.id.substr(0, 'numberOfHoursPerWeekId'.length) ===
                                    'numberOfHoursPerWeekId');
                        }
                        if (Number(event.target.value) > 168) {
                            fieldHoursPerWeek.data.error = true;
                            fieldHoursPerWeek.data.helperText = fieldHoursPerWeek.data.errorMessageRange;
                        }
                        else {
                            fieldHoursPerWeek.data.error = false;
                            fieldHoursPerWeek.data.helperText = '';
                        }
                        break;
                    case 'numberOfWeeksPerYearId':
                        if (!event.target.value.match(/^[0-9]*$/g)) {
                            const onlyNum = new RegExp(/([A-Za-zñ<> äÄëËïÏöÖüÜáÁéÉíÍóÓúÚýÝ'¿"#_-Ä-´°%;&¨Ñ,¡.*+?^=!:$(){}|[\]\/\\])/g);
                            event.target.value = event.target.value.replace(onlyNum, '');
                        }
                        let fieldWeeksPerYear: any;
                        if (fieldId.length < 5) {
                            fieldWeeksPerYear = newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                        }
                        else {
                            fieldWeeksPerYear = newComponents.steps[Number(fieldId[1])].
                                fieldsGroups[Number(fieldId[2])].fields.find(x =>
                                    x.data.section === Number(fieldId[4]) &&
                                    x.data.id.substr(0, 'numberOfWeeksPerYearId'.length) ===
                                    'numberOfWeeksPerYearId');
                        }
                        if (Number(event.target.value) > 52) {
                            fieldWeeksPerYear.data.error = true;
                            fieldWeeksPerYear.data.helperText = fieldWeeksPerYear.data.errorMessageRange;
                        }
                        else {
                            fieldWeeksPerYear.data.error = false;
                            fieldWeeksPerYear.data.helperText = '';
                        }
                        break;
                    case 'numberOfYearsId':
                        if (!event.target.value.match(/^[0-9]*$/g)) {
                            const onlyNum = new RegExp(/([A-Za-zñ<> äÄëËïÏöÖüÜáÁéÉíÍóÓúÚýÝ'¿"#_-Ä-´°%;&¨Ñ,¡.*+?^=!:$(){}|[\]\/\\])/g);
                            event.target.value = event.target.value.replace(onlyNum, '');
                        }
                        let fieldYears: any;
                        if (fieldId.length < 5) {
                            fieldYears = newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                        }
                        else {
                            fieldYears = newComponents.steps[Number(fieldId[1])].
                                fieldsGroups[Number(fieldId[2])].fields.find(x =>
                                    x.data.section === Number(fieldId[4]) &&
                                    x.data.id.substr(0, 'numberOfYearsId'.length) ===
                                    'numberOfYearsId');
                        }
                        if (Number(event.target.value) > 99) {
                            fieldYears.data.error = true;
                            fieldYears.data.helperText = fieldYears.data.errorMessageRange;
                        }
                        else {
                            fieldYears.data.error = false;
                            fieldYears.data.helperText = '';
                        }
                        break;
                }

                console.log(fieldId);

                newComponents = this.cleanErrorMessages(fieldId, newComponents);
                newComponents = this.setValues(fieldId, newComponents, event.target.value);

                this.setState({
                    application: app,
                    components: newComponents
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onChangeTextFieldModal = (event: any): void => {
        try {

            if (event.target.id && event.target.id !== '') {
                switch (event.target.id) {
                    case 'txtEmailField':
                        const {
                            components
                        } = this.state;
                        if (components) {
                            if (!components.emailRegExpression || event.target.value.match(components.emailRegExpression)) {
                                this.setState({
                                    changeEmailText: false,
                                    emailField: event.target.value,
                                    invalidEmail: false
                                });
                            }
                            else {
                                this.setState({
                                    changeEmailText: false,
                                    emailField: event.target.value,
                                    invalidEmail: true
                                });
                            }
                        }
                        break;
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextFieldModal.name, e));
        }
    };

    private onClickButton = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                application,
                components
            } = this.state;

            if (event.currentTarget.id && event.currentTarget.id !== '' && application && components) {
                const fieldId: string[] = event.currentTarget.id.split('|');

                switch (fieldId[0]) {
                    case 'educationEtsCodeButtonId':
                        this.setState({
                            institutions: undefined,
                            openETSSearchModal: true,
                            selectedCity: undefined,
                            selectedCountry: undefined,
                            selectedEtsCode: undefined,
                            selectedFieldId: event.currentTarget.id,
                            selectedInstitutionName: undefined,
                            selectedState: undefined
                        });
                        break;
                    case 'postalCodeButtonId':
                        // Get zip code
                        let zipCode: string = '';
                        const fieldGroup: IFieldForm[] =
                            components.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields;
                        let fieldIndex: number = -1;
                        if (fieldId.length > 4) {
                            fieldIndex = fieldGroup.findIndex(x => x.data.section === Number(fieldId[4]) &&
                                x.data.id.substr(0, 'postalCodeId'.length) === 'postalCodeId');
                        }
                        else {
                            fieldIndex = fieldGroup.findIndex(x => x.data.id === 'postalCodeId');
                        }
                        if (fieldIndex > -1) {
                            zipCode = components.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].
                                fields[fieldIndex].value;
                        }

                        this.setState({
                            openAddressSearchModal: true,
                            hasSearchZipCode: false,
                            selectedFieldId: event.currentTarget.id,
                            selectedZipCode: zipCode
                        });

                        LayoutActions.setLoading(true);

                        const {
                            pageSize
                        } = this.state;

                        Requests.getAddresses(
                            0,
                            pageSize,
                            zipCode,
                            this.resolveGetAddress, this.logError);

                        const {
                            total
                        } = this.state;

                        if (total) {
                            const previousSize = pageSize;
                            // Fix 60
                            this.setState({
                                pageSize: 0
                            }, () => {
                                this.setState({
                                    pageNumber: 0,
                                    pageSize: previousSize
                                });
                            });
                        }
                        break;
                    case 'finishId':
                        // Get action of button
                        const confirmationIndex: number =
                            components.fieldsGroups.findIndex(x => x.id === 'confirmationGroup');
                        const finishButtonId: number =
                            components.fieldsGroups[confirmationIndex].fields.findIndex(x => x.data.id === 'finishId');
                        if (confirmationIndex > -1 && finishButtonId > -1) {
                            const actionUrl: string | undefined = components.fieldsGroups[confirmationIndex].fields[finishButtonId].actionUrl;
                            if (actionUrl) {
                                window.location.assign(actionUrl);
                            }
                            else {
                                window.location.assign(`${Constants.webUrl}/Admissions/Applications`);
                            }
                        }
                        break;
                    default:
                        const actionUrl: string | undefined =
                            components.steps[Number(fieldId[1])].
                                fieldsGroups[Number(fieldId[2])].
                                fields[Number(fieldId[3])].actionUrl;
                        if (actionUrl) {
                            window.location.assign(actionUrl);
                        }
                        else {
                            window.location.assign(`${Constants.webUrl}/Admissions/Applications`);
                        }
                        break;
                }
            }
        } catch (e) {
            LayoutActions.setLoading(false);
            this.logError(LogData.fromException(this.onClickButton.name, e));
        }
    };
    // #endregion Change Fields Events

    // #region Pagination
    private getRowsPerPageOptions(maxValue: number): number[] {
        const rowsPerPageOptions: number[] = [];
        try {
            this.rowsPerPageOptions.forEach(option => {
                if (option < maxValue) {
                    rowsPerPageOptions.push(option);
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.getRowsPerPageOptions.name, e));
        }
        return rowsPerPageOptions;
    }

    private onChangePage = (_event: any, page: number): void => {
        try {
            const {
                selectedInstitutionName,
                selectedEtsCode,
                selectedCity,
                selectedState,
                selectedCountry,
                pageSize
            } = this.state;

            this.setState({
                pageNumber: page
            });

            LayoutActions.setLoading(true);
            Requests.getInstitutions(
                page,
                pageSize,
                selectedInstitutionName,
                selectedEtsCode,
                selectedCity,
                selectedState,
                selectedCountry,
                this.resolveGetInstitutions, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePage.name, e));
        }
    };

    private onChangePageAddress = (_event: any, page: number): void => {
        try {
            const {
                selectedZipCode,
                pageSize
            } = this.state;

            this.setState({
                pageNumber: page
            });

            LayoutActions.setLoading(true);
            Requests.getAddresses(
                page,
                pageSize,
                selectedZipCode,
                this.resolveGetAddress, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePage.name, e));
        }
    };

    private onChangeRowsPerPage = (event: any): void => {
        try {
            this.setState({
                pageNumber: 0,
                pageSize: Number(event.target.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRowsPerPage.name, e));
        }
    };
    // #endregion Pagination

    // #region Expansion
    private onAddMore = (fieldGroup: IFieldsGroup, stepIndex: number, fieldGroupIndex: number): void => {
        try {
            if (fieldGroup.id && fieldGroup.id !== '') {
                const {
                    components,
                    errors,
                    expanded
                } = this.state;

                if (components) {
                    if (components.expansionPanel === null) {
                        components.expansionPanel = {};
                    }
                    switch (fieldGroup.id) {
                        case 'employmentGroup':
                            if (components.expansionPanel.employeeCount !== undefined) {
                                this.createNewSection(components, fieldGroup, errors, stepIndex,
                                    fieldGroupIndex, components.expansionPanel.employeeCount, 'employmentErrosId', expanded);

                                components.expansionPanel.employeeCount++;
                            }
                            else {
                                this.createNewSection(components, fieldGroup, errors, stepIndex,
                                    fieldGroupIndex, 0, 'employmentErrosId', expanded);

                                components.expansionPanel.employeeCount = 1;
                            }
                            break;
                        case 'programOfStudyGroup':
                            if (components.expansionPanel.programsCount !== undefined) {
                                this.createNewSection(components, fieldGroup, errors, stepIndex,
                                    fieldGroupIndex, components.expansionPanel.programsCount, 'programOfStudydErrorsId', expanded);

                                components.expansionPanel.programsCount++;
                            }
                            else {
                                this.createNewSection(components, fieldGroup, errors, stepIndex,
                                    fieldGroupIndex, 0, 'programOfStudydErrorsId', expanded);

                                components.expansionPanel.programsCount = 1;
                            }
                            break;
                        case 'phoneGroup':
                            if (components.expansionPanel.phoneCount !== undefined) {
                                this.createNewSection(components, fieldGroup, errors, stepIndex,
                                    fieldGroupIndex, components.expansionPanel.phoneCount, 'phoneErrorsId', expanded);

                                components.expansionPanel.phoneCount++;
                            }
                            else {
                                this.createNewSection(components, fieldGroup, errors, stepIndex,
                                    fieldGroupIndex, 0, 'phoneErrorsId', expanded);

                                components.expansionPanel.phoneCount = 1;
                            }
                            break;
                        case 'testScoreGroup':
                            const initialGroupLengthTS: number = fieldGroup.fields.length;

                            this.createNewSection(components, fieldGroup, errors, stepIndex,
                                fieldGroupIndex, initialGroupLengthTS, 'testScoreErrorsId', expanded);

                            const finalGroupLengthTS: number = fieldGroup.fields.length;
                            const newSetTS: IFieldForm[] = fieldGroup.fields.slice(initialGroupLengthTS, finalGroupLengthTS);
                            const parentDropDownTS: IFieldForm = newSetTS[newSetTS.findIndex(e => e.childField !== null)];
                            const childDropDownTS:
                                IFieldForm =
                                newSetTS[newSetTS.findIndex(e => e.data.id.split('|')[0] === parentDropDownTS.childField)];
                            childDropDownTS.data.options = [];
                            parentDropDownTS.childField = childDropDownTS.data.id;

                            if (components.expansionPanel.testScoresCount !== undefined) {
                                components.expansionPanel.testScoresCount++;
                            }
                            else {
                                components.expansionPanel.testScoresCount = 1;
                            }
                            break;
                        case 'emergencyContactGroup':
                            if (errors[stepIndex].groupErrors[fieldGroupIndex].sectionErrors.length < 1) {
                                if (components.expansionPanel.emergencyContactsCount !== undefined) {
                                    // Error id is not sent because errorId for this group will be excluded
                                    this.createNewSection(components, fieldGroup, errors, stepIndex,
                                        fieldGroupIndex, components.expansionPanel.emergencyContactsCount, '', expanded);

                                    components.expansionPanel.emergencyContactsCount++;
                                }
                                else {
                                    this.createNewSection(components, fieldGroup, errors, stepIndex,
                                        fieldGroupIndex, 0, '', expanded);

                                    components.expansionPanel.emergencyContactsCount = 1;
                                }
                            }
                            break;
                        case 'addressInformationGroup':
                            if (components.expansionPanel.addressessCount !== undefined) {
                                // Error id is not sent because errorId for this group will be excluded
                                this.createNewSection(components, fieldGroup, errors, stepIndex,
                                    fieldGroupIndex, components.expansionPanel.addressessCount, '', expanded);

                                components.expansionPanel.addressessCount++;
                            }
                            else {
                                this.createNewSection(components, fieldGroup, errors, stepIndex,
                                    fieldGroupIndex, 0, '', expanded);

                                components.expansionPanel.addressessCount = 1;
                            }
                            break;
                        case 'educationGroup':
                            if (components.expansionPanel.educationCount !== undefined) {
                                // Error id is not sent because errorId for this group will be excluded
                                this.createNewSection(components, fieldGroup, errors, stepIndex,
                                    fieldGroupIndex, components.expansionPanel.educationCount, '', expanded);

                                components.expansionPanel.educationCount++;
                            }
                            else {
                                this.createNewSection(components, fieldGroup, errors, stepIndex,
                                    fieldGroupIndex, 0, '', expanded);

                                components.expansionPanel.educationCount = 1;
                            }
                            break;
                        case 'activityGroup':
                            const initialGroupLength: number = fieldGroup.fields.length;

                            if (components.expansionPanel.activityCount !== undefined) {
                                // Error id is not sent because errorId for this group will be excluded
                                this.createNewSection(components, fieldGroup, errors, stepIndex,
                                    fieldGroupIndex, components.expansionPanel.activityCount, '', expanded);
                            }
                            else {
                                this.createNewSection(components, fieldGroup, errors, stepIndex,
                                    fieldGroupIndex, 0, '', expanded);
                            }

                            const finalGroupLength: number = fieldGroup.fields.length;
                            const newSet: IFieldForm[] = fieldGroup.fields.slice(initialGroupLength, finalGroupLength);
                            const parentDropDown: IFieldForm = newSet[newSet.findIndex(e => e.childField !== null)];
                            const childDropDown: IFieldForm = newSet[newSet.findIndex(e => e.data.id.split('|')[0] === parentDropDown.childField)];
                            childDropDown.data.options = [];
                            parentDropDown.childField = childDropDown.data.id;

                            if (components.expansionPanel.activityCount !== undefined) {
                                components.expansionPanel.activityCount++;
                            }
                            else {
                                components.expansionPanel.activityCount = 1;
                            }
                            break;
                        case 'relativesGroup':
                            if (components.expansionPanel.relativesCount !== undefined) {
                                // Error id is not sent because errorId for this group will be excluded
                                this.createNewSection(components, fieldGroup, errors, stepIndex,
                                    fieldGroupIndex, components.expansionPanel.relativesCount, '', expanded);

                                components.expansionPanel.relativesCount++;
                            }
                            else {
                                this.createNewSection(components, fieldGroup, errors, stepIndex,
                                    fieldGroupIndex, 0, '', expanded);

                                components.expansionPanel.relativesCount = 1;
                            }
                            break;
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddMore.name, e));
        }
    };

    private onAddDeleteButton =
        (fieldGroup: IFieldsGroup, stepIndex: number, fieldGroupIndex: number, groupLength: number, sectionNumber: number): void => {
            try {
                const data: IDataForm = {
                    id: `deleteIcon|${stepIndex}|${fieldGroupIndex}|${groupLength}|${sectionNumber}`,
                    modified: true,
                    section: sectionNumber
                };

                const deleteButton: IFieldForm = {
                    componentType: 'DeleteIconButton',
                    data: data,
                    isNumeric: false,
                    isRequired: false,
                    onClick: this.onDeleteItem,
                    value: ''
                };

                fieldGroup.fields.push(deleteButton);
            }
            catch (e) {
                this.logError(LogData.fromException(this.onAddDeleteButton.name, e));
            }
        };

    private onChangeExpansionPanel = (panelId: string) => (): void => {
        try {
            this.setState({
                expanded: panelId
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeExpansionPanel.name, e));
        }
    };

    private onDeleteItem = (event: any): void => {
        try {
            const {
                errors,
                components
            } = this.state;

            if (components) {
                if (event.currentTarget.id) {
                    const buttonId: string[] = event.currentTarget.id.split('|');
                    const componentName: string = components.steps[buttonId[1]].fieldsGroups[buttonId[2]].id;
                    const fields: IFieldForm[] = components.steps[buttonId[1]].fieldsGroups[buttonId[2]].fields;
                    if (fields) {
                        let fieldIndex: number;
                        do {
                            fieldIndex = fields.findIndex(x => x.data.section === Number(buttonId[4]));
                            if (fieldIndex > -1) {
                                fields.splice(fieldIndex, 1);
                            }
                        } while (fieldIndex > -1);
                    }
                    components.steps[Number(buttonId[1])].fieldsGroups[Number(buttonId[2])].fields = fields;

                    // Delete section from sectionErrors
                    const sectionIndex = errors[Number(buttonId[1])].groupErrors[Number(buttonId[2])].sectionErrors.findIndex(
                        section => section.sectionIndex === Number(buttonId[4]));
                    if (sectionIndex > -1) {
                        errors[Number(buttonId[1])].groupErrors[Number(buttonId[2])].sectionErrors.splice(sectionIndex, 1);
                    }

                    switch (componentName) {
                        case 'phoneGroup':
                            // Search for primary selected in phone group
                            const primaryPhoneField: IFieldForm[] = components.steps[buttonId[1]].fieldsGroups[buttonId[2]]
                                .fields.filter(x => x.data.id.substr(0, 'primaryPhoneId'.length) === 'primaryPhoneId' && x.value === '1');
                            // If doesn't exist, select first item as primary
                            if (primaryPhoneField.length === 0) {
                                const firstPrimaryPhoneField: number = components.steps[buttonId[1]].fieldsGroups[buttonId[2]]
                                    .fields.findIndex(x => x.data.id === 'primaryPhoneId');
                                if (firstPrimaryPhoneField > -1) {
                                    components.steps[buttonId[1]].fieldsGroups[buttonId[2]]
                                        .fields[firstPrimaryPhoneField].value = '1';
                                }
                            }
                            break;
                        case 'testScoreGroup':
                            const {
                                application
                            } = this.state;
                            application.testScores[Number(buttonId[3]) + 1] = {};
                            this.setState({
                                application: application
                            });
                            break;
                    }
                    const fieldGroup: IFieldsGroup =
                        components.steps[buttonId[1]].fieldsGroups[buttonId[2]];
                    let maxAdd: number;
                    if (fieldGroup.maximumAllowed) {
                        maxAdd = Number(fieldGroup.maximumAllowed) - 1;
                    }
                    else {
                        maxAdd = 99;
                    }
                    if (errors[buttonId[1]].groupErrors[buttonId[2]].sectionErrors.length < maxAdd) {
                        // Add more button if it was remove
                        components.steps[buttonId[1]].fieldsGroups[buttonId[2]].isMultiple = true;
                    }
                }

                this.setState({
                    components: components,
                    errors: errors
                });

                event.stopPropagation();
                event.preventDefault();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteItem.name, e));
        }
    };
    // #endregion Expansion

    // #region ReCaptcha
    private onRecaptchaChange = (token: any): void => {
        try {
            this.setState({
                reCaptchaError: !Boolean(token)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRecaptchaChange.name, e));
        }
    };

    private onReCaptchaError = (): void => {
        try {
            this.setState({
                reCaptchaError: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onReCaptchaError.name, e));
        }
    };
    // #endregion ReCaptcha
    // #endregion Events

    private onPagoRefer = (): void => {
        try {
            const {
                applicationId
            } = this.state;
    
            console.log("onPagoRefer");
    
            if (applicationId) {
                LayoutActions.showPageLoader();
    
                console.log("Imprimir Referencia");
                var uricomplement = `applicationId=${(applicationId)}`;
                console.log(uricomplement)
                var complement = `Applications/GetPagoReferAdmision?${uricomplement}`;
                var TourlAction = `${Constants.webUrl}/${complement}`;
                console.log(TourlAction as string)
                location.href = TourlAction;
    
                LayoutActions.hidePageLoader();
            }
    
        }
        catch (e) {
            this.logError(LogData.fromException(this.onPagoRefer.name, e));
        }
    };

    // #region Functions
    private assignFieldValue =
        (fieldGroup: IFieldForm[], fieldId: string[], fieldIdName: string, isSectionField: boolean, value?: any): void => {
            const {
                components
            } = this.state;

            if (components) {
                let fieldIndex: number = 1;
                if (isSectionField) {
                    fieldIndex = fieldGroup.findIndex(x => x.data.section === Number(fieldId[4]) &&
                        x.data.id.substr(0, fieldIdName.length) === fieldIdName);
                }
                else {
                    fieldIndex = fieldGroup.findIndex(x => x.data.id === fieldIdName);
                }
                if (fieldIndex > -1) {
                    components.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].
                        fields[fieldIndex].value = value;
                }
            }
        };

    private cleanErrorMessages = (fieldId: string[], newComponents: IApplicationForm): IApplicationForm => {
        if (fieldId && fieldId[1] && fieldId[2] && fieldId[3]) {
            let field: IFieldForm | undefined;

            if (fieldId.length > 4) {
                const fieldGroup: IFieldForm[] =
                    newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields;
                field =
                    fieldGroup.find(x => x.data.id.split('|')[3] === fieldId[3] && x.data.id.split('|')[4] === fieldId[4]);
            }
            else {
                field =
                    newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
            }

            if (field !== undefined) {
                if ((field.data.errorMessageDuplicate === undefined ||
                    field.data.errorMessageDuplicate === null) &&
                    (field.data.errorMessageFormat === undefined ||
                        field.data.errorMessageFormat === null) &&
                    (field.data.errorMessageNotValid === undefined ||
                        field.data.errorMessageNotValid === null) &&
                    (field.data.errorMessageNumeric === undefined ||
                        field.data.errorMessageNumeric === null) &&
                    (field.data.errorMessagePrimary === undefined ||
                        field.data.errorMessagePrimary === null) &&
                    (field.data.errorMessageRange === undefined ||
                        field.data.errorMessageRange === null)) {
                    field.data.error = false;
                    field.data.helperText = '';
                }
            }
        }
        return newComponents;
    };

    private copyField =
        (id: string, stepIndex: number, fieldGroupIndex: number, groupLength: number, sectionNumber: number, components: IApplicationForm): IApplicationForm => {
            try {
                const fields: any =
                    components.steps[stepIndex].fieldsGroups[fieldGroupIndex].fields;
                const fieldIndex: number =
                    fields.findIndex(x => x.data.id === id);

                const copiedField: IFieldForm = fields[fieldIndex];
                const newField: IFieldForm = JSON.parse(JSON.stringify(copiedField));

                newField.data.id =
                    `${id}|${stepIndex}|${fieldGroupIndex}|${groupLength}|${sectionNumber}`;
                let exist: boolean = false;
                if (copiedField.componentType === 'Dropdown') {
                    if (copiedField.default && copiedField.data.options) {
                        copiedField.data.options.forEach(option => {
                            if (option.value.toString() === copiedField.default.toString()) {
                                exist = true;
                            }
                        });
                    }
                    if (exist) {
                        newField.value = copiedField.default;
                    }
                    else {
                        newField.value = '';
                    }
                }
                else {
                    newField.value = copiedField.default ? copiedField.default : '';
                }
                newField.data.error = false;
                newField.data.helperText = '';
                newField.data.modified = true;
                newField.data.section = sectionNumber;
                fields.push(newField);
                components.steps[stepIndex].fieldsGroups[fieldGroupIndex].fields = fields;
            }
            catch (e) {
                this.logError(LogData.fromException(this.copyField.name, e));
            }
            return components;
        };

    private createNewSection =
        (components: IApplicationForm, fieldGroup: IFieldsGroup, errors: IApplicationErrors[], stepIndex: number, fieldGroupIndex: number, count: number, errorTexId: string, expanded):
            void => {
            const groupLength: number = fieldGroup.fields.length;
            /* Initialization of SectionErrors in errors state variable and set of
             * SectionIndex = sectionErrors.length -1; <Array.push returns the length of the new array>
             */
            const sectionIndex = errors[stepIndex].groupErrors[fieldGroupIndex].sectionErrors.push(
                { sectionIndex: count, isSectionError: false, fieldsErrors: [] }) - 1;

            fieldGroup.fields.forEach((field, i) => {
                if (!field.data.modified) {
                    if (field.data.id !== errorTexId) {
                        components = this.copyField(field.data.id, stepIndex,
                            fieldGroupIndex, (groupLength - 1) + i, count, components);
                    }
                    // Initialization of FieldErrors in errors state variable
                    errors[stepIndex].groupErrors[fieldGroupIndex].sectionErrors[sectionIndex].fieldsErrors.push(
                        { fieldId: field.data.id, isFieldError: false }
                    );
                }
            });

            this.onAddDeleteButton(fieldGroup, stepIndex, fieldGroupIndex, (groupLength - 1), count);

            let maxAdd: number;
            if (fieldGroup.maximumAllowed) {
                maxAdd = Number(fieldGroup.maximumAllowed) - 1;
            }
            else {
                maxAdd = 99;
            }
            if (errors && errors[stepIndex].groupErrors[fieldGroupIndex].sectionErrors.length < maxAdd) {
                fieldGroup.isMultiple = true;
            }
            else {
                fieldGroup.isMultiple = false;
            }

            this.setState({
                components: components,
                errors: errors,
                expanded: fieldGroup.isExpansionPanel ?
                    `panel|${stepIndex}|${fieldGroupIndex}|${count}` : expanded
            });
        };

    private reviewRequiredFields = (): boolean => {
        const {
            application,
            components,
            errors
        } = this.state;

        let isValid: boolean = true;
        if (components) {
            let programsValid: boolean = true;
            let testScoresValid: boolean = true;
            let validPhones: boolean = true;
            let isValidEmploymentSection: boolean = true;
            let emergencyContactsValid: boolean = true;
            let ipedsValid: boolean = true;
            let addressValid: boolean = true;
            let userDefinedValid: boolean = true;
            let educationValid: boolean = true;
            let activityValid: boolean = true;
            let relativeValid: boolean = true;
            let residencyValid: boolean = true;

            let ids: string[] = [];
            let fieldSectionIndex: number;
            let fieldId: string;
            let sectionErrorIndex: number;
            let fieldErrorIndex: number;

            components.steps.forEach((step, stepIndex) => {
                fieldErrorIndex = -1;
                step.fieldsGroups.forEach((fieldsGroup, groupIndex) => {
                    fieldsGroup.fields.forEach(field => {
                        if (field.isRequired && !field.value) {
                            field.data.error = true;
                            field.data.helperText = field.data.errorMessageRequired;
                            isValid = false;
                        } else if (field.isNumeric && String(field.value).length > 0 && isNaN(Number(field.value))) {
                            field.data.error = true;
                            field.data.helperText = field.data.errorMessageNumeric;
                            isValid = false;
                        } else if (field.isRequired && field.value && field.componentType === 'DatePicker') {
                            const date = moment(field.value, 'YYYY-MM-DD');
                            const isDateValid: boolean = date.isValid();
                            const minDate = new Date(moment().add(-100, 'years').toDate());
                            const maxDate = new Date(moment().add(+100, 'years').toDate());

                            const isDateInRange: boolean =
                                new Date(moment(field.value).toDate()) >= minDate &&
                                new Date(moment(field.value).toDate()) <= maxDate;
                            if (!isDateValid || !isDateInRange) {
                                field.value = undefined;
                                field.data.error = true;
                                field.data.helperText = field.data.errorMessageRequired;
                                isValid = false;
                            }
                            if (isDateValid && isDateInRange) {
                                field.data.error = false;
                                field.data.helperText = '';
                            }
                        } else if (field.value && field.componentType === 'DatePicker') {
                            const date = moment(field.value, 'YYYY-MM-DD');
                            const isDateValid: boolean = date.isValid();
                            const minDate = new Date(moment().add(-100, 'years').toDate());
                            const maxDate = new Date(moment().add(+100, 'years').toDate());

                            const isDateInRange: boolean =
                                new Date(moment(field.value).toDate()) >= minDate &&
                                new Date(moment(field.value).toDate()) <= maxDate;
                            if (isDateValid && !isDateInRange) {
                                field.value = undefined;
                                field.data.error = true;
                                field.data.helperText = field.data.errorMessageRequired;
                                isValid = false;
                            }
                        }
                        else if (field.parentId == 'governmentIdGroup' && field.data.error) {
                            isValid = false;
                        }
                        else {
                            field.data.error = false;
                            field.data.helperText = '';
                        }
                    });

                    // init counts
                    if (!components.expansionPanel) {
                        components.expansionPanel = {};
                        components.expansionPanel.activityCount = components.expansionPanel.activityCount ?
                            components.expansionPanel.activityCount : 0;

                        components.expansionPanel.addressessCount = components.expansionPanel.addressessCount ?
                            components.expansionPanel.addressessCount : 0;

                        components.expansionPanel.educationCount = components.expansionPanel.educationCount ?
                            components.expansionPanel.educationCount : 0;

                        components.expansionPanel.emergencyContactsCount = components.expansionPanel.emergencyContactsCount ?
                            components.expansionPanel.emergencyContactsCount : 0;

                        components.expansionPanel.employeeCount = components.expansionPanel.employeeCount ?
                            components.expansionPanel.employeeCount : 0;

                        components.expansionPanel.phoneCount = components.expansionPanel.phoneCount ?
                            components.expansionPanel.phoneCount : 0;

                        components.expansionPanel.programsCount = components.expansionPanel.programsCount ?
                            components.expansionPanel.programsCount : 0;

                        components.expansionPanel.relativesCount = components.expansionPanel.relativesCount ?
                            components.expansionPanel.relativesCount : 0;

                        components.expansionPanel.testScoresCount = components.expansionPanel.testScoresCount ?
                            components.expansionPanel.testScoresCount : 0;
                    }

                    // #region Components Validations

                    // #region Programs
                    if (fieldsGroup.id === 'programOfStudyGroup') {
                        programsValid = this.reviewPrograms(fieldsGroup);
                        const textErrorIndex: number = fieldsGroup.fields.findIndex(x => x.data.id === 'programOfStudydErrorsId');
                        if (!programsValid) {
                            if (textErrorIndex > -1) {
                                fieldsGroup.fields[textErrorIndex].data.error = true;
                            }
                        }
                        else {
                            if (textErrorIndex > -1) {
                                fieldsGroup.fields[textErrorIndex].data.error = false;
                                fieldsGroup.fields[textErrorIndex].data.label = '';
                            }
                        }
                    }
                    // #endregion Programs

                    // #region TestScores
                    if (fieldsGroup.id === 'testScoreGroup') {
                        const filteredControls: IFieldForm[] =
                            fieldsGroup.fields.filter(f => !(f.data.id.includes('deleteIcon') || f.data.id.includes('testScoreErrorsId')));
                        const groupedControls: any = filteredControls.reduce(function (r, a) {
                            const key: string | undefined = a.data.id.split('|')[4];
                            let index: number = 0;
                            if (!key) {
                                index = 0;
                            } else {
                                index = Number(key) + 1;
                            }
                            r[index] = r[index] || [];
                            r[index].push(a);
                            return r;
                        }, Object.create(null));

                        const messageErrorIndex: number = fieldsGroup.fields.findIndex(x => x.data.id === 'testScoreErrorsId');
                        testScoresValid = this.reviewTestScores(groupedControls);
                        if (!testScoresValid) {
                            if (messageErrorIndex > -1) {
                                fieldsGroup.fields[messageErrorIndex].data.error = true;
                                fieldsGroup.fields[messageErrorIndex].data.label = fieldsGroup.errorMessageDuplicate;
                            }
                        }
                        else {
                            if (messageErrorIndex > -1) {
                                fieldsGroup.fields[messageErrorIndex].data.error = false;
                                fieldsGroup.fields[messageErrorIndex].data.label = '';
                            }
                        }

                        // Validate testscore completeness
                        if (testScoresValid && !filteredControls.some(f => f.data.error === true)) {
                            testScoresValid = this.reviewTestScoreCompleteness(groupedControls);

                            if (!testScoresValid) {
                                if (messageErrorIndex > -1) {
                                    fieldsGroup.fields[messageErrorIndex].data.error = true;
                                    fieldsGroup.fields[messageErrorIndex].data.label = fieldsGroup.errorMessageRequired;
                                }
                            }
                            else {
                                if (messageErrorIndex > -1) {
                                    fieldsGroup.fields[messageErrorIndex].data.error = false;
                                    fieldsGroup.fields[messageErrorIndex].data.label = '';
                                }
                            }
                        }

                        // removes empty test scores
                        for (let i: number = application.testScores.length; i >= 0; i--) {
                            if (application.testScores[i]) {
                                if (!application.testScores[i].id) {
                                    application.testScores.splice(i, 1);
                                }
                            } else {
                                application.testScores.splice(i, 1);
                            }
                        }
                    }
                    // #endregion TestScores

                    // #region Phones
                    if (fieldsGroup.id === 'phoneGroup') {
                        validPhones = this.reviewPhoneGroup(fieldsGroup);
                        const textErrorIndex: number = fieldsGroup.fields.findIndex(x => x.data.id === 'phoneErrorsId');
                        if (!validPhones) {
                            if (textErrorIndex > -1) {
                                fieldsGroup.fields[textErrorIndex].data.error = true;
                            }
                        }
                        else {
                            if (textErrorIndex > -1) {
                                fieldsGroup.fields[textErrorIndex].data.error = false;
                                fieldsGroup.fields[textErrorIndex].data.label = '';
                            }
                        }
                    }
                    // #endregion Phones

                    // #region Ipeds
                    if (fieldsGroup.id === 'ipedsGroup') {
                        ipedsValid = this.reviewIpeds(fieldsGroup);
                        const textErrorIndex: number = fieldsGroup.fields.findIndex(x => x.data.id === 'ipedsErrorsId');
                        if (!ipedsValid) {
                            if (textErrorIndex > -1) {
                                fieldsGroup.fields[textErrorIndex].data.error = true;
                            }
                        }
                        else {
                            if (textErrorIndex > -1) {
                                fieldsGroup.fields[textErrorIndex].data.error = false;
                                fieldsGroup.fields[textErrorIndex].data.label = '';
                            }
                        }
                    }
                    // #endregion Ipeds

                    // #region Employment
                    if (fieldsGroup.id === 'employmentGroup') {
                        isValidEmploymentSection = this.reviewEmployment(fieldsGroup);
                        const fieldsById =
                            fieldsGroup.fields.filter(x =>
                                x.data.id.substr(0, 'employmentErrosId'.length) === 'employmentErrosId');
                        fieldsById.forEach(field => {
                            if (!isValidEmploymentSection) {
                                field.data.error = true;
                            }
                            else {
                                field.data.error = false;
                                field.data.label = '';
                            }
                        });
                        isValid = !isValidEmploymentSection ? false : isValid;
                    }
                    // #endregion Employment

                    // #region EmergencyContacts
                    if (fieldsGroup.id === 'emergencyContactGroup') {
                        emergencyContactsValid = this.reviewEmergencyContacts(fieldsGroup);
                        isValid = !emergencyContactsValid ? false : isValid;
                    }
                    // #endregion EmergencyContacts

                    // #region Address
                    if (fieldsGroup.id === 'addressInformationGroup') {
                        addressValid = this.reviewAddress(fieldsGroup);
                        isValid = !addressValid ? false : isValid;
                    }
                    // #endregion Address

                    // #region UserDefinedFields
                    if (fieldsGroup.isCustom) {
                        userDefinedValid = this.reviewUserDefined(fieldsGroup);
                        isValid = !userDefinedValid ? false : isValid;
                    }
                    // #endregion UserDefinedFields

                    // #region Education
                    if (fieldsGroup.id === 'educationGroup') {
                        educationValid = this.reviewEducation(fieldsGroup);
                        isValid = !educationValid ? false : isValid;
                    }
                    // #endregion Education

                    // #region Activities
                    if (fieldsGroup.id === 'activityGroup') {
                        activityValid = this.reviewActivities(fieldsGroup);
                    }
                    // #endregion Activities

                    // #region Relatives
                    if (fieldsGroup.id === 'relativesGroup') {
                        relativeValid = this.reviewRelatives(fieldsGroup);
                        isValid = !relativeValid ? false : isValid;
                    }
                    // #endregion Relatives

                    // #region Residency
                    if (fieldsGroup.id === 'residencyGroup') {
                        residencyValid = this.reviewResidency(fieldsGroup);
                        isValid = !residencyValid ? false : isValid;
                    }
                    // #endregion Residency

                    // #region Campuses
                    if (fieldsGroup.id === 'campusGroup') {
                        this.reviewCampus(fieldsGroup);
                    }
                    // #endregion Campuses

                    // #region Academic Interest
                    if (fieldsGroup.id === 'interestGroup') {
                        this.reviewAcademicInterest(fieldsGroup);
                    }
                    // #endregion Academic Interest
                    // #endregion Components Validations
                    // Group errors
                    fieldsGroup.fields.forEach(field => {
                        // Set errors in copied fields inside the SectionErrors array of errors state variable
                        if (field.data.modified) {
                            ids = field.data.id.split('|');
                            if (ids[0] !== 'deleteIcon') {
                                // Gets the actual Section index from the field id
                                fieldSectionIndex = Number(ids[4]);
                                // Gets the actual Field id
                                fieldId = ids[0];
                                // Gets the index of the sectionErrors array
                                sectionErrorIndex = errors[stepIndex].groupErrors[groupIndex].sectionErrors.findIndex(section =>
                                    section.sectionIndex === fieldSectionIndex);
                                if (sectionErrorIndex > -1) {
                                    // Gets the index of the fieldErrors array
                                    fieldErrorIndex = errors[stepIndex].groupErrors[groupIndex].sectionErrors[sectionErrorIndex].fieldsErrors
                                        .findIndex(field => field.fieldId === fieldId);
                                    if (fieldErrorIndex > -1) {
                                        // Sets the value of the error
                                        errors[stepIndex].groupErrors[groupIndex].sectionErrors[sectionErrorIndex].fieldsErrors[fieldErrorIndex]
                                            .isFieldError = field.data.error ? field.data.error : false;
                                    }
                                }
                            }
                        }
                        else {
                            // Set errors in first fields inside the firstSectionErrors array state variable
                            fieldErrorIndex = errors[stepIndex].groupErrors[groupIndex].firstSectionErrors.firstFieldsErrors.findIndex(fieldError =>
                                fieldError.fieldId === field.data.id);
                            // Checks if the field is already in firstFieldsErrors
                            if (fieldErrorIndex > -1) {
                                errors[stepIndex].groupErrors[groupIndex].firstSectionErrors.firstFieldsErrors[fieldErrorIndex].isFieldError =
                                    field.data.error ? field.data.error : false;
                            } else {
                                errors[stepIndex].groupErrors[groupIndex].firstSectionErrors.firstFieldsErrors.push(
                                    { fieldId: field.data.id, isFieldError: field.data.error ? field.data.error : false }
                                );
                            }
                        }
                    });

                    errors[stepIndex].groupErrors[groupIndex].firstSectionErrors.isFirstSectionErrors =
                        errors[stepIndex].groupErrors[groupIndex].firstSectionErrors.firstFieldsErrors.some(fieldError => fieldError.isFieldError);

                    errors[stepIndex].groupErrors[groupIndex].sectionErrors.forEach(sectionError => {
                        sectionError.isSectionError = sectionError.fieldsErrors.some(fieldError => fieldError.isFieldError);
                    });

                    errors[stepIndex].groupErrors[groupIndex].isGroupError =
                        fieldsGroup.fields.some(field => field.data.error ? field.data.error : false);
                });
                errors[stepIndex].isStepError = errors[stepIndex].groupErrors.some(groupError => groupError.isGroupError);
            });

            // Multiple components validations
            isValid = programsValid && testScoresValid &&
                validPhones && ipedsValid && addressValid &&
                activityValid && relativeValid &&
                isValid;

            const allErrors: IGroupErrors[] = [];
            const especificErrors: IGroupErrors[] = [];
            if (!isValid) {
                errors.forEach(step => {
                    step.groupErrors.forEach(groupError => {
                        if (groupError.isGroupError) {
                            if (
                                // groupError.groupId === 'emergencyContactGroup' ||
                                (groupError.groupId === 'educationGroup' && application.education.length === 0) ||
                                groupError.groupId === 'activityGroup' ||
                                groupError.groupId === 'residencyGroup') {
                                especificErrors.push(groupError);
                            }
                            else {
                                allErrors.push(groupError);
                            }
                        }
                    });
                });
                if (allErrors.length === 0) {
                    isValid = programsValid && testScoresValid && validPhones &&
                        ipedsValid && addressValid &&
                        isValidEmploymentSection && emergencyContactsValid &&
                        educationValid && activityValid && relativeValid && residencyValid;
                }
            }

            this.setState({
                components: components,
                errors: errors
            });
        }
        return isValid;
    };

    private setApplicationValues = (fieldId: string, fieldDefault: any): void => {
        const {
            application
        } = this.state;

        console.log('setApplicationValues');

        switch (fieldId) {
            case 'attendStatusId':
                application.collegeAttendStatus = fieldDefault;
                break;
            case 'campusId':
                application.campuses = fieldDefault;
                break;
            case 'counselorId':
                application.counselorId = fieldDefault;
                break;
            case 'countryOfBirthId':
                application.countryOfBirth = fieldDefault;
                break;
            case 'ethnicityId':
                application.ethnicity = fieldDefault;
                break;
            case 'genderId':
                application.gender = fieldDefault;
                break;
            case 'maritalyId':
                application.maritalStatus = fieldDefault;
                break;
            case 'passportCountryId':
                application.passportCountryId = fieldDefault;
                break;
            case 'primaryCitizenshipId':
                application.primaryCitizenship = fieldDefault;
                break;
            case 'primaryLanguageId':
                application.primaryLanguage = fieldDefault;
                break;
            case 'prefixId':
                application.prefix = fieldDefault;
                break;
            case 'religionId':
                application.religion = fieldDefault;
                break;
            case 'secondayCitizenshipId':
                application.secondaryCitizenship = fieldDefault;
                break;
            case 'secondaryLanguageId':
                application.secondaryLanguage = fieldDefault;
                break;
            case 'sessionPeriodId':
                application.period = fieldDefault;
                break;
            case 'sourceId':
                application.sourceId = fieldDefault;
                break;
            case 'suffixId':
                application.suffix = fieldDefault;
                break;
            case 'veteranId':
                application.veteranStatus = fieldDefault;
                break;
            case 'visaId':
                application.visa = fieldDefault;
                break;
            case 'visaCountryId':
                application.visaCountryId = fieldDefault;
                break;
            case 'extraCurricularActivityId':
                application.isInterestedInExtracurricular = fieldDefault;
                break;
            case 'financialAidId':
                application.isInterestedInFinancialAid = fieldDefault;
                break;
            case 'retiredId':
                application.isRetired = fieldDefault;
                break;
            case 'seekingDegreeId':
                application.isSeekingDegree = fieldDefault;
                break;
            case 'policyCheckboxId':
                application.policy = fieldDefault;
                break;
            case 'dateOfBirthId':
                application.dateOfBirth = fieldDefault;
                break;
            case 'visaExpirationDateId':
                application.visaExpiration = fieldDefault;
                break;
            case 'passportExpirationDateId':
                application.passportExpiration = fieldDefault;
                break;
            case 'emailId':
                application.email = fieldDefault;
                break;
            case 'firstNameId':
                application.firstName = fieldDefault;
                break;
            case 'formerLastNameId':
                application.formerLastName = fieldDefault;
                break;
            case 'governmentId':
                application.governmentId = fieldDefault;
                break;
            case 'lastNameId':
                application.lastName = fieldDefault;
                break;
            case 'lastNamePrefixId':
                application.lastNamePrefix = fieldDefault;
                break;
            case 'legalNameId':
                application.legalName = fieldDefault;
                break;
            case 'middleNameId':
                application.middleName = fieldDefault;
                break;
            case 'monthsInCountryId':
                application.monthsInCountry = fieldDefault;
                break;
            case 'nickNameId':
                application.nickname = fieldDefault;
                break;
            case 'otherSourceId':
                application.otherSource = fieldDefault;
                break;
            case 'passportNumberId':
                application.passportNumber = fieldDefault;
                break;
            case 'visaNumberId':
                application.visaNumber = fieldDefault;
                break;
            default:
                break;
        }

        this.setState({
            application: fieldDefault
        });
    };

    private setValues = (fieldId: string[], newComponents: IApplicationForm, value: any): IApplicationForm => {
        if (fieldId.length > 4) {
            const fieldGroup: IFieldForm[] =
                newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields;
            const field: IFieldForm | undefined =
                fieldGroup.find(x => x.data.id.split('|')[3] === fieldId[3] && x.data.id.split('|')[4] === fieldId[4]);
            if (field) {
                field.value = value;
            }
        }
        else {
            const field: IFieldForm =
                newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
            if (fieldId) {
                field.value = value;
            }
            if (fieldId[0]==='governmentId')
            {
                console.log('field disabled');
                field.disabled=true;
            }
        }
        return newComponents;
    };

    // #region Review Information
    private reviewActivities = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            application,
            components
        } = this.state;

        let isValid = true;

        if (components && components.expansionPanel.activityCount === undefined) {
            components.expansionPanel.activityCount = 0;
        }

        if (components && components.expansionPanel.activityCount !== undefined && components.expansionPanel.activityCount > -1) {
            let activityList: IApplicationActivity[] = [];
            const activity: IApplicationActivity = {};

            let activityTypefield: IFieldForm | undefined;
            if (activityTypefield = fieldsGroup.fields.find(x => x.data.id === 'activityTypeId')) {
                activity.activityType = activityTypefield.value;
            }
            let activityField: IFieldForm | undefined;
            if (activityField = fieldsGroup.fields.find(x => x.data.id === 'activityId')) {
                activity.activity = activityField.value;
            }
            let positionHeldField: IFieldForm | undefined;
            if (positionHeldField = fieldsGroup.fields.find(x => x.data.id === 'positionHeldId')) {
                activity.position = positionHeldField.value;
            }
            let numberOfHoursPerWeekField: IFieldForm | undefined;
            if (numberOfHoursPerWeekField = fieldsGroup.fields.find(x => x.data.id === 'numberOfHoursPerWeekId')) {
                activity.hoursPerWeek = numberOfHoursPerWeekField.value;
            }
            let numberOfWeeksPerYearField: IFieldForm | undefined;
            if (numberOfWeeksPerYearField = fieldsGroup.fields.find(x => x.data.id === 'numberOfWeeksPerYearId')) {
                activity.weeksPerYear = numberOfWeeksPerYearField.value;
            }
            let numberOfYearsField: IFieldForm | undefined;
            if (numberOfYearsField = fieldsGroup.fields.find(x => x.data.id === 'numberOfYearsId')) {
                activity.numberOfYears = numberOfYearsField.value;
            }
            let participated9Field: IFieldForm | undefined;
            if (participated9Field = fieldsGroup.fields.find(x => x.data.id === 'participated9Id')) {
                activity.participatedGrade09 = Boolean(participated9Field.value);
            }
            let participated10Field: IFieldForm | undefined;
            if (participated10Field = fieldsGroup.fields.find(x => x.data.id === 'participated10Id')) {
                activity.participatedGrade10 = Boolean(participated10Field.value);
            }
            let participated11Field: IFieldForm | undefined;
            if (participated11Field = fieldsGroup.fields.find(x => x.data.id === 'participated11Id')) {
                activity.participatedGrade11 = Boolean(participated11Field.value);
            }
            let participated12Field: IFieldForm | undefined;
            if (participated12Field = fieldsGroup.fields.find(x => x.data.id === 'participated12Id')) {
                activity.participatedGrade12 = Boolean(participated12Field.value);
            }
            let participatedPostSecondaryField: IFieldForm | undefined;
            if (participatedPostSecondaryField = fieldsGroup.fields.find(x => x.data.id === 'participatedPostSecondaryId')) {
                activity.participatedPostsecondary = Boolean(participatedPostSecondaryField.value);
            }

            // XNOR
            // If any required fields or none are filled that is allowed
            activity.activityType = activity.activityType || 0;
            activity.activity = activity.activity || 0;
            if (!(activity.activityType !== 0 && activity.activity !== 0) &&
                (activity.activityType !== 0 || activity.activity !== 0)) {
                return false;
            }

            activityList = this.setApplicationActivitiesValues(activity, activityList);

            let i: number = 0;
            do {
                let activityItem: IApplicationActivity = {};
                activityItem = this.setApplicationActivitiesAdditional(fieldsGroup, i, activityItem);

                // Duplicated
                if (activityList.find(x => x.activityType === activityItem.activityType &&
                    x.activity === activityItem.activity)) {
                    const fieldsById =
                        fieldsGroup.fields.filter(x =>
                            x.data.id.substr(0, 'activityErrosId'.length) === 'activityErrosId' &&
                            x.data.section === i);
                    fieldsById.forEach(field => {
                        field.data.label = fieldsGroup.errorMessageDuplicate;
                        field.data.error = true;
                    });
                    return false;
                }

                activityList = this.setApplicationActivitiesValues(activityItem, activityList);

                i++;
            } while (i < components.expansionPanel.activityCount);

            if (activityList.length > 0) {
                // Required fields should be filled
                activityList.forEach(activity => {
                    if (activity.position || activity.hoursPerWeek ||
                        activity.weeksPerYear || activity.numberOfYears ||
                        activity.participatedGrade09 || activity.participatedGrade10 ||
                        activity.participatedGrade11 || activity.participatedGrade12 ||
                        activity.participatedPostsecondary) {
                        if ((activity.activityType === null || activity.activityType === 0) &&
                            (activity.activity === null || activity.activity === 0)) {
                            isValid = false;
                        }
                    }
                });
            }
            // List is empty so no error should be show
            else {
                fieldsGroup.fields.forEach(field => {
                    field.data.error = false;
                    field.data.helperText = '';
                });
                isValid = true;
            }
            if (isValid) {
                application.activities = activityList;
            }

            this.setState({
                application
            });
        }
        return isValid;

    };

    private reviewAddress = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            application,
            components
        } = this.state;

        if (components && components.expansionPanel.addressessCount === undefined) {
            components.expansionPanel.addressessCount = 0;
        }

        if (components && components.expansionPanel.addressessCount !== undefined && components.expansionPanel.addressessCount > -1) {
            const addressList: IApplicationAddress[] = [];
            let address: IApplicationAddress = { isPrimary: false };

            address = this.setApplicationAddress(fieldsGroup, address);
            address = this.setApplicationAddressValues(address);

            if (address.type !== 0 && address.line1 !== '' &&
                address.city !== '' && address.country !== 0) {
                address.isPrimary = true;
                addressList.push(address);
            }
            else if (address.line2 || address.line3 || address.line4 ||
                address.city || address.stateProvince || address.postalCode ||
                address.county) {
                addressList.push(address);
            }

            let i: number = 0;
            do {
                let address: IApplicationAddress = { isPrimary: false };
                address = this.setApplicationAddressAdditional(fieldsGroup, i, address);

                // Duplicated
                if (addressList.find(x => x.type === address.type)) {
                    const fieldsById =
                        fieldsGroup.fields.filter(x =>
                            x.data.id.substr(0, 'addressErrorsId'.length) === 'addressErrorsId' &&
                            x.data.section === i);
                    fieldsById.forEach(field => {
                        field.data.label = fieldsGroup.errorMessageDuplicate;
                        field.data.error = true;
                    });
                    return false;
                }

                address = this.setApplicationAddressValues(address);

                if (address.type !== 0 && address.line1 !== '' &&
                    address.city !== '' && address.country !== 0) {
                    addressList.push(address);
                }
                else if (address.line2 !== '' || address.line3 !== '' || address.line4 !== '' ||
                    address.city !== '' || address.stateProvince !== 0 || address.postalCode !== '' ||
                    address.county !== 0) {
                    addressList.push(address);
                }
                i++;
            } while (i < components.expansionPanel.addressessCount);

            application.addresses = addressList;

            this.setState({
                application
            });

            return true;
        }
        else {
            return true;
        }
    };

    private reviewEducation = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            application,
            components
        } = this.state;

        let isValid: boolean = true;

        if (components && components.expansionPanel.educationCount === undefined) {
            components.expansionPanel.educationCount = 0;
        }

        if (components && components.expansionPanel.educationCount !== undefined && components.expansionPanel.educationCount > -1) {
            const educationList: IApplicationEducation[] = [];
            let education: IApplicationEducation = {
                enrollment: {},
                institution: {
                    city: '',
                    countryDesc: '',
                    etsCode: '',
                    ficeCode: '',
                    id: 0,
                    name: '',
                    stateDesc: ''
                }
            };

            education = this.setApplicationEducation(fieldsGroup, education);
            education = this.setApplicationEducationValues(education);

            if (education.institution.city || education.enrollment.startDate || education.enrollment.endDate ||
                education.institution.etsCode || education.institution.name || education.institution.ficeCode) {
                educationList.push(education);
            }
            else if (education.enrollment &&
                education.enrollment.curriculumId && education.enrollment.curriculumId > 0 ||
                education.enrollment.honorsId && education.enrollment.honorsId > 0 ||
                education.enrollment.degreeId && education.enrollment.degreeId > 0 ||
                education.institution.id && education.institution.id > 0 ||
                education.institution.stateProvinceId && education.institution.stateProvinceId > 0 ||
                education.institution.countryId && education.institution.countryId > 0) {
                educationList.push(education);
            }

            // Dates
            if (education.enrollment.startDate && education.enrollment.endDate) {
                if (components && (education.enrollment.startDate || education.enrollment.endDate)) {
                    if (moment(education.enrollment.startDate).format('YYYY-MM-DD') > moment(education.enrollment.endDate).format('YYYY-MM-DD')) {
                        const fieldsById =
                            fieldsGroup.fields.filter(x =>
                                x.data.id === 'educationErrosId');
                        fieldsById.forEach(field => {
                            field.data.label = fieldsGroup.errorMessageNotValid;
                            field.data.error = true;
                        });
                        return false;
                    }
                    else if (moment(education.enrollment.startDate).format('YYYY-MM-DD') <
                        moment(education.enrollment.endDate).format('YYYY-MM-DD')) {
                        const fieldsById =
                            fieldsGroup.fields.filter(x =>
                                x.data.id === 'educationErrosId');
                        fieldsById.forEach(field => {
                            field.data.label = '';
                            field.data.error = false;
                        });
                    }
                    else if (education.enrollment && education.enrollment.startDate && education.enrollment.endDate &&
                        (education.enrollment.startDate < moment(components.dateTimeMin).format('YYYY-MM-DD') ||
                            education.enrollment.endDate > moment(components.dateTimeMax).format('YYYY-MM-DD'))) {
                        const fieldsById =
                            fieldsGroup.fields.filter(x =>
                                x.data.id === 'educationErrosId');
                        fieldsById.forEach(field => {
                            field.data.label = fieldsGroup.errorMessageRange
                                + moment(components.dateTimeMin).format('YYYY') + '-' +
                                + moment(components.dateTimeMax).format('YYYY');
                            field.data.error = true;
                        });
                        return false;
                    }
                    else if (education.enrollment && education.enrollment.startDate && education.enrollment.endDate &&
                        (education.enrollment.startDate < moment(components.dateTimeMin).format('YYYY-MM-DD') ||
                            education.enrollment.endDate < moment(components.dateTimeMax).format('YYYY-MM-DD'))) {
                        const fieldsById =
                            fieldsGroup.fields.filter(x =>
                                x.data.id === 'educationErrosId');
                        fieldsById.forEach(field => {
                            field.data.label = '';
                            field.data.error = false;
                        });
                    }
                }
            }

            let i: number = 0;
            do {
                let education: IApplicationEducation = {
                    enrollment: {},
                    institution: {
                        city: '',
                        countryDesc: '',
                        etsCode: '',
                        ficeCode: '',
                        id: 0,
                        name: '',
                        stateDesc: ''
                    }
                };

                education = this.setApplicationEducationAdditional(fieldsGroup, i, education);
                education = this.setApplicationEducationValues(education);

                // Dates
                if (education.enrollment.startDate && education.enrollment.endDate) {
                    if (components && (education.enrollment.startDate || education.enrollment.endDate)) {
                        if (moment(education.enrollment.startDate).format('YYYY-MM-DD') >
                            moment(education.enrollment.endDate).format('YYYY-MM-DD')) {
                            const fieldsById =
                                fieldsGroup.fields.filter(x =>
                                    x.data.id.substr(0, 'educationErrosId'.length) === 'educationErrosId' &&
                                    x.data.section === i);
                            fieldsById.forEach(field => {
                                field.data.label = fieldsGroup.errorMessageNotValid;
                                field.data.error = true;
                            });
                            return false;
                        }
                        else if (moment(education.enrollment.startDate).format('YYYY-MM-DD') <
                            moment(education.enrollment.endDate).format('YYYY-MM-DD')) {
                            const fieldsById =
                                fieldsGroup.fields.filter(x =>
                                    x.data.id.substr(0, 'educationErrosId'.length) === 'educationErrosId' &&
                                    x.data.section === i);
                            fieldsById.forEach(field => {
                                field.data.label = '';
                                field.data.error = false;
                            });
                        }
                        else if (education.enrollment && education.enrollment.startDate && education.enrollment.endDate &&
                            (education.enrollment.startDate < moment(components.dateTimeMin).format('YYYY-MM-DD') ||
                                education.enrollment.endDate > moment(components.dateTimeMax).format('YYYY-MM-DD'))) {
                            const fieldsById =
                                fieldsGroup.fields.filter(x =>
                                    x.data.id.substr(0, 'educationErrosId'.length) === 'educationErrosId' &&
                                    x.data.section === i);
                            fieldsById.forEach(field => {
                                field.data.label = fieldsGroup.errorMessageRange
                                    + moment(components.dateTimeMin).format('YYYY') + '-' +
                                    + moment(components.dateTimeMax).format('YYYY');
                                field.data.error = true;
                            });
                            return false;
                        }
                        else if (education.enrollment && education.enrollment.startDate && education.enrollment.endDate &&
                            (education.enrollment.startDate < moment(components.dateTimeMin).format('YYYY-MM-DD') ||
                                education.enrollment.endDate < moment(components.dateTimeMax).format('YYYY-MM-DD'))) {
                            const fieldsById =
                                fieldsGroup.fields.filter(x =>
                                    x.data.id.substr(0, 'educationErrosId'.length) === 'educationErrosId' &&
                                    x.data.section === i);
                            fieldsById.forEach(field => {
                                field.data.label = '';
                                field.data.error = false;
                            });
                        }
                    }
                }
                // Duplicated
                if (education.enrollment && education.enrollment.degreeId && education.enrollment.curriculumId &&
                    education.enrollment.honorsId &&
                    (education.enrollment.degreeId > 0 && education.enrollment.curriculumId > 0 &&
                        education.enrollment.honorsId > 0)) {
                    if (educationList.find(x => x.enrollment.degreeId === education.enrollment.degreeId &&
                        x.enrollment.curriculumId === education.enrollment.curriculumId &&
                        x.enrollment.honorsId === education.enrollment.honorsId)) {
                        const fieldsById =
                            fieldsGroup.fields.filter(x =>
                                x.data.id.substr(0, 'educationErrosId'.length) === 'educationErrosId' &&
                                x.data.section === i);
                        fieldsById.forEach(field => {
                            field.data.label = fieldsGroup.errorMessageDuplicate;
                            field.data.error = true;
                        });
                        return false;
                    }
                }
                else {
                    if (education.institution.etsCode) {
                        if (educationList.find(x => x.institution.etsCode === education.institution.etsCode)) {
                            const fieldsById =
                                fieldsGroup.fields.filter(x =>
                                    x.data.id.substr(0, 'educationErrosId'.length) === 'educationErrosId');
                            fieldsById.forEach(field => {
                                field.data.label = fieldsGroup.errorMessageDuplicate;
                                field.data.error = true;
                            });
                            return false;
                        }
                    }
                }

                if (education.institution.city || education.enrollment.startDate || education.enrollment.endDate ||
                    education.institution.etsCode || education.institution.name || education.institution.ficeCode) {
                    educationList.push(education);
                }
                else if (education.enrollment &&
                    education.enrollment.curriculumId && education.enrollment.curriculumId > 0 ||
                    education.enrollment.honorsId && education.enrollment.honorsId > 0 ||
                    education.enrollment.degreeId && education.enrollment.degreeId > 0 ||
                    education.institution.id && education.institution.id > 0 ||
                    education.institution.stateProvinceId && education.institution.stateProvinceId > 0 ||
                    education.institution.countryId && education.institution.countryId > 0) {
                    educationList.push(education);
                }
                i++;
            } while (i < components.expansionPanel.educationCount);

            // Education is required
            if (fieldsGroup.isRequired) {
                // List is no empty so no error should be show.
                if (educationList.length > 0) {
                    isValid = true;
                    const fieldsById =
                        fieldsGroup.fields.filter(x =>
                            x.data.id === 'educationErrosId');
                    fieldsById.forEach(field => {
                        field.data.label = '';
                        field.data.error = false;
                    });
                }
                // List is empty so error should be show.
                else {
                    isValid = false;
                    const fieldsById =
                        fieldsGroup.fields.filter(x =>
                            x.data.id === 'educationErrosId');
                    fieldsById.forEach(field => {
                        field.data.label = fieldsGroup.errorMessageRequired;
                        field.data.error = true;
                    });
                }
            }
            // Education is include
            else {
                // List is empty so no error should be show
                if (educationList.length === 0) {
                    fieldsGroup.fields.forEach(field => {
                        field.data.error = false;
                        field.data.helperText = '';
                    });
                    isValid = true;
                }
            }
            if (isValid) {
                application.education = educationList;
            }
            this.setState({
                application: application
            });
        }
        return isValid;
    };

    private reviewEmergencyContacts = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            application,
            components
        } = this.state;

        let isValid = true;

        if (components && components.expansionPanel.emergencyContactsCount === undefined) {
            components.expansionPanel.emergencyContactsCount = 0;
        }

        if (components && components.expansionPanel.emergencyContactsCount !== undefined && components.expansionPanel.emergencyContactsCount > -1) {
            const emergencyList: IApplicationEmergencyContact[] = [];

            const emergency: IApplicationEmergencyContact = { firstName: '', lastName: '', phoneNumber: '' };
            const firstNamefield = fieldsGroup.fields.findIndex(x => x.data.id === 'emergencyFirstNameId');
            if (firstNamefield > -1) {
                emergency.firstName = fieldsGroup.fields[firstNamefield].value;
            }
            const lastNameField = fieldsGroup.fields.findIndex(x => x.data.id === 'emergencyLastNameId');
            if (lastNameField > -1) {
                emergency.lastName = fieldsGroup.fields[lastNameField].value;
            }
            const phoneField = fieldsGroup.fields.findIndex(x => x.data.id === 'emergencyPhoneId');
            if (phoneField > -1) {
                emergency.phoneNumber = fieldsGroup.fields[phoneField].value;
            }
            const suffixField = fieldsGroup.fields.findIndex(x => x.data.id === 'emergencySuffixId');
            if (suffixField > -1) {
                emergency.suffixId = fieldsGroup.fields[suffixField].value;
            }
            const middleNameField = fieldsGroup.fields.findIndex(x => x.data.id === 'emergencyMiddleNameId');
            if (middleNameField > -1) {
                emergency.middleName = fieldsGroup.fields[middleNameField].value;
            }
            const lastNamePrefixField = fieldsGroup.fields.findIndex(x => x.data.id === 'emergencyLastNamePrefixId');
            if (lastNamePrefixField > -1) {
                emergency.lastNamePrefix = fieldsGroup.fields[lastNamePrefixField].value;
            }
            const relationshipField = fieldsGroup.fields.findIndex(x => x.data.id === 'emergencyRelationshipId');
            if (relationshipField > -1) {
                emergency.relationshipId = fieldsGroup.fields[relationshipField].value;
            }
            const prefix = fieldsGroup.fields.findIndex(x => x.data.id === 'emergencyPrefixId');
            if (prefix > -1) {
                emergency.prefixId = fieldsGroup.fields[prefix].value;
            }

            // XNOR
            // If any required fields or none are filled that is allowed
            emergency.firstName = emergency.firstName === null ? '' : emergency.firstName;
            emergency.lastName = emergency.lastName === null ? '' : emergency.lastName;
            emergency.phoneNumber = emergency.phoneNumber === null ? '' : emergency.phoneNumber;
            if (!(emergency.firstName !== '' && emergency.lastName !== '' && emergency.phoneNumber !== '') &&
                (emergency.firstName !== '' || emergency.lastName !== '' || emergency.phoneNumber !== '')) {
                return false;
            }

            if (emergency.firstName !== null && emergency.firstName !== '' &&
                emergency.lastName !== null && emergency.lastName !== '' &&
                emergency.phoneNumber !== null && emergency.phoneNumber !== '') {
                emergencyList.push(emergency);
            }
            else if (emergency.suffixId || emergency.middleName ||
                emergency.lastNamePrefix || emergency.relationshipId || emergency.prefixId) {
                emergencyList.push(emergency);
            }
            let i: number = 0;
            do {
                const emergency: IApplicationEmergencyContact = { firstName: '', lastName: '', phoneNumber: '' };

                const fieldsBySection = fieldsGroup.fields.filter(x => x.data.section === i);
                fieldsBySection.forEach(field => {
                    if (field.data.id.substr(0, 'emergencyFirstNameId'.length) === 'emergencyFirstNameId') {
                        emergency.firstName = field.value;
                    }
                    if (field.data.id.substr(0, 'emergencyLastNameId'.length) === 'emergencyLastNameId') {
                        emergency.lastName = field.value;
                    }
                    if (field.data.id.substr(0, 'emergencyPhoneId'.length) === 'emergencyPhoneId') {
                        emergency.phoneNumber = field.value;
                    }
                    if (field.data.id.substr(0, 'emergencySuffixId'.length) === 'emergencySuffixId') {
                        emergency.suffixId = field.value;
                    }
                    if (field.data.id.substr(0, 'emergencyMiddleNameId'.length) === 'emergencyMiddleNameId') {
                        emergency.middleName = field.value;
                    }
                    if (field.data.id.substr(0, 'emergencyLastNamePrefixId'.length) === 'emergencyLastNamePrefixId') {
                        emergency.lastNamePrefix = field.value;
                    }
                    if (field.data.id.substr(0, 'emergencyRelationshipId'.length) === 'emergencyRelationshipId') {
                        emergency.relationshipId = field.value;
                    }
                    if (field.data.id.substr(0, 'emergencyPrefixId'.length) === 'emergencyPrefixId') {
                        emergency.prefixId = field.value;
                    }
                });
                // Duplicated
                if (emergencyList.find(x => x.firstName === emergency.firstName &&
                    x.lastName === emergency.lastName && x.relationshipId === emergency.relationshipId)) {
                    const fieldsById =
                        fieldsGroup.fields.filter(x =>
                            x.data.id.substr(0, 'emergencyErrorsId'.length) === 'emergencyErrorsId' &&
                            x.data.section === i);
                    fieldsById.forEach(field => {
                        field.data.label = fieldsGroup.errorMessageDuplicate;
                        field.data.error = true;
                    });
                    return false;
                }
                if (emergency.firstName !== null && emergency.firstName !== '' &&
                    emergency.lastName !== null && emergency.lastName !== '' &&
                    emergency.phoneNumber !== null && emergency.phoneNumber !== '') {
                    emergencyList.push(emergency);
                }
                else if (emergency.suffixId || emergency.middleName ||
                    emergency.lastNamePrefix || emergency.relationshipId || emergency.prefixId) {
                    emergencyList.push(emergency);
                }
                i++;
            } while (i < components.expansionPanel.emergencyContactsCount);
            // Emergency is required
            if (fieldsGroup.isRequired) {
                // List is no empty so no error should be show.
                if (emergencyList.length > 0) {
                    isValid = true;
                    const fieldsById =
                        fieldsGroup.fields.filter(x =>
                            x.data.id === 'emergencyErrorsId');
                    fieldsById.forEach(field => {
                        field.data.label = '';
                        field.data.error = false;
                    });
                }
                // List is empty so error should be show.
                else {
                    isValid = false;
                    const fieldsById =
                        fieldsGroup.fields.filter(x =>
                            x.data.id === 'emergencyErrorsId');
                    fieldsById.forEach(field => {
                        field.data.label = fieldsGroup.errorMessageRequired;
                        field.data.error = true;
                    });
                }
            }
            // Emergency is include
            else {
                // List is not empty
                if (emergencyList.length > 0) {
                    // Required fields should be filled
                    emergencyList.forEach(emergency => {
                        if (emergency.suffixId || emergency.middleName ||
                            emergency.lastNamePrefix || emergency.relationshipId || emergency.prefixId) {
                            if ((emergency.firstName === null || emergency.firstName === '') &&
                                (emergency.lastName === null || emergency.lastName === '') &&
                                (emergency.phoneNumber === null || emergency.phoneNumber === '')) {
                                isValid = false;
                            }
                        }
                    });
                }
                // List is empty so no error should be show
                else {
                    fieldsGroup.fields.forEach(field => {
                        field.data.error = false;
                        field.data.helperText = '';
                    });
                    isValid = true;
                }
            }
            if (isValid) {
                application.emergencyContacts = emergencyList;
            }
            this.setState({
                application: application
            });
        }
        return isValid;
    };

    private reviewEmployment = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            application,
            components
        } = this.state;

        let isValid = true;

        if (components && components.expansionPanel.employeeCount === undefined) {
            components.expansionPanel.employeeCount = 0;
        }

        if (components && components.expansionPanel.employeeCount !== undefined && components.expansionPanel.employeeCount > -1) {
            const employmentList: IApplicationEmployment[] = [];
            if (components) {
                const employment: IApplicationEmployment = { name: '', positionId: 0, startDate: undefined, endDate: undefined };
                const employerNamefield = fieldsGroup.fields.findIndex(x => x.data.id === 'employerNameId');
                const employerPositionField = fieldsGroup.fields.findIndex(x => x.data.id === 'employerPositionId');
                if (employerNamefield > -1 && employerPositionField > -1) {
                    employment.name = fieldsGroup.fields[employerNamefield].value;
                    employment.positionId = fieldsGroup.fields[employerPositionField].value;

                    employment.name = employment.name === null ? '' : employment.name;
                    employment.positionId = employment.positionId === null ? 0 : employment.positionId;
                    // If name has value position is not required
                    if (employment.name !== '') {
                        fieldsGroup.fields[employerPositionField].data.error = false;
                        fieldsGroup.fields[employerPositionField].data.helperText = '';
                    }
                    // If position has value name is not required
                    if (employment.positionId > 0) {
                        fieldsGroup.fields[employerNamefield].data.error = false;
                        fieldsGroup.fields[employerNamefield].data.helperText = '';
                    }
                }
                const employerStartDateField = fieldsGroup.fields.findIndex(x => x.data.id === 'employerStartDateId');
                if (employerStartDateField > -1) {
                    employment.startDate = fieldsGroup.fields[employerStartDateField].value;
                }
                const employerEndDateField = fieldsGroup.fields.findIndex(x => x.data.id === 'employerEndDateId');
                if (employerEndDateField > -1) {
                    employment.endDate = fieldsGroup.fields[employerEndDateField].value;
                }
                // When group is required and name and position is empty, required error is show.
                if (fieldsGroup.isRequired && employment.name === '' &&
                    (employment.positionId === 0 || employment.positionId === undefined)) {
                    isValid = false;
                    const fieldsById =
                        fieldsGroup.fields.filter(x =>
                            x.data.id.substr(0, 'employmentErrosId'.length) === 'employmentErrosId');
                    fieldsById.forEach(field => {
                        field.data.label = fieldsGroup.errorMessageRequired;
                    });
                    return false;
                }
                if (employment.name !== '' || employment.positionId > 0) {
                    employmentList.push(employment);
                }
                if (employment.startDate || employment.endDate) {
                    if (employment.startDate && employment.endDate) {
                        // Dates
                        if (moment(employment.startDate).format('YYYY-MM-DD') > moment(employment.endDate).format('YYYY-MM-DD')) {
                            isValid = false;
                            const fieldsById =
                                fieldsGroup.fields.filter(x =>
                                    x.data.id.substr(0, 'employmentErrosId'.length) === 'employmentErrosId');
                            fieldsById.forEach(field => {
                                field.data.label = fieldsGroup.errorMessageNotValid;
                            });
                        }
                        else if (employment.startDate < moment(components.dateTimeMin).format('YYYY-MM-DD') ||
                            employment.endDate > moment(components.dateTimeMax).format('YYYY-MM-DD')) {
                            isValid = false;
                            const fieldsById =
                                fieldsGroup.fields.filter(x =>
                                    x.data.id.substr(0, 'employmentErrosId'.length) === 'employmentErrosId');
                            fieldsById.forEach(field => {
                                field.data.label = fieldsGroup.errorMessageRange
                                    + moment(components.dateTimeMin).format('YYYY') + '-' +
                                    + moment(components.dateTimeMax).format('YYYY');
                            });
                        }
                    }
                    if (employment.name === '' &&
                        (employment.positionId === 0 || employment.positionId === undefined)) {
                        isValid = false;
                        const fieldsById =
                            fieldsGroup.fields.filter(x =>
                                x.data.id.substr(0, 'employmentErrosId'.length) === 'employmentErrosId');
                        fieldsById.forEach(field => {
                            field.data.label = fieldsGroup.errorMessageRequired;
                        });
                        return false;
                    }
                }
                let i: number = 0;
                do {
                    const employment: IApplicationEmployment = { name: '', positionId: 0, startDate: undefined, endDate: undefined };

                    const fieldsBySection = fieldsGroup.fields.filter(x => x.data.section === i);
                    fieldsBySection.forEach(field => {
                        if (field.data.id.substr(0, 'employerNameId'.length) === 'employerNameId') {
                            employment.name = field.value === null ? null : field.value;
                        }
                        if (field.data.id.substr(0, 'employerPositionId'.length) === 'employerPositionId') {
                            employment.positionId = field.value === '' ? 0 : field.value;
                        }
                        if (field.data.id.substr(0, 'employerStartDateId'.length) === 'employerStartDateId') {
                            employment.startDate = field.value === '' ? null : field.value;
                        }
                        if (field.data.id.substr(0, 'employerEndDateId'.length) === 'employerEndDateId') {
                            employment.endDate = field.value === '' ? null : field.value;
                        }
                    });
                    fieldsBySection.forEach(field => {
                        if (field.data.id.substr(0, 'employerNameId'.length) === 'employerNameId' &&
                            employment.positionId > 0) {
                            field.data.error = false;
                            field.data.helperText = '';
                        }
                        if (field.data.id.substr(0, 'employerPositionId'.length) === 'employerPositionId' &&
                            employment.name !== '') {
                            field.data.error = false;
                            field.data.helperText = '';
                        }
                    });
                    // Duplicated
                    if (employmentList.find(x => x.name === employment.name &&
                        x.positionId === employment.positionId &&
                        x.startDate === employment.startDate &&
                        x.endDate === employment.endDate)) {
                        isValid = false;
                        const fieldsById =
                            fieldsGroup.fields.filter(x =>
                                x.data.id.substr(0, 'employmentErrosId'.length) === 'employmentErrosId');
                        fieldsById.forEach(field => {
                            field.data.label = fieldsGroup.errorMessageDuplicate;
                        });
                        return false;
                    }
                    // If start date or end date is entered Position or Name should have a value
                    if (employment.startDate || employment.endDate) {
                        if (employment.name === '' &&
                            (employment.positionId === 0 || employment.positionId === undefined)) {
                            isValid = false;
                            const fieldsById =
                                fieldsGroup.fields.filter(x =>
                                    x.data.id.substr(0, 'employmentErrosId'.length) === 'employmentErrosId');
                            fieldsById.forEach(field => {
                                field.data.label = fieldsGroup.errorMessageRequired;
                            });
                            return false;
                        }
                        if (employment.startDate && employment.endDate) {
                            // Dates validations
                            if (moment(employment.startDate).format('YYYY-MM-DD') > moment(employment.endDate).format('YYYY-MM-DD')) {
                                isValid = false;
                                const fieldsById =
                                    fieldsGroup.fields.filter(x =>
                                        x.data.id.substr(0, 'employmentErrosId'.length) === 'employmentErrosId');
                                fieldsById.forEach(field => {
                                    field.data.label = fieldsGroup.errorMessageNotValid;
                                });
                            }
                            else if (employment.startDate < moment(components.dateTimeMin).format('YYYY-MM-DD') ||
                                employment.endDate > moment(components.dateTimeMax).format('YYYY-MM-DD')) {
                                isValid = false;
                                const fieldsById =
                                    fieldsGroup.fields.filter(x =>
                                        x.data.id.substr(0, 'employmentErrosId'.length) === 'employmentErrosId');
                                fieldsById.forEach(field => {
                                    field.data.label = fieldsGroup.errorMessageRange
                                        + moment(components.dateTimeMin).format('YYYY') + '-' +
                                        + moment(components.dateTimeMax).format('YYYY');
                                });
                            }
                        }
                    }
                    if (employment.name !== '' || employment.positionId > 0) {
                        employmentList.push(employment);
                    }
                    i++;
                } while (i < components.expansionPanel.employeeCount);
                // Employment is required
                if (fieldsGroup.isRequired) {
                    // List is empty so error should be show.
                    if (employmentList.length === 0) {
                        isValid = false;
                        const fieldsById =
                            fieldsGroup.fields.filter(x =>
                                x.data.id.substr(0, 'employmentErrosId'.length) === 'employmentErrosId');
                        fieldsById.forEach(field => {
                            field.data.label = fieldsGroup.errorMessageRequired;
                        });
                    }
                }
                // Employment is include
                else {
                    // List is not empty
                    if (employmentList.length > 0) {
                        // Required fields should be filled
                        employmentList.forEach(employment => {
                            if (employment.startDate || employment.endDate) {
                                if ((employment.name === null || employment.name === '') &&
                                    employment.positionId === 0) {
                                    isValid = false;
                                }
                            }
                        });
                    }
                    else {
                        fieldsGroup.fields.forEach(field => {
                            field.data.error = false;
                            field.data.helperText = '';
                        });
                        isValid = true;
                    }
                }
                if (isValid) {
                    application.employments = employmentList;
                }
                this.setState({
                    application: application
                });
            }
        }
        return isValid;
    };

    private reviewIpeds = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            application
        } = this.state;

        let isValid = true;
        const hispanicAnswer: string = fieldsGroup.fields[2].value;

        if (hispanicAnswer) {
            // If question is responded with NO, user must select at least one subrace
            if (hispanicAnswer === '0') {
                if (application.ipeds) {
                    const subRaces: IApplicationIpeds[] =
                        application.ipeds.filter(x => x.ipedsFederalCategoryId !== 1);
                    if (subRaces.length === 0) {
                        isValid = false;
                        const textErrorIndex: number = fieldsGroup.fields.findIndex(x => x.data.id === 'ipedsErrorsId');
                        fieldsGroup.fields[textErrorIndex].data.label =
                            fieldsGroup.errorMessageRequired;
                    }
                }
                else {
                    isValid = false;
                    const textErrorIndex: number = fieldsGroup.fields.findIndex(x => x.data.id === 'ipedsErrorsId');
                    fieldsGroup.fields[textErrorIndex].data.label =
                        fieldsGroup.errorMessageRequired;
                }
            }
        }
        else {
            // If question was not answered and some subraces were selected, user must answer question
            if (application.ipeds && application.ipeds.length > 0) {
                isValid = false;
                const textErrorIndex: number = fieldsGroup.fields.findIndex(x => x.data.id === 'ipedsErrorsId');
                fieldsGroup.fields[textErrorIndex].data.label =
                    fieldsGroup.errorMessageNotValid;
            }
        }
        // Save ipeds if them were saved
        application.ipeds = undefined;
        this.setIpedsValuesCheckList(fieldsGroup);
        this.setIpedsValuesNestedCheckList(fieldsGroup);

        return isValid;
    };

    private reviewPhoneGroup = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            application,
            components
        } = this.state;

        if (components && components.expansionPanel.phoneCount === undefined) {
            components.expansionPanel.phoneCount = 0;
        }

        if (components && components.expansionPanel.phoneCount !== undefined && components.expansionPanel.phoneCount > -1) {
            const phoneList: IApplicationPhoneList[] = [];

            const phone: IApplicationPhoneList = { type: '', countryId: 0, number: '', isPrimary: false };
            const phoneTypeField = fieldsGroup.fields.findIndex(x => x.data.id === 'phoneTypeId');
            if (phoneTypeField > -1) {
                phone.type = fieldsGroup.fields[phoneTypeField].value;
            }
            const phoneCountryField = fieldsGroup.fields.findIndex(x => x.data.id === 'phoneCountryId');
            if (phoneCountryField > -1) {
                phone.countryId = fieldsGroup.fields[phoneCountryField].value;
            }
            const phoneNumberField = fieldsGroup.fields.findIndex(x => x.data.id === 'phoneNumberId');
            if (phoneNumberField > -1) {
                phone.number = fieldsGroup.fields[phoneNumberField].value;
            }
            const primaryPhoneField = fieldsGroup.fields.findIndex(x => x.data.id === 'primaryPhoneId');
            if (primaryPhoneField > -1) {
                phone.isPrimary = fieldsGroup.fields[primaryPhoneField].value === '1' ? true : false;
            }

            // Set values
            phone.type = phone.type === null ? '' : phone.type;
            phone.countryId = phone.countryId === 0 ? 0 : phone.countryId;
            phone.number = phone.number === null ? '' : phone.number;
            phone.isPrimary = phone.isPrimary === null ? false : phone.isPrimary;

            // Add phone to list
            if (phone.type !== '' && phone.countryId !== 0 && phone.number !== '') {
                phoneList.push(phone);
            }

            let i: number = 0;
            do {
                const phoneItem: IApplicationPhoneList = { type: '', countryId: 0, number: '', isPrimary: false };

                const fieldsBySection = fieldsGroup.fields.filter(x => x.data.section === i);
                fieldsBySection.forEach(field => {
                    if (field.data.id.substr(0, 'phoneTypeId'.length) === 'phoneTypeId') {
                        phoneItem.type = field.value;
                    }
                    if (field.data.id.substr(0, 'phoneCountryId'.length) === 'phoneCountryId') {
                        phoneItem.countryId = field.value;
                    }
                    if (field.data.id.substr(0, 'phoneNumberId'.length) === 'phoneNumberId') {
                        phoneItem.number = field.value;
                    }
                    if (field.data.id.substr(0, 'primaryPhoneId'.length) === 'primaryPhoneId') {
                        phoneItem.isPrimary = field.value === '1' ? true : false;
                    }
                });
                // Duplicated
                if (phoneList.find(x => x.type === phoneItem.type &&
                    x.countryId === phoneItem.countryId && x.number === phoneItem.number)) {
                    const fieldsById =
                        fieldsGroup.fields.filter(x =>
                            x.data.id.substr(0, 'phoneErrorsId'.length) === 'phoneErrorsId');
                    fieldsById.forEach(field => {
                        field.data.label = fieldsGroup.errorMessageDuplicate;
                    });
                    return false;
                }
                // Set values
                phoneItem.type = phoneItem.type === null ? '' : phoneItem.type;
                phoneItem.countryId = phoneItem.countryId === 0 ? 0 : phoneItem.countryId;
                phoneItem.number = phoneItem.number === null ? '' : phoneItem.number;
                phoneItem.isPrimary = phoneItem.isPrimary === null ? false : phoneItem.isPrimary;

                // Add phone to list
                if (phoneItem.type !== '' && phoneItem.countryId !== 0 && phoneItem.number !== '') {
                    phoneList.push(phoneItem);
                }
                i++;
            } while (i < components.expansionPanel.phoneCount);

            application.phones = phoneList;

            this.setState({
                application
            });

            return true;
        }
        else {
            return true;
        }
    };

    private reviewPrograms = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            application,
            components
        } = this.state;

        let isValid = true;

        if (components && components.expansionPanel.programsCount === undefined) {
            components.expansionPanel.programsCount = 0;
        }

        if (components && components.expansionPanel.programsCount !== undefined && components.expansionPanel.programsCount > -1) {
            const programList: IApplicationProgram[] = [];
            const program: IApplicationProgram = { programId: 0 };
            if (fieldsGroup && fieldsGroup.fields && fieldsGroup.fields.length > 0) {
                let exist: boolean = false;
                const field = fieldsGroup.fields.find(x => x.data.id === 'programOfStudydId');
                if (field && field.data && field.data.options && field.data.options.length > 0) {
                    field.data.options.forEach(option => {
                        if (Number(option.value) === Number(field.value)) {
                            exist = true;
                        }
                    });
                    if (exist) {
                        program.programId = field.value;
                    }
                    else {
                        isValid = false;
                    }
                }
            }
            if (isValid) {
                const commintmentField = fieldsGroup.fields.findIndex(x => x.data.id === 'commitmentId');
                if (commintmentField > -1) {
                    program.commitmentId = fieldsGroup.fields[commintmentField].value;
                }
                if (program.programId > 0) {
                    programList.push(program);
                }
                let i: number = 0;
                do {
                    const program: IApplicationProgram = { programId: 0 };

                    const fieldsBySection = fieldsGroup.fields.filter(x => x.data.section === i);
                    fieldsBySection.forEach(field => {
                        if (field.data.id.substr(0, 'programOfStudydId'.length) === 'programOfStudydId') {
                            program.programId = field.value;
                        }
                        if (field.data.id.substr(0, 'commitmentId'.length) === 'commitmentId') {
                            program.commitmentId = field.value;
                        }
                    });
                    if (programList.find(x => x.programId === program.programId)) {
                        isValid = false;
                        const textErrorIndex: number = fieldsGroup.fields.findIndex(x => x.data.id === 'programOfStudydErrorsId');
                        fieldsGroup.fields[textErrorIndex].data.label =
                            fieldsGroup.errorMessageDuplicate;
                    }
                    if (programList.find(x => x.programId ===
                        program.programId && x.commitmentId === program.commitmentId)) {
                        isValid = false;
                        const textErrorIndex: number = fieldsGroup.fields.findIndex(x => x.data.id === 'programOfStudydErrorsId');
                        fieldsGroup.fields[textErrorIndex].data.label =
                            fieldsGroup.errorMessageRequired;
                    }
                    else if (program.programId > 0) {
                        programList.push(program);
                    }
                    i++;
                } while (i < components.expansionPanel.programsCount);

                if (isValid) {
                    application.programs = programList;
                }

                this.setState({
                    application
                });
            }
        }
        return isValid;
    };

    private reviewRelatives = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            application,
            components
        } = this.state;

        let isValid: boolean = true;

        if (components && components.expansionPanel.relativesCount === undefined) {
            components.expansionPanel.relativesCount = 0;
        }

        if (components && components.expansionPanel.relativesCount !== undefined && components.expansionPanel.relativesCount > -1) {
            const relativeList: IApplicationRelative[] = [];
            let relative: IApplicationRelative = {
                attendedInstitution: false,
                relationFirstName: '',
                relationLastName: '',
                relationType: 0
            };
            relative = this.setApplicationRelative(fieldsGroup, relative);
            relative = this.setApplicationRelativeValues(relative);

            if (relative.relationFirstName || relative.relationLastName || relative.relationType > 0 ||
                relative.attendedInstitution) {
                relativeList.push(relative);
            }
            else if (relative.relationPrefix || relative.relationSuffix || relative.relationMiddleName ||
                relative.relationLastNamePrefix) {
                relativeList.push(relative);
            }

            let i: number = 0;
            do {
                let relative: IApplicationRelative = {
                    attendedInstitution: false,
                    relationFirstName: '',
                    relationLastName: '',
                    relationType: 0
                };

                relative = this.setApplicationRelativeAdditional(fieldsGroup, i, relative);
                relative = this.setApplicationRelativeValues(relative);

                // Duplicated
                if (relative.relationFirstName && relative.relationLastName && relative.relationType) {
                    if (relativeList.find(x => x.relationFirstName === relative.relationFirstName &&
                        x.relationLastName === relative.relationLastName &&
                        x.relationType === relative.relationType)) {
                        const fieldsById =
                            fieldsGroup.fields.filter(x =>
                                x.data.id.substr(0, 'relativesErrosId'.length) === 'relativesErrosId' &&
                                x.data.section === i);
                        fieldsById.forEach(field => {
                            field.data.label = fieldsGroup.errorMessageDuplicate;
                            field.data.error = true;
                        });
                        return false;
                    }
                }
                if (relative.relationFirstName || relative.relationLastName || relative.relationType > 0 ||
                    relative.attendedInstitution) {
                    relativeList.push(relative);
                }
                else if (relative.relationPrefix || relative.relationSuffix || relative.relationMiddleName ||
                    relative.relationLastNamePrefix) {
                    relativeList.push(relative);
                }
                i++;
            } while (i < components.expansionPanel.relativesCount);

            // Relatives is required
            if (fieldsGroup.isRequired) {
                // List is no empty so no error should be show.
                if (relativeList.length > 0) {
                    const fieldsById =
                        fieldsGroup.fields.filter(x =>
                            x.data.id === 'relativesErrosId');
                    fieldsById.forEach(field => {
                        field.data.error = false;
                        field.data.label = '';
                    });
                    isValid = true;
                }
                // List is empty so error should be show.
                if (relativeList.length === 0) {
                    isValid = false;
                    const fieldsById =
                        fieldsGroup.fields.filter(x =>
                            x.data.id === 'relativesErrosId');
                    fieldsById.forEach(field => {
                        field.data.error = true;
                        field.data.label = fieldsGroup.errorMessageRequired;
                    });
                }
            }
            else {
                if (relativeList.length === 0) {
                    fieldsGroup.fields.forEach(field => {
                        field.data.error = false;
                        field.data.helperText = '';
                    });
                    isValid = true;
                }
            }
            if (isValid) {
                application.relatives = relativeList;

                this.setState({
                    application: application
                });
            }
        }
        return isValid;
    };

    private reviewResidency = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            application
        } = this.state;

        let isValid: boolean = true;
        const residencyList: IApplicationResidency[] = [];
        let residency: IApplicationResidency = {};
        residency = this.setApplicationResidency(fieldsGroup, residency);

        if (residency.residencyPreference !== null ||
            residency.foodPlanInterest !== null ||
            residency.dormPlanInterest !== null ||
            residency.dormCampus !== null ||
            residency.dormBuilding !== null) {
            residencyList.push(residency);
        }

        // Residency is required
        if (fieldsGroup.isRequired) {
            // List is no empty so no error should be show.
            if (residencyList.length > 0) {
                const fieldsById =
                    fieldsGroup.fields.filter(x =>
                        x.data.id === 'relativesErrosId');
                fieldsById.forEach(field => {
                    field.data.error = false;
                    field.data.label = '';
                });
                isValid = true;
            }
            // List is empty so error should be show.
            if (residencyList.length === 0) {
                isValid = false;
                const fieldsById =
                    fieldsGroup.fields.filter(x =>
                        x.data.id === 'residencyErrosId');
                fieldsById.forEach(field => {
                    field.data.error = true;
                    field.data.label = fieldsGroup.errorMessageRequired;
                });
            }
        }
        // Residency is include
        else {
            // List is empty so no error should be show
            if (residencyList.length === 0) {
                fieldsGroup.fields.forEach(field => {
                    field.data.error = false;
                    field.data.helperText = '';
                });
                isValid = true;
            }
        }
        if (isValid) {
            if (residencyList.length > 0) {
                if (residencyList[0].residencyPreference && residencyList[0].residencyPreference > 0) {
                    application.residencyPreference = residencyList[0].residencyPreference;
                }
                if (residencyList[0].foodPlanInterest) {
                    application.foodPlanInterest = residencyList[0].foodPlanInterest;
                }
                if (residencyList[0].dormPlanInterest) {
                    application.dormPlanInterest = residencyList[0].dormPlanInterest;
                }
                if (residencyList[0].dormCampus && residencyList[0].dormCampus > 0) {
                    application.dormCampus = residencyList[0].dormCampus;
                }
                if (residencyList[0].dormBuilding && residencyList[0].dormBuilding > 0) {
                    application.dormBuilding = residencyList[0].dormBuilding;
                }
            }
            this.setState({
                application: application
            });
        }
        return isValid;
    };

    private reviewTestScoreCompleteness = (groupedControls: any): boolean => {
        let validCompleteness: boolean = true;
        // this is meant to iterate over all controls grouped by section
        for (const keyIndex of Object.keys(groupedControls)) {
            const scoreA: IFieldForm[] = groupedControls[Number(keyIndex)];

            const fieldsPopulated: boolean = scoreA.every(f => f.value && f.value !== '');
            const fieldsEmpty: boolean = scoreA.every(f => !f.value || f.value === '');

            if (!fieldsPopulated && !fieldsEmpty) {
                scoreA.forEach(field => {
                    if (field.value && field.value !== '') {
                        field.data.error = false;
                    } else {
                        field.data.error = true;
                        validCompleteness = false;
                    }
                });
            }
        }
        return validCompleteness;
    };

    private reviewTestScores = (groupedControls: any): boolean => {
        // this is meant to iterate over all controls grouped by section
        for (let i: number = 0; i < Object.keys(groupedControls).length; i++) {
            const scoreA: any = groupedControls[Number(Object.keys(groupedControls)[i])];
            for (let j: number = 0; j < Object.keys(groupedControls).length; j++) {
                if (i !== j) {
                    let identical: boolean = true;
                    const scoreB: any = groupedControls[Number(Object.keys(groupedControls)[j])];
                    for (let k: number = 0; k < scoreA.length; k++) {
                        const fieldA: IFieldForm = scoreA[k];
                        const fieldB: IFieldForm = scoreB[k];
                        if (fieldA.data.id !== fieldB.data.id) {
                            if ((fieldA.value || '') !== (fieldB.value || '')) {
                                identical = false;
                            }
                        }
                    }
                    if (identical) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    private reviewUserDefined = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            application
        } = this.state;

        let isValid: boolean = true;
        fieldsGroup.fields.forEach(field => {
            if (field.isUserDefined) {
                // validate length of field
                const userDefined: IApplicationUserDefined = {
                    columnLabel: '',
                    columnName: '',
                    columnType: 0,
                    columnValue: '',
                    isUploading: false
                };
                if (field.value) {
                    if (field.maxLength && field.value.toString().length <= field.maxLength) {
                        field.data.error = false;
                        field.data.helperText = '';
                        isValid = true;

                        userDefined.columnLabel = field.data.label ? field.data.label : '';
                        userDefined.columnName = field.data.id;
                        if (field.dataType === 'nvarchar') {
                            userDefined.columnType = 1;
                        }
                        if (field.dataType === 'date') {
                            userDefined.columnType = 2;
                        }
                        if (field.dataType === 'time') {
                            userDefined.columnType = 3;
                        }
                        userDefined.columnValue = field.value;
                        userDefined.isUploading = field.isUploading ? field.isUploading : false;
                        let userDefinedIndex: number = -1;
                        userDefinedIndex =
                            application.userDefined.findIndex(x => x.columnName === userDefined.columnName);
                        if (userDefinedIndex > -1) {
                            application.userDefined.splice(userDefinedIndex, 1);
                        }
                        application.userDefined.push(userDefined);
                    }
                    else {
                        field.data.error = true;
                        field.data.helperText = field.data.errorMessageRange;
                        isValid = false;
                    }
                }
                else {
                    if (field.isRequired) {
                        field.data.error = true;
                        field.data.helperText = field.data.errorMessageRequired;
                        isValid = false;
                    }
                }
            }
        });
        return isValid;
    };

    private reviewCampus = (fieldsGroup: IFieldsGroup): void => {
        const {
            application
        } = this.state;

        const campusIndex = fieldsGroup.fields.findIndex(x => x.data.id === 'campusId');
        if (fieldsGroup.fields[campusIndex].componentType === 'CheckboxList') {
            application.campuses = undefined;
            if (campusIndex > -1) {
                const campusList = fieldsGroup.fields[campusIndex].value;
                if (campusList) {
                    const array = Object.values(campusList.split(','));
                    array.forEach(campus => {
                        if (application.campuses) {
                            let findCampus: number = -1;
                            findCampus = application.campuses.findIndex(x => x === Number(campus));
                            if (findCampus === -1) {
                                application.campuses.push(
                                    Number(campus)
                                );
                            }
                        }
                        else {
                            application.campuses = [
                                Number(campus)
                            ];
                        }
                    });
                }
            }
        }
        else if (application.campuses) {
            application.campuses = [Number(application.campuses)];
        }
        else {
            application.campuses = undefined;
        }
    };

    private reviewAcademicInterest = (fieldsGroup: IFieldsGroup): void => {
        const {
            application
        } = this.state;

        const interestIndex = fieldsGroup.fields.findIndex(x => x.data.id === 'interestId');
        application.academicInterests = undefined;
        if (interestIndex > -1) {
            const interestList = fieldsGroup.fields[interestIndex].value;
            if (interestList) {
                const array = Object.values(interestList.split(','));
                array.forEach(interest => {
                    if (application.academicInterests) {
                        let findInterest: number = -1;
                        findInterest = application.academicInterests.findIndex(x => x === Number(interest));
                        if (findInterest === -1) {
                            application.academicInterests.push(
                                Number(interest)
                            );
                        }
                    }
                    else {
                        application.academicInterests = [
                            Number(interest)
                        ];
                    }
                });
            }
        }
    };
    // #endregion Review Information

    // #region Set Values for Collections
    private setApplicationActivitiesAdditional = (fieldsGroup: any, sectionNumber: number, activityItem: IApplicationActivity):
        IApplicationActivity => {
        const fieldsBySection = fieldsGroup.fields.filter(x => x.data.section === sectionNumber);
        fieldsBySection.forEach(field => {
            if (field.data.id.substr(0, 'activityTypeId'.length) === 'activityTypeId') {
                activityItem.activityType = field.value;
            }
            if (field.data.id.substr(0, 'activityId'.length) === 'activityId') {
                activityItem.activity = field.value;
            }
            if (field.data.id.substr(0, 'positionHeldId'.length) === 'positionHeldId') {
                activityItem.position = field.value;
            }
            if (field.data.id.substr(0, 'numberOfHoursPerWeekId'.length) === 'numberOfHoursPerWeekId') {
                activityItem.hoursPerWeek = field.value;
            }
            if (field.data.id.substr(0, 'numberOfWeeksPerYearId'.length) === 'numberOfWeeksPerYearId') {
                activityItem.weeksPerYear = field.value;
            }
            if (field.data.id.substr(0, 'numberOfYearsId'.length) === 'numberOfYearsId') {
                activityItem.numberOfYears = field.value;
            }
            if (field.data.id.substr(0, 'participated9Id'.length) === 'participated9Id') {
                activityItem.participatedGrade09 = Boolean(field.value);
            }
            if (field.data.id.substr(0, 'participated10Id'.length) === 'participated10Id') {
                activityItem.participatedGrade10 = Boolean(field.value);
            }
            if (field.data.id.substr(0, 'participated11Id'.length) === 'participated11Id') {
                activityItem.participatedGrade11 = Boolean(field.value);
            }
            if (field.data.id.substr(0, 'participated12Id'.length) === 'participated12Id') {
                activityItem.participatedGrade12 = Boolean(field.value);
            }
            if (field.data.id.substr(0, 'participatedPostSecondaryId'.length) === 'participatedPostSecondaryId') {
                activityItem.participatedPostsecondary = Boolean(field.value);
            }
        });
        return activityItem;
    };

    private setApplicationAddress = (fieldsGroup: any, address: IApplicationAddress):
        IApplicationAddress => {
        const addressTypefield = fieldsGroup.fields.findIndex(x => x.data.id === 'addressTypeId');
        if (addressTypefield > -1) {
            address.type = fieldsGroup.fields[addressTypefield].value;
        }
        const houseNumberField = fieldsGroup.fields.findIndex(x => x.data.id === 'houseNumberId');
        if (houseNumberField > -1) {
            address.houseNumber = fieldsGroup.fields[houseNumberField].value;
        }
        const addressLine1Field = fieldsGroup.fields.findIndex(x => x.data.id === 'addressLine1Id');
        if (addressLine1Field > -1) {
            address.line1 = fieldsGroup.fields[addressLine1Field].value;
        }
        const addressLine2Field = fieldsGroup.fields.findIndex(x => x.data.id === 'addressLine2Id');
        if (addressLine2Field > -1) {
            address.line2 = fieldsGroup.fields[addressLine2Field].value;
        }
        const addressLine3Field = fieldsGroup.fields.findIndex(x => x.data.id === 'addressLine3Id');
        if (addressLine3Field > -1) {
            address.line3 = fieldsGroup.fields[addressLine3Field].value;
        }
        const addressLine4Field = fieldsGroup.fields.findIndex(x => x.data.id === 'addressLine4Id');
        if (addressLine4Field > -1) {
            address.line4 = fieldsGroup.fields[addressLine4Field].value;
        }
        const addressCityField = fieldsGroup.fields.findIndex(x => x.data.id === 'addressCityId');
        if (addressCityField > -1) {
            address.city = fieldsGroup.fields[addressCityField].value;
        }
        const stateProvinceField = fieldsGroup.fields.findIndex(x => x.data.id === 'stateProvinceId');
        if (stateProvinceField > -1) {
            address.stateProvince = fieldsGroup.fields[stateProvinceField].value;
        }
        const postalCodeField = fieldsGroup.fields.findIndex(x => x.data.id === 'postalCodeId');
        if (postalCodeField > -1) {
            address.postalCode = fieldsGroup.fields[postalCodeField].value;
        }
        const countyIdField = fieldsGroup.fields.findIndex(x => x.data.id === 'addressCountyId');
        if (countyIdField > -1) {
            address.county = fieldsGroup.fields[countyIdField].value;
        }
        const addressCountryField = fieldsGroup.fields.findIndex(x => x.data.id === 'addressCountryId');
        if (addressCountryField > -1) {
            address.country = fieldsGroup.fields[addressCountryField].value;
        }
        return address;
    };

    private setApplicationAddressValues = (address: IApplicationAddress): IApplicationAddress => {
        address.type = address.type || 0;
        address.line1 = address.line1 || '';
        address.city = address.city || '';
        address.country = address.country || 0;

        address.line2 = address.line2 || '';
        address.line3 = address.line3 || '';
        address.line4 = address.line4 || '';
        address.city = address.city || '';
        address.stateProvince = address.stateProvince || 0;
        address.postalCode = address.postalCode || '';
        address.county = address.county || 0;

        return address;
    };

    private setApplicationAddressAdditional =
        (fieldsGroup: any, sectionNumber: number, address: IApplicationAddress): IApplicationAddress => {
            const fieldsBySection = fieldsGroup.fields.filter(x => x.data.section === sectionNumber);
            fieldsBySection.forEach(field => {
                if (field.data.id.substr(0, 'addressTypeId'.length) === 'addressTypeId') {
                    address.type = field.value;
                }
                if (field.data.id.substr(0, 'houseNumberId'.length) === 'houseNumberId') {
                    address.houseNumber = field.value;
                }
                if (field.data.id.substr(0, 'addressLine1Id'.length) === 'addressLine1Id') {
                    address.line1 = field.value;
                }
                if (field.data.id.substr(0, 'addressLine2Id'.length) === 'addressLine2Id') {
                    address.line2 = field.value;
                }
                if (field.data.id.substr(0, 'addressLine3Id'.length) === 'addressLine3Id') {
                    address.line3 = field.value;
                }
                if (field.data.id.substr(0, 'addressLine4Id'.length) === 'addressLine4Id') {
                    address.line4 = field.value;
                }
                if (field.data.id.substr(0, 'addressCityId'.length) === 'addressCityId') {
                    address.city = field.value;
                }
                if (field.data.id.substr(0, 'stateProvinceId'.length) === 'stateProvinceId') {
                    address.stateProvince = field.value;
                }
                if (field.data.id.substr(0, 'postalCodeId'.length) === 'postalCodeId') {
                    address.postalCode = field.value;
                }
                if (field.data.id.substr(0, 'addressCountyId'.length) === 'addressCountyId') {
                    address.county = field.value;
                }
                if (field.data.id.substr(0, 'addressCountryId'.length) === 'addressCountryId') {
                    address.country = field.value;
                }
            });
            return address;
        };

    private setApplicationEducation = (fieldsGroup: any, education: IApplicationEducation): IApplicationEducation => {
        const degreefield = fieldsGroup.fields.findIndex(x => x.data.id === 'educationDegreeId');
        if (degreefield > -1) {
            education.enrollment.degreeId = fieldsGroup.fields[degreefield].value;
        }
        const curriculumField = fieldsGroup.fields.findIndex(x => x.data.id === 'educationCurriculumId');
        if (curriculumField > -1) {
            education.enrollment.curriculumId = fieldsGroup.fields[curriculumField].value;
        }
        const honorsField = fieldsGroup.fields.findIndex(x => x.data.id === 'educationHonorsId');
        if (honorsField > -1) {
            education.enrollment.honorsId = fieldsGroup.fields[honorsField].value;
        }
        const startDateField = fieldsGroup.fields.findIndex(x => x.data.id === 'educationStartDateId');
        if (startDateField > -1) {
            education.enrollment.startDate = fieldsGroup.fields[startDateField].value;
        }
        const endDateField = fieldsGroup.fields.findIndex(x => x.data.id === 'educationEndDateId');
        if (endDateField > -1) {
            education.enrollment.endDate = fieldsGroup.fields[endDateField].value;
        }
        const institutionField = fieldsGroup.fields.findIndex(x => x.data.id === 'educationInstitutionName');
        if (institutionField > -1) {
            education.institution.name = fieldsGroup.fields[institutionField].value;
        }
        const etsCodeField = fieldsGroup.fields.findIndex(x => x.data.id === 'educationEtsCodeId');
        if (etsCodeField > -1) {
            education.institution.etsCode = fieldsGroup.fields[etsCodeField].value;
        }
        const cityField = fieldsGroup.fields.findIndex(x => x.data.id === 'educationCityId');
        if (cityField > -1) {
            education.institution.city = fieldsGroup.fields[cityField].value;
        }
        const stateField = fieldsGroup.fields.findIndex(x => x.data.id === 'educationStateId');
        if (stateField > -1) {
            education.institution.stateProvinceId = fieldsGroup.fields[stateField].value;
        }
        const countryField = fieldsGroup.fields.findIndex(x => x.data.id === 'educationCountryId');
        if (countryField > -1) {
            education.institution.countryId = fieldsGroup.fields[countryField].value;
        }
        const ficeCodeField = fieldsGroup.fields.findIndex(x => x.data.id === 'educationFiceCode');
        if (ficeCodeField > -1) {
            education.institution.ficeCode = fieldsGroup.fields[ficeCodeField].value;
        }
        return education;
    };

    private setApplicationRelativeAdditional =
        (fieldsGroup: any, sectionNumber: number, relativeItem: IApplicationRelative): IApplicationRelative => {
            const fieldsBySection = fieldsGroup.fields.filter(x => x.data.section === sectionNumber);
            fieldsBySection.forEach(field => {
                if (field.data.id.substr(0, 'relativesPrefixId'.length) === 'relativesPrefixId') {
                    relativeItem.relationPrefix = field.value === '' ? null : field.value;
                }
                if (field.data.id.substr(0, 'relativesFirstNameId'.length) === 'relativesFirstNameId') {
                    relativeItem.relationFirstName = field.value;
                }
                if (field.data.id.substr(0, 'relativesMiddleNameId'.length) === 'relativesMiddleNameId') {
                    relativeItem.relationMiddleName = field.value;
                }
                if (field.data.id.substr(0, 'relativesLastNamePrefixId'.length) === 'relativesLastNamePrefixId') {
                    relativeItem.relationLastNamePrefix = field.value;
                }
                if (field.data.id.substr(0, 'relativesLastNameId'.length) === 'relativesLastNameId') {
                    relativeItem.relationLastName = field.value;
                }
                if (field.data.id.substr(0, 'relativesSuffixId'.length) === 'relativesSuffixId') {
                    relativeItem.relationSuffix = field.value === '' ? null : field.value;
                }
                if (field.data.id.substr(0, 'relativesRelationshipId'.length) === 'relativesRelationshipId') {
                    relativeItem.relationType = field.value;
                }
                if (field.data.id.substr(0, 'relativesAttendedInstitutionId'.length) === 'relativesAttendedInstitutionId') {
                    relativeItem.attendedInstitution = Boolean(field.value);
                }
            });
            return relativeItem;
        };

    private setApplicationEducationValues = (education: IApplicationEducation): IApplicationEducation => {
        education.institution.city = education.institution.city || '';
        education.enrollment.curriculumId = education.enrollment.curriculumId || 0;
        education.enrollment.degreeId = education.enrollment.degreeId || 0;
        education.enrollment.honorsId = education.enrollment.honorsId || 0;
        education.enrollment.startDate = education.enrollment.startDate || undefined;
        education.enrollment.endDate = education.enrollment.endDate || undefined;
        education.institution.id = education.institution.id || 0;
        education.institution.name = education.institution.name || '';
        education.institution.etsCode = education.institution.etsCode || '';
        education.institution.city = education.institution.city || '';
        education.institution.stateProvinceId = education.institution.stateProvinceId || 0;
        education.institution.countryId = education.institution.countryId || 0;
        education.institution.ficeCode = education.institution.ficeCode || '';
        return education;
    };

    private setApplicationEducationAdditional = (fieldsGroup: any, sectionNumber: number, education: IApplicationEducation):
        IApplicationEducation => {
        const fieldsBySection = fieldsGroup.fields.filter(x => x.data.section === sectionNumber);
        fieldsBySection.forEach(field => {
            if (field.data.id.substr(0, 'educationDegreeId'.length) === 'educationDegreeId') {
                education.enrollment.degreeId = field.value;
            }
            if (field.data.id.substr(0, 'educationCurriculumId'.length) === 'educationCurriculumId') {
                education.enrollment.curriculumId = field.value;
            }
            if (field.data.id.substr(0, 'educationHonorsId'.length) === 'educationHonorsId') {
                education.enrollment.honorsId = field.value;
            }
            if (field.data.id.substr(0, 'educationStartDateId'.length) === 'educationStartDateId') {
                education.enrollment.startDate = field.value;
            }
            if (field.data.id.substr(0, 'educationEndDateId'.length) === 'educationEndDateId') {
                education.enrollment.endDate = field.value;
            }
            if (field.data.id.substr(0, 'educationInstitutionName'.length) === 'educationInstitutionName') {
                education.institution.name = field.value;
            }
            if (field.data.id.substr(0, 'educationEtsCodeId'.length) === 'educationEtsCodeId') {
                education.institution.etsCode = field.value;
            }
            if (field.data.id.substr(0, 'educationCityId'.length) === 'educationCityId') {
                education.institution.city = field.value;
            }
            if (field.data.id.substr(0, 'educationStateId'.length) === 'educationStateId') {
                education.institution.stateProvinceId = field.value;
            }
            if (field.data.id.substr(0, 'educationCountryId'.length) === 'educationCountryId') {
                education.institution.countryId = field.value;
            }
            if (field.data.id.substr(0, 'educationFiceCode'.length) === 'educationFiceCode') {
                education.institution.ficeCode = field.value;
            }
        });
        return education;
    };

    private setApplicationResidency = (fieldsGroup: any, residency: IApplicationResidency): IApplicationResidency => {
        const residencyPreferenceField = fieldsGroup.fields.findIndex(x => x.data.id === 'commutePreferenceId');
        if (residencyPreferenceField > -1) {
            residency.residencyPreference = fieldsGroup.fields[residencyPreferenceField].value;
        }
        const foodPlanInterestField = fieldsGroup.fields.findIndex(x => x.data.id === 'interestedFoodPlanId');
        if (foodPlanInterestField > -1) {
            residency.foodPlanInterest = fieldsGroup.fields[foodPlanInterestField].value;
        }
        const dormPlanInterestField = fieldsGroup.fields.findIndex(x => x.data.id === 'interestedDormPlanId');
        if (dormPlanInterestField > -1) {
            residency.dormPlanInterest = fieldsGroup.fields[dormPlanInterestField].value;
        }
        const dormCampusField = fieldsGroup.fields.findIndex(x => x.data.id === 'campusOptionsId');
        if (dormCampusField > -1) {
            residency.dormCampus = fieldsGroup.fields[dormCampusField].value;
        }
        const dormBuildingField = fieldsGroup.fields.findIndex(x => x.data.id === 'dormPlanOptionsId');
        if (dormBuildingField > -1) {
            residency.dormBuilding = fieldsGroup.fields[dormBuildingField].value;
        }
        return residency;
    };

    private setApplicationRelative = (fieldsGroup: any, relative: IApplicationRelative): IApplicationRelative => {
        const prefixField = fieldsGroup.fields.findIndex(x => x.data.id === 'relativesPrefixId');
        if (prefixField > -1) {
            relative.relationPrefix = fieldsGroup.fields[prefixField].value === '' ? null : fieldsGroup.fields[prefixField].value;
        }
        const firstNameField = fieldsGroup.fields.findIndex(x => x.data.id === 'relativesFirstNameId');
        if (firstNameField > -1) {
            relative.relationFirstName = fieldsGroup.fields[firstNameField].value;
        }
        const middleNameField = fieldsGroup.fields.findIndex(x => x.data.id === 'relativesMiddleNameId');
        if (middleNameField > -1) {
            relative.relationMiddleName = fieldsGroup.fields[middleNameField].value;
        }
        const lastNamePrefixField = fieldsGroup.fields.findIndex(x => x.data.id === 'relativesLastNamePrefixId');
        if (lastNamePrefixField > -1) {
            relative.relationLastNamePrefix = fieldsGroup.fields[lastNamePrefixField].value;
        }
        const lastNameField = fieldsGroup.fields.findIndex(x => x.data.id === 'relativesLastNameId');
        if (lastNameField > -1) {
            relative.relationLastName = fieldsGroup.fields[lastNameField].value;
        }
        const suffixField = fieldsGroup.fields.findIndex(x => x.data.id === 'relativesSuffixId');
        if (suffixField > -1) {
            relative.relationSuffix = fieldsGroup.fields[prefixField].value === '' ? null : fieldsGroup.fields[prefixField].value;
        }
        const relationshipField = fieldsGroup.fields.findIndex(x => x.data.id === 'relativesRelationshipId');
        if (relationshipField > -1) {
            relative.relationType = fieldsGroup.fields[relationshipField].value;
        }
        const attendedInstitutionField = fieldsGroup.fields.findIndex(x => x.data.id === 'relativesAttendedInstitutionId');
        if (attendedInstitutionField > -1) {
            relative.attendedInstitution = Boolean(fieldsGroup.fields[attendedInstitutionField].value);
        }
        return relative;
    };

    private setApplicationRelativeValues = (relative: IApplicationRelative): IApplicationRelative => {
        relative.applicationId = relative.applicationId || 0;
        relative.relationMiddleName = relative.relationMiddleName || '';
        relative.relationLastNamePrefix = relative.relationLastNamePrefix || '';

        return relative;
    };

    private setApplicationActivitiesValues =
        (activity: IApplicationActivity, activityList: IApplicationActivity[]): IApplicationActivity[] => {
            activity.activityType = activity.activityType || 0;
            activity.activity = activity.activity || 0;
            activity.hoursPerWeek = activity.hoursPerWeek || 0;
            activity.weeksPerYear = activity.weeksPerYear || 0;
            activity.numberOfYears = activity.numberOfYears || 0;
            activity.participatedGrade09 = activity.participatedGrade09 || false;
            activity.participatedGrade10 = activity.participatedGrade10 || false;
            activity.participatedGrade11 = activity.participatedGrade11 || false;
            activity.participatedGrade12 = activity.participatedGrade12 || false;
            activity.participatedPostsecondary = activity.participatedPostsecondary || false;

            if (activity.activityType !== 0 && activity.activity !== 0) {
                activityList.push(activity);
            }
            else if (activity.position || activity.hoursPerWeek || activity.weeksPerYear ||
                activity.numberOfYears || activity.participatedGrade09 || activity.participatedGrade10 ||
                activity.participatedGrade11 || activity.participatedGrade12 || activity.participatedPostsecondary) {
                activityList.push(activity);
            }
            return activityList;
        };

    private setIpedsValuesCheckList = (fieldsGroup: IFieldsGroup): void => {
        const {
            application
        } = this.state;

        const ipedsCheckList = fieldsGroup.fields[3].value;
        if (ipedsCheckList) {
            const array = Object.values(ipedsCheckList.split(','));
            array.forEach(iped => {
                if (application.ipeds) {
                    let index: number = -1;
                    index = application.ipeds.findIndex(x => x.ipedsFederalCategoryId === 1
                        && x.ipedsEthnicityId === Number(iped));
                    if (index === -1) {
                        application.ipeds.push({
                            ipedsEthnicityId: Number(iped),
                            ipedsFederalCategoryId: 1
                        });
                    }
                }
                else {
                    application.ipeds = [{
                        ipedsEthnicityId: Number(iped),
                        ipedsFederalCategoryId: 1
                    }];
                }
            });
        }

        this.setState({
            application: application
        });
    };

    private setIpedsValuesNestedCheckList = (fieldsGroup: IFieldsGroup): void => {
        const {
            application
        } = this.state;

        const ipedsNestedCheckboxList = fieldsGroup.fields[4].value;
        if (ipedsNestedCheckboxList) {
            const ipedsArray = ipedsNestedCheckboxList.split(',');
            ipedsArray.forEach(iped => {
                const ipedItem = iped.split('$');
                if (ipedItem[0] !== '') {
                    if (ipedItem.length > 1) {
                        if (application.ipeds) {
                            application.ipeds.push({
                                ipedsEthnicityId: ipedItem[1] !== '' ? Number(ipedItem[1]) : undefined,
                                ipedsFederalCategoryId: Number(ipedItem[0])
                            });
                        }
                        else {
                            application.ipeds = [{
                                ipedsEthnicityId: ipedItem[1] !== '' ? Number(ipedItem[1]) : undefined,
                                ipedsFederalCategoryId: Number(ipedItem[0])
                            }];
                        }
                    }
                    else {
                        if (application.ipeds) {
                            application.ipeds.push({
                                ipedsFederalCategoryId: Number(ipedItem[0])
                            });
                        }
                        else {
                            application.ipeds = [{
                                ipedsFederalCategoryId: Number(ipedItem[0])
                            }];
                        }
                    }
                }
            });
        }

        this.setState({
            application: application
        });
    };

    // #endregion Set Values for Collections
    // #endregion Functions

    // #region Error Functions
    private logError = (logData: ILogData): void => {
        LayoutActions.setLogData(logData);
    };

    private redirectError = (code: number): void => {
        LayoutActions.setRedirectCode(code);
    };

    private showError = (message?: string): void => {
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    };
    // #endregion Error Functions

    // #region Resolvers
    private resolveLayoutReady = () => {
        try {
            const {
                application,
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;

                if (application) {
                    const hdnAppId: HTMLInputElement | undefined =
                        document.getElementById('hdnApplicationId') as HTMLInputElement;
                    if (hdnAppId && hdnAppId.value) {
                        application.applicationId = Number(hdnAppId.value);
                        hdnAppId.remove();
                        Requests.getComponents(application.applicationId, this.resolveGetComponents, this.logError);

                        const hdnTransactionId: HTMLInputElement | undefined =
                            document.getElementById('hdnTransactionId') as HTMLInputElement;
                        const hdnTransactionStatus: HTMLInputElement | undefined =
                            document.getElementById('hdnTransactionStatus') as HTMLInputElement;
                        const hdnTransactionAmount: HTMLInputElement | undefined =
                            document.getElementById('hdnTransactionAmount') as HTMLInputElement;
                        const hdnTransactionDescription: HTMLInputElement | undefined =
                            document.getElementById('hdnTransactionDescription') as HTMLInputElement;
                        const hdnTransactionAuthorizationNumber: HTMLInputElement | undefined =
                            document.getElementById('hdnTransactionAuthorizationNumber') as HTMLInputElement;
                        const hdnTransactionReturnUrl: HTMLInputElement | undefined =
                            document.getElementById('hdnTransactionReturnUrl') as HTMLInputElement;
                        if (hdnTransactionId && hdnTransactionId.value
                            && hdnTransactionStatus
                            && hdnTransactionAmount
                            && hdnTransactionDescription
                            && hdnTransactionAuthorizationNumber
                            && hdnTransactionReturnUrl) {
                            const paymentTransaction: IPaymentTransaction = {
                                amount: hdnTransactionAmount.value,
                                authorizationNumber: hdnTransactionAuthorizationNumber.value,
                                description: hdnTransactionDescription.value,
                                returnUrl: hdnTransactionReturnUrl.value,
                                status: Number(hdnTransactionStatus.value),
                                transactionId: Number(hdnTransactionAmount.value)
                            } as IPaymentTransaction;
                            this.setState({
                                paymentModalOpenFail: Number(hdnTransactionStatus.value) === 0,
                                paymentModalOpenSuccess: Number(hdnTransactionStatus.value) === 1,
                                paymentTransaction: paymentTransaction
                            });
                            hdnTransactionId.remove();
                            hdnTransactionStatus.remove();
                            hdnTransactionAmount.remove();
                            hdnTransactionDescription.remove();
                            hdnTransactionAuthorizationNumber.remove();
                            hdnTransactionReturnUrl.remove();
                        }
                    }
                    else {
                        const hdnSavedApplicationToken: HTMLInputElement | undefined =
                            document.getElementById('hdnSavedApplicationToken') as HTMLInputElement;
                        if (hdnSavedApplicationToken && hdnSavedApplicationToken.value) {
                            this.setState({
                                token: hdnSavedApplicationToken.value
                            });
                            hdnSavedApplicationToken.remove();
                            Requests.getSavedApplicationComponents(hdnSavedApplicationToken.value, this.resolveGetComponents, this.logError);
                        }
                    }
                }
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };

    private resolveCountries = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveCountries.name);

            if (result?.status) {
                const countries: any = result.data;

                this.setState({
                    countries: countries
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveCountries.name, e));
        }
    };

    private resolveGetAddress = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAddress.name);

            if (result?.status) {
                const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(result.data.overallCount
                    ? result.data.overallCount : 0);
                this.setState({
                    addresses: result.data.addresses,
                    rowsPerPageOptions,
                    total: result.data.overallCount
                });
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAddress.name, e));
        }
    };

    private resolveGetComponents = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetComponents.name);

            if (result?.status) {
                const components: IApplicationForm = result.data;
                if (components.steps) {
                    const errors: IApplicationErrors[] = Array(components.steps.length);
                    if (components.applicationFormId > 0) {
                        const {
                            application
                        } = this.state;

                        application.applicationId = components.applicationFormId;
                    }
                    if (components.savedApplicationId) {
                        const {
                            application
                        } = this.state;

                        application.savedApplicationId = components.savedApplicationId;
                    }
                    if (components.canSaveApplication) {
                        this.setState({
                            confirmationMessage: components.confirmationSaveMessage,
                            saveMessage: components.footerSaveMessage,
                            showSaveButton: components.canSaveApplication
                        });
                    }

                    components.steps.forEach((step, i) => {
                        errors[i] = { isStepError: false, groupErrors: Array(step.fieldsGroups.length), stepTitle: step.title };
                        for (let j = 0; j < step.fieldsGroups.length; j++) {
                            errors[i].groupErrors[j] = {
                                firstSectionErrors: {
                                    firstFieldsErrors: [],
                                    isFirstSectionErrors: false
                                },
                                groupId: step.fieldsGroups[j].id,
                                isGroupError: false,
                                sectionErrors: []
                            };
                        }
                    });

                    const {
                        paymentModalOpenFail,
                        paymentModalOpenSuccess
                    } = this.state;

                    if (paymentModalOpenFail || paymentModalOpenSuccess) {
                        components.isCompletedApplication = true;
                        this.setState({
                            showAttachments: false
                        });
                    }

                    if(components) {    
                        const {
                            application
                        } = this.state;
                        
                        const hdnAppCurp: HTMLInputElement | undefined =
                            document.getElementById('hdnCurp') as HTMLInputElement;

                        if (hdnAppCurp && hdnAppCurp.value) {
                            const app: IApplication = application;
                            const strgovernmentId: string =String(hdnAppCurp.value);
                            const strfield: string ='governmentId|0|4|0'
                            const fieldId: string[] = strfield.split('|');
                            let newComponents: IApplicationForm = components;
                            hdnAppCurp.remove();
            
                            app.governmentId=strgovernmentId;
            
                            newComponents = this.setValues(fieldId, newComponents, strgovernmentId);
            
                            this.setState({
                                application: app,
                                components: newComponents,
                                errors: errors
                            }, () => LayoutActions.setLoading(false));
                        }
                        else{
                            this.setState({
                                components: components,
                                errors: errors
                            }, () => LayoutActions.setLoading(false));
                        }
                    }
                    else{
                        this.setState({
                            components: components,
                            errors: errors
                        }, () => LayoutActions.setLoading(false));
                    }

                    const fileSelector = this.buildFileSelector();

                    this.setState({
                        fileSelector: fileSelector
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetComponents.name, e));
        }
    };

    private resolveGetChildOptions = (json: string): void => {
        try {
            const {
                components
            } = this.state;

            if (components) {
                const result: IJsonResult | undefined
                    = Resolver(json, this.resolveGetChildOptions.name);

                if (result?.status) {
                    if (result.data) {
                        if (result.data.step && result.data.group && result.data.targetId) {
                            const fields: any = components.steps[Number(result.data.step)].fieldsGroups[Number(result.data.group)].fields;
                            const fieldIndex: number =
                                fields.findIndex(x => x.data.id === result.data.targetId);
                            if (fieldIndex > -1) {
                                const childField: IFieldForm = fields[fieldIndex];
                                if (result.data.results) {
                                    childField.data.options = result.data.results as IDropDownOption[];
                                }
                                else {
                                    childField.data.options = [] as IDropDownOption[];
                                }
                                if (childField) {
                                    childField.value = undefined;
                                }
                                this.setState({
                                    components: components
                                });
                            }
                        }
                    }
                }
            }
        } catch (e) {
            this.logError(LogData.fromException(this.resolveGetChildOptions.name, e));
        }
    };

    private resolveGetInstitutions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetInstitutions.name);

            if (result?.status) {
                const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(result.data.overallCount
                    ? result.data.overallCount : 0);
                this.setState({
                    institutions: result.data.institutions,
                    rowsPerPageOptions,
                    total: result.data.overallCount
                });
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetInstitutions.name, e));
        }
    };

    private resolveStates = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveStates.name);

            if (result?.status) {
                const states: any = result.data;

                this.setState({
                    states: states
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveStates.name, e));
        }
    };

    private resolveSaveIncompleteApplication = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveIncompleteApplication.name);

            if (result?.status) {
                if (result.data.result) {
                    const {
                        components
                    } = this.state;
                    // Send notification
                    if (components && result.data.token && result.data.email && components.name) {
                        LayoutActions.setLoading(false);
                        const urlToSend = `${window.location.origin}${Constants.webUrl}/Admissions/ApplicationForm/Saved/${result.data.token}`;
                        Requests.postCreateSaveApplicationNotification(urlToSend,
                            result.data.email, components.name, this.resolveCreateSaveApplicationNotification, this.logError);
                        this.setState({
                            openConfirmationSavedModal: true
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveIncompleteApplication.name, e));
        }
    };

    private resolveCreateSaveApplicationNotification = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveCreateSaveApplicationNotification.name);

            if (!result?.status) {
                this.logError(LogData.badJsonResult(this.resolveCreateSaveApplicationNotification.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveCreateSaveApplicationNotification.name, e));
        }
    };

    private resolveSubmitApplication = (json: string): void => {
        try {
            const {
                components
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSubmitApplication.name);

            if (result?.status) {
                if (result.data.result) {
                    if (components) {
                        if (result.data.applicationId) {
                            this.setState({
                                applicationId: result.data.applicationId
                            });
                        }
                        if (result.data.paymentInfo) {
                            this.setState({
                                paymentInfo: result.data.paymentInfo
                            });
                        }
                        // Attachments are after sumbit and before payment
                        if (components.allowAttachment) {
                            const {
                                applicationId
                            } = this.state;
                            if (applicationId !== undefined && applicationId > 0) {
                                Requests.postListApplicationAttachments(applicationId, this.resolveGetListApplicationAttachments, this.logError);
                                this.setState({
                                    showAttachments: true
                                });
                            }
                        }
                        else {
                            if (result.data.paymentInfo) {
                                const returnUrl =
                                    `${Constants.webUrl}/Admissions/ApplicationForm/${components.applicationFormId}`;

                                this.setState({
                                    paymentDetailModalOpen: true,
                                    paymentInfo: result.data.paymentInfo,
                                    returnUrl: returnUrl
                                });
                            }
                            else {
                                components.isCompletedApplication = true;
                                this.setState({
                                    components: components
                                });
                            }
                        }
                        LayoutActions.setLoading(false);
                    }
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSubmitApplication.name, e));
        }
    };

    private resolveValidateScore = (json: string): void => {
        try {
            const {
                components
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveValidateScore.name);

            if (result?.status && components) {
                components.steps.forEach(step => {
                    const group: IFieldsGroup | undefined = step.fieldsGroups.find(g => g.id === result.data.group);
                    if (group) {
                        const field: IFieldForm | undefined = group.fields.find(f => f.data.id === result.data.componentId);
                        if (field) {
                            if (result.data.isNumeric) {
                                field.isNumeric = true;
                            } else {
                                field.isNumeric = false;
                            }
                        }
                    }
                });

                this.setState({
                    components: this.state.components
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveValidateScore.name, e));
        }
    };

    private resolveCreateAttachment = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveCreateAttachment.name);

            if (result?.status) {
                if (result.data.result) {
                    const {
                        applicationId
                    } = this.state;
                    if (applicationId !== undefined && applicationId > 0) {
                        LayoutActions.setLoading(true);
                        Requests.postListApplicationAttachments(applicationId, this.resolveGetListApplicationAttachments, this.logError);
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveCreateAttachment.name, e));
        }
    };

    private resolveGetListApplicationAttachments = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetListApplicationAttachments.name);

            if (result?.status) {
                if (result.data) {
                    this.setState({
                        attachments: result.data.appAttachmentsViewModel,
                        openRemoveAttachmentDialog: false
                    });
                    const {
                        applicationId
                    } = this.state;
                    if (applicationId) {
                        LayoutActions.setLoading(true);
                        Requests.GetApplicationAttachmentTotals(applicationId, this.resolveGetAttachmentTotals, this.logError);
                    }
                    const fileSelector = this.buildFileSelector();
                    this.setState({
                        fileSelector: fileSelector
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetListApplicationAttachments.name, e));
        }
    };

    private resolveRemoveAttachment = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveRemoveAttachment.name);

            if (result?.status) {
                if (result.data) {
                    const {
                        applicationId
                    } = this.state;
                    if (applicationId) {
                        LayoutActions.setLoading(true);
                        Requests.postListApplicationAttachments(applicationId, this.resolveGetListApplicationAttachments, this.logError);
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveRemoveAttachment.name, e));
        }
    };

    private resolveGetAttachmentTotals = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAttachmentTotals.name);

            if (result?.status) {
                this.setState({
                    attachmentsTotalSize: result.data.appAttachmentTotalsViewModel.totalAttachmentSize,
                    attachmentsTotalSizeNumber: Number(result.data.appAttachmentTotalsViewModel.totalAttachmentSizeNumber),
                    totalNumberOfAttachments: Number(result.data.appAttachmentTotalsViewModel.totalNumberOfAttachments)
                });
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAttachmentTotals.name, e));
        }
    };

    private resolveGetGeneralSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetGeneralSettings.name);
            if (result?.status) {
                this.setState({
                    governmentIdFormat: result.data.general.governmentIdFormat
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetGeneralSettings.name, e));
        }
    };

    private resolveGetReCaptchaSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetReCaptchaSettings.name);
            if (result?.status) {
                this.setState({
                    isReCaptchaSubmitApplicationEnabled: result.data.isReCaptchaSubmitApplicationEnabled,
                    reCaptchaSiteKey: result.data.reCaptchaSiteKey || ''
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetReCaptchaSettings.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IApplicationFormResources | undefined = LayoutStore.getResources();
        const cultures: ICultures = LayoutStore.getCultures();

        if (ready) {
            Requests.getStates(this.resolveStates, this.logError);
            Requests.getCountries(this.resolveCountries, this.logError);
            Requests.getGeneralSettings(this.resolveGetGeneralSettings);
            Requests.getReCaptchaSettings(this.resolveGetReCaptchaSettings);

            this.setState({
                dateTimeCulture: cultures.dateTimeCulture,
                firstDayOfWeek: cultures.firstDayOfWeek,
                shortDatePattern: cultures.shortDatePattern,

                // Resources
                resources: resources
            }, this.resolveLayoutReady);
        }
        else {
            this.setState({
                componentError: true
            }, () => this.logError(LogData.layoutNoReady(this.onLayoutReady.name)));
        }
    };
    // #endregion State Management Events

    // #region Lifecycle
    public componentWillUnmount = (): void => {
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);
    };

    public componentDidCatch = (error, info): void => {
        this.setState({
            componentError: true
        }, () => {
            this.logError(LogData.fromComponentException(this.componentDidCatch.name, error, info));
            this.redirectError(500);
        });
    };
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            activeStep,
            addresses,
            attachments,
            attachmentsTotalSize,
            changeEmailText,
            componentError,
            components,
            confirmationMessage,
            countries,
            dateTimeCulture,
            emailField,
            emptyEmailField,
            errors,
            expanded,
            fileName,
            firstDayOfWeek,
            hasPersonId,
            hasSearchZipCode,
            institutions,
            invalidEmail,
            openAddressSearchModal,
            openETSSearchModal,
            pageNumber,
            pageSize,
            paymentModalOpenFail,
            paymentModalOpenSuccess,
            paymentTransaction,
            resources,
            rowsPerPageOptions,
            openConfirmationSavedModal,
            openEmailModal,
            openNotAvailableModal,
            openRemoveAttachmentDialog,
            openSupportedFilesModal,
            saveMessage,
            selectedCity,
            selectedCountry,
            selectedEtsCode,
            selectedInstitutionName,
            selectedState,
            selectedZipCode,
            shortDatePattern,
            showAttachments,
            showSaveButton,
            showSignIn,
            showSignUp,
            states,
            total,

            // Payment
            paymentDetailModalOpen,
            paymentInfo,
            paymentModalOpenProcess,
            returnUrl,

            // Settings
            governmentIdFormat,

            // ReCaptcha
            isReCaptchaSubmitApplicationEnabled,
            reCaptchaError,
            reCaptchaSiteKey,
            uiCulture
        } = this.state;

        // #region Payment modals
        let processPaymentModal: JSX.Element | undefined;
        if (paymentModalOpenProcess && paymentInfo) {
            processPaymentModal = (
                <ProcessPaymentModal
                    amount={paymentInfo.totalAmountValue}
                    applicationId={paymentInfo.applicationId}
                    open={paymentDetailModalOpen}
                    paymentOrigin={PaymentOrigin.Application}
                    returnUrl={returnUrl}
                    onClose={this.onClosePaymentModalProcess}
                />
            );
        }
        // #endregion Payment modals

        let addressSearchModal: JSX.Element | undefined;

        if (resources && resources.addressSearchModal) {
            addressSearchModal = (
                <AddressSearchModal
                    addresses={addresses}
                    hasSearchZipCode={hasSearchZipCode}
                    open={openAddressSearchModal}
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                    rowsPerPageOptions={rowsPerPageOptions}
                    totalAddress={total}
                    zipCode={selectedZipCode}
                    onChangePage={this.onChangePageAddress}
                    onChangeRowsPerPage={this.onChangeRowsPerPage}
                    onChangeTextField={this.onChangeTextFieldAddressSearch}
                    onClear={this.onClearAddress}
                    onClickLink={this.onClickZipCodeLink}
                    onClose={this.onCloseAddressSearchModal}
                    onSearch={this.onSearchAddress}
                    resources={resources.addressSearchModal}
                />
            );
        }

        let etsSearchModal: JSX.Element | undefined;
        if (resources && resources.etsSearchModal && states && countries) {
            etsSearchModal = (
                <ETSSearchModal
                    city={selectedCity}
                    countries={countries}
                    country={selectedCountry}
                    etsCode={selectedEtsCode}
                    institutionName={selectedInstitutionName}
                    institutions={institutions}
                    open={openETSSearchModal}
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                    rowsPerPageOptions={rowsPerPageOptions}
                    state={selectedState}
                    states={states}
                    totalInstitutions={total}
                    onChangeDropDownETSSearch={this.onChangeDropDownETSSearch}
                    onChangePage={this.onChangePage}
                    onChangeRowsPerPage={this.onChangeRowsPerPage}
                    onChangeTextFieldETSSearch={this.onChangeTextFieldETSSearch}
                    onClear={this.onClearInstitution}
                    onClickLink={this.onClickLink}
                    onClose={this.onCloseETSSearchModal}
                    onSearch={this.onSearchInstitution}
                    resources={resources.etsSearchModal}
                />
            );
        }

        let confirmationSavedModal: JSX.Element | undefined;
        if (resources && confirmationMessage) {
            confirmationSavedModal = (
                <ConfirmationSavedModal
                    confirmationMessage={confirmationMessage}
                    open={openConfirmationSavedModal}
                    onCloseModal={this.onCloseConfirmationSavedModal}
                    resources={resources.confirmationSavedModal}
                />
            );
        }

        let emailModal: JSX.Element | undefined;
        if (resources && openEmailModal) {
            emailModal = (
                <Modal
                    disableBackdropClick
                    footer={(
                        <Button
                            id="btnSaveEmail"
                            onClick={this.onSaveEmailField}
                        >
                            {resources.emailModal.lblSave}
                        </Button>
                    )}
                    id="emailModal"
                    header={resources.emailModal.lblSaveApplication}
                    maxWidth="md"
                    open={openEmailModal}
                    onClose={this.onCloseEmailModal}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                            <Text>
                                {emailField && changeEmailText ? resources.emailModal.lblSaveApplicationInstructions
                                    : resources.emailModal.lblSaveApplicationEmptyEmailIns}
                            </Text>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                error={emptyEmailField || invalidEmail}
                                helperText={emptyEmailField ?
                                    resources.emailModal.lblEnterEmail :
                                    (invalidEmail ?
                                        resources.emailModal.lblInvalidEmal : '')}
                                id="txtEmailField"
                                label={emailField && changeEmailText ? resources.emailModal.lblEmailAddress
                                    : resources.emailModal.lblEmptyEmailAddress}
                                required={true}
                                type="text"
                                value={emailField}
                                onChange={this.onChangeTextFieldModal}
                            />
                        </Grid>
                    </Grid>
                </Modal>
            );
        }

        let notAvailableModal: JSX.Element | undefined;
        if (resources && openNotAvailableModal) {
            notAvailableModal = (
                <Modal
                    disableBackdropClick
                    footer={(
                        <Button
                            id="btnOk"
                            onClick={this.onCloseNotAvailableModal}
                        >
                            {resources.notAvailableModal.lblOk}
                        </Button>
                    )}
                    id="notAvailableModal"
                    header={resources.notAvailableModal.lblNotAvailable}
                    maxWidth="md"
                    open={openNotAvailableModal}
                    onClose={this.onCloseNotAvailableModal}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                            <Text>
                                {resources.notAvailableModal.lblNotAvailableMessage}
                            </Text>
                        </Grid>
                    </Grid>
                </Modal>
            );
        }

        let supportedFiles: JSX.Element | undefined;
        if (resources && components && components.fileTypes) {
            const supportedFilesBody: JSX.Element[] = [];
            components.fileTypes.forEach((availableFileType, i) => {
                let fileExt = '';
                const fileExtensions = availableFileType.fileExtension.split(';');
                fileExtensions.forEach(fExt => {
                    fileExt = fileExt + fExt.replace('*.', '');
                });
                fileExt = fileExt.replace(/ /g, ', ');
                supportedFilesBody.push(
                    <TableRow key={`supportedFilesRow_${i}`}>
                        <TableCell>
                            <span>
                                {fileExt}
                            </span>
                        </TableCell>
                    </TableRow>
                );
            });

            supportedFiles = (
                <Table id="tblSupportedFiles">
                    <TableBody>
                        {supportedFilesBody}
                    </TableBody>
                </Table>
            );
        }

        let supportedFilesModal: JSX.Element | undefined;
        if (resources && openSupportedFilesModal) {
            supportedFilesModal = (
                <Modal
                    disableBackdropClick
                    footer={(
                        <Button
                            id="btnCancel"
                            onClick={this.onCloseSupportedFilesModal}
                        >
                            {resources.attachments.lblClose}
                        </Button>
                    )}
                    id="supportedFilesModal"
                    header={resources.attachments.lblSupportedFilesTitle}
                    maxWidth="md"
                    open={openSupportedFilesModal}
                    onClose={this.onCloseSupportedFilesModal}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                            {supportedFiles}
                        </Grid>
                    </Grid>
                </Modal>
            );
        }

        let attachmentsComponent: JSX.Element | undefined;
        if (resources && components && components.fileTypes) {
            attachmentsComponent = (
                <Attachments
                    attachments={attachments}
                    numberOfAttachments={components.numberOfAttachments}
                    totalSize={attachmentsTotalSize}
                    resources={resources.attachments}
                    onClickContinue={this.onClickContinue}
                    onClickInfo={this.onClickInfo}
                    onClickOpenFolder={this.onClickOpenFolder}
                    onClickRemoveAttachment={this.onClickRemoveAttachmentButton}
                    onPagoRefer={this.onPagoRefer}
                />
            );
        }

        let removeAttachmentModal: JSX.Element | undefined;
        if (resources && openRemoveAttachmentDialog) {
            removeAttachmentModal = (
                <ConfirmationDialog
                    contentText={Format.toString(resources.attachments.lblRemoveConfirmation, [fileName])}
                    open={openRemoveAttachmentDialog}
                    primaryActionOnClick={this.onClickRemoveAttachment}
                    primaryActionText={resources.attachments.lblAcceptConfirmation}
                    secondaryActionOnClick={this.onCloseRemoveAttachmentModal}
                    secondaryActionText={resources.attachments.lblCancelConfirmation}
                    title={resources.attachments.lblRemoveTitle}
                />
            );
        }

        let signInModal: JSX.Element | undefined;
        if (!hasPersonId) {
            signInModal = (
                <SignIn
                    open={showSignIn}
                    onAfterSignIn={this.onAfterSignIn}
                    onClose={this.onCloseSignIn}
                    onGoSignUp={this.onOpenSignUp}
                />
            );
        }

        let signUpModal: JSX.Element | undefined;
        if (showSignUp) {
            signUpModal = (
                <SignUp
                    open={showSignUp}
                    type="Application"
                    onAfterSignUp={this.onAfterSignUp}
                    onClose={this.onCloseSignUp}
                    onGoSignIn={this.onOpenSignIn}
                />
            );
        }

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            // #region Payment Info modal
            let paymentInfoModal: JSX.Element | undefined;
            if (paymentInfo && components && paymentDetailModalOpen) {
                paymentInfoModal = (
                    <PaymentDetailModal
                        enableOnlinePayment
                        open={paymentDetailModalOpen}
                        paymentInfo={paymentInfo}
                        paymentInfoNoChanges={paymentInfo}
                        paymentOrigin={PaymentOrigin.Application}
                        titleName={components.name}
                        onClose={this.onClosePaymentDetailModal}
                        onPay={this.onPay}
                    />
                );
            }
            // #endregion Payment Info modal

            if (components) {
                if (!showAttachments) {
                    contentPage = (
                        <>
                            <ApplicationHandler
                                activeStep={activeStep}
                                components={components}
                                dateTimeCulture={dateTimeCulture}
                                errors={errors}
                                expanded={expanded}
                                failedPayment={paymentModalOpenFail}
                                firstDayOfWeek={firstDayOfWeek}
                                governmentIdFormat={governmentIdFormat}
                                isReCaptchaSubmitEnabled={isReCaptchaSubmitApplicationEnabled}
                                paymentTransaction={paymentTransaction}
                                reCaptchaError={reCaptchaError}
                                reCaptchaSiteKey={reCaptchaSiteKey}
                                reCaptchaRef={this.reCaptchaRef}
                                resources={resources.applicationHandler}
                                saveMessage={saveMessage}
                                shortDatePattern={shortDatePattern}
                                showSaveButton={showSaveButton}
                                successPayment={paymentModalOpenSuccess}
                                uiCulture={uiCulture}
                                onAddMore={this.onAddMore}
                                onBackStep={this.onBackStep}
                                onChangeCheckBox={this.onChangeCheckBox}
                                onChangeDateTimeField={this.onChangeDateTimeField}
                                onChangeDropDown={this.onChangeDropDown}
                                onChangeExpansionPanel={this.onChangeExpansionPanel}
                                onChangeListCheckbox={this.onChangeListCheckbox}
                                onChangeRadioGroup={this.onChangeRadioGroup}
                                onChangeTextField={this.onChangeTextField}
                                onClickButton={this.onClickButton}
                                onClickSave={this.onSaveApplication}
                                onClickStep={this.onClickStep}
                                onCloseFailedPayment={this.onCloseFailedPayment}
                                onDeleteItem={this.onDeleteItem}
                                onNextStep={this.onNextStep}
                                onRecaptchaChange={this.onRecaptchaChange}
                                onReCaptchaError={this.onReCaptchaError}
                                onSubmit={this.onSubmit}
                            />
                            {paymentInfoModal}
                        </>
                    );
                }
                else {
                    contentPage = (
                        <>
                            {attachmentsComponent}
                        </>
                    );
                }
            }
        }

        return (
            <Layout
                hideHeader
                idMainPage={this.idMainPage}
                idModule={this.idModule}
                idPage={this.idPage}
                showCart
                showNotifications
            >
                {contentPage}
                {addressSearchModal}
                {etsSearchModal}
                {processPaymentModal}
                {confirmationSavedModal}
                {emailModal}
                {notAvailableModal}
                {supportedFilesModal}
                {removeAttachmentModal}
                {signInModal}
                {signUpModal}
            </Layout>
        );
    }
}

const ApplicationFormViewWithLayout = withLayout(ApplicationFormView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<ApplicationFormViewWithLayout />, document.getElementById('root'));