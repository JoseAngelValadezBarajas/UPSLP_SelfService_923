/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AgreementsMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Internal components
import AgreementDetailModal from './AgreementDetailModal';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IAgreementsMainResources } from '../../../Types/Resources/Account/IAgreementsMainResources';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPeopleAgreementDetail } from '../../../Types/Students/IPeopleAgreementDetail';
import { IPeopleAgreements } from '../../../Types/Students/IPeopleAgreements';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Account/AgreementsMain';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IAgreementsMainProps {
    impersonateInfo?: IImpersonateInfo;
    numberCulture: string;
}

interface IAgreementsMainState {
    agreements?: IPeopleAgreements;
    agreementsDetail?: IPeopleAgreementDetail;
    componentError: boolean;
    isAgreementDetailOpen: boolean;
    isLoading: boolean;

    // #region Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    // #endregion Pagination

    resources?: IAgreementsMainResources;
}
// #endregion Types

// #region Component
class AgreementsMain extends React.Component<IAgreementsMainProps, IAgreementsMainState> {
    private idModule: string;
    private idPage: string;

    // #region Pagination
    private preservePage: boolean;
    private preserveRowsPerPage: boolean;
    private rowsPerPageOptions: number[];
    // #endregion Pagination

    public readonly state: Readonly<IAgreementsMainState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Account';
        this.idPage = 'AgreementsMain';

        // #region Pagination
        this.preservePage = false;
        this.preserveRowsPerPage = false;
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        // #endregion Pagination

        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IAgreementsMainState {
        let resources: IAgreementsMainResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            agreements: undefined,
            componentError: false,
            isAgreementDetailOpen: false,
            isLoading: true,

            // #region Pagination
            page: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: [],
            // #endregion Pagination

            resources: resources
        };
    }

    // #region Events
    private setContent = (): void => {
        try {
            const {
                page,
                rowsPerPage
            } = this.state;

            Requests.postGetAgreements(
                page * rowsPerPage,
                rowsPerPage,
                this.resolvePostGetAgreements,
                this.props.impersonateInfo
            );
        }
        catch (e) {
            this.logError(LogData.fromException(this.setContent.name, e));
        }
    };

    private onClickLinkAgreement = (event: React.MouseEvent<HTMLAnchorElement>) => {
        try {
            const ids: string[] = event.currentTarget.id.split('_');
            LayoutActions.showPageLoader();
            Requests.getAgreementDetail(Number(ids[1]), this.resolveGetAgreementDetail);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickLinkAgreement.name, e));
        }
    };

    private onCloseAgreementDetailModal = () => {
        try {
            this.setState({
                isAgreementDetailOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAgreementDetailModal.name, e));
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

    // #region Pagination
    private getRowsPerPageOptions = (maxValue: number): number[] => {
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
    };

    private onChangePage = (_event: any, pageNumber: number): void => {
        try {
            this.preservePage = true;
            this.preserveRowsPerPage = true;

            this.setState({
                page: pageNumber
            }, () => {
                LayoutActions.showPageLoader();
                this.setContent();
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
    // #endregion Pagination

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
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => {
                    this.setContent();
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolvePostGetAgreements = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostGetAgreements.name, this.hideAllLoaders);

            if (result?.status) {
                const agreements: IPeopleAgreements = result.data;
                if (agreements) {
                    const page: number = this.preservePage ? this.state.page : 0;
                    const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(agreements.overallCount);
                    const rowsPerPage: number = this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];
                    this.setState({
                        agreements: agreements,
                        page: page,
                        rowsPerPage: rowsPerPage,
                        rowsPerPageOptions: rowsPerPageOptions
                    }, () => {
                        this.hideAllLoaders();
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostGetAgreements.name, e));
        }
    };

    private resolveGetAgreementDetail = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAgreementDetail.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    agreementsDetail: result.data,
                    isAgreementDetailOpen: true
                }, () => {
                    LayoutActions.hidePageLoader();
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAgreementDetail.name, e));
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
            agreements,
            agreementsDetail,
            componentError,
            isAgreementDetailOpen,
            isLoading,

            // #region Pagination
            page,
            rowsPerPage,
            // #endregion Pagination

            resources
        } = this.state;

        const {
            numberCulture
        } = this.props;

        let contentPage: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (<ContainerLoader id="ldrAddressesMain" height="md" />);
        }
        else if (!componentError && resources) {

            if (agreements && agreements.peopleAgreementList && agreements.peopleAgreementList.length > 0) {
                let firstRow: number = page * rowsPerPage + 1;
                let lastRow: number = page * rowsPerPage + rowsPerPage;
                const totalRows: number = agreements.overallCount ? agreements.overallCount : 0;
                if (lastRow > totalRows) {
                    lastRow = totalRows;
                }
                if (firstRow > lastRow) {
                    firstRow = lastRow;
                }
                contentPage = (
                    <>
                        <Grid container>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs>
                                                <Text size="h2">
                                                    {resources.lblAgreementsInfo}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                        <Grid container justifyContent="flex-end" >
                                            <Grid item>
                                                <Text
                                                    display="inline"
                                                    id="txtFormatResults"
                                                >
                                                    {Format.toString(resources.formatResultsShowing,
                                                        [firstRow.toLocaleString(numberCulture),
                                                        lastRow.toLocaleString(numberCulture),
                                                        totalRows.toLocaleString(numberCulture)
                                                        ])
                                                    }
                                                </Text>
                                            </Grid>
                                        </Grid>
                                        <Table
                                            breakpoint="sm"
                                            id="tblAgreementsList"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell component="th">
                                                        <span>
                                                            {resources.lblAgreement}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell component="th">
                                                        <span>
                                                            {resources.lblYearTerm}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell component="th">
                                                        <span>
                                                            {resources.lblDate}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {agreements.peopleAgreementList.map((row, i) => (
                                                    <TableRow key={`agreementsRow_${i}`}>
                                                        <TableCell
                                                            columnName={resources.lblAgreement}
                                                            scope="row"
                                                        >
                                                            <Link
                                                                id={`agreement_${row.peopleAgreementId}`}
                                                                onClick={this.onClickLinkAgreement}
                                                            >
                                                                {row.title}
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell
                                                            columnName={resources.lblYearTerm}
                                                            scope="row"
                                                        >
                                                            <span>
                                                                {`${row.academicYear}/${row.academicTerm}`}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell
                                                            columnName={resources.lblDate}
                                                            scope="row"
                                                        >
                                                            <span>
                                                                {row.createDatetime}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        {rowsPerPage > 0 ? (
                                            <Grid container>
                                                <Grid item xs>
                                                    <Pagination
                                                        count={totalRows}
                                                        page={page}
                                                        rowsPerPage={rowsPerPage}
                                                        rowsPerPageOptions={this.getRowsPerPageOptions(totalRows)}
                                                        onPageChange={this.onChangePage}
                                                        onRowsPerPageChange={this.onChangeRowsPerPage}
                                                    />
                                                </Grid>
                                            </Grid >
                                        ) : undefined}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        {agreementsDetail ? (
                            <AgreementDetailModal
                                agreementDetail={agreementsDetail}
                                open={isAgreementDetailOpen}
                                onClose={this.onCloseAgreementDetailModal}
                                btnOk={resources.btnOk}
                            />
                        ) : undefined}
                    </>
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
export default AgreementsMain;