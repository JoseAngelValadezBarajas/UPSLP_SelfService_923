/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: ProfileMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Avatar from '@hedtech/powercampus-design-system/react/core/Avatar';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import Tabs from '@hedtech/powercampus-design-system/react/core/Tabs';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import EmailModal from '../../Generic/EmailModal';
import ProfileDetail, { IProfileDetailResProps } from './ProfileDetail';

// Types
import { EmailProviderOption } from '../../../Types/Enum/EmailProviderOption';
import { IAdviseeWarning } from '../../../Types/Advisees/IAdviseeWarning';
import { IEmailSettings } from '../../../Types/InstitutionSettings/IEmailSettings';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IProfileMain } from '../../../Types/Account/IProfileMain';
import { ITabOption } from '@hedtech/powercampus-design-system/types/ITabOption';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Storage
import Storage from '@hedtech/powercampus-design-system/storage';
import StorageKeys from '@hedtech/powercampus-design-system/storage/StorageKeys';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Account/ProfileMain';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion

// #region Internal Types
interface IProfileMainProps {
    contentTabs: JSX.Element[];
    impersonateInfo?: IImpersonateInfo;
    stopListshowOthers?: boolean;
    tabs?: ITabOption[];
    tabText?: string;
}

interface IProfileMainState {
    componentError: boolean;
    profileInformation?: IProfileMain;
    resources?: IProfileMainRes;
    tabSelected: number;
    warnings?: IAdviseeWarning;

    // #region Email Modal
    openEmailModal: boolean;
    recipientsEmailAddresses: string[];
    // #endregion Email Modal
}

interface IProfileMainRes {
    formatBreadcrumbs: string;
    lblAdvisor: string;
    profileDetail: IProfileDetailResProps;
}

const styles = (theme: Theme) => createStyles({
    avatar: {
        border: '2px solid white'
    },
    avatarItem: {
        marginLeft: Tokens.spacing70,
        [theme.breakpoints.down('sm')]: {
            marginLeft: 0,
            marginTop: Tokens.spacing40
        }
    },
    backgroundContainer: {
        justifyContent: 'left',
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center'
        }
    },
    backgroundContent: {
        display: 'flex',
        minHeight: 'inherit'
    },
    headerHeight: {
        minHeight: '110px'
    },
    headerHeightProfile: {
        minHeight: '300px'
    },
    iconLink: {
        marginLeft: Tokens.spacing40
    },
    nameIconContainer: {
        alignItems: 'center',
        display: 'inline-flex'
    },
    profileText: {
        color: 'white',
        textAlign: 'left',
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    }
});

type PropsWithStyles = IProfileMainProps & WithStyles<typeof styles> & WithWidth;
// #endregion Imports Types

// #region component
class ProfileMain extends React.Component<PropsWithStyles, IProfileMainState> {
    private abortController: AbortController;
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IProfileMainState>;

    public constructor(props) {
        super(props);

        // Init Variables
        this.abortController = new AbortController();
        this.idModule = 'Account';
        this.idPage = 'ProfileMain';
        this.state = this.getInitialState();
    }

