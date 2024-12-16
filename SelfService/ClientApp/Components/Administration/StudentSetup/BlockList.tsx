/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: BlockList.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import List from '@hedtech/powercampus-design-system/react/core/List';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Search from '@hedtech/powercampus-design-system/react/core/Search';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import BlockItem, { IBlockItemResProps } from './BlockItem';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IBlockRegistrationGroupSearch } from '../../../Types/Administration/IBlockRegistrationGroup';
import { IBlockRegistrationGroupDetail } from '../../../Types/Administration/IBlockRegistrationGroupDetail';
import { IBlockRegistrationGroupHeader, IBlockRegistrationGroupHeaders } from '../../../Types/Administration/IBlockRegistrationGroupHeader';
import { IBlockRegistrationRuleGroup } from '../../../Types/Administration/IBlockRegistrationRuleGroup';
import { IBlockListResources } from '../../../Types/Resources/Administration/IBlockListResources';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthDown, isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/BlockList';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IBlockListProps {
    hidden?: boolean;
    termPeriodId: number;
    onAdd?: () => void;
    onEdit?: (event: React.MouseEvent<HTMLButtonElement>) => void;

    // #region Add Group
    blocksAdded?: number[];
    groups?: IBlockRegistrationRuleGroup[];
    isRuleGroup?: boolean;
    isSearchBlock?: boolean;
    selectedGroupIndex?: number;
    showCheckboxes?: boolean;
    setHasSearchBlocks?: (hasSearchBlocks: boolean) => void;
    setSelectedBlocks?: (selectedBlocks: IBlockRegistrationGroupHeader[]) => void;
    // #endregion Add Group
}

interface IBlockListState {
    blocksList?: IBlockRegistrationGroupHeaders;
    componentError: boolean;
    filterSelected: number;
    isLoadingContent: boolean;
    isLoadingSearch: boolean;
    isPeriodWithBlocks: boolean;
    name: string;
    resources?: IBlockListRes;
    selectedBlocks: IBlockRegistrationGroupHeader[];

    // #region Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    // #endregion Pagination
}

interface IBlockListRes extends IBlockListResources {
    blockItemRes: IBlockItemResProps;
}

const styles = () => createStyles({
    blockListItem: {
        '&:hover': {
            backgroundColor: Tokens.colorBrandNeutral100
        }
    },
    paddingTop: {
        paddingTop: Tokens.spacing50
    }
});

type PropsWithStyles = IBlockListProps & WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
class BlockList extends React.Component<PropsWithStyles, IBlockListState> {
    private abortController: AbortController;
    private idModule: string;
    private idPage: string;
    private isFirstLoad: boolean;
    private layoutResources?: ILayoutResources;
    // #region Pagination
    private rowsPerPageOptions: number[];
    // #endregion Pagination

    public readonly state: Readonly<IBlockListState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.abortController = new AbortController();
        this.idModule = 'Administration';
        this.idPage = 'BlockList';
        this.isFirstLoad = true;
        this.state = this.getInitialState();
        this.layoutResources = LayoutStore.getResourcesLayout();
        // #endregion Initialize Variables and State

