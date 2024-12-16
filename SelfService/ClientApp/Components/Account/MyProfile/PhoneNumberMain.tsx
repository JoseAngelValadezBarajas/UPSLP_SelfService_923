/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: PhoneNumberMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import ActionMenu from '@hedtech/powercampus-design-system/react/core/ActionMenu';

// Internal components
import PhoneNumberSave, { IPhoneNumberSaveResProps } from './PhoneNumberSave';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IPersonPhone } from '../../../Types/Account/IPersonPhone';
import { IProfilePhone } from '../../../Types/Account/IProfilePhone';
import { IPhoneNumberMainResources } from '../../../Types/Resources/Account/IPhoneNumberMainResources';
import { IConfirmationDialogResources } from '../../../Types/Resources/Generic/IConfirmationDialogResources';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { hasJustNumbersAndLetters } from '@hedtech/powercampus-design-system/helpers/CharRegExp';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Account/PhoneNumberMain';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IPhoneNumberMainRes extends IPhoneNumberMainResources {
    deletePhoneNumberConfirmationDialog: IConfirmationDialogResources;
    phoneNumberSave: IPhoneNumberSaveResProps;
}

interface IPhoneNumberMainState {
    allowEdit: boolean;
    componentError: boolean;
    countryOptions?: IDropDownOption[];
    doNotCallReasons?: IDropDownOption[];
    isLoading: boolean;
    isPhoneNumberSaveOpen: boolean;
    isDeleteModalOpen: boolean;
    phoneNumbers?: IProfilePhone[];
    phoneNumber?: IPersonPhone;
    phoneTypeOptions?: IDropDownOption[];
    resources?: IPhoneNumberMainRes;
}

