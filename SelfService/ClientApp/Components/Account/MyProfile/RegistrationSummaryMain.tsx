/* Copyright 2023 Ellucian Company L.P. and its affiliates.
 * File: RegistrationSummaryMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import RegistrationSummaryModal from '../../Generic/RegistrationSummaryModal';

// Types
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IStudentCourseMessagesResources } from '@hedtech/powercampus-design-system/types/Resources/IStudentCourseMessagesResources';
import { IStudentCourseStatusResources } from '@hedtech/powercampus-design-system/types/Resources/IStudentCourseStatusResources';
import { IRegistrationSummary } from '../../../Types/Generic/IRegistrationSummary';
import { IRegistrationSummaryMainResources } from '../../../Types/Resources/Account/IRegistrationSummaryMainResources';
import { IRegistrationSummaryModalResources } from '../../../Types/Resources/Generic/IRegistrationSummaryModalResources';


// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Account/RegistrationSummaryMain';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';

// #endregion Imports

// #region Types
export interface IAgreementsMainProps {
    impersonateInfo?: IImpersonateInfo;
}

interface IRegistrationSummaryMainState {
    isLoading: boolean;
    openRegistrationSummaryModal: boolean;
    registrationLogs: IRegistrationSummary[];
    registrationSummary?: IRegistrationSummary;
    resources?: IRegistrationSummaryMainResProps;

    // #region Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    // #endregion Pagination
}

interface IRegistrationSummaryMainResProps extends IRegistrationSummaryMainResources {
    registrationSummaryModal: IRegistrationSummaryModalResources;
    studentCourseMessages: IStudentCourseMessagesResources;
    studentCourseStatus: IStudentCourseStatusResources;
}
// #endregion Types

// #region Component
class RegistrationSummaryMain extends React.Component<IAgreementsMainProps, IRegistrationSummaryMainState> {
    private idModule: string;
    private idPage: string;

    // #region Pagination
    private rowsPerPageOptions: number[];
    private totalRows: number;
    // #endregion Pagination

    public readonly state: Readonly<IRegistrationSummaryMainState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Account';
        this.idPage = 'RegistrationSummaryMain';

        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        this.totalRows = 0;

        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IRegistrationSummaryMainState {
        let resources: IRegistrationSummaryMainResProps | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            isLoading: true,
            openRegistrationSummaryModal: false,
            resources: resources,
            registrationLogs: [],

            // #region Pagination
            page: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: []
            // #endregion Pagination
        };
    }

    // #region Events
    private onOpenRegistrationSummaryModal = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            let registrationLogId: number = Number(event.currentTarget.dataset.id);
            if (registrationLogId > 0) {
                LayoutActions.showPageLoader();
                Requests.getRegistrationSummary(registrationLogId, this.resolveGetRegistrationSummary);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenRegistrationSummaryModal.name, e));
        }
    };

    private onCloseRegistrationSummaryModal = () => {
        try {
            this.setState({
                openRegistrationSummaryModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseRegistrationSummaryModal.name, e));
        }
    };

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
            this.setState({
                page: pageNumber
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
                    Requests.getRegistrationSummaryByPerson(this.resolveGetRegistrationSummaryByPerson, this.props.impersonateInfo);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetRegistrationSummaryByPerson = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetRegistrationSummaryByPerson.name, this.hideAllLoaders);

            if (result?.status) {

                const registrationLogs: IRegistrationSummary[] = result.data;

                this.totalRows = registrationLogs.length;
                const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(this.totalRows);

                this.setState({
                    registrationLogs: registrationLogs,
                    rowsPerPageOptions: rowsPerPageOptions
                }, this.hideAllLoaders);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetRegistrationSummaryByPerson.name, e));
        }
    };

    private resolveGetRegistrationSummary = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetRegistrationSummary.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    registrationSummary: result.data,
                    openRegistrationSummaryModal: true
                }, this.hideAllLoaders);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetRegistrationSummary.name, e));
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
        this.logError(LogData.fromComponentException(this.componentDidCatch.name, error, info));
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            isLoading,
            registrationLogs,
            registrationSummary,
            openRegistrationSummaryModal,
            resources,

            // #region Pagination
            page,
            rowsPerPage,
            rowsPerPageOptions
            // #endregion Pagination
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let registrationSummaryModal: JSX.Element | undefined;

        if (isLoading) {
            contentPage = (<ContainerLoader id="ldrRegistrationSummaryMain" height="md" />);
        }
        else if (resources) {

            if (openRegistrationSummaryModal && registrationSummary) {
                registrationSummaryModal = (
                    <RegistrationSummaryModal
                        open={openRegistrationSummaryModal}
                        registrationSummary={registrationSummary}
                        resources={resources.registrationSummaryModal}
                        studentCourseMessages={resources.studentCourseMessages}
                        studentCourseStatus={resources.studentCourseStatus}
                        onClose={this.onCloseRegistrationSummaryModal}
                    />
                );
            }

            if (registrationLogs.length > 0) {
                contentPage = (
                    <>
                        <Card>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs>
                                        <Text size="h2">
                                            {resources.lblRegistrationSummary}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <br />
                                <Table
                                    breakpoint="sm"
                                    id="tblRegistrationLogs"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblLog}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblYearTerm}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblDate}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {registrationLogs.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map((registrationLog) => (
                                            <TableRow key={`registrationLog_${registrationLog.id}`}>
                                                <TableCell
                                                    columnName={resources.lblLog}
                                                    component="th"
                                                    scope="row"
                                                >
                                                    <Button
                                                        TextProps={{
                                                            display: 'inline',
                                                            verticalAlign: 'middle'
                                                        }}
                                                        align="left"
                                                        data-id={registrationLog.id}
                                                        id={`btnEdit_${registrationLog.id}`}
                                                        textVariantStyling="inherit"
                                                        variant="text"
                                                        onClick={this.onOpenRegistrationSummaryModal}
                                                    >
                                                        {registrationLog.title}
                                                    </Button>
                                                </TableCell>
                                                <TableCell
                                                    columnName={resources.lblYearTerm}
                                                >
                                                    {registrationLog.year}/{registrationLog.term}
                                                </TableCell>
                                                <TableCell
                                                    columnName={resources.lblDate}
                                                >
                                                    {registrationLog.creationDatetime}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Grid container>
                                    <Grid item xs>
                                        <Pagination
                                            count={this.totalRows}
                                            page={page}
                                            rowsPerPage={rowsPerPage}
                                            rowsPerPageOptions={rowsPerPageOptions}
                                            onPageChange={this.onChangePage}
                                            onRowsPerPageChange={this.onChangeRowsPerPage}
                                        />
                                    </Grid>
                                </Grid >
                            </CardContent>
                        </Card>
                        {registrationSummaryModal}
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
export default (RegistrationSummaryMain);