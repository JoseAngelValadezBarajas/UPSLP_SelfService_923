/* Copyright 2018 - 2024 Ellucian Company L.P. and its affiliates.
* File: GradeReportOptions.tsx
* Type: Presentation component */

// #region Imports
import React from 'react';

// Helpers
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';

// Internal components
import Print from '../../Generic/Print';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IPrintResources } from '../../../Types/Resources/Generic/IPrintResources';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
// #endregion

// #region Internal types
export interface IGradeReportTableProps {
    disablePrint?: boolean;
    impersonateInfo?: IImpersonateInfo;
    periods?: IDropDownOption[];
    printResources: IPrintResources;
    sequence?: IDropDownOption[];
    selectedPeriod?: string;
    selectedSequence?: string;
    onChangePeriod: (optionSelected: IDropDownOption, id: string) => void;
    onChangeSequence: (optionSelected: IDropDownOption, id: string) => void;

    resources: IGradeReportOptionResProps;
}

export interface IGradeReportOptionResProps {
    lblPeriod: string;
    lblSequenceDrop: string;
}

// #endregion

const GradeReportOptions: React.FC<IGradeReportTableProps> = (props: IGradeReportTableProps): JSX.Element => {

    const {
        disablePrint,
        impersonateInfo,
        periods,
        printResources,
        sequence,
        selectedPeriod,
        selectedSequence,
        onChangePeriod,
        onChangeSequence,
        resources
    } = props;

    const printMandatoryParameters: string = `/${selectedSequence}/${selectedPeriod}`;
    const printOptionalParameters: string = impersonateInfo ? `/${impersonateInfo.process}/${impersonateInfo.personId}/${impersonateInfo.viewId}/${impersonateInfo.tabId}` : '';
    const link: string = `${Constants.webUrl}/Students/GradesReport${printMandatoryParameters}${printOptionalParameters}?currentPage=${Constants.headersRequestsJson['X-Current-Page']}`;

    return (
        <Card>
            <CardContent>
                <Hidden mdUp>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Print
                                disabled={disablePrint}
                                resources={printResources}
                                link={link}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Dropdown
                                id="ddlPeriod"
                                label={resources.lblPeriod}
                                options={periods}
                                value={selectedPeriod}
                                onChange={onChangePeriod}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Dropdown
                                id="ddlSequence"
                                label={resources.lblSequenceDrop}
                                options={sequence}
                                value={selectedSequence}
                                onChange={onChangeSequence}
                            />
                        </Grid>
                    </Grid>
                </Hidden>
                <Hidden smDown>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Dropdown
                                id="ddlPeriod"
                                label={resources.lblPeriod}
                                options={periods}
                                value={selectedPeriod}
                                onChange={onChangePeriod}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Dropdown
                                id="ddlSequence"
                                label={resources.lblSequenceDrop}
                                options={sequence}
                                value={selectedSequence}
                                onChange={onChangeSequence}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Print
                                disabled={disablePrint}
                                resources={printResources}
                                link={link}
                            />
                        </Grid>
                    </Grid>
                </Hidden>
            </CardContent>
        </Card>
    );
};

export default GradeReportOptions;