/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: StopList.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Internal components
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import { HandPaper } from '@hedtech/powercampus-design-system/react/core/IconSvg';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';
import { IStopList } from '../../Types/Generic/IStopList';
import { IStopListResources } from '../../Types/Resources/Generic/IStopListResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../Requests/Generic/Stoplist';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IStopListState {
    stopList?: IStopList[];
    expanded?: boolean;
    resources?: IStopListResources;
}

export interface IStopListProps {
    defaultExpandedDetails?: boolean;
    impersonateInfo?: IImpersonateInfo;
    showGrade?: boolean;
    showOthers?: boolean;
    showRegistration?: boolean;
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
        verticalAlign: 'middle'
    },
    stopText: {
        alignItems: 'center',
        display: 'inline-flex!important'
    }
});

type PropsWithStyles = IStopListProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class StopList extends React.Component<PropsWithStyles, IStopListState> {
    private abortController: AbortController;
    public readonly state: Readonly<IStopListState>;

    // Constructor
    constructor(props: PropsWithStyles) {
        super(props);

        // Init variables
        this.abortController = new AbortController();

        // Init State
        this.state = this.getInitialState();
    }

    // Init State
    private getInitialState(): IStopListState {
        return ({
            expanded: this.props.defaultExpandedDetails ? this.props.defaultExpandedDetails : false,
            stopList: undefined,

            resources: undefined
        });
    }

    // Functions for errors
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    // Functions
    private onChangePanel = () => {
        try {
            const {
                expanded
            } = this.state;

            this.setState({
                expanded: !expanded
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePanel.name, e));
        }
    };

    // Resolvers
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

    private resolveGetStopList = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetStopList.name);
            if (result?.status) {
                const stopList: IStopList[] = result.data;
                this.setState({
                    stopList: stopList
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetStopList.name, e));
        }
    };

    // #region Lifecycle
    public componentDidMount(): void {
        const {
            impersonateInfo
        } = this.props;

        try {
            RequestsLayout.getResources('Generic', 'StopList',
                this.resolveGetResources,
                this.logError,
                this.abortController.signal);
            Requests.getStopList(this.resolveGetStopList,
                this.abortController.signal,
                impersonateInfo);
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

    // Render
    public render(): JSX.Element {
        const {
            classes,
            showGrade,
            showOthers,
            showRegistration,
        } = this.props;

        const {
            expanded,
            stopList,

            resources
        } = this.state;

        let content: JSX.Element | undefined;

        let showIcon: boolean = false;
        if (showGrade) {
            if (stopList && stopList.findIndex(x => x.isGradesStop == true) > -1) {
                showIcon = true;
            }
        }
        if (showRegistration) {
            if (stopList && stopList.findIndex(x => x.isRegistrationStop == true) > -1) {
                showIcon = true;
            }
        }
        if (showOthers) {
            if (stopList && stopList.findIndex(x => x.isGradesStop == false && x.isRegistrationStop == false) > -1) {
                showIcon = true;
            }
        }
        if (resources && stopList && showIcon) {
            content = (
                <Grid container spacing={3}>
                    <Grid item xs>
                        <ExpansionPanel
                            defaultExpanded={true}
                            type="error"
                            expanded={expanded}
                            header={(
                                <Grid container spacing={3} >
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
                            )}
                            onChange={this.onChangePanel}
                        >
                            {stopList && stopList.length > 0 ? (
                                stopList.map((stopItem, i) => (
                                    stopItem.isGradesStop && stopItem.isRegistrationStop &&
                                        (showGrade || showRegistration) ?
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
                                        : stopItem.isGradesStop && showGrade ?
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
                                            : stopItem.isRegistrationStop && showRegistration ?
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
                                                : showOthers ?
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
                                                    : undefined
                                ))
                            ) : undefined}
                        </ExpansionPanel>
                    </Grid>
                </Grid>
            );
        }

        return (
            <>
                {content}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(StopList);