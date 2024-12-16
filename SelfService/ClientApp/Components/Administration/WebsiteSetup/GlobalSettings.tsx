/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: GlobalSettings.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import Media from 'react-media';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IDateTimeFormat } from '../../../Types/InstitutionSettings/IDateTimeFormat';
import { IGeneral } from '../../../Types/InstitutionSettings/IGeneral';
import { INumberFormat } from '../../../Types/InstitutionSettings/INumberFormat';
import { IGlobalSettingsResources } from '../../../Types/Resources/Administration/IGlobalSettingsResources';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/GlobalSettings';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IGlobalSettingsProps {
    lblSuccessSave: string;
}

interface IGlobalSettingsState {
    areasOpenStatus: boolean[];
    componentError: boolean;
    cultureList?: IDropDownOption[];
    currencyCultureSelected: string;
    currencyFormat?: IGeneral;
    currencySubCultureSelected?: string;
    dateFormat?: IDateTimeFormat;
    dateTimeCultureSelected: string;
    dateTimeSubCultureSelected?: string;
    generalSettings?: IGeneral;
    governmentIdFormat: boolean;
    governmentIdLength: number;
    governmentIdMaxLength: number;
    languageList?: IDropDownOption[];
    languageSelected?: string;
    numberCultureSelected: string;
    numberFormat?: INumberFormat;
    numberSubCultureSelected?: string;
    peopleIdFormat: boolean;
    peopleIdLength: number;
    resources?: IGlobalSettingsResources;
    showStudentPicture: boolean;
    subCultureCurrencyList?: IDropDownOption[];
    subCultureDateTimeList?: IDropDownOption[];
    subCultureNumberList?: IDropDownOption[];
}
// #endregion Types

// #region Component
class GlobalSettings extends React.Component<IGlobalSettingsProps, IGlobalSettingsState> {
    private idModule: string;
    private idPage: string;
    private isCultureCurrencyChange: boolean;
    private isCultureDateTimeChange: boolean;
    private isCultureNumberChange: boolean;

