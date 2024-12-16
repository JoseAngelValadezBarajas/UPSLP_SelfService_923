/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Rule.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Internal components
import RuleAddEdit, { IRuleAddEditResProps } from './RuleAddEdit';
import RuleAddGroup, { IRuleAddGroupResProps } from './RuleAddGroup';
import RuleSearchBlock from './RuleSearchBlock';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Switch from '@hedtech/powercampus-design-system/react/core/Switch';
import Search from '@hedtech/powercampus-design-system/react/core/Search';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IBlockRegistrationGroupDetail } from '../../../Types/Administration/IBlockRegistrationGroupDetail';
import { IBlockRegistrationGroupHeader } from '../../../Types/Administration/IBlockRegistrationGroupHeader';
import { IBlockRegistrationRule, IBlockRegistrationRuleSearch } from '../../../Types/Administration/IBlockRegistrationRule';
import { IBlockRegistrationRuleGroup, IBlockRegRuleGroupBlock } from '../../../Types/Administration/IBlockRegistrationRuleGroup';
import { IBlockRegistrationRuleHeaders } from '../../../Types/Administration/IBlockRegistrationRuleHeader';
import { IRuleResources } from '../../../Types/Resources/Administration/IRuleResources';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthDown, isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import RequestsBlockList from '../../../Requests/Administration/BlockList';
import Requests from '../../../Requests/Administration/Rule';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IRuleProps {
    termPeriodDescription: string;
    termPeriodIdSelected: number;
}

interface IRuleRes extends IRuleResources {
    ruleAddEditRes: IRuleAddEditResProps;
    ruleAddGroupRes: IRuleAddGroupResProps;
}

interface IRuleState {
    componentError: boolean;
    nameToSearch: string;
    resources?: IRuleRes;
    rulesList?: IBlockRegistrationRuleHeaders;

    // #region Add Rule
    anchorEl: any;
    blockRegistrationRule?: IBlockRegistrationRule;
    isAddEditRule: boolean;
    isLoadingContent: boolean;
    isLoadingSaveRule: boolean;
    isLoadingSearch: boolean;
    isLoadingValidationName: boolean;
    isLoadingValidationPriority: boolean;
    openInfo: boolean;
    ruleName?: string;
    rulePriority?: number;
    viewOptions?: IDropDownOption[];
    // #region Add Rule

    // #region Add Group
    group: IBlockRegistrationRuleGroup;
    groupName: string;
    isAddGroup: boolean;
    isLoadingAddGroup: boolean;
    openAddGroupModal: boolean;
    // #endregion Add Group

    // #region Search Blocks
    blocksAdded: number[];
    hasSearchBlocks: boolean;
    openSearchBlockModal: boolean;
    selectedGroupBlocks: IBlockRegistrationGroupHeader[];
    // #endregion Search Blocks

    // #region Edit
    isEditGroup: boolean;
    // #endregion Edit

    // #region Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    // #endregion Pagination
}

const styles = ((theme: Theme) => createStyles({
    dragIcon: {
        alignItems: 'center',
        color: Tokens.colorBrandNeutral400,
        display: 'inline-flex',
        marginLeft: Tokens.spacing30,
        marginRight: Tokens.spacing30,
        verticalAlign: 'middle'
    },
    headerCourse: {
        [theme.breakpoints.up('md')]: {
            paddingTop: '0!important'
        }
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '80%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '10%'
            }
        }
    }
}));

type PropsWithStyles = IRuleProps & WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
class Rule extends React.Component<PropsWithStyles, IRuleState> {
    private blockListIndex: number;
    private idModule: string;
    private idPage: string;
    private initialNewGroup: IBlockRegistrationRuleGroup;
    private initialNewRule: IBlockRegistrationRule;
    private isFirstLoad: boolean;
    private isPeriodWithRules: boolean;
    private layoutResources?: ILayoutResources;
    private selectedGroupIndex: number;
    // #region Pagination
    private rowsPerPageOptions: number[];
    // #endregion Pagination

