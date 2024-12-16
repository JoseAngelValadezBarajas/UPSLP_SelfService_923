/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: InquiryFormView.tsx
 * Type: Container component */

// #region Imports
import moment from 'moment';
import React, { RefObject } from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';

// Internal Components
import AddressSearchModal from '../ApplicationForm/AddressSearchModal';
import ApplicationHandler from '../ApplicationForm/ApplicationHandler';
import ETSSearchModal from '../ApplicationForm/ETSSearchModal';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IAddress } from '../../../Types/Account/IAddress';
import { IApplicationActivity } from '../../../Types/Applications/IApplicationActivity';
import { IApplicationAddress } from '../../../Types/Applications/IApplicationAddress';
import { IApplicationEducation } from '../../../Types/Applications/IApplicationEducation';
import { IApplicationErrors } from '../../../Types/Applications/IApplicationErrors';
import { IGroupErrors } from '../../../Types/Applications/IApplicationErrors';
import { IApplicationIpeds } from '../../../Types/Applications/IApplicationIpeds';
import { IApplicationPhoneList } from '../../../Types/Applications/IApplicationPhoneList';
import { IApplicationProgram } from '../../../Types/Applications/IApplicationProgram';
import { IApplicationUserDefined } from '../../../Types/Applications/IApplicationUserDefined';
import { IInstitution } from '../../../Types/Applications/IInstitution';
import { IApplicationForm } from '../../../Types/Form/IApplicationForm';
import { IDataForm } from '../../../Types/Form/IDataForm';
import { IFieldForm } from '../../../Types/Form/IFieldForm';
import { IFieldsGroup } from '../../../Types/Form/IFieldsGroup';
import { IInquiry } from '../../../Types/Inquiries/IInquiry';
import { IInquiryFormResources } from '../../../Types/Resources/Admissions/IInquiryFormResources';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Requests
import RequestsInquiry from '../../../Requests/Admissions/InquiryForm';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types

interface IInquiryFormState {
    // Address
    addressessCount: number;

    // Address Search Modal
    addresses?: IAddress[];
    hasSearchZipCode: boolean;
    openAddressSearchModal: boolean;
    selectedZipCode?: string;

    // Inquiry
    activeStep: number;
    components?: IApplicationForm;
    componentError: boolean;
    cultures: ICultures;
    dateTimeCulture: string;
    errors: IApplicationErrors[];
    expanded: boolean | string;
    expansionPanelHeaders: string[];
    firstDayOfWeek: number;
    inquiry: IInquiry;
    resources?: IInquiryFormResources;
    rowsPerPageOptions: number[];
    shortDatePattern: string;

    // Education Information
    educationCount: number;

    // ETS Search Modal
    countries?: IDropDownOption[];
    institutions?: IInstitution[];
    openETSSearchModal: boolean;
    selectedCity?: string;
    selectedCountry?: number;
    selectedEtsCode?: string;
    selectedFieldId?: string;
    selectedInstitutionName?: string;
    selectedState?: number;
    states?: IDropDownOption[];
    pageNumber: number;
    pageSize: number;
    total: number;

    // Phone
    phoneCount: number;

    // Programs
    programsCount: number;

    // Activities
    activityCount: number;

    // ReCatpcha
    isReCaptchaSubmitInquiryEnabled: boolean;
    reCaptchaError: boolean;
    reCaptchaSiteKey: string;
    uiCulture: string;
}
// #endregion Types

// #region Component
class InquiryFormView extends React.Component<any, IInquiryFormState> {
    private idMainPage: string;
    private idModule: string;
    private idPage: string;
    private reCaptchaRef: RefObject<any>;

    public readonly state: Readonly<IInquiryFormState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idMainPage = 'Inquiries';
        this.idModule = 'Admissions';
        this.idPage = 'InquiryForm';
        this.state = this.getInitialState();
        this.reCaptchaRef = React.createRef();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IInquiryFormState {
        let resources: IInquiryFormResources | undefined;
        let isReCaptchaSubmitInquiryEnabled: boolean = false;
        let reCaptchaSiteKey: string = '';

        if (this.state) {
            resources = this.state.resources;
            isReCaptchaSubmitInquiryEnabled = this.state.isReCaptchaSubmitInquiryEnabled;
            reCaptchaSiteKey = this.state.reCaptchaSiteKey;
        }

        const cultures: ICultures = LayoutStore.getCultures();

        return {
            activeStep: 0,
            activityCount: 0,
            addresses: [],
            addressessCount: 0,
            componentError: false,
            components: undefined,
            cultures: LayoutStore.getCultures(),
            dateTimeCulture: cultures.dateTimeCulture,
            educationCount: 0,
            errors: [],
            expanded: false,
            expansionPanelHeaders: [],
            firstDayOfWeek: cultures.firstDayOfWeek,
            inquiry: {
                addresses: [],
                education: [],
                phones: [],
                userDefined: []
            },
            hasSearchZipCode: false,
            institutions: [],
            openAddressSearchModal: false,
            openETSSearchModal: false,
            pageNumber: 0,
            pageSize: 5,
            phoneCount: 0,
            programsCount: 0,
            resources: resources,
            rowsPerPageOptions: [5, 10, 15, 20, 25, 50],
            shortDatePattern: cultures.shortDatePattern,
            total: 0,

            // #region ReCaptcha
            isReCaptchaSubmitInquiryEnabled: isReCaptchaSubmitInquiryEnabled,
            reCaptchaError: false,
            reCaptchaSiteKey: reCaptchaSiteKey,
            uiCulture: LayoutStore.getCultures().uiCulture
            // #endregion ReCaptcha
        };
    }

    // #region Events

