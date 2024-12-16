/* Copyright 2018 - 2024 Ellucian Company L.P. and its affiliates.
 * File: StatementOptions.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';
import Media from 'react-media';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import Print from '../../Generic/Print';

// Helpers
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IPrintResources } from '../../../Types/Resources/Generic/IPrintResources';
// #endregion

// #region Internal types
export interface IStatementOptionsProps {
    printResources: IPrintResources;
    statements?: IDropDownOption[];
    statementSelected?: number;
    onChangeValue?: (optionSelected: IDropDownOption, id: string) => void;

    resources: IStatementOptionsResProps;
}

export interface IStatementOptionsResProps {
    lblNumber: string;
    lblStatement: string;
}

// #endregion

// #region Component
const StatementOptions: React.FC<IStatementOptionsProps> = (props: IStatementOptionsProps) => {
    // Render
    const {
        printResources,
        statements,
        statementSelected,
        onChangeValue,

        resources
    } = props;

    const header: JSX.Element = (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Text size="h3">
                    {resources.lblStatement}
                </Text>
            </Grid>
        </Grid>
    );

    const content: JSX.Element = (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Dropdown
                        id="statement"
                        label={resources.lblNumber}
                        options={statements}
                        value={statementSelected}
                        onChange={onChangeValue}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3} justifyContent="flex-end">
                <Grid item>
                    <Print
                        resources={printResources}
                        link={`${Constants.webUrl}/Students/StatementsReport?statementNumber=${statementSelected}&currentPage=${Constants.headersRequestsJson['X-Current-Page']}`}
                    />
                </Grid>
            </Grid>
        </>

    );

    return (
        <Media query={Tokens.mqSmallDown}>
            {(matches: boolean): JSX.Element => matches ? (
                <ExpansionPanel
                    header={header}
                >
                    {content}
                </ExpansionPanel>
            ) : (
                    <Card>
                        <CardContent>
                            {header}
                            {content}
                        </CardContent>
                    </Card >
                )
            }
        </Media>
    );
};
// #endregion

// Export: Component
export default StatementOptions;