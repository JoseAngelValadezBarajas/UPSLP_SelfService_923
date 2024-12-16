/* Copyright 2018-2020 Ellucian Company L.P. and its affiliates.
 * File: DegreeRequirementsOptions.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Internal types
export interface IDegreeRequirementsOptionsProps {
    degrees?: IDropDownOption[];
    degreeSelected?: IDropDownOption;
    periods?: IDropDownOption[];
    periodSelected?: IDropDownOption;
    programs?: IDropDownOption[];
    programSelected?: IDropDownOption;
    resources: IDegreeRequirementsOptionsResProps;
    onChangeDegree: (optionSelected: IDropDownOption, id: string) => void;
    onChangePeriod: (optionSelected: IDropDownOption, id: string) => void;
    onChangeProgram: (optionSelected: IDropDownOption, id: string) => void;
}

export interface IDegreeRequirementsOptionsResProps {
    lblDegree: string;
    lblPeriod: string;
    lblProgram: string;
}
// #endregion Internal types

// #region Component
const DegreeRequirementsOptions: React.FC<IDegreeRequirementsOptionsProps> = (props: IDegreeRequirementsOptionsProps): JSX.Element => {
    const {
        degrees,
        degreeSelected,
        periods,
        periodSelected,
        programs,
        programSelected,
        resources,
        onChangeDegree,
        onChangePeriod,
        onChangeProgram
    } = props;

    const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();

    let emptyOption: IDropDownOption;
    emptyOption = {
        description: layoutResources ? layoutResources.lblDropDownEmptyText : '',
        value: ''
    };

    return (
        <Card>
            <CardContent>
                <Grid container>
                    <Grid item xs={12} sm={4}>
                        <Dropdown
                            emptyOption={emptyOption}
                            id="ddlPeriod"
                            label={resources.lblPeriod}
                            options={periods}
                            value={periodSelected ? periodSelected.value : emptyOption.value}
                            onChange={onChangePeriod}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Dropdown
                            emptyOption={emptyOption}
                            id="ddlProgram"
                            label={resources.lblProgram}
                            options={programs}
                            value={programSelected ? programSelected.value : emptyOption.value}
                            onChange={onChangeProgram}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Dropdown
                            emptyOption={emptyOption}
                            id="ddlDegree"
                            label={resources.lblDegree}
                            options={degrees}
                            value={degreeSelected ? degreeSelected.value : emptyOption.value}
                            onChange={onChangeDegree}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
// #endregion Component

// Export: Component
export default DegreeRequirementsOptions;