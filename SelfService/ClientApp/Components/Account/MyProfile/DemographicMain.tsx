/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: DemographicMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IDemographicMain } from '../../../Types/Account/IDemographicMain';
import { IDemographicOptions } from '../../../Types/Account/IDemographicOptions';
import { IDemographicSave } from '../../../Types/Account/IDemographicSave';
import { RetirementStatus } from '../../../Types/Account/RetirementStatus';
import { IDemographicMainResources } from '../../../Types/Resources/Account/IDemographicMainResources';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Internal components
import DemographicEditModal from './DemographicEditModal';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Account/DemographicMain';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';

// #endregion Imports

// #region Types
interface IDemographicMainState {
    demographicFormId: number;
    demographicInfo?: IDemographicMain;
    demographicInfoCancel?: IDemographicMain;
    demographicOptions?: IDemographicOptions;
    demographicSave: IDemographicSave;
    hadPending?: boolean;
    hasPending: boolean;
    isEditModal: boolean;
    isLoading: boolean;
    resources?: IDemographicMainResources;
}

const styles = createStyles({
    cardContainerTop: {
        marginTop: Tokens.spacing40
    },
    iconHeader: {
        display: 'inline',
        marginLeft: Tokens.spacing30
    },
    inline: {
        display: 'inline'
    },
    marginLeft: {
        marginLeft: Tokens.sizingLarge
    }
});

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion Types

// #region Constants
const ProfileDemographicRequestSubmitted: number = 2;
const RetiredUnknownValue: number = 2;
const EmptyOptionValue: string = 'null';
const GenderUnknownValue: number = 3;
// #endregion Constants

