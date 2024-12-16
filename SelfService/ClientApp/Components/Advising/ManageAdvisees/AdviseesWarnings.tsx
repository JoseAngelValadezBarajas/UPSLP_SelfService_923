/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: AdviseesWarnings.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IAdviseeWarning } from '../../../Types/Advisees/IAdviseeWarning';
// #endregion

// #region Internal types
export interface IAdviseesWarningsProps {
    warnings: IAdviseeWarning;
    lblWarning: string;
}

const styles = (() => createStyles({
    warningMobile: {
        background: Tokens.colorFillAlertWarning,
        borderRadius: Tokens.borderRadiusCircle,
        display: 'inline-flex',
        height: Tokens.spacing40,
        marginRight: Tokens.spacing20,
        verticalAlign: 'middle',
        width: Tokens.spacing40
    }
}));

type PropsWithStyles = IAdviseesWarningsProps & WithStyles<typeof styles>;

// #endregion

// #region Component
const AdviseesWarnings: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        lblWarning,
        warnings
    } = props;

    let warningsContent: JSX.Element | undefined;
    let iconCircle: JSX.Element | undefined;
    let iconBg: JSX.Element | undefined;
    if (warnings) {
        if (warnings.hasAttendanceWarning || warnings.hasGradesWarning || warnings.hasViolationWarning) {
            iconCircle = (
                <span className={classes.warningMobile} />
            );
            iconBg = (
                <Tooltip
                    aria-label={lblWarning}
                    id="tltWarning"
                    title={lblWarning}
                >
                    <Icon
                        marginRight
                        name="warning"
                        type="warning"
                        iconWithBackground
                    />
                </Tooltip>
            );
        }
    }
    else {
        iconCircle = (
            <Icon
                large
                name="spinner"
                spin
                verticalAlign="middle"
            />
        );
    }

    if (iconCircle) {
        warningsContent = (
            <>
                <Hidden smDown>
                    {warnings ? iconBg : iconCircle}
                </Hidden>
                <Hidden mdUp>
                    <Hidden only="xs">
                        {iconCircle}
                    </Hidden>
                    <Hidden only="sm">
                        <Grid item>
                            {iconCircle}
                        </Grid>
                    </Hidden>
                </Hidden>
            </>
        );
    }

    return (
        <>
            {warningsContent}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(AdviseesWarnings);