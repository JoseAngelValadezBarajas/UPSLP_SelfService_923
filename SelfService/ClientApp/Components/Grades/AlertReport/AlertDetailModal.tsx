/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: AlertDetailModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IAlertReportList } from '../../../Types/Grades/IAlertReportList';
import { IAlertReportResources } from '../../../Types/Resources/Grades/IAlertReportResources';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #endregion Imports

// #region Types
export interface IAlertDetailModalProps {
    alertReportDetail: IAlertReportList;
    onClose: () => void;
    onViewSectionDetails: (id: number) => void;
    open: boolean;
    resources: IAlertReportResources;
}

const styles = createStyles({
    avatar: {
        marginLeft: '0rem!important'
    },
    centered: {
        alignItems: 'center',
        display: 'flex'
    },
    instructorName: {
        wordBreak: 'normal'
    }
});

type PropsWithStyles = IAlertDetailModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const AlertDetailModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        alertReportDetail,
        onClose,
        onViewSectionDetails,
        open,
        resources
    } = props;

    const onClickDetails = (): void => {
        onViewSectionDetails(alertReportDetail.sectionId);
    };

    let contentModal: JSX.Element | undefined;
    contentModal = (
        <>
            <br />
            <Grid container spacing={3}>
                <Grid item xs={6} md={5}>
                    <Text>{resources.lblPeriod}{':'}</Text>
                </Grid>
                <Grid item xs={6} md={5}>
                    <Text>{Format.toString(resources.formatPeriod, [alertReportDetail.period, alertReportDetail.academicSession])}</Text>
                </Grid>
            </Grid><br />
            <Grid container spacing={3}>
                <Grid item xs={6} md={5}>
                    <Text>{resources.lblCourse}{':'}</Text>
                </Grid>
                <Grid item xs={6} md={6}>
                    <Button
                        TextProps={{
                            weight: 'strong'
                        }}
                        align="left"
                        id={`btnCourse_${alertReportDetail.sectionId}`}
                        textVariantStyling="inherit"
                        variant="text"
                        onClick={onClickDetails}
                    >
                        {`${alertReportDetail.eventId} - ${alertReportDetail.eventName}`}
                    </Button>
                    <Text
                        color="textSecondary"
                        size="small"
                    >
                        {Format.toString(resources.formatSectionSubType, [alertReportDetail.eventSubTypeDesc, alertReportDetail.section])}
                    </Text>
                    <Text
                        color="textSecondary"
                        size="small"
                    >
                        {Format.toString(resources.formatCreditType, [alertReportDetail.eventTypeDesc, alertReportDetail.creditTypeDesc])}
                    </Text>
                </Grid>
            </Grid><br />
            <Grid container spacing={3}>
                <Grid item xs={6} md={5}>
                    <Text>{resources.lblCategory}</Text>
                </Grid>
                <Grid item xs={6} md={5}>
                    <Text>{alertReportDetail.violationCategoryDesc}</Text>
                </Grid>
            </Grid><br />
            <Grid container spacing={3}>
                <Grid item xs={6} md={5}>
                    <Text>{resources.lblType}</Text>
                </Grid>
                <Grid item xs={6} md={5}>
                    <Text>{alertReportDetail.violationDesc}</Text>
                </Grid>
            </Grid><br />
            <Grid container spacing={3}>
                <Grid item xs={6} md={5}>
                    <Text>{resources.lblDateOcurred}</Text>
                </Grid>
                <Grid item xs={6} md={5}>
                    <Text>{alertReportDetail.violationDate}</Text>
                </Grid>
            </Grid><br />
            <Grid container spacing={3}>
                <Grid item xs={6} md={5}>
                    <Text>{resources.lblDescription}</Text>
                </Grid>
                <Grid item xs={6} md={5}>
                    <Text>{alertReportDetail.description}</Text>
                </Grid>
            </Grid><br />
            <Grid container spacing={3}>
                <Grid item xs={6} md={5}>
                    <Text>{resources.lblEditedBy}</Text>
                </Grid>
                <Grid item xs={6} md={5}>
                    {alertReportDetail.avatar && (
                        <AvatarText
                            avatarInfo={alertReportDetail.avatar}
                            id="avtAlertReport"
                        />
                    )}
                </Grid>
            </Grid><br />
            <Grid container spacing={3}>
                <Grid item xs={6} md={5}>
                    <Text>{resources.lblDateEdited}</Text>
                </Grid>
                <Grid item xs={6} md={5}>
                    <Text>{alertReportDetail.dateEdited}</Text>
                </Grid>
            </Grid><br />
        </>
    );

    return (
        <Modal
            disableBackdropClick
            id="alertDetailModal"
            header={resources.lblAlert}
            open={open}
            onClose={onClose}
        >
            {contentModal}
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(AlertDetailModal);