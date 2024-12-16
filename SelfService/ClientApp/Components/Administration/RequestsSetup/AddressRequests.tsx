/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AddressRequests.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Internal components
import AddressSave, { IAddressSaveResProps } from '../../Account/MyProfile/AddressSave';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IAddressDetail } from '../../../Types/Account/IAddressDetail';
import { IAddressOptions } from '../../../Types/Account/IAddressOptions';
import { IAddressRequestApproveModels, IAddressRequestList, IAddressRequests } from '../../../Types/Students/IAddressRequests';
import { IAddressRequestsResources } from '../../../Types/Resources/Administration/IAddressRequestsResources';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { INotificationRequest } from '../../../Types/Account/INotificationRequest';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import RequestsAddress from '../../../Requests/Account/AddressesMain';
import Requests from '../../../Requests/Administration/AddressRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IAddressRequestsProps {
    cultures: ICultures;
}

interface IAddressRequestsRes extends IAddressRequestsResources {
    addressSave: IAddressSaveResProps;
}

interface IAddressRequestsState {
    address?: IAddressDetail;
    addressOptions?: IAddressOptions;
    addressRequests?: IAddressRequests;
    allSelected: boolean;
    filterSelected: number;
    isAddressSaveOpen: boolean;
    isAddressSelected: boolean;
    notificationRequest?: INotificationRequest;
    resources?: IAddressRequestsRes;
    studentIds: number[];

    // #region Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    // #endregion Pagination
}

const styles = createStyles({
    alignCell: {
        verticalAlign: 'top'
    },
    alignCheckbox: {
        marginLeft: '0!important'
    },
    alignContent: {
        display: 'inline-block!important'
    }
});

type PropsWithStyles = WithStyles<typeof styles> & IAddressRequestsProps;
// #endregion Types

// #region Component
class AddressRequests extends React.Component<PropsWithStyles, IAddressRequestsState> {
    private idModule: string;
    private idPage: string;
    private personId: number;
    private requestNumber: number;
    private layoutResources?: ILayoutResources;

    // #region Pagination
    private preservePage: boolean;
    private preserveRowsPerPage: boolean;
    private initialRowsPerPage: number;
    private rowsPerPageOptions: number[];
    // #endregion Pagination

    public readonly state: Readonly<IAddressRequestsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'AddressRequests';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.personId = -1;
        this.requestNumber = -1;