    private onAddMore = (fieldGroup: IFieldsGroup, stepIndex: number, fieldGroupIndex: number): void => {
        try {
            if (fieldGroup.id && fieldGroup.id !== '') {
                const {
                    activityCount,
                    addressessCount,
                    components,
                    educationCount,
                    errors,
                    expanded,
                    phoneCount,
                    programsCount
                } = this.state;

                switch (fieldGroup.id) {
                    case 'programOfStudyGroup':
                        if (components) {
                            this.createNewSection(components, fieldGroup, errors, stepIndex,
                                fieldGroupIndex, programsCount, 'programOfStudydErrorsId', expanded);

                            this.setState({
                                programsCount: programsCount + 1
                            });
                        }
                        break;
                    case 'phoneGroup':
                        if (components) {
                            this.createNewSection(components, fieldGroup, errors, stepIndex,
                                fieldGroupIndex, phoneCount, 'phoneErrorsId', expanded);

                            this.setState({
                                phoneCount: phoneCount + 1
                            });
                        }
                        break;
                    case 'addressInformationGroup':
                        if (components) {
                            // Error id is not sent because errorId for this group will be excluded
                            this.createNewSection(components, fieldGroup, errors, stepIndex,
                                fieldGroupIndex, addressessCount, '', expanded);

                            this.setState({
                                addressessCount: addressessCount + 1
                            });
                        }
                        break;
                    case 'educationGroup':
                        if (components) {
                            // Error id is not sent because errorId for this group will be excluded
                            this.createNewSection(components, fieldGroup, errors, stepIndex,
                                fieldGroupIndex, educationCount, '', expanded);

                            this.setState({
                                educationCount: educationCount + 1
                            });
                        }
                        break;
                    case 'activityGroup':
                        if (components) {
                            const initialGroupLength: number = fieldGroup.fields.length;

                            // Error id is not sent because errorId for this group will be excluded
                            this.createNewSection(components, fieldGroup, errors, stepIndex,
                                fieldGroupIndex, activityCount, '', expanded);

                            const finalGroupLength: number = fieldGroup.fields.length;
                            const newSet: IFieldForm[] = fieldGroup.fields.slice(initialGroupLength, finalGroupLength);
                            const parentDropDown: IFieldForm = newSet[newSet.findIndex(e => e.childField !== null)];
                            const childDropDown: IFieldForm = newSet[newSet.findIndex(e => e.data.id.split('|')[0] === parentDropDown.childField)];
                            childDropDown.data.options = [];
                            parentDropDown.childField = childDropDown.data.id;

                            this.setState({
                                activityCount: activityCount + 1
                            });
                        }
                        break;
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddMore.name, e));
        }
    };