// #region Component
class DemographicMain extends React.Component<PropsWithStyles, IDemographicMainState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IDemographicMainState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Account';
        this.idPage = 'DemographicMain';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IDemographicMainState {
        let resources: IDemographicMainResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            demographicFormId: 0,
            demographicInfo: undefined,
            demographicSave: {},
            hadPending: undefined,
            hasPending: false,
            isEditModal: false,
            isLoading: true,
            resources: resources
        };
    }

    // #region Events
    private onCancelUpdate = (): void => {
        try {
            const {
                demographicFormId
            } = this.state;

            LayoutActions.showPageLoader();
            Requests.postDeleteDemographicInformation(demographicFormId, this.resolvePostDeleteDemographics);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelUpdate.name, e));
        }
    };

    private onCloseModal = (): void => {
        try {
            const {
                demographicInfo
            } = this.state;
            if (demographicInfo) {
                demographicInfo.editedDemographicViewModelList = structuredClone(demographicInfo?.demographicViewModelList);
            }
            this.setState({
                demographicInfo,
                isEditModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseModal.name, e));
        }
    };

    private onDropdownChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                demographicInfo,
                demographicSave
            } = this.state;
            const index: string[] = id.split('_');
            if (optionSelected && demographicInfo && demographicSave) {
                const optionsSelected: IDemographicMain = demographicInfo;
                optionsSelected.editedDemographicViewModelList[index[1]].description = optionSelected.description;
                optionsSelected.editedDemographicViewModelList[index[1]].value = Number(optionSelected.value);
                const optionsSave: IDemographicSave = demographicSave;
                switch (index[0]) {
                    case 'ddlGender':
                        optionsSave.genderId = isNaN(Number(optionSelected.value)) ? GenderUnknownValue : Number(optionSelected.value);
                        break;

                    case 'ddlEtnicithy':
                        optionsSave.ethnicityDesc = optionSelected.description;
                        optionsSave.ethnicityId = Number(optionSelected.value);
                        break;

                    case 'ddlMaritalStatus':
                        optionsSave.maritalStatusDesc = optionSelected.description;
                        optionsSave.maritalStatusId = Number(optionSelected.value);
                        break;

                    case 'ddlReligion':
                        optionsSave.religionDesc = optionSelected.description;
                        optionsSave.religionId = Number(optionSelected.value);
                        break;

                    case 'ddlRetirementStatus':
                        optionsSave.isRetired = optionSelected.value === EmptyOptionValue || optionSelected.value === RetiredUnknownValue
                            ? undefined
                            : Boolean(optionSelected.value);
                        break;

                    case 'ddlVeteran':
                        optionsSave.veteranDesc = optionSelected.description;
                        optionsSave.veteranId = Number(optionSelected.value);
                        break;

                    case 'ddlPrimaryCitizenship':
                        optionsSave.citizenshipDesc = optionSelected.description;
                        optionsSave.citizenshipId = Number(optionSelected.value);
                        break;

                    case 'ddlSecondaryCitizenship':
                        optionsSave.secondaryCitizenshipDesc = optionSelected.description;
                        optionsSave.secondaryCitizenshipId = Number(optionSelected.value);
                        break;

                    case 'ddlVisa':
                        optionsSave.visaDesc = optionSelected.description;
                        optionsSave.visaId = Number(optionSelected.value);
                        break;

                    case 'ddlCountryOfBirth':
                        optionsSave.countryOfBirthDesc = optionSelected.description;
                        optionsSave.countryOfBirthId = Number(optionSelected.value);
                        break;

                    case 'ddlPrimaryLanguage':
                        optionsSave.language = optionSelected.description;
                        optionsSave.languageId = Number(optionSelected.value);
                        break;

                    case 'ddlSecondaryLanguage':
                        optionsSave.secondaryLanguageDesc = optionSelected.description;
                        optionsSave.secondaryLanguageId = Number(optionSelected.value);
                        break;
                }

                this.setState({
                    demographicInfo: optionsSelected,
                    demographicSave: optionsSave
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onEditDemographicInformation = (): void => {
        try {
            this.setState({
                isEditModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditDemographicInformation.name, e));
        }
    };

    private onSave = (): void => {
        try {
            const {
                demographicInfo,
                demographicSave
            } = this.state;

            let isValid: boolean = true;
            if (demographicInfo) {
                demographicInfo.editedDemographicViewModelList.forEach(item => {
                    if (item.isRequired && (item.value === -1 || item.value === null || isNaN(item.value) || item.description.trim() === '')) {
                        isValid = false;
                        item.firstLoad = false;
                    }
                });
            }
            if (isValid) {
                LayoutActions.showPageLoader();
                Requests.postSaveDemographicInformation(demographicSave, this.resolvePostSaveDemographics);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSave.name, e));
        }
    };

    private onTextFieldChange = (event: any): void => {
        try {
            const {
                demographicInfo,
                demographicSave
            } = this.state;
            const id: string[] = event.target.id.split('_');
            if (demographicInfo && demographicSave) {
                if (event.target.value.match(/^\d*$/g) && event.target.value <= 9999) {
                    demographicInfo.editedDemographicViewModelList[id[1]].description = event.target.value;
                    demographicInfo.editedDemographicViewModelList[id[1]].value = Number(event.target.value);
                    demographicSave.monthsInCountry = Number(event.target.value);
                    this.setState({
                        demographicInfo: demographicInfo,
                        demographicSave: demographicSave
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTextFieldChange.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
    };
    // #endregion Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
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
                }, () => {
                    Requests.getDemographicInfo(this.resolveGetDemographicInfo);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetDemographicInfo = (json: string): void => {
        try {
            const {
                demographicSave
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDemographicInfo.name, this.hideAllLoaders);

            if (result?.status) {
                const demographic: IDemographicMain = result.data;
                demographic.demographicViewModelList.forEach(item => {
                    item.firstLoad = true;
                    switch (item.id) {
                        case 'gender':
                            demographicSave.genderId = item.value;
                            break;
                        case 'ethnicity':
                            demographicSave.ethnicityDesc = item.description;
                            demographicSave.ethnicityId = item.value;
                            break;
                        case 'maritalStatus':
                            demographicSave.maritalStatusDesc = item.description;
                            demographicSave.maritalStatusId = item.value;
                            break;
                        case 'religion':
                            demographicSave.religionDesc = item.description;
                            demographicSave.religionId = item.value;
                            break;
                        case 'retirementStatus':
                            demographicSave.isRetired = item.value === RetiredUnknownValue ? undefined : Boolean(item.value);
                            break;
                        case 'veteran':
                            demographicSave.veteranDesc = item.description;
                            demographicSave.veteranId = item.value;
                            break;
                        case 'primaryCitizenship':
                            demographicSave.citizenshipDesc = item.description;
                            demographicSave.citizenshipId = item.value;
                            break;
                        case 'secondaryCitizenship':
                            demographicSave.secondaryCitizenshipDesc = item.description;
                            demographicSave.secondaryCitizenshipId = item.value;
                            break;
                        case 'visa':
                            demographicSave.visaDesc = item.description;
                            demographicSave.visaId = item.value;
                            break;
                        case 'countryOfBirth':
                            demographicSave.countryOfBirthDesc = item.description;
                            demographicSave.countryOfBirthId = item.value;
                            break;
                        case 'primaryLanguage':
                            demographicSave.language = item.description;
                            demographicSave.languageId = item.value;
                            break;
                        case 'secondaryLanguage':
                            demographicSave.secondaryLanguageDesc = item.description;
                            demographicSave.secondaryLanguageId = item.value;
                            break;
                        case 'monthsInCountry':
                            demographicSave.monthsInCountry = Number(item.description);
                            item.value = Number(item.description);
                            break;
                    }
                });
                if (this.state.hadPending !== undefined && !this.state.hadPending && result.data.hasPending) {
                    Requests.postSendNotification(ProfileDemographicRequestSubmitted, this.resolvePostSendNotification);
                }
                demographic.editedDemographicViewModelList = structuredClone(demographic.demographicViewModelList);
                this.setState({
                    demographicFormId: result.data.demographicFormId,
                    demographicInfo: result.data,
                    demographicInfoCancel: result.data,
                    demographicSave: demographicSave,
                    hadPending: result.data.hasPending,
                    hasPending: result.data.hasPending
                });
                Requests.getDemographicOptions(this.resolveGetDemographicOptions);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDemographicInfo.name, e));
        }
    };

    private resolveGetDemographicOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDemographicOptions.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    demographicOptions: result.data
                }, () => {
                    this.hideAllLoaders();
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDemographicOptions.name, e));
        }
    };

    private resolvePostDeleteDemographics = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDeleteDemographics.name, this.hideAllLoaders);

            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                Requests.getDemographicInfo(this.resolveGetDemographicInfo);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostDeleteDemographics.name, e));
        }
    };

    private resolvePostSaveDemographics = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveDemographics.name, this.hideAllLoaders);

            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                Requests.getDemographicInfo(this.resolveGetDemographicInfo);
                this.setState({
                    demographicSave: {},
                    isEditModal: false
                }, () => {
                    LayoutActions.hidePageLoader();
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveDemographics.name, e));
        }
    };

    private resolvePostSendNotification = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSendNotification.name, this.hideAllLoaders);

            if (result?.status) {
                LogData.fromMessage(this.resolvePostSendNotification.name, '');
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSendNotification.name, e));
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
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            hasPending,
            demographicInfo,
            demographicOptions,
            isEditModal,
            isLoading,

            resources
        } = this.state;

        const {
            classes
        } = this.props;

        let contentPage: JSX.Element | undefined;
        let editDemographicSettingsModal: JSX.Element | undefined;
        let isUpdated: boolean = false;
        if (isLoading) {
            contentPage = (<ContainerLoader id="ldrAddressesMain" height="md" />);
        }
        else if (resources) {
            if (demographicInfo && demographicInfo.demographicViewModelList.length > 0) {
                let label: string;
                let pendingDescription: string;
                let description: string;
                const contentBlockOne: JSX.Element[] | undefined = [];
                const contentBlockTwo: JSX.Element[] | undefined = [];
                const contentBlockThree: JSX.Element[] | undefined = [];
                demographicInfo.demographicViewModelList.forEach((info, i) => {
                    label = '';
                    description = info.description;
                    pendingDescription = info.pendingDescription;
                    if (description !== pendingDescription) {
                        info.isDifferent = true;
                        isUpdated = true;
                    }
                    else {
                        isUpdated = false;
                    }
                    // Cases based on ids defined in ViewModal
                    switch (info.id) {
                        case 'gender':
                            label = resources.lblGender;
                            description = info.description;
                            pendingDescription = info.pendingDescription;
                            break;
                        case 'ethnicity':
                            label = resources.lblEthnicity;
                            break;
                        case 'maritalStatus':
                            label = resources.lblMaritalStatus;
                            break;
                        case 'religion':
                            label = resources.lblReligion;
                            break;
                        case 'retirementStatus':
                            label = resources.lblRetired;
                            switch (info.description) {
                                case RetirementStatus.no:
                                    description = resources.lblNo;
                                    pendingDescription = hasPending ? resources.lblNo : '';
                                    break;
                                case RetirementStatus.yes:
                                    description = resources.lblYes;
                                    pendingDescription = hasPending ? resources.lblYes : '';
                                    break;
                                case RetirementStatus.unknown:
                                    description = resources.lblUnknown;
                                    pendingDescription = hasPending ? resources.lblUnknown : '';
                                    break;
                            }
                            if (info.isDifferent) {
                                switch (info.pendingDescription) {
                                    case RetirementStatus.no:
                                        pendingDescription = resources.lblNo;
                                        break;
                                    case RetirementStatus.yes:
                                        pendingDescription = resources.lblYes;
                                        break;
                                    case RetirementStatus.unknown:
                                        pendingDescription = resources.lblUnknown;
                                        break;
                                }
                            }
                            break;
                        case 'veteran':
                            label = resources.lblVeteran;
                            break;
                        case 'primaryCitizenship':
                            label = resources.lblPrimaryCitizenship;
                            break;
                        case 'secondaryCitizenship':
                            label = resources.lblSecondaryCitizenship;
                            break;
                        case 'visa':
                            label = resources.lblVisa;
                            break;
                        case 'countryOfBirth':
                            label = resources.lblCountryOfBirth;
                            break;
                        case 'primaryLanguage':
                            label = resources.lblLanguage;
                            break;
                        case 'secondaryLanguage':
                            label = resources.lblSecondaryLanguage;
                            break;
                        case 'monthsInCountry':
                            label = resources.lblMonthsInCountry;
                            break;
                    }
                    if (i <= 4) {
                        contentBlockOne.push(
                            <>
                                <Hidden smDown>
                                    <Grid container id={`demographicInformationBlkOne_${i}`}>
                                        <Grid item md={4}>
                                            <Text weight="strong">
                                                {label}
                                            </Text>
                                        </Grid>
                                        <Grid item md={4}>
                                            <Text>
                                                {hasPending ? pendingDescription : description}
                                            </Text>
                                        </Grid>
                                        <Grid item md={2}>
                                            {isUpdated && hasPending ? (
                                                <StatusLabel
                                                    id={`stsUpdatedRow_${i}`}
                                                    text={resources.lblUpdatedPending}
                                                    type="pending"
                                                />
                                            ) : undefined}
                                        </Grid>
                                    </Grid>
                                </Hidden>
                                <Hidden mdUp>
                                    <Grid container id={`demographicInformation_${i}`}>
                                        <Grid item xs={6}>
                                            <Text weight="strong">
                                                {label}
                                            </Text>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Text>
                                                {hasPending ? pendingDescription : description}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Text />
                                        </Grid>
                                        <Grid item xs={6}>
                                            {isUpdated && hasPending ? (
                                                <StatusLabel
                                                    id={`stsUpdatedRow_${i}`}
                                                    text={resources.lblUpdatedPending}
                                                    type="pending"
                                                />
                                            ) : undefined}
                                        </Grid>
                                    </Grid>
                                </Hidden>
                            </>
                        );
                    }
                    if (i >= 5 && i < 10) {
                        contentBlockTwo.push(
                            <>
                                <Hidden smDown>
                                    <Grid container id={`demographicInformationBlkTwo_${i}`}>
                                        <Grid item xs={6} md={4}>
                                            <Text weight="strong">
                                                {label}
                                            </Text>
                                        </Grid>
                                        <Grid item xs={6} md={4}>
                                            <Text>
                                                {hasPending ? pendingDescription : description}
                                            </Text>
                                        </Grid>
                                        <Grid item xs={6} md={2}>
                                            {isUpdated && hasPending ? (
                                                <StatusLabel
                                                    id={`stsUpdatedRow_${i}`}
                                                    text={resources.lblUpdatedPending}
                                                    type="pending"
                                                />
                                            ) : undefined}
                                        </Grid>
                                    </Grid>
                                </Hidden>
                                <Hidden mdUp>
                                    <Grid container id={`demographicInformation_${i}`}>
                                        <Grid item xs={6}>
                                            <Text weight="strong">
                                                {label}
                                            </Text>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Text>
                                                {hasPending ? pendingDescription : description}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Text />
                                        </Grid>
                                        <Grid item xs={6}>
                                            {isUpdated && hasPending ? (
                                                <StatusLabel
                                                    id={`stsUpdatedRow_${i}`}
                                                    text={resources.lblUpdatedPending}
                                                    type="pending"
                                                />
                                            ) : undefined}
                                        </Grid>
                                    </Grid>
                                </Hidden>
                            </>
                        );
                    }
                    if (i >= 10) {
                        contentBlockThree.push(
                            <>
                                <Hidden smDown>
                                    <Grid container id={`demographicInformationBlkThree_${i}`}>
                                        <Grid item xs={6} md={4}>
                                            <Text weight="strong">
                                                {label}
                                            </Text>
                                        </Grid>
                                        <Grid item xs={6} md={4}>
                                            <Text>
                                                {hasPending ? pendingDescription : description}
                                            </Text>
                                        </Grid>
                                        <Grid item xs={6} md={2}>
                                            {isUpdated && hasPending ? (
                                                <StatusLabel
                                                    id={`stsUpdatedRow_${i}`}
                                                    text={resources.lblUpdatedPending}
                                                    type="pending"
                                                />
                                            ) : undefined}
                                        </Grid>
                                    </Grid>
                                </Hidden>
                                <Hidden mdUp>
                                    <Grid container id={`demographicInformation_${i}`}>
                                        <Grid item xs={6}>
                                            <Text weight="strong">
                                                {label}
                                            </Text>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Text>
                                                {hasPending ? pendingDescription : description}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Text />
                                        </Grid>
                                        <Grid item xs={6}>
                                            {isUpdated && hasPending ? (
                                                <StatusLabel
                                                    id={`stsUpdatedRow_${i}`}
                                                    text={resources.lblUpdatedPending}
                                                    type="pending"
                                                />
                                            ) : undefined}
                                        </Grid>
                                    </Grid>
                                </Hidden>
                            </>
                        );
                    }

                });

                const contentTable: JSX.Element = (
                    <>
                        <Hidden smDown>
                            <Grid container>
                                <Grid item md={4}>
                                    {contentBlockOne}
                                </Grid>
                                <Grid item md={4}>
                                    {contentBlockTwo}
                                </Grid>
                                <Grid item md={4}>
                                    {contentBlockThree}
                                </Grid>
                            </Grid>
                        </Hidden>
                        <Hidden mdUp>
                            <Grid container>
                                <Grid item xs={12}>
                                    {contentBlockOne}
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    {contentBlockTwo}
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    {contentBlockThree}
                                </Grid>
                            </Grid>
                        </Hidden>
                    </>
                );

                if (isEditModal) {
                    editDemographicSettingsModal = (
                        <DemographicEditModal
                            demographicOptions={demographicOptions}
                            demographicOptionsValues={demographicInfo}
                            open={isEditModal}
                            onClose={this.onCloseModal}
                            onDropdownChange={this.onDropdownChange}
                            onSave={this.onSave}
                            onTextFieldChange={this.onTextFieldChange}
                            resources={resources}
                        />
                    );
                }

                contentPage = (
                    <>
                        <Grid container spacing={3} className={classes.cardContainerTop}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs>
                                                <Text size="h2">
                                                    {resources.lblDemographicInformation}
                                                </Text>
                                            </Grid>
                                            {!hasPending ?
                                                (
                                                    <Grid item>
                                                        <Tooltip
                                                            id="tltEdit"
                                                            title={resources.lblEdit}
                                                            placement="top"
                                                        >
                                                            <div className={classes.inline}>
                                                                <IconButton
                                                                    aria-label={resources.lblEdit}
                                                                    classes={{ root: classes.iconHeader }}
                                                                    color="secondary"
                                                                    disabled={!demographicInfo.allowChange}
                                                                    onClick={this.onEditDemographicInformation}
                                                                    id="btnEdit"
                                                                >
                                                                    <Icon large name="edit" />
                                                                </IconButton>
                                                            </div>
                                                        </Tooltip>
                                                    </Grid>
                                                ) : undefined}
                                        </Grid>
                                        <br />
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                {contentTable}
                                            </Grid>
                                        </Grid>
                                        <br />
                                        {hasPending ? (
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <Button
                                                        className={classes.cardContainerTop}
                                                        id="btnCancelUpdate"
                                                        onClick={this.onCancelUpdate}
                                                    >
                                                        {resources.lblCancelUpdate}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        ) : undefined}
                                        <br />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        {editDemographicSettingsModal}
                    </>
                );
            }
            else {
                contentPage = (
                    <MessageStyled
                        classMessage="noResults"
                        message={resources.lblNoResults}
                    />
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
export default withStyles(styles)(DemographicMain);