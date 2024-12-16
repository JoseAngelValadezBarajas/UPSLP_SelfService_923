/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: RuleAddEdit.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Internal components
import BlockItem, { IBlockItemResProps } from './BlockItem';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Collapse from '@hedtech/powercampus-design-system/react/core/Collapse';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import { DragDropContext, Draggable, Droppable } from '@hedtech/powercampus-design-system/react/core/DragNDrop';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import List, { ListItem, ListItemText } from '@hedtech/powercampus-design-system/react/core/List';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IBlockRegistrationRule } from '../../../Types/Administration/IBlockRegistrationRule';
import { IBlockRegistrationRuleGroup } from '../../../Types/Administration/IBlockRegistrationRuleGroup';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthDown, isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';
// #endregion Imports

// #region Types
export interface IRuleAddEditProps {
    anchorEl: any;
    blockRegistrationRule: IBlockRegistrationRule;
    emptyOption: IDropDownOption;
    isLoadingSaveRule: boolean;
    isLoadingValidationRuleName: boolean;
    isLoadingValidationPriority: boolean;
    openInfo: boolean;
    resources: IRuleAddEditResProps;
    viewOptions: IDropDownOption[];
    onBlurNameTextField: () => void;
    onBlurPriorityTextField: () => void;
    onCancelAddRule: () => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeTextNumeric: (priority: number) => void;
    onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClosePopper: () => void;
    onDeleteBlock: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onDeleteGroup: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onDragEnd: (result: any) => void;
    onDropdownChange: (optionSelected: IDropDownOption, _id: string) => void;
    onEditGroup: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onExpandBlockDetails: (event: any) => void;
    onExpandGroupDetails: (event: any) => void;
    onOpenAddGroupModal: () => void;
    onOpenPopper: (event: any) => void;
    onOpenSearchBlocksModal: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onSaveAddRule: () => void;
    onShowBlockDetails: (event: any) => void;
    onShowGroupDetails: (event: any) => void;
}

export interface IRuleAddEditResProps {
    blockItemRes: IBlockItemResProps;
    btnCancel: string;
    btnSave: string;
    lblActive: string;
    lblAddBlocks: string;
    lblAddGroup: string;
    lblBlockRegistrationOnly: boolean;
    lblBlockRegistrationOnlyDesc: string;
    lblBlocks: string;
    lblDelete: string;
    lblDragDropInstructions: string;
    lblDuplicateNameError: string;
    lblDuplicatePriorityError: string;
    lblGroups: string;
    lblHideDetails: string;
    lblMaximumNumberGroups: string;
    lblName: string;
    lblNameError: string;
    lblNoBlocks: string;
    lblNoGroups: string;
    lblPriority: string;
    lblPriorityNumberError: string;
    lblRuleInUse: string;
    lblShowDetails: string;
    lblViewName: string;
    lblViewNameError: string;
}

const styles = (theme: Theme) => createStyles({
    alignCenter: {
        marginBottom: Tokens.spacing40,
        textAlign: 'center'
    },
    detailMargin: {
        margin: Tokens.spacing40
    },
    expandCard: {
        marginBottom: Tokens.spacing50
    },
    expandListItem: {
        cursor: 'inherit'
    },
    font: {
        fontFamily: Tokens.fontFamilyDefault,
        fontSize: Tokens.fontSizeDefault
    },
    icon: {
        color: theme.palette.grey[800],
        cursor: 'pointer'
    },
    iconInfo: {
        display: 'inline-flex',
        verticalAlign: 'middle'
    },
    marginLeft: {
        marginLeft: Tokens.spacing40
    },
    popperText: {
        maxWidth: '15rem'
    },
    sectionsMargin: {
        marginTop: Tokens.spacing40
    }
});

type PropsWithStyles = IRuleAddEditProps & WithStyles<typeof styles> & WithWidth;

