/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: DemographicSettings.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { DemographicSettingsStatus, IDemographicSettings } from '../../../Types/InstitutionSettings/IDemographicSettings';
import { IDemographicSettingsResources } from '../../../Types/Resources/Administration/IDemographicSettingsResources';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/DemographicSettings';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IDemographicSettingsState {
    componentError: boolean;
    settings?: IDemographicSettings;
    isLoading: boolean;
    resources?: IDemographicSettingsResources;
}

const styles = ((theme: Theme) => createStyles({
    fontSize: {
        fontSize: 'small'
    },
    marginLeft: {
        [theme.breakpoints.down('md')]: {
            marginTop: `-${Tokens.spacing30}`
        },
        marginLeft: Tokens.sizingXSmall
    },
    marginTop: {
        [theme.breakpoints.down('md')]: {
            marginTop: `-${Tokens.spacing30}`
        }
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '30%'
            }
        }
    }
}));

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion Types

// #region Component
class DemographicSettings extends React.Component<PropsWithStyles, IDemographicSettingsState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IDemographicSettingsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'DemographicSettings';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IDemographicSettingsState {
        let resources: IDemographicSettingsResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = LayoutStore.getResourcesByKey(this.idPage);
        }
        return {
            componentError: false,
            isLoading: true,
            resources: resources
        };
    }

    // #region Events
    private onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                settings
            } = this.state;

            const checked: boolean = event.target.checked;
            let newChecked: boolean;

            if (event.target.id && settings) {
                switch (event.target.id) {
                    case 'chkAllowChange':
                        settings.allowChange = checked;
                        settings.requireApproval = false;
                        break;
                    case 'chkRequireAppoval':
                        settings.requireApproval = checked;
                        break;
                    case 'chkAllVisible':
                        newChecked = !(settings.isAllVisible || settings.isSomeVisible);
                        settings.isAllVisible = newChecked;
                        settings.isSomeVisible = newChecked;
                        settings.gender = this.getVisibleSettingStatus(newChecked, settings.gender);
                        settings.ethnicity = this.getVisibleSettingStatus(newChecked, settings.ethnicity);
                        settings.maritalStatus = this.getVisibleSettingStatus(newChecked, settings.maritalStatus);
                        settings.religion = this.getVisibleSettingStatus(newChecked, settings.religion);
                        settings.retirementStatus = this.getVisibleSettingStatus(newChecked, settings.retirementStatus);
                        settings.veteranStatus = this.getVisibleSettingStatus(newChecked, settings.veteranStatus);
                        settings.primaryCitizenship = this.getVisibleSettingStatus(newChecked, settings.primaryCitizenship);
                        settings.secondaryCitizenship = this.getVisibleSettingStatus(newChecked, settings.secondaryCitizenship);
                        settings.visa = this.getVisibleSettingStatus(newChecked, settings.visa);
                        settings.countryOfBirth = this.getVisibleSettingStatus(newChecked, settings.countryOfBirth);
                        settings.primaryLanguage = this.getVisibleSettingStatus(newChecked, settings.primaryLanguage);
                        settings.secondaryLanguage = this.getVisibleSettingStatus(newChecked, settings.secondaryLanguage);
                        settings.monthsInCountry = this.getVisibleSettingStatus(newChecked, settings.monthsInCountry);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkAllRequired':
                        newChecked = !(settings.isAllRequired || settings.isSomeRequired);
                        settings.isAllRequired = newChecked;
                        settings.isSomeRequired = newChecked;
                        settings.gender = this.getRequiredSettingStatus(newChecked, settings.gender);
                        settings.ethnicity = this.getRequiredSettingStatus(newChecked, settings.ethnicity);
                        settings.maritalStatus = this.getRequiredSettingStatus(newChecked, settings.maritalStatus);
                        settings.religion = this.getRequiredSettingStatus(newChecked, settings.religion);
                        settings.retirementStatus = this.getRequiredSettingStatus(newChecked, settings.retirementStatus);
                        settings.veteranStatus = this.getRequiredSettingStatus(newChecked, settings.veteranStatus);
                        settings.primaryCitizenship = this.getRequiredSettingStatus(newChecked, settings.primaryCitizenship);
                        settings.secondaryCitizenship = this.getRequiredSettingStatus(newChecked, settings.secondaryCitizenship);
                        settings.visa = this.getRequiredSettingStatus(newChecked, settings.visa);
                        settings.countryOfBirth = this.getRequiredSettingStatus(newChecked, settings.countryOfBirth);
                        settings.primaryLanguage = this.getRequiredSettingStatus(newChecked, settings.primaryLanguage);
                        settings.secondaryLanguage = this.getRequiredSettingStatus(newChecked, settings.secondaryLanguage);
                        settings.monthsInCountry = this.getRequiredSettingStatus(newChecked, settings.monthsInCountry);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        break;
                    case 'chkGenderVisible':
                        settings.gender = this.getVisibleSettingStatus(checked, settings.gender);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkGenderRequired':
                        settings.gender = this.getRequiredSettingStatus(checked, settings.gender);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkEthnicityVisible':
                        settings.ethnicity = this.getVisibleSettingStatus(checked, settings.ethnicity);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkEthnicityRequired':
                        settings.ethnicity = this.getRequiredSettingStatus(checked, settings.ethnicity);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkMaritalStatusVisible':
                        settings.maritalStatus = this.getVisibleSettingStatus(checked, settings.maritalStatus);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkMaritalStatusRequired':
                        settings.maritalStatus = this.getRequiredSettingStatus(checked, settings.maritalStatus);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkReligionVisible':
                        settings.religion = this.getVisibleSettingStatus(checked, settings.religion);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkReligionRequired':
                        settings.religion = this.getRequiredSettingStatus(checked, settings.religion);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkRetirementStatusVisible':
                        settings.retirementStatus = this.getVisibleSettingStatus(checked, settings.retirementStatus);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkRetirementStatusRequired':
                        settings.retirementStatus = this.getRequiredSettingStatus(checked, settings.retirementStatus);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkVeteranStatusVisible':
                        settings.veteranStatus = this.getVisibleSettingStatus(checked, settings.veteranStatus);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkVeteranStatusRequired':
                        settings.veteranStatus = this.getRequiredSettingStatus(checked, settings.veteranStatus);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkPrimaryCitizenshipVisible':
                        settings.primaryCitizenship = this.getVisibleSettingStatus(checked, settings.primaryCitizenship);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkPrimaryCitizenshipRequired':
                        settings.primaryCitizenship = this.getRequiredSettingStatus(checked, settings.primaryCitizenship);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkSecondaryCitizenshipVisible':
                        settings.secondaryCitizenship = this.getVisibleSettingStatus(checked, settings.secondaryCitizenship);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkSecondaryCitizenshipRequired':
                        settings.secondaryCitizenship = this.getRequiredSettingStatus(checked, settings.secondaryCitizenship);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkVisaVisible':
                        settings.visa = this.getVisibleSettingStatus(checked, settings.visa);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkVisaRequired':
                        settings.visa = this.getRequiredSettingStatus(checked, settings.visa);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkCountryofBirthVisible':
                        settings.countryOfBirth = this.getVisibleSettingStatus(checked, settings.countryOfBirth);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkCountryofBirthRequired':
                        settings.countryOfBirth = this.getRequiredSettingStatus(checked, settings.countryOfBirth);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkPrimaryLanguageVisible':
                        settings.primaryLanguage = this.getVisibleSettingStatus(checked, settings.primaryLanguage);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkPrimaryLanguageRequired':
                        settings.primaryLanguage = this.getRequiredSettingStatus(checked, settings.primaryLanguage);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkSecondaryLanguageVisible':
                        settings.secondaryLanguage = this.getVisibleSettingStatus(checked, settings.secondaryLanguage);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkSecondaryLanguageRequired':
                        settings.secondaryLanguage = this.getRequiredSettingStatus(checked, settings.secondaryLanguage);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkMonthsInCountryVisible':
                        settings.monthsInCountry = this.getVisibleSettingStatus(checked, settings.monthsInCountry);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkMonthsInCountryRequired':
                        settings.monthsInCountry = this.getRequiredSettingStatus(checked, settings.monthsInCountry);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                }
                this.setState({
                    settings: settings
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
                settings
            } = this.state;

            if (settings) {
                LayoutActions.setLoading(true);
                Requests.postSaveSettings(settings, this.resolvePostSaveSettings, this.logError);
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private getAllRequiredSettingStatus(settings: IDemographicSettings): boolean {
        return Boolean(settings.gender === DemographicSettingsStatus.Required
            && settings.ethnicity === DemographicSettingsStatus.Required
            && settings.maritalStatus === DemographicSettingsStatus.Required
            && settings.religion === DemographicSettingsStatus.Required
            && settings.retirementStatus === DemographicSettingsStatus.Required
            && settings.veteranStatus === DemographicSettingsStatus.Required
            && settings.primaryCitizenship === DemographicSettingsStatus.Required
            && settings.secondaryCitizenship === DemographicSettingsStatus.Required
            && settings.visa === DemographicSettingsStatus.Required
            && settings.countryOfBirth === DemographicSettingsStatus.Required
            && settings.primaryLanguage === DemographicSettingsStatus.Required
            && settings.secondaryLanguage === DemographicSettingsStatus.Required
            && settings.monthsInCountry === DemographicSettingsStatus.Required);
    }

    private getSomeRequiredSettingStatus(settings: IDemographicSettings): boolean {
        return Boolean(settings.gender === DemographicSettingsStatus.Required
            || settings.ethnicity === DemographicSettingsStatus.Required
            || settings.maritalStatus === DemographicSettingsStatus.Required
            || settings.religion === DemographicSettingsStatus.Required
            || settings.retirementStatus === DemographicSettingsStatus.Required
            || settings.veteranStatus === DemographicSettingsStatus.Required
            || settings.primaryCitizenship === DemographicSettingsStatus.Required
            || settings.secondaryCitizenship === DemographicSettingsStatus.Required
            || settings.visa === DemographicSettingsStatus.Required
            || settings.countryOfBirth === DemographicSettingsStatus.Required
            || settings.primaryLanguage === DemographicSettingsStatus.Required
            || settings.secondaryLanguage === DemographicSettingsStatus.Required
            || settings.monthsInCountry === DemographicSettingsStatus.Required);
    }

    private getRequiredSettingStatus(checked: boolean, currentStatus: DemographicSettingsStatus): DemographicSettingsStatus {
        if (checked) {
            return DemographicSettingsStatus.Required;
        }
        else {
            if (currentStatus === DemographicSettingsStatus.Required) {
                return DemographicSettingsStatus.Visible;
            }
            else {
                return currentStatus;
            }
        }
    }

    private getAllVisibleSettingStatus(settings: IDemographicSettings): boolean {
        return Boolean((settings.gender === DemographicSettingsStatus.Required
            || settings.gender === DemographicSettingsStatus.Visible)
            && (settings.ethnicity === DemographicSettingsStatus.Required
                || settings.ethnicity === DemographicSettingsStatus.Visible)
            && (settings.maritalStatus === DemographicSettingsStatus.Required
                || settings.maritalStatus === DemographicSettingsStatus.Visible)
            && (settings.religion === DemographicSettingsStatus.Required
                || settings.religion === DemographicSettingsStatus.Visible)
            && (settings.retirementStatus === DemographicSettingsStatus.Required
                || settings.retirementStatus === DemographicSettingsStatus.Visible)
            && (settings.veteranStatus === DemographicSettingsStatus.Required
                || settings.veteranStatus === DemographicSettingsStatus.Visible)
            && (settings.primaryCitizenship === DemographicSettingsStatus.Required
                || settings.primaryCitizenship === DemographicSettingsStatus.Visible)
            && (settings.secondaryCitizenship === DemographicSettingsStatus.Required
                || settings.secondaryCitizenship === DemographicSettingsStatus.Visible)
            && (settings.visa === DemographicSettingsStatus.Required
                || settings.visa === DemographicSettingsStatus.Visible)
            && (settings.countryOfBirth === DemographicSettingsStatus.Required
                || settings.countryOfBirth === DemographicSettingsStatus.Visible)
            && (settings.primaryLanguage === DemographicSettingsStatus.Required
                || settings.primaryLanguage === DemographicSettingsStatus.Visible)
            && (settings.secondaryLanguage === DemographicSettingsStatus.Required
                || settings.secondaryLanguage === DemographicSettingsStatus.Visible)
            && (settings.monthsInCountry === DemographicSettingsStatus.Required
                || settings.monthsInCountry === DemographicSettingsStatus.Visible));
    }

    private getSomeVisibleSettingStatus(settings: IDemographicSettings): boolean {
        return Boolean((settings.gender === DemographicSettingsStatus.Required
            || settings.gender === DemographicSettingsStatus.Visible)
            || (settings.ethnicity === DemographicSettingsStatus.Required
                || settings.ethnicity === DemographicSettingsStatus.Visible)
            || (settings.maritalStatus === DemographicSettingsStatus.Required
                || settings.maritalStatus === DemographicSettingsStatus.Visible)
            || (settings.religion === DemographicSettingsStatus.Required
                || settings.religion === DemographicSettingsStatus.Visible)
            || (settings.retirementStatus === DemographicSettingsStatus.Required
                || settings.retirementStatus === DemographicSettingsStatus.Visible)
            || (settings.veteranStatus === DemographicSettingsStatus.Required
                || settings.veteranStatus === DemographicSettingsStatus.Visible)
            || (settings.primaryCitizenship === DemographicSettingsStatus.Required
                || settings.primaryCitizenship === DemographicSettingsStatus.Visible)
            || (settings.secondaryCitizenship === DemographicSettingsStatus.Required
                || settings.secondaryCitizenship === DemographicSettingsStatus.Visible)
            || (settings.visa === DemographicSettingsStatus.Required
                || settings.visa === DemographicSettingsStatus.Visible)
            || (settings.countryOfBirth === DemographicSettingsStatus.Required
                || settings.countryOfBirth === DemographicSettingsStatus.Visible)
            || (settings.primaryLanguage === DemographicSettingsStatus.Required
                || settings.primaryLanguage === DemographicSettingsStatus.Visible)
            || (settings.secondaryLanguage === DemographicSettingsStatus.Required
                || settings.secondaryLanguage === DemographicSettingsStatus.Visible)
            || (settings.monthsInCountry === DemographicSettingsStatus.Required
                || settings.monthsInCountry === DemographicSettingsStatus.Visible));
    }

    private getVisibleSettingStatus(checked: boolean, currentStatus: DemographicSettingsStatus): DemographicSettingsStatus {
        if (checked) {
            if (currentStatus !== DemographicSettingsStatus.Required) {
                return DemographicSettingsStatus.Visible;
            }
            else {
                return currentStatus;
            }
        }
        else {
            return DemographicSettingsStatus.None;
        }
    }
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
                LayoutStore.setResourcesByKey(this.idPage, result.data);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSettings.name, this.hideAllLoaders);

            if (result?.status) {
                const settings: IDemographicSettings = result.data;
                if (settings) {
                    settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                    settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                    settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                    settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                }
                this.setState({
                    settings: settings
                }, this.hideAllLoaders);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

    private resolvePostSaveSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveSettings.name, this.hideAllLoaders);

            if (result?.status) {
                if (this.layoutResources) {
                    LayoutActions.setAlert({
                        message: this.layoutResources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                else {
                    LayoutActions.hidePageLoader();
                }
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
            if (!this.state.resources) {
                RequestsLayout.getResources(this.idModule, this.idPage,
                    this.resolveGetResources,
                    this.logError);
            }
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
            classes
        } = this.props;

        const {
            componentError,
            settings,
            isLoading,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError) {
            if (isLoading) {
                contentPage = (<ContainerLoader id="ldrDemographicSettings" height="md" />);
            }
            else if (resources && settings) {
                contentPage = (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Text size="large">
                                    {resources.lblDemographicLegend}
                                </Text>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Text size="h3">
                                    {resources.lblRequestHandling}
                                </Text>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Checkbox
                                    id="chkAllowChange"
                                    checked={settings.allowChange}
                                    label={resources.lblAllowChange}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Checkbox
                                    disabled={!settings.allowChange}
                                    id="chkRequireAppoval"
                                    checked={!settings.allowChange ? false : settings.requireApproval}
                                    label={resources.lblRequireAppoval}
                                    value="chkRequireAppoval"
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Text size="h3">
                                    {resources.lblFormSettings}
                                </Text>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Table
                                    breakpoint="sm"
                                    classes={{ root: classes.table }}
                                    id="tblDemographicSettings"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblField}
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    className={classes.fontSize}
                                                    checked={settings.isAllVisible || settings.isSomeVisible}
                                                    id="chkAllVisible"
                                                    indeterminate={!settings.isAllVisible && settings.isSomeVisible}
                                                    inputProps={{
                                                        'aria-labelledby': 'lblVisible'
                                                    }}
                                                    onChange={this.onCheckboxChange}
                                                />
                                                <span id="lblVisible">
                                                    {resources.lblVisible}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    className={classes.fontSize}
                                                    checked={settings.isAllRequired || settings.isSomeRequired}
                                                    id="chkAllRequired"
                                                    indeterminate={!settings.isAllRequired && settings.isSomeRequired}
                                                    inputProps={{
                                                        'aria-labelledby': 'lblRequired'
                                                    }}
                                                    onChange={this.onCheckboxChange}
                                                />
                                                <span id="lblRequired">
                                                    {resources.lblRequired}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <Hidden mdUp>
                                            <TableRow>
                                                <TableCell columnName={resources.lblAllVisible}>
                                                    <div className={classes.marginLeft}>
                                                        <Checkbox
                                                            className={classes.fontSize}
                                                            checked={settings.isAllVisible || settings.isSomeVisible}
                                                            id="chkAllVisible"
                                                            indeterminate={!settings.isAllVisible && settings.isSomeVisible}
                                                            inputProps={{
                                                                'aria-label': resources.lblAllVisible
                                                            }}
                                                            onChange={this.onCheckboxChange}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell columnName={resources.lblAllRequired}>
                                                    <div className={classes.marginLeft}>
                                                        <Checkbox
                                                            className={classes.fontSize}
                                                            checked={settings.isAllRequired || settings.isSomeRequired}
                                                            id="chkAllRequired"
                                                            indeterminate={!settings.isAllRequired && settings.isSomeRequired}
                                                            inputProps={{
                                                                'aria-label': resources.lblAllRequired
                                                            }}
                                                            onChange={this.onCheckboxChange}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </Hidden>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblGender}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.gender === DemographicSettingsStatus.Visible
                                                            || settings.gender === DemographicSettingsStatus.Required}
                                                        id="chkGenderVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblGender])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.gender === DemographicSettingsStatus.Required}
                                                        id="chkGenderRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblGender])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblEthnicity}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.ethnicity === DemographicSettingsStatus.Visible
                                                            || settings.ethnicity === DemographicSettingsStatus.Required}
                                                        id="chkEthnicityVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblEthnicity])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.ethnicity === DemographicSettingsStatus.Required}
                                                        id="chkEthnicityRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblEthnicity])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblMaritalStatus}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.maritalStatus === DemographicSettingsStatus.Visible
                                                            || settings.maritalStatus === DemographicSettingsStatus.Required}
                                                        id="chkMaritalStatusVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblMaritalStatus])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.maritalStatus === DemographicSettingsStatus.Required}
                                                        id="chkMaritalStatusRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblMaritalStatus])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblReligion}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.religion === DemographicSettingsStatus.Visible
                                                            || settings.religion === DemographicSettingsStatus.Required}
                                                        id="chkReligionVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblReligion])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.religion === DemographicSettingsStatus.Required}
                                                        id="chkReligionRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblReligion])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblRetirementStatus}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.retirementStatus === DemographicSettingsStatus.Visible
                                                            || settings.retirementStatus === DemographicSettingsStatus.Required}
                                                        id="chkRetirementStatusVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblRetirementStatus])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.retirementStatus === DemographicSettingsStatus.Required}
                                                        id="chkRetirementStatusRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblRetirementStatus])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblVeteranStatus}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.veteranStatus === DemographicSettingsStatus.Visible
                                                            || settings.veteranStatus === DemographicSettingsStatus.Required}
                                                        id="chkVeteranStatusVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblVeteranStatus])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.veteranStatus === DemographicSettingsStatus.Required}
                                                        id="chkVeteranStatusRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblVeteranStatus])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblPrimaryCitizenship}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.primaryCitizenship === DemographicSettingsStatus.Visible
                                                            || settings.primaryCitizenship === DemographicSettingsStatus.Required}
                                                        id="chkPrimaryCitizenshipVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblPrimaryCitizenship])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.primaryCitizenship === DemographicSettingsStatus.Required}
                                                        id="chkPrimaryCitizenshipRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblPrimaryCitizenship])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblSecondaryCitizenship}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.secondaryCitizenship === DemographicSettingsStatus.Visible
                                                            || settings.secondaryCitizenship === DemographicSettingsStatus.Required}
                                                        id="chkSecondaryCitizenshipVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblSecondaryCitizenship])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.secondaryCitizenship === DemographicSettingsStatus.Required}
                                                        id="chkSecondaryCitizenshipRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblSecondaryCitizenship])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblVisa}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.visa === DemographicSettingsStatus.Visible
                                                            || settings.visa === DemographicSettingsStatus.Required}
                                                        id="chkVisaVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblVisa])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.visa === DemographicSettingsStatus.Required}
                                                        id="chkVisaRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblVisa])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblCountryofBirth}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.countryOfBirth === DemographicSettingsStatus.Visible
                                                            || settings.countryOfBirth === DemographicSettingsStatus.Required}
                                                        id="chkCountryofBirthVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblCountryofBirth])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.countryOfBirth === DemographicSettingsStatus.Required}
                                                        id="chkCountryofBirthRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblCountryofBirth])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblPrimaryLanguage}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.primaryLanguage === DemographicSettingsStatus.Visible
                                                            || settings.primaryLanguage === DemographicSettingsStatus.Required}
                                                        id="chkPrimaryLanguageVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblPrimaryLanguage])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.primaryLanguage === DemographicSettingsStatus.Required}
                                                        id="chkPrimaryLanguageRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblPrimaryLanguage])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblSecondaryLanguage}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.secondaryLanguage === DemographicSettingsStatus.Visible
                                                            || settings.secondaryLanguage === DemographicSettingsStatus.Required}
                                                        id="chkSecondaryLanguageVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblSecondaryLanguage])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.secondaryLanguage === DemographicSettingsStatus.Required}
                                                        id="chkSecondaryLanguageRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblSecondaryLanguage])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblMonthsInCountry}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.monthsInCountry === DemographicSettingsStatus.Visible
                                                            || settings.monthsInCountry === DemographicSettingsStatus.Required}
                                                        id="chkMonthsInCountryVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblMonthsInCountry])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.monthsInCountry === DemographicSettingsStatus.Required}
                                                        id="chkMonthsInCountryRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblMonthsInCountry])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Button
                                    id="btnSaveSettings"
                                    onClick={this.onSaveSettings}
                                >
                                    {resources.lblSave}
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
export default withStyles(styles)(DemographicSettings);