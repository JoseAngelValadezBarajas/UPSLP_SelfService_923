/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ViewCommentsPopover.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Popover from '@hedtech/powercampus-design-system/react/core/Popover';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IAdvisorApprovalInfo } from '@hedtech/powercampus-design-system/types/Student/IAdvisorApprovalInfo';
// #endregion Imports

// #region Types
export interface IViewCommentsPopoverProps {
    advisorApprovalInfo: IAdvisorApprovalInfo;
    resources: IViewCommentsPopoverResProps;
    viewCommentsAnchor?: any;
    onClose: () => void;
}

export interface IViewCommentsPopoverResProps {
    lblNoComments: string;
}

const styles = (theme: Theme) => createStyles({
    containerComments: {
        maxHeight: '200px',
        overflowX: 'hidden',
        overflowY: 'auto',
        width: 'auto'
    },
    containerPopover: {
        [theme.breakpoints.up('lg')]: {
            width: '300px'
        },
        [theme.breakpoints.only('sm')]: {
            width: '300px'
        },
        height: 'auto',
        margin: `${Tokens.spacing60} ${Tokens.sizingXLarge}`,
        overflowX: 'hidden',
        overflowY: 'hidden',
        width: '200px'
    }
});

type PropsWithStyles = IViewCommentsPopoverProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const ViewCommentsPopover: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        advisorApprovalInfo,
        classes,
        resources,
        viewCommentsAnchor,
        onClose
    } = props;

    return (
        <Popover
            anchorOrigin={{
                horizontal: 'right',
                vertical: 'top'
            }}
            anchorEl={viewCommentsAnchor}
            open={Boolean(viewCommentsAnchor)}
            transformOrigin={{
                horizontal: 'right',
                vertical: 'top'
            }}
            onClose={onClose}
        >
            <div className={classes.containerPopover}>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Text>
                            {advisorApprovalInfo.facultyInfo.fullName}
                        </Text>
                    </Grid>
                    <Grid item>
                        <Text align="right">
                            {advisorApprovalInfo.decisionDate}
                        </Text>
                    </Grid>
                </Grid>
                <br />
                <Grid container>
                    <Grid item xs>
                        <div className={classes.containerComments}>
                            <Text>
                                {advisorApprovalInfo.reason || resources.lblNoComments}
                            </Text>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </Popover>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(ViewCommentsPopover);