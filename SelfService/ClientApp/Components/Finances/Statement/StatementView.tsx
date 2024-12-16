/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: StatementView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';

// Internal components
import StatementInformation, { IStatementInformationResProps } from './StatementInformation';
import StatementOptions, { IStatementOptionsResProps } from './StatementOptions';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IStatementResources } from '../../../Types/Resources/Finances/IStatementResources';
import { IStatement } from '../../../Types/Statement/IStatement';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsStatements from '../../../Requests/Finances/Statement';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import { IPrintResources } from '../../../Types/Resources/Generic/IPrintResources';
// #endregion

// #region Internal types
interface IStatementState {
    componentError: boolean;
    statement?: IStatement;
    statementSelected?: number;
    statementsList?: IDropDownOption[];

    resources?: IStatementRes;
}

interface IStatementRes extends IStatementResources {
    printing: IPrintResources;
    statementOptions: IStatementOptionsResProps;
    statementInformation: IStatementInformationResProps;
}

const styles = ((theme: Theme) => createStyles({
    statementContainer: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap-reverse',
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
            flexWrap: 'wrap'
        }
    }
}));

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion

// #region Component
class StatementView extends React.Component<PropsWithStyles, IStatementState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IStatementState>;

    // Constructor
    public constructor(props) {
        super(props);

        // Init Variables
        this.idModule = 'Finances';
        this.idPage = 'Statement';

        // Init State
        this.state = this.getInitialState();

        // Bind Events
        this.onChangeStatement = this.onChangeStatement.bind(this);

        // Bind Resolvers
        this.resolveGetStatement = this.resolveGetStatement.bind(this);
        this.resolveGetStatements = this.resolveGetStatements.bind(this);
        this.resolveLayoutReady = this.resolveLayoutReady.bind(this);

        // Bind State Management Events
        this.onLayoutReady = this.onLayoutReady.bind(this);

        // Init State Management listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
    }

    // Init State
    private getInitialState(): IStatementState {
        let resources: IStatementRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            statement: undefined,
            statementSelected: undefined,
            statementsList: undefined,

            resources: resources
        };
    }

    // Events
    private onChangeStatement(optionSelected: IDropDownOption, _id: string) {
        try {
            if (optionSelected && optionSelected.value) {
                LayoutActions.setLoading(true);
                this.setState({
                    statementSelected: Number(optionSelected.value)
                });
                RequestsStatements.getStatement(Number(optionSelected.value), this.resolveGetStatement, this.logError);
            }
            else {
                this.setState({
                    statement: undefined
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeStatement.name, e));
        }
    }

    // Functions for errors
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }

    // Resolvers
    private resolveGetStatement(json: string): void {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetStatement.name);
            if (result?.status) {
                this.setState({
                    statement: result.data
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetStatement.name, e));
        }
    }

    private resolveGetStatements(json: string): void {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetStatements.name);
            if (result?.status) {
                this.setState({ statementsList: result.data },
                    () => {
                        // Select default statement
                        if (this.state.statementsList && this.state.statementsList.length > 0) {
                            const defaultStatement = this.state.statementsList[0].value;
                            if (defaultStatement) {
                                this.setState({
                                    statementSelected: Number(defaultStatement)
                                }, () => RequestsStatements.
                                    getStatement(Number(this.state.statementSelected),
                                        this.resolveGetStatement, this.logError));
                            }
                        } else {
                            LayoutActions.setLoading(false);
                        }
                    }
                );

            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetStatements.name, e));
        }
    }

    private resolveLayoutReady() {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    }

    // State Management Events
    private onLayoutReady(): void {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IStatementRes | undefined = LayoutStore.getResources();

        if (ready) {
            this.setState({
                resources: resources
            }, this.resolveLayoutReady);
        }
        else {
            this.setState({
                componentError: true
            }, () => this.logError(LogData.layoutNoReady(this.onLayoutReady.name)));
        }
    }

    // Lifecycle
    public componentDidMount(): void {
        RequestsStatements.getStatements(this.resolveGetStatements, this.logError);
    }

    public componentWillUnmount(): void {
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);
    }

    public componentDidCatch(error, info): void {
        this.setState({
            componentError: true
        }, () => {
            this.logError(LogData.fromComponentException(this.componentDidCatch.name, error, info));
            this.redirectError(500);
        });
    }

    // Render
    public render(): JSX.Element {
        const {
            componentError,
            statement,
            statementSelected,
            statementsList,

            resources
        } = this.state;

        const {
            classes
        } = this.props;

        let contentPage: JSX.Element | undefined;
        let statementOptions: JSX.Element | undefined;
        if (!componentError && resources) {
            if (statementsList) {
                statementOptions = (
                    <StatementOptions
                        printResources={resources.printing}
                        statements={statementsList}
                        statementSelected={statementSelected}
                        onChangeValue={this.onChangeStatement}
                        resources={resources.statementOptions}
                    />
                );

                contentPage = (
                    <Grid container spacing={3} className={classes.statementContainer}>
                        <Grid item xs={12} md={9}>
                            <StatementInformation
                                statement={statement}
                                resources={resources.statementInformation}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            {statementOptions}
                        </Grid>
                    </Grid>
                );
            }
            else {
                contentPage = (
                    <Card>
                        <CardContent>
                            <Illustration
                                color="secondary"
                                name="under-maintenance"
                                text={resources.lblNoStatemenstAvailable}
                            />
                        </CardContent>
                    </Card>
                );
            }
        }

        return (
            <Layout
                idModule={this.idModule}
                idPage={this.idPage}
                showCart
                showNotifications
            >
                {contentPage}
            </Layout>
        );
    }
}

const StatementViewWithLayout = withLayout(withStyles(styles)(StatementView));
// #endregion

// RenderDOM: Component
ReactDOM.render(<StatementViewWithLayout />, document.getElementById('root'));