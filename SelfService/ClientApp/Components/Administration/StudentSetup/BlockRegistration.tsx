/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: BlockRegistration.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Sidebar, { ISidebarResProps } from '@hedtech/powercampus-design-system/react/core/Sidebar';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import Block from './Block';
import Rule from './Rule';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ISidebarOption } from '@hedtech/powercampus-design-system/types/ISidebarOption';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { BlockRegistrationOptions, IBlockRegistrationPermissions } from '../../../Types/Permissions/IBlockRegistrationPermissions';
import { IBlockRegistrationResources } from '../../../Types/Resources/Administration/IBlockRegistrationResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/BlockRegistration';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
// #endregion Imports

// #region Types
export interface IBlockRegistrationProps {
}

interface IBlockRegistrationRes extends IBlockRegistrationResources {
    sidebar: ISidebarResProps;
}

interface IBlockRegistrationState {
    componentError: boolean;
    enableBlockRegistration?: boolean;
    permissions?: IBlockRegistrationPermissions;
    resources?: IBlockRegistrationRes;
    sidebarOptions: ISidebarOption[];
    sidebarOptionSelected: number;
    termPeriodDescription: string;
    termPeriodIdSelected: number;
    termPeriods?: IDropDownOption[];
    textTitleSidebar: string;
}
// #endregion Types

// #region Component
class BlockRegistration extends React.Component<IBlockRegistrationProps, IBlockRegistrationState> {
    private abortController: AbortController;
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IBlockRegistrationState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.abortController = new AbortController();
        this.idModule = 'Administration';
        this.idPage = 'BlockRegistration';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IBlockRegistrationState {
        let enableBlockRegistration: boolean | undefined;
        let permissions: IBlockRegistrationPermissions | undefined;
        let resources: IBlockRegistrationRes | undefined;
        let sidebarOptions: ISidebarOption[] = [];
        let termPeriodDescription: string = '';
        let termPeriodIdSelected: number = 0;
        let termPeriods: IDropDownOption[] | undefined;
        if (this.state) {
            enableBlockRegistration = this.state.enableBlockRegistration;
            permissions = this.state.permissions;
            resources = this.state.resources;
            sidebarOptions = this.state.sidebarOptions;
            termPeriodDescription = this.state.termPeriodDescription;
            termPeriodIdSelected = this.state.termPeriodIdSelected;
            termPeriods = this.state.termPeriods;
        }
        return {
            componentError: false,
            enableBlockRegistration: enableBlockRegistration,
            permissions: permissions,
            resources: resources,
            sidebarOptions: sidebarOptions,
            sidebarOptionSelected: -1,
            termPeriodDescription: termPeriodDescription,
            termPeriodIdSelected: termPeriodIdSelected,
            termPeriods: termPeriods,
            textTitleSidebar: ''
        };
    }

