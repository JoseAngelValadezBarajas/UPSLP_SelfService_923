/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: PreferredNameMain.tsx
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
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IPreferredName } from '../../../Types/Account/IPreferredName';
import { IPreferredNameOptions } from '../../../Types/Account/IPreferredNameOptions';
import { IPreferredNameSave } from '../../../Types/Account/IPreferredNameSave';
import { IPreferredNameMainResources } from '../../../Types/Resources/Account/IPreferredNameMainResources';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Internal componentes
import PreferredNameEditModal from './PreferredNameEditModal';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Account/PreferredNameMain';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IPreferredNameMainState {
    isEditModal: boolean;
    isLoading: boolean;
    preferredNameInfo?: IPreferredName;
    preferredNameOptions?: IPreferredNameOptions;
    preferredNameSave: IPreferredNameSave;
    resources?: IPreferredNameMainResources;
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

// #region Component
class PreferredNameMain extends React.Component<PropsWithStyles, IPreferredNameMainState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IPreferredNameMainState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Account';
        this.idPage = 'PreferredNameMain';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IPreferredNameMainState {
        let resources: IPreferredNameMainResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            isEditModal: false,
            isLoading: true,
            preferredNameInfo: undefined,
            preferredNameSave: {},

            resources: resources
        };
    }

    // #region Events
    private onClose = (): void => {
        try {
            this.setState({
                isEditModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClose.name, e));
        }
    };

    private onCancelUpdate = (): void => {
        try {
            const {
                preferredNameInfo
            } = this.state;

            if (preferredNameInfo) {
                LayoutActions.setLoading(true);
                Requests.postCancelRequest(preferredNameInfo.genderIdentity.requestId, this.resolvePostCancelUpdated);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelUpdate.name, e));
        }
    };

    private onEditPreferredName = (): void => {
        try {
            LayoutActions.setLoading(true);
            Requests.getOptions(this.resolveGetOptions);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditPreferredName.name, e));
        }
    };

    private onDropDownChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                preferredNameInfo
            } = this.state;

            if (optionSelected && preferredNameInfo) {
                const optionsSelected: IPreferredName = preferredNameInfo;
                if (id === 'ddlGenderIdentity') {
                    optionsSelected.genderIdentity.description = optionSelected.description;
                    optionsSelected.genderIdentity.id = Number(optionSelected.value);
                }
                else {
                    optionsSelected.genderIdentity.pronounDesc = optionSelected.description;
                    optionsSelected.genderIdentity.pronounId = Number(optionSelected.value);
                }

                this.setState({
                    preferredNameInfo: optionsSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropDownChange.name, e));
        }
    };

    private onTextFieldChange = (event: any): void => {
        try {
            const {
                preferredNameInfo
            } = this.state;

            if (preferredNameInfo) {
                preferredNameInfo.genderIdentity.displayName = event.target.value;
                this.setState({
                    preferredNameInfo: preferredNameInfo
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTextFieldChange.name, e));
        }
    };

    private onSave = (): void => {
        try {
            const {
                preferredNameInfo,
                preferredNameSave
            } = this.state;

            if (preferredNameInfo && preferredNameInfo.genderIdentity.displayName) {
                LayoutActions.setLoading(true);
                preferredNameSave.displayName = preferredNameInfo.genderIdentity.displayName;
                preferredNameSave.genderIdentityId = preferredNameInfo.genderIdentity.id;
                preferredNameSave.pronounId = preferredNameInfo.genderIdentity.pronounId;
                Requests.postSavePreferredName(preferredNameSave, this.resolvePostSavePreferredName);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSave.name, e));
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
                }, () => Requests.getNameInfo(this.resolveGetNameInfo));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetNameInfo = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetNameInfo.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    preferredNameInfo: result.data
                }, () => this.hideAllLoaders());
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetNameInfo.name, e));
        }
    };

    private resolveGetOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetOptions.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    preferredNameOptions: result.data
                }, () => {
                    this.setState({
                        isEditModal: true
                    }, () => {
                        LayoutActions.hidePageLoader();
                    });
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetOptions.name, e));
        }
    };

    private resolvePostCancelUpdated = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostCancelUpdated.name, this.hideAllLoaders);

            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                Requests.getNameInfo(this.resolveGetNameInfo);
            }
        }
        catch (e) {
            this.logError(LogData.badJsonResult(this.resolvePostCancelUpdated.name));
        }
    };

    private resolvePostSavePreferredName = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSavePreferredName.name, this.hideAllLoaders);

            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                this.setState({
                    isEditModal: false,
                    preferredNameSave: {}
                }, () => {
                    LayoutActions.hidePageLoader();
                });
                Requests.postSendNotification(2, this.resolvePostSendNotification);
                Requests.getNameInfo(this.resolveGetNameInfo);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSavePreferredName.name, e));
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
            isEditModal,
            isLoading,
            preferredNameInfo,
            preferredNameOptions,

            resources
        } = this.state;

        const {
            classes
        } = this.props;

        let contentPage: JSX.Element | undefined;
        let editModalPage: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (<ContainerLoader id="ldrAddressesMain" height="md" />);
        }
        else if (resources) {
            if (isEditModal) {
                editModalPage = (
                    <PreferredNameEditModal
                        key="preferredNameEditModal"
                        open={isEditModal}
                        preferredNameOptions={preferredNameOptions}
                        preferredOptionsValues={preferredNameInfo}
                        onClose={this.onClose}
                        onDropdownChange={this.onDropDownChange}
                        onSave={this.onSave}
                        onTextFieldChange={this.onTextFieldChange}
                        resources={resources}
                    />
                );
            }
            if (preferredNameInfo) {
                contentPage = (
                    <>
                        <Grid container spacing={3} className={classes.cardContainerTop}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs>
                                                <Text size="h2">
                                                    {resources.lblPreferredName}
                                                </Text>
                                            </Grid>
                                            {!preferredNameInfo.settings.genderIdentity && !preferredNameInfo.settings.preferredName
                                                && !preferredNameInfo.settings.pronoun ?
                                                undefined
                                                : !preferredNameInfo.genderIdentity.requestId ? (
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
                                                                    disabled={!preferredNameInfo.settings.allowChange}
                                                                    onClick={this.onEditPreferredName}
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
                                        {!preferredNameInfo.settings.genderIdentity && !preferredNameInfo.settings.preferredName
                                            && !preferredNameInfo.settings.pronoun ?
                                            (
                                                <Grid container>
                                                    <Grid item>
                                                        <Text>
                                                            {resources.lblNoPreferredName}
                                                        </Text>
                                                    </Grid>
                                                </Grid>
                                            ) : !preferredNameInfo.genderIdentity.requestId ? (
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        {preferredNameInfo.settings.preferredName ?
                                                            (
                                                                <>
                                                                    <Grid container>
                                                                        <Grid item xs={6} md={2}>
                                                                            <Text weight="strong">
                                                                                {resources.lblDisplayName}
                                                                            </Text>
                                                                        </Grid>
                                                                        <Grid item xs={6} md={2}>
                                                                            <Text>
                                                                                {preferredNameInfo.genderIdentity.displayName}
                                                                            </Text>
                                                                        </Grid>
                                                                    </Grid>
                                                                </>
                                                            ) : undefined}
                                                        {preferredNameInfo.settings.genderIdentity ?
                                                            (
                                                                <>
                                                                    <Grid container>
                                                                        <Grid item xs={6} md={2}>
                                                                            <Text weight="strong">
                                                                                {resources.lblGenderIdentity}
                                                                            </Text>
                                                                        </Grid>
                                                                        <Grid item xs={6} md={2}>
                                                                            <Text>
                                                                                {preferredNameInfo.genderIdentity.description}
                                                                            </Text>
                                                                        </Grid>
                                                                    </Grid>
                                                                </>
                                                            ) : undefined}
                                                        {preferredNameInfo.settings.pronoun ?
                                                            (
                                                                <>
                                                                    <Grid container>
                                                                        <Grid item xs={6} md={2}>
                                                                            <Text weight="strong">
                                                                                {resources.lblPronoun}
                                                                            </Text>
                                                                        </Grid>
                                                                        <Grid item xs={6} md={2}>
                                                                            <Text>
                                                                                {preferredNameInfo.genderIdentity.pronounDesc}
                                                                            </Text>
                                                                        </Grid>
                                                                    </Grid>
                                                                </>
                                                            ) : undefined}
                                                    </Grid>
                                                </Grid>
                                            ) : (
                                                <>
                                                    <Hidden smDown>
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12}>
                                                                {preferredNameInfo.settings.preferredName ? (
                                                                    <>
                                                                        <Grid container>
                                                                            <Grid item md={2}>
                                                                                <Text weight="strong">
                                                                                    {resources.lblDisplayName}
                                                                                </Text>
                                                                            </Grid>
                                                                            <Grid item md={1}>
                                                                                <Text>
                                                                                    {preferredNameInfo
                                                                                        .genderIdentity.pendingGenderIdentity.displayName}
                                                                                </Text>
                                                                            </Grid>
                                                                            {preferredNameInfo.genderIdentity.displayName !==
                                                                                preferredNameInfo.genderIdentity.pendingGenderIdentity.displayName ? (
                                                                                <Grid item>
                                                                                    <StatusLabel
                                                                                        id="stsDisplayName"
                                                                                        text={resources.lblUpdatedPending}
                                                                                        type="pending"
                                                                                    />
                                                                                </Grid>
                                                                            ) : undefined}
                                                                        </Grid>
                                                                    </>
                                                                )
                                                                    : undefined}
                                                                {preferredNameInfo.settings.genderIdentity ? (
                                                                    <>
                                                                        <Grid container>
                                                                            <Grid item md={2}>
                                                                                <Text weight="strong">
                                                                                    {resources.lblGenderIdentity}
                                                                                </Text>
                                                                            </Grid>
                                                                            <Grid item md={1}>
                                                                                <Text>
                                                                                    {preferredNameInfo
                                                                                        .genderIdentity.pendingGenderIdentity.description}
                                                                                </Text>
                                                                            </Grid>
                                                                            {preferredNameInfo.genderIdentity.description !==
                                                                                preferredNameInfo.genderIdentity.pendingGenderIdentity.description ? (
                                                                                <Grid item>
                                                                                    <StatusLabel
                                                                                        id="stsDisplayName"
                                                                                        text={resources.lblUpdatedPending}
                                                                                        type="pending"
                                                                                    />
                                                                                </Grid>
                                                                            ) : undefined}
                                                                        </Grid>
                                                                    </>
                                                                )
                                                                    : undefined}
                                                                {preferredNameInfo.settings.pronoun ? (
                                                                    <>
                                                                        <Grid container>
                                                                            <Grid item md={2}>
                                                                                <Text weight="strong">
                                                                                    {resources.lblPronoun}
                                                                                </Text>
                                                                            </Grid>
                                                                            <Grid item md={1}>
                                                                                <Text>
                                                                                    {preferredNameInfo
                                                                                        .genderIdentity.pendingGenderIdentity.pronounDesc}
                                                                                </Text>
                                                                            </Grid>
                                                                            {preferredNameInfo.genderIdentity.pronounDesc !==
                                                                                preferredNameInfo.genderIdentity.pendingGenderIdentity.pronounDesc ? (
                                                                                <Grid item>
                                                                                    <StatusLabel
                                                                                        id="stsDisplayName"
                                                                                        text={resources.lblUpdatedPending}
                                                                                        type="pending"
                                                                                    />
                                                                                </Grid>
                                                                            ) : undefined}
                                                                        </Grid>
                                                                    </>
                                                                ) : undefined}
                                                            </Grid>
                                                        </Grid>
                                                        <br />
                                                        <Grid container>
                                                            <Grid item>
                                                                <Button
                                                                    id="btnCancelUpdate"
                                                                    onClick={this.onCancelUpdate}
                                                                >
                                                                    {resources.btnCancelUpdate}
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </Hidden>
                                                    <Hidden mdUp>
                                                        {preferredNameInfo.settings.preferredName ? (
                                                            <>
                                                                <Grid container>
                                                                    <Grid item xs={6}>
                                                                        <Text weight="strong">
                                                                            {resources.lblDisplayName}
                                                                        </Text>
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <Text>
                                                                            {preferredNameInfo.genderIdentity.displayName}
                                                                        </Text>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid container>
                                                                    <Grid item xs={6}>
                                                                        <Text />
                                                                    </Grid>
                                                                    {preferredNameInfo.genderIdentity.displayName !==
                                                                        preferredNameInfo.genderIdentity.pendingGenderIdentity.displayName ? (
                                                                        <Grid item xs={6}>
                                                                            <StatusLabel
                                                                                id="stsDisplayName"
                                                                                text={resources.lblUpdatedPending}
                                                                                type="pending"
                                                                            />
                                                                        </Grid>
                                                                    ) : undefined}
                                                                </Grid>
                                                            </>
                                                        ) : undefined}
                                                        {preferredNameInfo.settings.genderIdentity ? (
                                                            <>
                                                                <Grid container>
                                                                    <Grid item xs={6}>
                                                                        <Text weight="strong">
                                                                            {resources.lblGenderIdentity}
                                                                        </Text>
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <Text>
                                                                            {preferredNameInfo.genderIdentity.pendingGenderIdentity.description}
                                                                        </Text>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid container>
                                                                    <Grid item xs={6}>
                                                                        <Text />
                                                                    </Grid>
                                                                    {preferredNameInfo.genderIdentity.description !==
                                                                        preferredNameInfo.genderIdentity.pendingGenderIdentity.description ? (
                                                                        <Grid item xs={6}>
                                                                            <StatusLabel
                                                                                id="stsDisplayName"
                                                                                text={resources.lblUpdatedPending}
                                                                                type="pending"
                                                                            />
                                                                        </Grid>
                                                                    ) : undefined}
                                                                </Grid>
                                                            </>
                                                        ) : undefined}
                                                        {preferredNameInfo.settings.pronoun ? (
                                                            <>
                                                                <Grid container>
                                                                    <Grid item xs={6}>
                                                                        <Text weight="strong">
                                                                            {resources.lblPronoun}
                                                                        </Text>
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <Text>
                                                                            {preferredNameInfo.genderIdentity.pendingGenderIdentity.pronounDesc}
                                                                        </Text>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid container>
                                                                    <Grid item xs={6}>
                                                                        <Text />
                                                                    </Grid>
                                                                    {preferredNameInfo.genderIdentity.pronounDesc !==
                                                                        preferredNameInfo.genderIdentity.pendingGenderIdentity.pronounDesc ? (
                                                                        <Grid item xs={6}>
                                                                            <StatusLabel
                                                                                id="stsDisplayName"
                                                                                text={resources.lblUpdatedPending}
                                                                                type="pending"
                                                                            />
                                                                        </Grid>
                                                                    ) : undefined}
                                                                </Grid>
                                                            </>
                                                        ) : undefined}
                                                        <br />
                                                        <Grid container>
                                                            <Grid item xs>
                                                                <Button
                                                                    id="btnCancelUpdate"
                                                                    onClick={this.onCancelUpdate}
                                                                >
                                                                    {resources.btnCancelUpdate}
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </Hidden>
                                                </>
                                            )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        {editModalPage}
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
export default withStyles(styles)(PreferredNameMain);