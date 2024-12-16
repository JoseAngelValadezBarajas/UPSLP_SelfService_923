/* Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AvailableWhatIf.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import LinearProgress from '@hedtech/powercampus-design-system/react/core/LinearProgress';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Types
import { IWhatIfPlanHeader } from '../../../Types/WhatIf/IWhatIfPlanHeader';
// #endregion Imports

// #region Types
export interface IAvailableWhatIfProps {
    isLoadingList: boolean;
    resources: IAvailableWhatIfResProps;
    whatIfList?: IWhatIfPlanHeader[];
    onDelete: (index: number) => void;
    onSelectWhatIf: (index: number) => void;
}

export interface IAvailableWhatIfResProps {
    btnDelete: string;
    formatName: string;
    formatPercentage: string;
    formatPeriod: string;
    lblEmptyState: string;
    lblRequiredCredits: string;
    lblTitle: string;
}

const styles = createStyles({
    cardMargin: {
        marginTop: Tokens.spacing50
    }
});

type PropsWithStyles = IAvailableWhatIfProps & WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
const AvailableWhatIf: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        isLoadingList,
        resources,
        whatIfList,
        width,
        onDelete,
        onSelectWhatIf
    } = props;

    let deleteButton: JSX.Element | undefined;
    return (
        <Card className={classes.cardMargin}>
            <CardContent>
                {isLoadingList ? (
                    <ContainerLoader id="ldrAvailablePlans" height="md" />
                ) : whatIfList && whatIfList.length > 0 ? (
                    <>
                        <Grid container>
                            <Grid item xs>
                                <Text size="h3">
                                    {resources.lblTitle}
                                </Text>
                            </Grid>
                        </Grid>
                        {whatIfList.map((whatIfHeader, whatIfIndex) => {
                            const callbackSelectPlan = function (): void { onSelectWhatIf(whatIfIndex); };
                            const callbackDelete = function (): void { onDelete(whatIfIndex); };
                            deleteButton = (
                                <Grid item>
                                    <Tooltip
                                        id={`tltDelete_${whatIfIndex}`}
                                        title={resources.btnDelete}
                                    >
                                        <IconButton
                                            aria-label={resources.btnDelete}
                                            color="secondary"
                                            id={`btnDelete_${whatIfIndex}`}
                                            onClick={callbackDelete}
                                        >
                                            <Icon name="trash" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            );
                            return (
                                <React.Fragment key={`whatIfPlan_${whatIfIndex}`}>
                                    <Grid
                                        container
                                        alignItems="center"
                                        justifyContent={isWidthUp('sm', width) ? 'space-between' : 'flex-start'}
                                        wrap={isWidthUp('sm', width) ? 'nowrap' : 'wrap'}
                                    >
                                        <Grid item xs={isWidthUp('sm', width) ? true : 12}>
                                            <Grid container alignItems="center">
                                                <Grid item xs>
                                                    <Button
                                                        TextProps={{
                                                            size: 'h3'
                                                        }}
                                                        id={`btnViewWhatIfPlan_${whatIfIndex}`}
                                                        align="left"
                                                        textVariantStyling="inherit"
                                                        variant="text"
                                                        onClick={callbackSelectPlan}
                                                    >
                                                        {Format.toString(resources.formatName, [
                                                            whatIfHeader.programDesc,
                                                            whatIfHeader.degreeDesc,
                                                            whatIfHeader.curriculumDesc
                                                        ])}
                                                    </Button>
                                                    <Text>
                                                        {Format.toString(resources.formatPeriod,
                                                            [whatIfHeader.year, whatIfHeader.termDesc])}
                                                    </Text>
                                                </Grid>
                                                <Hidden smUp>
                                                    {deleteButton}
                                                </Hidden>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Grid container alignItems="center">
                                                <Grid item xs>
                                                    <Grid container spacing={1} alignItems="center">
                                                        <Grid item xs={12}>
                                                            <Grid container alignItems="center" wrap="nowrap">
                                                                <Grid item>
                                                                    <Text>
                                                                        {resources.lblRequiredCredits}
                                                                    </Text>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Text>
                                                                        {Format.toString(resources.formatPercentage, [
                                                                            whatIfHeader.creditsCompleted
                                                                        ])}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                color="secondary"
                                                                value={whatIfHeader.creditsCompletedValue}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Hidden xsDown>
                                                    {deleteButton}
                                                </Hidden>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {whatIfIndex < (whatIfList.length - 1) && (
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <Divider noMarginBottom noMarginTop />
                                            </Grid>
                                        </Grid>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </>
                ) : (
                    <Illustration
                        color="secondary"
                        internalName="no-activities"
                        text={resources.lblEmptyState}
                    />
                )}
            </CardContent>
        </Card>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(AvailableWhatIf));