        // #region Pagination
        this.preservePage = false;
        this.preserveRowsPerPage = false;
        this.initialRowsPerPage = 5;
        this.rowsPerPageOptions = [this.initialRowsPerPage, 10, 15, 20, 25, 50];
        // #endregion Pagination

        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IAddressRequestsState {
        let resources: IAddressRequestsRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            address: undefined,
            addressOptions: undefined,
            addressRequests: undefined,
            allSelected: false,
            filterSelected: 0,
            isAddressSaveOpen: false,
            isAddressSelected: false,
            notificationRequest: undefined,
            resources: resources,
            studentIds: [],

            // #region Pagination
            page: 0,
            rowsPerPage: this.initialRowsPerPage,
            rowsPerPageOptions: []
            // #endregion Pagination

        };
    }

    // #region Events
    private onApproveAddresses = (): void => {
        try {
            const {
                addressRequests,
                resources
            } = this.state;

            if (resources) {
                this.setState({
                    notificationRequest: {
                        decision: resources.lblApproved,
                        personId: 0,
                        type: 0
                    }
                });
            }

            const addressesApprove: IAddressRequestApproveModels[] = [];
            const studentIds: number[] = [];
            if (addressRequests?.addressRequestList
                && addressRequests.addressRequestList.length > 0) {
                addressRequests.addressRequestList.forEach(request => {
                    if (request.checked) {
                        addressesApprove.push({
                            personId: request.avatar.personId,
                            requestId: request.addressApprovalRequestId
                        });
                        studentIds.push(request.avatar.personId);
                    }
                });
            }
            this.setState({
                studentIds: studentIds
            }, () => {
                if (addressesApprove.length > 0) {
                    LayoutActions.showPageLoader();
                    Requests.approveAddressRequests(addressesApprove, this.resolveApproveAddressRequests);
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onApproveAddresses.name, e));
        }
    };

    private onDenyAddresses = (): void => {
        try {
            const {
                addressRequests,
                resources
            } = this.state;

            if (resources) {
                this.setState({
                    notificationRequest: {
                        decision: resources.lblDenied,
                        personId: 0,
                        type: 1
                    }
                });
            }

            const requestsId: number[] = [];
            const studentIds: number[] = [];
            if (addressRequests?.addressRequestList
                && addressRequests.addressRequestList.length > 0) {
                addressRequests.addressRequestList.forEach(request => {
                    if (request.checked) {
                        requestsId.push(request.addressApprovalRequestId);
                        studentIds.push(request.avatar.personId);
                    }
                });
            }
            this.setState({
                studentIds: studentIds
            }, () => {
                if (requestsId.length > 0) {
                    LayoutActions.showPageLoader();
                    Requests.denyAddressRequests(requestsId, this.resolveDenyAddressRequests);
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDenyAddresses.name, e));
        }
    };

    private onSelectAll = (): void => {
        try {
            const {
                addressRequests,
                allSelected,
                isAddressSelected
            } = this.state;

            if (addressRequests?.addressRequestList
                && addressRequests.addressRequestList.length > 0) {
                let selectAll: boolean = false;
                if (allSelected || !isAddressSelected) {
                    selectAll = !allSelected;
                }
                const newAddressRequests: IAddressRequests = { ...addressRequests };
                newAddressRequests.addressRequestList.forEach(address => address.checked = selectAll);
                this.setState({
                    allSelected: selectAll,
                    addressRequests: newAddressRequests,
                    isAddressSelected: selectAll
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSelectAll.name, e));
        }
    };

    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                addressRequests
            } = this.state;

            if (addressRequests?.addressRequestList
                && addressRequests.addressRequestList.length > 0) {
                const position: number = Number(event.currentTarget.dataset.position);
                const address: IAddressRequestList = addressRequests.addressRequestList[position];
                address.checked = !address.checked;
                const isAddressSelected: boolean = addressRequests.addressRequestList.findIndex(address => address.checked) >= 0;
                const oneNotSelected: boolean = addressRequests.addressRequestList.findIndex(address => !address.checked) >= 0;
                this.setState({
                    allSelected: !oneNotSelected,
                    addressRequests: addressRequests,
                    isAddressSelected: isAddressSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onChangeCheckboxSave = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                address
            } = this.state;

            const id: string = event.target.id;
            if (address) {
                switch (id) {
                    case 'chkRecurring':
                        address.isRecurring = event.target.checked;
                        break;
                }
            }
            this.setState({
                address: address
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckboxSave.name, e));
        }
    };

    private onChangeFilter = (optionSelected: IDropDownOption, _id: string) => {
        try {
            const {
                addressRequests
            } = this.state;

            if (addressRequests?.addressRequestList) {
                addressRequests.addressRequestList.forEach(address => address.checked = false);
            }

            this.preservePage = false;
            this.preserveRowsPerPage = false;
            this.setState({
                allSelected: false,
                filterSelected: Number(optionSelected.value),
                isAddressSelected: false,
                page: 0,
                rowsPerPage: this.initialRowsPerPage
            }, this.setContent);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFilter.name, e));
        }
    };

    private onEditAddress = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const ids: string[] = event.currentTarget.id.split('_');
            if (ids.length > 1) {
                this.requestNumber = Number(ids[1]);
                this.personId = Number(ids[2]);
            }
            LayoutActions.showPageLoader();
            Requests.getAddressRequestDetails(Number(ids[1]), this.resolveGetAddressRequestDetails);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditAddress.name, e));
        }
    };

    private onCancelSave = () => {
        try {
            this.requestNumber = -1;
            this.personId = -1;
            this.setState({
                isAddressSaveOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelSave.name, e));
        }
    };

    private onChangeDatePicker = (date: string, _id: string, isValid: boolean) => {
        try {
            const {
                address
            } = this.state;

            if (address) {
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
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDatePicker.name, e));
        }
    };

    private onChangeDropdown = (optionSelected: IDropDownOption, id: string) => {
        try {
            const {
                address
            } = this.state;

            if (address) {
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
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropdown.name, e));

        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const {
                address
            } = this.state;
            const id: string = event.target.id;

            if (address) {
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
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onSaveAddress = () => {
        try {
            const {
                address
            } = this.state;

            if (address) {
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
                    this.setState({
                        isAddressSaveOpen: false
                    }, () => {
                        LayoutActions.showPageLoader();
                        if (this.requestNumber > -1 && this.personId > -1) {
                            Requests.saveAddressRequests(this.requestNumber, address, this.resolveSaveAddress, this.personId);
                        }
                    });
                } else {
                    this.setState({
                        address: newAddress
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveAddress.name, e));
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
            this.preservePage = true;
            this.preserveRowsPerPage = true;

            this.setState({
                allSelected: false,
                isAddressSelected: false,
                page: pageNumber
            }, this.setContent);
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
    private setContent = (): void => {
        try {
            const {
                page,
                rowsPerPage,
                filterSelected
            } = this.state;

            LayoutActions.showPageLoader();
            Requests.getAddressRequests(page * rowsPerPage, rowsPerPage, filterSelected, this.resolveGetAddressRequests);
        }
        catch (e) {
            this.logError(LogData.fromException(this.setContent.name, e));
        }
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
                = Resolver(json, this.resolveGetResources.name);

            if (result?.status) {
                this.setState({
                    resources: result.data
                }, this.setContent);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetAddressRequests = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAddressRequests.name);

            if (result?.status) {
                const addressRequests: IAddressRequests = result.data;
                if (addressRequests) {
                    const page: number = this.preservePage ? this.state.page : 0;
                    const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(addressRequests.overallCount ?
                        addressRequests.overallCount : 0);
                    const rowsPerPage: number = this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];
                    if (addressRequests.addressRequestList
                        && addressRequests.addressRequestList.length > 0) {
                        addressRequests.addressRequestList.forEach(request => {
                            request.checked = false;
                        });
                    }
                    this.setState({
                        addressRequests: addressRequests,
                        page: page,
                        rowsPerPage: rowsPerPage,
                        rowsPerPageOptions: rowsPerPageOptions
                    }, LayoutActions.hidePageLoader);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAddressRequests.name, e));
        }
    };

    private resolveApproveAddressRequests = (json: string): void => {
        try {
            const {
                notificationRequest,
                studentIds
            } = this.state;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveApproveAddressRequests.name);

            if (result?.status) {
                this.preservePage = false;
                this.preserveRowsPerPage = false;
                this.setState({
                    page: 0,
                    rowsPerPage: this.initialRowsPerPage
                }, this.setContent);
                if (studentIds.length > 0 && notificationRequest) {
                    studentIds.forEach(studentId => {
                        notificationRequest.personId = studentId;
                        Requests.postSendNotification(notificationRequest, this.resolvePostSendNotification);
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveApproveAddressRequests.name, e));
        }
    };

    private resolveDenyAddressRequests = (json: string): void => {
        try {
            const {
                notificationRequest,
                studentIds
            } = this.state;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveDenyAddressRequests.name);

            if (result?.status) {
                this.preservePage = false;
                this.preserveRowsPerPage = false;
                this.setState({
                    page: 0,
                    rowsPerPage: this.initialRowsPerPage
                }, this.setContent);
                if (studentIds.length > 0 && notificationRequest) {
                    studentIds.forEach(studentId => {
                        notificationRequest.personId = studentId;
                        Requests.postSendNotification(notificationRequest, this.resolvePostSendNotification);
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveDenyAddressRequests.name, e));
        }
    };

    private resolveGetAddressRequestDetails = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAddressRequestDetails.name);

            if (result?.status) {
                this.setState({
                    address: result.data
                }, () => {
                    RequestsAddress.getAddressOptions(this.resolveGetAddressOptions);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAddressRequestDetails.name, e));
        }
    };

    private resolveGetAddressOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAddressOptions.name);

            if (result?.status) {
                this.setState({
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
                = Resolver(json, this.resolveSaveAddress.name);

            if (result?.status) {
                this.requestNumber = -1;
                this.personId = -1;
                this.setContent();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveAddress.name, e));
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
            LayoutActions.showPageLoader();
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            address,
            addressRequests,
            addressOptions,
            allSelected,
            filterSelected,
            isAddressSaveOpen,
            isAddressSelected,

            // #region Pagination
            page,
            rowsPerPage,
            // #endregion Pagination

            resources
        } = this.state;

        const {
            classes,
            cultures
        } = this.props;

        let contentPage: JSX.Element | undefined;
        if (resources) {

            const filterOptions: IDropDownOption[] = [
                { description: resources.lblViewAll, value: 0 },
                { description: resources.lblNewAddresses, value: 1 },
                { description: resources.lblAddressChanges, value: 2 }
            ];
            if (addressRequests) {
                let firstRow: number = page * rowsPerPage + 1;
                let lastRow: number = page * rowsPerPage + rowsPerPage;
                const totalRows: number = addressRequests.overallCount ? addressRequests.overallCount : 0;
                if (lastRow > totalRows) {
                    lastRow = totalRows;
                }
                if (firstRow > lastRow) {
                    firstRow = lastRow;
                }

                if (addressRequests.addressRequestList
                    && addressRequests.addressRequestList.length > 0) {
                    contentPage = (
                        isAddressSaveOpen && addressOptions ? (
                            <Grid container>
                                <Grid item xs={12} md={9}>
                                    <AddressSave
                                        address={address}
                                        addressOptions={addressOptions}
                                        cultures={cultures}
                                        isAddressRequest
                                        onCancelSave={this.onCancelSave}
                                        onChangeCheckbox={this.onChangeCheckboxSave}
                                        onChangeDatePicker={this.onChangeDatePicker}
                                        onChangeDropdown={this.onChangeDropdown}
                                        onChangeTextField={this.onChangeTextField}
                                        onSaveAddress={this.onSaveAddress}
                                        resources={resources.addressSave}
                                    />
                                </Grid>
                            </Grid>
                        ) : (
                                <>
                                    <Grid container spacing={3}>
                                        <Grid item xs>
                                            <Text size="large">
                                                {resources.lblAddressChangeRequests}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Dropdown
                                                id="ddlAddressFilter"
                                                label={resources.lblFilter}
                                                options={filterOptions}
                                                value={filterSelected}
                                                onChange={this.onChangeFilter}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container justifyContent="flex-end" >
                                        <Grid item>
                                            <Text
                                                display="inline"
                                                id="txtFormatResults"
                                            >
                                                {Format.toString(resources.formatResultsShowing,
                                                    [firstRow.toLocaleString(cultures.numberCulture),
                                                    lastRow.toLocaleString(cultures.numberCulture),
                                                    totalRows.toLocaleString(cultures.numberCulture)
                                                    ])
                                                }
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <Table
                                        breakpoint="sm"
                                        id="tblAddressRequests"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell component="th">
                                                    <Checkbox
                                                        checked={allSelected || isAddressSelected}
                                                        classes={{
                                                            focused: classes.alignCheckbox,
                                                            root: classes.alignCheckbox
                                                        }}
                                                        id="chkSelectAll"
                                                        indeterminate={!allSelected && isAddressSelected}
                                                        inputProps={{
                                                            'aria-label': this.layoutResources?.lblSelectAll
                                                        }}
                                                        onChange={this.onSelectAll}
                                                    />
                                                    <span>
                                                        {resources.lblName}
                                                    </span>
                                                </TableCell>
                                                <TableCell component="th">
                                                    <span>
                                                        {resources.lblCurrentAddress}
                                                    </span>
                                                </TableCell>
                                                <TableCell component="th">
                                                    <span>
                                                        {resources.lblNewAddress}
                                                    </span>
                                                </TableCell>
                                                <TableCell component="th">
                                                    <span>
                                                        {resources.lblEdit}
                                                    </span>
                                                </TableCell>
                                                <TableCell component="th">
                                                    <span>
                                                        {resources.lblRequestDate}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {addressRequests.addressRequestList.map((row, i) => {
                                                row.avatar.hasPicture = row.hasPicture;
                                                row.avatar.peopleId = row.peopleId;
                                                return (
                                                    <TableRow key={`addressRequestRow_${i}`}>
                                                        <TableCell
                                                            columnName={resources.lblName}
                                                            scope="row"
                                                        >
                                                            <AvatarText
                                                                CheckboxProps={{
                                                                    checked: Boolean(addressRequests.addressRequestList[i].checked),
                                                                    id: `chkAddressReq_${i}`,
                                                                    inputProps: {
                                                                        'aria-label': Format.toString(resources.formatSelectUser, [row.avatar.fullName]),
                                                                        'data-position': i
                                                                    },
                                                                    onChange: this.onChangeCheckbox
                                                                }}
                                                                avatarInfo={row.avatar}
                                                                id={`avtPerson_${i}`}
                                                            />
                                                        </TableCell>
                                                        <TableCell
                                                            classes={{ root: classes.alignCell }}
                                                            columnName={resources.lblCurrentAddress}
                                                            scope="row"
                                                        >
                                                            {row.currentAddress ? (
                                                                <span className={classes.alignContent}>
                                                                    <Text>
                                                                        {row.currentAddress.addressTypeDesc ?
                                                                            row.currentAddress.addressTypeDesc : ''}
                                                                    </Text>
                                                                    <Text>
                                                                        {row.currentAddress.houseNumber ?
                                                                            row.currentAddress.houseNumber : ''}
                                                                    </Text>
                                                                    <Text>
                                                                        {row.currentAddress.addressLine1 ?
                                                                            row.currentAddress.addressLine1 : ''}
                                                                    </Text>
                                                                    <Text>
                                                                        {row.currentAddress.addressLine2 ?
                                                                            row.currentAddress.addressLine2 : ''}
                                                                    </Text>
                                                                    <Text>
                                                                        {row.currentAddress.addressLine3 ?
                                                                            row.currentAddress.addressLine3 : ''}
                                                                    </Text>
                                                                    <Text>
                                                                        {row.currentAddress.addressLine4 ?
                                                                            row.currentAddress.addressLine4 : ''}
                                                                    </Text>
                                                                    <Text>
                                                                        {`${row.currentAddress.city ?
                                                                            `${row.currentAddress.city}, ` : ''}`
                                                                            + `${row.currentAddress.stateDesc ?
                                                                                row.currentAddress.stateDesc : ''} `
                                                                            + `${row.currentAddress.zipCode ?
                                                                                row.currentAddress.zipCode : ''}`}
                                                                    </Text>
                                                                    <Text>
                                                                        {row.currentAddress.countryDesc ?
                                                                            row.currentAddress.countryDesc : ''}
                                                                    </Text>
                                                                    <Text>
                                                                        {row.currentAddress.effectiveDate ?
                                                                            row.currentAddress.effectiveDate : ''}
                                                                    </Text>
                                                                </span>
                                                            ) : <span />}
                                                        </TableCell>
                                                        <TableCell
                                                            columnName={resources.lblNewAddress}
                                                            scope="row"
                                                        >
                                                            <span className={classes.alignContent}>
                                                                <Text>
                                                                    {row.newAddress.addressTypeDesc ?
                                                                        row.newAddress.addressTypeDesc : ''}
                                                                </Text>
                                                                <Text>
                                                                    {row.newAddress.houseNumber ?
                                                                        row.newAddress.houseNumber : ''}
                                                                </Text>
                                                                <Text>
                                                                    {row.newAddress.addressLine1 ?
                                                                        row.newAddress.addressLine1 : ''}
                                                                </Text>
                                                                <Text>
                                                                    {row.newAddress.addressLine2 ?
                                                                        row.newAddress.addressLine2 : ''}
                                                                </Text>
                                                                <Text>
                                                                    {row.newAddress.addressLine3 ?
                                                                        row.newAddress.addressLine3 : ''}
                                                                </Text>
                                                                <Text>
                                                                    {row.newAddress.addressLine4 ?
                                                                        row.newAddress.addressLine4 : ''}
                                                                </Text>
                                                                <Text>
                                                                    {`${row.newAddress.city ?
                                                                        `${row.newAddress.city}, ` : ''}`
                                                                        + `${row.newAddress.stateDesc ?
                                                                            row.newAddress.stateDesc : ''} `
                                                                        + `${row.newAddress.zipCode ?
                                                                            row.newAddress.zipCode : ''}`}
                                                                </Text>
                                                                <Text>
                                                                    {row.newAddress.countryDesc ?
                                                                        row.newAddress.countryDesc : ''}
                                                                </Text>
                                                                <Text>
                                                                    {row.newAddress.effectiveDate ?
                                                                        row.newAddress.effectiveDate : ''}
                                                                </Text>

                                                            </span>
                                                        </TableCell>
                                                        <TableCell
                                                            columnName={resources.lblEdit}
                                                            scope="row"
                                                        >
                                                            <IconButton
                                                                id={`btn_${row.addressApprovalRequestId}_${row.avatar.personId}`}
                                                                onClick={this.onEditAddress}
                                                                title={resources.lblEdit}
                                                            >
                                                                <Icon name="edit" />
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell
                                                            columnName={resources.lblRequestDate}
                                                            scope="row"
                                                        >
                                                            <span>
                                                                {row.requestDate}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
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
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <ButtonGroup id="bgApproveAddress">
                                                <Button
                                                    id="btnSave"
                                                    onClick={this.onApproveAddresses}
                                                >
                                                    {resources.btnApprove}
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    id={'btnCancel'}
                                                    onClick={this.onDenyAddresses}
                                                >
                                                    {resources.btnDeny}
                                                </Button>
                                            </ButtonGroup>
                                        </Grid>
                                    </Grid>
                                </>
                            )
                    );
                }
                else {
                    contentPage = (
                        <Illustration
                            color="secondary"
                            name="under-maintenance"
                            text={resources.lblNoResults}
                        />
                    );
                }
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
export default withStyles(styles)(AddressRequests);