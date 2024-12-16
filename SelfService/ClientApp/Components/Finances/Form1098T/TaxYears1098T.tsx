/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: TaxYears1098T.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { ITaxYearSetting } from '../../../Types/TaxYearSetting/ITaxYearSetting';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';

// #endregion Imports

// #region Types
export interface ITaxYears1098TProps {
    resources: ITaxYears1098TResProps;
    taxYears?: ITaxYearSetting[];
}

export interface ITaxYears1098TResProps {
    btnDownload: string;
    lblDownloadProcess: string;
    lblNoResults: string;
}
// #endregion Types

// #region Component
const TaxYears1098T: React.FC<ITaxYears1098TProps> = (props: ITaxYears1098TProps): JSX.Element => {
    const {
        resources,
        taxYears
    } = props;

    const onClickDownload = (id: number) => {
        LayoutActions.setAlert({
            message: resources.lblDownloadProcess,
            messageType: ResultType.info,
            snackbar: true
        } as IAlert);
        window.location.href = `${Constants.webUrl}/TaxYearSettings/Download/${id}`;
    };

    let taxYearItems: JSX.Element | undefined;
    if (taxYears && taxYears.length > 0) {
        taxYearItems = (
            <Grid container>
                {taxYears.map((row, i) => (
                    <Grid item xs={12} sm={6} md={4} key={`taxYear_${i}`}>
                        <Card>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs>
                                        <Text size="h4">
                                            {row.taxYear}
                                        </Text>
                                        <Divider noMarginBottom noMarginTop />
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" justifyContent="center">
                                    <Grid item>
                                        <Button
                                            IconProps={{
                                                name: 'download'
                                            }}
                                            id={`lnkDownload_${i}`}
                                            align="left"
                                            textVariantStyling="inherit"
                                            variant="text"
                                            onClick={() => onClickDownload(row.id)}
                                        >
                                            {resources.btnDownload}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }
    else {
        taxYearItems = (
            <Grid container>
                <Grid item xs>
                    <Illustration
                        color="secondary"
                        name="under-maintenance"
                        text={resources.lblNoResults}
                    />
                </Grid>
            </Grid>
        );
    }

    return (
        <>
            {taxYearItems}
        </>
    );
};
// #endregion Component

// Export: Component
export default TaxYears1098T;