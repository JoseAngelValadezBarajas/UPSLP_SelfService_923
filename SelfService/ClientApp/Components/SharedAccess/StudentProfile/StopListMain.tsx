/* Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
 * File: StopListMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import { HandPaper } from '@hedtech/powercampus-design-system/react/core/IconSvg';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';

// Types
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IStopList } from '../../../Types/Generic/IStopList';
import { IStopListResources } from "../../../Types/Resources/Generic/IStopListResources";

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import Requests from '../../../Requests/Generic/Stoplist';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
interface IStopListMainRes extends IStopListResources {
    lblNoStopList: string;
    lblStopListTitle: string;
}

export interface IStopListMainProps {
    impersonateInfo?: IImpersonateInfo;
}

interface IStopListMainState {
    isLoading: boolean;
    resources?: IStopListMainRes;
    stopList?: IStopList[];
}

const styles = (theme: Theme) => createStyles({
    iconError: {
        fill: Tokens.colorTextAlertError,
        marginBottom: Tokens.spacing40,
        marginRight: Tokens.spacing40,
        marginTop: Tokens.spacing40,
        [theme.breakpoints.down('sm')]: {
            marginRight: Tokens.spacing30
        }
    },
    stopItem: {
        marginTop: Tokens.spacing40
    },
    stopList: {
        alignContent: 'center',
        color: Tokens.colorTextAlertError,
        display: 'inline-flex',
        verticalAlign: 'middle',
        margin: '-10px 0px !important'
    },
    stopText: {
        alignItems: 'center',
        display: 'inline-flex!important'
    },
    errorImage: {
        height: 'auto',
        width: '100%',
        maxWidth: '40rem'
    },
    errorImageContainer: {
        [theme.breakpoints.down('sm')]: {
            marginTop: Tokens.spacing70,
            marginBottom: Tokens.spacing70
        },
        [theme.breakpoints.down('xs')]: {
            marginTop: Tokens.spacing50,
            marginBottom: Tokens.spacing50

        },
        marginTop: Tokens.spacing80,
        marginBottom: Tokens.spacing80
    },
    dividerError: {
        backgroundColor: Tokens.colorTextAlertError
    },
    errorBackGround: {
        backgroundColor: Tokens.colorBackgroundAlertError,
        color: Tokens.colorTextAlertError,
        marginBottom: Tokens.spacing40
    },
});

type PropsWithStyles = IStopListMainProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class StopListMain extends React.Component<PropsWithStyles, IStopListMainState> {
    private abortController: AbortController;
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IStopListMainState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.abortController = new AbortController();
        this.idModule = 'SharedAccess';
        this.idPage = 'StopListMain';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IStopListMainState {
        let isLoading: boolean = true;
        let resources: IStopListMainRes | undefined;
        if (this.state) {
            isLoading = this.state.isLoading;
            resources = this.state.resources;
        }
        return {
            isLoading: isLoading,
            resources: resources
        };
    }

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }

    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const {
                impersonateInfo
            } = this.props;

            const result: IJsonResult | undefined = Resolver(json, this.resolveGetResources.name);
            if (result?.status) {
                this.setState({
                    resources: result.data
                });

                Requests.getStopList(this.resolveGetStopList,
                    this.abortController.signal,
                    impersonateInfo);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetStopList = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetStopList.name, this.hideAllLoaders);
            if (result?.status) {
                const stopList: IStopList[] = result.data;
                this.setState({
                    stopList: stopList
                }, this.hideAllLoaders);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetStopList.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage, this.resolveGetResources);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }

    public componentWillUnmount(): void {
        try {
            this.abortController.abort();
            this.abortController = new AbortController();
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentWillUnmount.name, e));
        }
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            isLoading,
            resources,
            stopList
        } = this.state;

        const {
            classes
        } = this.props;

        let contentPage: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (<ContainerLoader id="ldrStopListMain" height="md" />);
        }
        else if (resources) {
            if (stopList && stopList.length > 0) {
                contentPage = (
                    <Card>
                        <CardContent>
                            <Grid container spacing={3} direction="column">
                                <Grid item>
                                    <Text size="h2">
                                        {resources.lblStopListTitle}
                                    </Text>
                                </Grid>
                                <Grid item xs className={classes.errorBackGround}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} className={classes.stopList}>
                                            <HandPaper
                                                className={classes.iconError}
                                                viewBoxWidth={448}
                                            />
                                            <Text
                                                className={classes.stopText}
                                                color="error"
                                                id="txtStopText"
                                                size="large"
                                            >
                                                {resources.lblStopListMessage}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <Divider className={classes.dividerError} />
                                    {stopList.map((stopItem, i) => (
                                        stopItem.isGradesStop && stopItem.isRegistrationStop ?
                                            <div key={`stopItem_${i}`} className={classes.stopItem}>
                                                <Text color="error">
                                                    {stopItem.date}
                                                </Text>
                                                <Text color="error" weight="strong">
                                                    {`${stopItem.reason} (${stopItem.isRegistrationStop ?
                                                        resources.lblStopRegistration : ''}${stopItem.isRegistrationStop && stopItem.isGradesStop ?
                                                            ', ' : ''}${stopItem.isGradesStop ? resources.lblStopGrades : ''})`}
                                                </Text>
                                                <Text color="error">
                                                    {stopItem.comments}
                                                </Text>
                                            </div>
                                            : stopItem.isGradesStop ?
                                                <div key={`stopItem_${i}`} className={classes.stopItem}>
                                                    <Text color="error">
                                                        {stopItem.date}
                                                    </Text>
                                                    <Text color="error" weight="strong">
                                                        {`${stopItem.reason} (${stopItem.isGradesStop ? resources.lblStopGrades : ''})`}
                                                    </Text>
                                                    <Text color="error">
                                                        {stopItem.comments}
                                                    </Text>
                                                </div>
                                                : stopItem.isRegistrationStop ?
                                                    <div key={`stopItem_${i}`} className={classes.stopItem}>
                                                        <Text color="error">
                                                            {stopItem.date}
                                                        </Text>
                                                        <Text color="error" weight="strong">
                                                            {`${stopItem.reason} (${stopItem.isRegistrationStop ?
                                                                resources.lblStopRegistration : ''})`}
                                                        </Text>
                                                        <Text color="error">
                                                            {stopItem.comments}
                                                        </Text>
                                                    </div>
                                                    :
                                                    <div key={`stopItem_${i}`} className={classes.stopItem}>
                                                        <Text color="error">
                                                            {stopItem.date}
                                                        </Text>
                                                        <Text color="error" weight="strong">
                                                            {`${stopItem.reason}`}
                                                        </Text>
                                                        <Text color="error">
                                                            {stopItem.comments}
                                                        </Text>
                                                    </div>
                                    ))}
                                </Grid>
                            </Grid >
                        </CardContent>
                    </Card>
                );
            }
            else {
                contentPage = (
                    <Card>
                        <CardContent>
                            <Grid container justifyContent="center">
                                <Grid
                                    item
                                    className={classes.errorImageContainer}
                                >
                                    <img
                                        className={classes.errorImage}
                                        alt={resources.lblNoStopList}
                                        src={`${Constants.imagesCDN}/illustrations/large/Welcome.png`}
                                    />
                                    <Text align="center">
                                        {resources.lblNoStopList}
                                    </Text>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )
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
export default withStyles(styles)(StopListMain);