    private onAddDeleteButton = (fieldGroup: IFieldsGroup, stepIndex: number, fieldGroupIndex:
        number, groupLength: number, sectionNumber: number): void => {
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

    private onChangeCheckBox = (event: any): void => {
        try {
            const {
                components,
                inquiry
            } = this.state;

            if (inquiry && components) {
                const inq: IInquiry = inquiry;
                const fieldId: string[] = event.target.id.split('|');
                const newComponents: IApplicationForm = components;
                const value: boolean = Boolean(event.target.checked);
                const evaluateAppJs = eval;

                switch (fieldId[0]) {
                    case 'extraCurricularActivityId':
                        inq.isInterestedInExtracurricular = value;
                        break;
                    case 'financialAidId':
                        inq.isInterestedInFinancialAid = value;
                        break;
                    case 'retiredId':
                        inq.isRetired = value;
                        break;
                    case 'seekingDegreeId':
                        inq.isSeekingDegree = value;
                        break;
                    case 'policyCheckboxId':
                        inq.policy = value;
                        break;
                    case 'criminalConvictionsId':
                        inq.isCriminalConviction = value;
                        break;
                }
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
                    components: newComponents,
                    inquiry: inq
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
                components,
                cultures,
                inquiry,
                resources
            } = this.state;

            if (id && id !== '' && inquiry && components) {
                const inq: IInquiry = inquiry;
                const fieldId: string[] = id.split('|');
                let newComponents: IApplicationForm = components;
                const field = newComponents.steps[Number(fieldId[1])].
                    fieldsGroups[Number(fieldId[2])].
                    fields[Number(fieldId[3])];

                const dateMinFormat: string =
                    moment().add(-100, 'years').format(cultures.shortDatePattern.toUpperCase());
                const dateMaxFormat: string =
                    moment().add(100, 'years').format(cultures.shortDatePattern.toUpperCase());

                switch (fieldId[0]) {
                    case 'dateOfEntryId':
                        inq.dateOfEntry = date;
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
                    case 'dateOfBirthId':
                        inq.dateOfBirth = date;
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
                        inq.visaExpiration = date;
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
                        inq.passportExpiration = date;
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
                                field.data.error = true;
                                field.data.helperText = field.data.errorMessageRequired;
                            }
                        }
                        break;
                }

                this.setState({
                    components: newComponents,
                    inquiry: inq
                });

            }

        } catch (e) {
            this.logError(LogData.fromException(this.onChangeDateTimeField.name, e));
        }
    };

    private onChangeDropDown = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                components,
                inquiry
            } = this.state;

            if (id && id !== '' && inquiry && components) {
                const inq: IInquiry = inquiry;
                const fieldId: string[] = id.split('|');

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
                    case 'sessionPeriodId':
                        const selectedPeriod = optionSelected.description.split('/');
                        if (selectedPeriod.length === 1) {
                            inquiry.academicYear = Number(optionSelected.value);
                        }
                        if (selectedPeriod.length === 2) {
                            inquiry.termPeriodId = Number(optionSelected.value);
                        }
                        if (selectedPeriod.length === 3) {
                            inquiry.sessionPeriodId = Number(optionSelected.value);
                        }
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
                            let ipedsList: IApplicationIpeds[] | undefined = inq.ipeds;
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
                            inq.ipeds = ipedsList;
                            this.setState({
                                components: components,
                                inquiry: inq
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
                        if (fieldId[0] === 'activityTypeId' && field.childField && valueSelected && valueSelected !== '' &&
                            Number(valueSelected) > 0) {
                            RequestsInquiry.getChildOptions(
                                field.childEndPoint,
                                valueSelected || 0,
                                fieldId[1],
                                fieldId[2],
                                field.childField,
                                false,
                                this.resolveGetChildOptions,
                                this.logError,
                                Number(newComponents.applicationFormId));
                        }
                    });
                }
                this.setState({
                    components: newComponents,
                    inquiry: inq
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropDown.name, e));
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

    private onChangeListCheckbox = (event: any): void => {
        try {
            const {
                components,
                inquiry
            } = this.state;

            const fieldId: string[] = event.currentTarget.id.split('|');
            const inq: IInquiry = inquiry;

            if (inquiry && components) {
                const newComponents: IApplicationForm = components;
                const childField: string[] = event.target.id.split('|');
                if (childField[1] === 'noHispanicNestedCheckboxListId') {
                    if (event.target.checked === true) {
                        let ipedNew: IApplicationIpeds = { ipedsFederalCategoryId: 0 };
                        let ipedIndex: number = -1;
                        if (childField[0] === 'child') {
                            ipedNew = {
                                ipedsEthnicityId: Number(childField[7]),
                                ipedsFederalCategoryId: Number(childField[6])
                            };
                            if (inq.ipeds) {
                                ipedIndex = inq.ipeds.findIndex(x => x.ipedsEthnicityId === undefined &&
                                    x.ipedsFederalCategoryId === Number(childField[6]));
                            }
                        }
                        else if (childField[0] === 'parent') {
                            ipedNew = {
                                ipedsEthnicityId: undefined,
                                ipedsFederalCategoryId: Number(childField[6])
                            };
                            if (inq.ipeds) {
                                ipedIndex =
                                    inq.ipeds.findIndex(x => x.ipedsFederalCategoryId ===
                                        Number(childField[6]));
                            }
                        }
                        if (inq.ipeds) {
                            if (ipedIndex > -1) {
                                inq.ipeds[ipedIndex] = ipedNew;
                            }
                            else {
                                inq.ipeds.push(ipedNew);
                            }
                        }
                        else {
                            inq.ipeds = [ipedNew];
                        }
                    }
                    else {
                        if (inq.ipeds) {
                            if (childField[0] === 'child') {
                                const itemToRemove: number =
                                    inq.ipeds.findIndex(x => x.ipedsEthnicityId === Number(childField[7]) &&
                                        x.ipedsFederalCategoryId === Number(childField[6]));
                                inq.ipeds.splice(itemToRemove, 1);
                            }
                            else if (childField[0] === 'parent') {
                                let index: number = -1;
                                do {
                                    index = inq.ipeds.findIndex(x =>
                                        x.ipedsFederalCategoryId === Number(childField[6]));
                                    if (index > -1) {
                                        inq.ipeds.splice(index, 1);
                                    }
                                } while (index > -1);
                            }
                        }
                    }
                    if (childField && childField[2] && childField[3] && childField[4]) {
                        const field: IFieldForm =
                            newComponents.steps[Number(childField[2])].
                                fieldsGroups[Number(childField[3])].
                                fields[Number(childField[4])];
                        if (inq.ipeds && inq.ipeds.length === 0 && field.isRequired) {
                            field.value = undefined;
                        }
                        else {
                            // change value of field
                            if (inq.ipeds) {
                                field.value = undefined;
                                inq.ipeds.forEach(iped => {
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

                // const newComponents: IApplicationForm = components;
                switch (fieldId[0]) {
                    case 'interestId':
                        if (inq.academicInterests) {
                            const index: number = inq.academicInterests.findIndex(x => x === Number(fieldId[4]));
                            if (event.target.checked === true) {
                                inq.academicInterests.push(Number(fieldId[4]));
                            }
                            else {
                                inq.academicInterests.splice(index, 1);
                            }
                        }
                        else {
                            if (event.target.checked === true) {
                                inq.academicInterests = [Number(fieldId[4])];
                            }
                        }
                        if (fieldId && fieldId[1] && fieldId[2] && fieldId[3] && fieldId[4]) {
                            const field: any = newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                            if (inq.academicInterests && inq.academicInterests.length === 0 && field.isRequired) {
                                field.value = undefined;
                                field.data.error = true;
                                field.data.helperText = field.data.errorMessageRequired;
                            }
                            else {
                                if (inq.academicInterests) {
                                    field.value = inq.academicInterests.toString();
                                }
                                field.data.error = false;
                                field.data.helperText = '';
                            }
                        }
                        break;
                    case 'sourceId':
                        if (inq.sources) {
                            const index: number = inq.sources.findIndex(x => x === Number(fieldId[4]));
                            if (event.target.checked === true) {
                                inq.sources.push(Number(fieldId[4]));
                            }
                            else {
                                inq.sources.splice(index, 1);
                            }
                        }
                        else {
                            if (event.target.checked === true) {
                                inq.sources = [Number(fieldId[4])];
                            }
                        }
                        if (fieldId && fieldId[1] && fieldId[2] && fieldId[3] && fieldId[4]) {
                            const field: any = newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                            if (inq.sources && inq.sources.length === 0 && field.isRequired) {
                                field.value = undefined;
                                field.data.error = true;
                                field.data.helperText = field.data.errorMessageRequired;
                            }
                            else {
                                if (inq.sources) {
                                    field.value = inq.sources.toString();
                                }
                                field.data.error = false;
                                field.data.helperText = '';
                            }
                        }
                        break;
                    case 'hispanicCheckboxListId':
                        const ipedNew: IApplicationIpeds = {
                            ipedsEthnicityId: Number(fieldId[4]),
                            ipedsFederalCategoryId: 1
                        };
                        if (inq.ipeds) {
                            const ipedIndex: number = inq.ipeds.findIndex(x => x.ipedsEthnicityId === undefined &&
                                x.ipedsFederalCategoryId === 1);
                            if (event.target.checked === true) {
                                // when exists category 1 and null, record should be updated
                                if (ipedIndex > -1) {
                                    inq.ipeds[ipedIndex] = ipedNew;
                                }
                                else {
                                    inq.ipeds.push(ipedNew);
                                }
                            }
                            else {
                                // remove item from list
                                const itemToRemove: number =
                                    inq.ipeds.findIndex(x => x.ipedsEthnicityId === Number(fieldId[4]) &&
                                        x.ipedsFederalCategoryId === 1);
                                inq.ipeds.splice(itemToRemove, 1);
                            }
                        }
                        else {
                            inq.ipeds = [ipedNew];
                        }
                        // Select yes in radio buttons
                        newComponents.steps[Number(fieldId[1])].
                            fieldsGroups[Number(fieldId[2])].fields.forEach(field => {
                                if (field.data.id === 'hispanicGroupId') {
                                    field.value = '1';
                                }
                            });
                        // Add in the list of value id's selected
                        if (fieldId && fieldId[1] && fieldId[2] && fieldId[3] && fieldId[4]) {
                            const field: IFieldForm =
                                newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                            if (inq.ipeds && inq.ipeds.length === 0 && field.isRequired) {
                                field.value = undefined;
                            }
                            else {
                                // change value of field
                                if (inq.ipeds) {
                                    const ipedsArray: string[] = [];
                                    inq.ipeds.forEach(ethnicity => {
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
                    components: newComponents,
                    inquiry: inq
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
                components,
                inquiry
            } = this.state;

            if (event.target.name && event.target.name !== '' && inquiry && components) {
                const inq: IInquiry = inquiry;
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
                    components: newComponents,
                    inquiry: inq
                });
            }

        } catch (e) {
            this.logError(LogData.fromException(this.onChangeRadioGroup.name, e));
        }
    };

    private onChangeTextField = (event: any): void => {
        try {
            const {
                components,
                inquiry
            } = this.state;

            if (event.target.id && event.target.id !== '' && inquiry && components) {
                const inq: IInquiry = inquiry;
                const fieldId: string[] = event.target.id.split('|');
                let newComponents: IApplicationForm = components;
                switch (fieldId[0]) {
                    case 'emailId':
                        if (fieldId && fieldId[1] && fieldId[2]) {
                            const field: any = newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                            if (event.target.value.match(components.emailRegExpression)) {
                                field.data.error = false;
                                field.data.helperText = '';
                                field.value = event.target.value;
                                inq.email = event.target.value;
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
                        inq.firstName = event.target.value;
                        break;
                    case 'formerLastNameId':
                        inq.formerLastName = event.target.value;
                        break;
                    case 'governmentId':
                        if (fieldId && fieldId[1] && fieldId[2] && fieldId[3]) {
                            const governmentId = event.target.value.replace(/[-.]/g, '');
                            const field: any = newComponents.steps[Number(fieldId[1])].fieldsGroups[Number(fieldId[2])].fields[Number(fieldId[3])];
                            if (Number(governmentId.length) !== newComponents.governmentIdMaxLength) {
                                field.data.error = true;
                                field.data.helperText = field.data.errorMessageFormat;
                            }
                            else {
                                field.data.error = false;
                                field.data.helperText = '';
                                inq.governmentId = governmentId;
                            }
                        }
                        break;
                    case 'lastNameId':
                        inq.lastName = event.target.value;
                        break;
                    case 'lastNamePrefixId':
                        inq.lastNamePrefix = event.target.value;
                        break;
                    case 'legalNameId':
                        inq.legalName = event.target.value;
                        break;
                    case 'middleNameId':
                        inq.middleName = event.target.value;
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
                                inq.monthsInCountry = Number(event.target.value);
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
                        inq.nickname = event.target.value;
                        break;
                    case 'passportNumberId':
                        inq.passportNumber = event.target.value;
                        break;
                    case 'phoneNumberId':
                        if (!event.target.value.match(/^[0-9]*$/g)) {
                            const onlyNum = new RegExp(/([A-Za-zñ<> äÄëËïÏöÖüÜáÁéÉíÍóÓúÚýÝ'¿"#_-Ä-´°%;&¨Ñ,¡.*+?^=!:$(){}|[\]\/\\])/g);
                            event.target.value = event.target.value.replace(onlyNum, '');
                        }
                        break;
                    case 'visaNumberId':
                        inq.visaNumber = event.target.value;
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
                    case 'licenseNumberId':
                        inq.licenseNumber = event.target.value;
                        break;
                    case 'portOfEntryId':
                        inq.portOfEntry = event.target.value;
                        break;
                    case 'sevisNumberId':
                        inq.sevisNumber = event.target.value;
                        break;
                }

                newComponents = this.cleanErrorMessages(fieldId, newComponents);
                newComponents = this.setValues(fieldId, newComponents, event.target.value);

                this.setState({
                    components: newComponents,
                    inquiry: inq
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
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

    private onClickButton = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                components,
                inquiry
            } = this.state;

            if (event.currentTarget.id && event.currentTarget.id !== '' && inquiry && components) {
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

                        RequestsInquiry.getAddresses(
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
                                window.location.assign(`${Constants.webUrl}/Admissions/Inquiries`);
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
                            window.location.assign(`${Constants.webUrl}/Admissions/Inquiries`);
                        }
                        break;
                }
            }

        } catch (e) {
            LayoutActions.setLoading(false);
            this.logError(LogData.fromException(this.onClickButton.name, e));
        }
    };

    private onClickLink = (institutionName?: string, etsCode?: string, ficeCode?: string,
        city?: string, stateProvinceId?: number, countryId?: number) => (): void => {
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

    private onClickZipCodeLink = (zipCode?: string, city?: string, stateProvinceId?: number, countryId?: number,
        countyId?: number) => (): void => {
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

    private onCloseAddressSearchModal = (): void => {
        try {
            this.setState({
                addresses: [],
                hasSearchZipCode: false,
                openAddressSearchModal: false,
                selectedZipCode: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAddressSearchModal.name, e));
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

    private onDeleteItem = (event: any): void => {
        try {
            const {
                errors,
                components,
                inquiry
            } = this.state;

            if (components) {
                const newComponents: IApplicationForm = { ...components };
                const inq: IInquiry = inquiry;
                if (event.currentTarget.id) {
                    const buttonId: string[] = event.currentTarget.id.split('|');
                    const componentName: string = newComponents.steps[buttonId[1]].fieldsGroups[buttonId[2]].id;
                    const fields: IFieldForm[] = newComponents.steps[buttonId[1]].fieldsGroups[buttonId[2]].fields;
                    if (fields) {
                        let fieldIndex: number;
                        do {
                            fieldIndex = fields.findIndex(x => x.data.section === Number(buttonId[4]));
                            if (fieldIndex > -1) {
                                fields.splice(fieldIndex, 1);
                            }
                        } while (fieldIndex > -1);
                    }
                    newComponents.steps[Number(buttonId[1])].fieldsGroups[Number(buttonId[2])].fields = fields;

                    // Delete section from sectionErrors
                    const sectionIndex = errors[Number(buttonId[1])].groupErrors[Number(buttonId[2])].sectionErrors.findIndex(
                        section => section.sectionIndex === Number(buttonId[4]));
                    if (sectionIndex > -1) {
                        errors[Number(buttonId[1])].groupErrors[Number(buttonId[2])].sectionErrors.splice(sectionIndex, 1);
                    }

                    switch (componentName) {
                        case 'phoneGroup':
                            // Search for primary selected in phone group
                            const primaryPhoneField: IFieldForm[] = newComponents.steps[buttonId[1]].fieldsGroups[buttonId[2]]
                                .fields.filter(x => x.data.id.substr(0, 'primaryPhoneId'.length) === 'primaryPhoneId' && x.value === '1');
                            // If doesn't exist, select first item as primary
                            if (primaryPhoneField.length === 0) {
                                const firstPrimaryPhoneField: number = newComponents.steps[buttonId[1]].fieldsGroups[buttonId[2]]
                                    .fields.findIndex(x => x.data.id === 'primaryPhoneId');
                                if (firstPrimaryPhoneField > -1) {
                                    newComponents.steps[buttonId[1]].fieldsGroups[buttonId[2]]
                                        .fields[firstPrimaryPhoneField].value = '1';
                                }
                            }
                            break;
                    }
                    const fieldGroup: IFieldsGroup =
                        newComponents.steps[buttonId[1]].fieldsGroups[buttonId[2]];
                    let maxAdd: number;
                    if (fieldGroup.maximumAllowed) {
                        maxAdd = Number(fieldGroup.maximumAllowed) - 1;
                    }
                    else {
                        maxAdd = 99;
                    }
                    if (errors[buttonId[1]].groupErrors[buttonId[2]].sectionErrors.length < maxAdd) {
                        // Add more button if it was remove
                        newComponents.steps[buttonId[1]].fieldsGroups[buttonId[2]].isMultiple = true;
                    }
                }

                this.setState({
                    components: newComponents,
                    errors: errors,
                    inquiry: inq
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteItem.name, e));
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

    private onSubmit = (): void => {
        try {
            const {
                components,
                inquiry
            } = this.state;

            const applicationTop: HTMLElement | null = document.getElementById('applicationTop');
            if (applicationTop) {
                applicationTop.scrollIntoView();
            }

            if (components) {
                components.steps.forEach(step => {
                    step.fieldsGroups.forEach(fieldsGroup => {
                        fieldsGroup.fields.forEach(field => {
                            field.value = field.value ? field.value : field.default;
                            this.setApplicationValues(field.data.id, field.value);
                        });
                    });
                });
            }

            this.setState({
                components
            });

            const {
                isReCaptchaSubmitInquiryEnabled
            } = this.state;

            let reCaptchaResponse: string = '';
            if (isReCaptchaSubmitInquiryEnabled && this.reCaptchaRef?.current) {
                reCaptchaResponse = this.reCaptchaRef.current.getValue();
                this.setState({
                    reCaptchaError: !Boolean(reCaptchaResponse)
                });
            }

            const allRequiredFields: boolean = this.reviewRequiredFields();
            if (!isReCaptchaSubmitInquiryEnabled || reCaptchaResponse) {
                this.setState({
                    reCaptchaError: false
                });

                if (allRequiredFields) {
                    if (inquiry) {
                        LayoutActions.setLoading(true);
                        RequestsInquiry.postSubmit(inquiry, this.resolveSubmitInquiry, this.logError);
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSubmit.name, e));
        }
    };

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

    // #region Functions
    private assignFieldValue = (fieldGroup: IFieldForm[], fieldId: string[],
        fieldIdName: string, isSectionField: boolean, value?: any): void => {
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

    private copyField = (id: string, stepIndex: number, fieldGroupIndex: number,
        groupLength: number, sectionNumber: number, newComponents: IApplicationForm): IApplicationForm => {
        try {
            const fields: any =
                newComponents.steps[stepIndex].fieldsGroups[fieldGroupIndex].fields;
            const fieldIndex: number =
                fields.findIndex(x => x.data.id === id);

            const copiedField: IFieldForm = fields[fieldIndex];
            const newField: IFieldForm = JSON.parse(JSON.stringify(copiedField));

            newField.data.id =
                `${id}|${stepIndex}|${fieldGroupIndex}|${groupLength}|${sectionNumber}`;
            newField.value = copiedField.default ? copiedField.default : '';
            newField.data.error = false;
            newField.data.helperText = '';
            newField.data.modified = true;
            newField.data.section = sectionNumber;
            fields.push(newField);
            newComponents.steps[stepIndex].fieldsGroups[fieldGroupIndex].fields = fields;
        }
        catch (e) {
            this.logError(LogData.fromException(this.copyField.name, e));
        }
        return newComponents;
    };

    private createNewSection = (components: IApplicationForm, fieldGroup: IFieldsGroup, errors: IApplicationErrors[],
        stepIndex: number, fieldGroupIndex: number, count: number, errorTexId: string, expanded): void => {
        let newComponents: IApplicationForm = components;
        const groupLength: number = fieldGroup.fields.length;
        /* Initialization of SectionErrors in errors state variable and set of
         * SectionIndex = sectionErrors.length -1; <Array.push returns the length of the new array>
         */
        const sectionIndex: number = errors[stepIndex].groupErrors[fieldGroupIndex].sectionErrors.push(
            { sectionIndex: count, isSectionError: false, fieldsErrors: [] }) - 1;

        fieldGroup.fields.forEach((field, i) => {
            if (!field.data.modified) {
                if (field.data.id !== errorTexId) {
                    newComponents = this.copyField(field.data.id, stepIndex,
                        fieldGroupIndex, (groupLength - 1) + i, count, newComponents);
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
            components: newComponents,
            errors: errors,
            expanded: fieldGroup.isExpansionPanel ?
                `panel|${stepIndex}|${fieldGroupIndex}|${count}` : expanded
        });
    };

    private onChangePage = (_event: any, page: number): void => {
        try {
            this.setState({
                pageNumber: page
            });

            LayoutActions.setLoading(true);

            const {
                selectedInstitutionName,
                selectedEtsCode,
                selectedCity,
                selectedState,
                selectedCountry,
                pageSize
            } = this.state;

            RequestsInquiry.getInstitutions(
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
            this.setState({
                pageNumber: page
            });

            LayoutActions.setLoading(true);

            const {
                selectedZipCode,
                pageSize
            } = this.state;

            RequestsInquiry.getAddresses(
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
                pageSize: Number(event.target.value)
            });

            LayoutActions.setLoading(true);

            const {
                selectedInstitutionName,
                selectedEtsCode,
                selectedCity,
                selectedState,
                selectedCountry,
                pageNumber
            } = this.state;

            RequestsInquiry.getInstitutions(
                pageNumber,
                Number(event.target.value),
                selectedInstitutionName,
                selectedEtsCode,
                selectedCity,
                selectedState,
                selectedCountry,
                this.resolveGetInstitutions, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRowsPerPage.name, e));
        }
    };

    private onChangeRowsPerPageAddress = (event: any): void => {
        try {
            this.setState({
                pageSize: Number(event.target.value)
            });

            LayoutActions.setLoading(true);

            const {
                selectedZipCode,
                pageNumber
            } = this.state;

            RequestsInquiry.getAddresses(
                pageNumber,
                Number(event.target.value),
                selectedZipCode,
                this.resolveGetAddress, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRowsPerPage.name, e));
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

    private onSearchAddress = (): void => {
        try {
            LayoutActions.setLoading(true);

            const {
                pageSize,
                selectedZipCode
            } = this.state;

            RequestsInquiry.getAddresses(
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

            RequestsInquiry.getInstitutions(
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

    private reviewActivities = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            activityCount,
            inquiry
        } = this.state;

        let isValid = true;

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
            activity.participatedGrade09 = participated9Field.value;
        }
        let participated10Field: IFieldForm | undefined;
        if (participated10Field = fieldsGroup.fields.find(x => x.data.id === 'participated10Id')) {
            activity.participatedGrade10 = participated10Field.value;
        }
        let participated11Field: IFieldForm | undefined;
        if (participated11Field = fieldsGroup.fields.find(x => x.data.id === 'participated11Id')) {
            activity.participatedGrade11 = participated11Field.value;
        }
        let participated12Field: IFieldForm | undefined;
        if (participated12Field = fieldsGroup.fields.find(x => x.data.id === 'participated12Id')) {
            activity.participatedGrade12 = participated12Field.value;
        }
        let participatedPostSecondaryField: IFieldForm | undefined;
        if (participatedPostSecondaryField = fieldsGroup.fields.find(x => x.data.id === 'participatedPostSecondaryId')) {
            activity.participatedPostsecondary = participatedPostSecondaryField.value;
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
        } while (i < activityCount);

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
            inquiry.activities = activityList;
        }

        this.setState({
            inquiry
        });

        return isValid;
    };

    private reviewAddress = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            addressessCount,
            inquiry
        } = this.state;

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
        } while (i < addressessCount);

        inquiry.addresses = addressList;

        this.setState({
            inquiry
        });

        return true;
    };

    private reviewEducation = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            components,
            educationCount,
            inquiry
        } = this.state;

        let isValid: boolean = true;
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
        else if (education.enrollment.curriculumId && education.enrollment.curriculumId > 0 ||
            education.enrollment.honorsId && education.enrollment.honorsId > 0 ||
            education.enrollment.degreeId && education.enrollment.degreeId > 0 ||
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
                else if (moment(education.enrollment.startDate).format('YYYY-MM-DD') < moment(education.enrollment.endDate).format('YYYY-MM-DD')) {
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
                education.institution.etsCode || education.institution.city || education.institution.ficeCode) {
                educationList.push(education);
            }
            else if (education.enrollment && education.enrollment.curriculumId && education.enrollment.honorsId &&
                education.institution.stateProvinceId && education.institution.countryId &&
                (education.enrollment.curriculumId > 0 || education.enrollment.honorsId > 0 ||
                    education.institution.id > 0 || education.institution.stateProvinceId > 0 ||
                    education.institution.countryId > 0)) {
                educationList.push(education);
            }
            i++;
        } while (i < educationCount);

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
            inquiry.education = educationList;
        }
        this.setState({
            inquiry: inquiry
        });

        return isValid;
    };

    private reviewIpeds = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            inquiry
        } = this.state;

        let isValid = true;
        const hispanicAnswer: string = fieldsGroup.fields[2].value;

        if (hispanicAnswer) {
            // If question is responded with NO, user must select at least one subrace
            if (hispanicAnswer === '0') {
                if (inquiry.ipeds) {
                    const subRaces: IApplicationIpeds[] =
                        inquiry.ipeds.filter(x => x.ipedsFederalCategoryId !== 1);
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
            if (inquiry.ipeds && inquiry.ipeds.length > 0) {
                isValid = false;
                const textErrorIndex: number = fieldsGroup.fields.findIndex(x => x.data.id === 'ipedsErrorsId');
                fieldsGroup.fields[textErrorIndex].data.label =
                    fieldsGroup.errorMessageNotValid;
            }
        }
        return isValid;
    };

    private reviewPhoneGroup = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            inquiry,
            phoneCount
        } = this.state;

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
            if (phoneList.length > 0 &&
                phoneList.find(x => x.type === phoneItem.type &&
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
        } while (i < phoneCount);

        inquiry.phones = phoneList;

        this.setState({
            inquiry
        });

        return true;
    };

    private reviewPrograms = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            inquiry,
            programsCount
        } = this.state;

        let isValid = true;

        const programList: IApplicationProgram[] = [];
        const program: IApplicationProgram = { programId: 0 };
        const programField = fieldsGroup.fields.findIndex(x => x.data.id === 'programOfStudydId');
        if (programField > -1) {
            program.programId = fieldsGroup.fields[programField].value;
        }
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
        } while (i < programsCount);

        if (isValid) {
            inquiry.programs = programList;
        }

        this.setState({
            inquiry
        });

        return isValid;
    };

    private reviewRequiredFields = (): boolean => {
        const {
            components,
            errors,
            inquiry
        } = this.state;

        let isValid: boolean = true;
        if (components) {
            let programsValid: boolean = true;
            let validPhones: boolean = true;
            let ipedsValid: boolean = true;
            let addressValid: boolean = true;
            let userDefinedValid: boolean = true;
            let educationValid: boolean = true;
            let activityValid: boolean = true;

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
                        else {
                            field.data.error = false;
                            field.data.helperText = '';
                        }
                    });

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
            isValid = programsValid &&
                validPhones && ipedsValid && addressValid &&
                activityValid &&
                isValid;

            const allErrors: IGroupErrors[] = [];
            const especificErrors: IGroupErrors[] = [];
            if (!isValid) {
                errors.forEach(step => {
                    step.groupErrors.forEach(groupError => {
                        if (groupError.isGroupError) {
                            if ((groupError.groupId === 'educationGroup' && inquiry.education.length === 0) ||
                                groupError.groupId === 'activityGroup') {
                                especificErrors.push(groupError);
                            }
                            else {
                                allErrors.push(groupError);
                            }
                        }
                    });
                });
                if (allErrors.length === 0) {
                    isValid = programsValid && validPhones &&
                        ipedsValid && addressValid &&
                        educationValid && activityValid;
                }
            }

            this.setState({
                components: components,
                errors: errors
            });
        }
        return isValid;
    };

    private reviewUserDefined = (fieldsGroup: IFieldsGroup): boolean => {
        const {
            inquiry
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

                        userDefined.columnLabel = field.data.id;
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
                            inquiry.userDefined.findIndex(x => x.columnName === userDefined.columnName);
                        if (userDefinedIndex > -1) {
                            inquiry.userDefined.splice(userDefinedIndex, 1);
                        }
                        inquiry.userDefined.push(userDefined);
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

    private setApplicationActivitiesValues = (activity: IApplicationActivity,
        activityList: IApplicationActivity[]): IApplicationActivity[] => {
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

    private setApplicationAddressAdditional = (fieldsGroup: any, sectionNumber: number,
        address: IApplicationAddress): IApplicationAddress => {
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

    private setApplicationValues = (fieldId: string, fieldDefault: any): void => {
        const {
            inquiry
        } = this.state;

        switch (fieldId) {
            case 'attendStatusId':
                inquiry.collegeAttendStatus = fieldDefault;
                break;
            case 'counselorId':
                inquiry.counselorId = fieldDefault;
                break;
            case 'countryOfBirthId':
                inquiry.countryOfBirth = fieldDefault;
                break;
            case 'ethnicityId':
                inquiry.ethnicity = fieldDefault;
                break;
            case 'genderId':
                inquiry.gender = fieldDefault;
                break;
            case 'maritalyId':
                inquiry.maritalStatus = fieldDefault;
                break;
            case 'passportCountryId':
                inquiry.passportCountryId = fieldDefault;
                break;
            case 'primaryCitizenshipId':
                inquiry.primaryCitizenship = fieldDefault;
                break;
            case 'primaryLanguageId':
                inquiry.primaryLanguage = fieldDefault;
                break;
            case 'prefixId':
                inquiry.prefix = fieldDefault;
                break;
            case 'religionId':
                inquiry.religion = fieldDefault;
                break;
            case 'secondayCitizenshipId':
                inquiry.secondaryCitizenship = fieldDefault;
                break;
            case 'secondaryLanguageId':
                inquiry.secondaryLanguage = fieldDefault;
                break;
            case 'sessionPeriodId':
                inquiry.period = fieldDefault;
                break;
            case 'suffixId':
                inquiry.suffix = fieldDefault;
                break;
            case 'veteranId':
                inquiry.veteranStatus = fieldDefault;
                break;
            case 'visaId':
                inquiry.visa = fieldDefault;
                break;
            case 'visaCountryId':
                inquiry.visaCountryId = fieldDefault;
                break;
            case 'licenseStateId':
                inquiry.licenseStateId = fieldDefault;
                break;
            default:
                break;
        }

        this.setState({
            inquiry: fieldDefault
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
        }
        return newComponents;
    };
    // #endregion Functions

    // #region Error Functions
    private logError = (logData: ILogData): void => {
        LayoutActions.setLogData(logData);
    };

    private redirectError = (code: number): void => {
        LayoutActions.setRedirectCode(code);
    };
    // #endregion Error Functions

    // #region Resolvers
    private resolveLayoutReady = () => {
        try {
            const {
                resources,
                inquiry
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;

                if (inquiry) {
                    const hdnAppId: HTMLInputElement | undefined =
                        document.getElementById('hdnInquiryId') as HTMLInputElement;
                    const inq: IInquiry = inquiry;
                    if (hdnAppId && hdnAppId.value) {
                        inq.inquiryFormSettingId = Number(hdnAppId.value);
                        hdnAppId.remove();

                        RequestsInquiry.getComponents(inq.inquiryFormSettingId, this.resolveGetComponents, this.logError);

                        this.setState({
                            inquiry: inq
                        });
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
                this.setState({
                    addresses: result.data.addresses,
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
                const errors: IApplicationErrors[] = Array(components.steps.length);
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
                this.setState({
                    components: components,
                    errors: errors
                }, () => LayoutActions.setLoading(false));
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
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetChildOptions.name, e));
        }
    };

    private resolveGetInstitutions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetInstitutions.name);

            if (result?.status) {
                this.setState({
                    institutions: result.data.institutions,
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

    private resolveSubmitInquiry = (json: string): void => {
        try {
            const {
                components,
                resources
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSubmitInquiry.name);

            if (result?.status && resources) {
                LayoutActions.setLoading(false);

                if (components) {
                    components.isCompletedApplication = true;
                }

                this.setState({
                    components: components
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSubmitInquiry.name, e));
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

    private resolveGetReCaptchaSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetReCaptchaSettings.name);
            if (result?.status) {
                this.setState({
                    isReCaptchaSubmitInquiryEnabled: result.data.isReCaptchaSubmitInquiryEnabled,
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
        const resources: IInquiryFormResources | undefined = LayoutStore.getResources();
        const cultures: ICultures = LayoutStore.getCultures();

        if (ready) {

            RequestsInquiry.getStates(this.resolveStates, this.logError);
            RequestsInquiry.getCountries(this.resolveCountries, this.logError);
            RequestsInquiry.getReCaptchaSettings(this.resolveGetReCaptchaSettings);

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
    public componentDidMount = (): void => {
        // TO DO: Send the ApplicationId
    };

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
            componentError,
            components,
            countries,
            dateTimeCulture,
            errors,
            expanded,
            firstDayOfWeek,
            hasSearchZipCode,
            institutions,
            openAddressSearchModal,
            openETSSearchModal,
            pageNumber,
            pageSize,
            resources,
            rowsPerPageOptions,
            selectedCity,
            selectedCountry,
            selectedEtsCode,
            selectedInstitutionName,
            selectedState,
            selectedZipCode,
            shortDatePattern,
            states,
            total,

            // #region ReCaptcha
            isReCaptchaSubmitInquiryEnabled,
            reCaptchaError,
            reCaptchaSiteKey,
            uiCulture
            // #endregion ReCaptcha
        } = this.state;

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
                    onChangeRowsPerPage={this.onChangeRowsPerPageAddress}
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

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            if (components) {
                contentPage = (
                    <>
                        <ApplicationHandler
                            activeStep={activeStep}
                            components={components}
                            dateTimeCulture={dateTimeCulture}
                            errors={errors}
                            expanded={expanded}
                            firstDayOfWeek={firstDayOfWeek}
                            isReCaptchaSubmitEnabled={isReCaptchaSubmitInquiryEnabled}
                            reCaptchaError={reCaptchaError}
                            reCaptchaRef={this.reCaptchaRef}
                            reCaptchaSiteKey={reCaptchaSiteKey}
                            resources={resources.applicationHandler}
                            shortDatePattern={shortDatePattern}
                            showSaveButton={false}
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
                            onClickStep={this.onClickStep}
                            onNextStep={this.onNextStep}
                            onRecaptchaChange={this.onRecaptchaChange}
                            onReCaptchaError={this.onReCaptchaError}
                            onSubmit={this.onSubmit}
                        />
                    </>
                );
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
            </Layout>
        );
    }
}

const InquiryFormViewWithLayout = withLayout(InquiryFormView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<InquiryFormViewWithLayout />, document.getElementById('root'));