/* Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
 * File: SharedAccessMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ISharedAccessMainResources } from '../../../Types/Resources/Administration/ISharedAccessMainResources';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/SharedAccess';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
// #endregion Imports

// #region Types
export interface ISharedAccessMainProps {
}

interface ISharedAccessMainState {
    anchorEl: any;
    componentError: boolean;
    applyPrimaryEmail: boolean;
    days: number;
    defaultEmailType: number;
    defaultEmailTypeModified: boolean;
    emailTypes?: IDropDownOption[];
    isDaysEmpty: boolean;
    isStatementEmpty: boolean;
    openInfo: boolean;
    statement: string;
    resources?: ISharedAccessMainResources;
}

const styles = (() => createStyles({
    popperText: {
        maxWidth: '15rem'
    }
}));

type PropsWithStyles = ISharedAccessMainProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class SharedAccessMain extends React.Component<PropsWithStyles, ISharedAccessMainState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<ISharedAccessMainState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'SharedAccessMain';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): ISharedAccessMainState {
        let resources: ISharedAccessMainResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            anchorEl: null,
            componentError: false,
            applyPrimaryEmail: false,
            days: 1,
            defaultEmailType: 0,
            defaultEmailTypeModified: false,
            isDaysEmpty: false,
            isStatementEmpty: false,
            openInfo: false,
            statement: '',
            resources: resources,
        };
    }

    // #region Events
    private onBlurNumeric = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            if (event.target.value === '') {
                this.setState({
                    isDaysEmpty: true
                })
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlurNumeric.name, e));
        }
    };

    private onCheckboxChange = (event: any): void => {
        try {
            const id: string = event.target.id;
            const checked: boolean = event.target.checked;
            switch (id) {
                case 'chkApplyPrimaryEmail':
                    this.setState({
                        applyPrimaryEmail: checked,
                    });
                    break;
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const id: string = event.target.id;

            switch (id) {
                case 'txtDisclosureStatement':
                    this.setState({
                        statement: event.target.value,
                        isStatementEmpty: false
                    });
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onChangeTextNumeric = (number: number): void => {
        try {
            this.setState({
                days: number,
                isDaysEmpty: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onDropdownChange = (option: IDropDownOption, id: string): void => {
        try {
            switch (id) {

                case 'ddlEmailType':
                    this.setState({
                        defaultEmailTypeModified: true,
                        defaultEmailType: Number(option.value),
                    });
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onOpenPopper = (event: any): void => {
        try {
            this.setState({
                anchorEl: event.currentTarget,
                openInfo: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPopper.name, e));
        }
    };

    private onClosePopper = (): void => {
        try {
            this.setState({
                anchorEl: null,
                openInfo: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePopper.name, e));
        }
    };

    private onOpenInfo = (): void => {
        try {
            this.setState({
                openInfo: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenInfo.name, e));
        }
    };

    private onCloseInfo = (): void => {
        try {
            this.setState({
                openInfo: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseInfo.name, e));
        }
    };

    private onSave = (): void => {
        try {
            const {
                applyPrimaryEmail,
                days,
                defaultEmailType,
                statement
            } = this.state;

            let isValid: boolean = true;
            if (!days) {
                this.setState({
                    isDaysEmpty: true
                });
                isValid = false;
            }
            if (defaultEmailType <= 0) {
                this.setState({
                    defaultEmailTypeModified: true
                });
                isValid = false;
            }
            if (!statement) {
                this.setState({
                    isStatementEmpty: true
                });
                isValid = false;
            }
            if (isValid) {
                if (statement) {
                    LayoutActions.showPageLoader();
                    Requests.postSharedAccess(applyPrimaryEmail, days, defaultEmailType, statement, this.resolvePostSharedAccess, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };
    // #endregion Events

    // #region Functions
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
                Requests.getSharedAccess(this.resolveGetSharedAccess, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetSharedAccess = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSharedAccess.name);

            if (result?.status) {
                this.setState({
                    applyPrimaryEmail: result.data.settings.applyPrimaryEmail,
                    days: result.data.settings.daysInvitationExpires,
                    defaultEmailType: result.data.settings.defaultEmailType,
                    emailTypes: result.data.emailTypes,
                    statement: result.data.settings.disclosureStatement
                }, () => LayoutActions.hidePageLoader());
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSharedAccess.name, e));
        }
    };

    private resolvePostSharedAccess = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSharedAccess.name);

            if (result?.status) {
                LayoutActions.hidePageLoader();
                const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
                if (layoutResources) {
                    LayoutActions.setAlert({
                        message: layoutResources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSharedAccess.name, e));
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
            anchorEl,
            componentError,
            applyPrimaryEmail,
            days,
            defaultEmailType,
            defaultEmailTypeModified,
            emailTypes,
            isDaysEmpty,
            isStatementEmpty,
            openInfo,
            statement,
            resources,
        } = this.state;

        let contentPage: JSX.Element | undefined;
        const resourcesLayout: ILayoutResources | undefined = LayoutStore.getResourcesLayout();

        const emptyOption: IDropDownOption = {
            description: resourcesLayout ? resourcesLayout.lblDropDownEmptyText : '',
            value: 0
        };

        if (!componentError && resources && this.layoutResources) {
            contentPage = (
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Text size="h2">
                            {resources.lblInvitation}
                        </Text>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Grid container>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    error={isDaysEmpty || days < 1}
                                    helperText={isDaysEmpty ?
                                        resources.lblIsDaysEmpty : undefined}
                                    id="txtDays"
                                    label={resources.lblDays}
                                    max={999}
                                    min={1}
                                    required
                                    step={1}
                                    type="number"
                                    value={days}
                                    onBlur={this.onBlurNumeric}
                                    onChange={this.onChangeTextNumeric}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Grid container>
                            <Grid item xs={12} md={4}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    error={defaultEmailTypeModified
                                        && !defaultEmailType}
                                    helperText={defaultEmailTypeModified
                                        && !defaultEmailType ?
                                        resources.lblEmailTypeRequired : undefined}
                                    id="ddlEmailType"
                                    label={resources.lblEmailType}
                                    options={emailTypes}
                                    required
                                    value={defaultEmailType ?
                                        defaultEmailType : ''}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Grid container
                            alignItems="center"
                            wrap="nowrap">
                            <Grid item>
                                <Checkbox
                                    checked={applyPrimaryEmail}
                                    id="chkApplyPrimaryEmail"
                                    label={resources.lblApplyPrimaryEmail}
                                    onChange={this.onCheckboxChange}
                                />
                                <Tooltip
                                    id="tltPrimaryRequiredInfo"
                                    placement="top"
                                    title={resources.btnMoreInfo}
                                >
                                    <IconButton
                                        aria-label={resources.lblInformationNote}
                                        color="gray"
                                        id="btnPrimaryRequiredInfo"
                                        onClick={this.onOpenPopper}
                                    >
                                        <Icon
                                            name="info"
                                            type={ResultType.info}
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Popper
                                    arrow
                                    id="popPrimaryRequiredInfo"
                                    open={openInfo}
                                    placement="bottom-start"
                                    anchorEl={anchorEl}
                                    onClickAway={this.onClosePopper}
                                    text={resources.lblInformationNote}
                                    transition={false}
                                    TextTypographyProps={{ className: classes.popperText }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Text size="h2">
                            {resources.lblDisclosure}
                        </Text>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            error={isStatementEmpty}
                            helperText={isStatementEmpty ?
                                resources.lblIsStatementEmpty : ''}
                            id="txtDisclosureStatement"
                            label={resources.lblDisclosureStatement}
                            multiline
                            required
                            value={statement}
                            minRows={15}
                            onChange={this.onChangeTextField}
                        />
                        <Text
                            color="textSecondary"
                            display="inline"
                        >
                            {resources.lblDisclosureStatementRules}
                        </Text>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Text size="h2">
                            {resources.lblPreview}
                        </Text>
                        <Divider />
                        <Card>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Text>
                                            <div dangerouslySetInnerHTML={{ __html: statement ? statement : '' }} />
                                        </Text>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Button
                            id="btnSave"
                            onClick={this.onSave}
                        >
                            {resources.btnSave}
                        </Button>
                    </Grid>
                </Grid>
            );
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
export default withStyles(styles)(SharedAccessMain);