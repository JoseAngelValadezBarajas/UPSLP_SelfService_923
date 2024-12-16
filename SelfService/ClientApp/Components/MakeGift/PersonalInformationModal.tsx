/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: PersonalInformationModal.tsx
 * Type: Container component */

// #region Imports
import moment from 'moment';
import React, { RefObject } from 'react';
import Media from 'react-media';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import RadioGroup from '@hedtech/powercampus-design-system/react/core/RadioGroup';
import ReCAPTCHA from '@hedtech/powercampus-design-system/react/core/ReCaptcha';
import StepProgress, {
    MobileStepper,
    MobileStepperLabel,
    MobileStepperStep,
    Step,
    StepButton,
    StepContent,
    StepLabel
} from '@hedtech/powercampus-design-system/react/core/StepProgress';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Internal components
import AddressSearchModal from '../Admissions/ApplicationForm/AddressSearchModal';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IRadioOption } from '@hedtech/powercampus-design-system/types/IRadioOption';
import { IAddress } from '../../Types/Account/IAddress';
import { IPersonalInformation, IPersonalInfoValidations } from '../../Types/Account/IPersonalInformation';
import { IPersonalInfoPhone } from '../../Types/MakeGift/IPersonalInfoPhone';
import { IPersonalInformationModalResources } from '../../Types/Resources/MakeGift/IPersonalInformationModalResources';

// Helpers
import { emailIsValid } from '@hedtech/powercampus-design-system/helpers/CharRegExp';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import RequestsApplication from '../../Requests/Admissions/ApplicationForm';
import RequestMakeGift from '../../Requests/MakeGift/MakeGift';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import { IPhone } from '../../Types/Account/IPhone';
// #endregion Imports

// #region Types
export interface IPersonalInformationModalProps {
    open: boolean;
    totalDonation: number;
    onAfterSave?: () => void;
    onClose: () => void;
}

interface IPersonalInformationModalState {
    addressTypeOptions?: IDropDownOption[];
    componentError: boolean;
    countryFormatPhones?: IDropDownOption[];
    countyOptions?: IDropDownOption[];
    countryOptions?: IDropDownOption[];
    currentPhoneId: number;
    emailRegExp?: string;
    errorPhoneDuplicated: boolean;
    governmentIdFormat: string;
    governmentIdFormatExample: string;
    governmentIdMaxLength: number;
    isLoading: boolean;
    isLoadingSave: boolean;
    phoneTypeOptions?: IDropDownOption[];
    prefixOptions?: IDropDownOption[];
    personalInformation: IPersonalInformation;
    personalInfoPhones: IPersonalInfoPhone[];
    personalInfoValidations: IPersonalInfoValidations;
    resources?: IPersonalInformationModalResources;
    saved: boolean;
    stateOptions?: IDropDownOption[];
    suffixOptions?: IDropDownOption[];

    // #region Stepper
    activeStep: number;
    numSteps: number;
    pageNumber: number;
    pageSize: number;
    selectedCity?: string;
    selectedCountry?: number;
    selectedState?: number;
    states?: IDropDownOption[];
    stepErrors: boolean[];
    total: number;
    // #endregion Stepper

    // #region  AddressSearchModal
    addresses?: IAddress[];
    hasSearchZipCode: boolean;
    openAddressSearchModal: boolean;
    rowsPerPageOptions: number[];
    selectedZipCode?: string;
    // #endregion AddressSearchModal

    // #region ReCaptcha
    isReCaptchaMakePaymentEnabled: boolean;
    reCaptchaError: boolean;
    reCaptchaSiteKey: string;
    uiCulture: string;
    // #endregion ReCaptcha
}

const styles = createStyles({
    boxStep: {
        '& > span > span > span': {
            textAlign: 'left'
        },
        '&:focus': {
            boxShadow: 'none'
        }
    },
    mobileStepperContent: {
        minHeight: '65vh',
        padding: `0 ${Tokens.spacing40} 0 ${Tokens.spacing40}`
    },
    padding: {
        paddingLeft: Tokens.spacing70
    },
    alignmentPaddingLeft: {
        paddingLeft: Tokens.spacing80
    },
    reCaptchaContent: {
        paddingBottom: Tokens.spacing30
    },
    reCaptchaErrorText: {
        paddingBottom: Tokens.spacing30
    },
});

