/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: CompleteProfileModal.tsx
 * Type: Container component */

// #region Imports
import moment from 'moment';
import React from 'react';
import Media from 'react-media';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
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

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IConEdProspect, IProspectValidations } from '../../Types/Account/IProspect';
import { ICompleteProfileModalResources } from '../../Types/Resources/Generic/ICompleteProfileModalResources';

// Helpers
import { hasJustNumbersAndLetters } from '@hedtech/powercampus-design-system/helpers/CharRegExp';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import { emptyPositiveIntIsValid } from '@hedtech/powercampus-design-system/helpers/NumberRegExp';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../Requests/Generic/CompleteProfileModal';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface ICompleteProfileModalProps {
    open: boolean;
    registerAfterSave: boolean;
    onAfterSave?: () => void;
    onClose: () => void;
}

interface ICompleteProfileModalState {
    addressTypeOptions?: IDropDownOption[];
    componentError: boolean;
    countryOptions?: IDropDownOption[];
    governmentIdFormat: string;
    governmentIdFormatExample: string;
    governmentIdMaxLength: number;
    interestsIndex: number;
    isLoading: boolean;
    isLoadingSave: boolean;
    phoneTypeOptions?: IDropDownOption[];
    prefixOptions?: IDropDownOption[];
    prospect: IConEdProspect;
    prospectValidations: IProspectValidations;
    resources?: ICompleteProfileModalResources;
    saved: boolean;
    sourcesIndex: number;
    stateOptions?: IDropDownOption[];
    suffixOptions?: IDropDownOption[];

    // #region Stepper
    activeStep: number;
    numSteps: number;
    stepErrors: boolean[];
    // #endregion Stepper
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
        padding: `${Tokens.spacing40} ${Tokens.spacing40} 0 ${Tokens.spacing40}`
    }
});

