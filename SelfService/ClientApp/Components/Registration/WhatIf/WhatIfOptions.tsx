/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: WhatIfOptions.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IWhatIfOptionsProps {
    degrees?: IDropDownOption[];
    degreeSelected?: IDropDownOption;
    isLoadingCreate: boolean;
    isLoadingDegrees: boolean;
    isLoadingPeriods: boolean;
    isLoadingPrograms: boolean;
    periods?: IDropDownOption[];
    periodSelected?: IDropDownOption;
    programs?: IDropDownOption[];
    programSelected?: IDropDownOption;
    resources: IWhatIfOptionsResProps;
    whatIfNoMore: boolean;
    onChangeDegree: (optionSelected: IDropDownOption, id: string) => void;
    onChangePeriod: (optionSelected: IDropDownOption, id: string) => void;
    onChangeProgram: (optionSelected: IDropDownOption, id: string) => void;
    onCreate: () => void;
}

export interface IWhatIfOptionsResProps {
    btnCreate: string;
    lblDegree: string;
    lblInstructions: string;
    lblPeriod: string;
    lblProgram: string;
    lblTitle: string;
    lblWhatIfNoMore: string;
}
// #endregion Types

// #region Component
const WhatIfOptions: React.FC<IWhatIfOptionsProps> = (props: IWhatIfOptionsProps): JSX.Element => {
    const {
        degrees,
        degreeSelected,
        isLoadingCreate,
        isLoadingDegrees,
        isLoadingPeriods,
        isLoadingPrograms,
        periods,
        periodSelected,
        programs,
        programSelected,
        resources,
        whatIfNoMore,
        onChangeDegree,
        onChangePeriod,
        onChangeProgram,
        onCreate
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
                    {!isLoadingPeriods && whatIfNoMore && (
                        <Grid item xs={12}>
                            <Alert
                                id="msgNoMore"
                                open={whatIfNoMore}
                                text={resources.lblWhatIfNoMore}
                                type={ResultType.warning}
                                userDismissable={false}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Text size="h3">
                            {resources.lblTitle}
                        </Text>
                        <Text size="large">
                            {resources.lblInstructions}
                        </Text>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Dropdown
                            emptyOption={emptyOption}
                            id="ddlPeriod"
                            label={resources.lblPeriod}
                            loading={isLoadingPeriods}
                            options={periods}
                            value={periodSelected ? periodSelected.value : emptyOption.value}
                            onChange={onChangePeriod}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Dropdown
                            emptyOption={emptyOption}
                            id="ddlProgram"
                            loading={isLoadingPrograms || isLoadingPeriods}
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
                            loading={isLoadingDegrees || isLoadingPeriods}
                            label={resources.lblDegree}
                            options={degrees}
                            value={degreeSelected ? degreeSelected.value : emptyOption.value}
                            onChange={onChangeDegree}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            disabled={whatIfNoMore
                                || !(periodSelected && periodSelected.value
                                    && programSelected && programSelected.value
                                    && degreeSelected && degreeSelected.value)}
                            id="btnCreate"
                            loading={isLoadingCreate}
                            onClick={onCreate}
                        >
                            {resources.btnCreate}
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
// #endregion Component

// Export: Component
export default WhatIfOptions;