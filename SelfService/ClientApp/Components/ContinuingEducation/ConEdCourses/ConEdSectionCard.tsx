/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ConEdSectionCard.tsx
 * Type: Presentation component */

// #region Imports
import React, { useState } from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Helpers
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthDown, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Types
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
// #endregion Imports

// #region Internal types
export interface IConEdSectionCardProps {
    canAddToCart?: boolean;
    canAddToWaitlist?: boolean;
    id: string;
    resources: IConEdSectionCardResProps;
    section: ISection;
    showPicture: boolean;
    onAddToCart?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onAddToWaitlist?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onViewSectionDetails: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IConEdSectionCardResProps {
    btnAdd: string;
    btnWait: string;
    formatBuilding: string;
    formatCeu: string;
    formatDuration: string;
    formatFloor: string;
    formatOrganization: string;
    formatRoom: string;
    formatSession: string;
    formatStartDuration: string;
    formatStartEndTime: string;
    formatSubtypeSection: string;
    formatTitleSection: string;
    formatTruncatedDescription: string;
    formatTypeCreditType: string;
    lblCeuLong: string;
    lblFees: string;
    lblMultipleMeetingTimes: string;
    lblNoSchedule: string;
    lblToWaitlist: string;
}

const styles = (theme: Theme) => createStyles({
    descriptionMargin: {
        paddingBottom: Tokens.spacing40,
        paddingTop: Tokens.spacing40
    },
    imageContainer: {
        [theme.breakpoints.only('xs')]: {
            justifyContent: 'center',
            marginTop: Tokens.spacing30
        },
        display: 'flex',
        height: '100%',
        justifyContent: 'flex-start',
        width: '100%'
    },
    resultCardContainer: {
        marginTop: Tokens.spacing40
    },
    rightSection: {
        height: '100%'
    },
    sectionPicture: {
        animation: 'slidein 1s',
        height: '120px',
        width: '120px'
    },
    sectionPictureLoading: {
        height: '0',
        visibility: 'hidden',
        width: '0'
    }
});

type PropsWithStyles = IConEdSectionCardProps & WithStyles<typeof styles> & WithWidth;
// #endregion Internal types

// #region Component
const ConEdSectionCard: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        canAddToCart,
        canAddToWaitlist,
        classes,
        id,
        resources,
        section,
        showPicture,
        width,
        onAddToCart,
        onAddToWaitlist,
        onViewSectionDetails
    } = props;

    const [loadingImage, setLoadingImage] = useState(true);
    const [showImage, setShowImage] = useState(true);

    // #region Schedule(s)
    let schedules: JSX.Element | undefined;
    let schedulesLocation: JSX.Element | undefined;
    if (section.schedules) {
        if (section.schedules.length === 1) {
            schedules = (
                <>
                    <Text align={width === 'xs' ? 'left' : 'right'}>
                        {Format.toString(resources.formatStartEndTime, [
                            section.schedules[0].startTime,
                            section.schedules[0].endTime
                        ])}
                    </Text>
                    <Text align={width === 'xs' ? 'left' : 'right'}>
                        {section.schedules[0].dayDesc}
                    </Text>
                </>
            );
            schedulesLocation = (
                <Text size="small">
                    {Format.toString(resources.formatOrganization, [section.schedules[0].orgName])}
                    {section.schedules[0].bldgName ?
                        Format.toString(resources.formatBuilding, [section.schedules[0].bldgName])
                        : ''}
                    {section.schedules[0].floorId ?
                        Format.toString(resources.formatFloor, [section.schedules[0].floorId])
                        : ''}
                    {section.schedules[0].roomId ?
                        Format.toString(resources.formatRoom, [section.schedules[0].roomId])
                        : ''}
                </Text>
            );
        }
        else {
            schedules = (
                <Text align={width === 'xs' ? 'left' : 'right'}>
                    {resources.lblMultipleMeetingTimes}
                </Text>
            );
        }
    }
    else {
        schedules = (
            <Text align={width === 'xs' ? 'left' : 'right'}>
                {resources.lblNoSchedule}
            </Text>
        );
    }
    // #endregion Schedule

    // #region Add Button
    let addButton: JSX.Element | undefined;
    addButton = canAddToCart ? (
        <Button
            data-id={section.id}
            id={`btnAddToCart_${id}_${section.id}`}
            color="secondary"
            onClick={onAddToCart}
        >
            {resources.btnAdd}
        </Button>
    ) : (canAddToWaitlist ? (
        <>
            <Button
                data-id={section.id}
                id={`btnAddToWaitlist_${id}_${section.id}`}
                color="secondary"
                onClick={onAddToWaitlist}
            >
                {resources.btnWait}
            </Button>
            <Text
                align="center"
            >
                {resources.lblToWaitlist}
            </Text>
        </>
    ) : undefined);
    // #endregion Add Button

    // #region Title and Description
    const sectionTitle: string = Format.toString(resources.formatTitleSection, [section.eventId, section.eventName]);
    const descLengthLimit: number = isWidthDown('sm', width, true) ? 150 : 300;
    let titleSection: JSX.Element | undefined;
    let descriptionSection: JSX.Element | undefined;
    titleSection = (
        <Button
            TextProps={{
                size: 'large'
            }}
            data-id={section.id}
            id={`btnTitle_${id}_${section.id}`}
            align="left"
            textVariantStyling="inherit"
            variant="text"
            onClick={onViewSectionDetails}
        >
            {sectionTitle}
        </Button>
    );
    if (section.description) {
        descriptionSection = (
            <Text className={classes.descriptionMargin}>
                {section.description.length > descLengthLimit ?
                    Format.toString(resources.formatTruncatedDescription, [section.description.substring(0, descLengthLimit)])
                    : section.description}
            </Text>
        );
    }
    // #endregion Title and Description

    // #region Image
    let imageSection: JSX.Element | undefined;
    if (showPicture) {
        const onErrorImage = () => {
            setLoadingImage(false);
            setShowImage(false);
        };
        const onLoadImage = () => {
            setLoadingImage(false);
            setShowImage(true);
        };
        imageSection = (
            <div className={classes.imageContainer}>
                <img
                    alt={sectionTitle}
                    className={loadingImage || !showImage ? classes.sectionPictureLoading : classes.sectionPicture}
                    src={`${Constants.webUrl}/Sections/Picture/${section.eventId}/${section.eventSubType}/${section.section}`}
                    onError={onErrorImage}
                    onLoad={onLoadImage}
                />
            </div>
        );
    }
    // #endregion Image

    return (
        <Card className={classes.resultCardContainer}>
            <CardContent>
                <Grid container>
                    <Grid item xs={12} sm={9} md={8}>
                        <Hidden xsDown>
                            <Grid container spacing={loadingImage || !showImage ? 0 : 3}>
                                <Grid item>
                                    {imageSection}
                                </Grid>
                                <Grid item xs>
                                    {titleSection}
                                    {descriptionSection}
                                </Grid>
                            </Grid>
                        </Hidden>
                        <Hidden smUp>
                            {titleSection}
                            <div>
                                {imageSection}
                            </div>
                            {descriptionSection}
                        </Hidden>
                        <Text size="small">
                            {Format.toString(resources.formatSession, [section.sessionDesc])}
                        </Text>
                        <Text size="small">
                            {Format.toString(resources.formatSubtypeSection, [section.eventSubType, section.section])}
                        </Text>
                        <Text size="small">
                            {Format.toString(resources.formatTypeCreditType, [section.eventType, section.defaultCreditType])}
                            <Tooltip
                                id="tltCeu"
                                title={resources.lblCeuLong}
                                placement="top-start"
                            >
                                <span>
                                    {Format.toString(resources.formatCeu, [section.ceu])}
                                </span>
                            </Tooltip>
                        </Text>
                        <Text size="small">
                            {Format.toString(resources.formatDuration, [section.startDate, section.endDate])}
                        </Text>
                        {schedulesLocation}
                        {section.areFeesApplicable && (
                            <Text size="small">
                                {resources.lblFees}
                            </Text>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={3} md={4}>
                        <Grid
                            container
                            className={classes.rightSection}
                            direction="row"
                            spacing={width === 'xs' ? 2 : 0}
                        >
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    alignItems={width === 'xs' ? 'flex-start' : 'flex-end'}
                                    direction={width === 'xs' ? 'row' : 'column'}
                                >
                                    <Hidden xsDown>
                                        <Grid item xs={12}>
                                            {addButton}
                                        </Grid>
                                    </Hidden>
                                    <Grid item xs={12}>
                                        {schedules}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    alignItems="flex-end"
                                    className={classes.rightSection}
                                    spacing={0}
                                >
                                    <Grid item xs={12}>
                                        <Text
                                            align="right"
                                            size="large"
                                            weight="strong"
                                        >
                                            {Format.toString(resources.formatStartDuration, [section.startLongDate])}
                                        </Text>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Hidden smUp>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={12}>
                                    {addButton}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Hidden>
                </Grid>
            </CardContent>
        </Card>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(ConEdSectionCard));