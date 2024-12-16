/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AddressesMain.tsx
 * Type: Container component */

// #region Imports
import moment from 'moment';
import React from 'react';

// Core components
import ActionMenu from '@hedtech/powercampus-design-system/react/core/ActionMenu';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import StatusLabel, { StatusLabelType } from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import AddressSave, { IAddressSaveResProps } from './AddressSave';

// Types
import { AddressStatus } from '../../../Types/Enum/AddressStatus';
import { IAddressDetail } from '../../../Types/Account/IAddressDetail';
import { IAddressesMain, IAddressInformation } from '../../../Types/Account/IAddressesMain';
import { IAddressesMainResources } from '../../../Types/Resources/Account/IAddressesMainResources';
import { IAddressOptions } from '../../../Types/Account/IAddressOptions';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Account/AddressesMain';
import RequestsAddressApproval from '../../../Requests/Administration/AddressRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IAddressesMainRes extends IAddressesMainResources {
    addressSave: IAddressSaveResProps;
}

interface IAddressesMainProps {
    isRelative?: boolean;
    personId?: number;
}

interface IAddressesMainState {
    address: IAddressDetail;
    addressList?: IAddressesMain;
    addressOptions?: IAddressOptions;
    cultures: ICultures;
    isAddressSaveOpen: boolean;
    isDeleteModalOpen: boolean;
    preferredSequenceNo?: number;
    resources?: IAddressesMainRes;
    isLoading: boolean;
}

const styles = () => createStyles({
    addresses: {
        display: 'table-cell!important'
    },
    buttonMargin: {
        marginBottom: Tokens.spacing30
    },
    cardContainerLeft: {
        marginLeft: Tokens.spacing30
    },
    cardContainerTop: {
        marginTop: Tokens.spacing40
    },
    statusLabel: {
        margin: Tokens.spacing20
    },
    tableCell: {
        verticalAlign: 'top'
    }
});