    public readonly state: Readonly<IGlobalSettingsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'GlobalSettings';
        this.isCultureCurrencyChange = false;
        this.isCultureDateTimeChange = false;
        this.isCultureNumberChange = false;
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IGlobalSettingsState {
        let resources: IGlobalSettingsResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            areasOpenStatus: [false, false, false, false, false],
            componentError: false,
            currencyCultureSelected: '',
            dateTimeCultureSelected: '',
            governmentIdFormat: false,
            governmentIdLength: 0,
            governmentIdMaxLength: 0,
            numberCultureSelected: '',
            peopleIdFormat: false,
            peopleIdLength: 0,
            resources: resources,
            showStudentPicture: false
        };
    }

    // #region Events
    private onChangeCredits = (event: any): void => {
        try {
            if (event.target.value.match(/^[#0,.]*$/g) || event.target.value === '') {
                let optionsSelected: IGeneral | undefined;
                optionsSelected = this.state.generalSettings;
                if (optionsSelected) {
                    optionsSelected.credits = event.target.value;
                    this.setState({
                        generalSettings: optionsSelected
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCredits.name, e));
        }
    };

    private onChangeGPA = (event: any): void => {
        try {
            if (event.target.value.match(/^[#0,.]*$/g) || event.target.value === '') {
                let optionsSelected: IGeneral | undefined;
                optionsSelected = this.state.generalSettings;
                if (optionsSelected) {
                    optionsSelected.gpa = event.target.value;
                    this.setState({
                        generalSettings: optionsSelected
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeGPA.name, e));
        }
    };

    private onChangeGovernmentId = (event: any): void => {
        try {
            if (event.target.value.match(/^[X#.-]*$/g) || event.target.value === '') {
                let optionsSelected: IGeneral | undefined;
                optionsSelected = this.state.generalSettings;
                if (optionsSelected) {
                    optionsSelected.governmentIdFormat = event.target.value;
                    const governmentId = optionsSelected.governmentIdFormat.replace(/[-.]/g, '');
                    if (governmentId.length === this.state.governmentIdMaxLength) {
                        this.setState({
                            governmentIdFormat: true,
                            governmentIdLength: governmentId.length
                        });
                    }
                    else {
                        this.setState({
                            governmentIdFormat: false,
                            governmentIdLength: governmentId.length
                        });
                    }

                    this.setState({
                        generalSettings: optionsSelected
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeGovernmentId.name, e));
        }
    };

    private onChangePeopleId = (event: any): void => {
        try {
            if (event.target.value.match(/^[X#.-]*$/g) || event.target.value === '') {
                let optionsSelected: IGeneral | undefined;
                optionsSelected = this.state.generalSettings;
                if (optionsSelected) {
                    optionsSelected.peopleIdFormat = event.target.value;
                    const peopleId = optionsSelected.peopleIdFormat.replace(/[-.]/g, '');
                    if (peopleId.length === 9) {
                        this.setState({
                            peopleIdFormat: true,
                            peopleIdLength: peopleId.length
                        });
                    }
                    else {
                        this.setState({
                            peopleIdFormat: false,
                            peopleIdLength: peopleId.length
                        });
                    }
                    this.setState({
                        generalSettings: optionsSelected
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePeopleId.name, e));
        }
    };

    private onChangeQualityPoints = (event: any): void => {
        try {
            if (event.target.value.match(/^[#0,.]*$/g) || event.target.value === '') {
                let optionsSelected: IGeneral | undefined;
                optionsSelected = this.state.generalSettings;
                if (optionsSelected) {
                    optionsSelected.qualityPoints = event.target.value;
                    this.setState({
                        generalSettings: optionsSelected
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeQualityPoints.name, e));
        }
    };

    private onChangeCultureCurrency = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                cultureList
            } = this.state;

            this.isCultureCurrencyChange = true;

            if (optionSelected && cultureList) {
                Requests.getSubCultures(optionSelected.value.toString(), this.resolveGetSubCulturesCurrency, this.logError);
                this.setState({
                    currencyCultureSelected: optionSelected.value.toString()
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCultureCurrency.name, e));
        }
    };

    private onChangeCultureDateTime = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                cultureList
            } = this.state;

            this.isCultureDateTimeChange = true;

            if (optionSelected && cultureList) {
                Requests.getSubCultures(optionSelected.value.toString(), this.resolveGetSubCulturesDateTime, this.logError);
                this.setState({
                    dateTimeCultureSelected: optionSelected.value.toString()
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCultureDateTime.name, e));
        }
    };

    private onChangeCultureNumber = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                cultureList
            } = this.state;

            this.isCultureNumberChange = true;

            if (optionSelected && cultureList) {
                Requests.getSubCultures(optionSelected.value.toString(), this.resolveGetSubCulturesNumber, this.logError);
                this.setState({
                    numberCultureSelected: optionSelected.value.toString()
                });
            }
        }
        catch (ex) {
            this.logError(LogData.fromException(this.onChangeCultureNumber.name, ex));
        }
    };

    private onChangeLanguage = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            let optLanguage: IGeneral | undefined;
            optLanguage = this.state.generalSettings;

            if (optionSelected && optLanguage) {
                optLanguage.uiCulture = optionSelected.value.toString();
                this.setState({
                    generalSettings: optLanguage,
                    languageSelected: optLanguage.uiCulture
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeLanguage.name, e));
        }
    };

    private onChangeSubCultureCurrency = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            let currencyCulture: IGeneral | undefined;
            currencyCulture = this.state.generalSettings;

            if (optionSelected && currencyCulture) {
                Requests.getSubCultureCurrencyFormat(optionSelected.value.toString(), this.resolveGetCurrencyFormat, this.logError);
                currencyCulture.currencyCulture = optionSelected.value.toString();
                this.setState({
                    currencySubCultureSelected: optionSelected.value.toString(),
                    generalSettings: currencyCulture
                });

            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeSubCultureCurrency.name, e));
        }
    };

    private onChangeSubCultureDateTime = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            let dateFormat: IDateTimeFormat | undefined;
            let generalSettings: IGeneral | undefined;

            dateFormat = this.state.dateFormat;
            generalSettings = this.state.generalSettings;

            if (optionSelected && dateFormat && generalSettings) {
                Requests.getSubCultureDateTimeFormat(optionSelected.value.toString(), this.resolveGetDateTimeFormat, this.logError);
                generalSettings.dateTimeCulture = optionSelected.value.toString();
                this.setState({
                    dateFormat: dateFormat,
                    dateTimeSubCultureSelected: optionSelected.value.toString(),
                    generalSettings: generalSettings
                });

            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeSubCultureDateTime.name, e));
        }
    };

    private onChangeSubCultureNumber = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            let numberFormat: INumberFormat | undefined;
            let generalSettings: IGeneral | undefined;

            numberFormat = this.state.numberFormat;
            generalSettings = this.state.generalSettings;

            if (optionSelected && numberFormat && generalSettings) {
                Requests.getSubCultureNumberFormat(optionSelected.value.toString(), this.resolveGetNumberFormat, this.logError);
                generalSettings.numberCulture = optionSelected.value.toString();
                this.setState({
                    generalSettings: generalSettings,
                    numberFormat: numberFormat,
                    numberSubCultureSelected: optionSelected.value.toString()
                });

            }
        }
        catch (ex) {
            this.logError(LogData.fromException(this.onChangeSubCultureNumber.name, ex));
        }

    };

    private onChangeOpenStatus = (event: React.MouseEvent<HTMLElement>): void => {
        try {
            const {
                areasOpenStatus
            } = this.state;

            const index: string[] = event.currentTarget.id.split('_');

            areasOpenStatus[index[1]] = !areasOpenStatus[index[1]];

            this.setState({
                areasOpenStatus: areasOpenStatus
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeOpenStatus.name, e));
        }
    };

    private onCheckboxChange = (): void => {
        try {
            const {
                showStudentPicture
            } = this.state;
            let showStudentPictureVal: IGeneral | undefined;
            showStudentPictureVal = this.state.generalSettings;
            const showSP: boolean = !showStudentPicture;
            if (showStudentPictureVal) {
                showStudentPictureVal.showStudentPicture = showSP;
                this.setState({
                    generalSettings: showStudentPictureVal,
                    showStudentPicture: showSP
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onSaveSettings = (): void => {
        try {
            const {
                generalSettings,
                peopleIdLength,
                governmentIdLength,
                governmentIdMaxLength
            } = this.state;

            LayoutActions.setLoading(true);
            if (peopleIdLength === 9 && governmentIdLength === governmentIdMaxLength && generalSettings
                && generalSettings.credits && generalSettings.qualityPoints && generalSettings.gpa) {
                Requests.postSaveSettings(generalSettings, this.resolvePostSaveSettings, this.logError);
            }
            else {
                this.showError();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
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

    private showError(message?: string): void {
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetCurrencyFormat = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCurrencyFormat.name);

            if (result?.status) {
                const currencyFormat: IGeneral = result.data.currency;
                this.setState({
                    currencyFormat: currencyFormat
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetCurrencyFormat.name, e));
        }
    };

    private resolveGetDateTimeFormat = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDateTimeFormat.name);

            if (result?.status) {
                const dateFormat: IDateTimeFormat = result.data.dateFormat;
                this.setState({
                    dateFormat: dateFormat
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDateTimeFormat.name, e));
        }
    };

    private resolveGetNumberFormat = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetNumberFormat.name);

            if (result?.status) {
                const numberFormat: INumberFormat = result.data.numberFormat;
                this.setState({
                    numberFormat: numberFormat
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetNumberFormat.name, e));
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

    private resolveGetSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSettings.name);

            if (result?.status) {
                const settings: IGeneral = result.data.general;
                const peopleIdLen = settings.peopleIdFormat.replace(/[-.]/g, '');
                const governmentIdLen = settings.governmentIdFormat.replace(/[-.]/g, '');
                this.setState({
                    currencyCultureSelected: settings.parentCurrencyCulture,
                    currencySubCultureSelected: settings.currencyCulture,
                    dateTimeCultureSelected: settings.parentDateTimeCulture,
                    dateTimeSubCultureSelected: settings.dateTimeCulture,
                    generalSettings: settings,
                    governmentIdLength: governmentIdLen.length,
                    governmentIdMaxLength: settings.governmentIdMaxLength,
                    languageList: result.data.languageList,
                    languageSelected: settings.uiCulture,
                    numberCultureSelected: settings.parentNumberCulture,
                    numberSubCultureSelected: settings.numberCulture,
                    peopleIdLength: peopleIdLen.length,
                    showStudentPicture: settings.showStudentPicture
                }, () => {
                    const cultureInfoList: IDropDownOption[] = result.data.cultureInfoList;
                    if (this.state.currencyCultureSelected) {
                        Requests.getSubCultures(this.state.currencyCultureSelected,
                            this.resolveGetSubCulturesCurrency, this.logError);
                        this.setState({
                            cultureList: cultureInfoList,
                            currencyCultureSelected: this.state.currencyCultureSelected
                        });
                    }
                    else {
                        Requests.getSubCultures(this.state.currencyCultureSelected,
                            this.resolveGetSubCulturesCurrency, this.logError);
                        this.setState({
                            cultureList: cultureInfoList,
                            currencyCultureSelected: cultureInfoList[0].value.toString()
                        });
                    }

                    if (this.state.dateTimeCultureSelected) {
                        Requests.getSubCultures(this.state.dateTimeCultureSelected,
                            this.resolveGetSubCulturesDateTime, this.logError);
                        this.setState({
                            cultureList: cultureInfoList
                        });
                    }
                    else {
                        Requests.getSubCultures(this.state.dateTimeCultureSelected,
                            this.resolveGetSubCulturesDateTime, this.logError);
                        this.setState({
                            cultureList: cultureInfoList,
                            dateTimeCultureSelected: cultureInfoList[0].value.toString()
                        });
                    }
                    if (this.state.numberCultureSelected) {
                        Requests.getSubCultures(this.state.numberCultureSelected,
                            this.resolveGetSubCulturesNumber, this.logError);
                        this.setState({
                            cultureList: cultureInfoList
                        });
                    }
                    else {
                        Requests.getSubCultures(this.state.numberCultureSelected,
                            this.resolveGetSubCulturesNumber, this.logError);
                        this.setState({
                            cultureList: cultureInfoList,
                            numberCultureSelected: cultureInfoList[0].value.toString()
                        });
                    }
                    LayoutActions.setLoading(false);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

    private resolveGetSubCulturesCurrency = (json: string): void => {
        try {
            const {
                generalSettings
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSubCulturesCurrency.name);

            if (result?.status) {
                const settings: IGeneral = result.data;
                if (generalSettings) {
                    generalSettings.currencyCulture = settings.listOptionViewModel[0].value.toString();
                    if (this.state.currencySubCultureSelected) {
                        if (this.isCultureCurrencyChange) {
                            Requests.getSubCultureCurrencyFormat(settings.listOptionViewModel[0].value.toString(),
                                this.resolveGetCurrencyFormat, this.logError);
                            this.setState({
                                currencySubCultureSelected: settings.listOptionViewModel[0].value.toString(),
                                generalSettings: generalSettings,
                                subCultureCurrencyList: settings.listOptionViewModel
                            });
                        }
                        else {
                            Requests.getSubCultureCurrencyFormat(this.state.currencySubCultureSelected,
                                this.resolveGetCurrencyFormat, this.logError);
                            generalSettings.currencyCulture = this.state.currencySubCultureSelected;
                            this.setState({
                                currencySubCultureSelected: this.state.currencySubCultureSelected,
                                generalSettings: generalSettings,
                                subCultureCurrencyList: settings.listOptionViewModel
                            });
                        }
                    }
                    else {
                        Requests.getSubCultureCurrencyFormat(settings.cultureInfoList[0].value.toString(),
                            this.resolveGetCurrencyFormat, this.logError);
                        this.setState({
                            currencySubCultureSelected: settings.cultureInfoList[0].value.toString(),
                            generalSettings: generalSettings,
                            subCultureCurrencyList: settings.cultureInfoList
                        });
                    }
                    this.isCultureCurrencyChange = false;
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSubCulturesCurrency.name, e));
        }
    };

    private resolveGetSubCulturesDateTime = (json: string): void => {
        try {
            const {
                generalSettings
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSubCulturesDateTime.name);

            if (result?.status) {
                const settings: IGeneral = result.data;
                if (generalSettings) {
                    generalSettings.dateTimeCulture = settings.listOptionViewModel[0].value.toString();
                    if (this.state.dateTimeSubCultureSelected) {
                        if (this.isCultureDateTimeChange) {
                            Requests.getSubCultureDateTimeFormat(settings.listOptionViewModel[0].value.toString(),
                                this.resolveGetDateTimeFormat, this.logError);
                            this.setState({
                                dateTimeSubCultureSelected: settings.listOptionViewModel[0].value.toString(),
                                generalSettings: generalSettings,
                                subCultureDateTimeList: settings.listOptionViewModel
                            });
                        }
                        else {
                            Requests.getSubCultureDateTimeFormat(this.state.dateTimeSubCultureSelected,
                                this.resolveGetDateTimeFormat, this.logError);
                            generalSettings.dateTimeCulture = this.state.dateTimeSubCultureSelected;
                            this.setState({
                                dateTimeSubCultureSelected: this.state.dateTimeSubCultureSelected,
                                generalSettings: generalSettings,
                                subCultureDateTimeList: settings.listOptionViewModel
                            });
                        }
                    }
                    else {
                        Requests.getSubCultureDateTimeFormat(settings.cultureInfoList[0].value.toString(),
                            this.resolveGetDateTimeFormat, this.logError);
                        this.setState({
                            dateTimeSubCultureSelected: settings.cultureInfoList[0].value.toString(),
                            generalSettings: generalSettings,
                            subCultureDateTimeList: settings.cultureInfoList
                        });
                    }
                    this.isCultureDateTimeChange = false;
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSubCulturesDateTime.name, e));
        }
    };

    private resolveGetSubCulturesNumber = (json: string): void => {
        try {
            const {
                generalSettings
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSubCulturesNumber.name);

            if (result?.status) {
                const settings: IGeneral = result.data;
                if (generalSettings) {
                    generalSettings.numberCulture = settings.listOptionViewModel[0].value.toString();
                    if (this.state.numberSubCultureSelected) {
                        if (this.isCultureNumberChange) {
                            Requests.getSubCultureNumberFormat(settings.listOptionViewModel[0].value.toString(),
                                this.resolveGetNumberFormat, this.logError);
                            this.setState({
                                generalSettings: generalSettings,
                                numberSubCultureSelected: settings.listOptionViewModel[0].value.toString(),
                                subCultureNumberList: settings.listOptionViewModel
                            });
                        }
                        else {
                            Requests.getSubCultureNumberFormat(this.state.numberSubCultureSelected,
                                this.resolveGetNumberFormat, this.logError);
                            generalSettings.numberCulture = this.state.numberSubCultureSelected;
                            this.setState({
                                generalSettings: generalSettings,
                                numberSubCultureSelected: this.state.numberSubCultureSelected,
                                subCultureNumberList: settings.listOptionViewModel
                            });
                        }
                    }
                    else {
                        Requests.getSubCultureNumberFormat(settings.cultureInfoList[0].value.toString(),
                            this.resolveGetNumberFormat, this.logError);
                        this.setState({
                            generalSettings: generalSettings,
                            numberSubCultureSelected: settings.cultureInfoList[0].value.toString(),
                            subCultureNumberList: settings.cultureInfoList
                        });
                    }
                    this.isCultureNumberChange = false;
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSubCulturesNumber.name, e));
        }
    };

    private resolvePostSaveSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveSettings.name);

            if (result?.status) {
                const {
                    lblSuccessSave
                } = this.props;

                LayoutActions.setAlert({
                    message: lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveSettings.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getSettings(this.resolveGetSettings, this.logError);
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
            currencyCultureSelected,
            currencyFormat,
            currencySubCultureSelected,
            dateFormat,
            dateTimeCultureSelected,
            dateTimeSubCultureSelected,
            generalSettings,
            governmentIdFormat,
            governmentIdLength,
            languageList,
            languageSelected,
            numberCultureSelected,
            numberFormat,
            numberSubCultureSelected,
            peopleIdFormat,
            peopleIdLength,
            resources,
            subCultureCurrencyList,
            subCultureDateTimeList,
            subCultureNumberList,
            cultureList
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources && generalSettings && currencyFormat && dateFormat && numberFormat) {
            let emptyOption: IDropDownOption;
            emptyOption = {
                description: resources.lblLanguageEmptyOption,
                value: ''
            };

            contentPage = (
                <Grid container spacing={3}>
                    <Grid item xs>
                        <Grid container>
                            <Grid item xs>
                                <Text size="large">
                                    {resources.lblSpecifyApp}
                                </Text>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Media query={Tokens.mqSmallDown}>
                                    {(matches: boolean): JSX.Element => matches ? (
                                        <Grid container spacing={3}>
                                            <Grid item xs>
                                                {peopleIdFormat || peopleIdLength === 9 ?
                                                    (
                                                        <TextField
                                                            id="txtPeopleId"
                                                            label={resources.lblPeopleId}
                                                            type="text"
                                                            value={generalSettings.peopleIdFormat}
                                                            placeholder={resources.lblPeopleIdMask}
                                                            onChange={this.onChangePeopleId}
                                                        />
                                                    ) :
                                                    (
                                                        <TextField
                                                            error={true}
                                                            id="txtPeopleId"
                                                            helperText={resources.lblPeopleIdError}
                                                            label={resources.lblPeopleId}
                                                            type="text"
                                                            value={generalSettings.peopleIdFormat}
                                                            placeholder={resources.lblPeopleIdMask}
                                                            onChange={this.onChangePeopleId}
                                                        />
                                                    )}
                                            </Grid>
                                            <Grid item xs>
                                                {governmentIdFormat || governmentIdLength === generalSettings.governmentIdMaxLength ?
                                                    (
                                                        <TextField
                                                            id="txtGovernmentId"
                                                            label={resources.lblGovernmentId}
                                                            type="text"
                                                            value={generalSettings.governmentIdFormat}
                                                            placeholder={resources.lblGovernmentIdMask}
                                                            onChange={this.onChangeGovernmentId}
                                                        />
                                                    ) :
                                                    (
                                                        <TextField
                                                            error={true}
                                                            id="txtGovernmentId"
                                                            helperText={Format.toString(resources.lblGovernmentIdError,
                                                                [generalSettings.governmentIdMaxLength])}
                                                            label={resources.lblGovernmentId}
                                                            type="text"
                                                            value={generalSettings.governmentIdFormat}
                                                            placeholder={resources.lblGovernmentIdMask}
                                                            onChange={this.onChangeGovernmentId}
                                                        />
                                                    )}
                                            </Grid>
                                            <Grid item xs>
                                                {generalSettings.credits ?
                                                    (
                                                        <TextField
                                                            id="txtCredits"
                                                            label={resources.lblCredits}
                                                            type="text"
                                                            value={generalSettings.credits}
                                                            placeholder={resources.lblCreditsMask}
                                                            onChange={this.onChangeCredits}
                                                        />
                                                    )
                                                    : (
                                                        <TextField
                                                            error={true}
                                                            helperText={resources.lblRequiredField}
                                                            id="txtCredits"
                                                            label={resources.lblCredits}
                                                            type="text"
                                                            value={generalSettings.credits}
                                                            placeholder={resources.lblCreditsMask}
                                                            onChange={this.onChangeCredits}
                                                        />
                                                    )}
                                            </Grid>
                                            <Grid item xs>
                                                {generalSettings.gpa ?
                                                    (
                                                        <TextField
                                                            id="txtGpa"
                                                            label={resources.lblGpa}
                                                            type="text"
                                                            value={generalSettings.gpa}
                                                            placeholder={resources.lblGpaMask}
                                                            onChange={this.onChangeGPA}
                                                        />
                                                    )
                                                    : (
                                                        <TextField
                                                            error={true}
                                                            helperText={resources.lblRequiredField}
                                                            id="txtGpa"
                                                            label={resources.lblGpa}
                                                            type="text"
                                                            value={generalSettings.gpa}
                                                            placeholder={resources.lblGpaMask}
                                                            onChange={this.onChangeGPA}
                                                        />
                                                    )}
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                {generalSettings.qualityPoints ?
                                                    (
                                                        <TextField
                                                            id="txtQualityPoints"
                                                            label={resources.lblQualityPoints}
                                                            type="text"
                                                            value={generalSettings.qualityPoints}
                                                            placeholder={resources.lblQualityPointsMask}
                                                            onChange={this.onChangeQualityPoints}
                                                        />
                                                    )
                                                    : (
                                                        <TextField
                                                            error={true}
                                                            helperText={resources.lblRequiredField}
                                                            id="txtqualityPoints"
                                                            label={resources.lblQualityPoints}
                                                            type="text"
                                                            value={generalSettings.qualityPoints}
                                                            placeholder={resources.lblQualityPointsMask}
                                                            onChange={this.onChangeQualityPoints}
                                                        />
                                                    )}
                                            </Grid>
                                        </Grid>
                                    ) :
                                        (
                                            <>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        {peopleIdFormat || peopleIdLength === 9 ?
                                                            (
                                                                <TextField
                                                                    id="txtPeopleId"
                                                                    label={resources.lblPeopleId}
                                                                    type="text"
                                                                    value={generalSettings.peopleIdFormat}
                                                                    placeholder={resources.lblPeopleIdMask}
                                                                    onChange={this.onChangePeopleId}
                                                                />
                                                            )
                                                            : (
                                                                <TextField
                                                                    error={true}
                                                                    id="txtPeopleId"
                                                                    helperText={resources.lblPeopleIdError}
                                                                    label={resources.lblPeopleId}
                                                                    type="text"
                                                                    value={generalSettings.peopleIdFormat}
                                                                    placeholder={resources.lblPeopleIdMask}
                                                                    onChange={this.onChangePeopleId}
                                                                />
                                                            )}
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        {governmentIdFormat || governmentIdLength === generalSettings.governmentIdMaxLength ?
                                                            (
                                                                <TextField
                                                                    id="txtGovernmentId"
                                                                    label={resources.lblGovernmentId}
                                                                    type="text"
                                                                    value={generalSettings.governmentIdFormat}
                                                                    placeholder={resources.lblGovernmentIdMask}
                                                                    onChange={this.onChangeGovernmentId}
                                                                />
                                                            )
                                                            : (
                                                                <TextField
                                                                    error={true}
                                                                    id="txtGovernmentId"
                                                                    helperText={Format.toString(resources.lblGovernmentIdError,
                                                                        [generalSettings.governmentIdMaxLength])}
                                                                    label={resources.lblGovernmentId}
                                                                    type="text"
                                                                    value={generalSettings.governmentIdFormat}
                                                                    placeholder={resources.lblGovernmentIdMask}
                                                                    onChange={this.onChangeGovernmentId}
                                                                />
                                                            )}
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        {generalSettings.credits ?
                                                            (
                                                                <TextField
                                                                    id="txtCredits"
                                                                    label={resources.lblCredits}
                                                                    type="text"
                                                                    value={generalSettings.credits}
                                                                    placeholder={resources.lblCreditsMask}
                                                                    onChange={this.onChangeCredits}
                                                                />
                                                            )
                                                            : (
                                                                <TextField
                                                                    error={true}
                                                                    helperText={resources.lblRequiredField}
                                                                    id="txtCredits"
                                                                    label={resources.lblCredits}
                                                                    type="text"
                                                                    value={generalSettings.credits}
                                                                    placeholder={resources.lblCreditsMask}
                                                                    onChange={this.onChangeCredits}
                                                                />
                                                            )}
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        {generalSettings.gpa ?
                                                            (
                                                                <TextField
                                                                    id="txtGpa"
                                                                    label={resources.lblGpa}
                                                                    type="text"
                                                                    value={generalSettings.gpa}
                                                                    placeholder={resources.lblGpaMask}
                                                                    onChange={this.onChangeGPA}
                                                                />
                                                            )
                                                            : (
                                                                <TextField
                                                                    error={true}
                                                                    helperText={resources.lblRequiredField}
                                                                    id="txtGpa"
                                                                    label={resources.lblGpa}
                                                                    type="text"
                                                                    value={generalSettings.gpa}
                                                                    placeholder={resources.lblGpaMask}
                                                                    onChange={this.onChangeGPA}
                                                                />
                                                            )}
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        {generalSettings.qualityPoints ?
                                                            (
                                                                <TextField
                                                                    id="txtQualityPoints"
                                                                    label={resources.lblQualityPoints}
                                                                    type="text"
                                                                    value={generalSettings.qualityPoints}
                                                                    placeholder={resources.lblQualityPointsMask}
                                                                    onChange={this.onChangeQualityPoints}
                                                                />
                                                            )
                                                            : (
                                                                <TextField
                                                                    error={true}
                                                                    helperText={resources.lblRequiredField}
                                                                    id="txtQualityPoints"
                                                                    label={resources.lblQualityPoints}
                                                                    type="text"
                                                                    value={generalSettings.qualityPoints}
                                                                    placeholder={resources.lblQualityPointsMask}
                                                                    onChange={this.onChangeQualityPoints}
                                                                />
                                                            )}
                                                    </Grid>
                                                </Grid>
                                            </>
                                        )
                                    }
                                </Media>
                                <br />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4} lg={2}>
                                <Text size="h2">
                                    {resources.lblLanguage}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Divider noMarginTop aria-hidden="true" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Dropdown
                                    id="ddlLanguage"
                                    label={resources.lblLanguage}
                                    options={languageList}
                                    value={languageSelected}
                                    emptyOption={emptyOption}
                                    onChange={this.onChangeLanguage}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4} lg={2}>
                                <Text size="h2">
                                    {resources.lblCurrency}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Divider noMarginTop aria-hidden="true" />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Dropdown
                                    id="ddlCultureCurrency"
                                    label={resources.lblCulture}
                                    options={cultureList}
                                    value={currencyCultureSelected}
                                    onChange={this.onChangeCultureCurrency}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Dropdown
                                    id="ddlSubCultureCurrency"
                                    label={resources.lblSubCulture}
                                    options={subCultureCurrencyList}
                                    value={currencySubCultureSelected}
                                    onChange={this.onChangeSubCultureCurrency}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Media query={Tokens.mqSmallDown}>
                                    {(matches: boolean): JSX.Element => matches ? (
                                        <Grid container spacing={3}>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtDecimalDigits"
                                                    label={resources.lblCurrencyDecimalDigits}
                                                    value={currencyFormat.decimalDigits}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtDecimalSeparator"
                                                    label={resources.lblCurrencyDeciamlSeparator}
                                                    value={currencyFormat.decimalSeparator}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtGroupSeparator"
                                                    label={resources.lblGroupSeparator}
                                                    value={currencyFormat.groupSeparator}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtSymbol"
                                                    label={resources.lblCurrencySymbol}
                                                    value={currencyFormat.symbol}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtSymbolDescription"
                                                    label={resources.lblSymbolDescription}
                                                    value={currencyFormat.symbolDescription}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtPositivePattern"
                                                    label={resources.lblPositivePattern}
                                                    value={currencyFormat.positivePattern}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    disabled={true}
                                                    id="txtNegativePattern"
                                                    label={resources.lblNegativePattern}
                                                    value={currencyFormat.negativePattern}
                                                />
                                            </Grid>
                                        </Grid>
                                    ) :
                                        (
                                            <>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtDecimalDigits"
                                                            label={resources.lblCurrencyDecimalDigits}
                                                            value={currencyFormat.decimalDigits}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtDecimalSeparator"
                                                            label={resources.lblCurrencyDeciamlSeparator}
                                                            value={currencyFormat.decimalSeparator}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtGroupSeparator"
                                                            label={resources.lblGroupSeparator}
                                                            value={currencyFormat.groupSeparator}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtSymbol"
                                                            label={resources.lblCurrencySymbol}
                                                            value={currencyFormat.symbol}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtSymbolDescription"
                                                            label={resources.lblSymbolDescription}
                                                            value={currencyFormat.symbolDescription}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtPositivePattern"
                                                            label={resources.lblPositivePattern}
                                                            value={currencyFormat.positivePattern}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtNegativePattern"
                                                            label={resources.lblNegativePattern}
                                                            value={currencyFormat.negativePattern}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        )
                                    }
                                </Media>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4} lg={2}>
                                <Text size="h2">
                                    {resources.lblDateTime}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Divider noMarginTop aria-hidden="true" />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Dropdown
                                    id="ddlCultureDateTime"
                                    label={resources.lblCulture}
                                    options={cultureList}
                                    value={dateTimeCultureSelected}
                                    onChange={this.onChangeCultureDateTime}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Dropdown
                                    id="ddlSubCultureDateTime"
                                    label={resources.lblSubCulture}
                                    options={subCultureDateTimeList}
                                    value={dateTimeSubCultureSelected}
                                    onChange={this.onChangeSubCultureDateTime}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Media query={Tokens.mqSmallDown}>
                                    {(matches: boolean): JSX.Element => matches ? (
                                        <Grid container spacing={3}>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtShortDateExample"
                                                    label={resources.lblDateTimeShortDateExample}
                                                    value={dateFormat.shortDateExample}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtLongDateExample"
                                                    label={resources.lblDateTimeLongDateExample}
                                                    value={dateFormat.longDateExample}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtFirstDayOfWeek"
                                                    label={resources.lblDateTimeFirstDayOfWeek}
                                                    value={dateFormat.firstDayOfWeek}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtShortTimeExample"
                                                    label={resources.lblDateTimeShortTimeExample}
                                                    value={dateFormat.shortTimeExample}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtLongTimeExample"
                                                    label={resources.lblDateTimeLongTimeExample}
                                                    value={dateFormat.longTimeExample}
                                                />
                                            </Grid>
                                        </Grid>
                                    ) :
                                        (
                                            <>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtShortDateExample"
                                                            label={resources.lblDateTimeShortDateExample}
                                                            value={dateFormat.shortDateExample}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtLongDateExample"
                                                            label={resources.lblDateTimeLongDateExample}
                                                            value={dateFormat.longDateExample}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtFirstDayOfWeek"
                                                            label={resources.lblDateTimeFirstDayOfWeek}
                                                            value={dateFormat.firstDayOfWeek}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtShortTimeExample"
                                                            label={resources.lblDateTimeShortTimeExample}
                                                            value={dateFormat.shortTimeExample}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtLongTimeExample"
                                                            label={resources.lblDateTimeLongTimeExample}
                                                            value={dateFormat.longTimeExample}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <br />
                                            </>
                                        )
                                    }
                                </Media>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4} lg={2}>
                                <Text size="h2">
                                    {resources.lblNumber}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Divider noMarginTop aria-hidden="true" />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Dropdown
                                    id="ddlCultureNumber"
                                    label={resources.lblCulture}
                                    options={cultureList}
                                    value={numberCultureSelected}
                                    onChange={this.onChangeCultureNumber}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Dropdown
                                    id="ddlSubCultureNumber"
                                    label={resources.lblSubCulture}
                                    options={subCultureNumberList}
                                    value={numberSubCultureSelected}
                                    onChange={this.onChangeSubCultureNumber}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Media query={Tokens.mqSmallDown}>
                                    {(matches: boolean): JSX.Element => matches ? (
                                        <Grid container spacing={3}>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtNumberDecimalDigits"
                                                    label={resources.lblNumberDecimalDigits}
                                                    value={numberFormat.numberDecimalDigits}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtNumberDecimalSeparator"
                                                    label={resources.lblNumberDecimalSeparator}
                                                    value={numberFormat.numberDecimalSeparator}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtNumberGroupSeparator"
                                                    label={resources.lblNumberGroupSeparator}
                                                    value={numberFormat.numberGroupSeparator}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtNumberDigitGrouping"
                                                    label={resources.lblNumberDigitGrouping}
                                                    value={numberFormat.digitGrouping}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtNumberNegativeSign"
                                                    label={resources.lblNumberNegativeSign}
                                                    value={numberFormat.negativeSign}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtNumberNegativeNumberFormat"
                                                    label={resources.lblNumberNegativeNumberFormat}
                                                    value={numberFormat.negativeNumberFormat}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtDisplayLeadingZeros"
                                                    label={resources.lblNumberDisplayLeadingZeros}
                                                    value={numberFormat.displayLeadingZeros}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <TextField
                                                    disabled={true}
                                                    id="txtListSeparator"
                                                    label={resources.lblNumberListSeparator}
                                                    value={numberFormat.listSeparator}
                                                />
                                            </Grid>
                                        </Grid>
                                    ) :
                                        (
                                            <>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtNumberDecimalDigits"
                                                            label={resources.lblNumberDecimalDigits}
                                                            value={numberFormat.numberDecimalDigits}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtNumberDecimalSeparator"
                                                            label={resources.lblNumberDecimalSeparator}
                                                            value={numberFormat.numberDecimalSeparator}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtNumberGroupSeparator"
                                                            label={resources.lblNumberGroupSeparator}
                                                            value={numberFormat.numberGroupSeparator}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtNumberDigitGrouping"
                                                            label={resources.lblNumberDigitGrouping}
                                                            value={numberFormat.digitGrouping}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtNumberNegativeSign"
                                                            label={resources.lblNumberNegativeSign}
                                                            value={numberFormat.negativeSign}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtNumberNegativeNumberFormat"
                                                            label={resources.lblNumberNegativeNumberFormat}
                                                            value={numberFormat.negativeNumberFormat}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtDisplayLeadingZeros"
                                                            label={resources.lblNumberDisplayLeadingZeros}
                                                            value={numberFormat.displayLeadingZeros}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                                        <TextField
                                                            disabled={true}
                                                            id="txtListSeparator"
                                                            label={resources.lblNumberListSeparator}
                                                            value={numberFormat.listSeparator}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <br />
                                            </>
                                        )
                                    }
                                </Media>
                            </Grid>
                        </Grid>
                        <br />
                        <br />
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Button
                                    id="btnSaveGlobalSettings"
                                    onClick={this.onSaveSettings}
                                >
                                    {resources.lblSaveButton}
                                </Button>
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
export default GlobalSettings;