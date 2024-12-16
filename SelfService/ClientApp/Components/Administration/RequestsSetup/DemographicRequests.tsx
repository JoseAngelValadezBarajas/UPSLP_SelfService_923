/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: DemographicRequests.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { INotificationRequest } from '../../../Types/Account/INotificationRequest';
import { IDemographicSettings } from '../../../Types/InstitutionSettings/IDemographicSettings';
import { IDemographicRequests } from '../../../Types/InstitutionSettings/IDemographicsRequests';
import { IDemographicRequestsResources } from '../../../Types/Resources/Administration/IDemographicRequestsResources';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Internal components
import DemograhicRequestsModal from './DemographicRequestsModal';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/DemographicRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';

// #endregion Imports

// #region Types
export interface IDemographicRequestsProps {
    lblSuccessSave: string;
}

interface IDemographicRequestsState {
    demographicFormId: number;
    demographicInfo?: IDemographicSettings;
    demographicRequests?: IDemographicRequests[];
    notificationRequest?: INotificationRequest;
    openDemographicRequestsModal: boolean;
    studentId: number;
    studentName: string;
    resources?: IDemographicRequestsResources;
}

const styles = ((theme: Theme) => createStyles({
    fontSize: {
        fontSize: 'small'
    },
    marginLeft: {
        [theme.breakpoints.down('md')]: {
            marginTop: `-${Tokens.spacing30}`
        },
        marginLeft: Tokens.sizingXSmall
    },
    marginTop: {
        [theme.breakpoints.down('md')]: {
            marginTop: `-${Tokens.spacing30}`
        }
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '70%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '15%'
            },
            '& > thead > tr > th:nth-child(3)': {
                width: '15%'
            }
        }
    }
}));

type PropsWithStyles = IDemographicRequestsProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class DemographicRequests extends React.Component<PropsWithStyles, IDemographicRequestsState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IDemographicRequestsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'DemographicRequests';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IDemographicRequestsState {
        let resources: IDemographicRequestsResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            demographicFormId: 0,
            notificationRequest: undefined,
            openDemographicRequestsModal: false,
            resources: resources,
            studentId: 0,
            studentName: ''
        };
    }

    // #region Events
    private onApproveRequest = (): void => {
        try {
            const {
                demographicFormId,
                resources,
                studentId
            } = this.state;

            if (resources) {
                this.setState({
                    notificationRequest: {
                        decision: resources.lblApproved,
                        personId: studentId,
                        type: 0
                    }
                });
            }
            LayoutActions.setLoading(true);
            Requests.postApproveRequest(demographicFormId, this.resolvePostApproveRequest);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onApproveRequest.name, e));
        }
    };

    private onCancelRequest = (): void => {
        try {
            this.setState({
                openDemographicRequestsModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelRequest.name, e));
        }
    };

    private onCloseModal = (): void => {
        try {
            this.setState({
                openDemographicRequestsModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseModal.name, e));
        }
    };

    private onDenyRequest = (): void => {
        try {
            const {
                demographicFormId,
                resources,
                studentId
            } = this.state;

            if (resources) {
                this.setState({
                    notificationRequest: {
                        decision: resources.lblDenied,
                        personId: studentId,
                        type: 1
                    }
                });
            }
            LayoutActions.setLoading(true);
            Requests.postDenyRequest(demographicFormId, this.resolvePostApproveRequest);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDenyRequest.name, e));
        }
    };

    private onViewRequest = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const id: number = Number(event.currentTarget.dataset.id);
            const name: string = String(event.currentTarget.dataset.name);
            this.setState({
                studentId: id,
                studentName: name
            });
            Requests.getDemographicInfo(id, this.resolveGetDemographicInfo);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewRequest.name, e));
        }
    };
    // #endregion Events

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetDemographicInfo = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDemographicInfo.name);

            if (result?.status) {
                this.setState({
                    demographicFormId: result.data.demographicFormId,
                    demographicInfo: result.data,
                    openDemographicRequestsModal: true
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDemographicInfo.name, e));
        }
    };

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

    private resolveGetRequests = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetRequests.name);

            if (result?.status) {
                this.setState({
                    demographicRequests: result.data
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetRequests.name, e));
        }
    };

    private resolvePostApproveRequest = (json: string): void => {
        try {
            const {
                notificationRequest
            } = this.state;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostApproveRequest.name);

            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                if (notificationRequest) {
                    Requests.postSendNotification(notificationRequest, this.resolvePostSendNotification);
                }
                Requests.getRequests(this.resolveGetRequests);
                this.setState({
                    openDemographicRequestsModal: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.badJsonResult(this.resolvePostApproveRequest.name));
        }
    };

    private resolvePostDenyRequest = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDenyRequest.name);

            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                Requests.getRequests(this.resolveGetRequests);
                this.setState({
                    openDemographicRequestsModal: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.badJsonResult(this.resolvePostDenyRequest.name));
        }
    };

    private resolvePostSaveSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveSettings.name);

            if (result?.status) {
                const {
                    lblSuccessSave
                } = this.props;

                LayoutActions.setLoading(false);
                LayoutActions.setAlert({
                    message: lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveSettings.name, e));
        }
    };

    private resolvePostSendNotification = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSendNotification.name);

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
            Requests.getRequests(this.resolveGetRequests);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            classes
        } = this.props;

        const {
            demographicInfo,
            demographicRequests,
            openDemographicRequestsModal,
            resources,
            studentName
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let demographicRequestsModal: JSX.Element | undefined;
        if (resources) {
            if (openDemographicRequestsModal) {
                demographicRequestsModal = (
                    <DemograhicRequestsModal
                        key="demographicRequestsModal"
                        demographicInfo={demographicInfo}
                        open={openDemographicRequestsModal}
                        studentName={studentName}
                        onApproveRequest={this.onApproveRequest}
                        onCancelRequest={this.onCancelRequest}
                        onDenyRequest={this.onDenyRequest}
                        onClose={this.onCloseModal}
                        resources={resources}
                    />
                );
            }
            if (demographicRequests) {
                contentPage = (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Text size="large">
                                    {resources.lblDemographicRequests}
                                </Text>
                            </Grid>
                        </Grid>
                        <Table
                            breakpoint="sm"
                            classes={{ root: classes.table }}
                            id="tblDemographicRequests"
                            variant="expansionPanels"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th">
                                        {resources.lblName}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblDateOfRequest}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblAction}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {demographicRequests.map((request, i) => {
                                    request.avatar.peopleId = request.peopleId;
                                    request.avatar.hasPicture = request.hasPicture;
                                    return (
                                        <TableExpandableRow key={`requestsList_${request.peopleId}_${i}`}>
                                            <TableCell>
                                                <AvatarText
                                                    avatarInfo={request.avatar}
                                                />
                                            </TableCell>
                                            <TableCell columnName={resources.lblDateOfRequest}>
                                                {request.dateOfRequest}
                                            </TableCell>
                                            <TableCell columnName={resources.lblAction}>
                                                <Button
                                                    align="left"
                                                    data-id={request.avatar.personId}
                                                    data-name={request.avatar.fullName}
                                                    id={`btnViewRequest_${i}`}
                                                    textVariantStyling="inherit"
                                                    variant="text"
                                                    onClick={this.onViewRequest}
                                                >
                                                    {resources.lblView}
                                                </Button>
                                            </TableCell>
                                        </TableExpandableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        {demographicRequestsModal}
                    </>
                );
            }
            else {
                contentPage = (
                    <Illustration
                        color="secondary"
                        name="under-maintenance"
                        text={resources.lblNoRequests}
                    />
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
export default withStyles(styles)(DemographicRequests);