    private getInitialState(): IProfileMainState {
        let resources: IProfileMainRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            profileInformation: undefined,
            resources: resources,
            tabSelected: -1,
            warnings: undefined,

            // #region Email Modal
            openEmailModal: false,
            recipientsEmailAddresses: []
            // #endregion Email Modal
        };
    }

    // #region Events
    private onChangeTab = (_event: object, value: number): void => {
        try {
            const {
                impersonateInfo
            } = this.props;

            const {
                tabSelected
            } = this.state;

            this.abortController.abort();
            this.abortController = new AbortController();

            if (tabSelected !== value) {
                this.setState({
                    tabSelected: value
                }, () => {
                    if (value === 0) {
                        Requests.getAdviseeWarnings(this.resolveGetAdviseeWarnings, this.abortController.signal, impersonateInfo);
                    }
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTab.name, e));
        }
    };

    // #region Email Modal
    private onOpenEmailModal = (emailAddresses: string[]): void => {
        try {
            const {
                profileInformation
            } = this.state;

            if (profileInformation) {
                const emailSettings: IEmailSettings = profileInformation.emailSettings;
                if (emailSettings.emailProvider === EmailProviderOption.SelfService) {
                    LayoutActions.showPageLoader();
                    this.setState({
                        recipientsEmailAddresses: emailAddresses,
                        openEmailModal: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenEmailModal.name, e));
        }
    };

    private onCloseEmailModal = (): void => {
        try {
            this.setState({
                openEmailModal: false,
                recipientsEmailAddresses: []
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseEmailModal.name, e));
        }
    };
    // #endregion Email Modal
    // #endregion Events

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const {
                impersonateInfo,
                tabs
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name);

            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => {
                    if (tabs && tabs[0].id === 0) {
                        Requests.getProfileInformation(this.resolveGetProfileInformation, impersonateInfo);
                    }
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetProfileInformation = (json: string) => {
        try {
            const {
                impersonateInfo
            } = this.props;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetProfileInformation.name);
            if (result?.status) {
                const profileInformation: IProfileMain | undefined = result.data;
                this.setState({
                    profileInformation: profileInformation
                }, () => {
                    LayoutActions.setLoading(false);
                    Requests.getAdviseeWarnings(this.resolveGetAdviseeWarnings, this.abortController.signal, impersonateInfo);

                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetProfileInformation.name, e));
        }
    };

    private resolveGetAdviseeWarnings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAdviseeWarnings.name);

            if (result?.status) {
                const warnings: IAdviseeWarning = result.data;

                this.setState({
                    warnings: warnings
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAdviseeWarnings.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            const {
                impersonateInfo,
                tabs
            } = this.props;

            if (tabs) {
                const tabSelected: number = impersonateInfo?.tabId ? impersonateInfo?.tabId : tabs[0].id;
                this.setState({
                    tabSelected: tabs.length > 0 ? tabSelected : -1
                }, () => {
                    LayoutActions.setLoading(true);
                    RequestsLayout.getResources(this.idModule, this.idPage,
                        this.resolveGetResources,
                        this.logError);
                });
            }
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
            profileInformation,
            resources,
            tabSelected,
            warnings,

            // #region Email Modal
            recipientsEmailAddresses,
            openEmailModal
            // #endregion Email Modal
        } = this.state;

        const {
            classes,
            contentTabs,
            impersonateInfo,
            stopListshowOthers,
            tabs,
            tabText,
            width
        } = this.props;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            let contentTab: JSX.Element | undefined;
            let componentTabs: JSX.Element | undefined;
            if (tabSelected !== -1 && tabs) {
                componentTabs = (
                    <Tabs
                        id="ProfileTabs"
                        marginBottom
                        marginTop
                        options={tabs}
                        variant="page"
                        scrollButtons
                        valueSelected={tabSelected}
                        onChange={this.onChangeTab}
                    />
                );

                if (tabSelected === 0) {
                    contentTab = (
                        <ProfileDetail
                            impersonateInfo={impersonateInfo}
                            profileInformation={profileInformation}
                            stopListshowOthers={stopListshowOthers}
                            warnings={warnings}
                            resources={resources.profileDetail}
                        />
                    );
                }
                else {
                    const tabIndex: number = tabs.findIndex(t => t.id === tabSelected);
                    contentTab = tabIndex > -1 ? contentTabs[tabIndex] : undefined;
                }
            }

            const backgroundImage: string = (
                `linear-gradient(${isWidthUp('sm', width) ? 'to right' : 'to top'}, rgba(21, 22, 24, 0.5)35%, rgba(21, 22, 24, 0)65%, rgba(21, 22, 24, 0)), url(${Constants.webUrl}/${profileInformation && profileInformation.hasProgramPicture ?
                    `programs/picture/${profileInformation.programId}` : `programs/picture?baseAddress=${Constants.webUrl}`})`
            );

            const background = {
                backgroundImage: backgroundImage,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                display: 'flex',
                marginTop: Tokens.spacing40,
                minHeight: 'inherit'
            };

            let breadcrumbs: JSX.Element | undefined;
            let contentHeader: JSX.Element | undefined;
            let emailModal: JSX.Element | undefined;
            if (profileInformation && profileInformation.person) {
                if (tabText) {
                    const url: string | undefined = Storage.loadFromStorage(StorageKeys.urlAdvisees);
                    const urlToSearch: string = url ? `?${url}` : '';
                    breadcrumbs = (
                        <Paragraph
                            id="prgBreadcrumbs"
                            text={Format.toString(resources.formatBreadcrumbs,
                                [resources.lblAdvisor, tabText, profileInformation.person.fullName]
                            )}
                            events={[() => { window.location.assign(`${Constants.webUrl}/Advising/ManageAdvisees${urlToSearch}`); }, () => { }]}
                        />
                    );
                }

                const onClickEmail = () => {
                    if (profileInformation.emailSettings.emailProvider === EmailProviderOption.External) {
                        window.open(Format.toString(profileInformation.emailSettings.staffUrl, [profileInformation.person.email]),
                            profileInformation.emailSettings.staffUrl.toLowerCase() === 'mailto:{0}' ? '_self' : '_blank');
                    }
                    else if (profileInformation.person.email) {
                        this.onOpenEmailModal([profileInformation.person.email]);
                    }
                };

                contentHeader = (
                    <>
                        <div className={tabSelected !== 0 ? classes.headerHeight : classes.headerHeightProfile}>
                            <Card
                                spacingOptions={{
                                    spacing: 'none',
                                    responsive: false,
                                    outerSpacing: false
                                }}
                                style={background}
                            >
                                <CardContent className={classes.backgroundContent}>
                                    <Grid
                                        alignItems="center"
                                        className={classes.backgroundContainer}
                                        container
                                        spacing={3}
                                    >
                                        <Grid item className={classes.avatarItem}>
                                            {profileInformation.person.hasPicture ?
                                                (
                                                    <Avatar
                                                        className={classes.avatar}
                                                        size={tabSelected === 0 ? 'xxxLarge' : 'xxLarge'}
                                                        src={`${Constants.peoplePictureUrl}${impersonateInfo?.personId}`}
                                                        alt={resources.profileDetail.lblProfilePicture}
                                                    />
                                                ) : (
                                                    <Avatar
                                                        classes={{ root: classes.avatar }}
                                                        size={tabSelected === 0 ? 'xxxLarge' : 'xxLarge'}
                                                        backgroundNumber={profileInformation.person.colorFirstLetter ?
                                                            profileInformation.person.colorFirstLetter : 0}
                                                    >
                                                        {profileInformation.person.firstLetter}
                                                    </Avatar>
                                                )}
                                        </Grid>
                                        <Grid item>
                                            <div className={classes.nameIconContainer}>
                                                <Text size={tabSelected === 0 ? 'h1' : 'h3'} display="inline" className={classes.profileText} id="lblStudentName">
                                                    {profileInformation.person.fullName}
                                                </Text>
                                                {impersonateInfo?.personId && profileInformation.person.email ? (
                                                    <Hidden xsDown>
                                                        <Tooltip
                                                            id="tltSendStudentEmail"
                                                            title="E-mail"
                                                        >
                                                            <IconButton
                                                                aria-label="E-mail"
                                                                color="gray"
                                                                id="btnSendStudentEmail"
                                                                onClick={onClickEmail}
                                                            >
                                                                <Icon large name="email" type="neutral" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Hidden>
                                                ) : undefined}
                                            </div>
                                            <Text size={tabSelected === 0 ? 'large' : 'default'} display="block" className={classes.profileText} id="lblProgramTitle">
                                                {profileInformation.programFormalTitle}
                                            </Text>
                                        </Grid>
                                        {impersonateInfo?.personId && profileInformation.person.email ? (
                                            <Hidden smUp>
                                                <Grid item>
                                                    <Tooltip
                                                        id="tltSendStudentEmail"
                                                        title="E-mail"
                                                    >
                                                        <IconButton
                                                            aria-label="E-mail"
                                                            color="gray"
                                                            id="btnSendStudentEmail"
                                                            onClick={onClickEmail}
                                                        >
                                                            <Icon large name="email" type="neutral" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Hidden>
                                        ) : undefined}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </div>
                        {componentTabs}
                    </>
                );

                if (openEmailModal && profileInformation) {
                    emailModal = (
                        <EmailModal
                            emailSettings={profileInformation.emailSettings}
                            onClose={this.onCloseEmailModal}
                            recipientsEmailAddresses={recipientsEmailAddresses}
                        />
                    );
                }
            }
            contentPage = (
                <>
                    <Grid container spacing={3} >
                        <Grid item xs>
                            {breadcrumbs}
                            {contentHeader}
                            {contentTab}
                            {emailModal}
                        </Grid>
                    </Grid >
                </>
            );
        }

        return (
            <>
                {contentPage}
            </>
        );
    }
}
// #endregion component

// Component
export default withStyles(styles)(withWidth()(ProfileMain));