type PropsWithStyles = IAddressesMainProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class AddressesMain extends React.Component<PropsWithStyles, IAddressesMainState> {
    private addressDefault: IAddressDetail;
    private addressApprovalRequestId: number | undefined;
    private idModule: string;
    private idPage: string;
    private sendNotification: boolean;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IAddressesMainState>;

    // Constructor
    public constructor(props: any) {
        super(props);

        // #region Initialize Variables and State
        this.addressDefault = {
            addressApprovalRequestId: undefined,
            addressLine1: '',
            addressLine2: '',
            addressLine3: '',
            addressLine4: '',
            addressTypeDesc: '',
            addressTypeId: 0,
            city: '',
            countryDesc: '',
            countryId: 0,
            deleteAddressTypeDesc: '',
            effectiveDate: moment().format('YYYY-MM-DD'),
            houseNumber: '',
            isAddressLine1Invalid: false,
            isAddressTypeInvalid: false,
            isCityInvalid: false,
            isCountryInvalid: false,
            isEffectiveDateEmtpy: false,
            isEffectiveDateInvalid: false,
            isPreferred: false,
            isRecurring: false,
            sequenceNumber: undefined,
            stateDesc: '',
            stateProvinceId: 0,
            zipCode: ''
        };
        this.idModule = 'Account';
        this.idPage = 'AddressesMain';
        this.sendNotification = false;
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IAddressesMainState {
        let resources: IAddressesMainRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            address: this.addressDefault,
            addressList: undefined,
            cultures: LayoutStore.getCultures(),
            isAddressSaveOpen: false,
            isDeleteModalOpen: false,
            isLoading: true,
            preferredSequenceNo: undefined,
            resources: resources
        };
    }

    // #region Events
    private onAddAddress = () => {
        try {
            LayoutActions.showPageLoader();
            const newAddress: IAddressDetail = { ...this.addressDefault };
            this.setState({
                address: newAddress
            }, () => Requests.getAddressOptions(this.resolveGetAddressOptions));
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddAddress.name, e));
        }
    };

    private onChangeDropdown = (optionSelected: IDropDownOption, id: string) => {
        try {
            const {
                address
            } = this.state;
            switch (id) {
                case 'ddlAddressType':
                    address.addressTypeId = Number(optionSelected.value);
                    address.isAddressTypeInvalid = false;
                    break;
                case 'ddlStateProvince':
                    address.stateProvinceId = Number(optionSelected.value);
                    break;
                case 'ddlCountry':
                    address.countryId = Number(optionSelected.value);
                    address.isCountryInvalid = false;
                    break;
            }
            this.setState({
                address: address
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropdown.name, e));

        }
    };

    private onChangeDatePicker = (date: string, _id: string, isValid: boolean) => {
        try {
            const {
                address
            } = this.state;

            address.effectiveDate = date;
            if (isValid) {
                address.isEffectiveDateEmtpy = false;
                address.isEffectiveDateInvalid = false;
            }
            else {
                if (date !== '') {
                    address.isEffectiveDateEmtpy = false;
                }
                address.isEffectiveDateInvalid = date !== '';
            }
            this.setState({
                address: address
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDatePicker.name, e));
        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const {
                address
            } = this.state;
            const id: string = event.target.id;
            switch (id) {
                case 'txtHouseNumber':
                    address.houseNumber = event.target.value;
                    break;
                case 'txtAddressLine1':
                    address.addressLine1 = event.target.value;
                    address.isAddressLine1Invalid = false;
                    break;
                case 'txtAddressLine2':
                    address.addressLine2 = event.target.value;
                    break;
                case 'txtAddressLine3':
                    address.addressLine3 = event.target.value;
                    break;
                case 'txtAddressLine4':
                    address.addressLine4 = event.target.value;
                    break;
                case 'txtPostalCode':
                    address.zipCode = event.target.value;
                    break;
                case 'txtCity':
                    address.city = event.target.value;
                    address.isCityInvalid = false;
                    break;
            }
            this.setState({
                address: address
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onCancelSave = () => {
        try {
            this.addressApprovalRequestId = undefined;
            this.setState({
                isAddressSaveOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelSave.name, e));
        }
    };

    private onSaveAddress = () => {
        try {
            const {
                address,
                addressList
            } = this.state;

            const newAddress: IAddressDetail = { ...address };
            if (!address.addressTypeId) {
                newAddress.isAddressTypeInvalid = true;
            }
            if (!address.addressLine1) {
                newAddress.isAddressLine1Invalid = true;
            }
            if (!address.city) {
                newAddress.isCityInvalid = true;
            }
            if (!address.countryId) {
                newAddress.isCountryInvalid = true;
            }
            if (!address.effectiveDate) {
                newAddress.isEffectiveDateEmtpy = true;
            }

            if (!newAddress.isAddressTypeInvalid
                && !newAddress.isAddressLine1Invalid
                && !newAddress.isCityInvalid
                && !newAddress.isCountryInvalid
                && !newAddress.isEffectiveDateEmtpy
                && !newAddress.isEffectiveDateInvalid) {
                this.addressApprovalRequestId = undefined;
                this.setState({
                    isAddressSaveOpen: false
                }, () => {
                    LayoutActions.showPageLoader();
                    this.sendNotification = Boolean(addressList?.approvalRequired);
                    if (address.addressApprovalRequestId) {
                        RequestsAddressApproval.saveAddressRequests(address.addressApprovalRequestId,
                            address, this.resolveSaveAddress);
                    }
                    else {
                        Requests.saveAddress(address, this.resolveSaveAddress);
                    }
                });
            } else {
                this.setState({
                    address: newAddress
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveAddress.name, e));
        }
    };

    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const {
                address
            } = this.state;

            const id: string = event.target.id;
            switch (id) {
                case 'chkPreferred':
                    address.isPreferred = event.target.checked;
                    break;
                case 'chkRecurring':
                    address.isRecurring = event.target.checked;
                    break;
            }
            this.setState({
                address: address
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onEditAddress = (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const id: number = Number(event.currentTarget.dataset.id);
            const type: string = String(event.currentTarget.dataset.type);

            LayoutActions.showPageLoader();
            switch (type) {
                case 'sequence':
                    Requests.getAddressDetails(id,
                        this.resolveGetAddressDetails);
                    break;
                case 'request':
                    this.addressApprovalRequestId = id;
                    RequestsAddressApproval.getAddressRequestDetails(id,
                        this.resolveGetAddressRequestDetails);
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditAddress.name, e));
        }
    };

    private onOpenDeleteModal = (event: React.ChangeEvent<HTMLInputElement>) => {
        const data: any = event.target.id.split('_');
        const deleteAddressTypeDesc: string = data[2];
        const sequenceNumber: number = Number(data[3]);
        const approvalRequestId: number = Number(data[4]);
        try {
            const newAddress: IAddressDetail = { ...this.addressDefault };
            newAddress.sequenceNumber = Number(sequenceNumber);
            newAddress.deleteAddressTypeDesc = deleteAddressTypeDesc;
            newAddress.addressApprovalRequestId = Number(approvalRequestId);
            this.setState({
                address: newAddress,
                isDeleteModalOpen: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDeleteModal.name, e));
        }
    };

    private onOpenDeleteModalXs = (deleteAddressTypeDesc: string,
        sequenceNumber?: number,
        approvalRequestId?: number
    ) => {
        try {
            const newAddress: IAddressDetail = { ...this.addressDefault };
            newAddress.sequenceNumber = sequenceNumber;
            newAddress.deleteAddressTypeDesc = deleteAddressTypeDesc;
            newAddress.addressApprovalRequestId = approvalRequestId;
            this.setState({
                address: newAddress,
                isDeleteModalOpen: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDeleteModal.name, e));
        }
    };

    private onCloseDeleteModal = () => {
        try {
            const newAddress: IAddressDetail = { ...this.addressDefault };
            this.setState({
                address: newAddress,
                isDeleteModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteModal.name, e));
        }
    };

    private onDeleteAddress = () => {
        try {
            const {
                address
            } = this.state;
            LayoutActions.showPageLoader();
            this.setState({
                isDeleteModalOpen: false
            }, () => {
                if (address.sequenceNumber) {
                    Requests.deleteAddress(address.sequenceNumber, this.resolveDeleteAddress);
                } else if (address.addressApprovalRequestId) {
                    RequestsAddressApproval.deleteAddressRequest(address.addressApprovalRequestId,
                        this.resolveDeleteAddress);
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteAddress.name, e));
        }
    };

    private onMakeAddressPreferred = (event: React.ChangeEvent<HTMLInputElement>) => {
        const data = event.currentTarget.id.split('_');
        const addressTypeId: number = Number(data[2]);
        const sequenceNumber: number = Number(data[3]);
        try {
            if (sequenceNumber) {
                LayoutActions.showPageLoader();
                Requests.savePreferred(addressTypeId, sequenceNumber, this.resolveSaveAddress);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onMakeAddressPreferred.name, e));
        }
    };

    private onMakeAddressPreferredXs = (addressTypeId: number, sequenceNumber?: number) => {
        try {
            if (sequenceNumber) {
                LayoutActions.showPageLoader();
                Requests.savePreferred(addressTypeId, sequenceNumber, this.resolveSaveAddress);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onMakeAddressPreferred.name, e));
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

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const {
                personId
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => {
                    Requests.getAddressesInformation(
                        this.resolveGetAddressesInfo,
                        personId);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetAddressesInfo = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAddressesInfo.name, this.hideAllLoaders);

            if (result?.status) {
                const addressList: IAddressesMain = result.data;

                let preferredAddress: IAddressInformation | undefined;
                let preferredSequenceNo: number | undefined;
                if (addressList.profileAddress && addressList.profileAddress.length > 0) {
                    for (const addressInfo of addressList.profileAddress) {
                        preferredAddress = addressInfo.addresses.find(address =>
                            address.isCurrentAddress && address.isPreferred
                        );
                        if (preferredAddress) {
                            preferredSequenceNo = preferredAddress.sequenceNumber;
                            break;
                        }
                    }
                }
                this.setState({
                    addressList: addressList,
                    preferredSequenceNo: preferredSequenceNo
                }, this.hideAllLoaders);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAddressesInfo.name, e));
        }
    };

    private resolveGetAddressDetails = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAddressDetails.name, this.hideAllLoaders);

            if (result?.status) {
                const addressDetailInfo: {
                    addressDetail: IAddressDetail;
                    editFutureAddress: boolean;
                } = result.data;

                this.setState({
                    address: addressDetailInfo.addressDetail
                }, () => {
                    Requests.getAddressOptions(this.resolveGetAddressOptions);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAddressesInfo.name, e));
        }
    };

    private resolveGetAddressRequestDetails = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAddressRequestDetails.name, this.hideAllLoaders);

            if (result?.status) {
                const address: IAddressDetail = result.data;
                address.addressApprovalRequestId = this.addressApprovalRequestId;
                this.setState({
                    address: address
                }, () => {
                    Requests.getAddressOptions(this.resolveGetAddressOptions);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAddressRequestDetails.name, e));
        }
    };

    private resolveGetAddressOptions = (json: string): void => {
        try {
            const {
                address
            } = this.state;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAddressOptions.name, this.hideAllLoaders);

            if (result?.status) {
                const addressOptions: IAddressOptions = result.data;
                if (!address.sequenceNumber
                    && !address.addressApprovalRequestId
                    && addressOptions
                    && addressOptions.addressTypes
                    && addressOptions.addressTypes.length > 0) {
                    address.addressTypeId = Number(addressOptions.addressTypes[0].value);
                }
                this.setState({
                    address: address,
                    addressOptions: result.data,
                    isAddressSaveOpen: true
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAddressOptions.name, e));
        }
    };

    private resolveSaveAddress = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveAddress.name, this.hideAllLoaders);

            if (result?.status) {
                if (this.sendNotification) {
                    this.sendNotification = false;
                    Requests.postSendNotification(2, this.resolvePostSendNotification);
                }

                if (this.layoutResources) {
                    LayoutActions.setAlert({
                        message: this.layoutResources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }

                Requests.getAddressesInformation(this.resolveGetAddressesInfo);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveAddress.name, e));
        }
    };

    private resolveDeleteAddress = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveDeleteAddress.name, this.hideAllLoaders);

            if (result?.status) {
                const newAddress: IAddressDetail = { ...this.addressDefault };
                this.setState({
                    address: newAddress
                }, () => {
                    Requests.getAddressesInformation(this.resolveGetAddressesInfo);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveDeleteAddress.name, e));
        }
    };

    private resolvePostSendNotification = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSendNotification.name, this.hideAllLoaders);

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
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }
    // #endregion Lifecycle

    // Render
    public render(): JSX.Element {
        const {
            classes,
            isRelative
        } = this.props;

        const {
            address,
            addressList,
            addressOptions,
            cultures,
            isAddressSaveOpen,
            isDeleteModalOpen,
            isLoading,
            preferredSequenceNo,
            resources
        } = this.state;

        const setStatusLabel = (status: number): JSX.Element => {
            let statusLabel: string = '';
            let type: StatusLabelType = 'pending';

            if (resources) {
                switch (status) {
                    case AddressStatus.pending:
                        statusLabel = resources.lblPending;
                        type = 'pending';
                        break;
                    // Case 2: approved - not displayed
                    case AddressStatus.denied:
                        statusLabel = resources.lblDenied;
                        type = 'error';
                        break;
                }
            }
            return (
                <StatusLabel
                    className={classes.statusLabel}
                    id="stsLblStatus"
                    text={statusLabel}
                    type={type}
                />
            );
        };

        let contentPage: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (<ContainerLoader id="ldrAddressesMain" height="md" />);
        }
        else if (resources) {
            if (isAddressSaveOpen && addressOptions) {
                contentPage = (
                    <Card>
                        <CardContent>
                            <AddressSave
                                address={address}
                                addressOptions={addressOptions}
                                cultures={cultures}
                                resources={resources.addressSave}
                                onCancelSave={this.onCancelSave}
                                onChangeCheckbox={this.onChangeCheckbox}
                                onChangeDatePicker={this.onChangeDatePicker}
                                onChangeDropdown={this.onChangeDropdown}
                                onChangeTextField={this.onChangeTextField}
                                onSaveAddress={this.onSaveAddress}
                            />
                        </CardContent>
                    </Card>
                );
            }
            else if (addressList && addressList.addressTypesExist) {
                if (addressList.profileAddress && addressList.profileAddress.length > 0) {
                    contentPage = (
                        <Card>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs>
                                        <Text size="h2">
                                            {resources.lblAddressesInformation}
                                        </Text>
                                    </Grid>
                                    {(addressList.allowChange && !isRelative) && (
                                        <Grid item>
                                            <Tooltip
                                                id="tltAdd"
                                                title={resources.btnAdd}
                                                placement="top"
                                            >
                                                <IconButton
                                                    aria-label={resources.btnAdd}
                                                    onClick={this.onAddAddress}
                                                    id="btnAddAddress"
                                                >
                                                    <Icon name="add" />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    )}
                                </Grid>
                                <br />
                                <Table
                                    breakpoint="sm"
                                    id="tblAddressesList"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblType}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblAddress}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblActiveDate}
                                            </TableCell>
                                            <Hidden smDown>
                                                {addressList.allowChange && !isRelative && (
                                                    <TableCell colspan={2} component="th">
                                                        {resources.lblActions}
                                                    </TableCell>
                                                )}
                                            </Hidden>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {addressList.profileAddress.map((row, i) => (
                                            row.addresses.map((address, iAddress) => (
                                                <TableRow key={`addressesInformation_${i}_${iAddress}`}>
                                                    <TableCell
                                                        classes={{ root: classes.tableCell }}
                                                        columnName={resources.lblType}
                                                    >
                                                        <div>
                                                            <Grid container spacing={0} alignItems="center">
                                                                <Grid item>
                                                                    {(addressList.allowChange && !isRelative)
                                                                        && (address.approvedStatus !== AddressStatus.pending) ? (
                                                                            <Button
                                                                                TextProps={{
                                                                                    display: 'inline',
                                                                                    verticalAlign: 'middle'
                                                                                }}
                                                                                align="left"
                                                                                data-id={address.sequenceNumber ?
                                                                                    address.sequenceNumber
                                                                                    : address.addressApprovalRequestId}
                                                                                data-type={address.sequenceNumber ?
                                                                                    'sequence' : 'request'}
                                                                                id={`addressesInformation_${i}_${iAddress}`}
                                                                                textVariantStyling="inherit"
                                                                                variant="text"
                                                                                onClick={this.onEditAddress}
                                                                            >
                                                                                {row.typeDesc}
                                                                            </Button>
                                                                        ) : (
                                                                            <Text display="inline">
                                                                                {row.typeDesc}
                                                                            </Text>
                                                                        )}
                                                                </Grid>
                                                                <Grid item>
                                                                    {address.isCurrentAddress
                                                                        && address.isPreferred
                                                                        && (address.approvedStatus !== AddressStatus.pending) && (
                                                                            <StatusLabel
                                                                                className={classes.statusLabel}
                                                                                id="stsLblPrimaryAddress"
                                                                                text={resources.addressSave.lblPreferred}
                                                                                type="success"
                                                                            />
                                                                        )}
                                                                </Grid>
                                                            </Grid>
                                                            <Hidden mdUp>
                                                                <>
                                                                    {(addressList.allowChange && !isRelative) && (
                                                                        (address.isPreferred && address.isCurrentAddress)
                                                                        || (address.approvedStatus !== AddressStatus.pending)
                                                                        && (
                                                                            <ActionMenu
                                                                                absolutePosition
                                                                                placement="bottom-start"
                                                                                actions={(address.approvedStatus !== AddressStatus.denied)
                                                                                    && (preferredSequenceNo !== address.sequenceNumber)
                                                                                    && moment(address.effectiveDate).isSameOrBefore(
                                                                                        moment())
                                                                                    ? [{
                                                                                        callback: () =>
                                                                                            this.onMakeAddressPreferredXs(
                                                                                                row.typeId,
                                                                                                address.sequenceNumber
                                                                                            ),
                                                                                        id: 0,
                                                                                        label: resources.lblMakePreferred
                                                                                    }, {
                                                                                        callback: () =>
                                                                                            this.onOpenDeleteModalXs(
                                                                                                row.typeDesc,
                                                                                                address.sequenceNumber,
                                                                                                address.addressApprovalRequestId
                                                                                            ),
                                                                                        id: 1,
                                                                                        label: resources.lblDelete
                                                                                    }] : [{
                                                                                        callback: () =>
                                                                                            this.onOpenDeleteModalXs(
                                                                                                row.typeDesc,
                                                                                                address.sequenceNumber,
                                                                                                address.addressApprovalRequestId
                                                                                            ),
                                                                                        id: 0,
                                                                                        label: resources.lblDelete
                                                                                    }]}
                                                                                id={`amAddresses_ ${i}`}
                                                                            />
                                                                        ))}
                                                                </>
                                                            </Hidden>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell
                                                        classes={{ root: classes.tableCell }}
                                                        columnName={resources.lblAddress}
                                                    >
                                                        <div>
                                                            <Grid container spacing={0} alignItems="center">
                                                                <Grid item>
                                                                    <Text>
                                                                        {`${address.addressLine1} ${address.addressLine2} `}
                                                                        {`${address.addressLine3} ${address.addressLine4} `}
                                                                        {address.addressLine5}
                                                                    </Text>
                                                                </Grid>
                                                                <Grid item>
                                                                    {addressList.approvalRequired
                                                                        && (address.approvedStatus !== AddressStatus.approved)
                                                                        && !isRelative ?
                                                                        setStatusLabel(address.approvedStatus) : undefined}
                                                                </Grid>
                                                            </Grid>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell
                                                        classes={{ root: classes.tableCell }}
                                                        columnName={resources.lblActiveDate}
                                                    >
                                                        {address.activeDate}
                                                    </TableCell>
                                                    <Hidden smDown>
                                                        {(addressList.allowChange && !isRelative) && (
                                                            (address.isPreferred
                                                                && address.isCurrentAddress)
                                                                || (address.approvedStatus === AddressStatus.pending)
                                                                ? <TableCell /> : (
                                                                    <TableCell>
                                                                        <Tooltip
                                                                            id="tltDelete"
                                                                            title={resources.lblDelete}
                                                                            placement="top"
                                                                        >
                                                                            <IconButton
                                                                                aria-label={resources.lblDelete}
                                                                                color="gray"
                                                                                data-type={2}
                                                                                onClick={this.onOpenDeleteModal}
                                                                                id={`btnDelete_${i}_${row.typeDesc}_${address.sequenceNumber}_${address.addressApprovalRequestId}`}
                                                                            >
                                                                                <Icon name="trash" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </TableCell>
                                                                ))}
                                                        {(addressList.allowChange && !isRelative) && (
                                                            (address.isPreferred
                                                                && address.isCurrentAddress)
                                                                || (address.approvedStatus === AddressStatus.pending)
                                                                || (address.approvedStatus === AddressStatus.denied)
                                                                || (preferredSequenceNo === address.sequenceNumber)
                                                                && moment(address.effectiveDate).isSameOrBefore(moment())
                                                                ? <TableCell /> : (
                                                                    <TableCell>
                                                                        <Text
                                                                            display="inline"
                                                                            verticalAlign="middle"
                                                                        >
                                                                            <Button
                                                                                align="left"
                                                                                id={`btnMakePreferred_${i}_${row.typeId}_${address.sequenceNumber}`}
                                                                                textVariantStyling="inherit"
                                                                                variant="text"
                                                                                onClick={this.onMakeAddressPreferred}
                                                                            >
                                                                                {resources.lblMakePreferred}
                                                                            </Button>
                                                                        </Text>
                                                                    </TableCell>
                                                                ))}
                                                    </Hidden>
                                                </TableRow>
                                            ))
                                        ))}
                                    </TableBody>
                                </Table>
                                <ConfirmationDialog
                                    contentText={Format.toString(resources.formatDeleteContent, [address.deleteAddressTypeDesc])}
                                    open={isDeleteModalOpen}
                                    primaryActionOnClick={this.onCloseDeleteModal}
                                    primaryActionText={resources.addressSave.btnCancel}
                                    secondaryActionOnClick={this.onDeleteAddress}
                                    secondaryActionText={resources.lblDelete}
                                    title={resources.lblDeleteTitle}
                                />
                            </CardContent>
                        </Card>
                    );
                }
                else {
                    contentPage = (
                        <Card>
                            <CardContent>
                                {(addressList.allowChange && !isRelative) ? (
                                    <>
                                        <Grid container justifyContent="flex-end">
                                            <Grid item>
                                                <Tooltip
                                                    id="tltAdd"
                                                    title={resources.btnAdd}
                                                    placement="top"
                                                >
                                                    <IconButton
                                                        aria-label={resources.btnAdd}
                                                        onClick={this.onAddAddress}
                                                        id="btnAddAddress"
                                                    >
                                                        <Icon name="add" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                        < Illustration
                                            color="secondary"
                                            internalName="no-activities"
                                            text={resources.lblNoResults}
                                        />
                                    </>
                                ) : (
                                    <Illustration
                                        color="secondary"
                                        name="under-maintenance"
                                        text={resources.lblNoAddresses}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    )
                }
            }
            else {
                contentPage = (
                    <Card>
                        <CardContent>
                            <Illustration
                                color="secondary"
                                name="under-maintenance"
                                text={resources.lblNoAddresses}
                            />
                        </CardContent>
                    </Card>
                );
            }
        }

        return (
            <Grid container className={classes.cardContainerTop}>
                <Grid item xs={12}>
                    {contentPage}
                </Grid>
            </Grid>
        );
    }
}
// #endregion Component

// Component
export default withStyles(styles)(AddressesMain);