        // #region Pagination
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        // #endregion Pagination
    }

    private getInitialState(): IBlockListState {
        let resources: IBlockListRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            filterSelected: 1,
            isLoadingContent: true,
            isLoadingSearch: false,
            isPeriodWithBlocks: false,
            name: '',
            resources: resources,
            selectedBlocks: [],

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
                filterSelected,
                name,
                page,
                rowsPerPage
            } = this.state;

            this.abortController.abort();
            this.abortController = new AbortController();
            this.showLoaderSearch();
            const blockSearch: IBlockRegistrationGroupSearch = {
                filter: filterSelected,
                length: rowsPerPage,
                name: name,
                startIndex: page * rowsPerPage,
                termPeriodId: this.props.termPeriodId
            };
            Requests.getBlocks(blockSearch,
                this.resolveGetBlocks,
                this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.setContent.name, e));
        }
    };
    // #endregion Pagination

    // #region Events
    private onChangeName = (event: any): void => {
        try {
            this.setState({
                name: event.target.value
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeName.name, e));
        }
    };

    private onChangeSwitch = (event: any): void => {
        try {
            const ids: string[] = event.target.id.split('_');
            const {
                blocksList
            } = this.state;
            let newIsActive: boolean = false;
            let blockRegistrationGroupId: number = 0;
            if (blocksList
                && blocksList.blockRegistrationGroupHeaderList
                && blocksList.blockRegistrationGroupHeaderList.length > 0) {
                blockRegistrationGroupId = blocksList.blockRegistrationGroupHeaderList[Number(ids[1])].blockRegistrationGroupId;
                newIsActive = event.target.checked;

                blocksList.blockRegistrationGroupHeaderList[Number(ids[1])].isActive = newIsActive;
                this.setState({
                    blocksList: blocksList
                }, () => {
                    Requests.postEnableBlock(blockRegistrationGroupId, newIsActive, this.resolvePostEnableBlock, this.logError);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeSwitch.name, e));
        }
    };

    private onClearName = (): void => {
        try {
            this.setState({
                name: ''
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearName.name, e));
        }
    };

    private onDropdownChange = (optionSelected: IDropDownOption): void => {
        try {
            this.setState({
                filterSelected: Number(optionSelected.value)
            }, () => {
                if (!this.props.isRuleGroup) {
                    this.setContent();
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onExpandBlockDetails = (event: any): void => {
        try {
            const {
                width
            } = this.props;
            const {
                blocksList
            } = this.state;

            const index: number = Number(event.target.id.split('_')[1]);

            if (blocksList) {
                const blockIsExpanded: boolean = Boolean(blocksList.blockRegistrationGroupHeaderList[index].expanded);

                if (isWidthUp('md', width) && !blockIsExpanded && !blocksList.blockRegistrationGroupHeaderList[index].sectionList) {
                    blocksList.blockRegistrationGroupHeaderList[index].isLoadingDetail = true;
                    Requests.getBlockDetail(blocksList.blockRegistrationGroupHeaderList[index].blockRegistrationGroupId,
                        this.resolveGetBlockDetail, this.logError);
                }

                blocksList.blockRegistrationGroupHeaderList[index].expanded = !blockIsExpanded;
                this.setState({
                    blocksList: blocksList
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandBlockDetails.name, e));
        }
    };

    private onShowDetails = (event: any): void => {
        try {
            const {
                width
            } = this.props;
            const {
                blocksList
            } = this.state;

            const blockPostion: number = Number(event.currentTarget.id.split('_')[1]);

            if (blocksList) {
                const blockIsExpandedDetails: boolean = Boolean(blocksList.blockRegistrationGroupHeaderList[blockPostion].expandedDetails);

                if (isWidthDown('sm', width) && !blockIsExpandedDetails && !blocksList.blockRegistrationGroupHeaderList[blockPostion].sectionList) {
                    blocksList.blockRegistrationGroupHeaderList[blockPostion].isLoadingDetail = true;
                    Requests.getBlockDetail(blocksList.blockRegistrationGroupHeaderList[blockPostion].blockRegistrationGroupId,
                        this.resolveGetBlockDetail, this.logError);
                }

                blocksList.blockRegistrationGroupHeaderList[blockPostion].expandedDetails = !blockIsExpandedDetails;
                this.setState({
                    blocksList: blocksList
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onShowDetails.name, e));
        }
    };

    private onRetrieveAll = (): void => {
        try {
            this.setState({
                name: '',
                page: 0,
                rowsPerPage: 5
            }, this.setContent);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRetrieveAll.name, e));
        }
    };

    private onSearch = (): void => {
        try {
            const {
                name
            } = this.state;
            if (name !== '') {
                this.setContent();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearch.name, e));
        }
    };

    private onNewSearch = (): void => {
        try {
            const {
                setHasSearchBlocks,
                setSelectedBlocks
            } = this.props;
            this.setState({
                blocksList: undefined,
                filterSelected: 1,
                isPeriodWithBlocks: false,
                name: '',
                selectedBlocks: []
            }, () => {
                if (setHasSearchBlocks && setSelectedBlocks) {
                    setHasSearchBlocks(false);
                    setSelectedBlocks([]);
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onNewSearch.name, e));
        }
    };

    private onCheckboxChange = (event: any): void => {
        try {
            const {
                blocksList,
                selectedBlocks
            } = this.state;
            const { setSelectedBlocks } = this.props;
            const blockIndex: number = event.target.id.split('_')[1];
            if (blocksList
                && blocksList.blockRegistrationGroupHeaderList
                && blocksList.blockRegistrationGroupHeaderList.length > 0
                && blockIndex <= blocksList.blockRegistrationGroupHeaderList.length) {
                const newSelectedBlock: IBlockRegistrationGroupHeader =
                    blocksList.blockRegistrationGroupHeaderList[blockIndex];
                const selectedBlockIndex: number = selectedBlocks.findIndex(b =>
                    b.blockRegistrationGroupId === newSelectedBlock.blockRegistrationGroupId);

                if (selectedBlockIndex === -1 && event.target.checked) {
                    selectedBlocks.push(newSelectedBlock);
                }
                else if (selectedBlockIndex > -1 && !event.target.checked) {
                    selectedBlocks.splice(selectedBlockIndex, 1);
                }
                this.setState({
                    selectedBlocks: selectedBlocks
                }, () => {
                    if (setSelectedBlocks) {
                        setSelectedBlocks(selectedBlocks);
                    }
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoadingContent: false,
            isLoadingSearch: false
        });

    };

    private hideLoaderSearch = (): void => {
        this.setState({
            isLoadingSearch: false
        });
    };

    private showLoaderSearch = (): void => {
        this.setState({
            isLoadingSearch: true
        });
    };
    // #endregion Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        this.hideAllLoaders();
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
                    if (this.props.isRuleGroup) {
                        this.hideAllLoaders();
                    }
                    else {
                        this.setContent();
                    }
                });
                LayoutStore.setResourcesByKey(this.idPage, result.data);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetBlockDetail = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetBlockDetail.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    blocksList
                } = this.state;
                const blockDetail: IBlockRegistrationGroupDetail = result.data;

                if (blockDetail && blocksList && blocksList.blockRegistrationGroupHeaderList) {
                    const block: IBlockRegistrationGroupHeader | undefined
                        = blocksList.blockRegistrationGroupHeaderList.find(b =>
                            b.blockRegistrationGroupId === blockDetail.blockRegistrationGroup.blockRegistrationGroupId);
                    if (block) {
                        block.sectionList = blockDetail.sectionList;
                        block.isLoadingDetail = false;

                        this.setState({
                            blocksList: blocksList
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetBlockDetail.name, e));
        }
    };

    private resolveGetBlocks = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetBlocks.name, this.hideAllLoaders);

            if (result?.status) {
                const blocksList: IBlockRegistrationGroupHeaders | undefined = result.data;
                const {
                    isRuleGroup,
                    setHasSearchBlocks
                } = this.props;
                const rowsPerPageOptions: number[] = blocksList
                    ? this.getRowsPerPageOptions(blocksList.overallCount) : [];
                if (blocksList
                    && blocksList.blockRegistrationGroupHeaderList
                    && blocksList.blockRegistrationGroupHeaderList.length > 0) {
                    this.setState({
                        isPeriodWithBlocks: true
                    });
                    blocksList.blockRegistrationGroupHeaderList.forEach(block => {
                        block.isLoadingWarning = true;
                        Requests.getTimeConflicts(block.blockRegistrationGroupId,
                            this.resolveGetTimeConflicts, this.logError, this.abortController.signal);
                    });
                    if (setHasSearchBlocks) {
                        setHasSearchBlocks(blocksList.blockRegistrationGroupHeaderList.length > 0);
                    }
                }
                if (isRuleGroup) {
                    this.setState({
                        isPeriodWithBlocks: true
                    });
                }
                this.setState({
                    blocksList: blocksList,
                    rowsPerPageOptions: rowsPerPageOptions
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
            this.logError(LogData.fromException(this.resolveGetBlocks.name, e));
        }
    };

    private resolvePostEnableBlock = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostEnableBlock.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    blocksList
                } = this.state;

                if (blocksList
                    && blocksList.blockRegistrationGroupHeaderList
                    && blocksList.blockRegistrationGroupHeaderList.length > 0) {
                    const index: number = blocksList.blockRegistrationGroupHeaderList.findIndex(block =>
                        block.blockRegistrationGroupId === result.data.blockRegistrationGroupId);
                    if (index > -1) {
                        if (!result.data.result) {
                            blocksList.blockRegistrationGroupHeaderList[index].isActive =
                                !blocksList.blockRegistrationGroupHeaderList[index].isActive;
                            this.setState({
                                blocksList: blocksList
                            });
                            this.logError(LogData.badJsonResult(this.resolvePostEnableBlock.name));
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
            this.logError(LogData.fromException(this.resolvePostEnableBlock.name, e));
        }
    };

    private resolveGetTimeConflicts = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetTimeConflicts.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    blocksList
                } = this.state;

                if (blocksList
                    && blocksList.blockRegistrationGroupHeaderList
                    && blocksList.blockRegistrationGroupHeaderList.length > 0) {
                    const index: number = blocksList.blockRegistrationGroupHeaderList.findIndex(block =>
                        block.blockRegistrationGroupId === result.data.blockRegistrationGroupId);
                    if (index > -1) {
                        blocksList.blockRegistrationGroupHeaderList[index].hasTimeConflict = result.data.result;
                        blocksList.blockRegistrationGroupHeaderList[index].isLoadingWarning = false;
                        this.setState({
                            blocksList: blocksList
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetTimeConflicts.name, e));
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

    public componentWillUnmount(): void {
        try {
            this.abortController.abort();
            this.abortController = new AbortController();
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentWillUnmount.name, e));
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
            blocksList,
            componentError,
            filterSelected,
            isLoadingContent,
            isLoadingSearch,
            isPeriodWithBlocks,
            name,
            resources,
            selectedBlocks,

            // #region Pagination
            page,
            rowsPerPage,
            rowsPerPageOptions
            // #endregion Pagination
        } = this.state;

        const {
            classes,
            hidden,

            // #region Add Group
            blocksAdded,
            groups,
            isRuleGroup,
            isSearchBlock,
            selectedGroupIndex,
            showCheckboxes,
            // #endregion Add Group

            onAdd,
            onEdit
        } = this.props;

        let contentPage: JSX.Element | undefined;

        if (!componentError && resources && !hidden) {

            let totalRows: number = 0;
            if (blocksList && blocksList.overallCount > 0) {
                totalRows = blocksList ? blocksList.overallCount : 0;
            }

            const hasBlocksSearch: boolean | undefined = blocksList
                && blocksList.blockRegistrationGroupHeaderList
                && blocksList.blockRegistrationGroupHeaderList.length > 0;

            const sortOptions: IDropDownOption[] = [
                {
                    description: resources.lblRecent,
                    value: 1
                },
                {
                    description: resources.lblName,
                    value: 2
                }
            ];

            if (isLoadingContent) {
                contentPage = (
                    <ContainerLoader id="ldrEmptyContent" height="md" />
                );
            }
            else {
                if (isPeriodWithBlocks || isRuleGroup) {
                    contentPage = (
                        <Grid container className={isRuleGroup ? classes.paddingTop : undefined}>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={12} sm={5} md={3}>
                                        <Dropdown
                                            id="ddlSort"
                                            label={resources.lblSortBy}
                                            options={sortOptions}
                                            value={filterSelected}
                                            onChange={this.onDropdownChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={7} md={9}>
                                        <Search
                                            id="txtSearchBlocks"
                                            value={name}
                                            onChange={this.onChangeName}
                                            onClear={this.onClearName}
                                            onSearchInvoked={this.onSearch}
                                        />
                                    </Grid>
                                </Grid>
                                {isRuleGroup ? (
                                    <Grid container justifyContent={hasBlocksSearch ? 'space-between' : 'flex-end'}>
                                        {(hasBlocksSearch) && (
                                            <Grid item>
                                                <MessageStyled
                                                    classMessage="secondaryMessage"
                                                    message={Format.toString(resources.formatSelected, [selectedBlocks.length])}
                                                />
                                            </Grid>
                                        )}
                                        <Grid item>
                                            <Button
                                                align="left"
                                                id="btnNewSearch"
                                                textVariantStyling="inherit"
                                                variant="text"
                                                onClick={this.onNewSearch}
                                            >
                                                {resources.lblNewSearch}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                ) : (
                                        <Grid container justifyContent={'space-between'}>
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
                                            {onAdd && (
                                                <Grid item>
                                                    <Tooltip
                                                        id="tltAdd"
                                                        title={resources.lblAddBlock}
                                                    >
                                                        <IconButton
                                                            aria-label={resources.lblAddBlock}
                                                            onClick={onAdd}
                                                            id="btnAddBlock"
                                                        >
                                                            <Icon name="add" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            )}
                                        </Grid>
                                    )
                                }
                                {isLoadingSearch ? (
                                    <ContainerLoader id="ldrEmptyContent" height="md" />
                                ) : (blocksList
                                    && blocksList.blockRegistrationGroupHeaderList
                                    && blocksList.blockRegistrationGroupHeaderList.length > 0 ? (
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <List
                                                    id="generalClaimsByRole"
                                                >
                                                    {blocksList.blockRegistrationGroupHeaderList.map((block, i) => (
                                                        <BlockItem
                                                            block={block}
                                                            blockIndex={i}
                                                            blocksAdded={blocksAdded}
                                                            groups={groups}
                                                            isRuleGroup={isRuleGroup}
                                                            isSearchBlock={isSearchBlock}
                                                            key={`block_${i}`}
                                                            resources={resources.blockItemRes}
                                                            selectedGroupIndex={selectedGroupIndex}
                                                            selectedBlocks={selectedBlocks}
                                                            showCheckboxes={showCheckboxes}
                                                            onChangeSwitch={this.onChangeSwitch}
                                                            onCheckboxChange={this.onCheckboxChange}
                                                            onEdit={onEdit}
                                                            onExpandBlockDetails={this.onExpandBlockDetails}
                                                            onShowDetails={this.onShowDetails}
                                                        />
                                                    ))}
                                                </List>
                                            </Grid>
                                            {
                                                rowsPerPage > 0 && (
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
                                                )
                                            }
                                        </Grid >
                                    ) : (isPeriodWithBlocks && (
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <Illustration
                                                    color="secondary"
                                                    name="no-search-results"
                                                    text={resources.lblNoResults}
                                                />
                                            </Grid>
                                        </Grid>
                                    )))}
                            </Grid >
                        </Grid >
                    );
                }
                else {
                    contentPage = (
                        <Grid container>
                            <Grid item xs={12}>
                                {onAdd && (
                                    <Grid container spacing={3} justifyContent="flex-end">
                                        <Grid item>
                                            <Tooltip
                                                id="tltAdd"
                                                title={resources.lblAddBlock}
                                            >
                                                <IconButton
                                                    aria-label={resources.lblAddBlock}
                                                    onClick={onAdd}
                                                    id="btnAddBlock"
                                                >
                                                    <Icon name="add" />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                )}
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Illustration
                                            color="secondary"
                                            name="no-search-results"
                                            text={resources.lblEmptyBlock}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
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
export default withWidth()(withStyles(styles)(BlockList));