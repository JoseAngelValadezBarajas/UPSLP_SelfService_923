/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: InquiryLayoutList.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IAppSetupForm } from '../../../Types/Form/IAppSetupForm';
import { IInquiryLayoutListResources } from '../../../Types/Resources/Administration/IInquiryLayoutListResources';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/FormLayouts';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
interface IInquiryLayoutListState {
    appFormsSetup: IAppSetupForm[];
    componentError: boolean;
    expanded: boolean | number;
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    total: number;

    // resources
    resources?: IInquiryLayoutListResources;
}

const styles = (() => createStyles({
    table: {
        '& > tbody > tr > th:nth-child(2)': {
            width: '70%'
        },
        '& > tbody > tr > th:nth-child(3)': {
            width: '30%'
        },
        '& > thead > tr > th:nth-child(2)': {
            width: '70%'
        },
        '& > thead > tr > th:nth-child(3)': {
            width: '30%'
        }
    }
}));

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion Types

// #region Component
class InquiryLayoutList extends React.Component<PropsWithStyles, IInquiryLayoutListState> {
    private idModule: string;
    private idPage: string;
    private rowsPerPageOptions: number[];

    public readonly state: Readonly<IInquiryLayoutListState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'InquiryLayoutList';
        this.state = this.getInitialState();
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IInquiryLayoutListState {
        let resources: IInquiryLayoutListResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            appFormsSetup: [],
            componentError: false,
            expanded: false,
            page: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: [],
            total: 0,

            resources: resources
        };
    }

    // #region Functions
    private getRowsPerPageOptions(maxValue: number): number[] {
        const rowsPerPageOptions: number[] = [];
        try {
            this.rowsPerPageOptions.forEach(option => {
                if (option < maxValue) {
                    rowsPerPageOptions.push(option);
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.getRowsPerPageOptions.name, e));
        }
        return rowsPerPageOptions;
    }

    private onChangePage = (_event: any, page: number): void => {
        try {
            const {
                rowsPerPage
            } = this.state;

            this.setState({
                page: page
            }, () => {
                LayoutActions.setLoading(true);
                Requests.getInquiryFormLayouts(page * rowsPerPage, rowsPerPage, this.resolveGetAppFormLayouts, this.logError);
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePage.name, e));
        }
    };

    private onChangeRowsPerPage = (event: any): void => {
        try {
            this.setState({
                page: 0,
                rowsPerPage: Number(event.target.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRowsPerPage.name, e));
        }
    };

    private onChangeExpansionPanel = (stepNumber: number) => (): void => {
        try {
            this.setState({
                expanded: stepNumber
            });
            console.log(stepNumber);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeExpansionPanel.name, e));
        }
    };

    private onClickAddMore = (): void => {
        try {
            window.location.href = `${Constants.webUrl}/Administration/InquirySetup/1`;
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickAddMore.name, e));
        }
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

    private resolveGetAppFormLayouts = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAppFormLayouts.name);

            if (result?.status) {
                const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(result.data.overallCount
                    ? result.data.overallCount : 0);
                this.setState({
                    appFormsSetup: result.data.formLayouts,
                    rowsPerPageOptions,
                    total: result.data.overallCount
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAppFormLayouts.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            const {
                page,
                rowsPerPage
            } = this.state;

            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getInquiryFormLayouts(page, rowsPerPage, this.resolveGetAppFormLayouts, this.logError);
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
            appFormsSetup,
            page,
            rowsPerPage,
            resources,
            rowsPerPageOptions,
            total
        } = this.state;

        let table: JSX.Element | undefined;
        let contentPage: JSX.Element | undefined;

        if (resources) {
            let pagination: JSX.Element | undefined;
            if (appFormsSetup && appFormsSetup.length > 0) {
                table = (
                    <Table
                        breakpoint="sm"
                        classes={{ root: classes.table }}
                        id="tblLayoutList"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell component="th">
                                    {resources.lblFormName}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblDescription}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appFormsSetup.map((layout, i) => {

                                const linkToFormSetup = (): void => {
                                    window.location.assign(`${Constants.webUrl}/Administration/InquirySetup/${layout.formLayoutId}`);
                                };

                                return (
                                    <TableRow
                                        key={`layoutRow_${i}`}
                                    >
                                        <TableCell
                                            columnName={resources.lblFormName}
                                            component="th"
                                            scope="row"
                                        >
                                            <Button
                                                TextProps={{
                                                    weight: 'strong'
                                                }}
                                                align="left"
                                                id={`lnkLayout_${i}`}
                                                textVariantStyling="inherit"
                                                variant="text"
                                                onClick={linkToFormSetup}
                                            >
                                                {layout.name}
                                            </Button>
                                        </TableCell>
                                        <TableCell
                                            columnName={resources.lblDescription}
                                            component="th"
                                            scope="row"
                                        >
                                            {layout.description}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                );

                pagination = (
                    <Grid item xs>
                        <Pagination
                            count={total}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={rowsPerPageOptions}
                            onPageChange={this.onChangePage}
                            onRowsPerPageChange={this.onChangeRowsPerPage}
                        />
                    </Grid>
                );
            }

            contentPage = (
                <>
                    <Grid item xs>
                        <Text size="large">
                            {resources.lblInstructions}
                        </Text>
                    </Grid>
                    <br />
                    <Grid item xs>
                        <Button
                            id="btnAddForm"
                            onClick={this.onClickAddMore}
                        >
                            {resources.lblAddForm}
                        </Button>
                    </Grid>
                    <br />
                    <Grid item xs>
                        {table}
                    </Grid>
                    {pagination}
                </>
            );
        }

        return (
            <Grid container spacing={3}>
                <Grid item xs>
                    {contentPage}
                </Grid>
            </Grid>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(InquiryLayoutList);