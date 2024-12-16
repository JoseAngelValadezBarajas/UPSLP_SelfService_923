/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: BalanceHeader.tsx
 * Type: Presentation  component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
// #endregion Imports

// #region Types
export interface IBalanceHeaderProps {
    periodSelected: IDropDownOption;
    resources: IBalanceHeaderResProps;
    total?: string;
    viewSelected: string;
}

export interface IBalanceHeaderResProps {
    formatHeader: string;
    lblInstructions: string;
    lblInstructionsSummary: string;
    lblTotal: string;
}

const styles = createStyles({
    balanceTotal: {
        alignItems: 'center',
        backgroundColor: Tokens.colorBrandNeutral200,
        display: 'flex',
        flexDirection: 'column',
        height: '129px',
        justifyContent: 'center'
    },
    balanceText: {
        fontSize: Tokens.fontSizeHeader1
    }
});

type PropsWithStyles = IBalanceHeaderProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const BalanceHeader: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        periodSelected,
        resources,
        total,
        viewSelected
    } = props;

    let instructions: string;
    switch (viewSelected) {
        case '1':
            instructions = resources.lblInstructions;
            break;
        case '2':
            instructions = resources.lblInstructions;
            break;
        case '3':
            instructions = resources.lblInstructionsSummary;
            break;
        default:
            instructions = '';
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs>
                    <Text size="h2">
                        {Format.toString(resources.formatHeader, [periodSelected.value !== '0' ? periodSelected.description : ''])}
                    </Text>
                    <br />
                    <Text>
                        {instructions}
                    </Text>
                </Grid>
            </Grid>
            {periodSelected.value !== '0' && total ? (
                <>
                    <br />
                    <div className={classes.balanceTotal}>
                        <div>
                            <Text className={classes.balanceText} align="center">
                                {total}
                            </Text>
                            <Text size="small" align="center">
                                {resources.lblTotal}
                            </Text>
                        </div>
                    </div>
                </>
            ) : undefined}
            <br />
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(BalanceHeader);