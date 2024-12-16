/* Copyright 2020 -2022 Ellucian Company L.P. and its affiliates.
 * File: StudentProfileMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Avatar from '@hedtech/powercampus-design-system/react/core/Avatar';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import Tabs from '@hedtech/powercampus-design-system/react/core/Tabs';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IProfileMain } from '../../../Types/Account/IProfileMain';
import { ITabOption } from '@hedtech/powercampus-design-system/types/ITabOption';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Requests
import Requests from '../../../Requests/Account/ProfileMain';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion

// #region Internal Types
interface IStudentProfileMainProps {
    contentTabs: JSX.Element[];
    impersonateInfo?: IImpersonateInfo;
    tabs?: ITabOption[];
}

interface IStudentProfileMainState {
    componentError: boolean;
    profileInformation?: IProfileMain;
    resources?: IStudentProfileMainRes;
    tabSelected: number;
}

interface IStudentProfileMainRes {
    lblStudents: string;
    formatBreadcrumbs: string;
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

type PropsWithStyles = IStudentProfileMainProps & WithStyles<typeof styles> & WithWidth;
// #endregion Imports Types

// #region component
class ProfileMain extends React.Component<PropsWithStyles, IStudentProfileMainState> {
    private abortController: AbortController;
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IStudentProfileMainState>;

    public constructor(props) {
        super(props);

        // Init Variables
        this.abortController = new AbortController();
        this.idModule = 'SharedAccess';
        this.idPage = 'StudentProfileMain';
        this.state = this.getInitialState();
    }

    private getInitialState(): IStudentProfileMainState {
        let resources: IStudentProfileMainRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            resources: resources,
            tabSelected: -1,
        };
    }

    // #region Events
    private onChangeTab = (_event: object, value: number): void => {
        try {
            const {
                tabSelected
            } = this.state;

            this.abortController.abort();
            this.abortController = new AbortController();

            if (tabSelected !== value) {
                this.setState({
                    tabSelected: value
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTab.name, e));
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

    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const {
                impersonateInfo
            } = this.props;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name);
            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => {
                    Requests.getProfileInformation(this.resolveGetProfileInformation, impersonateInfo);
                }
                );
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetProfileInformation = (json: string) => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name);
            if (result?.status) {
                const profileInformation: IProfileMain | undefined = result.data;
                this.setState({
                    profileInformation: profileInformation
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetProfileInformation.name, e));
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
                    LayoutActions.showPageLoader();
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
        } = this.state;

        const {
            classes,
            contentTabs,
            impersonateInfo,
            tabs,
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

                const tabIndex: number = tabs.findIndex(t => t.id === tabSelected);
                contentTab = tabIndex > -1 ? contentTabs[tabIndex] : undefined;
            }

            const backgroundImage: string = (
                `linear-gradient(${
                isWidthUp('sm', width) ? 'to right' : 'to top'}, rgba(21, 22, 24, 0.5)35%, rgba(21, 22, 24, 0)65%, rgba(21, 22, 24, 0)), url(${
                Constants.webUrl}/${profileInformation && profileInformation.hasProgramPicture ?
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
            if (profileInformation && profileInformation.person) {
                breadcrumbs = (
                    <Paragraph
                        id="prgBreadcrumbs"
                        text={Format.toString(resources.formatBreadcrumbs,
                            [resources.lblStudents, profileInformation.person.fullName]
                        )}
                        events={[() => { window.location.assign(`${Constants.webUrl}/SharedAccess/Students`); }, () => { }]}
                    />
                );

                contentHeader = (
                    <>
                        <div className={classes.headerHeight}>
                            <Card style={background}>
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
                                                        size="xxLarge"
                                                        src={`${Constants.peoplePictureUrl}${impersonateInfo?.personId}`}
                                                    />
                                                ) : (
                                                    <Avatar
                                                        classes={{ root: classes.avatar }}
                                                        size="xxLarge"
                                                        backgroundNumber={profileInformation.person.colorFirstLetter ?
                                                            profileInformation.person.colorFirstLetter : 0}
                                                    >
                                                        {profileInformation.person.firstLetter}
                                                    </Avatar>
                                                )}
                                        </Grid>
                                        <Grid item>
                                            <div className={classes.nameIconContainer}>
                                                <Text size="h3" display="inline" className={classes.profileText} id="lblStudentName">
                                                    {profileInformation.person.fullName}
                                                </Text>
                                            </div>
                                            <Text size="default" display="block" className={classes.profileText} id="lblProgramTitle">
                                                {profileInformation.programFormalTitle}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </div>
                        {componentTabs}
                    </>
                );
            }
            contentPage = (
                <>
                    <Grid container spacing={3} >
                        <Grid item xs>
                            {breadcrumbs}
                            {contentHeader}
                            {contentTab}
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