    // #region Events
    private onDropdownChange = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            this.abortController.abort();
            this.abortController = new AbortController();
            this.setState({
                termPeriodDescription: optionSelected.description,
                termPeriodIdSelected: Number(optionSelected.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onChangeFirstLevelSidebar = (_event: any, value: number, _index: number): void => {
        try {
            const {
                sidebarOptionSelected
            } = this.state;

            this.abortController.abort();
            this.abortController = new AbortController();
            if (sidebarOptionSelected !== value) {
                const initialState: IBlockRegistrationState = this.getInitialState();
                initialState.sidebarOptionSelected = value;
                this.setState(initialState);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFirstLevelSidebar.name, e));
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
                if (result.data) {
                    RequestsLayout.getPermissions(this.idModule,
                        this.idPage, this.resolveGetPermissions, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetOptions.name);

            if (result?.status) {
                this.setState({
                    enableBlockRegistration: result.data.enableBlockRegistration,
                    termPeriods: result.data.termPeriods
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetOptions.name, e));
        }
    };

    private resolveGetPermissions = (json: string): void => {
        try {
            const {
                resources
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPermissions.name);

            if (result?.status) {
                const permissions: IBlockRegistrationPermissions | undefined = result.data;
                let sidebarOptions: ISidebarOption[] = [];
                if (permissions && resources) {
                    if (permissions.blocks) {
                        sidebarOptions.push({
                            id: BlockRegistrationOptions.Blocks,
                            text: resources.blockRegistrationOptions.lblBlocks
                        });
                    }
                    if (permissions.rules) {
                        sidebarOptions.push({
                            id: BlockRegistrationOptions.Rules,
                            text: resources.blockRegistrationOptions.lblRules
                        });
                    }
                    if (sidebarOptions && sidebarOptions.length > 1) {
                        sidebarOptions = sidebarOptions.sort((optionA, optionB) => optionA.id - optionB.id);
                    }
                }

                const sidebarOptionSelected: number = sidebarOptions.length > 0 ? sidebarOptions[0].id : -1;
                this.setState({
                    permissions: permissions,
                    sidebarOptions: sidebarOptions,
                    sidebarOptionSelected: sidebarOptionSelected
                }, () => Requests.getOptions(this.resolveGetOptions, this.logError));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPermissions.name, e));
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
            componentError,
            enableBlockRegistration,
            permissions,
            resources,
            sidebarOptions,
            sidebarOptionSelected,
            termPeriodDescription,
            termPeriodIdSelected,
            termPeriods
        } = this.state;

        let contentMain: JSX.Element | undefined;
        let contentPage: JSX.Element | undefined;
        let contentSidebar: JSX.Element | undefined;

        if (!componentError && resources && permissions && this.layoutResources) {
            const emptyOption: IDropDownOption = {
                description: this.layoutResources.lblDropDownEmptyText,
                value: 0
            };

            if (termPeriods && termPeriods.length > 0) {
                if (termPeriodIdSelected > 0 && sidebarOptionSelected !== -1) {
                    let textSidebarSelected: string = '';
                    switch (sidebarOptionSelected) {
                        case BlockRegistrationOptions.Blocks:
                            textSidebarSelected = resources.blockRegistrationOptions.lblBlocks;
                            break;
                        case BlockRegistrationOptions.Rules:
                            textSidebarSelected = resources.blockRegistrationOptions.lblRules;
                            break;
                    }

                    switch (sidebarOptionSelected) {
                        case BlockRegistrationOptions.Blocks:
                            contentSidebar = (
                                <Block
                                    key={`block_${termPeriodIdSelected}`}
                                    termPeriodDescription={termPeriodDescription}
                                    termPeriodIdSelected={termPeriodIdSelected}
                                />
                            );
                            break;

                        case BlockRegistrationOptions.Rules:
                            contentSidebar = (
                                <Rule
                                    key={`rule_${termPeriodIdSelected}`}
                                    termPeriodDescription={termPeriodDescription}
                                    termPeriodIdSelected={termPeriodIdSelected}
                                />
                            );
                            break;
                    }

                    contentMain = (
                        <Sidebar
                            aria-label={resources.lblSidebar}
                            withoutCard
                            header={(
                                <Text size="h2" id="txtSidebarHeaderMobile">
                                    {textSidebarSelected}
                                </Text>
                            )}
                            contentAfter={(
                                <>
                                    {contentSidebar}
                                </>
                            )}
                            id="BlockRegistrationSidebar"
                            options={sidebarOptions}
                            resources={resources.sidebar}
                            valueSelected={sidebarOptionSelected}
                            onClickFirstLevel={this.onChangeFirstLevelSidebar}
                        />
                    );
                }
                else {
                    contentMain = (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Illustration
                                    color="secondary"
                                    name="no-search-results"
                                    text={resources.lblEmptyState}
                                />
                            </Grid>
                        </Grid>
                    );
                }
                contentPage = (
                    <>
                        {!enableBlockRegistration && (
                            <Grid container>
                                <Grid item md={12}>
                                    <Alert
                                        id="msgWarning"
                                        open
                                        text={resources.lblWarning}
                                        type={ResultType.warning}
                                    />
                                </Grid>
                            </Grid>
                        )}
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Text size="h4">
                                    {resources.lblPageDescription}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4} md={3}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    id="ddlPeriods"
                                    label={resources.lblPeriod}
                                    options={termPeriods}
                                    value={termPeriodIdSelected}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                {contentMain}
                            </Grid>
                        </Grid>
                    </>
                );
            }
            else {
                contentPage = (
                    <MessageStyled
                        classMessage="noResults"
                        message={resources.lblNoResults}
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
export default BlockRegistration;