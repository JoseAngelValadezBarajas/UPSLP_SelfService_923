/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: TaxYearSettings.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { ITaxYearSetting } from '../../../Types/TaxYearSetting/ITaxYearSetting';

// Helpers
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
// #endregion Imports

// #region Types
export interface ITaxYearSettingsProps {
    resources: ITaxYearSettingsResProps;
    taxYearSettings?: ITaxYearSetting[];
    onAdd: () => void;
    onDelete: (event: any) => void;
    onEdit: (event: any) => void;
}

export interface ITaxYearSettingsResProps {
    btnAdd: string;
    btnDelete: string;
    btnEdit: string;
    btnPreview: string;
    lblAvailable: string;
    lblNoResults: string;
    lblNotAvailable: string;
    lblTaxYearsSettingsTitle: string;
}
// #endregion Types

// #region Component
const TaxYearSettings: React.FC<ITaxYearSettingsProps> = (props: ITaxYearSettingsProps): JSX.Element => {
    const {
        resources,
        taxYearSettings,
        onAdd,
        onDelete,
        onEdit
    } = props;

    const onClickDownload = (id: number) => {
        window.location.href = `${Constants.webUrl}/TaxYearSettings/Preview/${id}`;
    };

    let taxYearItems: JSX.Element | undefined;
    if (taxYearSettings && taxYearSettings.length > 0) {
        taxYearItems = (
            <Grid container>
                {taxYearSettings.map((row, i) => (
                    <Grid item xs={12} sm={6} md={4} key={`taxYear_${i}`}>
                        <Card>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs>
                                        <Button
                                            TextProps={{
                                                size: 'h4'
                                            }}
                                            align="left"
                                            id={`btnEdit_${row.id}`}
                                            textVariantStyling="inherit"
                                            variant="text"
                                            onClick={onEdit}
                                        >
                                            {row.taxYear}
                                        </Button>
                                        <Divider noMarginBottom noMarginTop />
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                                    <Grid item>
                                        <StatusLabel
                                            id={`lblIsActive_${i}`}
                                            text={row.isActive ? resources.lblAvailable : resources.lblNotAvailable}
                                            type={row.isActive ? 'success' : 'default'}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="flex-end" spacing={1}>
                                            <Grid item>
                                                <Button
                                                    align="left"
                                                    id={`btnDelete_${row.id}_${row.taxYear}`}
                                                    textVariantStyling="inherit"
                                                    variant="text"
                                                    onClick={onDelete}
                                                >
                                                    <Icon name="trash" />
                                                </Button>
                                            </Grid>
                                            <Grid item xs>
                                                <Button
                                                    IconProps={{
                                                        name: 'download'
                                                    }}
                                                    align="left"
                                                    id={`btnPreview_${i}`}
                                                    textVariantStyling="inherit"
                                                    variant="text"
                                                    onClick={() => onClickDownload(row.id)}
                                                >
                                                    {resources.btnPreview}
                                                </Button>
                                            </Grid>
                                        </Grid>
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
            <Card>
                <CardContent>
                    <Illustration
                        color="secondary"
                        name="under-maintenance"
                        text={resources.lblNoResults}
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Grid container>
                <Grid item xs>
                    <Text size="h2">
                        {resources.lblTaxYearsSettingsTitle}
                    </Text>
                    <Divider noMarginBottom />
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Tooltip
                        id="tltAdd"
                        title={resources.btnAdd}
                    >
                        <IconButton
                            aria-label={resources.btnAdd}
                            id="btnAdd"
                            onClick={onAdd}
                        >
                            <Icon large name="add" />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            {taxYearItems}
        </>
    );
};
// #endregion Component

// Export: Component
export default TaxYearSettings;