/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ApplicationSetupView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';

// Internal components
import AppAddComponentModal from './AppAddComponentModal';
import AppAddOptionsModal from './AppAddOptionsModal';
import AppFieldGroupSetup from './AppFieldGroupSetup';
import AppFieldSetup from './AppFieldSetup';
import AppNameSetup from './AppNameSetup';
import AppSendToModal from './AppSendToModal';
import AppSetupHandler from './AppSetupHandler';
import AppSetupStepModal from './AppSetupStepModal';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IAppSetupForm } from '../../../Types/Form/IAppSetupForm';
import { IFieldSetup } from '../../../Types/Form/IFieldSetup';
import { IFieldsGroupSetup } from '../../../Types/Form/IFieldsGroupSetup';
import { IStepSetup } from '../../../Types/Form/IStepSetup';
import { IValidatorMessage } from '../../../Types/Form/IValidatorMessage';
import { IApplicationSetupResources } from '../../../Types/Resources/Administration/IApplicationSetupResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// Requests
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import RequestLayout from '../../../Requests/Administration/FormLayouts';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IApplicationSetupState {
    activeStep: number;
    appForm?: IAppSetupForm;
    appLayoutId: number;
    availableColors?: IDropDownOption[];
    availableComponents?: IDropDownOption[];
    availableCounties?: IDropDownOption[];
    availableCountries?: IDropDownOption[];
    availableDataTypes?: IDropDownOption[];
    availableGridSizes?: IDropDownOption[];
    availablePrograms?: IDropDownOption[];
    availableStates?: IDropDownOption[];
    availableSteps?: IDropDownOption[];
    availableOptions?: IDropDownOption[];
    availableTextSizes?: IDropDownOption[];
    availableTypes?: IDropDownOption[];
    componentError: boolean;
    emptyComponent: boolean;
    fieldGroupId?: string;
    fieldId?: string;
    fields?: IFieldSetup[];
    fieldGroupInstructions?: string;
    fieldIdToEdit?: string[];
    fieldGroupLabel?: string;
    fieldGroupToEdit?: string[];
    fieldLabel?: string;
    layoutDescription?: string;
    layoutName?: string;
    layoutNameIsEmpty: boolean;
    layoutNameNotValid: boolean;
    maxAllowed?: string;
    openAddComponet: boolean;
    openAddOption: boolean;
    openConfirmationRemove: boolean;
    openFieldGroupModal: boolean;
    openFieldModal: boolean;
    openNameSetupModal: boolean;
    openSendToModal: boolean;
    openStepSetupModal: boolean;
    selectedComponet?: string | number;
    selectedDefault?: string | number;
    selectedFieldGridSize?: string | number;
    selectedGridSize?: string | number;
    selectedStep?: number;
    selectedUserDefinedDataType?: string | number;
    selectedUserDefinedType?: string | number;
    stepIndex?: number;
    stepModified: boolean;
    stepTitle?: string;

    // empty flags for fields
    emptyFDuplicatedMessage: boolean;
    emptyFInvFormatMessage: boolean;
    emptyFGridSize: boolean;
    emptyFLabel: boolean;
    emptyFNotNumericMessage: boolean;
    emptyFNotValidMessage: boolean;
    emptyFRangeMessage: boolean;
    emptyFRequiredMessage: boolean;

    // empty flags for fields groups
    emptyFGDuplicatedMessage: boolean;
    emptyFGFormatMessage: boolean;
    emptyFGNotValidMessage: boolean;
    emptyFGRangeMessage: boolean;
    emptyFGRequiredMessage: boolean;

    // empty flags for fields groups with one field
    emptyGridSize: boolean;
    emptyInvFormatMessage: boolean;
    emptyLabel: boolean;
    emptyMaxAllowed: boolean;
    emptyNotNumericMessage: boolean;
    emptyNotValidMessage: boolean;
    emptyOutRangeMessage: boolean;
    emptyRequiredMessage: boolean;

    // user defined flags
    emptyAddOptDescription: boolean;
    emptyAddOptValue: boolean;
    emptyDataType: boolean;
    emptyId: boolean;
    emptyMaxLength: boolean;
    emptyType: boolean;

    // text filds flags
    emptyColor: boolean;
    emptyTextSize: boolean;

    // validation messages for fields
    validatorFDupValidator?: string;
    validatorFFormatMessage?: string;
    validatorFNotNumericMessage?: string;
    validatorFNotValidMessage?: string;
    validatorFRangeValidator?: string;
    validatorFRequiredMessage?: string;

    // validation messages for field groups
    validatorFGDupMessage?: string;
    validatorFGInvFormatMessage?: string;
    validatorFGNotValidMessage?: string;
    validatorFGRangeMessage?: string;
    validatorFGRequiredMessage?: string;

    // validation messages for field groups with one field
    validatorInvFormatMessage?: string;
    validatorNotNumericMessage?: string;
    validatorNotValidMessage?: string;
    validatorOutRangeMessage?: string;
    validatorRequiredMessage?: string;

    // user defined
    optionDescription?: string;
    optionValue?: string;
    userDefinedCustomScript?: string;
    userDefinedId?: string;
    userDefinedIsRequired: boolean;
    userDefinedIsUploading: boolean;
    userDefinedLabel?: string;
    userDefinedMaxLength?: string;
    validatorUserDefinedOutRangeMsg?: string;
    validatorUserDefinedRequiredMessage?: string;

    // text fields
    isWithLink: boolean;
    selectedColor?: string | number;
    selectedTextSize?: string | number;
    textActionUrl?: string;
    textId?: string;
    textLabel?: string;

    // divider, htmlElement, Iimage
    emptyAlt: boolean;
    emptySrc: boolean;
    textAlt?: string;
    textSrc?: string;

    resources?: IApplicationSetupResources;
}
// #endregion Types

// #region Component
class ApplicationSetupView extends React.Component<any, IApplicationSetupState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IApplicationSetupState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'ApplicationSetup';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IApplicationSetupState {
        let resources: IApplicationSetupResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            activeStep: 0,
            appLayoutId: 0,
            componentError: false,
            emptyComponent: false,
            layoutNameIsEmpty: false,
            layoutNameNotValid: false,
            openAddComponet: false,
            openAddOption: false,
            openConfirmationRemove: false,
            openFieldGroupModal: false,
            openFieldModal: false,
            openNameSetupModal: false,
            openSendToModal: false,
            openStepSetupModal: false,
            stepModified: false,

            // empty flags for fields
            emptyFDuplicatedMessage: false,
            emptyFGridSize: false,
            emptyFInvFormatMessage: false,
            emptyFLabel: false,
            emptyFNotNumericMessage: false,
            emptyFNotValidMessage: false,
            emptyFRangeMessage: false,
            emptyFRequiredMessage: false,

            // empty flags for fields groups
            emptyFGDuplicatedMessage: false,
            emptyFGFormatMessage: false,
            emptyFGNotValidMessage: false,
            emptyFGRangeMessage: false,
            emptyFGRequiredMessage: false,

            // empty flags for fields groups with one field
            emptyGridSize: false,
            emptyInvFormatMessage: false,
            emptyLabel: false,
            emptyMaxAllowed: false,
            emptyNotNumericMessage: false,
            emptyNotValidMessage: false,
            emptyOutRangeMessage: false,
            emptyRequiredMessage: false,

            // user defined
            emptyAddOptDescription: false,
            emptyAddOptValue: false,
            emptyDataType: false,
            emptyId: false,
            emptyMaxLength: false,
            emptyType: false,
            userDefinedIsRequired: false,
            userDefinedIsUploading: false,

            // text fields
            emptyColor: false,
            emptyTextSize: false,
            isWithLink: false,

            // Divider, HtmlElement, Image
            emptyAlt: false,
            emptySrc: false,

