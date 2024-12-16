/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: TestScoresMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ITestScoresMainResources } from '../../../Types/Resources/Advising/ITestScoresMainResources';
import { IPeopleTestScores } from '../../../Types/Students/IPeopleTestScores';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Advising/TestScoresMain';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface ITestScoresMainProps {
    impersonateInfo?: IImpersonateInfo;
}

interface ITestScoresMainState {
    componentError: boolean;
    isLoading: boolean;
    testScores?: IPeopleTestScores[];

    resources?: ITestScoresMainResources;
}

const styles = ((theme: Theme) => createStyles({
    headerMargin: {
        [theme.breakpoints.down('sm')]: {
            marginBottom: Tokens.spacing40
        }
    },
    table: {
        [theme.breakpoints.up('sm')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '25%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '20%'
            },
            '& > thead > tr > th:nth-child(3)': {
                width: '15%'
            },
            '& > thead > tr > th:nth-child(4)': {
                width: '15%'
            }
        }
    }
}));

type PropsWithStyles = ITestScoresMainProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class TestScoresMain extends React.Component<PropsWithStyles, ITestScoresMainState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<ITestScoresMainState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Advising';
        this.idPage = 'TestScoresMain';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): ITestScoresMainState {
        let resources: ITestScoresMainResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            isLoading: true,
            testScores: undefined,

            resources: resources
        };
    }

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
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => {
                    Requests.getTestScoresInfo(this.resolveGetTestScoresInfo, impersonateInfo);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetTestScoresInfo = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetTestScoresInfo.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    testScores: result.data
                }, () => {
                    this.hideAllLoaders();
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetTestScoresInfo.name, e));
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
            isLoading,
            testScores,

            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (<ContainerLoader id="ldrAddressesMain" height="md" />);
        }
        else if (!componentError && resources) {

            if (testScores && testScores.length > 0) {
                contentPage = (
                    <Grid container>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Grid container>
                                        <Grid item xs>
                                            <Text size="h2">
                                                {resources.lblTestScoresInfo}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <br />
                                    {testScores.map((score, i) => (
                                        <React.Fragment key={`score_${i}`}>
                                            <br />
                                            <Grid container>
                                                <Grid item xs>
                                                    <Text
                                                        className={classes.headerMargin}
                                                        size="h4"
                                                    >
                                                        {score.description}
                                                    </Text>
                                                </Grid>
                                            </Grid>
                                            <Table
                                                breakpoint="sm"
                                                classes={{ root: classes.table }}
                                                id="tblTestScores"
                                            >
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell component="th">
                                                            <span>
                                                                {resources.lblType}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell component="th">
                                                            <span>
                                                                {resources.lblDate}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell component="th">
                                                            <span>
                                                                {score.isAlpha ? resources.lblAlphaScore1 : resources.lblRawScore}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell component="th">
                                                            <span>
                                                                {score.isAlpha ? resources.lblAlphaScore2 : resources.lblConvertedScore}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell component="th">
                                                            <span>
                                                                {score.isAlpha ? resources.lblAlphaScore3 : resources.lblAlphaScore}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {score.testScoreTypes && score.testScoreTypes.length > 0 ? (
                                                        score.testScoreTypes.map((scoreType, j) => (
                                                            <TableRow key={`scoreType_${j}`}>
                                                                <TableCell
                                                                    columnName={resources.lblType}
                                                                    scope="row"
                                                                >
                                                                    <span>
                                                                        {scoreType.description}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell
                                                                    columnName={resources.lblDate}
                                                                    scope="row"
                                                                >
                                                                    <span>
                                                                        {scoreType.date}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell
                                                                    columnName={score.isAlpha ?
                                                                        resources.lblAlphaScore1
                                                                        : resources.lblRawScore}
                                                                    scope="row"
                                                                >
                                                                    <span>
                                                                        {scoreType.score1}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell
                                                                    columnName={score.isAlpha ?
                                                                        resources.lblAlphaScore2
                                                                        : resources.lblConvertedScore}
                                                                    scope="row"
                                                                >
                                                                    <span>
                                                                        {scoreType.score2}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell
                                                                    columnName={score.isAlpha ?
                                                                        resources.lblAlphaScore3
                                                                        : resources.lblAlphaScore}
                                                                    scope="row"
                                                                >
                                                                    <span>
                                                                        {scoreType.score3}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : undefined}
                                                </TableBody>
                                            </Table>
                                        </React.Fragment>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid >
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
                                text={resources.lblNoResults}
                            />
                        </CardContent>
                    </Card>
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
export default withStyles(styles)(TestScoresMain);