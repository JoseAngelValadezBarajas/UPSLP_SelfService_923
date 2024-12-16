/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: RuleSearchBlock.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// #region Internal components
import BlockList from './BlockList';

// #region Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
// #region

// Types
import { IBlockRegistrationGroupHeader } from '../../../Types/Administration/IBlockRegistrationGroupHeader';
import { IBlockRegistrationRuleGroup } from '../../../Types/Administration/IBlockRegistrationRuleGroup';
import { IRuleAddGroupResProps } from './RuleAddGroup';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion Imports

// #region Types
export interface IRuleSearchBlockProps {
    blockListIndex: number;
    blocksAdded: number[];
    groups?: IBlockRegistrationRuleGroup[];
    hasSearchBlocks?: boolean;
    open: boolean;
    period: string;
    resources: IRuleAddGroupResProps;
    selectedGroupIndex: number;
    termPeriodId: number;
    onAddAndSelect?: () => void;
    onAddBlocks: () => void;
    onCancel: () => void;
    setHasSearchBlocks: (hasSearchBlocks: boolean) => void;
    setSelectedBlocks: (selectedBlocks: IBlockRegistrationGroupHeader[]) => void;
}

const styles = createStyles({
    modalTitle: {
        marginTop: Tokens.spacing30
    }
});

type PropsWithStyles = IRuleSearchBlockProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const RuleSearchBlock: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        blockListIndex,
        blocksAdded,
        classes,
        groups,
        hasSearchBlocks,
        open,
        period,
        resources,
        selectedGroupIndex,
        termPeriodId,
        onAddBlocks,
        onAddAndSelect,
        onCancel,
        setHasSearchBlocks,
        setSelectedBlocks
    } = props;

    return (
        <Modal
            disableBackdropClick
            disableEscapeKeyDown
            disableHeaderTypography
            id="addBlocksModal"
            header={(
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Text className={classes.modalTitle} size="h2">
                                    {resources.lblAssignBlocks}
                                </Text>
                            </Grid>
                            <Grid item>
                                <StatusLabel
                                    id="stslPeriod"
                                    text={period}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
            footer={(
                <Grid container spacing={1}>
                    {hasSearchBlocks && (
                        <Grid item xs={12}>
                            <MessageStyled
                                classMessage="secondaryMessage"
                                message={resources.lblMessageCoursesAdded}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <ButtonGroup id="btgAddGroupBlock">
                                    <Button
                                        id="btnCancel"
                                        color="secondary"
                                        onClick={onCancel}
                                    >
                                        {resources.btnCancel}
                                    </Button>
                                    {hasSearchBlocks && (
                                        <>
                                            <Button
                                                id="btnApply"
                                                color="secondary"
                                                onClick={onAddBlocks}
                                            >
                                                {resources.btnApply}
                                            </Button>
                                            <Button
                                                id="btnApplySelect"
                                                onClick={onAddAndSelect}
                                            >
                                                {resources.btnApplySelect}
                                            </Button>
                                        </>
                                    )}
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
            fullWidth
            maxWidth="lg"
            open={open}
            onClose={onCancel}
        >
            <Grid container>
                <Grid item xs={12}>
                    <BlockList
                        blocksAdded={blocksAdded}
                        groups={groups}
                        isRuleGroup
                        isSearchBlock={open}
                        key={`blockList_${blockListIndex}`}
                        selectedGroupIndex={selectedGroupIndex}
                        showCheckboxes
                        termPeriodId={termPeriodId}
                        setHasSearchBlocks={setHasSearchBlocks}
                        setSelectedBlocks={setSelectedBlocks}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(RuleSearchBlock);