    public readonly state: Readonly<IRuleState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.blockListIndex = 0;
        this.idModule = 'Administration';
        this.idPage = 'Rule';
        this.initialNewGroup = {
            blockDetails: [],
            blockRegistrationRuleGroupId: 0,
            blockRegRuleGroupBlocksToAdd: [],
            blockRegRuleGroupBlocksToRemove: [],
            displayName: '',
            isEditable: true,
            name: '',
            numberOfBlocks: 0,
            order: 0
        };
        this.initialNewRule = {
            blockRegistrationRuleId: 0,
            blockRegRuleGroups: [],
            blockRegRuleGroupsToRemove: [],
            isActive: false,
            isBlockRegistrationOnly: false,
            name: '',
            priority: 0,
            termPeriodId: 0,
            viewName: ''
        };
        this.isFirstLoad = true;
        this.isPeriodWithRules = false;
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.selectedGroupIndex = -1;
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Pagination
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        // #endregion Paginations
    }

    private getInitialState(): IRuleState {
        let resources: IRuleRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            nameToSearch: '',
            resources: resources,

            // #region Add Rule
            anchorEl: null,
            blockRegistrationRule: {
                blockRegistrationRuleId: 0,
                blockRegRuleGroups: [],
                blockRegRuleGroupsToRemove: [],
                isActive: false,
                isBlockRegistrationOnly: false,
                name: '',
                priority: 0,
                termPeriodId: 0,
                viewName: ''
            },
            isAddEditRule: false,
            isLoadingContent: true,
            isLoadingSaveRule: false,
            isLoadingSearch: false,
            isLoadingValidationName: false,
            isLoadingValidationPriority: false,
            openInfo: false,
            ruleName: '',
            rulePriority: 0,
            // #endregion Add Rule

            // #region Add Group
            group: {
                blockDetails: [],
                blockRegistrationRuleGroupId: 0,
                blockRegRuleGroupBlocksToAdd: [],
                blockRegRuleGroupBlocksToRemove: [],
                displayName: '',
                isEditable: true,
                name: '',
                numberOfBlocks: 0,
                order: 0
            },
            groupName: '',
            isAddGroup: false,
            isLoadingAddGroup: false,
            openAddGroupModal: false,
            // #endregion Add Group

            // #region Search Blocks
            blocksAdded: [],
            hasSearchBlocks: false,
            openSearchBlockModal: false,
            selectedGroupBlocks: [],
            // #endregion Search Blocks

            // #region Edit
            isEditGroup: false,
            // #endregion Edit

            // #region Pagination
            page: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: []
            // #endregion Pagination
        };
    }

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

    private setContent = (): void => {
        try {
            const {
                nameToSearch,
                page,
                rowsPerPage
            } = this.state;

            this.showLoaderSearch();
            const ruleSearch: IBlockRegistrationRuleSearch = {
                length: rowsPerPage,
                name: nameToSearch,
                startIndex: page * rowsPerPage,
                termPeriodId: this.props.termPeriodIdSelected
            };
            Requests.getRules(ruleSearch,
                this.resolveGetRules,
                this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.setContent.name, e));
        }
    };
    // #endregion Pagination

    // #region Events

    // #region Add Rule
    private onBlurNameTextField = (): void => {
        try {
            const {
                blockRegistrationRule,
                ruleName
            } = this.state;

            const {
                termPeriodIdSelected
            } = this.props;

            if (blockRegistrationRule
                && blockRegistrationRule.name
                && blockRegistrationRule.name !== ruleName) {
                this.setState({
                    isLoadingValidationName: true
                }, () => {
                    Requests.validateRuleName(blockRegistrationRule.name,
                        termPeriodIdSelected,
                        this.resolveValidateRuleName,
                        this.logError
                    );

                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlurNameTextField.name, e));
        }
    };

    private onBlurPriorityTextField = (): void => {
        try {
            const {
                blockRegistrationRule,
                rulePriority
            } = this.state;

            const {
                termPeriodIdSelected
            } = this.props;

            if (blockRegistrationRule
                && blockRegistrationRule.priority
                && blockRegistrationRule.priority !== rulePriority) {
                this.setState({
                    isLoadingValidationPriority: true
                }, () => {
                    Requests.validatePriority(blockRegistrationRule.priority,
                        termPeriodIdSelected,
                        this.resolveValidatePriority,
                        this.logError
                    );

                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlurPriorityTextField.name, e));
        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const {
                blockRegistrationRule,
                group
            } = this.state;
            if (blockRegistrationRule) {
                const id: string = event.target.id;
                switch (id) {
                    case 'txtName':
                        blockRegistrationRule.isRuleNameDuplicated = false;
                        blockRegistrationRule.isRuleNameError = false;
                        blockRegistrationRule.name = event.target.value;
                        break;
                    case 'txtGroupName':
                        group.isNameDuplicated = false;
                        group.isNameError = false;
                        group.name = event.target.value;
                        break;
                    case 'txtGroupDisplayName':
                        group.displayName = event.target.value;
                        group.isDisplayNameError = false;
                        break;
                }
            }
            this.setState({
                blockRegistrationRule: blockRegistrationRule,
                group: group
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onChangeTextNumeric = (priority: number) => {
        try {
            const {
                blockRegistrationRule
            } = this.state;
            if (blockRegistrationRule) {
                blockRegistrationRule.priority = priority;
                blockRegistrationRule.isPriorityError = false;

            }
            this.setState({
                blockRegistrationRule: blockRegistrationRule
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextNumeric.name, e));
        }
    };

    private onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const {
                blockRegistrationRule
            } = this.state;

            if (blockRegistrationRule) {
                const checked: boolean = event.target.checked;
                switch (event.target.id) {
                    case 'chkBlockRegistrationOnly':
                        blockRegistrationRule.isBlockRegistrationOnly = checked;
                        break;
                    case 'chkActive':
                        blockRegistrationRule.isActive = checked;
                        break;
                }
                this.setState({
                    blockRegistrationRule: blockRegistrationRule
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onDropdownChange = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                blockRegistrationRule
            } = this.state;

            if (blockRegistrationRule) {
                blockRegistrationRule.viewName = String(optionSelected.value);
                blockRegistrationRule.isViewNameError = false;
                this.setState({
                    blockRegistrationRule: blockRegistrationRule
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onAddRule = () => {
        try {
            this.setState({
                isAddEditRule: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddRule.name, e));
        }
    };
    private onCancelAddRule = () => {
        try {
            this.setState({
                blockRegistrationRule: this.setEmptyRule(),
                blocksAdded: [],
                group: this.setEmptyGroup(),
                isAddEditRule: false,
                ruleName: '',
                rulePriority: 0
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelAddRule.name, e));
        }
    };

    private onSaveAddRule = (): void => {
        try {
            const {
                blockRegistrationRule,
                isLoadingValidationName,
                isLoadingValidationPriority
            } = this.state;

            const {
                termPeriodIdSelected
            } = this.props;

            if (blockRegistrationRule) {
                if (blockRegistrationRule.name
                    && blockRegistrationRule.priority
                    && blockRegistrationRule.viewName
                    && !blockRegistrationRule.isRuleNameDuplicated
                    && !blockRegistrationRule.isRuleNameError
                    && !blockRegistrationRule.isPriorityError
                    && !blockRegistrationRule.isPriorityDuplicated
                    && !blockRegistrationRule.isViewNameError
                    && !isLoadingValidationName
                    && !isLoadingValidationPriority) {
                    blockRegistrationRule.termPeriodId = termPeriodIdSelected;
                    blockRegistrationRule.isBlockRegistrationOnly = blockRegistrationRule.isBlockRegistrationOnly || false;
                    blockRegistrationRule.isActive = blockRegistrationRule.isActive || false;
                    this.setState({
                        blockRegistrationRule: blockRegistrationRule
                    }, () => {
                        this.showLoaderSaveRule();
                        if (blockRegistrationRule.blockRegRuleGroups
                            && blockRegistrationRule.blockRegRuleGroups.length > 0) {
                            blockRegistrationRule.blockRegRuleGroups.forEach((bg, index) => {
                                bg.order = index;
                            });
                        }
                        Requests.saveRule(blockRegistrationRule,
                            this.resolveSaveRule,
                            this.logError
                        );
                    });
                }
                else {
                    if (!blockRegistrationRule.name) {
                        blockRegistrationRule.isRuleNameError = true;
                    }
                    if (!blockRegistrationRule.priority) {
                        blockRegistrationRule.isPriorityError = true;
                    }
                    if (!blockRegistrationRule.viewName) {
                        blockRegistrationRule.isViewNameError = true;
                    }
                    this.setState({
                        blockRegistrationRule: blockRegistrationRule
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveAddRule.name, e));
        }
    };

    private onOpenPopper = (event: any) => {
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

    private onClosePopper = () => {
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
    // #endregion Add Rule

    // #region Add Group
    private onAddGroup = (): void => {
        try {
            const {
                blockRegistrationRule,
                group,
                isEditGroup
            } = this.state;

            if (group && blockRegistrationRule) {
                if (group.name
                    && group.displayName
                    && !group.isNameError
                    && !group.isNameDuplicated
                    && !group.isDisplayNameError) {
                    if (isEditGroup && this.selectedGroupIndex > -1) {
                        blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex] = {
                            ...blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex],
                            displayName: group.displayName,
                            name: group.name
                        };
                    } else {
                        this.selectedGroupIndex = blockRegistrationRule.blockRegRuleGroups.push(group) - 1;
                    }
                    this.setState({
                        blockRegistrationRule: blockRegistrationRule,
                        group: this.setEmptyGroup(),
                        groupName: '',
                        isEditGroup: false,
                        openAddGroupModal: false
                    });
                }
                else {
                    if (!group.name) {
                        group.isNameError = true;
                    }
                    if (!group.displayName) {
                        group.isDisplayNameError = true;
                    }
                    this.setState({
                        group: group
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddGroup.name, e));
        }
    };

    private onAddGroupAndSearch = (): void => {
        try {
            const {
                blockRegistrationRule,
                group,
                isEditGroup
            } = this.state;

            if (group && blockRegistrationRule) {
                if (group.name
                    && group.displayName
                    && !group.isNameError
                    && !group.isNameDuplicated
                    && !group.isDisplayNameError) {
                    if (isEditGroup && this.selectedGroupIndex > -1) {
                        blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex] = {
                            ...blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex],
                            displayName: group.displayName,
                            name: group.name
                        };
                    } else {
                        this.selectedGroupIndex = blockRegistrationRule.blockRegRuleGroups.push(group) - 1;
                    }
                    this.setState({
                        blockRegistrationRule: blockRegistrationRule,
                        groupName: '',
                        isEditGroup: false,
                        openAddGroupModal: false,
                        openSearchBlockModal: true
                    });
                }
                else {
                    if (!group.name) {
                        group.isNameError = true;
                    }
                    if (!group.displayName) {
                        group.isDisplayNameError = true;
                    }
                    this.setState({
                        group: group
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddGroupAndSearch.name, e));
        }
    };

    private onOpenAddGroupModal = (): void => {
        try {
            this.setState({
                isAddGroup: true,
                openAddGroupModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenAddGroupModal.name, e));
        }
    };

    private onOpenSearchBlocksModal = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            this.selectedGroupIndex = Number(event.currentTarget.id.split('_')[1]);
            this.setState({
                openSearchBlockModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenSearchBlocksModal.name, e));
        }
    };

    private onAddBlocks = (): void => {
        try {
            const {
                blockRegistrationRule,
                blocksAdded,
                selectedGroupBlocks
            } = this.state;
            if (this.selectedGroupIndex > -1 && blockRegistrationRule) {
                selectedGroupBlocks.forEach(block => {
                    blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex].blockDetails.push({
                        blockRegRuleGroupBlockId: 0, ...block
                    } as IBlockRegRuleGroupBlock);
                    // Add Block to blocksAdded
                    blocksAdded.push(block.blockRegistrationGroupId);
                    // Add Blocks to BlocksToAdd
                    if (blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex].blockRegRuleGroupBlocksToAdd) {
                        blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex].blockRegRuleGroupBlocksToAdd.push(
                            block.blockRegistrationGroupId);
                    }
                    else {
                        blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex] = {
                            ...blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex],
                            blockRegRuleGroupBlocksToAdd: [block.blockRegistrationGroupId]
                        };
                    }
                });
                blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex].numberOfBlocks += selectedGroupBlocks.length;
                this.setState({
                    blockRegistrationRule: blockRegistrationRule,
                    group: this.setEmptyGroup(),
                    hasSearchBlocks: false,
                    openSearchBlockModal: false,
                    selectedGroupBlocks: []
                });
                this.selectedGroupIndex = -1;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddBlocks.name, e));
        }
    };

    private onAddAndSelectMoreBlocks = (): void => {
        try {
            const {
                blockRegistrationRule,
                blocksAdded,
                selectedGroupBlocks
            } = this.state;
            if (this.selectedGroupIndex > -1 && blockRegistrationRule) {
                selectedGroupBlocks.forEach(block => {
                    blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex].blockDetails.push({
                        blockRegRuleGroupBlockId: 0,
                        ...block
                    } as IBlockRegRuleGroupBlock);
                    // Add Block to blocksAdded
                    blocksAdded.push(block.blockRegistrationGroupId);
                    // Add Blocks to BlocksToAdd if there is RuleGroupId
                    if (blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex].blockRegRuleGroupBlocksToAdd) {
                        blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex].blockRegRuleGroupBlocksToAdd.push(
                            block.blockRegistrationGroupId);
                    }
                    else {
                        blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex] = {
                            ...blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex],
                            blockRegRuleGroupBlocksToAdd: [block.blockRegistrationGroupId]
                        };
                    }
                });
                blockRegistrationRule.blockRegRuleGroups[this.selectedGroupIndex].numberOfBlocks += selectedGroupBlocks.length;
                this.setState({
                    blockRegistrationRule: blockRegistrationRule,
                    hasSearchBlocks: false,
                    selectedGroupBlocks: []
                });
                this.blockListIndex += 1;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddAndSelectMoreBlocks.name, e));
        }
    };

    private onCancelAddGroup = (): void => {
        try {
            this.setState({
                group: this.setEmptyGroup(),
                groupName: '',
                hasSearchBlocks: false,
                isEditGroup: false,
                openAddGroupModal: false,
                openSearchBlockModal: false,
                selectedGroupBlocks: []
            });
            this.selectedGroupIndex = -1;
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelAddGroup.name, e));
        }
    };

    private onBlurGroupNameTextField = (): void => {
        try {
            const {
                group,
                groupName,
                blockRegistrationRule
            } = this.state;

            if (group
                && group.name
                && group.name !== groupName) {
                let repeatedIndex: number = -1;
                if (blockRegistrationRule
                    && blockRegistrationRule.blockRegRuleGroups
                    && blockRegistrationRule.blockRegRuleGroups.length > 0) {
                    repeatedIndex = blockRegistrationRule.blockRegRuleGroups.findIndex(g => (
                        group.name === g.name
                    ));
                }
                if (repeatedIndex > -1) {
                    group.isNameDuplicated = true;
                    this.setState({
                        group: group
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlurGroupNameTextField.name, e));
        }
    };

    private onExpandGroupDetails = (event: any): void => {
        try {
            const {
                blockRegistrationRule
            } = this.state;
            if (blockRegistrationRule) {
                const index: number = Number(event.target.id.split('_')[1]);
                const isExpanded: boolean =
                    Boolean(blockRegistrationRule.blockRegRuleGroups[index].expanded);

                blockRegistrationRule.blockRegRuleGroups[index].expanded = !isExpanded;
                this.setState({
                    blockRegistrationRule: blockRegistrationRule
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandGroupDetails.name, e));
        }
    };

    private onShowGroupDetails = (event: any): void => {
        try {
            const {
                blockRegistrationRule
            } = this.state;

            if (blockRegistrationRule) {
                const index: number = Number(event.currentTarget.id.split('_')[1]);
                const isExpandedGroupDetails: boolean =
                    Boolean(blockRegistrationRule.blockRegRuleGroups[index].expandedDetails);

                blockRegistrationRule.blockRegRuleGroups[index].expandedDetails = !isExpandedGroupDetails;
                this.setState({
                    blockRegistrationRule: blockRegistrationRule
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onShowGroupDetails.name, e));
        }
    };

    private onExpandBlockDetails = (event: any) => {
        try {
            const {
                width
            } = this.props;
            const {
                blockRegistrationRule
            } = this.state;

            const blockIndex: number = Number(event.target.id.split('_')[1]);
            const groupIndex: number = Number(event.target.id.split('_')[2]);

            if (blockRegistrationRule) {
                const block: IBlockRegRuleGroupBlock = blockRegistrationRule.blockRegRuleGroups[groupIndex].blockDetails[blockIndex];
                const blockIsExpanded: boolean = Boolean(block.expanded);

                if (isWidthUp('md', width) && !blockIsExpanded && !block.sectionList) {
                    block.isLoadingDetail = true;
                    RequestsBlockList.getBlockDetail(block.blockRegistrationGroupId,
                        this.resolveGetBlockDetail, this.logError);
                }

                block.expanded = !blockIsExpanded;
                this.setState({
                    blockRegistrationRule: blockRegistrationRule
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandBlockDetails.name, e));
        }
    };

    private onShowBlockDetails = (event: any) => {
        try {
            const {
                width
            } = this.props;
            const {
                blockRegistrationRule
            } = this.state;

            const blockIndex: number = Number(event.currentTarget.id.split('_')[1]);
            const groupIndex: number = Number(event.currentTarget.id.split('_')[2]);

            if (blockRegistrationRule) {
                const block: IBlockRegRuleGroupBlock = blockRegistrationRule.blockRegRuleGroups[groupIndex].blockDetails[blockIndex];

                const blockIsExpandedDetails: boolean = Boolean(block.expandedDetails);

                if (isWidthDown('sm', width) && !blockIsExpandedDetails && !block.sectionList) {
                    block.isLoadingDetail = true;
                    RequestsBlockList.getBlockDetail(block.blockRegistrationGroupId,
                        this.resolveGetBlockDetail, this.logError);
                }

                block.expandedDetails = !blockIsExpandedDetails;
                this.setState({
                    blockRegistrationRule: blockRegistrationRule
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onShowBlockDetails.name, e));
        }
    };

    private onDragEnd = (result: any): void => {
        try {
            const {
                blockRegistrationRule
            } = this.state;

            if (!result.destination) {
                return;
            }

            if (blockRegistrationRule) {
                const blockRegRuleGroupsOrdered = this.reorderList(
                    blockRegistrationRule.blockRegRuleGroups,
                    result.source.index,
                    result.destination.index
                );
                blockRegistrationRule.blockRegRuleGroups = blockRegRuleGroupsOrdered;
                this.setState({
                    blockRegistrationRule: blockRegistrationRule
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDragEnd.name, e));
        }
    };

    private setSelectedBlocks = (selectedBlocks: IBlockRegistrationGroupHeader[]): void => {
        try {
            this.setState({
                selectedGroupBlocks: selectedBlocks
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.setSelectedBlocks.name, e));
        }
    };

    private setHasSearchBlocks = (hasSearchBlocks: boolean): void => {
        try {
            this.setState({
                hasSearchBlocks: hasSearchBlocks
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.setHasSearchBlocks.name, e));
        }
    };
    // #endregion Add Group

    // #region Edit Rule
    private onEditRule = (event: React.MouseEvent<HTMLAnchorElement>) => {
        try {
            const {
                rulesList
            } = this.state;
            const ruleIndex: number = Number(event.currentTarget.id.split('_')[1]);
            if (rulesList
                && rulesList.blockRegistrationRuleHeaderList
                && rulesList.blockRegistrationRuleHeaderList.length > 0) {
                const ruleId: number = rulesList.blockRegistrationRuleHeaderList[ruleIndex].blockRegistrationRuleId;
                this.showLoaderContent();
                this.setState({
                    isAddEditRule: true
                });
                Requests.getDetails(this.resolveGetDetails, this.logError, ruleId);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditRule.name, e));
        }
    };

    private onEditGroup = (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const {
                blockRegistrationRule
            } = this.state;

            if (blockRegistrationRule) {
                const index: number = Number(event.currentTarget.id.split('_')[1]);
                this.selectedGroupIndex = index;
                this.setState({
                    group: { ...blockRegistrationRule.blockRegRuleGroups[index] },
                    groupName: blockRegistrationRule.blockRegRuleGroups[index].name,
                    isEditGroup: true,
                    openAddGroupModal: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditGroup.name, e));
        }
    };

    private onDeleteGroup = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                blockRegistrationRule,
                blocksAdded
            } = this.state;
            const groupIndex: number = Number(event.currentTarget.id.split('_')[1]);
            if (blockRegistrationRule) {
                const group = blockRegistrationRule.blockRegRuleGroups[groupIndex];
                // Delete blocks from blocksAdded
                blockRegistrationRule.blockRegRuleGroups[groupIndex].blockDetails.forEach(block => {
                    const blocksAddedIndex: number = blocksAdded.findIndex(b => block.blockRegistrationGroupId === b);
                    if (blocksAddedIndex > -1 && blocksAdded.length > 0) {
                        blocksAdded.splice(blocksAddedIndex, 1);
                    }
                });
                // Adds RuleGroupId to GroupsToRemove
                if (group.blockRegistrationRuleGroupId) {
                    if (blockRegistrationRule.blockRegRuleGroupsToRemove) {
                        blockRegistrationRule.blockRegRuleGroupsToRemove.push(group.blockRegistrationRuleGroupId);
                    }
                    else {
                        blockRegistrationRule.blockRegRuleGroupsToRemove = [group.blockRegistrationRuleGroupId];
                    }
                }
                // Deletes from UI
                blockRegistrationRule.blockRegRuleGroups.splice(groupIndex, 1);
                this.setState({
                    blockRegistrationRule: blockRegistrationRule
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteGroup.name, e));
        }
    };

    private onDeleteBlock = (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const {
                blockRegistrationRule,
                blocksAdded
            } = this.state;
            const blockIndex: number = Number(event.currentTarget.id.split('_')[1]);
            const groupIndex: number = Number(event.currentTarget.id.split('_')[2]);

            if (blockRegistrationRule) {
                const block: IBlockRegRuleGroupBlock = blockRegistrationRule.blockRegRuleGroups[groupIndex].blockDetails[blockIndex];

                // Deletes from blocksAdded
                const blocksAddedIndex: number = blocksAdded.findIndex(b => block.blockRegistrationGroupId === b);
                if (blocksAddedIndex > -1 && blocksAdded.length > 0) {
                    blocksAdded.splice(blocksAddedIndex, 1);
                }
                // Deletes from RuleGroupsBlocksToAdd
                if (blockRegistrationRule.blockRegRuleGroups[groupIndex].blockRegRuleGroupBlocksToAdd) {
                    const blocksToAddIndex: number = blockRegistrationRule.blockRegRuleGroups[groupIndex].blockRegRuleGroupBlocksToAdd.findIndex(b =>
                        b === block.blockRegistrationGroupId);
                    if (blocksToAddIndex > -1) {
                        blockRegistrationRule.blockRegRuleGroups[groupIndex].blockRegRuleGroupBlocksToAdd.splice(blocksToAddIndex, 1);
                    }
                }
                // Adds GroupBlockId to BlocksToRemove
                if (block.blockRegRuleGroupBlockId) {
                    if (blockRegistrationRule.blockRegRuleGroups[groupIndex].blockRegRuleGroupBlocksToRemove) {
                        blockRegistrationRule.blockRegRuleGroups[groupIndex].blockRegRuleGroupBlocksToRemove.push(block.blockRegRuleGroupBlockId);
                    }
                    else {
                        blockRegistrationRule.blockRegRuleGroups[groupIndex] = {
                            ...blockRegistrationRule.blockRegRuleGroups[groupIndex],
                            blockRegRuleGroupBlocksToRemove: [block.blockRegRuleGroupBlockId]
                        };
                    }
                }
                // Deletes from UI
                blockRegistrationRule.blockRegRuleGroups[groupIndex].blockDetails.splice(blockIndex, 1);
                blockRegistrationRule.blockRegRuleGroups[groupIndex].numberOfBlocks -= 1;
                this.setState({
                    blockRegistrationRule: blockRegistrationRule,
                    blocksAdded: blocksAdded
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteBlock.name, e));
        }
    };
    // #endregion Edit Rule

    private onSearch = (): void => {
        try {
            const {
                nameToSearch
            } = this.state;
            if (nameToSearch !== '') {
                this.setContent();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearch.name, e));
        }
    };

    private onChangeRuleName = (event: any): void => {
        try {
            this.setState({
                nameToSearch: event.target.value
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRuleName.name, e));
        }
    };

    private onClearRuleName = (): void => {
        try {
            this.setState({
                nameToSearch: ''
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearRuleName.name, e));
        }
    };

    private onRetrieveAll = (): void => {
        try {
            this.setState({
                nameToSearch: '',
                page: 0,
                rowsPerPage: 5
            }, this.setContent);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRetrieveAll.name, e));
        }
    };

    private onChangeSwitch = (event: any): void => {
        try {
            const ids: string[] = event.target.id.split('_');
            const {
                rulesList
            } = this.state;
            let newIsActive: boolean = false;
            let blockRegistrationRuleId: number = 0;
            if (rulesList
                && rulesList.blockRegistrationRuleHeaderList
                && rulesList.blockRegistrationRuleHeaderList.length > 0) {
                blockRegistrationRuleId = rulesList.blockRegistrationRuleHeaderList[Number(ids[1])].blockRegistrationRuleId;
                newIsActive = event.target.checked;

                rulesList.blockRegistrationRuleHeaderList[Number(ids[1])].isActive = newIsActive;
                this.setState({
                    rulesList: rulesList
                }, () => {
                    Requests.postEnableRule(blockRegistrationRuleId, newIsActive, this.resolvePostEnableRule, this.logError);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeSwitch.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoadingContent: false,
            isLoadingSaveRule: false,
            isLoadingSearch: false
        });
    };

    private hideLoaderSearch = (): void => {
        this.setState({
            isLoadingSearch: false
        });
    };

    private hideLoaderContent = (): void => {
        this.setState({
            isLoadingContent: false
        });
    };

    private showLoaderSearch = (): void => {
        this.setState({
            isLoadingSearch: true
        });
    };

    private showLoaderSaveRule = (): void => {
        this.setState({
            isLoadingSaveRule: true
        });
    };

    private showLoaderContent = (): void => {
        this.setState({
            isLoadingContent: true
        });
    };

    private reorderList(list: any, startIndex: number, endIndex: number): any {
        const result = Array.from(list);
        const [removed]: any = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    }

    private setEmptyRule = (): IBlockRegistrationRule => {
        const newBlockRegistrationRule = { ...this.initialNewRule };
        newBlockRegistrationRule.blockRegRuleGroups = [];
        newBlockRegistrationRule.blockRegRuleGroupsToRemove = [];
        return newBlockRegistrationRule;
    };

    private setEmptyGroup = (): IBlockRegistrationRuleGroup => {
        const newGroup = { ...this.initialNewGroup };
        newGroup.blockRegRuleGroupBlocksToAdd = [];
        newGroup.blockRegRuleGroupBlocksToRemove = [];
        newGroup.blockDetails = [];
        return newGroup;
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
    private resolveValidateRuleName = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveValidateRuleName.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    blockRegistrationRule
                } = this.state;
                if (blockRegistrationRule) {
                    blockRegistrationRule.isRuleNameDuplicated = result.data;
                    this.setState({
                        blockRegistrationRule: blockRegistrationRule,
                        isLoadingValidationName: false
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveValidateRuleName.name, e));
        }
    };

    private resolveValidatePriority = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveValidatePriority.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    blockRegistrationRule
                } = this.state;
                if (blockRegistrationRule) {
                    blockRegistrationRule.isPriorityDuplicated = result.data;
                    this.setState({
                        blockRegistrationRule: blockRegistrationRule,
                        isLoadingValidationPriority: false
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveValidatePriority.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status && result.data) {
                this.setState({
                    resources: result.data
                }, this.setContent);
                LayoutStore.setResourcesByKey(this.idPage, result.data);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveSaveRule = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveRule.name, this.hideAllLoaders);

            if (result?.status && result.data) {
                this.setState({
                    blockRegistrationRule: this.setEmptyRule(),
                    isAddEditRule: false,
                    ruleName: '',
                    rulePriority: 0
                }, () => {
                    this.hideAllLoaders();
                    this.setContent();
                    if (this.layoutResources) {
                        LayoutActions.setAlert({
                            message: this.layoutResources.lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    }
                });
            }
        }
        catch (e) {
            this.hideAllLoaders();
            this.logError(LogData.fromException(this.resolveSaveRule.name, e));
        }
    };

    private resolveGetDetails = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDetails.name, this.hideAllLoaders);

            if (result?.status && result.data) {
                const {
                    isAddEditRule
                } = this.state;
                const newBlocksAdded: number[] | undefined = result.data.blocksAdded;
                const newRuleDetail: IBlockRegistrationRule | undefined = result.data.ruleDetail;
                this.setState({
                    blockRegistrationRule: newRuleDetail ?
                        newRuleDetail : this.setEmptyRule(),
                    blocksAdded: (newBlocksAdded && newBlocksAdded.length > 0) ?
                        newBlocksAdded : [],
                    ruleName: newRuleDetail ? newRuleDetail.name : '',
                    rulePriority: newRuleDetail ? newRuleDetail.priority : 0,
                    viewOptions: result.data.viewOptions
                });
                if (isAddEditRule) {
                    this.hideLoaderContent();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDetails.name, e));
        }
    };

    private resolveGetRules = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetRules.name, this.hideAllLoaders);

            if (result?.status) {
                const rulesList: IBlockRegistrationRuleHeaders | undefined = result.data;
                const rowsPerPageOptions: number[] = rulesList
                    ? this.getRowsPerPageOptions(rulesList.overallCount) : [];
                if (rulesList
                    && rulesList.blockRegistrationRuleHeaderList
                    && rulesList.blockRegistrationRuleHeaderList.length > 0) {
                    this.isPeriodWithRules = true;
                }
                this.setState({
                    rowsPerPageOptions: rowsPerPageOptions,
                    rulesList: rulesList
                }, () => {
                    if (this.isFirstLoad) {
                        this.hideAllLoaders();
                        this.isFirstLoad = false;
                    }
                    else {
                        this.hideLoaderSearch();
                    }
                });
            }
        }
        catch (e) {
            this.hideAllLoaders();
            this.logError(LogData.fromException(this.resolveGetRules.name, e));
        }
    };

    private resolvePostEnableRule = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostEnableRule.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    rulesList
                } = this.state;

                if (rulesList
                    && rulesList.blockRegistrationRuleHeaderList
                    && rulesList.blockRegistrationRuleHeaderList.length > 0) {
                    const index: number = rulesList.blockRegistrationRuleHeaderList.findIndex(rule =>
                        rule.blockRegistrationRuleId === result.data.blockRegistrationRuleId);
                    if (index > -1) {
                        if (!result.data.result) {
                            rulesList.blockRegistrationRuleHeaderList[index].isActive =
                                !rulesList.blockRegistrationRuleHeaderList[index].isActive;
                            this.setState({
                                rulesList: rulesList
                            });
                            this.logError(LogData.badJsonResult(this.resolvePostEnableRule.name));
                        }
                        else {
                            if (this.layoutResources) {
                                LayoutActions.setAlert({
                                    message: this.layoutResources.lblSuccessSave,
                                    messageType: ResultType.success,
                                    snackbar: true
                                } as IAlert);
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostEnableRule.name, e));
        }
    };

    // #region Add Group
    private resolveGetBlockDetail = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetBlockDetail.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    blockRegistrationRule
                } = this.state;
                const blockDetail: IBlockRegistrationGroupDetail = result.data;

                if (blockDetail && blockRegistrationRule) {
                    let block: IBlockRegistrationGroupHeader | undefined;
                    blockRegistrationRule.blockRegRuleGroups.find(bg => (
                        block = bg.blockDetails.find(b => b.blockRegistrationGroupId ===
                            blockDetail.blockRegistrationGroup.blockRegistrationGroupId)
                    ));
                    if (block) {
                        block.sectionList = blockDetail.sectionList;
                        block.isLoadingDetail = false;

                        this.setState({
                            blockRegistrationRule: blockRegistrationRule
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetBlockDetail.name, e));
        }
    };
    // #endregion Add Group

    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            Requests.getDetails(this.resolveGetDetails, this.logError);
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
            nameToSearch,
            resources,
            rulesList,

            // #region Add Rule
            anchorEl,
            blockRegistrationRule,
            isAddEditRule,
            isLoadingContent,
            isLoadingSaveRule,
            isLoadingSearch,
            isLoadingValidationName,
            isLoadingValidationPriority,
            openInfo,
            viewOptions,
            // #endregion Add Rule

            // #region Add Group
            group,
            openAddGroupModal,
            // #endregion Add Group

            // #region Search Blocks
            blocksAdded,
            hasSearchBlocks,
            openSearchBlockModal,
            // #endregion Search Blocks

            // #region Edit
            isEditGroup,
            // #endregion Edit

            // #region Pagination
            page,
            rowsPerPage,
            rowsPerPageOptions
            // #endregion Pagination
        } = this.state;

        const {
            classes,
            termPeriodDescription,
            termPeriodIdSelected
        } = this.props;

        let addGroupModal: JSX.Element | undefined;
        let searchBlockModal: JSX.Element | undefined;
        let contentPage: JSX.Element | undefined;
        let headerSidebar: JSX.Element | undefined;
        let textTitleSidebar: string = '';

        let totalRows: number = 0;
        if (rulesList && rulesList.overallCount > 0) {
            totalRows = rulesList ? rulesList.overallCount : 0;
        }

        if (!componentError && resources && this.layoutResources) {
            const emptyOption: IDropDownOption = {
                description: this.layoutResources.lblDropDownEmptyText,
                value: ''
            };

            if (isLoadingContent) {
                contentPage = (
                    <ContainerLoader id="ldrEmptyContent" height="md" />
                );
            }
            else {
                if (isAddEditRule && blockRegistrationRule) {
                    textTitleSidebar = blockRegistrationRule.blockRegistrationRuleId ?
                        resources.lblEditingRule : resources.lblAddRuleTitle;
                    contentPage = (
                        <RuleAddEdit
                            anchorEl={anchorEl}
                            blockRegistrationRule={blockRegistrationRule}
                            emptyOption={emptyOption}
                            isLoadingSaveRule={isLoadingSaveRule}
                            isLoadingValidationPriority={isLoadingValidationPriority}
                            isLoadingValidationRuleName={isLoadingValidationName}
                            openInfo={openInfo}
                            resources={resources.ruleAddEditRes}
                            viewOptions={viewOptions}
                            onBlurNameTextField={this.onBlurNameTextField}
                            onBlurPriorityTextField={this.onBlurPriorityTextField}
                            onCancelAddRule={this.onCancelAddRule}
                            onChangeTextField={this.onChangeTextField}
                            onChangeTextNumeric={this.onChangeTextNumeric}
                            onCheckboxChange={this.onCheckboxChange}
                            onClosePopper={this.onClosePopper}
                            onDeleteBlock={this.onDeleteBlock}
                            onDeleteGroup={this.onDeleteGroup}
                            onDragEnd={this.onDragEnd}
                            onDropdownChange={this.onDropdownChange}
                            onEditGroup={this.onEditGroup}
                            onExpandBlockDetails={this.onExpandBlockDetails}
                            onExpandGroupDetails={this.onExpandGroupDetails}
                            onOpenAddGroupModal={this.onOpenAddGroupModal}
                            onOpenPopper={this.onOpenPopper}
                            onOpenSearchBlocksModal={this.onOpenSearchBlocksModal}
                            onSaveAddRule={this.onSaveAddRule}
                            onShowBlockDetails={this.onShowBlockDetails}
                            onShowGroupDetails={this.onShowGroupDetails}
                        />
                    );
                }
                else if (this.isPeriodWithRules) {
                    textTitleSidebar = Format.toString(resources.formatTitlePeriod,
                        [termPeriodDescription]);
                    contentPage = (
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={12} sm={7} md={9}>
                                        <Search
                                            id="txtSearchRules"
                                            value={nameToSearch}
                                            onChange={this.onChangeRuleName}
                                            onClear={this.onClearRuleName}
                                            onSearchInvoked={this.onSearch}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Button
                                            align="left"
                                            id="btnRetrieveAll"
                                            textVariantStyling="inherit"
                                            variant="text"
                                            onClick={this.onRetrieveAll}
                                        >
                                            {resources.lblRetrieveAll}
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip
                                            id="tltAddRule"
                                            placement="top"
                                            title={resources.lblAddRule}
                                        >
                                            <IconButton
                                                aria-label={resources.lblAddRule}
                                                onClick={this.onAddRule}
                                                id="btnAddRule"
                                            >
                                                <Icon name="add" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                                {isLoadingSearch ? (
                                    <ContainerLoader id="ldrEmptyContent" height="md" />
                                ) : (rulesList
                                    && rulesList.blockRegistrationRuleHeaderList
                                    && rulesList.blockRegistrationRuleHeaderList.length > 0 ?
                                    (
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <Table
                                                    breakpoint="sm"
                                                    classes={{ root: classes.table }}
                                                    id="tblAgreementsList"
                                                >
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell component="th">
                                                                <span>
                                                                    {resources.lblName}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell component="th">
                                                                <span>
                                                                    {resources.lblPriority}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell component="th">
                                                                <span>
                                                                    {resources.lblEnable}
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {rulesList.blockRegistrationRuleHeaderList.map((rule, i) => (
                                                            <TableRow key={`ruleRow_${i}`}>
                                                                <TableCell
                                                                    columnName={resources.lblName}
                                                                    scope="row"
                                                                >
                                                                    <Link
                                                                        id={`ruleName_${i}`}
                                                                        onClick={this.onEditRule}
                                                                    >
                                                                        {rule.name}
                                                                    </Link>
                                                                </TableCell>
                                                                <TableCell
                                                                    columnName={resources.lblPriority}
                                                                    scope="row"
                                                                >
                                                                    <span>
                                                                        {rule.priority}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell
                                                                    columnName={resources.lblEnable}
                                                                    scope="row"
                                                                >
                                                                    <Switch
                                                                        inputProps={{
                                                                            'aria-label': rule.isActive ?
                                                                                resources.lblActive : resources.lblInactive
                                                                        }}
                                                                        id={`enableRule_${i}`}
                                                                        checked={rule.isActive || false}
                                                                        onChange={this.onChangeSwitch}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>

                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Grid>
                                            {rowsPerPage > 0 && (
                                                <Grid item xs>
                                                    <Pagination
                                                        count={totalRows}
                                                        page={page}
                                                        rowsPerPage={rowsPerPage}
                                                        rowsPerPageOptions={rowsPerPageOptions}
                                                        onPageChange={this.onChangePage}
                                                        onRowsPerPageChange={this.onChangeRowsPerPage}
                                                    />
                                                </Grid>
                                            )}
                                        </Grid>
                                    )
                                    : (
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <Illustration
                                                    color="secondary"
                                                    name="no-search-results"
                                                    text={resources.lblNoResults}
                                                />
                                            </Grid>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </Grid>
                    );
                }
                else {
                    textTitleSidebar = Format.toString(resources.formatTitlePeriod,
                        [termPeriodDescription]);
                    contentPage = (
                        <>
                            <Grid container spacing={3} justifyContent="flex-end">
                                <Grid item>
                                    <Tooltip
                                        id="tltAdd"
                                        placement="top"
                                        title={resources.lblAddRule}
                                    >
                                        <IconButton
                                            aria-label={resources.lblAddRule}
                                            onClick={this.onAddRule}
                                            id="btnAddRule"
                                        >
                                            <Icon name="add" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Illustration
                                        color="secondary"
                                        name="no-search-results"
                                        text={resources.lblEmptyRule}
                                    />
                                </Grid>
                            </Grid>
                        </>
                    );
                }

            }

            headerSidebar = (
                <Hidden smDown>
                    <Grid container spacing={3}>
                        <Grid item xs className={classes.headerCourse}>
                            <Text id="txtCourseName" size="h2">
                                {textTitleSidebar}
                            </Text>
                            <Divider noMarginBottom />
                        </Grid>
                    </Grid>
                </Hidden>
            );

            if (openAddGroupModal) {
                addGroupModal = (
                    <RuleAddGroup
                        isEdit={isEditGroup}
                        group={group}
                        open={openAddGroupModal}
                        period={termPeriodDescription}
                        resources={resources.ruleAddGroupRes}
                        onAddAndSearch={this.onAddGroupAndSearch}
                        onBlurTextField={this.onBlurGroupNameTextField}
                        onChangeTextField={this.onChangeTextField}
                        onClose={this.onCancelAddGroup}
                        onAdd={this.onAddGroup}
                    />
                );
            }

            if (openSearchBlockModal) {
                searchBlockModal = (
                    <RuleSearchBlock
                        blocksAdded={blocksAdded}
                        blockListIndex={this.blockListIndex}
                        groups={blockRegistrationRule
                            ? blockRegistrationRule.blockRegRuleGroups : undefined}
                        hasSearchBlocks={hasSearchBlocks}
                        open={openSearchBlockModal}
                        period={termPeriodDescription}
                        resources={resources.ruleAddGroupRes}
                        selectedGroupIndex={this.selectedGroupIndex}
                        termPeriodId={termPeriodIdSelected}
                        onAddAndSelect={this.onAddAndSelectMoreBlocks}
                        onAddBlocks={this.onAddBlocks}
                        onCancel={this.onCancelAddGroup}
                        setHasSearchBlocks={this.setHasSearchBlocks}
                        setSelectedBlocks={this.setSelectedBlocks}
                    />
                );
            }

            contentPage = (
                <>
                    {headerSidebar}
                    {contentPage}
                    {addGroupModal}
                    {searchBlockModal}
                </>
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
export default withWidth()(withStyles(styles)(Rule));