type PropsWithStyles = ICompleteProfileModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class CompleteProfileModal extends React.Component<PropsWithStyles, ICompleteProfileModalState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<ICompleteProfileModalState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Generic';
        this.idPage = 'CompleteProfileModal';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): ICompleteProfileModalState {
        let resources: ICompleteProfileModalResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            governmentIdFormat: '',
            governmentIdFormatExample: '',
            governmentIdMaxLength: 11,
            interestsIndex: -1,
            isLoading: true,
            isLoadingSave: false,
            prospect: {
                address: {
                    addressLine1: '',
                    addressLine2: '',
                    addressLine3: '',
                    addressLine4: '',
                    city: '',
                    countryId: 0,
                    houseNumber: '',
                    stateProvinceId: undefined,
                    type: 0,
                    zipCode: ''
                },
                birthDateFormatted: '',
                displayName: '',
                firstName: '',
                governmentId: '',
                interests: [],
                lastName: '',
                lastNamePrefix: '',
                middleName: '',
                phone: {
                    countryId: 0,
                    number: '',
                    type: ''
                },
                prefixId: undefined,
                sources: [],
                suffixId: undefined
            },
            prospectValidations: {
                addressLine1Modified: false,
                addressTypeModified: false,
                cityModified: false,
                countryModified: false,
                firstNameModified: false,
                lastNameModified: false,
                phoneCountryModified: false,
                phoneNumberModified: false,
                phoneTypeModified: false,

                birthDateInvalid: false,
                governmentIdInvalid: false
            },
            resources: resources,
            saved: false,
            sourcesIndex: -1,

            // #region Stepper
            activeStep: 0,
            numSteps: 3,
            stepErrors: [false, false, false]
            // #endregion Stepper
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
                prospect,
                prospectValidations,
                stepErrors
            } = this.state;

            if (!isLoadingSave) {
                prospectValidations.addressLine1Modified = true;
                prospectValidations.addressTypeModified = true;
                prospectValidations.cityModified = true;
                prospectValidations.countryModified = true;
                prospectValidations.firstNameModified = true;
                prospectValidations.lastNameModified = true;
                prospectValidations.phoneCountryModified = true;
                prospectValidations.phoneNumberModified = true;
                prospectValidations.phoneTypeModified = true;
                stepErrors[0] = !Boolean(prospect.firstName)
                    || !Boolean(prospect.lastName);
                if (Boolean(prospect.birthDateFormatted)) {
                    stepErrors[0] = stepErrors[0] || prospectValidations.birthDateInvalid;
                }
                if (Boolean(prospect.governmentId)) {
                    stepErrors[0] = stepErrors[0] || prospectValidations.governmentIdInvalid;
                }
                stepErrors[1] = !Boolean(prospect.address.addressLine1)
                    || !Boolean(prospect.address.type)
                    || !Boolean(prospect.address.city)
                    || !Boolean(prospect.address.countryId);
                stepErrors[2] = !Boolean(prospect.phone.countryId)
                    || !Boolean(prospect.phone.number)
                    || !Boolean(prospect.phone.type);
                this.setState({
                    prospect: prospect,
                    stepErrors: stepErrors
                });
                if (!stepErrors[0] && !stepErrors[1] && !stepErrors[2]) {
                    this.showLoaderSave();
                    Requests.postCreateConEd(prospect, this.resolvePostCreateConEd, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onFinish.name, e));
        }
    };
    // #endregion Stepper

    private onCheckboxChange = (event: any): void => {
        try {
            const {
                prospect
            } = this.state;

            const parts: string[] = event.target.id.split('_');
            const position: number = Number(parts[1]);
            switch (parts[0]) {
                case 'chkInterest':
                    prospect.interests[position].isActive = event.target.checked;
                    break;
                case 'chkSource':
                    prospect.sources[position].isActive = event.target.checked;
                    break;
            }
            this.setState({
                prospect: prospect
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onDateTimeChange = (date: string, id: string, isValid: boolean): void => {
        try {
            const {
                prospect,
                prospectValidations
            } = this.state;

            if (id === 'dtpBirthDateFormatted') {
                prospectValidations.birthDateInvalid = !isValid;
            }

            const parts: string[] = id.split('_');

            let propId: string = parts[0];
            propId = `${propId[3].toLowerCase()}${propId.substr(4, propId.length - 4)}`;
            if (parts.length > 1) {
                let parent: string = parts[1];
                parent = `${parent[0].toLowerCase()}${parent.substr(1, parent.length - 1)}`;
                prospect[parent][propId] = date;
            }
            else {
                prospect[propId] = date;
            }
            this.setState({
                prospect: prospect
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDateTimeChange.name, e));
        }
    };

    private onDropdownChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                prospect
            } = this.state;

            const parts: string[] = id.split('_');

            let propId: string = parts[0];
            propId = `${propId[3].toLowerCase()}${propId.substr(4, propId.length - 4)}`;
            if (parts.length > 1) {
                let parent: string = parts[1];
                parent = `${parent[0].toLowerCase()}${parent.substr(1, parent.length - 1)}`;
                prospect[parent][propId] = optionSelected.value;
            }
            else {
                prospect[propId] = optionSelected.value;
            }
            this.setState({
                prospect: prospect
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onTextFieldChange = (event: any): void => {
        try {
            const {
                governmentIdFormat,
                governmentIdMaxLength,
                prospect,
                prospectValidations
            } = this.state;

            const originalId: string = event.target.id;
            if (originalId === 'txtPostalCode_Address'
                && event.target.value
                && !emptyPositiveIntIsValid(event.target.value)) {
                return;
            }
            if (originalId === 'txtNumber_Phone'
                && event.target.value
                && !emptyPositiveIntIsValid(event.target.value)) {
                return;
            }
            if (originalId === 'txtGovernmentId'
                && event.target.value) {
                if (hasJustNumbersAndLetters(event.target.value)) {
                    if (event.target.value.length > governmentIdMaxLength) {
                        prospectValidations.governmentIdInvalid = true;
                    }
                    else {
                        prospectValidations.governmentIdInvalid = !(new RegExp(governmentIdFormat).test(event.target.value));
                    }
                }
                else {
                    return;
                }
            }

            const parts: string[] = originalId.split('_');
            let propId: string = parts[0];
            propId = `${propId[3].toLowerCase()}${propId.substr(4, propId.length - 4)}`;
            if (parts.length > 1) {
                let parent: string = parts[1];
                parent = `${parent[0].toLowerCase()}${parent.substr(1, parent.length - 1)}`;
                prospect[parent][propId] = event.target.value;
            }
            else {
                prospect[propId] = event.target.value;
            }
            this.setState({
                prospect: prospect
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTextFieldChange.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private getGovernmentIdFormat(format: string): string {
        const uiFormat: string = format.replace(/\./g, '').replace(/\-/g, '').replace(/#/g, '[0-9]').replace(/X/g, '[A-Za-zÑñ]');
        return uiFormat;
    }

    private getGovernmentIdFormatExample(format: string): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let uiFormat: string = format.replace(/\./g, '').replace(/\-/g, '');
        while (uiFormat.includes('#') || uiFormat.includes('X')) {
            uiFormat = uiFormat.replace(/#/, Math.floor(Math.random() * 100)
                .toString()[0]).replace(/X/, characters[Math.floor(Math.random() * 100 % 26)]);
        }
        return uiFormat;
    }
    // #endregion Functions

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

    private showError(message?: string): void {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetConEdData = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetConEdData.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    governmentIdFormat,
                    governmentIdFormatExample,
                    governmentIdMaxLength,
                    numSteps,
                    prospect
                } = this.state;

                prospect.interests = result.data.interests;
                prospect.sources = result.data.sources;
                prospect.firstName = result.data.firstName;
                prospect.lastName = result.data.lastName;
                let newNumSteps: number = numSteps;
                let interestsIndex: number = -1;
                let sourcesIndex: number = -1;
                if (prospect.interests && prospect.interests.length > 0) {
                    interestsIndex = newNumSteps;
                    newNumSteps++;
                }
                if (prospect.sources && prospect.sources.length > 0) {
                    sourcesIndex = newNumSteps;
                    newNumSteps++;
                }
                this.setState({
                    addressTypeOptions: result.data.addressTypeOptions,
                    countryOptions: result.data.countryOptions,
                    governmentIdFormat: result.data.governmentIdFormat ?
                        this.getGovernmentIdFormat(result.data.governmentIdFormat)
                        : governmentIdFormat,
                    governmentIdFormatExample: result.data.governmentIdFormat ?
                        this.getGovernmentIdFormatExample(result.data.governmentIdFormat)
                        : governmentIdFormatExample,
                    governmentIdMaxLength: result.data.governmentIdMaxLength ?
                        result.data.governmentIdMaxLength
                        : governmentIdMaxLength,
                    interestsIndex: interestsIndex,
                    numSteps: newNumSteps,
                    phoneTypeOptions: result.data.phoneTypeOptions,
                    prefixOptions: result.data.prefixOptions,
                    prospect: prospect,
                    sourcesIndex: sourcesIndex,
                    stateOptions: result.data.stateOptions,
                    suffixOptions: result.data.suffixOptions
                }, this.hideLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetConEdData.name, e));
        }
    };

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

    private resolvePostCreateConEd = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostCreateConEd.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
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
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostCreateConEd.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getConEdData(this.resolveGetConEdData, this.logError);
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
            registerAfterSave,
            onClose
        } = this.props;

        const {
            activeStep,
            addressTypeOptions,
            componentError,
            countryOptions,
            governmentIdFormatExample,
            governmentIdMaxLength,
            interestsIndex,
            isLoading,
            isLoadingSave,
            numSteps,
            phoneTypeOptions,
            prefixOptions,
            prospect,
            prospectValidations,
            resources,
            saved,
            stateOptions,
            stepErrors,
            sourcesIndex,
            suffixOptions
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            const resourcesLayout: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
            const cultures: ICultures = LayoutStore.getCultures();
            const emptyOption: IDropDownOption = {
                description: resourcesLayout ? resourcesLayout.lblDropDownEmptyText : '',
                value: 0
            };
            const endRangeBirthDate: number = 0;

            const dateMinFormat: string = moment().add(-100, 'years').format(cultures.shortDatePattern.toUpperCase());
            const dateMaxFormat: string = moment().add(endRangeBirthDate, 'days').format(cultures.shortDatePattern.toUpperCase());

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
                            value={prospect.prefixId}
                            onChange={this.onDropdownChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            error={prospectValidations.firstNameModified && !Boolean(prospect.firstName)}
                            helperText={prospectValidations.firstNameModified && !Boolean(prospect.firstName) ?
                                resources.lblFirstNameRequired
                                : undefined}
                            id="txtFirstName"
                            label={resources.lblFirstName}
                            maxCharacters={120}
                            required
                            value={prospect.firstName}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            id="txtMiddleName"
                            label={resources.lblMiddleName}
                            maxCharacters={120}
                            value={prospect.middleName}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            id="txtLastNamePrefix"
                            label={resources.lblLastNamePrefix}
                            maxCharacters={120}
                            value={prospect.lastNamePrefix}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            error={prospectValidations.lastNameModified && !Boolean(prospect.lastName)}
                            helperText={prospectValidations.lastNameModified && !Boolean(prospect.lastName) ?
                                resources.lblLastNameRequired
                                : undefined}
                            id="txtLastName"
                            label={resources.lblLastName}
                            maxCharacters={120}
                            required
                            value={prospect.lastName}
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
                            value={prospect.suffixId}
                            onChange={this.onDropdownChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            id="txtDisplayName"
                            label={resources.lblDisplayName}
                            maxCharacters={120}
                            value={prospect.displayName}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            culture={cultures.dateTimeCulture}
                            disabled={saved || isLoadingSave}
                            error={Boolean(prospect.birthDateFormatted) && prospectValidations.birthDateInvalid}
                            helperText={Boolean(prospect.birthDateFormatted) && prospectValidations.birthDateInvalid ?
                                Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat])
                                : undefined}
                            format={cultures.shortDatePattern}
                            id="dtpBirthDateFormatted"
                            label={resources.lblBirthDate}
                            rangeEnd={endRangeBirthDate}
                            rangeEndPeriod="days"
                            value={prospect.birthDateFormatted}
                            onChange={this.onDateTimeChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            error={Boolean(prospect.governmentId) && prospectValidations.governmentIdInvalid}
                            helperText={Boolean(prospect.governmentId) && prospectValidations.governmentIdInvalid ?
                                Format.toString(resources.formatGovernmentIdInvalid, [governmentIdMaxLength, governmentIdFormatExample])
                                : Format.toString(resources.formatGovernmentIdExample, [governmentIdFormatExample])}
                            id="txtGovernmentId"
                            label={resources.lblGovernmentId}
                            value={prospect.governmentId}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                </Grid>
            );

            const contentSetp1: JSX.Element = (
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <Dropdown
                            disabled={saved || isLoadingSave}
                            emptyOption={emptyOption}
                            error={prospectValidations.addressTypeModified && !Boolean(prospect.address.type)}
                            helperText={prospectValidations.addressTypeModified && !Boolean(prospect.address.type) ?
                                resources.lblAddressTypeRequired
                                : undefined}
                            id="ddlType_Address"
                            label={resources.lblAddressType}
                            loading={isLoading}
                            options={addressTypeOptions}
                            required
                            value={prospect.address.type}
                            onChange={this.onDropdownChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            id="txtHouseNumber_Address"
                            label={resources.lblHouseNumber}
                            maxCharacters={10}
                            value={prospect.address.houseNumber}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            error={prospectValidations.addressLine1Modified && !Boolean(prospect.address.addressLine1)}
                            helperText={prospectValidations.addressLine1Modified && !Boolean(prospect.address.addressLine1) ?
                                resources.lblAddressLine1Required
                                : undefined}
                            id="txtAddressLine1_Address"
                            label={resources.lblAddressLine1}
                            maxCharacters={75}
                            required
                            value={prospect.address.addressLine1}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            id="txtAddressLine2_Address"
                            label={resources.lblAddressLine2}
                            maxCharacters={75}
                            value={prospect.address.addressLine2}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            id="txtAddressLine3_Address"
                            label={resources.lblAddressLine3}
                            maxCharacters={75}
                            value={prospect.address.addressLine3}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            id="txtAddressLine4_Address"
                            label={resources.lblAddressLine4}
                            maxCharacters={75}
                            value={prospect.address.addressLine4}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            id="txtZipCode_Address"
                            label={resources.lblZipCode}
                            maxCharacters={15}
                            value={prospect.address.zipCode}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            error={prospectValidations.cityModified && !Boolean(prospect.address.city)}
                            helperText={prospectValidations.cityModified && !Boolean(prospect.address.city) ?
                                resources.lblCityRequired
                                : undefined}
                            id="txtCity_Address"
                            label={resources.lblCity}
                            maxCharacters={50}
                            required
                            value={prospect.address.city}
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
                            value={prospect.address.stateProvinceId}
                            onChange={this.onDropdownChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Dropdown
                            disabled={saved || isLoadingSave}
                            emptyOption={emptyOption}
                            error={prospectValidations.countryModified && !Boolean(prospect.address.countryId)}
                            helperText={prospectValidations.countryModified && !Boolean(prospect.address.countryId) ?
                                resources.lblPhoneCountryRequired
                                : undefined}
                            id="ddlCountryId_Address"
                            label={resources.lblCountry}
                            loading={isLoading}
                            options={countryOptions}
                            required
                            value={prospect.address.countryId}
                            onChange={this.onDropdownChange}
                        />
                    </Grid>
                </Grid>
            );

            const contentSetp2: JSX.Element = (
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <Dropdown
                            disabled={saved || isLoadingSave}
                            emptyOption={emptyOption}
                            error={prospectValidations.phoneTypeModified && !Boolean(prospect.phone.type)}
                            helperText={prospectValidations.phoneTypeModified && !Boolean(prospect.phone.type) ?
                                resources.lblPhoneTypeRequired
                                : undefined}
                            id="ddlType_Phone"
                            label={resources.lblPhoneType}
                            loading={isLoading}
                            options={phoneTypeOptions}
                            required
                            value={prospect.phone.type}
                            onChange={this.onDropdownChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Dropdown
                            disabled={saved || isLoadingSave}
                            emptyOption={emptyOption}
                            error={prospectValidations.phoneCountryModified && !Boolean(prospect.phone.countryId)}
                            helperText={prospectValidations.phoneCountryModified && !Boolean(prospect.phone.countryId) ?
                                resources.lblPhoneCountryRequired
                                : undefined}
                            id="ddlCountryId_Phone"
                            label={resources.lblPhoneCountry}
                            loading={isLoading}
                            options={countryOptions}
                            required
                            value={prospect.phone.countryId}
                            onChange={this.onDropdownChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled={saved || isLoadingSave}
                            error={prospectValidations.phoneNumberModified && !Boolean(prospect.phone.number)}
                            helperText={prospectValidations.phoneNumberModified && !Boolean(prospect.phone.number) ?
                                resources.lblPhoneNumberRequired
                                : undefined}
                            id="txtNumber_Phone"
                            label={resources.lblPhoneNumber}
                            maxCharacters={60}
                            required
                            value={prospect.phone.number}
                            onChange={this.onTextFieldChange}
                        />
                    </Grid>
                </Grid>
            );

            let contentSetp3: JSX.Element;
            if (prospect.interests && prospect.interests.length > 0) {
                contentSetp3 = (
                    <Grid container>
                        {prospect.interests.map((interest, ii) => (
                            <Grid item xs={12} sm={6} md={4} key={`interest_${ii}`}>
                                <Checkbox
                                    disabled={saved || isLoadingSave}
                                    checked={interest.isActive}
                                    id={`chkInterest_${ii}`}
                                    label={interest.description}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            }

            let contentSetp4: JSX.Element;
            if (prospect.sources && prospect.sources.length > 0) {
                contentSetp4 = (
                    <Grid container>
                        <Grid item xs={12}>
                            <Text size="large" weight="strong">
                                {resources.lblOtherMessage}
                            </Text>
                        </Grid>
                        {prospect.sources.map((source, is) => (
                            <Grid item xs={12} sm={6} md={4} key={`source_${is}`}>
                                <Checkbox
                                    disabled={saved || isLoadingSave}
                                    checked={source.isActive}
                                    id={`chkSource_${is}`}
                                    label={source.description}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            }
            // #endregion Content Steps

            const finalStep: boolean = activeStep === numSteps - 1;
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
                                {finalStep
                                    ? (registerAfterSave ? resources.btnFinishAndRegister : resources.btnFinish)
                                    : resources.btnNext}
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
                    id="completeProfileModal"
                    header={(
                        <>
                            <Text size="h2">
                                {resources.lblCompleteProfileTitle}
                            </Text>
                            <Text size="large">
                                {resources.lblCompleteProfileInstructions}
                            </Text>
                        </>
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
                                                            {activeStep === 3 && interestsIndex > 0 && resources.lblInterestsStepTitle}
                                                            {activeStep === 4 && sourcesIndex > 0 && resources.lblOtherStepTitle}
                                                        </MobileStepperLabel>
                                                    </MobileStepperStep>
                                                    {activeStep === 0 && contentSetp0}
                                                    {activeStep === 1 && contentSetp1}
                                                    {activeStep === 2 && contentSetp2}
                                                    {activeStep === 3 && contentSetp3}
                                                    {activeStep === 4 && contentSetp4}
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
                                                            {interestsIndex > 0 && (
                                                                <Step>
                                                                    <StepButton
                                                                        classes={{ root: classes.boxStep }}
                                                                        id={`btnStep_${3}`}
                                                                        onClick={this.onClickStep}
                                                                    >
                                                                        <StepLabel>
                                                                            {resources.lblInterestsStepTitle}
                                                                        </StepLabel>
                                                                    </StepButton>
                                                                </Step>
                                                            )}
                                                            {sourcesIndex > 0 && (
                                                                <Step>
                                                                    <StepButton
                                                                        classes={{ root: classes.boxStep }}
                                                                        id={`btnStep_${4}`}
                                                                        onClick={this.onClickStep}
                                                                    >
                                                                        <StepLabel>
                                                                            {resources.lblOtherStepTitle}
                                                                        </StepLabel>
                                                                    </StepButton>
                                                                </Step>
                                                            )}
                                                        </StepProgress>
                                                        <Button
                                                            disabled={saved}
                                                            id="btnFinish"
                                                            loading={isLoadingSave}
                                                            onClick={this.onFinish}
                                                        >
                                                            {registerAfterSave ? resources.btnFinishAndRegister : resources.btnFinish}
                                                        </Button>
                                                    </>
                                                )}
                                        </div>
                                    </MobileStepper>
                                ) : (
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
                                                            {ise === 3 && interestsIndex > 0 && resources.lblInterestsStepTitle}
                                                            {ise === 4 && sourcesIndex > 0 && resources.lblOtherStepTitle}
                                                        </StepLabel>
                                                    </StepButton>
                                                    <StepContent>
                                                        {ise === 0 && contentSetp0}
                                                        {ise === 1 && contentSetp1}
                                                        {ise === 2 && contentSetp2}
                                                        {ise === 3 && contentSetp3}
                                                        {ise === 4 && contentSetp4}
                                                        {contentStepButtons}
                                                    </StepContent>
                                                </Step>
                                            ))}
                                            {interestsIndex > 0 && (
                                                <Step>
                                                    <StepButton
                                                        classes={{ root: classes.boxStep }}
                                                        id={`btnStep_${interestsIndex}`}
                                                        onClick={this.onClickStep}
                                                    >
                                                        <StepLabel>
                                                            {resources.lblInterestsStepTitle}
                                                        </StepLabel>
                                                    </StepButton>
                                                    <StepContent>
                                                        {contentSetp3}
                                                        {contentStepButtons}
                                                    </StepContent>
                                                </Step>
                                            )}
                                            {sourcesIndex > 0 && (
                                                <Step>
                                                    <StepButton
                                                        classes={{ root: classes.boxStep }}
                                                        id={`btnStep_${sourcesIndex}`}
                                                        onClick={this.onClickStep}
                                                    >
                                                        <StepLabel>
                                                            {resources.lblOtherStepTitle}
                                                        </StepLabel>
                                                    </StepButton>
                                                    <StepContent>
                                                        {contentSetp4}
                                                        {contentStepButtons}
                                                    </StepContent>
                                                </Step>
                                            )}
                                        </StepProgress>
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
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(CompleteProfileModal);