const setDragContent = (
    group: IBlockRegistrationRuleGroup,
    index: number,
    props: PropsWithStyles
): JSX.Element => {
    const {
        classes,
        resources,
        width,
        onDeleteBlock,
        onDeleteGroup,
        onEditGroup,
        onExpandBlockDetails,
        onExpandGroupDetails,
        onOpenSearchBlocksModal,
        onShowBlockDetails,
        onShowGroupDetails
    } = props;

    const expandButton: JSX.Element = (
        <IconButton
            aria-label={group.expanded ? resources.lblHideDetails
                : resources.lblShowDetails}
            color="gray"
            id={`btnViewDetails_${index}`}
            onClick={onExpandGroupDetails}
        >
            {group.expanded ? (<Icon name="chevron-up" />)
                : (<Icon name="chevron-down" />)}
        </IconButton>
    );

    return (
        <Card
            classes={{ root: classes.expandCard }}
            key={`group_${index}`}
        >
            <ListItem
                classes={{ root: classes.expandListItem }}
                id={`cardGroup_${index}`}
                noHover
            >
                <ListItemText
                    disableTypography
                    id={`groupTxt_${index}`}
                    primary={(
                        <Grid
                            alignItems="center"
                            container
                            justifyContent="space-between"
                            spacing={isWidthDown('sm', width) ? 1 : 3}
                        >
                            <Grid
                                item
                                className={classes.font}
                                xs
                            >
                                <AvatarText
                                    ButtonProps={{
                                        id: `btnEditGroup_${index}`,
                                        onClick: onEditGroup
                                    }}
                                    avatarInfo={{
                                        colorFirstLetter: group.numberOfBlocks > 0 ? 2 : 5,
                                        firstLetter: String(group.numberOfBlocks),
                                        fullName: group.name
                                    }}
                                    avatarLabel={resources.lblBlocks}
                                    IconProps={{
                                        marginRight: true,
                                        name: 'drag',
                                        type: 'default'
                                    }}
                                    primaryTextProps={{
                                        size: isWidthDown('sm', width) ? 'default' : 'h4'
                                    }}
                                    withAvatar={isWidthDown('sm', width) ? false : true}
                                />
                            </Grid>
                            <Grid item>
                                <Grid
                                    container
                                    alignItems="center"
                                    justifyContent="flex-end"
                                    spacing={1}
                                    wrap="nowrap"
                                >
                                    {isWidthUp('md', width)
                                        && group.isEditable
                                        && (
                                            <>
                                                <Grid item>
                                                    <Tooltip
                                                        id="tltAddBlocks"
                                                        placement="top"
                                                        title={resources.lblAddBlocks}
                                                    >
                                                        <IconButton
                                                            aria-label={
                                                                resources.lblAddBlocks}
                                                            color="gray"
                                                            id={`btnAddBlocks_${index}`}
                                                            onClick={onOpenSearchBlocksModal}
                                                        >
                                                            <Icon name="add" large />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item>
                                                    <Tooltip
                                                        id="tllDeleteGroup"
                                                        placement="top"
                                                        title={resources.lblDelete}
                                                    >
                                                        <IconButton
                                                            aria-label={
                                                                resources.lblDelete}
                                                            color="gray"
                                                            id={`btnDeleteGroup_${index}`}
                                                            onClick={onDeleteGroup}
                                                        >
                                                            <Icon name="trash" large />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </>
                                        )}
                                    <Grid item>
                                        {expandButton}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                />
            </ListItem>
            <Collapse
                in={group.expanded}
            >
                <div className={classes.detailMargin}>
                    {isWidthDown('sm', width) ? (
                        <Grid container spacing={1} alignItems="center">
                            <Grid item xs={6}>
                                <Text>
                                    {resources.lblBlocks}
                                </Text>
                            </Grid>
                            <Grid item xs={6}>
                                <Text className={classes.marginLeft}>
                                    {group.numberOfBlocks}
                                </Text>
                            </Grid>
                            {group.isEditable && (
                                <>
                                    <Grid item xs={6}>
                                        <Text>
                                            {resources.lblAddBlocks}
                                        </Text>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <IconButton
                                            aria-label={resources.lblAddBlocks}
                                            color="gray"
                                            id={`btnAddBlocks_${index}`}
                                            onClick={onOpenSearchBlocksModal}
                                        >
                                            <Icon name="add" large />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Text>
                                            {resources.lblDelete}
                                        </Text>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <IconButton
                                            aria-label={resources.lblDelete}
                                            color="gray"
                                            id={`btnDeleteGroup_${index}`}
                                            onClick={onDeleteGroup}
                                        >
                                            <Icon name="trash" large />
                                        </IconButton>
                                    </Grid>
                                </>
                            )}
                            <Grid item xs={12} className={classes.alignCenter}>
                                <Button
                                    align="left"
                                    id={`btnShowDetails_${index}`}
                                    variant="text"
                                    textVariantStyling="inherit"
                                    onClick={onShowGroupDetails}
                                >
                                    {group.expandedDetails ?
                                        resources.lblHideDetails :
                                        resources.lblShowDetails}
                                </Button>
                            </Grid>
                        </Grid>
                    ) : undefined}
                    {group.isLoadingDetail ?
                        (<ContainerLoader id="ldrEmptyDetail" height="sm" />)
                        : ((isWidthUp('md', width) || (isWidthDown('sm', width)
                            && group.expandedDetails))
                            && ((group.blockDetails
                                && group.blockDetails.length > 0) ? (
                                    group.blockDetails.map((block, blockIndex) => (
                                        <BlockItem
                                            block={block}
                                            blockIndex={blockIndex}
                                            groupIndex={index}
                                            isEditable={group.isEditable}
                                            isRuleGroup
                                            key={`blockItem_${blockIndex}`}
                                            resources={resources.blockItemRes}
                                            onDeleteBlock={onDeleteBlock}
                                            onExpandBlockDetails={onExpandBlockDetails}
                                            onShowDetails={onShowBlockDetails}
                                        />
                                    ))
                                ) : (
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <MessageStyled
                                                classMessage="noResults"
                                                message={resources.lblNoBlocks}
                                            />
                                        </Grid>
                                    </Grid>
                                )
                            )
                        )
                    }
                </div>
            </Collapse>
        </Card>
    );
};
// #endregion Types

// #region Component
const RuleAddEdit: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        anchorEl,
        blockRegistrationRule,
        classes,
        emptyOption,
        isLoadingSaveRule,
        isLoadingValidationRuleName,
        isLoadingValidationPriority,
        openInfo,
        resources,
        viewOptions,
        onBlurNameTextField,
        onBlurPriorityTextField,
        onCancelAddRule,
        onChangeTextField,
        onChangeTextNumeric,
        onCheckboxChange,
        onClosePopper,
        onDragEnd,
        onDropdownChange,
        onOpenAddGroupModal,
        onOpenPopper,
        onSaveAddRule
    } = props;

    const isGroupNotEditable: boolean = Boolean(blockRegistrationRule.blockRegRuleGroups.find(g => g.isEditable === false));
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={10}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Alert
                            id="msgRuleInUse"
                            open={isGroupNotEditable}
                            text={resources.lblRuleInUse}
                            type={ResultType.warning}
                            userDismissable={false}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            disabled={isLoadingValidationRuleName || isLoadingSaveRule}
                            id="txtName"
                            label={resources.lblName}
                            maxCharacters={100}
                            required
                            error={blockRegistrationRule.isRuleNameError
                                || blockRegistrationRule.isRuleNameDuplicated}
                            helperText={blockRegistrationRule.isRuleNameError ?
                                resources.lblNameError : (blockRegistrationRule.isRuleNameDuplicated ?
                                    resources.lblDuplicateNameError : undefined)}
                            value={blockRegistrationRule.name || ''}
                            onBlur={onBlurNameTextField}
                            onChange={onChangeTextField}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Dropdown
                            disabled={isLoadingSaveRule}
                            emptyOption={emptyOption}
                            required
                            id="ddlViewNames"
                            error={blockRegistrationRule.isViewNameError}
                            helperText={blockRegistrationRule.isViewNameError ?
                                resources.lblViewNameError : undefined}
                            label={resources.lblViewName}
                            options={viewOptions}
                            value={blockRegistrationRule.viewName || 0}
                            onChange={onDropdownChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            disabled={isLoadingValidationPriority || isLoadingSaveRule}
                            error={blockRegistrationRule.isPriorityError
                                || blockRegistrationRule.isPriorityDuplicated}
                            helperText={blockRegistrationRule.isPriorityError ?
                                resources.lblPriorityNumberError :
                                (blockRegistrationRule.isPriorityDuplicated ?
                                    resources.lblDuplicatePriorityError : undefined)}
                            id="txtPriority"
                            label={resources.lblPriority}
                            max={999}
                            min={0}
                            onBlur={onBlurPriorityTextField}
                            onChange={onChangeTextNumeric}
                            precision={0}
                            required
                            step={1}
                            type="number"
                            value={blockRegistrationRule.priority || ''}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Checkbox
                            checked={blockRegistrationRule.isBlockRegistrationOnly || false}
                            disabled={isLoadingSaveRule}
                            id="chkBlockRegistrationOnly"
                            label={resources.lblBlockRegistrationOnly}
                            onChange={onCheckboxChange}
                        />
                        <div className={classes.iconInfo}>
                            <Icon
                                className={classes.icon}
                                name="info"
                                onClick={onOpenPopper}
                            />
                            <Popper
                                arrow
                                id="popBlockRegistrationOnly"
                                open={openInfo}
                                placement="bottom-start"
                                anchorEl={anchorEl}
                                onClickAway={onClosePopper}
                                text={resources.lblBlockRegistrationOnlyDesc}
                                transition={false}
                                TextTypographyProps={{ className: classes.popperText }}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Checkbox
                            checked={blockRegistrationRule.isActive || false}
                            disabled={isLoadingSaveRule}
                            id="chkActive"
                            label={resources.lblActive}
                            onChange={onCheckboxChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Text
                                    className={classes.sectionsMargin}
                                    gutterBottom
                                    size="h4"
                                >
                                    {resources.lblGroups}
                                </Text>
                                <Text>
                                    {resources.lblDragDropInstructions}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Tooltip
                                    id="tltAddGroup"
                                    placement="top"
                                    title={resources.lblAddGroup}
                                >
                                    <div>
                                        <IconButton
                                            arial-label={resources.lblAddGroup}
                                            disabled={(Boolean(blockRegistrationRule.blockRegRuleGroups
                                                && blockRegistrationRule.blockRegRuleGroups.length >= 9))
                                                || isLoadingSaveRule}
                                            onClick={onOpenAddGroupModal}
                                            id="btnAddGroup"
                                        >
                                            <Icon name="add" />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                            </Grid>
                        </Grid>
                        {blockRegistrationRule.blockRegRuleGroups
                            && blockRegistrationRule.blockRegRuleGroups.length > 0 ? (
                                <>
                                    <Grid container>
                                        <Grid item xs>
                                            <Alert
                                                id="msgHasMaximumGroup"
                                                open={blockRegistrationRule.blockRegRuleGroups
                                                    && blockRegistrationRule.blockRegRuleGroups.length === 9}
                                                text={resources.lblMaximumNumberGroups}
                                                type={ResultType.warning}
                                                userDismissable={false}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <List id="lstRuleGroups">
                                                <DragDropContext onDragEnd={onDragEnd}>
                                                    <Droppable droppableId="drpGroup">
                                                        {blockRegistrationRule.blockRegRuleGroups
                                                            && blockRegistrationRule.blockRegRuleGroups.map((group, index) => (
                                                                <Draggable
                                                                    key={`drgGroup_${index}`}
                                                                    draggableId={`drgGroup_${index}`}
                                                                    index={index}
                                                                    styleName="primaryNoBorder"
                                                                >
                                                                    {setDragContent(group, index, props)}
                                                                </Draggable>
                                                            ))}
                                                    </Droppable>
                                                </DragDropContext>
                                            </List>
                                        </Grid>
                                    </Grid >
                                </>
                            ) : (
                                <Grid container>
                                    <Grid item xs={12}>
                                        <MessageStyled
                                            classMessage="noResults"
                                            message={resources.lblNoGroups}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <ButtonGroup
                            id="bgSaveAddRule"
                        >
                            <Button
                                disabled={isLoadingValidationPriority
                                    || isLoadingValidationRuleName
                                    || isLoadingSaveRule
                                }
                                loading={isLoadingValidationPriority
                                    || isLoadingValidationRuleName
                                    || isLoadingSaveRule
                                }
                                id="btnSave"
                                onClick={onSaveAddRule}
                            >
                                {resources.btnSave}
                            </Button>
                            <Button
                                color="secondary"
                                id="btnCancel"
                                onClick={onCancelAddRule}
                            >
                                {resources.btnCancel}
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
// #endregion Component

// Export: Component
export default withWidth()(withStyles(styles)(RuleAddEdit));