type PropsWithStyles = IPersonalInformationModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class PersonalInformationModal extends React.Component<PropsWithStyles, IPersonalInformationModalState> {
    private idModule: string;
    private idPage: string;
    private phoneFormatChar: string;
    private rowsPerPageOptions: number[];
    private reCaptchaRef: RefObject<any>;

    public readonly state: Readonly<IPersonalInformationModalState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'MakeGift';
        this.idPage = 'PersonalInformationModal';
        this.phoneFormatChar = '@';
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        this.state = this.getInitialState();
        this.reCaptchaRef = React.createRef();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IPersonalInformationModalState {
        let resources: IPersonalInformationModalResources | undefined;
        let isReCaptchaMakePaymentEnabled: boolean = false;

        let reCaptchaSiteKey: string = '';
        if (this.state) {
            resources = this.state.resources;
            isReCaptchaMakePaymentEnabled = this.state.isReCaptchaMakePaymentEnabled;
            reCaptchaSiteKey = this.state.reCaptchaSiteKey;
        }
        return {
            componentError: false,
            currentPhoneId: 0,
            errorPhoneDuplicated: false,
            governmentIdFormat: '',
            governmentIdFormatExample: '',
            governmentIdMaxLength: 11,
            isLoading: true,
            isLoadingSave: false,
            personalInfoPhones: [{
                description: '',
                format: '',
                formattedPhone: '',
                isPrimary: true,
                number: '',
                phoneCountryModified: false,
                phoneNumberModified: false,
                phoneTypeModified: false,
                primaryValue: '1',
                type: ''
            }],
            personalInformation: {
                address: {
                    addLine1: '',
                    addLine2: '',
                    addLine3: '',
                    addLine4: '',
                    addressLine1: '',
                    addressLine2: '',
                    addressLine3: '',
                    addressLine4: '',
                    city: '',
                    cityPrefix: '',
                    citySuffix: '',
                    country: '',
                    county: '',
                    houseNumber: '',
                    overallCount: 0,
                    state: '',
                    zipCode: ''
                },
                people: {
                    birthDate: '',
                    displayName: '',
                    email: '',
                    firstName: '',
                    formerName: '',
                    governmentId: '',
                    lastName: '',
                    lastNamePrefix: '',
                    middleName: '',
                    nickname: '',
                    prefix: '',
                    pronoun: '',
                    suffix: ''
                },
                phones: [{
                    countryId: 0,
                    format: '',
                    isPrimary: true,
                    number: '',
                    type: ''
                }]
            },
            personalInfoValidations: {
                addressLine1Modified: false,
                addressTypeModified: false,
                birthDateInvalid: false,
                birthDateModified: false,
                cityModified: false,
                countryModified: false,
                countyModified: false,
                dateOfBirth: false,
                emailInvalid: false,
                emailModified: false,
                firstNameModified: false,
                governmentIdInvalid: false,
                lastNameModified: false
            },
            resources: resources,
            saved: false,

            // #region Stepper
            activeStep: 0,
            numSteps: 3,
            stepErrors: [false, false, false],
            // #endregion Stepper

            // #region  AddressSearchModal
            hasSearchZipCode: false,
            openAddressSearchModal: false,
            pageNumber: 0,
            pageSize: 5,
            rowsPerPageOptions: [],
            total: 0,
            // #endregion AddressSearchModal

            // #region ReCaptcha
            isReCaptchaMakePaymentEnabled: isReCaptchaMakePaymentEnabled,
            reCaptchaError: false,
            reCaptchaSiteKey: reCaptchaSiteKey,
            uiCulture: LayoutStore.getCultures().uiCulture
            // #end region ReCaptcha
        };
    }

    // #region Events

    // #region Stepper
    private onClickStep = (event: any): void => {
        try {
            const {
                numSteps
            } = this.state;

            const positionParts: string[] = event.currentTarget.id.split('_');
            const position: number = Number(positionParts[1]);
            if (position >= 0 && position <= numSteps) {
                this.setState({
                    activeStep: position
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickStep.name, e));
        }
    };

    private onFinish = (): void => {
        try {
            const {
                isLoadingSave,
                personalInformation,
                personalInfoPhones,
                personalInfoValidations,
                stepErrors
            } = this.state;

            if (!isLoadingSave) {
                personalInfoValidations.firstNameModified = true;
                personalInfoValidations.lastNameModified = true;
                personalInfoValidations.birthDateModified = true;

                personalInfoValidations.addressLine1Modified = true;
                personalInfoValidations.addressTypeModified = true;
                personalInfoValidations.cityModified = true;
                personalInfoValidations.countryModified = true;

                personalInfoValidations.emailModified = true;

                stepErrors[0] = !Boolean(personalInformation.people.firstName)
                    || !Boolean(personalInformation.people.lastName)
                    || !Boolean(personalInformation.people.birthDate);

                if (Boolean(personalInformation.people.birthDate)) {
                    stepErrors[0] = stepErrors[0] || personalInfoValidations.birthDateInvalid;
                }

                stepErrors[1] = !Boolean(personalInformation.address.addressLine1)
                    || !Boolean(personalInformation.address.type)
                    || !Boolean(personalInformation.address.city)
                    || !Boolean(personalInformation.address.countryId);

                personalInfoPhones.forEach(phone => {
                    phone.phoneCountryModified = true;
                    phone.phoneNumberModified = true;
                    phone.phoneTypeModified = true;
                });

                let isNotValid: boolean = false;
                let stop: boolean = false;
                personalInfoPhones.forEach(phone => {
                    if (!stop) {
                        isNotValid = !Boolean(phone.type)
                            || !Boolean(phone.countryId)
                            || !Boolean(phone.number);
                        if (isNotValid) {
                            stop = true;
                        }
                    }
                });

                this.setState({
                    personalInfoPhones
                });

                //ReCaptcha Error catcher
                const {
                    isReCaptchaMakePaymentEnabled
                } = this.state;

                let reCaptchaResponse: string = '';
                console.log(this.reCaptchaRef); // TODO: Borrar
                if (isReCaptchaMakePaymentEnabled && this.reCaptchaRef?.current) {
                    reCaptchaResponse = this.reCaptchaRef.current.getValue();
                    this.setState({
                        reCaptchaError: !reCaptchaResponse
                    });
                }
                let duplicatedPhone: boolean = false;

                personalInformation.phones = [];
                let loopStop: boolean = false;
                personalInfoPhones.forEach(phoneDetail => {
                    if (!loopStop) {
                        const phoneItem = personalInformation.phones.find(x => x.type === phoneDetail.type &&
                            x.countryId === phoneDetail.countryId && x.number === phoneDetail.number);

                        if (phoneItem) {
                            duplicatedPhone = true;
                            loopStop = true;
                        }
                        else {
                            const phone: IPhone =
                            {
                                countryId: phoneDetail.countryId ? phoneDetail.countryId : 0,
                                description: phoneDetail.description,
                                format: phoneDetail.formattedPhone,
                                isPrimary: phoneDetail.isPrimary,
                                number: phoneDetail.number,
                                type: phoneDetail.type
                            };
                            personalInformation.phones.push(phone);
                        }
                    }
                });

                stepErrors[2] = isNotValid || (personalInfoValidations && personalInfoValidations.emailInvalid) || duplicatedPhone;

                this.setState({
                    errorPhoneDuplicated: duplicatedPhone,
                    personalInformation,
                    stepErrors
                });

                if (!stepErrors[0] && !stepErrors[1] && !stepErrors[2] && (!isReCaptchaMakePaymentEnabled || reCaptchaResponse)) {
                    this.setState({
                        reCaptchaError: false
                    })
                    this.showLoaderSave();
                    RequestMakeGift.postPersonalInfo(personalInformation, this.resolvePostPersonalInfo, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onFinish.name, e));
        }
    };
    // #endregion Stepper

    private onDateTimeChange = (date: string, id: string, isValid: boolean): void => {
        try {
            const {
                personalInformation,
                personalInfoValidations
            } = this.state;

            if (id === 'dtpBirthDateFormatted') {
                personalInfoValidations.birthDateInvalid = !isValid;
                personalInformation.people.birthDate = isValid ? date : '';
                this.setState({
                    personalInformation,
                    personalInfoValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDateTimeChange.name, e));
        }
    };

    private onDropdownChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const idDrop: string[] = id.split('|');

            const {
                personalInfoPhones,
                personalInformation
            } = this.state;

            switch (idDrop[0]) {
                case 'ddlPrefixId':
                    personalInformation.people.prefixId = Number(optionSelected.value);
                    break;
                case 'ddlSuffixId':
                    personalInformation.people.suffixId = Number(optionSelected.value);
                    break;
                case 'ddlType_Address':
                    personalInformation.address.type = Number(optionSelected.value);
                    break;
                case 'ddlStateProvinceId_Address':
                    personalInformation.address.stateProvinceId = Number(optionSelected.value);
                    break;
                case 'ddlCountyId_Address':
                    personalInformation.address.countyId = Number(optionSelected.value);
                    break;
                case 'ddlCountryId_Address':
                    personalInformation.address.countryId = Number(optionSelected.value);
                    break;
                case 'ddlType_Phone':
                    personalInfoPhones[Number(idDrop[1])].type = optionSelected.value.toString();
                    break;
                case 'ddlCountryId_Phone':
                    personalInfoPhones[Number(idDrop[1])].countryId = Number(optionSelected.value);
                    personalInfoPhones[Number(idDrop[1])].format = optionSelected.complement;
                    personalInfoPhones[Number(idDrop[1])].formattedPhone =
                        Format.toPhone(personalInfoPhones[Number(idDrop[1])].number,
                            personalInfoPhones[Number(idDrop[1])].format, this.phoneFormatChar);
                    break;
            }

            this.setState({
                personalInformation
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onTextFieldChange = (event: any): void => {
        try {
            const id: string[] = event.target.id.split('|');

            const {
                emailRegExp,
                personalInfoPhones,
                personalInformation,
                personalInfoValidations
            } = this.state;

            switch (id[0]) {
                case 'txtFirstName':
                    personalInformation.people.firstName = event.target.value;
                    break;
                case 'txtMiddleName':
                    personalInformation.people.middleName = event.target.value;
                    break;
                case 'txtLastNamePrefix':
                    personalInformation.people.lastNamePrefix = event.target.value;
                    break;
                case 'txtLastName':
                    personalInformation.people.lastName = event.target.value;
                    break;
                case 'txtNickname':
                    personalInformation.people.nickname = event.target.value;
                    break;
                case 'txtFormerLastName':
                    personalInformation.people.formerName = event.target.value;
                    break;
                case 'txtGovernmentId':
                    personalInformation.people.governmentId = event.target.value;
                    break;
                case 'txtHouseNumber_Address':
                    personalInformation.address.houseNumber = event.target.value;
                    break;
                case 'txtAddressLine1_Address':
                    personalInformation.address.addressLine1 = event.target.value;
                    break;
                case 'txtAddressLine2_Address':
                    personalInformation.address.addressLine2 = event.target.value;
                    break;
                case 'txtAddressLine3_Address':
                    personalInformation.address.addressLine3 = event.target.value;
                    break;
                case 'txtAddressLine4_Address':
                    personalInformation.address.addressLine4 = event.target.value;
                    break;
                case 'txtCity_Address':
                    personalInformation.address.city = event.target.value;
                    break;
                case 'txtZipCode_Address':
                    personalInformation.address.zipCode = event.target.value;
                    this.setState({
                        selectedZipCode: personalInformation.address.zipCode
                    });
                    break;
                case 'txtEmail':
                    personalInformation.people.email = event.target.value;
                    personalInfoValidations.emailModified = true;

                    if (emailRegExp && personalInformation.people.email) {
                        personalInfoValidations.emailInvalid =
                            !emailIsValid(personalInformation.people.email, emailRegExp);
                    }
                    else {
                        personalInfoValidations.emailInvalid = false;
                    }
                    break;
                case 'txtNumber_Phone':
                    if (!event.target.value.match(/^[0-9]*$/g)) {
                        const onlyNum = new RegExp(/([A-Za-zñ<> äÄëËïÏöÖüÜáÁéÉíÍóÓúÚýÝ'¿"#_-Ä-´°%;&¨Ñ,¡.*+?^=!:$(){}|[\]\/\\])/g);
                        event.target.value = event.target.value.replace(onlyNum, '');
                    }
                    personalInfoPhones[id[1]].number = event.target.value;
                    personalInfoPhones[id[1]].formattedPhone =
                        Format.toPhone(personalInfoPhones[id[1]].number,
                            personalInfoPhones[id[1]].format, this.phoneFormatChar);
                    break;
                case 'txtDescription_Phone':
                    personalInfoPhones[id[1]].description = event.target.value;
                    break;
            }

            this.setState({
                personalInformation
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTextFieldChange.name, e));
        }
    };

    private onChangeRadio = (event: any): void => {
        try {
            const {
                personalInfoPhones
            } = this.state;

            const id: string[] = event.target.name.split('|');

            personalInfoPhones.forEach((phoneDetail, i) => {
                if (Number(id[1]) === i) {
                    phoneDetail.primaryValue = '1';
                    phoneDetail.isPrimary = true;
                }
                else {
                    phoneDetail.primaryValue = '0';
                    phoneDetail.isPrimary = false;
                }
            });

            this.setState({
                personalInfoPhones
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRadio.name, e));
        }
    };

    private onAddMore = (): void => {
        try {
            const {
                currentPhoneId,
                personalInfoPhones
            } = this.state;

            this.setState({
                currentPhoneId: currentPhoneId + 1,
                personalInfoPhones: [...personalInfoPhones,
                {
                    description: '',
                    format: '',
                    formattedPhone: '',
                    isPrimary: false,
                    number: '',
                    phoneCountryModified: false,
                    phoneNumberModified: false,
                    phoneTypeModified: false,
                    primaryValue: '',
                    type: ''
                }]
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddMore.name, e));
        }
    };

    private onRemovePhone = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                currentPhoneId,
                personalInfoPhones
            } = this.state;
            const id: number = Number(event.currentTarget.id.split('_')[1]);
            if (personalInfoPhones) {
                if (personalInfoPhones[id].isPrimary === true) {
                    personalInfoPhones[0].isPrimary = true;
                    personalInfoPhones[0].primaryValue = '1';
                }
                personalInfoPhones.splice(id, 1);
                this.setState({
                    currentPhoneId: currentPhoneId - 1,
                    personalInfoPhones
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRemovePhone.name, e));
        }
    };

    // #region Address
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

    private onClickZipCodeLink = (zipCode?: string, city?: string, stateProvinceId?: number, countryId?: number,
        countyId?: number) => (): void => {
            try {
                const {
                    personalInformation
                } = this.state;

                personalInformation.address.city = city ? city : '';
                personalInformation.address.stateProvinceId = stateProvinceId ? stateProvinceId : undefined;
                personalInformation.address.zipCode = zipCode ? zipCode : '';
                personalInformation.address.countyId = countyId;
                personalInformation.address.countryId = countryId;

                this.setState({
                    hasSearchZipCode: false,
                    openAddressSearchModal: false,
                    personalInformation,
                    selectedZipCode: zipCode
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
                        const {
                            personalInformation
                        } = this.state;
                        personalInformation.address.zipCode = event.target.value;
                        this.setState({
                            personalInformation,
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

            RequestsApplication.getAddresses(
                0,
                pageSize,
                selectedZipCode,
                this.resolveGetAddress, this.logError);

            const {
                total
            } = this.state;

            if (total) {
                const previousSize = pageSize;
                this.setState({
                    pageNumber: 0,
                    pageSize: previousSize
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
            RequestsApplication.getAddresses(
                page,
                pageSize,
                selectedZipCode,
                this.resolveGetAddress, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePageAddress.name, e));
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

    private onOpenSearchAddress = (): void => {
        try {
            const {
                personalInformation
            } = this.state;

            this.setState({
                hasSearchZipCode: false,
                openAddressSearchModal: true,
                selectedZipCode: personalInformation.address.zipCode
            });

            LayoutActions.setLoading(true);

            const {
                pageSize
            } = this.state;

            RequestsApplication.getAddresses(
                0,
                pageSize,
                personalInformation.address.zipCode,
                this.resolveGetAddress, this.logError);

            const {
                total
            } = this.state;

            if (total) {
                const previousSize = pageSize;
                this.setState({
                    pageNumber: 0,
                    pageSize: previousSize
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAddressSearchModal.name, e));
        }
    };
    // #endregion Address

    // #Region Recaptcha
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

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingSave: false
        });
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private hideLoaderSave = (): void => {
        this.setState({
            isLoadingSave: false
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
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        this.hideAllLoaders();
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
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetPersonalInfoOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPersonalInfoOptions.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    addressTypeOptions: result.data.addressTypes,
                    countryFormatPhones: result.data.countryFormatPhones,
                    countyOptions: result.data.counties,
                    countryOptions: result.data.countries,
                    phoneTypeOptions: result.data.phoneTypes,
                    prefixOptions: result.data.prefixes,
                    stateOptions: result.data.states,
                    suffixOptions: result.data.suffixes
                });
                this.hideLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPersonalInfoOptions.name, e));
        }
    };

    private resolvePostPersonalInfo = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostPersonalInfo.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    saved: true
                }, this.hideLoaderSave);

                const {
                    onAfterSave
                } = this.props;
                if (onAfterSave) {
                    onAfterSave();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetAddress = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAddress.name, this.hideAllLoaders);
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

    private resolveGetEmailRegExp = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetEmailRegExp.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    emailRegExp: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetEmailRegExp.name, e));
        }
    };

    private resolveGetReCaptchaSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetReCaptchaSettings.name);
            if (result?.status) {
                this.setState({
                    isReCaptchaMakePaymentEnabled: result.data.isReCaptchaMakePaymentEnabled,
                    reCaptchaSiteKey: result.data.reCaptchaSiteKey || ''
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetReCaptchaSettings.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            RequestMakeGift.getPersonalInfoOptions(this.resolveGetPersonalInfoOptions, this.logError);
            RequestMakeGift.getEmailRegExp(this.resolveGetEmailRegExp, this.logError);
            RequestMakeGift.getReCaptchaSettings(this.resolveGetReCaptchaSettings);
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
            classes,
            open,
            onClose
        } = this.props;

        const {
            activeStep,
            addressTypeOptions,
            componentError,
            countryFormatPhones,
            countyOptions,
            countryOptions,
            errorPhoneDuplicated,
            isLoading,
            isLoadingSave,
            numSteps,
            phoneTypeOptions,
            prefixOptions,
            personalInformation,
            personalInfoPhones,
            personalInfoValidations,
            resources,
            saved,
            stateOptions,
            stepErrors,
            suffixOptions,

            // Address
            addresses,
            hasSearchZipCode,
            openAddressSearchModal,
            pageNumber,
            pageSize,
            rowsPerPageOptions,
            selectedZipCode,
            total,

            // Recaptcha
            uiCulture,
            isReCaptchaMakePaymentEnabled,
            reCaptchaSiteKey,
            reCaptchaError,

        } = this.state;

        const {
            totalDonation
        } = this.props;

        let contentPage: JSX.Element | undefined;
        let addressSearchModal: JSX.Element | undefined;
        if (!componentError && resources) {
            const resourcesLayout: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
            const cultures: ICultures = LayoutStore.getCultures();

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

            const emptyOption: IDropDownOption = {
                description: resourcesLayout ? resourcesLayout.lblDropDownEmptyText : '',
                value: 0
            };
            const endRangeBirthDate: number = 0;

            const dateMinFormat: string = moment().add(-100, 'years').format(cultures.shortDatePattern.toUpperCase());
            const dateMaxFormat: string = moment().add(endRangeBirthDate, 'days').format(cultures.shortDatePattern.toUpperCase());

            const listOptions: IRadioOption[] = [];
            listOptions.push(
                { description: resources.lblPrimary, value: 1 }
            );

            const finalStep: boolean = activeStep === numSteps - 1;

            // #region Content Steps
            const contentSetp0: JSX.Element = (
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <Dropdown
                            disabled={saved || isLoadingSave}
                            emptyOption={emptyOption}
                            id="ddlPrefixId"
                            label={resources.lblPrefix}
                            loading={isLoading}
                            options={prefixOptions}
                            value={personalInformation.people.prefixId}
                            onChange={this.onDropdownChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            error={personalInfoValidations.firstNameModified && !Boolean(personalInformation.people.firstName)}
                            helperText={personalInfoValidations.firstNameModified && !Boolean(personalInformation.people.firstName) ?
                                resources.lblFirstNameRequired
                                : undefined}
                            id="txtFirstName"
                            label={resources.lblFirstName}
                            maxCharacters={120}
                            required
                            value={personalInformation.people.firstName}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            id="txtMiddleName"
                            label={resources.lblMiddleName}
                            maxCharacters={120}
                            value={personalInformation.people.middleName}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            id="txtLastNamePrefix"
                            label={resources.lblLastNamePrefix}
                            maxCharacters={120}
                            value={personalInformation.people.lastNamePrefix}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            error={personalInfoValidations.lastNameModified && !Boolean(personalInformation.people.lastName)}
                            helperText={personalInfoValidations.lastNameModified && !Boolean(personalInformation.people.lastName) ?
                                resources.lblLastNameRequired
                                : undefined}
                            id="txtLastName"
                            label={resources.lblLastName}
                            maxCharacters={120}
                            required
                            value={personalInformation.people.lastName}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Dropdown
                            disabled={saved || isLoadingSave}
                            emptyOption={emptyOption}
                            id="ddlSuffixId"
                            label={resources.lblSuffix}
                            loading={isLoading}
                            options={suffixOptions}
                            value={personalInformation.people.suffixId}
                            onChange={this.onDropdownChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            id="txtNickname"
                            label={resources.lblNickname}
                            maxCharacters={100}
                            value={personalInformation.people.nickname}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            culture={cultures.dateTimeCulture}
                            disabled={saved || isLoadingSave}
                            error={(personalInfoValidations.birthDateModified && !Boolean(personalInformation.people.birthDate))
                                || personalInfoValidations.birthDateInvalid}
                            helperText={(personalInfoValidations.birthDateModified && !Boolean(personalInformation.people.birthDate))
                                || personalInfoValidations.birthDateInvalid
                                ? Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat])
                                : undefined}
                            format={cultures.shortDatePattern}
                            id="dtpBirthDateFormatted"
                            label={resources.lblBirthDate}
                            rangeEnd={endRangeBirthDate}
                            rangeEndPeriod="days"
                            required
                            value={personalInformation.people.birthDate}
                            onChange={this.onDateTimeChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            id="txtFormerLastName"
                            label={resources.lblFormerLastName}
                            maxCharacters={100}
                            value={personalInformation.people.formerName}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            id="txtGovernmentId"
                            label={resources.lblGovernmentId}
                            value={personalInformation.people.governmentId}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                </Grid>
            );

            const contentSetp1: JSX.Element = (
                <>
                    <Grid container>
                        <Grid item xs={12} sm={6}>
                            <Dropdown
                                disabled={saved || isLoadingSave}
                                emptyOption={emptyOption}
                                error={personalInfoValidations.addressTypeModified && !Boolean(personalInformation.address.type)}
                                helperText={personalInfoValidations.addressTypeModified && !Boolean(personalInformation.address.type) ?
                                    resources.lblAddressTypeRequired
                                    : undefined}
                                id="ddlType_Address"
                                label={resources.lblAddressType}
                                loading={isLoading}
                                options={addressTypeOptions}
                                required
                                value={personalInformation.address.type}
                                onChange={this.onDropdownChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                disabled={saved || isLoadingSave}
                                id="txtHouseNumber_Address"
                                label={resources.lblHouseNumber}
                                maxCharacters={10}
                                value={personalInformation.address.houseNumber}
                                onChange={this.onTextFieldChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={saved || isLoadingSave}
                                error={personalInfoValidations.addressLine1Modified && !Boolean(personalInformation.address.addressLine1)}
                                helperText={personalInfoValidations.addressLine1Modified && !Boolean(personalInformation.address.addressLine1) ?
                                    resources.lblAddressLine1Required
                                    : undefined}
                                id="txtAddressLine1_Address"
                                label={resources.lblAddressLine1}
                                maxCharacters={75}
                                required
                                value={personalInformation.address.addressLine1}
                                onChange={this.onTextFieldChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={saved || isLoadingSave}
                                id="txtAddressLine2_Address"
                                label={resources.lblAddressLine2}
                                maxCharacters={75}
                                value={personalInformation.address.addressLine2}
                                onChange={this.onTextFieldChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={saved || isLoadingSave}
                                id="txtAddressLine3_Address"
                                label={resources.lblAddressLine3}
                                maxCharacters={75}
                                value={personalInformation.address.addressLine3}
                                onChange={this.onTextFieldChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={saved || isLoadingSave}
                                id="txtAddressLine4_Address"
                                label={resources.lblAddressLine4}
                                maxCharacters={75}
                                value={personalInformation.address.addressLine4}
                                onChange={this.onTextFieldChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                disabled={saved || isLoadingSave}
                                error={personalInfoValidations.cityModified && !Boolean(personalInformation.address.city)}
                                helperText={personalInfoValidations.cityModified && !Boolean(personalInformation.address.city) ?
                                    resources.lblCityRequired
                                    : undefined}
                                id="txtCity_Address"
                                label={resources.lblCity}
                                maxCharacters={50}
                                required
                                value={personalInformation.address.city}
                                onChange={this.onTextFieldChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Dropdown
                                disabled={saved || isLoadingSave}
                                emptyOption={emptyOption}
                                id="ddlStateProvinceId_Address"
                                label={resources.lblState}
                                loading={isLoading}
                                options={stateOptions}
                                value={personalInformation.address.stateProvinceId}
                                onChange={this.onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                disabled={saved || isLoadingSave}
                                id="txtZipCode_Address"
                                label={resources.lblZipCode}
                                maxCharacters={15}
                                value={personalInformation.address.zipCode}
                                onChange={this.onTextFieldChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Button
                                id="btnSearch"
                                color="primary"
                                onClick={this.onOpenSearchAddress}
                            >
                                {resources.btnSearch}
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6}>
                            <Dropdown
                                disabled={saved || isLoadingSave}
                                emptyOption={emptyOption}
                                id="ddlCountyId_Address"
                                label={resources.lblCounty}
                                loading={isLoading}
                                options={countyOptions}
                                value={personalInformation.address.countyId}
                                onChange={this.onDropdownChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Dropdown
                                disabled={saved || isLoadingSave}
                                emptyOption={emptyOption}
                                error={personalInfoValidations.countryModified && !Boolean(personalInformation.address.countryId)}
                                helperText={personalInfoValidations.countryModified && !Boolean(personalInformation.address.countryId) ?
                                    resources.lblCountryRequired
                                    : undefined}
                                id="ddlCountryId_Address"
                                label={resources.lblCountry}
                                loading={isLoading}
                                options={countryOptions}
                                required
                                value={personalInformation.address.countryId}
                                onChange={this.onDropdownChange}
                            />
                        </Grid>
                    </Grid>
                </>
            );

            const contentSetp2: JSX.Element = (
                <>
                    <Grid container>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                disabled={saved || isLoadingSave}
                                error={(personalInfoValidations.emailModified && !Boolean(personalInformation.people.email))
                                    || (personalInfoValidations.emailModified && personalInfoValidations.emailInvalid)}
                                helperText={personalInfoValidations.emailModified && !Boolean(personalInformation.people.email) ?
                                    resources.lblEmailRequired
                                    : personalInfoValidations.emailInvalid ? resources.lblEmailInvalid : undefined}
                                id="txtEmail"
                                label={resources.lblEmail}
                                maxCharacters={60}
                                required
                                onChange={this.onTextFieldChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Text size="large">
                                {resources.lblPhoneInstuctions}
                            </Text>
                        </Grid>
                        {errorPhoneDuplicated ? (
                            <Grid item xs={12} sm={12}>
                                <Text size="large" color="error">
                                    {resources.lblErrorPhoneDuplicated}
                                </Text>
                            </Grid>
                        ) : undefined}
                    </Grid>
                    {personalInfoPhones ? personalInfoPhones.map((phone, i) => (
                        <Grid key={`item_${i}`} container spacing={3}>
                            {i > 0 ? (
                                <Grid item xs={12} sm={12}>
                                    <hr />
                                </Grid>
                            ) : undefined}
                            <Grid item xs={12} sm={6}>
                                <Dropdown
                                    disabled={saved || isLoadingSave}
                                    emptyOption={emptyOption}
                                    error={phone.phoneTypeModified && !Boolean(phone.type)}
                                    helperText={phone.phoneTypeModified && !Boolean(phone.type) ?
                                        resources.lblPhoneTypeRequired
                                        : undefined}
                                    id={`ddlType_Phone|${i}`}
                                    label={resources.lblPhoneType}
                                    loading={isLoading}
                                    options={phoneTypeOptions}
                                    required
                                    value={phone.type}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Dropdown
                                    disabled={saved || isLoadingSave}
                                    emptyOption={emptyOption}
                                    error={phone.phoneCountryModified && !Boolean(phone.countryId)}
                                    helperText={phone.phoneCountryModified && !Boolean(phone.countryId) ?
                                        resources.lblPhoneCountryRequired
                                        : undefined}
                                    id={`ddlCountryId_Phone|${i}`}
                                    label={resources.lblPhoneCountry}
                                    loading={isLoading}
                                    options={countryFormatPhones}
                                    required
                                    value={phone.countryId}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    disabled={saved || isLoadingSave}
                                    error={phone.phoneNumberModified && !Boolean(phone.number)}
                                    helperText={phone.phoneNumberModified && !Boolean(phone.number) ?
                                        resources.lblPhoneNumberRequired
                                        : undefined}
                                    id={`txtNumber_Phone|${i}`}
                                    label={resources.lblPhoneNumber}
                                    maxCharacters={60}
                                    required
                                    value={phone.number}
                                    onChange={this.onTextFieldChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Text
                                    id={`formatted_Phone_${i}`}
                                >
                                    {phone.formattedPhone}
                                </Text>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    disabled={saved || isLoadingSave}
                                    id={`txtDescription_Phone|${i}`}
                                    label={resources.lblDescription}
                                    maxCharacters={160}
                                    value={phone.description}
                                    onChange={this.onTextFieldChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <RadioGroup
                                    id={`rbgPrimary_Phone|${i}`}
                                    name={`rbgPrimary_Phone|${i}`}
                                    options={listOptions}
                                    value={phone.primaryValue}
                                    onChange={this.onChangeRadio}
                                />
                            </Grid>
                            {i > 0 ? (
                                <Grid item xs={12} md={6}>
                                    <IconButton
                                        aria-label={resources.btnDelete}
                                        color="gray"
                                        id={`btnDelete_${i}`}
                                        onClick={this.onRemovePhone}
                                    >
                                        <Icon name="trash" />
                                    </IconButton>
                                </Grid>
                            ) : undefined}
                        </Grid>
                    )) : undefined}
                    <Grid container>
                        <Grid item xs={12} sm={12}>
                            <Button
                                id="btnAddNew"
                                color="secondary"
                                onClick={this.onAddMore}
                            >
                                {resources.btnAddNew}
                            </Button>
                        </Grid>
                    </Grid>
                </>
            );

            // #endregion Content Steps

            let reCaptchaElement: JSX.Element | undefined;
            if (isReCaptchaMakePaymentEnabled && Boolean(reCaptchaSiteKey)) {
                reCaptchaElement = (
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <ReCAPTCHA
                                hl={uiCulture}
                                ref={this.reCaptchaRef}
                                sitekey={reCaptchaSiteKey}
                                onChange={this.onRecaptchaChange}
                                onExpired={this.onReCaptchaError}
                                onErrored={this.onReCaptchaError}
                            />
                        </Grid>
                        {reCaptchaError && (
                            <Grid item>
                                <Text className={classes.reCaptchaErrorText} color="error" size="small">
                                    {resources.lblReCaptchaRequired}
                                </Text>
                            </Grid>
                        )}
                    </Grid>
                );
            }

            const contentStepButtons: JSX.Element = (
                <Grid container>
                    <Grid item>
                        <ButtonGroup id={`btgStep${activeStep}`}>
                            <Button
                                disabled={activeStep === 0}
                                id={`btnBack_${activeStep - 1}`}
                                variant="text"
                                onClick={this.onClickStep}
                            >
                                {resources.btnBack}
                            </Button>
                            <Button
                                disabled={finalStep && saved}
                                id={`btnNext_${activeStep + 1}`}
                                loading={finalStep && isLoadingSave}
                                onClick={finalStep
                                    ? this.onFinish
                                    : this.onClickStep}
                            >
                                {finalStep ? resources.btnFinish : resources.btnNext}
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            );

            contentPage = (
                <Modal
                    disableBackdropClick
                    disableEscapeKeyDown
                    disableHeaderTypography
                    id="personalInformationModal"
                    header={(
                        <Grid container>
                            <Grid item xs={12}>
                                <Text size="h2">
                                    {resources.lblCompleteProfileTitle}
                                </Text>
                            </Grid>
                            <Grid item xs={12}>
                                <Text size="large">
                                    {resources.lblCompleteProfileInstructions}
                                </Text>
                            </Grid>
                            <Grid item xs={12}>
                                <div className={classes.padding}>
                                    <Text size="large">
                                        {Format.toString(resources.formatTotalDonation, [totalDonation])}
                                    </Text>
                                </div>
                            </Grid>
                        </Grid>
                    )}
                    maxWidth="md"
                    open={open}
                    onClose={onClose}
                >
                    <div style={{ padding: '12px' }}>
                        <Grid container>
                            <Media query={Tokens.mqXSmall}>
                                {(matches: boolean): JSX.Element => matches ? (
                                    <MobileStepper
                                        steps={numSteps}
                                        position="static"
                                        activeStep={activeStep}
                                        nextButton={(
                                            <IconButton
                                                aria-label={resources.btnNext}
                                                color="secondary"
                                                disabled={activeStep === numSteps}
                                                id={`btnNext_${activeStep + 1}`}
                                                onClick={this.onClickStep}
                                            >
                                                <Icon large name="chevron-right" />
                                            </IconButton>
                                        )}
                                        backButton={(
                                            <IconButton
                                                aria-label={resources.btnBack}
                                                color="secondary"
                                                disabled={activeStep === 0}
                                                id={`btnBack_${activeStep - 1}`}
                                                onClick={this.onClickStep}
                                            >
                                                <Icon large name="chevron-left" />
                                            </IconButton>
                                        )}
                                    >
                                        <div className={classes.mobileStepperContent}>
                                            {activeStep !== numSteps ? (
                                                <>
                                                    <MobileStepperStep activeStep={activeStep}>
                                                        <MobileStepperLabel>
                                                            {activeStep === 0 && resources.lblPersonalInformationStepTitle}
                                                            {activeStep === 1 && resources.lblAddressInformationStepTitle}
                                                            {activeStep === 2 && resources.lblContactInformationStepTitle}
                                                        </MobileStepperLabel>
                                                    </MobileStepperStep>
                                                    {activeStep === 0 && contentSetp0}
                                                    {activeStep === 1 && contentSetp1}
                                                    {activeStep === 2 && contentSetp2}
                                                </>
                                            ) : (
                                                <>
                                                    <StepProgress nonLinear activeStep={activeStep} orientation="vertical">
                                                        {stepErrors.map((stepError, ise) => (
                                                            <Step key={`step_${ise}`}>
                                                                <StepButton
                                                                    classes={{ root: classes.boxStep }}
                                                                    id={`btnStep_${ise}`}
                                                                    onClick={this.onClickStep}
                                                                >
                                                                    <StepLabel error={stepError}>
                                                                        {ise === 0 && resources.lblPersonalInformationStepTitle}
                                                                        {ise === 1 && resources.lblAddressInformationStepTitle}
                                                                        {ise === 2 && resources.lblContactInformationStepTitle}
                                                                    </StepLabel>
                                                                </StepButton>
                                                            </Step>
                                                        ))}
                                                    </StepProgress>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            {reCaptchaElement}
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Button
                                                                disabled={saved}
                                                                id="btnFinish"
                                                                loading={isLoadingSave}
                                                                onClick={this.onFinish}
                                                            >
                                                                {resources.btnFinish}
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            )}
                                        </div>
                                    </MobileStepper>
                                ) : (
                                    <>
                                        <StepProgress nonLinear activeStep={activeStep} orientation="vertical">
                                            {stepErrors.map((stepError, ise) => (
                                                <Step key={`step_${ise}`}>
                                                    <StepButton
                                                        classes={{ root: classes.boxStep }}
                                                        id={`btnStep_${ise}`}
                                                        onClick={this.onClickStep}
                                                    >
                                                        <StepLabel error={stepError}>
                                                            {ise === 0 && resources.lblPersonalInformationStepTitle}
                                                            {ise === 1 && resources.lblAddressInformationStepTitle}
                                                            {ise === 2 && resources.lblContactInformationStepTitle}
                                                        </StepLabel>
                                                    </StepButton>
                                                    <StepContent>
                                                        {ise === 0 && contentSetp0}
                                                        {ise === 1 && contentSetp1}
                                                        {ise === 2 && contentSetp2}
                                                        {!finalStep && contentStepButtons}
                                                    </StepContent>
                                                </Step>
                                            ))}
                                        </StepProgress>
                                        {finalStep && (
                                            <Grid container spacing={2} className={classes.alignmentPaddingLeft}>
                                                {reCaptchaElement && (
                                                    <Grid item xs={12}>
                                                        {reCaptchaElement}
                                                    </Grid>
                                                )}
                                                <Grid item>
                                                    {contentStepButtons}
                                                </Grid>
                                            </Grid>
                                        )}
                                    </>
                                )
                                }
                            </Media>
                        </Grid>
                    </div>
                </Modal>
            );
        }

        return (
            <>
                {contentPage}
                {addressSearchModal}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(PersonalInformationModal);