const styles = createStyles({
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

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion Types

// #region Component
class PhoneNumberMain extends React.Component<PropsWithStyles, IPhoneNumberMainState> {
    private deleteDesc?: string;
    private deleteId?: number;
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;
    private phoneDefault: IPersonPhone;
    private phoneFormatChar: string;

    public readonly state: Readonly<IPhoneNumberMainState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Account';
        this.idPage = 'PhoneNumberMain';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.phoneDefault = {
            countryId: 0,
            description: null,
            doNotCallReasonId: null,
            format: undefined,
            id: 0,
            isPrimary: false,
            number: '',
            type: '',

            countryIdModified: false,
            formattedNumber: undefined,
            isDuplicated: false,
            numberModified: false,
            typeModified: false
        };
        this.phoneFormatChar = '@';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IPhoneNumberMainState {
        let resources: IPhoneNumberMainRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            allowEdit: false,
            componentError: false,
            isDeleteModalOpen: false,
            isLoading: true,
            isPhoneNumberSaveOpen: false,
            resources: resources
        };
    }

    // #region Events
    private onAddPhoneNumber = () => {
        try {
            LayoutActions.showPageLoader();
            const newPhoneNumber: IPersonPhone = { ...this.phoneDefault };
            this.setState({
                phoneNumber: newPhoneNumber
            }, () => Requests.getPhoneOptions(this.resolveGetPhoneOptions, this.logError));
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddPhoneNumber.name, e));
        }
    };

    private onChangeDropdown = (optionSelected: IDropDownOption, id: string) => {
        try {
            const {
                phoneNumber
            } = this.state;

            if (phoneNumber) {
                switch (id) {
                    case 'ddlCountry':
                        phoneNumber.countryId = Number(optionSelected.value);
                        phoneNumber.countryIdModified = true;
                        phoneNumber.format = optionSelected.complement;
                        phoneNumber.formattedNumber = Format.toPhone(phoneNumber.number, phoneNumber.format, this.phoneFormatChar);
                        break;
                    case 'ddlDoNotCallReason':
                        phoneNumber.doNotCallReasonId = Number(optionSelected.value);
                        if (!phoneNumber.doNotCallReasonId) {
                            phoneNumber.doNotCallReasonId = null;
                        }
                        break;
                    case 'ddlType':
                        phoneNumber.type = String(optionSelected.value);
                        phoneNumber.typeModified = true;
                        break;
                }
                this.setState({
                    phoneNumber: phoneNumber
                }, this.verifyDuplicity);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropdown.name, e));

        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const {
                phoneNumber
            } = this.state;

            const id: string = event.target.id;

            if (phoneNumber) {
                switch (id) {
                    case 'txtNumber':
                        if (!Boolean(event.target.value) || hasJustNumbersAndLetters(event.target.value)) {
                            phoneNumber.number = event.target.value;
                            phoneNumber.numberModified = true;
                            phoneNumber.formattedNumber = Format.toPhone(phoneNumber.number, phoneNumber.format, this.phoneFormatChar);
                        }
                        break;
                    case 'txtDescription':
                        phoneNumber.description = event.target.value;
                        if (!phoneNumber.description) {
                            phoneNumber.description = null;
                        }
                        break;
                }
                this.setState({
                    phoneNumber: phoneNumber
                }, this.verifyDuplicity);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onCancelSave = () => {
        try {
            this.setState({
                countryOptions: undefined,
                doNotCallReasons: undefined,
                isPhoneNumberSaveOpen: false,
                phoneNumber: undefined,
                phoneTypeOptions: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelSave.name, e));
        }
    };

    private onSavePhoneNumber = () => {
        try {
            const {
                phoneNumber,
                phoneNumbers
            } = this.state;

            if (phoneNumber) {
                phoneNumber.countryIdModified = true;
                phoneNumber.numberModified = true;
                phoneNumber.typeModified = true;

                phoneNumber.isPrimary = !Boolean(phoneNumbers && phoneNumbers.find(p => p.isPrimary));

                this.setState({
                    phoneNumber: phoneNumber
                });
                if (Boolean(phoneNumber.type)
                    && Boolean(phoneNumber.number)
                    && Boolean(phoneNumber.countryId)
                    && !phoneNumber.isDuplicated) {
                    LayoutActions.showPageLoader();
                    Requests.savePhoneNumber(phoneNumber, this.resolveSavePhoneNumber, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSavePhoneNumber.name, e));
        }
    };

    private onEditPhoneNumber = (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const id: number = Number(event.currentTarget.dataset.id);
            LayoutActions.showPageLoader();
            Requests.getPhoneDetails(id, this.resolveGetPhoneDetails, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditPhoneNumber.name, e));
        }
    };

    private onOpenDeleteModal = (event: any) => {
        try {
            const {
                phoneNumbers
            } = this.state;

            let id: number = Number(event.currentTarget.dataset.id);
            let foundPhone: IProfilePhone | undefined;
            if (phoneNumbers && (foundPhone = phoneNumbers.find(p => p.id === id))) {
                this.deleteDesc = foundPhone.typeDesc;
                this.deleteId = id;
                this.setState({
                    isDeleteModalOpen: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDeleteModal.name, e));
        }
    };

    private onCloseDeleteModal = () => {
        try {
            this.deleteDesc = undefined;
            this.deleteId = undefined;
            this.setState({
                isDeleteModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteModal.name, e));
        }
    };

    private onDeletePhoneNumber = () => {
        try {
            const {
                phoneNumbers
            } = this.state;

            if (phoneNumbers && this.deleteId !== undefined) {
                LayoutActions.showPageLoader();
                Requests.deletePhoneNumber(this.deleteId,
                    this.resolveDeletePhoneNumber,
                    this.logError);
                this.onCloseDeleteModal();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeletePhoneNumber.name, e));
        }
    };

    private onSetPhoneNumberAsPrimary = (event: React.MouseEvent<HTMLLIElement>) => {
        try {
            let id: number = Number(event.currentTarget.dataset.id);
            if (id) {
                LayoutActions.showPageLoader();
                Requests.setPhoneNumberAsPrimary(Number(id), this.resolveSetPhoneNumberAsPrimary, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSetPhoneNumberAsPrimary.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private verifyDuplicity = (): void => {
        try {
            const {
                phoneNumber,
                phoneNumbers
            } = this.state;

            if (phoneNumber && phoneNumbers) {
                phoneNumber.isDuplicated = Boolean(phoneNumbers.find(p => p.number === phoneNumber.number
                    && p.countryId === phoneNumber.countryId
                    && p.type === phoneNumber.type
                    && p.id !== phoneNumber.id
                ));
                this.setState({
                    phoneNumber: phoneNumber
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.verifyDuplicity.name, e));
        }
    };

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
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => Requests.getPhones(this.resolveGetPhones, this.logError));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveDeletePhoneNumber = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveDeletePhoneNumber.name, this.hideAllLoaders);

            if (result?.status) {
                if (this.layoutResources) {
                    LayoutActions.setAlert({
                        message: this.layoutResources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                Requests.getPhones(this.resolveGetPhones, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveDeletePhoneNumber.name, e));
        }
    };

    private resolveGetPhoneDetails = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPhoneDetails.name, this.hideAllLoaders);

            if (result?.status) {
                const phoneNumber: IPersonPhone = result.data;
                if (phoneNumber) {
                    if (!phoneNumber.description) {
                        phoneNumber.description = null;
                    }
                    if (!phoneNumber.doNotCallReasonId) {
                        phoneNumber.doNotCallReasonId = null;
                    }
                    phoneNumber.formattedNumber = Format.toPhone(phoneNumber.number, phoneNumber.format, this.phoneFormatChar);
                }
                this.setState({
                    phoneNumber: phoneNumber
                }, () => {
                    this.verifyDuplicity();
                    Requests.getPhoneOptions(this.resolveGetPhoneOptions, this.logError);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPhoneDetails.name, e));
        }
    };

    private resolveGetPhoneOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPhoneOptions.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    countryOptions: result.data.countryOptions,
                    doNotCallReasons: result.data.doNotCallReasons,
                    isPhoneNumberSaveOpen: true,
                    phoneTypeOptions: result.data.phoneTypeOptions
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPhoneOptions.name, e));
        }
    };

    private resolveGetPhones = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPhones.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    allowEdit: result.data.allowEdit,
                    phoneNumbers: result.data.phoneNumbers
                }, this.hideAllLoaders);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPhones.name, e));
        }
    };

    private resolveSavePhoneNumber = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSavePhoneNumber.name, this.hideAllLoaders);

            if (result?.status) {
                Requests.getPhones(this.resolveGetPhones, this.logError);
                this.onCancelSave();
                if (this.layoutResources) {
                    LayoutActions.setAlert({
                        message: this.layoutResources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSavePhoneNumber.name, e));
        }
    };

    private resolveSetPhoneNumberAsPrimary = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSetPhoneNumberAsPrimary.name, this.hideAllLoaders);

            if (result?.status) {
                if (this.layoutResources) {
                    LayoutActions.setAlert({
                        message: this.layoutResources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                Requests.getPhones(this.resolveGetPhones, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSetPhoneNumberAsPrimary.name, e));
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
            allowEdit,
            componentError,
            countryOptions,
            doNotCallReasons,
            isDeleteModalOpen,
            isLoading,
            isPhoneNumberSaveOpen,
            phoneNumber,
            phoneNumbers,
            phoneTypeOptions,
            resources
        } = this.state;

        const {
            classes
        } = this.props;

        let contentPage: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (<ContainerLoader id="ldrAddressesMain" height="md" />);
        }
        else if (!componentError && resources) {
            if (isPhoneNumberSaveOpen && phoneNumber) {
                contentPage = (
                    <Card>
                        <CardContent>
                            <PhoneNumberSave
                                countryOptions={countryOptions}
                                doNotCallReasons={doNotCallReasons}
                                phoneNumber={phoneNumber}
                                phoneTypeOptions={phoneTypeOptions}
                                resources={resources.phoneNumberSave}
                                onCancelSave={this.onCancelSave}
                                onChangeDropdown={this.onChangeDropdown}
                                onChangeTextField={this.onChangeTextField}
                                onSave={this.onSavePhoneNumber}
                            />
                        </CardContent>
                    </Card>
                );
            }
            else if (phoneNumbers && phoneNumbers.length > 0) {
                contentPage = (
                    <>
                        <Card>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs>
                                        <Text size="h2">
                                            {resources.lblPhoneNumbersHeader}
                                        </Text>
                                    </Grid>
                                    {allowEdit && (
                                        <Grid item>
                                            <Tooltip
                                                id="tltAdd"
                                                title={resources.btnAdd}
                                                placement="top"
                                            >
                                                <IconButton
                                                    aria-label={resources.btnAdd}
                                                    onClick={this.onAddPhoneNumber}
                                                    id="btnAddPhoneNumber"
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
                                    id="tblPhoneNumbersList"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblPhoneType}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblDescription}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblPhoneNumber}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblCountry}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblDoNotCallReason}
                                            </TableCell>
                                            <Hidden smDown>
                                                {allowEdit && (
                                                    <TableCell colspan={2} component="th">
                                                        {resources.lblActions}
                                                    </TableCell>
                                                )}
                                            </Hidden>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {phoneNumbers.map((phone, iPhone) => (
                                            <TableRow key={`phoneNumbersInformation_${iPhone}`}>
                                                <TableCell
                                                    classes={{ root: classes.tableCell }}
                                                    columnName={resources.lblPhoneType}
                                                    component="th"
                                                    scope="row"
                                                >
                                                    <div>
                                                        <Grid container spacing={0} alignItems="center">
                                                            <Grid item>
                                                                {allowEdit ? (
                                                                    <Button
                                                                        TextProps={{
                                                                            display: 'inline',
                                                                            verticalAlign: 'middle'
                                                                        }}
                                                                        align="left"
                                                                        data-id={phone.id}
                                                                        id={`btnEdit_${iPhone}`}
                                                                        textVariantStyling="inherit"
                                                                        variant="text"
                                                                        onClick={this.onEditPhoneNumber}
                                                                    >
                                                                        {phone.typeDesc}
                                                                    </Button>
                                                                ) : (
                                                                    <Text display="inline">
                                                                        {phone.typeDesc}
                                                                    </Text>
                                                                )}
                                                            </Grid>
                                                            <Grid item>
                                                                {phone.isPrimary && (
                                                                    <StatusLabel
                                                                        className={classes.statusLabel}
                                                                        id="stsLblprimaryPhone"
                                                                        text={resources.lblPrimary}
                                                                        type="success"
                                                                    />
                                                                )}
                                                            </Grid>
                                                        </Grid>
                                                        <Hidden mdUp>
                                                            {allowEdit && (
                                                                (!phone.isPrimary
                                                                    && (
                                                                        <ActionMenu
                                                                            absolutePosition
                                                                            actions={[
                                                                                {
                                                                                    callback: this.onSetPhoneNumberAsPrimary,
                                                                                    id: phone.id,
                                                                                    label: resources.btnSetAsPrimary
                                                                                }, {
                                                                                    callback: this.onOpenDeleteModal,
                                                                                    id: phone.id,
                                                                                    label: resources.btnDelete
                                                                                }
                                                                            ]}
                                                                            id={`amPhoneNumber_${iPhone}`}
                                                                        />
                                                                    )
                                                                ))}
                                                        </Hidden>
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    classes={{ root: classes.tableCell }}
                                                    columnName={resources.lblDescription}
                                                >
                                                    <span>
                                                        {phone.description}
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    classes={{ root: classes.tableCell }}
                                                    columnName={resources.lblPhoneNumber}
                                                >
                                                    <span>
                                                        {phone.formattedNumber}
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    classes={{ root: classes.tableCell }}
                                                    columnName={resources.lblCountry}
                                                >
                                                    <span>
                                                        {phone.countryDesc}
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    classes={{ root: classes.tableCell }}
                                                    columnName={resources.lblDoNotCallReason}
                                                >
                                                    <span>
                                                        {phone.doNotCallReasonDesc}
                                                    </span>
                                                </TableCell>
                                                <Hidden smDown>
                                                    {allowEdit && (
                                                        (!phone.isPrimary
                                                            ? (
                                                                <>
                                                                    <TableCell>
                                                                        <Tooltip
                                                                            id="tltDelete"
                                                                            title={resources.btnDelete}
                                                                            placement="top"
                                                                        >
                                                                            <IconButton
                                                                                aria-label={resources.btnDelete}
                                                                                color="gray"
                                                                                data-id={phone.id}
                                                                                data-type={2}
                                                                                onClick={this.onOpenDeleteModal}
                                                                                id={`btnDelete_${iPhone}`}
                                                                            >
                                                                                <Icon name="trash" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Text
                                                                            display="inline"
                                                                            verticalAlign="middle"
                                                                        >
                                                                            <Button
                                                                                align="left"
                                                                                data-id={phone.id}
                                                                                id={`btnMakePrincipal_${iPhone}`}
                                                                                textVariantStyling="inherit"
                                                                                variant="text"
                                                                                onClick={this.onSetPhoneNumberAsPrimary}
                                                                            >
                                                                                {resources.btnSetAsPrimary}
                                                                            </Button>
                                                                        </Text>
                                                                    </TableCell>
                                                                </>
                                                            )
                                                            : <>
                                                                <TableCell component="th" />
                                                                <TableCell component="th" />
                                                            </>
                                                        ))}
                                                </Hidden>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <ConfirmationDialog
                            contentText={Format.toString(resources.deletePhoneNumberConfirmationDialog.formatContent,
                                [this.deleteDesc])}
                            DialogContentTextProps={{ id: `prgDeletePhoneNumber` }}
                            DialogTitleProps={{ id: `lblDeletePhoneNumberHeader` }}
                            open={isDeleteModalOpen}
                            primaryActionOnClick={this.onCloseDeleteModal}
                            primaryActionProps={{ id: `btnCancel` }}
                            primaryActionText={resources.deletePhoneNumberConfirmationDialog.btnDecline}
                            secondaryActionOnClick={this.onDeletePhoneNumber}
                            secondaryActionProps={{ id: `btnDelete` }}
                            secondaryActionText={resources.deletePhoneNumberConfirmationDialog.btnAccept}
                            title={resources.deletePhoneNumberConfirmationDialog.lblTitle}
                        />
                    </>
                );
            }
            else {
                contentPage = (
                    <Card>
                        <CardContent>
                            {allowEdit ? (
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
                                                    onClick={this.onAddPhoneNumber}
                                                    id="btnAddPhoneNumber"
                                                >
                                                    <Icon name="add" />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                    <Illustration
                                        color="secondary"
                                        internalName="no-activities"
                                        text={resources.lblNoResults}
                                    />
                                </>
                            ) : (
                                <Illustration
                                    color="secondary"
                                    name="under-maintenance"
                                    text={resources.lblNoPhoneNumbers}
                                />
                            )}
                        </CardContent>
                    </Card>
                )
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

// RenderDOM: Component
export default withStyles(styles)(PhoneNumberMain);