/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: BlockItem.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';
// #endregion Imports

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card from '@hedtech/powercampus-design-system/react/core/Card';
import Collapse from '@hedtech/powercampus-design-system/react/core/Collapse';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import { ListItem, ListItemText } from '@hedtech/powercampus-design-system/react/core/List';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Switch from '@hedtech/powercampus-design-system/react/core/Switch';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import BlockSections, { IBlockSectionsResProps } from './BlockSections';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthDown, isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Types
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IBlockRegistrationGroupHeader } from '../../../Types/Administration/IBlockRegistrationGroupHeader';
import { IBlockRegistrationRuleGroup, IBlockRegRuleGroupBlock } from '../../../Types/Administration/IBlockRegistrationRuleGroup';
// #region Types

export interface IBlockItemProps {
    block: IBlockRegistrationGroupHeader | IBlockRegRuleGroupBlock;
    blockIndex: number;
    blocksAdded?: number[];
    groupIndex?: number;
    groups?: IBlockRegistrationRuleGroup[];
    isEditable?: boolean;
    isRuleGroup?: boolean;
    isSearchBlock?: boolean;
    resources: IBlockItemResProps;
    selectedGroupIndex?: number;
    selectedBlocks?: IBlockRegistrationGroupHeader[];
    showCheckboxes?: boolean;
    onChangeSwitch?: (event: any) => void;
    onCheckboxChange?: (event: any) => void;
    onDeleteBlock?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onEdit?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onExpandBlockDetails: (event: any) => void;
    onShowDetails: (event: any) => void;
}

export interface IBlockItemResProps {
    blockSections: IBlockSectionsResProps;
    lblActive: string;
    lblAlerts: string;
    lblCourses: string;
    lblCreated: string;
    lblEnable: string;
    lblHideDetails: string;
    lblInactive: string;
    lblModified: string;
    lblNoSections: string;
    lblRemove: string;
    lblSectionInUse: string;
    lblShowDetails: string;
    lblStatus: string;
}

const styles = () => createStyles({
    alignCenter: {
        marginBottom: Tokens.spacing40,
        textAlign: 'center'
    },
    blockCard: {
        marginBottom: Tokens.spacing50
    },
    detailMargin: {
        margin: Tokens.spacing40
    },
    font: {
        fontFamily: Tokens.fontFamilyDefault,
        fontSize: Tokens.fontSizeDefault
    },
    iconInfo: {
        display: 'inline-flex',
        marginLeft: Tokens.spacing80,
        verticalAlign: 'middle'
    },
    warningMobile: {
        background: Tokens.colorFillAlertWarning,
        borderRadius: Tokens.borderRadiusCircle,
        display: 'inline-flex',
        height: Tokens.spacing40,
        marginLeft: '8px',
        verticalAlign: 'middle',
        width: Tokens.spacing40
    }
});