            resources: resources
        };
    }

    // #region Events
    private onChangeCheckBox = (event: any): void => {
        try {
            const id: string = event.target.id;
            const value: boolean = Boolean(event.target.checked);
            switch (id) {
                case 'chkUserDefinedIsRequired':
                    this.setState({
                        emptyRequiredMessage: false,
                        userDefinedIsRequired: value
                    });
                    break;
                case 'chkUserDefinedIsUploading':
                    this.setState({
                        userDefinedIsUploading: value
                    });
                    break;
                case 'chkIsWithLink':
                    this.setState({
                        isWithLink: value
                    });
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckBox.name, e));
        }
    };

    private onChangeDropDown = (optionSelected: IDropDownOption, id: string): void => {
        try {
            if (optionSelected) {
                switch (id) {
                    case 'ddlComponents':
                        this.setState({
                            emptyAddOptDescription: false,
                            emptyAddOptValue: false,
                            emptyAlt: false,
                            emptyColor: false,
                            emptyDataType: false,
                            emptyGridSize: false,
                            emptyId: false,
                            emptyInvFormatMessage: false,
                            emptyLabel: false,
                            emptyMaxAllowed: false,
                            emptyNotNumericMessage: false,
                            emptyNotValidMessage: false,
                            emptyOutRangeMessage: false,
                            emptyRequiredMessage: false,
                            emptySrc: false,
                            emptyTextSize: false,
                            emptyType: false,
                            isWithLink: false,
                            optionDescription: undefined,
                            optionValue: undefined,
                            selectedColor: undefined,
                            selectedComponet:
                                optionSelected.value,
                            selectedTextSize: undefined,
                            textActionUrl: undefined,
                            textAlt: undefined,
                            textId: undefined,
                            textLabel: undefined,
                            textSrc: undefined,
                            userDefinedCustomScript: undefined,
                            userDefinedId: undefined,
                            userDefinedIsRequired: false,
                            userDefinedIsUploading: false,
                            userDefinedLabel: undefined,
                            userDefinedMaxLength: undefined,
                            validatorUserDefinedOutRangeMsg: undefined,
                            validatorUserDefinedRequiredMessage: undefined
                        });
                        break;
                    case 'ddlUserDefinedType':
                        this.setState({
                            emptyType:
                                false,
                            selectedUserDefinedType:
                                optionSelected.value
                        });
                        break;
                    case 'ddlUserDefinedDataType':
                        this.setState({
                            emptyDataType:
                                false,
                            selectedUserDefinedDataType:
                                optionSelected.value
                        });
                        break;
                    case 'ddlGridSize':
                        this.setState({
                            emptyGridSize:
                                false,
                            selectedGridSize:
                                optionSelected.value
                        });
                        break;
                    case 'ddlDefault':
                        this.setState({
                            selectedDefault:
                                optionSelected.value
                        });
                        break;
                    case 'ddlFGGridSize':
                        this.setState({
                            emptyFGridSize:
                                false,
                            selectedFieldGridSize:
                                optionSelected.value
                        });
                        break;
                    case 'ddlTextSize':
                        this.setState({
                            emptyTextSize:
                                false,
                            selectedTextSize:
                                optionSelected.value
                        });
                        break;
                    case 'ddlTextColor':
                        this.setState({
                            emptyColor:
                                false,
                            selectedColor:
                                optionSelected.value
                        });
                        break;
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropDown.name, e));
        }
    };

    private onChangeExpansionPanel = (stepIndex: number) => (): void => {
        try {
            this.setState({
                activeStep: stepIndex
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeExpansionPanel.name, e));
        }
    };

    private onChangeSendToDropDown = (optionSelected: IDropDownOption): void => {
        try {
            if (optionSelected) {
                this.setState({
                    selectedStep: Number(optionSelected.value)
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeSendToDropDown.name, e));
        }
    };

    private onChangeTextField = (event: any): void => {
        try {
            const id = event.target.id;
            const onlyNum = new RegExp(/([A-Za-zñ<> äÄëËïÏöÖüÜáÁéÉíÍóÓúÚýÝ'¿"#_-Ä-´°%;&¨Ñ,¡.*+?^=!:$(){}|[\]\/\\])/g);
            switch (id) {
                // #region Form
                case 'txtName':
                    const noSpecialChars = new RegExp(/([<>äÄëËïÏöÖüÜ'¿"#´°%;&¨¡*+?^=!:${}|[\]\/\\])/g);
                    event.target.value = event.target.value.replace(noSpecialChars, '');
                    this.setState({
                        layoutName: event.target.value,
                        layoutNameIsEmpty: false
                    });
                    break;
                case 'txtDescription':
                    this.setState({
                        layoutDescription: event.target.value
                    });
                    break;
                // #endregion Form

                // #region Step
                case 'txtStepTitle':
                    this.setState({
                        stepTitle: event.target.value
                    });
                    break;
                // #endregion Step

                // #region Field Group with one field
                case 'txtFieldGroupLabel':
                    this.setState({
                        emptyLabel: false,
                        fieldGroupLabel: event.target.value
                    });
                    break;
                case 'txtFGInstructions':
                    this.setState({
                        fieldGroupInstructions: event.target.value
                    });
                    break;
                case 'txtFGMaxAllowed':
                    event.target.value = event.target.value.replace(onlyNum, '');
                    this.setState({
                        maxAllowed: event.target.value
                    });
                    break;
                case 'txtInvFormat':
                    this.setState({
                        emptyInvFormatMessage: false,
                        validatorInvFormatMessage: event.target.value
                    });
                    break;
                case 'txtNotNumeric':
                    this.setState({
                        emptyNotNumericMessage: false,
                        validatorNotNumericMessage: event.target.value
                    });
                    break;
                case 'txtNotValid':
                    this.setState({
                        emptyNotValidMessage: false,
                        validatorNotValidMessage: event.target.value
                    });
                    break;
                case 'txtOutRange':
                    this.setState({
                        emptyOutRangeMessage: false,
                        validatorOutRangeMessage: event.target.value
                    });
                    break;
                case 'txtRequired':
                    this.setState({
                        emptyRequiredMessage: false,
                        validatorRequiredMessage: event.target.value
                    });
                    break;
                // #endregion Field Group with one field

                // #region Fields Groups
                case 'txtFGDuplicated':
                    this.setState({
                        emptyFGDuplicatedMessage: false,
                        validatorFGDupMessage: event.target.value
                    });
                    break;
                case 'txtFGInvFormat':
                    this.setState({
                        emptyFGFormatMessage: false,
                        validatorFGInvFormatMessage: event.target.value
                    });
                    break;
                case 'txtFGNotValid':
                    this.setState({
                        emptyFGNotValidMessage: false,
                        validatorFGNotValidMessage: event.target.value
                    });
                    break;
                case 'txtFGOutRange':
                    this.setState({
                        emptyFGRangeMessage: false,
                        validatorFGRangeMessage: event.target.value
                    });
                    break;
                case 'txtFGRequired':
                    this.setState({
                        emptyFGRequiredMessage: false,
                        validatorFGRequiredMessage: event.target.value
                    });
                    break;
                // #endregion Fields Groups

                // #region Fields
                case 'txtFieldLabel':
                    this.setState({
                        emptyFLabel: false,
                        fieldLabel: event.target.value
                    });
                    break;
                case 'txtFDuplicated':
                    this.setState({
                        emptyFDuplicatedMessage: false,
                        validatorFDupValidator: event.target.value
                    });
                    break;
                case 'txtFInvFormat':
                    this.setState({
                        emptyFInvFormatMessage: false,
                        validatorFFormatMessage: event.target.value
                    });
                    break;
                case 'txtFInvFormat':
                    this.setState({
                        emptyFNotNumericMessage: false,
                        validatorFNotNumericMessage: event.target.value
                    });
                    break;
                case 'txtFNotNumeric':
                    this.setState({
                        emptyFNotNumericMessage: false,
                        validatorFNotNumericMessage: event.target.value
                    });
                    break;
                case 'txtFNotValid':
                    this.setState({
                        emptyFNotValidMessage: false,
                        validatorFNotValidMessage: event.target.value
                    });
                    break;
                case 'txtFOutRange':
                    this.setState({
                        emptyFRangeMessage: false,
                        validatorFRangeValidator: event.target.value
                    });
                    break;
                case 'txtFRequired':
                    this.setState({
                        emptyFRequiredMessage: false,
                        validatorFRequiredMessage: event.target.value
                    });
                    break;
                // #endregion Fields

                // #region User Defined
                case 'txtUserDefinedId':
                    this.setState({
                        emptyId: false,
                        userDefinedId: event.target.value
                    });
                    break;
                case 'txtUserDefinedLabel':
                    this.setState({
                        emptyLabel: false,
                        userDefinedLabel: event.target.value
                    });
                    break;
                case 'txtUserDefinedMaxLength':
                    event.target.value = event.target.value.replace(onlyNum, '');
                    this.setState({
                        emptyMaxLength: false,
                        userDefinedMaxLength: event.target.value
                    });
                    break;
                case 'txtUserDefinedRequired':
                    this.setState({
                        emptyRequiredMessage: false,
                        validatorUserDefinedRequiredMessage:
                            event.target.value
                    });
                    break;
                case 'txtUserDefinedOutRange':
                    this.setState({
                        emptyOutRangeMessage: false,
                        validatorUserDefinedOutRangeMsg:
                            event.target.value
                    });
                    break;
                case 'txtUserDefinedCustomScript':
                    this.setState({
                        userDefinedCustomScript:
                            event.target.value
                    });
                    break;
                case 'txtOptionDescription':
                    this.setState({
                        optionDescription: event.target.value
                    });
                    break;
                case 'txtOptionValue':
                    this.setState({
                        optionValue: event.target.value
                    });
                    break;
                // #endregion User Defined
                // #region Text
                case 'txtTextId':
                    this.setState({
                        emptyId: false,
                        textId: event.target.value
                    });
                    break;
                case 'txtTextLabel':
                    this.setState({
                        emptyLabel: false,
                        textLabel: event.target.value
                    });
                    break;
                case 'txtTextActionUrl':
                    this.setState({
                        textActionUrl: event.target.value
                    });
                    break;
                // #endregion Text
                // #region Divider, HtmlElement, Image
                case 'txtSrcText':
                    this.setState({
                        emptySrc: false,
                        textSrc: event.target.value
                    });
                    break;
                case 'txtAltText':
                    this.setState({
                        emptyAlt: false,
                        textAlt: event.target.value
                    });
                    break;
                case 'txtTextValue':
                    this.setState({
                        emptyLabel: false,
                        textLabel: event.target.value
                    });
                    break;
                // #endregion Divider, HtmlElement, Image
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onClickAddComponent = (event: any): void => {
        try {
            const id = event.currentTarget.id.split('|');

            const {
                appForm
            } = this.state;

            if (appForm && appForm.steps) {
                const stepIndex: number =
                    appForm.steps.findIndex(x => x.stepNumber === Number(id[1]));
                if (stepIndex > -1) {
                    this.setState({
                        openAddComponet: true,
                        stepIndex: stepIndex
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickAddComponent.name, e));
        }
    };

    private onClickAddOptions = (): void => {
        try {
            this.setState({
                openAddOption: true,
                optionDescription: '',
                optionValue: ''
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickAddOptions.name, e));
        }
    };

    private onClickAddNewStep = () => {
        try {
            const {
                appForm
            } = this.state;

            if (appForm) {
                const applicationSetup: IAppSetupForm = appForm;
                if (applicationSetup && applicationSetup.steps) {
                    this.setState({
                        openStepSetupModal: true,
                        stepIndex: applicationSetup.steps.length + 1,
                        stepModified: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickAddNewStep.name, e));
        }
    };

    private onClickCancelRemoveComponet = () => {
        try {
            this.setState({
                openConfirmationRemove: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickCancelRemoveComponet.name, e));
        }
    };

    private onClickDownButton = (event: any): void => {
        try {
            const id = event.currentTarget.id.split('|');
            const {
                appForm
            } = this.state;
            const applicationForm: IAppSetupForm | undefined = appForm;

            if (applicationForm && applicationForm.steps) {
                const stepNumber: number = Number(id[1]);
                const stepIndex: number = applicationForm.steps.findIndex(x =>
                    x.stepNumber === stepNumber);

                if (applicationForm.steps.length > stepIndex + 1) {
                    if (stepIndex > -1) {
                        if (applicationForm.steps[stepIndex].stepNumber >= 0) {
                            const stepNumber: number = applicationForm.steps[stepIndex].stepNumber;
                            applicationForm.steps[stepIndex + 1].stepNumber = stepNumber;
                            applicationForm.steps[stepIndex].stepNumber = stepNumber + 1;

                            this.setState({
                                activeStep: stepIndex + 1,
                                appForm: applicationForm
                            });

                            event.stopPropagation();
                            event.preventDefault();
                        }
                    }
                }
            }
        }
        catch (e) {
            LayoutActions.setLoading(false);
            this.logError(LogData.fromException(this.onClickDownButton.name, e));
        }
    };

    private onClickDownFieldButton = (event: any): void => {
        try {
            const id = event.currentTarget.id.split('|');
            const {
                fields
            } = this.state;
            const newFields: IFieldSetup[] | undefined = fields;
            if (newFields) {
                const fieldIndex: number = newFields.findIndex(x => x.sortOrder === Number(id[1]));
                if (fieldIndex > -1) {
                    if (newFields.length > fieldIndex + 1) {
                        const fieldNumber: number =
                            newFields[fieldIndex].sortOrder;
                        newFields[fieldIndex + 1].sortOrder = fieldNumber;
                        newFields[fieldNumber].sortOrder = fieldNumber + 1;

                        this.setState({
                            fields: newFields
                        });
                    }
                }
            }
        }
        catch (e) {
            LayoutActions.setLoading(false);
            this.logError(LogData.fromException(this.onClickDownFieldButton.name, e));
        }
    };

    private onClickDownFieldGroupButton = (event: any): void => {
        try {
            const id = event.currentTarget.id.split('|');
            const {
                appForm
            } = this.state;
            const applicationForm: IAppSetupForm | undefined = appForm;

            if (id[0] === 'iconFooterButtonDown' ||
                id[0] === 'iconConfirmationButtonDown') {
                if (applicationForm && applicationForm.fieldsGroups) {
                    let fieldGroupIndex: number = -1;
                    if (id[0] === 'iconFooterButtonDown') {
                        fieldGroupIndex = applicationForm.fieldsGroups.
                            findIndex(x => x.id === 'footerGroup');
                    }
                    if (id[0] === 'iconConfirmationButtonDown') {
                        fieldGroupIndex = applicationForm.fieldsGroups.
                            findIndex(x => x.id === 'confirmationGroup');
                    }
                    if (fieldGroupIndex > -1) {
                        const fieldIndex: number =
                            applicationForm.fieldsGroups[fieldGroupIndex].
                                fields.findIndex(x => x.sortOrder ===
                                    Number(id[2]));
                        if (fieldIndex > -1) {
                            if (applicationForm.fieldsGroups[fieldGroupIndex].
                                fields.length > fieldIndex + 1) {
                                applicationForm.fieldsGroups[fieldGroupIndex].
                                    fields[fieldIndex + 1].sortOrder =
                                    Number(id[2]);
                                applicationForm.fieldsGroups[fieldGroupIndex].
                                    fields[fieldIndex].sortOrder =
                                    Number(id[2]) + 1;
                                this.setState({
                                    appForm: applicationForm
                                });
                            }
                        }
                    }
                }
            }

            else {
                if (applicationForm && applicationForm.steps) {
                    const stepNumber: number = Number(id[1]);
                    const fieldGroupNumber: number = Number(id[2]);
                    const stepIndex: number = applicationForm.steps.
                        findIndex(x => x.stepNumber === stepNumber);
                    const fieldGroupIndex: number = applicationForm.
                        steps[stepIndex].stepFieldGroups.findIndex(x =>
                            x.sortOrder === fieldGroupNumber);

                    if (applicationForm.steps[stepIndex].
                        stepFieldGroups.length > fieldGroupIndex + 1) {
                        if (fieldGroupIndex > -1) {
                            if (applicationForm.steps[stepIndex].
                                stepFieldGroups[fieldGroupIndex].sortOrder >= 0) {
                                const fgNumber: number =
                                    applicationForm.steps[stepIndex].
                                        stepFieldGroups[fieldGroupIndex].sortOrder;
                                applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex + 1].sortOrder =
                                    fgNumber;
                                applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].
                                    sortOrder = fgNumber + 1;
                                this.setState({
                                    appForm: applicationForm
                                });
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            LayoutActions.setLoading(false);
            this.logError(LogData.fromException(this.onClickDownFieldGroupButton.name, e));
        }
    };

    private onClickRemoveComponent = (): void => {
        try {
            const {
                appForm,
                fieldIdToEdit
            } = this.state;

            if (appForm && appForm.steps && fieldIdToEdit) {
                const stepNumber: number = Number(fieldIdToEdit[1]);
                const fieldGroupNumber: number = Number(fieldIdToEdit[2]);
                const stepIndex: number = appForm.steps.findIndex(x =>
                    x.stepNumber === stepNumber);
                const fieldGroupIndex: number =
                    appForm.steps[stepIndex].stepFieldGroups.findIndex(x =>
                        x.sortOrder === fieldGroupNumber);
                appForm.steps[stepIndex].stepFieldGroups.splice(fieldGroupIndex, 1);
                this.setState({
                    appForm: appForm,
                    availableOptions: undefined,
                    emptyColor: false,
                    emptyDataType: false,
                    emptyId: false,
                    emptyLabel: false,
                    emptyRequiredMessage: false,
                    emptyTextSize: false,
                    emptyType: false,
                    fieldIdToEdit: undefined,
                    isWithLink: false,
                    openAddComponet: false,
                    openConfirmationRemove: false,
                    selectedColor: undefined,
                    selectedComponet: undefined,
                    selectedGridSize: undefined,
                    selectedTextSize: undefined,
                    selectedUserDefinedDataType: undefined,
                    selectedUserDefinedType: undefined,
                    stepIndex: undefined,
                    textActionUrl: undefined,
                    textId: undefined,
                    textLabel: undefined,
                    userDefinedCustomScript: undefined,
                    userDefinedId: undefined,
                    userDefinedIsRequired: false,
                    userDefinedIsUploading: false,
                    userDefinedLabel: undefined,
                    userDefinedMaxLength: undefined,
                    validatorUserDefinedOutRangeMsg: undefined,
                    validatorUserDefinedRequiredMessage: undefined
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickRemoveComponent.name, e));
        }
    };

    private onClickRemoveOption = (event: any): void => {
        try {
            const id = event.currentTarget.id.split('_');
            const {
                availableOptions
            } = this.state;

            if (availableOptions) {
                availableOptions.splice(Number(id[1]), 1);
                this.setState({
                    availableOptions: availableOptions
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickRemoveOption.name, e));
        }
    };

    private onClickSendToButton = (event: any): void => {
        try {
            const id = event.currentTarget.id.split('|');
            if (id && id.length === 3) {
                const {
                    appForm
                } = this.state;

                const applicationForm: IAppSetupForm | undefined = appForm;

                if (applicationForm && applicationForm.steps) {
                    const stepNumber: number = Number(id[1]);
                    const fieldGroupNumber: number = Number(id[2]);
                    const stepIndex: number = applicationForm.steps.findIndex(x =>
                        x.stepNumber === stepNumber);
                    const fieldGroupIndex: number = applicationForm.steps[stepIndex].
                        stepFieldGroups.findIndex(x =>
                            x.sortOrder === fieldGroupNumber);

                    const newSteps = this.getAvailableSteps(applicationForm);
                    this.setState({
                        availableSteps: newSteps,
                        fieldGroupId: applicationForm.steps[stepIndex].
                            stepFieldGroups[fieldGroupIndex].id,
                        fieldGroupToEdit: id,
                        openSendToModal: true,
                        selectedStep: undefined
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickSendToButton.name, e));
        }
    };

    private onClickUpButton = (event: any): void => {
        try {
            const id = event.currentTarget.id.split('|');
            const {
                appForm
            } = this.state;
            const applicationForm: IAppSetupForm | undefined = appForm;

            if (applicationForm && applicationForm.steps) {
                const stepNumber: number = Number(id[1]);
                const stepIndex: number = applicationForm.steps.findIndex(x =>
                    x.stepNumber === stepNumber);

                if (stepIndex > -1) {
                    if (applicationForm.steps[stepIndex].stepNumber > 1) {
                        const stepIndex: number = applicationForm.steps.findIndex(x =>
                            x.stepNumber === stepNumber);
                        applicationForm.steps[stepIndex - 1].stepNumber = stepNumber;
                        applicationForm.steps[stepIndex].stepNumber = stepNumber - 1;

                        this.setState({
                            activeStep: stepIndex - 1,
                            appForm: applicationForm
                        });

                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            }
        }
        catch (e) {
            LayoutActions.setLoading(false);
            this.logError(LogData.fromException(this.onClickUpButton.name, e));
        }
    };

    private onClickUpFieldButton = (event: any): void => {
        try {
            const id = event.currentTarget.id.split('|');
            const {
                fields
            } = this.state;
            const newFields: IFieldSetup[] | undefined = fields;
            if (newFields) {
                const fieldIndex: number = newFields.findIndex(x => x.sortOrder === Number(id[1]));
                if (fieldIndex > -1) {
                    if (newFields[fieldIndex].sortOrder > 1) {
                        const fieldNumber: number =
                            newFields[fieldIndex].sortOrder;
                        newFields[fieldIndex - 1].sortOrder = fieldNumber;
                        newFields[fieldNumber].sortOrder = fieldNumber - 1;

                        this.setState({
                            fields: newFields
                        });
                    }
                }
            }
        }
        catch (e) {
            LayoutActions.setLoading(false);
            this.logError(LogData.fromException(this.onClickDownFieldButton.name, e));
        }
    };

    private onClickUpFieldGroupButton = (event: any): void => {
        try {
            const id = event.currentTarget.id.split('|');
            const {
                appForm
            } = this.state;
            const applicationForm: IAppSetupForm | undefined = appForm;

            if (id[0] === 'iconFooterButtonUp' ||
                id[0] === 'iconConfirmationButtonUp') {
                if (applicationForm && applicationForm.fieldsGroups) {
                    let fieldGroupIndex: number = -1;
                    if (id[0] === 'iconFooterButtonUp') {
                        fieldGroupIndex = applicationForm.fieldsGroups.
                            findIndex(x => x.id === 'footerGroup');
                    }
                    if (id[0] === 'iconConfirmationButtonUp') {
                        fieldGroupIndex = applicationForm.fieldsGroups.
                            findIndex(x => x.id === 'confirmationGroup');
                    }
                    if (fieldGroupIndex > -1) {
                        const fieldIndex: number =
                            applicationForm.fieldsGroups[fieldGroupIndex].
                                fields.findIndex(x => x.sortOrder ===
                                    Number(id[2]));
                        if (fieldIndex > -1) {
                            if (fieldIndex > -1) {
                                applicationForm.fieldsGroups[fieldGroupIndex].
                                    fields[fieldIndex - 1].sortOrder =
                                    Number(id[2]);
                                applicationForm.fieldsGroups[fieldGroupIndex].
                                    fields[fieldIndex].sortOrder =
                                    Number(id[2]) - 1;
                                this.setState({
                                    appForm: applicationForm
                                });
                            }
                        }
                    }
                }
            }

            if (applicationForm && applicationForm.steps) {
                const stepNumber: number = Number(id[1]);
                const fieldGroupNumber: number = Number(id[2]);
                const stepIndex: number = applicationForm.steps.findIndex(x =>
                    x.stepNumber === stepNumber);
                const fieldGroupIndex: number = applicationForm.steps[stepIndex].
                    stepFieldGroups.findIndex(x =>
                        x.sortOrder === fieldGroupNumber);

                if (stepIndex > -1) {
                    if (applicationForm.steps[stepIndex].stepFieldGroups[fieldGroupIndex].
                        sortOrder > 0) {
                        const fgNumber: number =
                            applicationForm.steps[stepIndex].stepFieldGroups[fieldGroupIndex].
                                sortOrder;
                        if (fgNumber > -1) {
                            applicationForm.steps[stepIndex].stepFieldGroups[fieldGroupIndex - 1].
                                sortOrder = fgNumber;
                            applicationForm.steps[stepIndex].stepFieldGroups[fieldGroupIndex].
                                sortOrder = fgNumber - 1;
                            this.setState({
                                appForm: applicationForm
                            });
                        }
                    }
                }
            }
        }
        catch (e) {
            LayoutActions.setLoading(false);
            this.logError(LogData.fromException(this.onClickUpFieldGroupButton.name, e));
        }
    };

    private onCloseAddComponent = (): void => {
        try {
            this.setState({
                availableOptions: undefined,
                emptyAlt: false,
                emptyColor: false,
                emptyDataType: false,
                emptyId: false,
                emptyLabel: false,
                emptyMaxLength: false,
                emptyOutRangeMessage: false,
                emptyRequiredMessage: false,
                emptySrc: false,
                emptyTextSize: false,
                emptyType: false,
                fieldIdToEdit: undefined,
                isWithLink: false,
                openAddComponet: false,
                openConfirmationRemove: false,
                selectedColor: undefined,
                selectedComponet: undefined,
                selectedGridSize: undefined,
                selectedTextSize: undefined,
                selectedUserDefinedDataType: undefined,
                selectedUserDefinedType: undefined,
                stepIndex: undefined,
                textActionUrl: undefined,
                textAlt: undefined,
                textId: undefined,
                textLabel: undefined,
                textSrc: undefined,
                userDefinedCustomScript: undefined,
                userDefinedId: undefined,
                userDefinedIsRequired: false,
                userDefinedIsUploading: false,
                userDefinedLabel: undefined,
                userDefinedMaxLength: undefined,
                validatorUserDefinedOutRangeMsg: undefined,
                validatorUserDefinedRequiredMessage: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAddComponent.name, e));
        }
    };

    private onCloseAddOption = (): void => {
        try {
            this.setState({
                openAddOption: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAddOption.name, e));
        }
    };

    private onCloseAppNameSetup = (): void => {
        try {
            const {
                appForm
            } = this.state;

            if (appForm) {
                if (appForm.formLayoutId > 1) {
                    this.setState({
                        openNameSetupModal: false
                    });
                }
                else {
                    window.location.href = `${Constants.webUrl}/Administration/FormsSetup`;
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAppNameSetup.name, e));
        }
    };

    private onCloseFieldGroupSetup = (): void => {
        try {
            const {
                appForm,
                fieldGroupToEdit
            } = this.state;

            if (appForm && fieldGroupToEdit) {
                const stepNumber: number = Number(fieldGroupToEdit[1]);
                const fieldGroupNumber: number = Number(fieldGroupToEdit[2]);
                if (appForm.steps && appForm.steps.length > 0) {
                    const stepIndex: number = appForm.steps.findIndex(x =>
                        x.stepNumber === stepNumber);
                    const fieldGroupIndex: number = appForm.steps[stepIndex].stepFieldGroups.findIndex(x =>
                        x.sortOrder === fieldGroupNumber);

                    this.setState({
                        fields: appForm.steps[stepIndex].stepFieldGroups[fieldGroupIndex].fields
                    });
                }
                this.setState({
                    emptyFGDuplicatedMessage: false,
                    emptyFGFormatMessage: false,
                    emptyFGNotValidMessage: false,
                    emptyFGRangeMessage: false,
                    emptyFGRequiredMessage: false,
                    emptyGridSize: false,
                    emptyInvFormatMessage: false,
                    emptyLabel: false,
                    emptyNotNumericMessage: false,
                    emptyNotValidMessage: false,
                    emptyOutRangeMessage: false,
                    emptyRequiredMessage: false,
                    fieldGroupLabel: undefined,
                    fieldGroupToEdit: undefined,
                    fields: undefined,
                    maxAllowed: undefined,
                    openFieldGroupModal: false,
                    selectedDefault: undefined,
                    selectedFieldGridSize: undefined,
                    textAlt: undefined,
                    textId: undefined,
                    textLabel: undefined,
                    textSrc: undefined,
                    validatorFGDupMessage: undefined,
                    validatorFGInvFormatMessage: undefined,
                    validatorFGNotValidMessage: undefined,
                    validatorFGRangeMessage: undefined,
                    validatorFGRequiredMessage: undefined,
                    validatorInvFormatMessage: undefined,
                    validatorNotNumericMessage: undefined,
                    validatorNotValidMessage: undefined,
                    validatorOutRangeMessage: undefined,
                    validatorRequiredMessage: undefined
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseFieldGroupSetup.name, e));
        }
    };

    private onCloseFieldSetup = (): void => {
        try {
            this.setState({
                emptyFGridSize: false,
                emptyFInvFormatMessage: false,
                emptyFLabel: false,
                emptyFNotNumericMessage: false,
                emptyFNotValidMessage: false,
                emptyFRangeMessage: false,
                emptyFRequiredMessage: false,
                fieldIdToEdit: undefined,
                openFieldModal: false,
                selectedDefault: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseFieldSetup.name, e));
        }
    };

    private onCloseSendTo = (): void => {
        try {
            this.setState({
                openSendToModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSendTo.name, e));
        }
    };

    private onCloseSetupStep = (): void => {
        try {
            this.setState({
                openStepSetupModal: false,
                stepTitle: ''
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSetupStep.name, e));
        }
    };

    private onEditField = (event: any): void => {
        try {
            const id = event.currentTarget.id.split('|');
            if (id) {
                const {
                    fields
                } = this.state;
                if (fields) {
                    const {
                        availableCounties,
                        availableCountries,
                        availablePrograms,
                        availableStates
                    } = this.state;

                    if (!availableCounties) {
                        this.getAvailableCounties();
                    }

                    if (!availableCountries) {
                        this.getAvailableCountries();
                    }

                    if (!availablePrograms) {
                        this.getAvailablePrograms();
                    }

                    if (!availableStates) {
                        this.getAvailableStates();
                    }

                    const fieldIndex: number =
                        fields.findIndex(x => x.sortOrder === Number(id[1]));
                    this.setState({
                        emptyFGridSize: false,
                        emptyFInvFormatMessage: false,
                        emptyFLabel: false,
                        emptyFNotNumericMessage: false,
                        emptyFNotValidMessage: false,
                        emptyFRangeMessage: false,
                        emptyFRequiredMessage: false,
                        fieldId: fields[fieldIndex].id,
                        fieldIdToEdit: id,
                        fieldLabel: fields[fieldIndex].label,
                        openFieldModal: true,
                        selectedFieldGridSize: fields[fieldIndex].gridSize
                    });

                    if (fields[fieldIndex].validatorMessages &&
                        fields[fieldIndex].validatorMessages.length > 0) {
                        if (fields[fieldIndex].validatorMessages[0]) {
                            if (fields[fieldIndex].validatorMessages[0].isDuplicated) {
                                this.setState({
                                    validatorFDupValidator:
                                        fields[fieldIndex].validatorMessages[0].isDuplicated
                                });
                            }

                            if (fields[fieldIndex].validatorMessages[0].isRequired) {
                                this.setState({
                                    validatorFRequiredMessage:
                                        fields[fieldIndex].validatorMessages[0].isRequired
                                });
                            }

                            if (fields[fieldIndex].validatorMessages[0].notNumeric) {
                                this.setState({
                                    validatorFNotNumericMessage:
                                        fields[fieldIndex].validatorMessages[0].notNumeric
                                });
                            }

                            if (fields[fieldIndex].validatorMessages[0].notValid) {
                                this.setState({
                                    validatorFNotValidMessage:
                                        fields[fieldIndex].validatorMessages[0].notValid
                                });
                            }

                            if (fields[fieldIndex].validatorMessages[0].outOfRange) {
                                this.setState({
                                    validatorFRangeValidator:
                                        fields[fieldIndex].validatorMessages[0].outOfRange
                                });
                            }
                        }
                    }

                    const defaultValue = fields[fieldIndex].default;
                    if (defaultValue) {
                        this.setState({
                            selectedDefault: defaultValue.toString()
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditField.name, e));
        }
    };

    private onEditFieldGroup = (event: any): void => {
        try {
            const id = event.currentTarget.id.split('|');
            if (id && id.length === 3) {
                const {
                    appForm
                } = this.state;
                const applicationForm: IAppSetupForm | undefined = appForm;

                if (id[0] === 'iconEditFooterButton' ||
                    id[0] === 'iconEditConfirmationButton') {
                    let fielgGroupIndex: number = -1;
                    if (appForm && appForm.fieldsGroups) {
                        if (id[0] === 'iconEditFooterButton') {
                            fielgGroupIndex = appForm.fieldsGroups.findIndex(x =>
                                x.id === 'footerGroup');
                        }
                        if (id[0] === 'iconEditConfirmationButton') {
                            fielgGroupIndex = appForm.fieldsGroups.findIndex(x =>
                                x.id === 'confirmationGroup');
                        }
                        if (fielgGroupIndex > -1) {
                            const fieldId: number =
                                appForm.fieldsGroups[fielgGroupIndex].fields.findIndex(x =>
                                    x.sortOrder === Number(id[2]));
                            if (fieldId > -1) {
                                this.setState({
                                    fieldIdToEdit: id,
                                    openAddComponet: true,
                                    selectedComponet: appForm.fieldsGroups[fielgGroupIndex].
                                        fields[fieldId].type,
                                    textId: appForm.fieldsGroups[fielgGroupIndex].
                                        fields[fieldId].id,
                                    textLabel: appForm.fieldsGroups[fielgGroupIndex].
                                        fields[fieldId].label
                                });
                                this.setState({
                                    selectedComponet: appForm.fieldsGroups[fielgGroupIndex].
                                        fields[fieldId].type
                                });
                                if (appForm.fieldsGroups[fielgGroupIndex].
                                    fields[fieldId].type === 'Text') {
                                    const isWithLink = appForm.fieldsGroups[fielgGroupIndex].
                                        fields[fieldId].isWithLink;
                                    if (isWithLink) {
                                        this.setState({
                                            isWithLink: isWithLink
                                        });
                                    }

                                    const color = appForm.fieldsGroups[fielgGroupIndex].
                                        fields[fieldId].color;
                                    if (color) {
                                        this.setState({
                                            selectedColor: color
                                        });
                                    }

                                    const textSize = appForm.fieldsGroups[fielgGroupIndex].
                                        fields[fieldId].size;
                                    if (textSize) {
                                        this.setState({
                                            selectedTextSize: textSize.toString()
                                        });
                                    }

                                    const actionUrl = appForm.fieldsGroups[fielgGroupIndex].
                                        fields[fieldId].actionUrl;
                                    if (actionUrl) {
                                        this.setState({
                                            textActionUrl: actionUrl
                                        });
                                    }
                                }
                                if (appForm.fieldsGroups[fielgGroupIndex].
                                    fields[fieldId].type === 'IconLinkPhone' ||
                                    appForm.fieldsGroups[fielgGroupIndex].
                                        fields[fieldId].type === 'IconLinkEmail' ||
                                    appForm.fieldsGroups[fielgGroupIndex].
                                        fields[fieldId].type === 'Button') {
                                    const actionUrl = appForm.fieldsGroups[fielgGroupIndex].
                                        fields[fieldId].actionUrl;
                                    if (actionUrl) {
                                        this.setState({
                                            textActionUrl: actionUrl
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    if (applicationForm && applicationForm.steps) {
                        const stepNumber: number = Number(id[1]);
                        const fieldGroupNumber: number = Number(id[2]);
                        const stepIndex: number = applicationForm.steps.findIndex(x =>
                            x.stepNumber === stepNumber);
                        const fieldGroupIndex: number = applicationForm.
                            steps[stepIndex].stepFieldGroups.findIndex(x =>
                                x.sortOrder === fieldGroupNumber);
                        const fieldGroupId: string =
                            applicationForm.steps[stepIndex].
                                stepFieldGroups[fieldGroupIndex].id;

                        // Custom Field Groups
                        if (applicationForm.steps[stepIndex].
                            stepFieldGroups[fieldGroupIndex].isCustom) {
                            let componentType: string = '';
                            if (applicationForm.steps[stepIndex].
                                stepFieldGroups[fieldGroupIndex].fields[0].isUserDefined) {
                                componentType = 'UserDefined';
                            }
                            else {
                                componentType =
                                    applicationForm.steps[stepIndex].
                                        stepFieldGroups[fieldGroupIndex].fields[0].type;
                            }
                            if (componentType === 'UserDefined') {
                                this.setState({
                                    availableOptions: applicationForm.steps[stepIndex].
                                        stepFieldGroups[fieldGroupIndex].fields[0].options,
                                    fieldIdToEdit: id,
                                    openAddComponet: true,
                                    selectedComponet: componentType,
                                    userDefinedId: applicationForm.steps[stepIndex].
                                        stepFieldGroups[fieldGroupIndex].fields[0].id,
                                    userDefinedLabel: applicationForm.steps[stepIndex].
                                        stepFieldGroups[fieldGroupIndex].fields[0].label

                                });
                                if (applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].fields[0].isUserDefined) {
                                    this.setState({
                                        selectedUserDefinedType: applicationForm.steps[stepIndex].
                                            stepFieldGroups[fieldGroupIndex].fields[0].type
                                    });
                                }
                                const isRequired = applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].fields[0].isRequired;
                                if (isRequired) {
                                    this.setState({
                                        userDefinedIsRequired: isRequired
                                    });
                                }

                                const isUploading = applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].fields[0].isUploading;
                                if (isUploading) {
                                    this.setState({
                                        userDefinedIsUploading: isUploading
                                    });
                                }

                                if (applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].fields[0].dataType) {
                                    this.setState({
                                        selectedUserDefinedDataType: applicationForm.steps[stepIndex].
                                            stepFieldGroups[fieldGroupIndex].fields[0].dataType
                                    });
                                }

                                if (applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].fields[0].customScript) {
                                    this.setState({
                                        userDefinedCustomScript: applicationForm.steps[stepIndex].
                                            stepFieldGroups[fieldGroupIndex].fields[0].customScript
                                    });
                                }
                                const maxLength = applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].fields[0].maxLength;
                                if (maxLength) {
                                    this.setState({
                                        userDefinedMaxLength: maxLength.toString()
                                    });
                                }
                                const validatorReq = applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].fields[0].validatorMessages[0];
                                if (validatorReq) {
                                    this.setState({
                                        validatorUserDefinedOutRangeMsg: validatorReq.outOfRange,
                                        validatorUserDefinedRequiredMessage: validatorReq.isRequired
                                    });
                                }

                                const gridSize = applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].fields[0].gridSize;
                                if (gridSize) {
                                    this.setState({
                                        selectedGridSize: gridSize
                                    });
                                }
                            }
                            if (componentType === 'Text') {
                                this.setState({
                                    fieldIdToEdit: id,
                                    openAddComponet: true,
                                    selectedComponet: componentType,
                                    textId: applicationForm.steps[stepIndex].
                                        stepFieldGroups[fieldGroupIndex].fields[0].id,
                                    textLabel: applicationForm.steps[stepIndex].
                                        stepFieldGroups[fieldGroupIndex].fields[0].label
                                });

                                const isWithLink = applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].fields[0].isWithLink;
                                if (isWithLink) {
                                    this.setState({
                                        isWithLink: isWithLink
                                    });
                                }

                                const color = applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].fields[0].color;
                                if (color) {
                                    this.setState({
                                        selectedColor: color
                                    });
                                }

                                const textSize = applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].fields[0].size;
                                if (textSize) {
                                    this.setState({
                                        selectedTextSize: textSize.toString()
                                    });
                                }

                                const actionUrl = applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].fields[0].actionUrl;
                                if (actionUrl) {
                                    this.setState({
                                        textActionUrl: actionUrl
                                    });
                                }
                            }
                            if (componentType === 'IconLinkEmail' ||
                                componentType === 'IconLinkPhone' ||
                                componentType === 'Button') {
                                this.setState({
                                    fieldIdToEdit: id,
                                    openAddComponet: true,
                                    selectedComponet: applicationForm.steps[stepIndex].
                                        stepFieldGroups[fieldGroupIndex].fields[0].type,
                                    textId: applicationForm.steps[stepIndex].
                                        stepFieldGroups[fieldGroupIndex].fields[0].id,
                                    textLabel: applicationForm.steps[stepIndex].
                                        stepFieldGroups[fieldGroupIndex].fields[0].label
                                });
                                const actionUrl = applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].fields[0].actionUrl;
                                if (actionUrl) {
                                    this.setState({
                                        textActionUrl: actionUrl
                                    });
                                }
                            }
                            if (componentType === 'Divider') {
                                this.setState({
                                    fieldIdToEdit: id,
                                    openAddComponet: true,
                                    selectedComponet: applicationForm.steps[stepIndex].
                                        stepFieldGroups[fieldGroupIndex].fields[0].type,
                                    textId: applicationForm.steps[stepIndex].
                                        stepFieldGroups[fieldGroupIndex].fields[0].id
                                });
                            }
                            if (componentType === 'HtmlElement') {
                                {
                                    this.setState({
                                        fieldIdToEdit: id,
                                        openAddComponet: true,
                                        selectedComponet: applicationForm.steps[stepIndex].
                                            stepFieldGroups[fieldGroupIndex].fields[0].type,
                                        textId: applicationForm.steps[stepIndex].
                                            stepFieldGroups[fieldGroupIndex].fields[0].id,
                                        textLabel: applicationForm.steps[stepIndex].
                                            stepFieldGroups[fieldGroupIndex].fields[0].value
                                    });
                                }
                            }
                            if (componentType === 'Image') {
                                {
                                    this.setState({
                                        fieldIdToEdit: id,
                                        openAddComponet: true,
                                        selectedComponet: applicationForm.steps[stepIndex].
                                            stepFieldGroups[fieldGroupIndex].fields[0].type,
                                        textAlt: applicationForm.steps[stepIndex].
                                            stepFieldGroups[fieldGroupIndex].fields[0].alt,
                                        textId: applicationForm.steps[stepIndex].
                                            stepFieldGroups[fieldGroupIndex].fields[0].id,
                                        textSrc: applicationForm.steps[stepIndex].
                                            stepFieldGroups[fieldGroupIndex].fields[0].src
                                    });
                                }
                            }
                        }
                        else {
                            const {
                                availableCountries
                            } = this.state;

                            if (!availableCountries) {
                                this.getAvailableCountries();
                            }
                            // Field Group with one field
                            if (fieldGroupId !== 'addressInformationGroup' &&
                                fieldGroupId !== 'educationGroup' &&
                                fieldGroupId !== 'emergencyContactGroup' &&
                                fieldGroupId !== 'employmentGroup' &&
                                fieldGroupId !== 'phoneGroup' &&
                                fieldGroupId !== 'ipedsGroup' &&
                                fieldGroupId !== 'programOfStudyGroup' &&
                                fieldGroupId !== 'testScoreGroup' &&
                                fieldGroupId !== 'activityGroup' &&
                                fieldGroupId !== 'relativesGroup' &&
                                fieldGroupId !== 'residencyGroup') {
                                let fieldIndex: number = 0;
                                if (fieldGroupId === 'interestGroup') {
                                    fieldIndex = 1;
                                }
                                const label: string = applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].fields[fieldIndex].label;
                                const gridSize = applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].fields[fieldIndex].gridSize;
                                const instructions: string =
                                    applicationForm.steps[stepIndex].
                                        stepFieldGroups[fieldGroupIndex].instructions;

                                this.setState({
                                    fieldGroupId: fieldGroupId,
                                    fieldGroupInstructions: instructions,
                                    fieldGroupLabel: label,
                                    fieldGroupToEdit: id,
                                    openFieldGroupModal: true,
                                    selectedGridSize: gridSize
                                });

                                if (applicationForm.steps[stepIndex].stepFieldGroups[fieldGroupIndex].
                                    fields[fieldIndex].validatorMessages) {
                                    const validationMessages: IValidatorMessage =
                                        applicationForm.steps[stepIndex].
                                            stepFieldGroups[fieldGroupIndex].fields[fieldIndex].validatorMessages[0];

                                    if (validationMessages) {
                                        if (validationMessages.isRequired) {
                                            this.setState({
                                                validatorRequiredMessage: validationMessages.isRequired
                                            });
                                        }

                                        if (validationMessages.invalidFormat) {
                                            this.setState({
                                                validatorInvFormatMessage: validationMessages.invalidFormat
                                            });
                                        }

                                        if (validationMessages.notNumeric) {
                                            this.setState({
                                                validatorNotNumericMessage: validationMessages.notNumeric
                                            });
                                        }

                                        if (validationMessages.notValid) {
                                            this.setState({
                                                validatorNotValidMessage: validationMessages.notValid
                                            });
                                        }

                                        if (validationMessages.outOfRange) {
                                            this.setState({
                                                validatorOutRangeMessage: validationMessages.outOfRange
                                            });
                                        }
                                    }
                                }

                                if (applicationForm.steps[stepIndex].stepFieldGroups[fieldGroupIndex].
                                    fields[fieldIndex].default) {
                                    this.setState({
                                        selectedDefault:
                                            applicationForm.steps[stepIndex].stepFieldGroups[fieldGroupIndex].
                                                fields[fieldIndex].default
                                    });
                                }
                            }
                            // Fields Groups
                            else {
                                if (applicationForm.steps[stepIndex].
                                    stepFieldGroups[fieldGroupIndex].
                                    validatorMessages) {
                                    const label: string =
                                        applicationForm.steps[stepIndex].stepFieldGroups[fieldGroupIndex].label;
                                    const instructions: string =
                                        applicationForm.steps[stepIndex].stepFieldGroups[fieldGroupIndex].instructions;

                                    if (applicationForm && stepIndex > -1 && fieldGroupIndex > -1 &&
                                        applicationForm.steps[stepIndex] && applicationForm.steps[stepIndex].
                                            stepFieldGroups[fieldGroupIndex]) {
                                        if (Number(applicationForm.steps[stepIndex].
                                            stepFieldGroups[fieldGroupIndex].maximumAllowed) > 0) {
                                            this.setState({
                                                maxAllowed: applicationForm.steps[stepIndex].
                                                    stepFieldGroups[fieldGroupIndex].maximumAllowed.toString()
                                            });
                                        }
                                    }

                                    const newFields: IFieldSetup[] =
                                        JSON.parse(JSON.stringify(applicationForm.steps[stepIndex]
                                            .stepFieldGroups[fieldGroupIndex]
                                            .fields));

                                    this.setState({
                                        fieldGroupId: fieldGroupId,
                                        fieldGroupInstructions: instructions,
                                        fieldGroupLabel: label,
                                        fieldGroupToEdit: id,
                                        fields: newFields,
                                        openFieldGroupModal: true
                                    });

                                    const validationMessages: IValidatorMessage = applicationForm.steps[stepIndex]
                                        .stepFieldGroups[fieldGroupIndex].validatorMessages[0];
                                    if (validationMessages) {
                                        if (validationMessages.isDuplicated) {
                                            this.setState({
                                                validatorFGDupMessage: validationMessages.isDuplicated
                                            });
                                        }
                                        if (validationMessages.invalidFormat) {
                                            this.setState({
                                                validatorFGInvFormatMessage: validationMessages.invalidFormat
                                            });
                                        }
                                        if (validationMessages.notValid) {
                                            this.setState({
                                                validatorFGNotValidMessage: validationMessages.notValid
                                            });
                                        }
                                        if (validationMessages.outOfRange) {
                                            this.setState({
                                                validatorFGRangeMessage: validationMessages.outOfRange
                                            });
                                        }
                                        if (validationMessages.isRequired) {
                                            this.setState({
                                                validatorFGRequiredMessage: validationMessages.isRequired
                                            });
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
            this.logError(LogData.fromException(this.onEditFieldGroup.name, e));
        }
    };

    private onEditNameLayout = (): void => {
        try {
            const {
                appForm
            } = this.state;
            if (appForm) {
                if (appForm.formLayoutId !== 1) {
                    this.setState({
                        layoutDescription: appForm.description,
                        layoutName: appForm.name
                    });
                }
            }

            this.setState({
                openNameSetupModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditNameLayout.name, e));
        }
    };

    private onEditStepButton = (event: any): void => {
        try {
            const {
                appForm
            } = this.state;

            const id = event.currentTarget.id.split('|');
            if (id.length > 1) {
                const applicationForm: IAppSetupForm | undefined = appForm;
                if (applicationForm && applicationForm.steps) {
                    const stepIndex: number =
                        applicationForm.steps.findIndex(x => x.stepNumber === Number(id[1]));

                    if (stepIndex > -1) {
                        const title: string =
                            applicationForm.steps[stepIndex].stepTitle;

                        this.setState({
                            openStepSetupModal: true,
                            stepIndex: Number(id[1]),
                            stepModified: true,
                            stepTitle: title
                        });
                    }
                }
            }
            else {
                // Edit confirmation dialog
                if (id[0] === 'iconEditConfirmationButton') {
                    if (appForm && appForm.fieldsGroups) {
                        const fieldGroupIndex: number =
                            appForm.fieldsGroups.findIndex(x =>
                                x.id === 'confirmationGroup');
                        if (fieldGroupIndex > -1) {
                            this.setState({
                                openStepSetupModal: true,
                                stepIndex: undefined,
                                stepModified: false,
                                stepTitle: appForm.fieldsGroups[fieldGroupIndex].
                                    label
                            });
                        }
                    }
                }
            }
            event.stopPropagation();
            event.preventDefault();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditStepButton.name, e));
        }
    };

    private onRemoveComponent = (): void => {
        try {
            this.setState({
                openConfirmationRemove: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRemoveComponent.name, e));
        }
    };

    private onSaveAddComponent = (): void => {
        try {
            const {
                selectedComponet
            } = this.state;

            let isValid: boolean = true;

            if (!selectedComponet) {
                this.setState({
                    emptyComponent: true
                });
                isValid = false;
            }
            else {
                if (selectedComponet === 'UserDefined') {
                    const {
                        appForm,
                        selectedGridSize,
                        selectedUserDefinedDataType,
                        selectedUserDefinedType,
                        stepIndex,
                        userDefinedId,
                        userDefinedIsRequired,
                        userDefinedIsUploading,
                        userDefinedLabel,
                        userDefinedMaxLength,
                        validatorUserDefinedOutRangeMsg,
                        validatorUserDefinedRequiredMessage
                    } = this.state;

                    if (!selectedUserDefinedDataType) {
                        this.setState({
                            emptyDataType: true
                        });
                        isValid = false;
                    }
                    if (!selectedUserDefinedType) {
                        this.setState({
                            emptyType: true
                        });
                        isValid = false;
                    }
                    if (!userDefinedId) {
                        this.setState({
                            emptyId: true
                        });
                        isValid = false;
                    }
                    if (!userDefinedLabel) {
                        this.setState({
                            emptyLabel: true
                        });
                        isValid = false;
                    }
                    if (userDefinedIsRequired) {
                        if (!validatorUserDefinedRequiredMessage) {
                            this.setState({
                                emptyRequiredMessage: true
                            });
                            isValid = false;
                        }
                    }
                    if (!selectedGridSize) {
                        this.setState({
                            emptyGridSize: true
                        });
                        isValid = false;
                    }
                    if (!userDefinedMaxLength) {
                        this.setState({
                            emptyMaxLength: true
                        });
                        isValid = false;
                    }
                    if (!validatorUserDefinedOutRangeMsg) {
                        this.setState({
                            emptyOutRangeMessage: true
                        });
                        isValid = false;
                    }

                    if (isValid && userDefinedId && userDefinedLabel &&
                        selectedUserDefinedType && appForm && appForm.steps &&
                        selectedUserDefinedDataType) {
                        const {
                            fieldIdToEdit
                        } = this.state;
                        // Update
                        if (fieldIdToEdit) {
                            const {
                                appForm
                            } = this.state;

                            if (appForm && fieldIdToEdit && appForm.steps) {
                                const stepIndex: number =
                                    appForm.steps.findIndex(x => x.stepNumber ===
                                        Number(fieldIdToEdit[1]));
                                if (stepIndex > -1) {
                                    const fgIndex: number =
                                        appForm.steps[stepIndex].stepFieldGroups.findIndex(x =>
                                            x.sortOrder === Number(fieldIdToEdit[2]));
                                    if (fgIndex > -1) {
                                        const {
                                            availableOptions,
                                            selectedGridSize,
                                            userDefinedCustomScript,
                                            userDefinedMaxLength
                                        } = this.state;

                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            id = `${userDefinedId}Group`;
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].dataType =
                                            selectedUserDefinedDataType.toString();
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].id =
                                            userDefinedId;
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].isRequired =
                                            userDefinedIsRequired;
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].isUploading =
                                            userDefinedIsUploading;
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].label =
                                            userDefinedLabel;
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].type =
                                            selectedUserDefinedType.toString();
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].options =
                                            availableOptions;
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].customScript =
                                            userDefinedCustomScript;
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].maxLength =
                                            Number(userDefinedMaxLength);

                                        if (selectedGridSize) {
                                            appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                                fields[0].gridSize =
                                                selectedGridSize.toString();
                                        }
                                        if (validatorUserDefinedRequiredMessage) {
                                            appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                                fields[0].
                                                validatorMessages[0].isRequired =
                                                validatorUserDefinedRequiredMessage;
                                        }
                                        if (validatorUserDefinedOutRangeMsg) {
                                            appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                                fields[0].
                                                validatorMessages[0].outOfRange =
                                                validatorUserDefinedOutRangeMsg;
                                        }
                                    }

                                    this.setState({
                                        appForm: appForm,
                                        availableOptions: undefined,
                                        fieldIdToEdit: undefined,
                                        openAddComponet: false,
                                        selectedComponet: undefined,
                                        selectedGridSize: undefined,
                                        selectedUserDefinedType: undefined,
                                        userDefinedCustomScript: undefined,
                                        userDefinedId: undefined,
                                        userDefinedIsRequired: false,
                                        userDefinedIsUploading: false,
                                        userDefinedLabel: undefined,
                                        userDefinedMaxLength: undefined,
                                        validatorUserDefinedOutRangeMsg: undefined,
                                        validatorUserDefinedRequiredMessage: undefined
                                    });
                                }
                            }
                        }
                        // Create
                        else {
                            if (stepIndex !== undefined) {
                                const userDefinedField:
                                    IFieldSetup = {
                                    dataType: selectedUserDefinedDataType.toString(),
                                    id: userDefinedId,
                                    isRequired: userDefinedIsRequired,
                                    isUploading: userDefinedIsUploading,
                                    isUserDefined: true,
                                    label: userDefinedLabel,
                                    sortOrder: 1,
                                    type: selectedUserDefinedType.toString(),
                                    validatorMessages: [{ isRequired: '' }]
                                };

                                const {
                                    availableOptions,
                                    selectedGridSize,
                                    userDefinedCustomScript,
                                    userDefinedMaxLength
                                } = this.state;

                                if (availableOptions) {
                                    userDefinedField.options = availableOptions;
                                }
                                if (userDefinedCustomScript) {
                                    userDefinedField.customScript = userDefinedCustomScript;
                                }
                                if (userDefinedMaxLength) {
                                    userDefinedField.maxLength = Number(userDefinedMaxLength);
                                }
                                if (selectedGridSize) {
                                    userDefinedField.gridSize = selectedGridSize.toString();
                                }
                                if (validatorUserDefinedRequiredMessage) {
                                    userDefinedField.validatorMessages[0].isRequired =
                                        validatorUserDefinedRequiredMessage;
                                }
                                if (validatorUserDefinedOutRangeMsg) {
                                    userDefinedField.validatorMessages[0].outOfRange =
                                        validatorUserDefinedOutRangeMsg;
                                }

                                const fgUserDefined: IFieldSetup[] = [userDefinedField];
                                const userDefinedFieldGroup:
                                    IFieldsGroupSetup = {
                                    fields: fgUserDefined,
                                    id: `${userDefinedId}Group`,
                                    instructions: '',
                                    isCustom: true,
                                    label: '',
                                    maximumAllowed: 1,
                                    sortOrder: appForm.steps[stepIndex].stepFieldGroups.length + 1,
                                    validatorMessages: [{
                                        isRequired: validatorUserDefinedRequiredMessage
                                    }]
                                };

                                appForm.steps[stepIndex].stepFieldGroups.push(userDefinedFieldGroup);

                                this.setState({
                                    appForm: appForm,
                                    availableOptions: undefined,
                                    fieldIdToEdit: undefined,
                                    openAddComponet: false,
                                    selectedComponet: undefined,
                                    selectedGridSize: undefined,
                                    selectedUserDefinedType: undefined,
                                    userDefinedCustomScript: undefined,
                                    userDefinedId: undefined,
                                    userDefinedIsRequired: false,
                                    userDefinedIsUploading: false,
                                    userDefinedLabel: undefined,
                                    userDefinedMaxLength: undefined,
                                    validatorUserDefinedOutRangeMsg: undefined,
                                    validatorUserDefinedRequiredMessage: undefined
                                });
                            }
                        }
                    }
                }
                if (selectedComponet === 'Text') {
                    const {
                        selectedColor,
                        selectedTextSize,
                        stepIndex,
                        textId,
                        textLabel
                    } = this.state;

                    if (!selectedColor) {
                        this.setState({
                            emptyColor: true
                        });
                        isValid = false;
                    }
                    if (!selectedTextSize) {
                        this.setState({
                            emptyTextSize: true
                        });
                        isValid = false;
                    }
                    if (!textId) {
                        this.setState({
                            emptyId: true
                        });
                        isValid = false;
                    }
                    if (!textLabel) {
                        this.setState({
                            emptyLabel: true
                        });
                        isValid = false;
                    }

                    if (isValid) {
                        const {
                            fieldIdToEdit
                        } = this.state;
                        // Update
                        if (fieldIdToEdit) {
                            const {
                                appForm
                            } = this.state;

                            if (!stepIndex) {
                                if (appForm && appForm.fieldsGroups && textId && textLabel) {
                                    let fieldGroupIndex: number = -1;
                                    if (fieldIdToEdit[0] === 'iconEditFooterButton') {
                                        fieldGroupIndex = appForm.fieldsGroups.findIndex(x =>
                                            x.id === 'footerGroup');
                                    }
                                    if (fieldIdToEdit[0] === 'iconEditConfirmationButton') {
                                        fieldGroupIndex = appForm.fieldsGroups.findIndex(x =>
                                            x.id === 'confirmationGroup');
                                    }
                                    if (fieldGroupIndex > -1) {
                                        const fieldId: number =
                                            appForm.fieldsGroups[fieldGroupIndex].fields.
                                                findIndex(x => x.sortOrder === Number(fieldIdToEdit[2]));
                                        if (fieldId > -1) {
                                            const {
                                                isWithLink,
                                                textActionUrl
                                            } = this.state;
                                            appForm.fieldsGroups[fieldGroupIndex].
                                                fields[fieldId].isWithLink = isWithLink;
                                            appForm.fieldsGroups[fieldGroupIndex].
                                                fields[fieldId].actionUrl = textActionUrl;
                                            appForm.fieldsGroups[fieldGroupIndex].
                                                fields[fieldId].id = textId;
                                            appForm.fieldsGroups[fieldGroupIndex].
                                                fields[fieldId].label = textLabel;
                                            if (selectedColor) {
                                                appForm.fieldsGroups[fieldGroupIndex].
                                                    fields[fieldId].color =
                                                    selectedColor.toString();
                                            }
                                            if (selectedTextSize) {
                                                appForm.fieldsGroups[fieldGroupIndex].
                                                    fields[fieldId].size =
                                                    selectedTextSize.toString();
                                            }
                                            this.setState({
                                                appForm: appForm,
                                                emptyColor: false,
                                                emptyLabel: false,
                                                emptyTextSize: false,
                                                fieldIdToEdit: undefined,
                                                isWithLink: false,
                                                openAddComponet: false,
                                                selectedComponet: undefined,
                                                selectedColor: undefined,
                                                selectedTextSize: undefined,
                                                stepIndex: undefined,
                                                textActionUrl: undefined,
                                                textId: undefined,
                                                textLabel: undefined
                                            });
                                        }
                                    }
                                    else {
                                        if (appForm && appForm.steps && textId && textLabel) {
                                            const stepIndex: number =
                                                appForm.steps.findIndex(x => x.stepNumber ===
                                                    Number(fieldIdToEdit[1]));
                                            if (stepIndex > -1) {
                                                const fgIndex: number =
                                                    appForm.steps[stepIndex].stepFieldGroups.findIndex(x =>
                                                        x.sortOrder === Number(fieldIdToEdit[2]));
                                                if (fgIndex > -1) {
                                                    const {
                                                        isWithLink,
                                                        textActionUrl
                                                    } = this.state;
                                                    appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                                        id = `${textId}Group`;
                                                    appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                                        fields[0].isWithLink = isWithLink;
                                                    appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                                        fields[0].actionUrl = textActionUrl;
                                                    appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                                        fields[0].id = textId;
                                                    appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                                        fields[0].label = textLabel;
                                                    if (selectedColor) {
                                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                                            fields[0].color = selectedColor.toString();
                                                    }
                                                    if (selectedTextSize) {
                                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                                            fields[0].size = selectedTextSize.toString();
                                                    }
                                                    this.setState({
                                                        appForm: appForm,
                                                        emptyColor: false,
                                                        emptyLabel: false,
                                                        emptyTextSize: false,
                                                        fieldIdToEdit: undefined,
                                                        isWithLink: false,
                                                        openAddComponet: false,
                                                        selectedColor: undefined,
                                                        selectedComponet: undefined,
                                                        selectedTextSize: undefined,
                                                        stepIndex: undefined,
                                                        textActionUrl: undefined,
                                                        textId: undefined,
                                                        textLabel: undefined
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        // Create
                        else {
                            const {
                                selectedComponet
                            } = this.state;

                            if (stepIndex !== undefined && textId && textLabel) {
                                const {
                                    appForm,
                                    isWithLink,
                                    textActionUrl
                                } = this.state;

                                if (appForm && appForm.steps && selectedComponet) {
                                    const textField:
                                        IFieldSetup = {
                                        id: textId,
                                        isWithLink: isWithLink,
                                        label: textLabel,
                                        sortOrder: 1,
                                        type: selectedComponet.toString(),
                                        validatorMessages: []
                                    };

                                    if (textActionUrl) {
                                        textField.actionUrl = textActionUrl;
                                    }

                                    if (selectedColor) {
                                        textField.color = selectedColor.toString();
                                    }

                                    if (selectedTextSize) {
                                        textField.size = selectedTextSize.toString();
                                    }

                                    const fgTextField: IFieldSetup[] = [textField];
                                    const textFieldGroup:
                                        IFieldsGroupSetup = {
                                        fields: fgTextField,
                                        id: `${textId}Group`,
                                        instructions: '',
                                        isCustom: true,
                                        label: '',
                                        maximumAllowed: 1,
                                        sortOrder: appForm.steps[stepIndex].stepFieldGroups.length + 1,
                                        validatorMessages: []
                                    };

                                    appForm.steps[stepIndex].stepFieldGroups.push(textFieldGroup);

                                    this.setState({
                                        appForm: appForm,
                                        emptyColor: false,
                                        emptyLabel: false,
                                        emptyTextSize: false,
                                        fieldIdToEdit: undefined,
                                        isWithLink: false,
                                        openAddComponet: false,
                                        selectedColor: undefined,
                                        selectedComponet: undefined,
                                        selectedTextSize: undefined,
                                        stepIndex: undefined,
                                        textActionUrl: undefined,
                                        textId: undefined,
                                        textLabel: undefined
                                    });
                                }
                            }
                        }
                    }
                }
                if (selectedComponet === 'IconLinkPhone' ||
                    selectedComponet === 'IconLinkEmail' ||
                    selectedComponet === 'Button') {
                    const {
                        stepIndex,
                        textId,
                        textLabel
                    } = this.state;

                    if (!textId) {
                        this.setState({
                            emptyId: true
                        });
                        isValid = false;
                    }
                    if (!textLabel) {
                        this.setState({
                            emptyLabel: true
                        });
                        isValid = false;
                    }

                    if (isValid) {
                        const {
                            fieldIdToEdit
                        } = this.state;
                        // Update
                        if (fieldIdToEdit) {
                            const {
                                appForm
                            } = this.state;

                            if (stepIndex === undefined) {
                                if (appForm && appForm.fieldsGroups && textId && textLabel) {
                                    let fieldGroupIndex: number = -1;
                                    if (fieldIdToEdit[0] === 'iconEditFooterButton') {
                                        fieldGroupIndex = appForm.fieldsGroups.findIndex(x =>
                                            x.id === 'footerGroup');
                                    }
                                    if (fieldIdToEdit[0] === 'iconEditConfirmationButton') {
                                        fieldGroupIndex = appForm.fieldsGroups.findIndex(x =>
                                            x.id === 'confirmationGroup');
                                    }
                                    if (fieldGroupIndex === -1 && appForm && appForm.steps) {
                                        const {
                                            textActionUrl
                                        } = this.state;
                                        const stepIndex: number =
                                            appForm.steps.findIndex(x => x.stepNumber === Number(fieldIdToEdit[1]));
                                        if (stepIndex > -1) {
                                            const fgIndex: number =
                                                appForm.steps[stepIndex].stepFieldGroups.findIndex(x =>
                                                    x.sortOrder === Number(fieldIdToEdit[2]));
                                            if (fgIndex > -1) {
                                                appForm.steps[stepIndex].stepFieldGroups[fgIndex].fields[0].actionUrl =
                                                    textActionUrl;
                                                appForm.steps[stepIndex].stepFieldGroups[fgIndex].fields[0].id =
                                                    textId;
                                                appForm.steps[stepIndex].stepFieldGroups[fgIndex].fields[0].label =
                                                    textLabel;
                                                this.setState({
                                                    appForm: appForm,
                                                    emptyColor: false,
                                                    emptyLabel: false,
                                                    emptyTextSize: false,
                                                    fieldIdToEdit: undefined,
                                                    isWithLink: false,
                                                    openAddComponet: false,
                                                    selectedComponet: undefined,
                                                    selectedColor: undefined,
                                                    selectedTextSize: undefined,
                                                    stepIndex: undefined,
                                                    textActionUrl: undefined,
                                                    textId: undefined,
                                                    textLabel: undefined
                                                });
                                            }
                                        }
                                    }
                                    if (fieldGroupIndex > -1) {
                                        const fieldId: number =
                                            appForm.fieldsGroups[fieldGroupIndex].fields.
                                                findIndex(x => x.sortOrder === Number(fieldIdToEdit[2]));
                                        if (fieldId > -1) {
                                            const {
                                                textActionUrl
                                            } = this.state;
                                            appForm.fieldsGroups[fieldGroupIndex].fields[fieldId].actionUrl =
                                                textActionUrl;
                                            appForm.fieldsGroups[fieldGroupIndex].fields[fieldId].id =
                                                textId;
                                            appForm.fieldsGroups[fieldGroupIndex].fields[fieldId].label =
                                                textLabel;
                                            this.setState({
                                                appForm: appForm,
                                                emptyColor: false,
                                                emptyLabel: false,
                                                emptyTextSize: false,
                                                fieldIdToEdit: undefined,
                                                isWithLink: false,
                                                openAddComponet: false,
                                                selectedComponet: undefined,
                                                selectedColor: undefined,
                                                selectedTextSize: undefined,
                                                stepIndex: undefined,
                                                textActionUrl: undefined,
                                                textId: undefined,
                                                textLabel: undefined
                                            });
                                        }
                                    }
                                }
                                return;
                            }
                            else {
                                if (appForm && appForm.steps && textId && textLabel) {
                                    const stepIndex: number =
                                        appForm.steps.findIndex(x => x.stepNumber ===
                                            Number(fieldIdToEdit[1]));
                                    if (stepIndex > -1) {
                                        const fgIndex: number =
                                            appForm.steps[stepIndex].stepFieldGroups.findIndex(x =>
                                                x.sortOrder === Number(fieldIdToEdit[2]));
                                        if (fgIndex > -1) {
                                            const {
                                                isWithLink,
                                                textActionUrl
                                            } = this.state;
                                            appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                                id = `${textId}Group`;
                                            appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                                fields[0].isWithLink = isWithLink;
                                            appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                                fields[0].actionUrl = textActionUrl;
                                            appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                                fields[0].id = textId;
                                            appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                                fields[0].label = textLabel;
                                            this.setState({
                                                appForm: appForm,
                                                emptyColor: false,
                                                emptyLabel: false,
                                                emptyTextSize: false,
                                                fieldIdToEdit: undefined,
                                                isWithLink: false,
                                                openAddComponet: false,
                                                selectedColor: undefined,
                                                selectedComponet: undefined,
                                                selectedTextSize: undefined,
                                                stepIndex: undefined,
                                                textActionUrl: undefined,
                                                textId: undefined,
                                                textLabel: undefined
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        // Create
                        else {
                            const {
                                selectedComponet
                            } = this.state;

                            if (stepIndex !== undefined && textId && textLabel) {
                                const {
                                    appForm,
                                    isWithLink,
                                    textActionUrl
                                } = this.state;

                                if (appForm && appForm.steps && selectedComponet) {
                                    const textField:
                                        IFieldSetup = {
                                        id: textId,
                                        isWithLink: isWithLink,
                                        label: textLabel,
                                        sortOrder: 1,
                                        type: selectedComponet.toString(),
                                        validatorMessages: []
                                    };

                                    if (textActionUrl) {
                                        textField.actionUrl = textActionUrl;
                                    }

                                    const fgTextField: IFieldSetup[] = [textField];
                                    const textFieldGroup:
                                        IFieldsGroupSetup = {
                                        fields: fgTextField,
                                        id: `${textId}Group`,
                                        instructions: '',
                                        isCustom: true,
                                        label: '',
                                        maximumAllowed: 1,
                                        sortOrder: appForm.steps[stepIndex].stepFieldGroups.length + 1,
                                        validatorMessages: []
                                    };

                                    appForm.steps[stepIndex].stepFieldGroups.push(textFieldGroup);

                                    this.setState({
                                        appForm: appForm,
                                        emptyColor: false,
                                        emptyLabel: false,
                                        emptyTextSize: false,
                                        fieldIdToEdit: undefined,
                                        isWithLink: false,
                                        openAddComponet: false,
                                        selectedColor: undefined,
                                        selectedComponet: undefined,
                                        selectedTextSize: undefined,
                                        stepIndex: undefined,
                                        textActionUrl: undefined,
                                        textId: undefined,
                                        textLabel: undefined
                                    });
                                }
                            }
                        }
                    }
                }
                if (selectedComponet === 'Divider') {
                    const {
                        stepIndex,
                        textId
                    } = this.state;

                    if (!textId) {
                        this.setState({
                            emptyId: true
                        });
                        isValid = false;
                    }

                    if (isValid) {
                        const {
                            fieldIdToEdit
                        } = this.state;
                        // Update
                        if (fieldIdToEdit) {
                            const {
                                appForm
                            } = this.state;

                            if (appForm && appForm.steps && textId) {
                                const stepIndex: number =
                                    appForm.steps.findIndex(x => x.stepNumber ===
                                        Number(fieldIdToEdit[1]));
                                if (stepIndex > -1) {
                                    const fgIndex: number =
                                        appForm.steps[stepIndex].stepFieldGroups.findIndex(x =>
                                            x.sortOrder === Number(fieldIdToEdit[2]));
                                    if (fgIndex > -1) {
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            id = `${textId}Group`;
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].id = textId;
                                        this.setState({
                                            appForm: appForm,
                                            fieldIdToEdit: undefined,
                                            openAddComponet: false,
                                            selectedComponet: undefined,
                                            stepIndex: undefined,
                                            textId: undefined
                                        });
                                    }
                                }
                            }
                        }
                        // Create
                        else {
                            const {
                                selectedComponet
                            } = this.state;

                            if (stepIndex !== undefined && textId) {
                                const {
                                    appForm
                                } = this.state;

                                if (appForm && appForm.steps && selectedComponet) {
                                    const textField:
                                        IFieldSetup = {
                                        id: textId,
                                        label: '',
                                        sortOrder: 1,
                                        type: selectedComponet.toString(),
                                        validatorMessages: []
                                    };

                                    const fgTextField: IFieldSetup[] = [textField];
                                    const textFieldGroup:
                                        IFieldsGroupSetup = {
                                        fields: fgTextField,
                                        id: `${textId}Group`,
                                        instructions: '',
                                        isCustom: true,
                                        label: '',
                                        maximumAllowed: 1,
                                        sortOrder: appForm.steps[stepIndex].stepFieldGroups.length + 1,
                                        validatorMessages: []
                                    };

                                    appForm.steps[stepIndex].stepFieldGroups.push(textFieldGroup);

                                    this.setState({
                                        appForm: appForm,
                                        fieldIdToEdit: undefined,
                                        openAddComponet: false,
                                        selectedComponet: undefined,
                                        stepIndex: undefined,
                                        textId: undefined
                                    });
                                }
                            }
                        }
                    }
                }
                if (selectedComponet === 'HtmlElement') {
                    const {
                        stepIndex,
                        textId,
                        textLabel
                    } = this.state;

                    if (!textId) {
                        this.setState({
                            emptyId: true
                        });
                        isValid = false;
                    }

                    if (!textLabel) {
                        this.setState({
                            emptyLabel: true
                        });
                        isValid = false;
                    }

                    if (isValid) {
                        const {
                            fieldIdToEdit
                        } = this.state;
                        // Update
                        if (fieldIdToEdit) {
                            const {
                                appForm
                            } = this.state;

                            if (appForm && appForm.steps && textId) {
                                const stepIndex: number =
                                    appForm.steps.findIndex(x => x.stepNumber ===
                                        Number(fieldIdToEdit[1]));
                                if (stepIndex > -1) {
                                    const fgIndex: number =
                                        appForm.steps[stepIndex].stepFieldGroups.findIndex(x =>
                                            x.sortOrder === Number(fieldIdToEdit[2]));
                                    if (fgIndex > -1) {
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            id = `${textId}Group`;
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].id = textId;
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].value = textLabel ? textLabel : '';
                                        this.setState({
                                            appForm: appForm,
                                            fieldIdToEdit: undefined,
                                            openAddComponet: false,
                                            selectedComponet: undefined,
                                            stepIndex: undefined,
                                            textId: undefined,
                                            textLabel: undefined
                                        });
                                    }
                                }
                            }
                        }
                        // Create
                        else {
                            const {
                                selectedComponet
                            } = this.state;

                            if (stepIndex !== undefined && textId) {
                                const {
                                    appForm,
                                    textLabel
                                } = this.state;

                                if (appForm && appForm.steps && selectedComponet) {
                                    const textField:
                                        IFieldSetup = {
                                        id: textId,
                                        label: '',
                                        sortOrder: 1,
                                        type: selectedComponet.toString(),
                                        validatorMessages: [],
                                        value: textLabel ? textLabel : ''
                                    };

                                    const fgTextField: IFieldSetup[] = [textField];
                                    const textFieldGroup:
                                        IFieldsGroupSetup = {
                                        fields: fgTextField,
                                        id: `${textId}Group`,
                                        instructions: '',
                                        isCustom: true,
                                        label: '',
                                        maximumAllowed: 1,
                                        sortOrder: appForm.steps[stepIndex].stepFieldGroups.length + 1,
                                        validatorMessages: []
                                    };

                                    appForm.steps[stepIndex].stepFieldGroups.push(textFieldGroup);

                                    this.setState({
                                        appForm: appForm,
                                        fieldIdToEdit: undefined,
                                        openAddComponet: false,
                                        selectedComponet: undefined,
                                        stepIndex: undefined,
                                        textId: undefined,
                                        textLabel: undefined
                                    });
                                }
                            }
                        }
                    }
                }
                if (selectedComponet === 'Image') {
                    const {
                        stepIndex,
                        textAlt,
                        textId,
                        textSrc
                    } = this.state;

                    if (!textAlt) {
                        this.setState({
                            emptyAlt: true
                        });
                        isValid = false;
                    }

                    if (!textId) {
                        this.setState({
                            emptyId: true
                        });
                        isValid = false;
                    }

                    if (!textSrc) {
                        this.setState({
                            emptySrc: true
                        });
                        isValid = false;
                    }

                    if (isValid) {
                        const {
                            fieldIdToEdit,
                            textLabel
                        } = this.state;
                        // Update
                        if (fieldIdToEdit) {
                            const {
                                appForm
                            } = this.state;

                            if (appForm && appForm.steps && textId) {
                                const stepIndex: number =
                                    appForm.steps.findIndex(x => x.stepNumber ===
                                        Number(fieldIdToEdit[1]));
                                if (stepIndex > -1) {
                                    const fgIndex: number =
                                        appForm.steps[stepIndex].stepFieldGroups.findIndex(x =>
                                            x.sortOrder === Number(fieldIdToEdit[2]));
                                    if (fgIndex > -1) {
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            id = `${textId}Group`;
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].id = textId;
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].label = textLabel ? textLabel : '';
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].alt = textAlt;
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].src = textSrc;
                                        this.setState({
                                            appForm: appForm,
                                            fieldIdToEdit: undefined,
                                            openAddComponet: false,
                                            selectedComponet: undefined,
                                            stepIndex: undefined,
                                            textAlt: undefined,
                                            textId: undefined,
                                            textSrc: undefined
                                        });
                                    }
                                }
                            }
                        }
                        // Create
                        else {
                            const {
                                selectedComponet
                            } = this.state;

                            if (stepIndex !== undefined && textId) {
                                const {
                                    appForm,
                                    textAlt,
                                    textLabel,
                                    textSrc
                                } = this.state;

                                if (appForm && appForm.steps && selectedComponet) {
                                    const textField:
                                        IFieldSetup = {
                                        alt: textAlt,
                                        id: textId,
                                        label: textLabel ? textLabel : '',
                                        sortOrder: 1,
                                        src: textSrc,
                                        type: selectedComponet.toString(),
                                        validatorMessages: []
                                    };

                                    const fgTextField: IFieldSetup[] = [textField];
                                    const textFieldGroup:
                                        IFieldsGroupSetup = {
                                        fields: fgTextField,
                                        id: `${textId}Group`,
                                        instructions: '',
                                        isCustom: true,
                                        label: '',
                                        maximumAllowed: 1,
                                        sortOrder: appForm.steps[stepIndex].stepFieldGroups.length + 1,
                                        validatorMessages: []
                                    };

                                    appForm.steps[stepIndex].stepFieldGroups.push(textFieldGroup);

                                    this.setState({
                                        appForm: appForm,
                                        fieldIdToEdit: undefined,
                                        openAddComponet: false,
                                        selectedComponet: undefined,
                                        stepIndex: undefined,
                                        textAlt: undefined,
                                        textId: undefined,
                                        textSrc: undefined
                                    });
                                }
                            }
                        }
                    }
                }
                if (selectedComponet === 'Button') {
                    const {
                        textId,
                        textLabel
                    } = this.state;

                    if (!textId) {
                        this.setState({
                            emptyId: true
                        });
                        isValid = false;
                    }

                    if (!textLabel) {
                        this.setState({
                            emptyLabel: true
                        });
                        isValid = false;
                    }

                    if (isValid) {
                        const {
                            textActionUrl,
                            fieldIdToEdit,
                            textLabel
                        } = this.state;
                        // Update
                        if (fieldIdToEdit) {
                            const {
                                appForm
                            } = this.state;

                            if (appForm && appForm.steps && textId) {
                                const stepIndex: number =
                                    appForm.steps.findIndex(x => x.stepNumber ===
                                        Number(fieldIdToEdit[1]));
                                if (stepIndex > -1) {
                                    const fgIndex: number =
                                        appForm.steps[stepIndex].stepFieldGroups.findIndex(x =>
                                            x.sortOrder === Number(fieldIdToEdit[2]));
                                    if (fgIndex > -1) {
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            id = `${textId}Group`;
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].id = textId;
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].label = textLabel ? textLabel : '';
                                        appForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[0].actionUrl = textActionUrl ? textActionUrl : '';
                                        this.setState({
                                            appForm: appForm,
                                            fieldIdToEdit: undefined,
                                            openAddComponet: false,
                                            selectedComponet: undefined,
                                            stepIndex: undefined,
                                            textAlt: undefined,
                                            textId: undefined,
                                            textSrc: undefined
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveAddComponent.name, e));
        }
    };

    private onSaveAddOption = (): void => {
        try {
            const {
                optionDescription,
                optionValue,
                availableOptions
            } = this.state;

            let isValid: boolean = true;

            if (!optionDescription) {
                this.setState({
                    emptyAddOptDescription: true
                });
                isValid = false;
            }

            if (!optionValue) {
                this.setState({
                    emptyAddOptValue: true
                });
                isValid = false;
            }

            if (isValid) {
                if (availableOptions) {
                    if (optionDescription && optionValue) {
                        availableOptions.push({
                            description: optionDescription,
                            value: optionValue
                        });
                    }
                }
                else {
                    if (optionDescription && optionValue) {
                        const options: IDropDownOption[] = [];
                        options.push({
                            description: optionDescription,
                            value: optionValue
                        });
                        this.setState({
                            availableOptions: options
                        });
                    }
                }
                this.setState({
                    openAddOption: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveAddOption.name, e));
        }
    };

    private onSaveAppNameSetup = (): void => {
        try {
            const {
                layoutName
            } = this.state;

            if (!layoutName) {
                this.setState({
                    layoutNameIsEmpty: true
                });
            }
            else {
                RequestLayout.postLayoutNameExists(layoutName.trimRight(), 0,
                    this.resolveNameExist, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveAppNameSetup.name, e));
        }
    };

    private onSaveFieldGroupSetup = (): void => {
        try {
            const {
                appForm,
                fieldGroupId,
                fieldGroupInstructions,
                fieldGroupLabel,
                fieldGroupToEdit,
                maxAllowed,
                selectedDefault,
                selectedGridSize,
                validatorFGDupMessage,
                validatorFGInvFormatMessage,
                validatorFGNotValidMessage,
                validatorFGRangeMessage,
                validatorFGRequiredMessage,
                validatorInvFormatMessage,
                validatorNotNumericMessage,
                validatorNotValidMessage,
                validatorOutRangeMessage,
                validatorRequiredMessage
            } = this.state;

            const applicationForm: IAppSetupForm | undefined = appForm;
            let isValid: boolean = true;
            if (applicationForm && fieldGroupToEdit && applicationForm.steps) {
                const stepIndex: number =
                    applicationForm.steps.findIndex(x => x.stepNumber === Number(fieldGroupToEdit[1]));
                if (stepIndex > -1) {
                    const fgIndex: number =
                        applicationForm.steps[stepIndex].stepFieldGroups.findIndex(x =>
                            x.sortOrder === Number(fieldGroupToEdit[2]));
                    if (fgIndex > -1) {
                        // Validations
                        // Field Groups with one field
                        if (fieldGroupId !== 'addressInformationGroup' &&
                            fieldGroupId !== 'educationGroup' &&
                            fieldGroupId !== 'emergencyContactGroup' &&
                            fieldGroupId !== 'employmentGroup' &&
                            fieldGroupId !== 'phoneGroup' &&
                            fieldGroupId !== 'ipedsGroup' &&
                            fieldGroupId !== 'programOfStudyGroup' &&
                            fieldGroupId !== 'testScoreGroup' &&
                            fieldGroupId !== 'activityGroup' &&
                            fieldGroupId !== 'relativesGroup' &&
                            fieldGroupId !== 'residencyGroup') {
                            if (!fieldGroupLabel) {
                                this.setState({
                                    emptyLabel: true
                                });
                                isValid = false;
                            }
                            if (!selectedGridSize) {
                                this.setState({
                                    emptyGridSize: true
                                });
                                isValid = false;
                            }
                            if (fieldGroupId !== 'seekingDegreeGroup' &&
                                fieldGroupId !== 'financialAidGroup' &&
                                fieldGroupId !== 'extraCurricularActivityGroup' &&
                                fieldGroupId !== 'otherSourceGroup' &&
                                fieldGroupId !== 'governmentIdGroup' &&
                                fieldGroupId !== 'emailGroup' &&
                                fieldGroupId !== 'monthsInCountryGroup' &&
                                fieldGroupId !== 'retiredGroup') {
                                if (!validatorRequiredMessage) {
                                    this.setState({
                                        emptyRequiredMessage: true
                                    });
                                    isValid = false;
                                }
                            }
                            if (fieldGroupId === 'governmentIdGroup') {
                                if (!validatorInvFormatMessage) {
                                    this.setState({
                                        emptyInvFormatMessage: true
                                    });
                                    isValid = false;
                                }
                            }
                            if (fieldGroupId === 'emailGroup') {
                                if (!validatorNotValidMessage) {
                                    this.setState({
                                        emptyNotValidMessage: true
                                    });
                                    isValid = false;
                                }
                            }
                            if (fieldGroupId === 'monthsInCountryGroup') {
                                if (!validatorNotNumericMessage) {
                                    this.setState({
                                        emptyNotNumericMessage: true
                                    });
                                    isValid = false;
                                }
                                if (!validatorOutRangeMessage) {
                                    this.setState({
                                        emptyOutRangeMessage: true
                                    });
                                    isValid = false;
                                }
                            }

                            if (fieldGroupId === 'dateOfBirthGroup' ||
                                fieldGroupId === 'visaExpirationDateGroup' ||
                                fieldGroupId === 'passportExpirationDateGroup') {
                                if (!validatorInvFormatMessage) {
                                    this.setState({
                                        emptyInvFormatMessage: true
                                    });
                                    isValid = false;
                                }
                            }
                        }
                        // Field Groups with more than one field
                        else {
                            if (fieldGroupId === 'ipedsGroup' ||
                                fieldGroupId === 'programOfStudyGroup' ||
                                fieldGroupId === 'residencyGroup' ||
                                fieldGroupId === 'testScoreGroup' ||
                                fieldGroupId === 'emergencyContactGroup' ||
                                fieldGroupId === 'employmentGroup' ||
                                fieldGroupId === 'educationGroup' ||
                                fieldGroupId === 'relativesGroup') {
                                if (!validatorFGRequiredMessage) {
                                    this.setState({
                                        emptyFGRequiredMessage: true
                                    });
                                    isValid = false;
                                }
                            }
                            if (fieldGroupId === 'educationGroup' ||
                                fieldGroupId === 'employmentGroup') {
                                if (!validatorFGDupMessage) {
                                    this.setState({
                                        emptyFGDuplicatedMessage: true
                                    });
                                    isValid = false;
                                }
                                if (!validatorFGNotValidMessage) {
                                    this.setState({
                                        emptyFGNotValidMessage: true
                                    });
                                    isValid = false;
                                }
                                if (!validatorFGInvFormatMessage) {
                                    this.setState({
                                        emptyFGFormatMessage: true
                                    });
                                    isValid = false;
                                }
                                if (!validatorFGRangeMessage) {
                                    this.setState({
                                        emptyFGRangeMessage: true
                                    });
                                    isValid = false;
                                }
                            }

                            if (fieldGroupId === 'addressInformationGroup' ||
                                fieldGroupId === 'emergencyContactGroup' ||
                                fieldGroupId === 'phoneGroup' ||
                                fieldGroupId === 'programOfStudyGroup' ||
                                fieldGroupId === 'testScoreGroup' ||
                                fieldGroupId === 'activityGroup' ||
                                fieldGroupId === 'relativesGroup') {
                                if (!validatorFGDupMessage) {
                                    this.setState({
                                        emptyFGDuplicatedMessage: true
                                    });
                                    isValid = false;
                                }
                            }
                        }
                        // Save values
                        if (isValid) {
                            if (fieldGroupId !== 'addressInformationGroup' &&
                                fieldGroupId !== 'educationGroup' &&
                                fieldGroupId !== 'emergencyContactGroup' &&
                                fieldGroupId !== 'employmentGroup' &&
                                fieldGroupId !== 'phoneGroup' &&
                                fieldGroupId !== 'ipedsGroup' &&
                                fieldGroupId !== 'programOfStudyGroup' &&
                                fieldGroupId !== 'testScoreGroup' &&
                                fieldGroupId !== 'activityGroup' &&
                                fieldGroupId !== 'relativesGroup' &&
                                fieldGroupId !== 'residencyGroup') {
                                let fieldIndex: number = 0;
                                if (fieldGroupId === 'interestGroup') {
                                    fieldIndex = 1;
                                }
                                if (fieldGroupLabel && selectedGridSize) {
                                    applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                        fields[fieldIndex].label = fieldGroupLabel;

                                    applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                        fields[fieldIndex].gridSize = selectedGridSize.toString();
                                    if (validatorInvFormatMessage) {
                                        applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[fieldIndex].validatorMessages[0].invalidFormat =
                                            validatorInvFormatMessage;
                                    }
                                    if (validatorNotNumericMessage) {
                                        applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[fieldIndex].validatorMessages[0].notNumeric =
                                            validatorNotNumericMessage;
                                    }
                                    if (validatorNotValidMessage) {
                                        applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[fieldIndex].validatorMessages[0].notValid =
                                            validatorNotValidMessage;
                                    }
                                    if (validatorOutRangeMessage) {
                                        applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[fieldIndex].validatorMessages[0].outOfRange =
                                            validatorOutRangeMessage;
                                    }
                                    if (validatorRequiredMessage) {
                                        applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[fieldIndex].validatorMessages[0].isRequired =
                                            validatorRequiredMessage;
                                    }
                                    if (selectedDefault) {
                                        applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            fields[fieldIndex].default = selectedDefault.toString();
                                    }
                                    this.setState({
                                        appForm: applicationForm,
                                        emptyFGDuplicatedMessage: false,
                                        emptyFGFormatMessage: false,
                                        emptyFGNotValidMessage: false,
                                        emptyFGRangeMessage: false,
                                        emptyFGRequiredMessage: false,
                                        emptyNotNumericMessage: false,
                                        emptyNotValidMessage: false,
                                        emptyOutRangeMessage: false,
                                        emptyRequiredMessage: false,
                                        fieldGroupLabel: undefined,
                                        fields: undefined,
                                        maxAllowed: undefined,
                                        openFieldGroupModal: false,
                                        selectedDefault: undefined,
                                        selectedFieldGridSize: undefined,
                                        validatorFGDupMessage: undefined,
                                        validatorFGInvFormatMessage: undefined,
                                        validatorFGNotValidMessage: undefined,
                                        validatorFGRangeMessage: undefined,
                                        validatorFGRequiredMessage: undefined,
                                        validatorInvFormatMessage: undefined,
                                        validatorNotNumericMessage: undefined,
                                        validatorNotValidMessage: undefined,
                                        validatorOutRangeMessage: undefined,
                                        validatorRequiredMessage: undefined
                                    });
                                }
                            }
                            else {
                                const {
                                    fields
                                } = this.state;

                                applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                    label = fieldGroupLabel ? fieldGroupLabel : '';

                                applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                    instructions = fieldGroupInstructions ? fieldGroupInstructions : '';

                                applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                    maximumAllowed = maxAllowed ? Number(maxAllowed) : 0;

                                if (fields) {
                                    applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                        fields = fields;
                                }
                                if (applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                    validatorMessages[0]) {
                                    if (validatorFGDupMessage) {
                                        applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            validatorMessages[0].isDuplicated = validatorFGDupMessage;
                                    }
                                    if (validatorFGInvFormatMessage) {
                                        applicationForm.steps[stepIndex].
                                            stepFieldGroups[fgIndex].validatorMessages[0].
                                            invalidFormat = validatorFGInvFormatMessage;
                                    }
                                    if (validatorFGNotValidMessage) {
                                        applicationForm.steps[stepIndex].
                                            stepFieldGroups[fgIndex].validatorMessages[0].
                                            notValid = validatorFGNotValidMessage;
                                    }
                                    if (validatorFGRangeMessage) {
                                        applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            validatorMessages[0].outOfRange = validatorFGRangeMessage;
                                    }
                                    if (validatorFGRequiredMessage) {
                                        applicationForm.steps[stepIndex].stepFieldGroups[fgIndex].
                                            validatorMessages[0].isRequired =
                                            validatorFGRequiredMessage;
                                    }
                                }
                                this.setState({
                                    appForm: applicationForm,
                                    emptyFGDuplicatedMessage: false,
                                    emptyFGFormatMessage: false,
                                    emptyFGNotValidMessage: false,
                                    emptyFGRangeMessage: false,
                                    emptyFGRequiredMessage: false,
                                    emptyNotNumericMessage: false,
                                    emptyNotValidMessage: false,
                                    emptyOutRangeMessage: false,
                                    emptyRequiredMessage: false,
                                    fieldGroupLabel: undefined,
                                    fieldGroupToEdit: undefined,
                                    maxAllowed: undefined,
                                    openFieldGroupModal: false,
                                    selectedDefault: undefined,
                                    selectedFieldGridSize: undefined,
                                    validatorFGDupMessage: undefined,
                                    validatorFGInvFormatMessage: undefined,
                                    validatorFGNotValidMessage: undefined,
                                    validatorFGRangeMessage: undefined,
                                    validatorFGRequiredMessage: undefined,
                                    validatorInvFormatMessage: undefined,
                                    validatorNotNumericMessage: undefined,
                                    validatorNotValidMessage: undefined,
                                    validatorOutRangeMessage: undefined,
                                    validatorRequiredMessage: undefined
                                });
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveFieldGroupSetup.name, e));
        }
    };

    private onSaveFieldSetup = (): void => {
        try {
            const {
                fieldId,
                fieldIdToEdit,
                fields,
                fieldLabel,
                selectedDefault,
                selectedFieldGridSize,
                validatorFDupValidator,
                validatorFNotNumericMessage,
                validatorFNotValidMessage,
                validatorFRangeValidator,
                validatorFRequiredMessage
            } = this.state;

            let isValid: boolean = true;
            if (!fieldLabel) {
                this.setState({
                    emptyFLabel: true
                });
                isValid = false;
            }
            if (fieldId !== 'hispanicRadioGroupId' &&
                fieldId !== 'noHispanicNestedCheckboxListId' &&
                fieldId !== 'participated9Id' &&
                fieldId !== 'participated10Id' &&
                fieldId !== 'participated11Id' &&
                fieldId !== 'participated12Id' &&
                fieldId !== 'participatedPostSecondaryId' &&
                fieldId !== 'relativesAttendedInstitutionId' &&
                fieldId !== 'interestedFoodPlanId' &&
                fieldId !== 'interestedDormPlanId') {
                if (!selectedFieldGridSize) {
                    this.setState({
                        emptyFGridSize: true
                    });
                    isValid = false;
                }
                if (!validatorFRequiredMessage) {
                    this.setState({
                        emptyFRequiredMessage: true
                    });
                    isValid = false;
                }
            }
            if (fieldId === 'educationEndDateId' || fieldId === 'educationEtsCodeId') {
                if (!validatorFNotValidMessage) {
                    this.setState({
                        emptyFNotValidMessage: true
                    });
                    isValid = false;
                }
            }
            if (fieldId === 'testDateTakenId') {
                if (!validatorFNotValidMessage) {
                    this.setState({
                        emptyFNotValidMessage: true
                    });
                    isValid = false;
                }
                if (!validatorFRangeValidator) {
                    this.setState({
                        emptyFRangeMessage: true
                    });
                    isValid = false;
                }
            }
            if (fieldId === 'testScoreId') {
                if (!validatorFDupValidator) {
                    this.setState({
                        emptyFDuplicatedMessage: true
                    });
                    isValid = false;
                }
                if (!validatorFNotNumericMessage) {
                    this.setState({
                        emptyFNotNumericMessage: true
                    });
                    isValid = false;
                }
                if (!validatorFRangeValidator) {
                    this.setState({
                        emptyFRangeMessage: true
                    });
                    isValid = false;
                }
            }
            if (isValid) {
                if (fields && fieldIdToEdit) {
                    const fieldNumber: number =
                        fields.findIndex(x => x.sortOrder === Number(fieldIdToEdit[1]));
                    if (fieldNumber > -1) {
                        if (fieldLabel) {
                            fields[fieldNumber].label = fieldLabel;
                        }
                        if (selectedFieldGridSize) {
                            fields[fieldNumber].gridSize = selectedFieldGridSize.toString();
                        }
                        if (fields[fieldNumber].validatorMessages &&
                            fields[fieldNumber].validatorMessages.length > 0) {
                            if (fields[fieldNumber].validatorMessages[0]) {
                                if (validatorFDupValidator) {
                                    fields[fieldNumber].validatorMessages[0].isDuplicated = validatorFDupValidator;
                                }
                                if (validatorFNotNumericMessage) {
                                    fields[fieldNumber].validatorMessages[0].notNumeric = validatorFNotNumericMessage;
                                }
                                if (validatorFNotValidMessage) {
                                    fields[fieldNumber].validatorMessages[0].notValid = validatorFNotValidMessage;
                                }
                                if (validatorFRangeValidator) {
                                    fields[fieldNumber].validatorMessages[0].outOfRange = validatorFRangeValidator;
                                }
                                if (validatorFRequiredMessage) {
                                    fields[fieldNumber].validatorMessages[0].isRequired = validatorFRequiredMessage;
                                }
                            }
                        }

                        fields[fieldNumber].default = selectedDefault ? selectedDefault.toString() : undefined;

                        this.setState({
                            fieldIdToEdit: undefined,
                            fields: fields,
                            openFieldModal: false,
                            selectedDefault: undefined
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseFieldSetup.name, e));
        }
    };

    private onSaveLayout = (): void => {
        try {
            LayoutActions.setLoading(true);

            const {
                appForm
            } = this.state;

            if (appForm) {
                RequestLayout.postSaveLayout(appForm, 0, this.resolveSaveLayout, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveLayout.name, e));
        }
    };

    private onSaveSendTo = (): void => {
        try {
            const {
                appForm,
                selectedStep,
                fieldGroupToEdit
            } = this.state;

            const applicationForm: IAppSetupForm | undefined = appForm;
            if (applicationForm && applicationForm.steps && applicationForm.steps.length > 0
                && fieldGroupToEdit) {
                const stepIndex: number =
                    applicationForm.steps.findIndex(x => x.stepNumber ===
                        Number(fieldGroupToEdit[1]));
                if (stepIndex > -1) {
                    const fgIndex: number =
                        applicationForm.steps[stepIndex].stepFieldGroups.findIndex(x =>
                            x.sortOrder === Number(fieldGroupToEdit[2]));
                    if (fgIndex > -1) {
                        const newFG: IFieldsGroupSetup =
                            applicationForm.steps[stepIndex].stepFieldGroups[fgIndex];

                        if (selectedStep !== undefined) {
                            newFG.sortOrder =
                                applicationForm.steps[selectedStep].stepFieldGroups.length + 1;
                            applicationForm.steps[selectedStep].stepFieldGroups.push(newFG);
                            applicationForm.steps[stepIndex].stepFieldGroups.splice(fgIndex, 1);

                            this.setState({
                                activeStep: selectedStep,
                                appForm: applicationForm,
                                openSendToModal: false
                            });
                        }
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSendTo.name, e));
        }
    };

    private onSaveSetupStep = (): void => {
        try {
            const {
                appForm
            } = this.state;

            const applicationForm: IAppSetupForm | undefined = appForm;
            if (applicationForm && applicationForm.steps) {
                const {
                    stepIndex,
                    stepTitle
                } = this.state;

                if (stepIndex === undefined) {
                    if (appForm && appForm.fieldsGroups) {
                        const fieldGroupIndex: number =
                            appForm.fieldsGroups.findIndex(x =>
                                x.id === 'confirmationGroup');
                        if (fieldGroupIndex > -1) {
                            appForm.fieldsGroups[fieldGroupIndex].label =
                                stepTitle ? stepTitle : '';
                            this.setState({
                                appForm: appForm,
                                openStepSetupModal: false
                            });
                        }
                    }
                }
                else {
                    if (stepTitle) {
                        const stepNumber: number =
                            applicationForm.steps.findIndex(x => x.stepNumber === stepIndex);
                        if (stepNumber > -1) {
                            applicationForm.steps[stepNumber].stepTitle = stepTitle;
                            this.setState({
                                appForm: applicationForm,
                                openStepSetupModal: false,
                                stepTitle: ''
                            });
                        }
                        else {
                            const newStep: IStepSetup = {
                                stepFieldGroups: [],
                                stepInstructions: '',
                                stepNumber: applicationForm.steps.length + 1,
                                stepTitle: stepTitle
                            };
                            applicationForm.steps.push(newStep);
                            this.setState({
                                appForm: applicationForm,
                                openStepSetupModal: false,
                                stepModified: false,
                                stepTitle: ''
                            });
                        }
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSetupStep.name, e));
        }
    };
    // #endregion Events

    // #region Function
    private getAvailableColors(resources: IApplicationSetupResources):
        IDropDownOption[] {
        const options: IDropDownOption[] = [];
        try {
            let option: IDropDownOption;
            option = {
                description:
                    resources.appTextSetupResources.lblDefault,
                value: 'default'
            };
            options.push(option);
            option = {
                description:
                    resources.appTextSetupResources.lblError,
                value: 'error'
            };
            options.push(option);
            option = {
                description:
                    resources.appTextSetupResources.lblPrimary,
                value: 'primary'
            };
            options.push(option);
            option = {
                description:
                    resources.appTextSetupResources.lblSecondary,
                value: 'secondary'
            };
            options.push(option);
        }
        catch (e) {
            this.logError(LogData.fromException(this.getAvailableColors.name, e));
        }
        return options;
    }

    private getAvailableComponents(resources: IApplicationSetupResources):
        IDropDownOption[] {
        const options: IDropDownOption[] = [];
        try {
            let option: IDropDownOption;
            option = {
                description:
                    resources.appAddComponentModalResources.lblImage,
                value: 'Image'
            };
            options.push(option);
            option = {
                description:
                    resources.appAddComponentModalResources.lblDivider,
                value: 'Divider'
            };
            options.push(option);
            option = {
                description:
                    resources.appAddComponentModalResources.lblText,
                value: 'Text'
            };
            options.push(option);
            option = {
                description:
                    resources.appAddComponentModalResources.lblEmailLink,
                value: 'IconLinkEmail'
            };
            options.push(option);
            option = {
                description:
                    resources.appAddComponentModalResources.lblPhoneLink,
                value: 'IconLinkPhone'
            };
            options.push(option);
            option = {
                description:
                    resources.appAddComponentModalResources.lblButton,
                value: 'Button'
            };
            options.push(option);
            option = {
                description:
                    resources.appAddComponentModalResources.lblUserDefined,
                value: 'UserDefined'
            };
            options.push(option);
            option = {
                description:
                    resources.appAddComponentModalResources.lblHtmlElement,
                value: 'HtmlElement'
            };
            options.push(option);
        }
        catch (e) {
            this.logError(LogData.fromException(this.getAvailableComponents.name, e));
        }
        return options;
    }

    private getAvailableCounties(): void {
        try {
            RequestLayout.getCounties(this.resolveGetCounties, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.getAvailableCounties.name, e));
        }
    }

    private getAvailableCountries(): void {
        try {
            RequestLayout.getCountries(this.resolveGetCountries, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.getAvailableCountries.name, e));
        }
    }

    private getAvailableDataTypes(): IDropDownOption[] {
        const options: IDropDownOption[] = [];
        try {
            let option: IDropDownOption;
            option = {
                description: 'nvarchar',
                value: 'nvarchar'
            };
            options.push(option);
            option = {
                description: 'date',
                value: 'date'
            };
            options.push(option);
            option = {
                description: 'time',
                value: 'time'
            };
            options.push(option);
        }
        catch (e) {
            this.logError(LogData.fromException(this.getAvailableDataTypes.name, e));
        }
        return options;
    }

    private getAvailablePrograms(): void {
        try {
            RequestLayout.getPrograms(this.resolveGetPrograms, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.getAvailablePrograms.name, e));
        }
    }

    private getAvailableTextSizes(resources: IApplicationSetupResources):
        IDropDownOption[] {
        const options: IDropDownOption[] = [];
        try {
            let option: IDropDownOption;
            option = {
                description:
                    resources.appTextSetupResources.lblDefault,
                value: 'default'
            };
            options.push(option);
            option = {
                description:
                    resources.appTextSetupResources.lblH1,
                value: 'h1'
            };
            options.push(option);
            option = {
                description:
                    resources.appTextSetupResources.lblH2,
                value: 'h2'
            };
            options.push(option);
            option = {
                description:
                    resources.appTextSetupResources.lblH3,
                value: 'h3'
            };
            options.push(option);
            option = {
                description:
                    resources.appTextSetupResources.lblH4,
                value: 'h4'
            };
            options.push(option);
        }
        catch (e) {
            this.logError(LogData.fromException(this.getAvailableTextSizes.name, e));
        }
        return options;
    }

    private getAvailableTypes(resources: IApplicationSetupResources):
        IDropDownOption[] {
        const options: IDropDownOption[] = [];
        try {
            let option: IDropDownOption = {
                description: resources.appUserDefinedSetupResources.lblCheckbox,
                value: 'Checkbox'
            };
            options.push(option);
            option = {
                description: resources.appUserDefinedSetupResources.lblDropdown,
                value: 'Dropdown'
            };
            options.push(option);
            option = {
                description: resources.appUserDefinedSetupResources.lblTextField,
                value: 'TextField'
            };
            options.push(option);
            option = {
                description: resources.appUserDefinedSetupResources.lblDatePicker,
                value: 'DatePicker'
            };
            options.push(option);
        }
        catch (e) {
            this.logError(LogData.fromException(this.getAvailableTypes.name, e));
        }
        return options;
    }

    private getAvailableStates(): void {
        try {
            RequestLayout.getStateProvinces(this.resolveGetStates, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.getAvailableStates.name, e));
        }
    }

    private getAvailableSteps(appSetup: IAppSetupForm):
        IDropDownOption[] {
        const options: IDropDownOption[] = [];
        try {
            if (appSetup.steps && appSetup.steps.length > 0) {
                appSetup.steps.forEach((step, i) => {
                    const option: IDropDownOption = {
                        description: step.stepTitle,
                        value: i
                    };
                    options.push(option);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.getAvailableSteps.name, e));
        }
        return options;
    }

    private getAvailablesGridSizes(resources: IApplicationSetupResources):
        IDropDownOption[] {
        const options: IDropDownOption[] = [];
        try {
            let option: IDropDownOption = {
                description: resources.appFieldGroupSetupResources.lblExtraSmall,
                value: 'XS'
            };
            options.push(option);
            option = {
                description: resources.appFieldGroupSetupResources.lblSmall,
                value: 'S'
            };
            options.push(option);
            option = {
                description: resources.appFieldGroupSetupResources.lblMedium,
                value: 'M'
            };
            options.push(option);
            option = {
                description: resources.appFieldGroupSetupResources.lblLarge,
                value: 'L'
            };
            options.push(option);
            option = {
                description: resources.appFieldGroupSetupResources.lblExtraLarge,
                value: 'XL'
            };
            options.push(option);
        }
        catch (e) {
            this.logError(LogData.fromException(this.getAvailablesGridSizes.name, e));
        }
        return options;
    }
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
    private resolveGetCounties = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCounties.name);

            if (result?.status) {
                this.setState({
                    availableCounties: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetCounties.name, e));
        }
    };

    private resolveGetCountries = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCountries.name);

            if (result?.status) {
                this.setState({
                    availableCountries: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetCountries.name, e));
        }
    };

    private resolveGetLayout = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetLayout.name);

            if (result?.status) {
                const steps: IDropDownOption[] =
                    this.getAvailableSteps(result.data);

                this.setState({
                    appForm: result.data,
                    availableSteps: steps
                });

                const {
                    resources
                } = this.state;

                if (resources) {
                    const availableSizes: IDropDownOption[] =
                        this.getAvailablesGridSizes(resources);
                    this.setState({
                        availableGridSizes: availableSizes
                    });
                    const availableComponents: IDropDownOption[] =
                        this.getAvailableComponents(resources);
                    this.setState({
                        availableComponents: availableComponents
                    });
                    this.setState({
                        availableDataTypes: this.getAvailableDataTypes()
                    });
                    this.setState({
                        availableTypes: this.getAvailableTypes(resources)
                    });
                    this.setState({
                        availableColors: this.getAvailableColors(resources)
                    });
                    this.setState({
                        availableTextSizes: this.getAvailableTextSizes(resources)
                    });
                }

                const {
                    appLayoutId
                } = this.state;

                if (appLayoutId === 1) {
                    const {
                        appForm
                    } = this.state;

                    const applicationForm: IAppSetupForm | undefined = appForm;
                    if (applicationForm) {
                        applicationForm.formLayoutId = 0;
                        applicationForm.name = '';
                        applicationForm.description = '';
                    }

                    this.setState({
                        appForm: applicationForm
                    });

                    this.setState({
                        openNameSetupModal: true
                    }, () => LayoutActions.setLoading(false));
                }
                else {
                    LayoutActions.setLoading(false);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetLayout.name, e));
        }
    };

    private resolveGetPrograms = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPrograms.name);

            if (result?.status) {
                this.setState({
                    availablePrograms: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPrograms.name, e));
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

    private resolveGetStates = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetStates.name);

            if (result?.status) {
                this.setState({
                    availableStates: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetStates.name, e));
        }
    };

    private resolveLayoutReady = () => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
                LayoutActions.setLoading(true);
                const hdnLayoutId: HTMLInputElement | undefined =
                    document.getElementById('hdnLayoutId') as HTMLInputElement;
                if (hdnLayoutId && hdnLayoutId.value) {
                    console.log(hdnLayoutId.value);
                    if (Number(hdnLayoutId.value) === 1) {
                        RequestLayout.getFormLayoutDefault(0, this.resolveGetLayout, this.logError);
                    }
                    else {
                        RequestLayout.getFormLayoutDetails(Number(hdnLayoutId.value),
                            this.resolveGetLayout, this.logError);
                    }
                    this.setState({
                        appLayoutId: Number(hdnLayoutId.value)
                    });
                    hdnLayoutId.remove();
                }
            }
            else {
                LayoutActions.setLoading(false);
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };

    private resolveNameExist = (json: string) => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveNameExist.name);

            if (result?.status) {
                LayoutActions.setLoading(false);
                if (result.data) {
                    this.setState({
                        layoutNameNotValid: true
                    });
                }
                else {
                    const {
                        appForm,
                        layoutDescription,
                        layoutName
                    } = this.state;

                    if (appForm) {
                        if (layoutName) {
                            appForm.name = layoutName;
                        }
                        if (layoutDescription) {
                            appForm.description = layoutDescription;
                        }

                        this.setState({
                            appForm: appForm,
                            layoutNameNotValid: false,
                            openNameSetupModal: false
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveNameExist.name, e));
        }
    };

    private resolveSaveLayout = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveLayout.name);

            if (result?.status) {
                const {
                    resources
                } = this.state;

                if (resources) {
                    LayoutActions.setLoading(false);
                    window.location.href = `${Constants.webUrl}/Administration/FormsSetup`;
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveLayout.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IApplicationSetupResources | undefined = LayoutStore.getResources();

        if (ready) {
            this.setState({
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
    public componentDidMount(): void {
        // TO DO
    }

    public componentWillUnmount(): void {
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);
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
            activeStep,
            appForm,
            availableColors,
            availableComponents,
            availableCounties,
            availableCountries,
            availableDataTypes,
            availableGridSizes,
            availableStates,
            availableSteps,
            availableTextSizes,
            availableOptions,
            availablePrograms,
            availableTypes,
            emptyComponent,
            componentError,
            fieldGroupInstructions,
            fieldGroupLabel,
            fieldGroupId,
            fieldId,
            fieldIdToEdit,
            fieldLabel,
            fields,
            layoutDescription,
            layoutName,
            layoutNameIsEmpty,
            layoutNameNotValid,
            maxAllowed,
            openAddComponet,
            openAddOption,
            openConfirmationRemove,
            openFieldGroupModal,
            openFieldModal,
            openNameSetupModal,
            openSendToModal,
            openStepSetupModal,
            selectedComponet,
            selectedDefault,
            selectedFieldGridSize,
            selectedGridSize,
            selectedStep,
            selectedUserDefinedDataType,
            selectedUserDefinedType,
            stepModified,
            stepTitle,

            // empty flags for fields
            emptyFDuplicatedMessage,
            emptyFInvFormatMessage,
            emptyFGridSize,
            emptyFLabel,
            emptyFNotNumericMessage,
            emptyFNotValidMessage,
            emptyFRangeMessage,
            emptyFRequiredMessage,

            // empty flags for fields groups
            emptyFGDuplicatedMessage,
            emptyFGFormatMessage,
            emptyFGNotValidMessage,
            emptyFGRangeMessage,
            emptyFGRequiredMessage,

            // empty flags for fields groups with one field
            emptyGridSize,
            emptyInvFormatMessage,
            emptyLabel,
            emptyNotNumericMessage,
            emptyNotValidMessage,
            emptyOutRangeMessage,
            emptyRequiredMessage,

            // empty flags for user defined
            emptyAddOptDescription,
            emptyAddOptValue,
            emptyDataType,
            emptyId,
            emptyMaxLength,
            emptyType,

            // empty flags for text fields
            emptyColor,
            emptyTextSize,

            // validation messages for fields
            validatorFDupValidator,
            validatorFNotNumericMessage,
            validatorFNotValidMessage,
            validatorFRangeValidator,
            validatorFRequiredMessage,

            // validation messages for field groups
            validatorFGDupMessage,
            validatorFGInvFormatMessage,
            validatorFGNotValidMessage,
            validatorFGRangeMessage,
            validatorFGRequiredMessage,

            // validation messages for field groups with one field
            validatorInvFormatMessage,
            validatorNotNumericMessage,
            validatorNotValidMessage,
            validatorOutRangeMessage,
            validatorRequiredMessage,

            // user defined fields
            optionDescription,
            optionValue,
            userDefinedCustomScript,
            userDefinedId,
            userDefinedIsRequired,
            userDefinedIsUploading,
            userDefinedLabel,
            userDefinedMaxLength,
            validatorUserDefinedOutRangeMsg,
            validatorUserDefinedRequiredMessage,

            // text fields
            isWithLink,
            selectedColor,
            selectedTextSize,
            textActionUrl,
            textId,
            textLabel,

            // divider, htmlElement, image
            emptyAlt,
            emptySrc,
            textAlt,
            textSrc,

            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            let appNameSetup: JSX.Element | undefined;
            if (openNameSetupModal) {
                appNameSetup = (
                    <AppNameSetup
                        layoutDescription={layoutDescription}
                        layoutName={layoutName}
                        layoutNameIsEmpty={layoutNameIsEmpty}
                        layoutNameNotValid={layoutNameNotValid}
                        open={openNameSetupModal}
                        onChangeTextField={this.onChangeTextField}
                        onClose={this.onCloseAppNameSetup}
                        onSave={this.onSaveAppNameSetup}
                        resources={resources.appNameSetupResources}
                    />
                );
            }
            let sendToModal: JSX.Element | undefined;
            if (openSendToModal && availableSteps && fieldGroupId) {
                sendToModal = (
                    <AppSendToModal
                        availableSteps={availableSteps}
                        fieldGroupId={fieldGroupId}
                        open={openSendToModal}
                        selectedStep={selectedStep}
                        resources={resources.appSendToModalResources}
                        onChangeDropDown={this.onChangeSendToDropDown}
                        onClose={this.onCloseSendTo}
                        onSave={this.onSaveSendTo}
                    />
                );
            }
            let setupStepModal: JSX.Element | undefined;
            if (openStepSetupModal) {
                setupStepModal = (
                    <AppSetupStepModal
                        stepModified={stepModified}
                        stepTitle={stepTitle}
                        open={openStepSetupModal}
                        onChangeTextField={this.onChangeTextField}
                        onClose={this.onCloseSetupStep}
                        onSave={this.onSaveSetupStep}
                        resources={resources.appSetupStepModalResources}
                    />
                );
            }
            let setupFieldGroup: JSX.Element | undefined;
            if (openFieldGroupModal && availableGridSizes && fieldGroupId) {
                setupFieldGroup = (
                    <AppFieldGroupSetup
                        availableCountries={availableCountries}
                        availableGridSize={availableGridSizes}
                        emptyFGDuplicatedMessage={emptyFGDuplicatedMessage}
                        emptyFGFormatMessage={emptyFGFormatMessage}
                        emptyFGNotValidMessage={emptyFGNotValidMessage}
                        emptyFGRangeMessage={emptyFGRangeMessage}
                        emptyFGRequiredMessage={emptyFGRequiredMessage}
                        emptyGridSize={emptyGridSize}
                        emptyInvFormatMessage={emptyInvFormatMessage}
                        emptyLabel={emptyLabel}
                        emptyNotNumericMessage={emptyNotNumericMessage}
                        emptyNotValidMessage={emptyNotValidMessage}
                        emptyOutRangeMessage={emptyOutRangeMessage}
                        emptyRequiredMessage={emptyRequiredMessage}
                        fieldGroupId={fieldGroupId}
                        fields={fields}
                        instructions={fieldGroupInstructions}
                        label={fieldGroupLabel}
                        maxAllowed={maxAllowed}
                        selectedDefault={selectedDefault}
                        selectedGridSize={selectedGridSize}
                        open={openFieldGroupModal}
                        validatorFGDupMessage={validatorFGDupMessage}
                        validatorFGInvFormatMessage={validatorFGInvFormatMessage}
                        validatorFGNotValidMessage={validatorFGNotValidMessage}
                        validatorFGRangeMessage={validatorFGRangeMessage}
                        validatorFGRequiredMessage={validatorFGRequiredMessage}
                        validatorInvFormatMessage={validatorInvFormatMessage}
                        validatorNotNumericMessage={validatorNotNumericMessage}
                        validatorNotValidMessage={validatorNotValidMessage}
                        validatorOutRangeMessage={validatorOutRangeMessage}
                        validatorRequiredMessage={validatorRequiredMessage}
                        onChangeDropDown={this.onChangeDropDown}
                        onChangeTextField={this.onChangeTextField}
                        onClickDownButton={this.onClickDownFieldButton}
                        onClickUpButton={this.onClickUpFieldButton}
                        onClose={this.onCloseFieldGroupSetup}
                        onEditField={this.onEditField}
                        onSave={this.onSaveFieldGroupSetup}
                        resources={resources.appFieldGroupSetupResources}
                    />
                );
            }
            let setupField: JSX.Element | undefined;
            if (openFieldModal && availableGridSizes && fieldId && fieldGroupId &&
                availableCountries && availableStates && availableCounties && availablePrograms) {
                setupField = (
                    <AppFieldSetup
                        availableCounties={availableCounties}
                        availableCountries={availableCountries}
                        availableGridSize={availableGridSizes}
                        availablePrograms={availablePrograms}
                        availableStates={availableStates}
                        emptyDuplicatedMessage={emptyFDuplicatedMessage}
                        emptyGridSize={emptyFGridSize}
                        emptyInvFormatMessage={emptyFInvFormatMessage}
                        emptyLabel={emptyFLabel}
                        emptyNotNumericMessage={emptyFNotNumericMessage}
                        emptyNotValidMessage={emptyFNotValidMessage}
                        emptyOutRangeMessage={emptyFRangeMessage}
                        emptyRequiredMessage={emptyFRequiredMessage}
                        fieldGroupId={fieldGroupId}
                        fieldId={fieldId}
                        label={fieldLabel}
                        selectedDefault={selectedDefault}
                        selectedGridSize={selectedFieldGridSize}
                        open={openFieldModal}
                        validatorDupValidator={validatorFDupValidator}
                        validatorNotNumericMessage={validatorFNotNumericMessage}
                        validatorNotValidMessage={validatorFNotValidMessage}
                        validatorOutRangeMessage={validatorFRangeValidator}
                        validatorRequiredMessage={validatorFRequiredMessage}
                        onChangeDropDown={this.onChangeDropDown}
                        onChangeTextField={this.onChangeTextField}
                        onClose={this.onCloseFieldSetup}
                        onSave={this.onSaveFieldSetup}
                        resources={resources.appFieldGroupSetupResources}
                    />
                );
            }
            let addComponent: JSX.Element | undefined;
            if (openAddComponet && availableComponents && availableDataTypes && availableTypes
                && availableGridSizes && availableColors && availableTextSizes) {
                addComponent = (
                    <AppAddComponentModal
                        availableColors={availableColors}
                        availableComponents={availableComponents}
                        availableDataTypes={availableDataTypes}
                        availableGridSize={availableGridSizes}
                        availableOptions={availableOptions}
                        availableTextSizes={availableTextSizes}
                        availableTypes={availableTypes}
                        emptyAlt={emptyAlt}
                        emptyColor={emptyColor}
                        emptyComponent={emptyComponent}
                        emptyDataType={emptyDataType}
                        emptyId={emptyId}
                        emptyGridSize={emptyGridSize}
                        emptyLabel={emptyLabel}
                        emptyMaxLength={emptyMaxLength}
                        emptyRequiredMessage={emptyRequiredMessage}
                        emptySrc={emptySrc}
                        emptyTextSize={emptyTextSize}
                        emptyType={emptyType}
                        emptyValidatorOutRange={emptyOutRangeMessage}
                        fieldIdToEdit={fieldIdToEdit}
                        isWithLink={isWithLink}
                        open={openAddComponet}
                        selectedColor={selectedColor}
                        selectedComponent={selectedComponet}
                        selectedGridSize={selectedGridSize}
                        selectedTextSize={selectedTextSize}
                        selectedUserDefinedDataType={selectedUserDefinedDataType}
                        selectedUserDefinedType={selectedUserDefinedType}
                        textActionUrl={textActionUrl}
                        textAlt={textAlt}
                        textId={textId}
                        textLabel={textLabel}
                        textSrc={textSrc}
                        userDefinedCustomScript={userDefinedCustomScript}
                        userDefinedId={userDefinedId}
                        userDefinedIsRequired={userDefinedIsRequired}
                        userDefinedIsUploading={userDefinedIsUploading}
                        userDefinedLabel={userDefinedLabel}
                        userDefinedMaxLength={userDefinedMaxLength}
                        validatorUserDefinedOutRangeMsg={validatorUserDefinedOutRangeMsg}
                        validatorUserDefinedRequiredMessage={validatorUserDefinedRequiredMessage}
                        onChangeCheckBox={this.onChangeCheckBox}
                        onChangeDropDown={this.onChangeDropDown}
                        onChangeTextField={this.onChangeTextField}
                        onClickAddOptions={this.onClickAddOptions}
                        onClickRemoveOption={this.onClickRemoveOption}
                        onClose={this.onCloseAddComponent}
                        onRemove={this.onRemoveComponent}
                        onSave={this.onSaveAddComponent}
                        resources={resources.appAddComponentModalResources}
                        resourcesExtraComponentsSetup={resources.appExtraComponentSetupResources}
                        resourcesTextSetup={resources.appTextSetupResources}
                        resourcesAppUserDefined={resources.appUserDefinedSetupResources}
                    />
                );
            }
            let addOptions: JSX.Element | undefined;
            if (openAddOption) {
                addOptions = (
                    <AppAddOptionsModal
                        emptyDescription={emptyAddOptDescription}
                        emptyValue={emptyAddOptValue}
                        open={openAddOption}
                        optionDescription={optionDescription}
                        optionValue={optionValue}
                        onChangeTextField={this.onChangeTextField}
                        onClose={this.onCloseAddOption}
                        onSave={this.onSaveAddOption}
                        resources={resources.appAddOptionsModalResources}
                    />
                );
            }
            let confirmationModal: JSX.Element | undefined;
            if (openConfirmationRemove) {
                confirmationModal = (
                    <ConfirmationDialog
                        contentText={resources.appAddComponentModalResources.lblMessage}
                        open={openConfirmationRemove}
                        primaryActionOnClick={this.onClickCancelRemoveComponet}
                        primaryActionText={resources.appAddComponentModalResources.btnDecline}
                        secondaryActionOnClick={this.onClickRemoveComponent}
                        secondaryActionText={resources.appAddComponentModalResources.btnAccept}
                        title={resources.appAddComponentModalResources.lblConfirmationDialogTitle}
                    />
                );
            }
            contentPage = (
                <>
                    <AppSetupHandler
                        activeStep={activeStep}
                        applicationForm={appForm}
                        layoutDescription={layoutDescription}
                        layoutName={layoutName}
                        resources={resources.appSetupHandlerResources}
                        onClickAddComponent={this.onClickAddComponent}
                        onClickAddNewStep={this.onClickAddNewStep}
                        onChangeExpansionPanel={this.onChangeExpansionPanel}
                        onClickDownButton={this.onClickDownButton}
                        onClickDownFieldGroupButton={this.onClickDownFieldGroupButton}
                        onClickSendToButton={this.onClickSendToButton}
                        onClickUpButton={this.onClickUpButton}
                        onClickUpFieldGroupButton={this.onClickUpFieldGroupButton}
                        onEditFieldGroup={this.onEditFieldGroup}
                        onEditName={this.onEditNameLayout}
                        onEditStepButton={this.onEditStepButton}
                        onSave={this.onSaveLayout}
                    />
                    {appNameSetup}
                    {sendToModal}
                    {setupStepModal}
                    {setupFieldGroup}
                    {setupField}
                    {addComponent}
                    {addOptions}
                    {confirmationModal}
                </>
            );
        }

        return (
            <Layout
                idModule={this.idModule}
                idPage={this.idPage}
                showCart
                showNotifications
            >
                {contentPage}
            </Layout>
        );
    }
}

const ApplicationSetupViewWithLayout = withLayout(ApplicationSetupView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<ApplicationSetupViewWithLayout />, document.getElementById('root'));