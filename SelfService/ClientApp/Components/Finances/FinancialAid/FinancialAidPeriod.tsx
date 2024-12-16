/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: FinancialAidPeriod.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

// #endregion

// #region Internal types
export interface IFinancialAidPeriodTableProps {
    periods?: IDropDownOption[];
    periodSelected?: IDropDownOption;
    onChangePeriod?: (optionSelected: IDropDownOption, id: string) => void;

    resources: IFinancialAidPeriodTableResProps;
}

export interface IFinancialAidPeriodTableResProps {
    lblNoOptions: string;
    lblPeriod: string;
}

// #endregion

// #region Component
const FinancialAidPeriod: React.FC<IFinancialAidPeriodTableProps> = (props: IFinancialAidPeriodTableProps): JSX.Element => {
    const {
        periodSelected,
        periods,
        onChangePeriod,

        resources
    } = props;

    if (periods && periodSelected) {
        return (
            <>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Dropdown
                            id="ddlPeriod"
                            label={resources.lblPeriod}
                            options={periods}
                            value={periodSelected[0] ? periodSelected[0].value : periodSelected.value}
                            onChange={onChangePeriod}
                        />
                    </Grid>
                </Grid>
                <br />
            </>
        );
    }
    else {
        return (
            <MessageStyled
                classMessage="noResults"
                message={resources.lblNoOptions}
            />
        );
    }
};
// #endregion

// Export: Component
export default FinancialAidPeriod;