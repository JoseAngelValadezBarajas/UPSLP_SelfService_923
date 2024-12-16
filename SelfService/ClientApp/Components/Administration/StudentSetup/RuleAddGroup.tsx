/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: RuleAddGroup.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// #region Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
// #region

// Types
import { IBlockRegistrationGroupHeaders } from '../../../Types/Administration/IBlockRegistrationGroupHeader';
import { IBlockRegistrationRuleGroup } from '../../../Types/Administration/IBlockRegistrationRuleGroup';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion Imports

// #region Types
export interface IRuleAddGroupProps {
    blockList?: IBlockRegistrationGroupHeaders;
    group: IBlockRegistrationRuleGroup;
    isEdit: boolean;
    open: boolean;
    period: string;
    resources: IRuleAddGroupResProps;
    onAdd: () => void;
    onAddAndSearch: () => void;
    onBlurTextField: () => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
}

export interface IRuleAddGroupResProps {
    btnApply: string;
    btnApplyAndSearch: string;
    btnApplySelect: string;
    btnCancel: string;
    lblAddGroup: string;
    lblAssignBlocks: string;
    lblDisplayName: string;
    lblDisplayNameError: string;
    lblEditingGroup: string;
    lblMessageCoursesAdded: string;
    lblName: string;
    lblNameDuplicated: string;
    lblNameError: string;
}

const styles = createStyles({
    modalTitle: {
        marginTop: Tokens.spacing30
    }
});

type PropsWithStyles = IRuleAddGroupProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const RuleAddGroup: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        group,
        isEdit,
        open,
        period,
        resources,
        onAddAndSearch,
        onBlurTextField,
        onClose,
        onAdd,
        onChangeTextField
    } = props;

    return (
        <Modal
            disableBackdropClick
            disableEscapeKeyDown
            disableHeaderTypography
            id="addGroupModal"
            header={(
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Text className={classes.modalTitle} size="h2">
                                    {isEdit ?
                                        resources.lblEditingGroup : resources.lblAddGroup}
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
                <ButtonGroup id="btgAddGroup">
                    <Button
                        id="btnApply"
                        color="secondary"
                        onClick={onAdd}
                    >
                        {resources.btnApply}
                    </Button>
                    {group.isEditable && (
                        <Button
                            id="btnApplyAndSearch"
                            onClick={onAddAndSearch}
                        >
                            {resources.btnApplyAndSearch}
                        </Button>
                    )}
                </ButtonGroup>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        error={group.isNameError
                            || group.isNameDuplicated}
                        helperText={group.isNameError ?
                            resources.lblNameError
                            : (group.isNameDuplicated ?
                                resources.lblNameDuplicated : undefined)}
                        id="txtGroupName"
                        label={resources.lblName}
                        type="text"
                        value={group.name || ''}
                        onChange={onChangeTextField}
                        onBlur={onBlurTextField}
                        onEnterPress={onAdd}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        error={group.isDisplayNameError}
                        helperText={group.isDisplayNameError ?
                            resources.lblDisplayNameError : undefined}
                        id="txtGroupDisplayName"
                        label={resources.lblDisplayName}
                        type="text"
                        value={group.displayName || ''}
                        onChange={onChangeTextField}
                        onEnterPress={onAdd}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(RuleAddGroup);