type PropsWithStyles = IBlockItemProps & WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
const BlockItem: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        block,
        blockIndex,
        blocksAdded,
        classes,
        groups,
        groupIndex,
        isEditable,
        isRuleGroup,
        isSearchBlock,
        resources,
        selectedGroupIndex,
        selectedBlocks,
        showCheckboxes,
        width,
        onChangeSwitch,
        onCheckboxChange,
        onDeleteBlock,
        onEdit,
        onExpandBlockDetails,
        onShowDetails
    } = props;

    const expandButton: JSX.Element = (
        <IconButton
            color="gray"
            id={`btnViewDetails_${blockIndex}_${groupIndex}`}
            aria-label={block.expanded ? resources.lblHideDetails
                : resources.lblShowDetails}
            onClick={onExpandBlockDetails}
        >
            {block.expanded ? (<Icon name="chevron-up" />)
                : (<Icon name="chevron-down" />)}
        </IconButton>
    );

    let isSectionNotUnique: boolean = false;
    const setCheckDisabled = (): boolean => {
        let isDisabled: boolean = false;
        if (blocksAdded) {
            isDisabled = Boolean(blocksAdded.find(b => b === block.blockRegistrationGroupId));
            // If block is not added to the rule
            if (!isDisabled
                && (selectedGroupIndex !== undefined && selectedGroupIndex > -1)
                && (groups && groups.length > 0)) {
                // for each section in the current block, check that each section is unique in all the groups
                block.sectionIdList.find(currentId => (
                    groups.find((group, currentIndex) => {
                        if (currentIndex !== selectedGroupIndex) {
                            isDisabled = Boolean(group.blockDetails.find(block =>
                                block.sectionIdList.find(sectionId => sectionId === currentId)
                            ));
                        }
                        return isDisabled;
                    })
                ));
                isSectionNotUnique = isDisabled;
            }
        }
        return isDisabled;
    };

    return (
        <Card
            classes={{ root: classes.blockCard }}
        >
            <ListItem
                id={`block_${blockIndex}`}
                noHover
            >
                <ListItemText
                    disableTypography
                    id={`blockTxt_${blockIndex}`}
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
                                    ButtonProps={!isRuleGroup ? {
                                        id: `btnEditBlock_${block.blockRegistrationGroupId}`,
                                        onClick: onEdit
                                    } : undefined}
                                    CheckboxProps={showCheckboxes ? {
                                        checked: Boolean(selectedBlocks && selectedBlocks.find(b =>
                                            b.blockRegistrationGroupId === block.blockRegistrationGroupId)),
                                        disabled: setCheckDisabled(),
                                        id: `chkSelect_${blockIndex}`,
                                        onChange: onCheckboxChange
                                    } : undefined}
                                    autoHideSecondaryTextDown
                                    avatarInfo={{
                                        colorFirstLetter: block.numberOfSections > 0 ? 2 : 5,
                                        firstLetter: String(block.numberOfSections),
                                        fullName: block.name,
                                        peopleId: `${resources.lblModified}: ${block.revisionDateTime}  ${
                                            resources.lblCreated}: ${block.createDateTime}`
                                    }}
                                    avatarLabel={resources.lblCourses}
                                    primaryTextProps={{
                                        size: isWidthDown('sm', width) ? 'default' : 'h4'
                                    }}
                                    secondaryTextProps={{
                                        size: 'small'
                                    }}
                                    withAvatar={isWidthDown('sm', width) ? false : true}
                                />
                            </Grid>
                            {isWidthDown('sm', width) ? (
                                <Grid item>
                                    {block.hasTimeConflict || isSectionNotUnique ? (
                                        <span className={classes.warningMobile} />
                                    ) : (block.isLoadingWarning && (
                                        <Icon
                                            name="spinner"
                                            spin
                                        />
                                    ))}
                                    {expandButton}
                                </Grid>
                            ) : (
                                    <Grid item>
                                        <Grid
                                            container
                                            alignItems="center"
                                            justifyContent="flex-end"
                                            spacing={1}
                                            wrap="nowrap"
                                        >
                                            <Grid item>
                                                {block.hasTimeConflict || isSectionNotUnique ? (
                                                    <div className={classes.iconInfo}>
                                                        <Tooltip
                                                            id="tltWarning"
                                                            placement="top"
                                                            title={resources.lblAlerts}
                                                        >
                                                            <Icon
                                                                large
                                                                name="warning"
                                                                type={ResultType.warning}
                                                            />
                                                        </Tooltip>
                                                    </div>
                                                ) : (block.isLoadingWarning && (
                                                    <Icon
                                                        large
                                                        name="spinner"
                                                        spin
                                                    />
                                                ))}
                                            </Grid>
                                            <Grid item>
                                                {isRuleGroup ? (
                                                    <StatusLabel
                                                        id="stslblStatusBlock"
                                                        text={block.isActive ?
                                                            resources.lblActive :
                                                            resources.lblInactive}
                                                        type={block.isActive ?
                                                            'success' : 'default'}
                                                    />
                                                ) : (
                                                        <Switch
                                                            inputProps={{
                                                                'aria-label': block.isActive ?
                                                                    resources.lblActive :
                                                                    resources.lblInactive
                                                            }}
                                                            downLabel={block.isActive ?
                                                                resources.lblActive :
                                                                resources.lblInactive}
                                                            align="horizontal"
                                                            id={`enableBlock_${blockIndex}`}
                                                            checked={block.isActive || false}
                                                            onChange={onChangeSwitch}
                                                        />
                                                    )
                                                }
                                            </Grid>
                                            {isRuleGroup
                                                && !isSearchBlock
                                                && isEditable
                                                && (
                                                    <Grid item>
                                                        <Tooltip
                                                            id="tltRemoveBlock"
                                                            placement="top"
                                                            title={resources.lblRemove}
                                                        >
                                                            <IconButton
                                                                color="gray"
                                                                id={`btnRemoveBlock_${blockIndex}_${groupIndex}`}
                                                                aria-label={resources.lblRemove}
                                                                onClick={onDeleteBlock}
                                                            >
                                                                <Icon name="close" large />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Grid>
                                                )}
                                            <Grid item>
                                                {expandButton}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )
                            }
                        </Grid>
                    )}
                />
            </ListItem>
            <Collapse in={block.expanded}>
                <>
                    <div className={classes.detailMargin}>
                        <Alert
                            id="msgSectionInUse"
                            open={isSectionNotUnique}
                            text={resources.lblSectionInUse}
                            type={ResultType.warning}
                            userDismissable={false}
                        />
                    </div>
                    <div className={classes.detailMargin}>
                        {isWidthDown('sm', width) ? (
                            <Grid container spacing={1} alignItems="center">
                                <Grid item xs={6}>
                                    <Text>
                                        {resources.lblCourses}
                                    </Text>
                                </Grid>
                                <Grid item xs={6}>
                                    <Text>
                                        {block.numberOfSections}
                                    </Text>
                                </Grid>
                                <Grid item xs={6}>
                                    <Text>
                                        {resources.lblModified}
                                    </Text>
                                </Grid>
                                <Grid item xs={6}>
                                    <Text>
                                        {block.revisionDateTime}
                                    </Text>
                                </Grid>
                                <Grid item xs={6}>
                                    <Text>
                                        {resources.lblCreated}
                                    </Text>
                                </Grid>
                                <Grid item xs={6}>
                                    <Text>
                                        {block.createDateTime}
                                    </Text>
                                </Grid>
                                {!isRuleGroup && (
                                    <>
                                        <Grid item xs={6}>
                                            <Text>
                                                {resources.lblEnable}
                                            </Text>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Switch
                                                inputProps={{
                                                    'aria-label': block.isActive ?
                                                        resources.lblActive : resources.lblInactive
                                                }}
                                                id={`enableMobileBlock_${blockIndex}`}
                                                checked={block.isActive || false}
                                                onChange={onChangeSwitch}
                                            />
                                        </Grid>
                                    </>
                                )}
                                {isRuleGroup
                                    && !isSearchBlock
                                    && isEditable
                                    && (
                                        <>
                                            <Grid item xs={6}>
                                                <Text>
                                                    {resources.lblRemove}
                                                </Text>
                                            </Grid>
                                            <Grid item>
                                                <Tooltip
                                                    id="tltRemoveBlock"
                                                    placement="top"
                                                    title={resources.lblRemove}
                                                >
                                                    <IconButton
                                                        color="gray"
                                                        id={`btnRemoveBlock_${blockIndex}_${groupIndex}`}
                                                        aria-label={resources.lblRemove}
                                                        onClick={onDeleteBlock}
                                                    >
                                                        <Icon name="close" large />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </>
                                    )}
                                <Grid item xs={6}>
                                    <Text>
                                        {resources.lblStatus}
                                    </Text>
                                </Grid>
                                <Grid item xs={6}>
                                    <StatusLabel
                                        id="stslblStatusBlock"
                                        text={block.isActive ?
                                            resources.lblActive :
                                            resources.lblInactive}
                                        type={block.isActive ?
                                            'success' : 'default'}
                                    />
                                </Grid>
                                <Grid item xs={12} className={classes.alignCenter}>
                                    <Button
                                        align="left"
                                        id={`btnShowDetails_${blockIndex}_${groupIndex}`}
                                        textVariantStyling="inherit"
                                        variant="text"
                                        onClick={onShowDetails}
                                    >
                                        {block.expandedDetails ?
                                            resources.lblHideDetails : resources.lblShowDetails}
                                    </Button>
                                </Grid>
                            </Grid>
                        ) : undefined}
                        {block.isLoadingDetail ?
                            (<ContainerLoader id="ldrEmptyDetail" height="sm" />)
                            : ((isWidthUp('md', width) || (isWidthDown('sm', width)
                                && block.expandedDetails))
                                && (
                                    <>
                                        {block.sectionList && block.sectionList.length > 0 ? (
                                            <BlockSections
                                                isLoadingSearch={false}
                                                resources={resources.blockSections}
                                                sections={block.sectionList}
                                                showCalendar
                                            />
                                        ) : (
                                                <Grid container>
                                                    <Grid item xs={12}>
                                                        <MessageStyled
                                                            classMessage="noResults"
                                                            message={resources.lblNoSections}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            )}
                                    </>
                                ))}
                    </div>
                </>
            </Collapse>
        </Card>
    );
};
// #endregion Component

// Export: Component
export default withWidth()(withStyles(styles)(BlockItem));