/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: BlockCard.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardActions, CardContent, CardHeader } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import { BoxesAlt } from '@hedtech/powercampus-design-system/react/core/IconSvg';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import SimpleSectionCard, { ISimpleSectionCardPropsToExtend, ISimpleSectionCardResProps } from './SimpleSectionCard';

// Types
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { BlockRegBlockStatus } from '../../../Types/Students/IStudentSchedule';
import { BlockRegRuleGroupStatus } from '../../../Types/Administration/IBlockRegistrationRuleGroup';
import { IBlockRegRuleGroup } from '../../../Types/Administration/IBlockRegistrationGroupDetail';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';
// #endregion Imports

// #region Types
export interface IBlockCardProps {
    block: IBlockRegRuleGroup;
    enableCart: boolean;
    groupStatus?: BlockRegRuleGroupStatus;
    resources: IBlockCardResProps;
    SimpleSectionCardProps: ISimpleSectionCardPropsToExtend;
    canAddToCart: (section: ISection) => boolean;
    canAddToWaitlist: (section: ISection) => boolean;
    onAddBlock: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onViewBlockDetails: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IBlockCardResProps {
    btnAdd: string;
    formatBlockInfo: string;
    lblCompleted: string;
    lblCompletedTooltip: string;
    lblProcessing: string;
    lblProcessingTooltip: string;
    simpleSectionCard: ISimpleSectionCardResProps;
}

const styles = createStyles({
    blockButtonContainer: {
        textAlign: 'right'
    },
    blockCard: {
        marginTop: Tokens.spacing60
    },
    cardsContainer: {
        display: 'flex',
        overflowX: 'auto',
        scrollbarWidth: 'thin'
    },
    cardSpace: {
        height: Tokens.spacing20,
        minWidth: Tokens.spacing20
    }
});

type PropsWithStyles = IBlockCardProps & WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
const BlockCard: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        block,
        classes,
        enableCart,
        groupStatus,
        resources,
        SimpleSectionCardProps,
        width,
        canAddToCart,
        canAddToWaitlist,
        onAddBlock,
        onViewBlockDetails
    } = props;

    let enableAddButton: boolean = false;
    let sectionIsSelected: boolean = false;
    let canAddSectionToCart: boolean;
    let canAddSectionToWaitlist: boolean;

    let blockStatusSection: JSX.Element | undefined;
    if (block.status === BlockRegBlockStatus.Completed
        || block.status === BlockRegBlockStatus.Processing) {
        blockStatusSection = (
            <Grid
                container
                alignItems="center"
                spacing={0}
                wrap="nowrap"
            >
                <Grid item>
                    {block.status === BlockRegBlockStatus.Processing && (
                        <StatusLabel
                            id={`stl${block.blockRegRuleGroupBlockId}`}
                            text={resources.lblProcessing}
                            type="default"
                        />
                    )}
                    {block.status === BlockRegBlockStatus.Completed && (
                        <StatusLabel
                            id={`stl${block.blockRegRuleGroupBlockId}`}
                            text={resources.lblCompleted}
                            type="success"
                        />
                    )}
                </Grid>
                <Grid item>
                    <Tooltip
                        id={`tltInfo_${block.blockRegRuleGroupBlockId}`}
                        placement="top"
                        title={block.status === BlockRegBlockStatus.Completed ?
                            resources.lblCompletedTooltip
                            : resources.lblProcessingTooltip}
                    >
                        <IconButton
                            aria-label={block.status === BlockRegBlockStatus.Completed ?
                                resources.lblCompletedTooltip
                                : resources.lblProcessingTooltip}
                            color="gray"
                            id={`btnInfo_${block.blockRegRuleGroupBlockId}`}
                        >
                            <Icon
                                name="info"
                                type={ResultType.info}
                            />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        );
    }

    return (
        <Card className={classes.blockCard}>
            <CardHeader
                action={width !== 'xs' ? blockStatusSection : undefined}
                title={(
                    <Grid
                        container
                        alignItems="center"
                        spacing={width === 'xs' ? 0 : 3}
                    >
                        <Grid item xs={width === 'xs' ? 12 : undefined}>
                            <Grid container alignItems="center" spacing={0}>
                                <Grid item xs={12}>
                                    <Grid container alignItems="center" spacing={1} wrap="nowrap">
                                        <Grid item>
                                            <BoxesAlt />
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                TextProps={{
                                                    display: 'inline',
                                                    size: 'h4',
                                                    weight: 'strong'
                                                }}
                                                align="left"
                                                data-id={block.blockRegRuleGroupBlockId}
                                                id={`btnBlockDetail_${block.blockRegRuleGroupBlockId}`}
                                                textVariantStyling="inherit"
                                                variant="text"
                                                onClick={onViewBlockDetails}
                                            >
                                                {block.blockRegistrationGroup.displayName}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Text
                                        color="textSecondary"
                                        size="small"
                                    >
                                        {Format.toString(resources.formatBlockInfo, [block.sectionList.length, block.totalCredits])}
                                    </Text>
                                </Grid>
                            </Grid>
                        </Grid>
                        {width === 'xs' && blockStatusSection && (
                            <Grid item xs={12}>
                                {blockStatusSection}
                            </Grid>
                        )}
                    </Grid>
                )}
            />
            <CardContent>
                <Grid container>
                    <Grid item xs className={classes.cardsContainer}>
                        {block.sectionList.map((section, iSection) => {
                            canAddSectionToCart = canAddToCart(section);
                            canAddSectionToWaitlist = canAddToWaitlist(section);
                            enableAddButton = enableAddButton || canAddSectionToCart || canAddSectionToWaitlist;
                            if (canAddSectionToCart || canAddSectionToWaitlist) {
                                sectionIsSelected = sectionIsSelected || Boolean(section.isSelected);
                            }
                            return (
                                <SimpleSectionCard
                                    allowChanges={block.blockRegistrationGroup.allowChanges}
                                    canAddToCart={canAddSectionToCart}
                                    canAddToWaitlist={canAddSectionToWaitlist}
                                    key={`simpleSectionCard_${block.blockRegRuleGroupBlockId}_${iSection}`}
                                    resources={resources.simpleSectionCard}
                                    ruleGroupBlockId={block.blockRegRuleGroupBlockId}
                                    section={section}
                                    {...SimpleSectionCardProps}
                                />
                            );
                        })}
                        <div className={classes.cardSpace} />
                    </Grid>
                </Grid>
            </CardContent>
            {enableCart
                && enableAddButton
                && groupStatus as number === block.status as number
                && (
                    <CardActions>
                        <Grid container justifyContent="flex-end">
                            <Grid item xs className={classes.blockButtonContainer}>
                                <Button
                                    color="secondary"
                                    data-id={block.blockRegRuleGroupBlockId}
                                    disabled={!sectionIsSelected}
                                    IconProps={{
                                        name: 'cart'
                                    }}
                                    id={`btnAddBlockToCart_${block.blockRegRuleGroupBlockId}`}
                                    onClick={onAddBlock}
                                >
                                    {resources.btnAdd}
                                </Button>
                            </Grid>
                        </Grid>
                    </CardActions>
                )}
        </Card>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(BlockCard));