/* Copyright 2023 Ellucian Company L.P. and its affiliates.
 * File: RegistrationSummaryModal.tsx
 * Type: Presentation component */

// #region Imports
import React, { useState } from 'react';

// Core components
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import StatusLabel, { StatusLabelType } from '@hedtech/powercampus-design-system/react/core/StatusLabel';

// Types
import { IStudentCourseMessagesResources } from '@hedtech/powercampus-design-system/types/Resources/IStudentCourseMessagesResources';
import { IStudentCourseStatusResources } from '@hedtech/powercampus-design-system/types/Resources/IStudentCourseStatusResources';
import { IRegistrationSectionSummary, IRegistrationSummary } from '../../Types/Generic/IRegistrationSummary';
import { IRegistrationSummaryModalResources } from '../../Types/Resources/Generic/IRegistrationSummaryModalResources';
import { RegistrationSectionSummaryStatus } from '../../Types/Enum/RegistrationSectionSummaryStatus';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion Imports

// #region Types
export interface IRegistrationSummaryModalProps {
    open: boolean;
    registrationSummary?: IRegistrationSummary;
    resources: IRegistrationSummaryModalResources;
    studentCourseMessages: IStudentCourseMessagesResources;
    studentCourseStatus: IStudentCourseStatusResources;
    onClose: () => void;
}

const styles = createStyles({
    periodText: {
        marginBottom: Tokens.spacing40
    },
    statusContainer: {
        textAlign: 'right'
    },
    statusMessageContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        textAlign: 'right'
    },
    statusMessageIconContainer: {
        marginLeft: Tokens.spacing30
    },
    statusMessageInfo: {
        height: 'auto',
        width: 'auto'
    }
});

type PropsWithStyles = IRegistrationSummaryModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const RegistrationSummaryModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        registrationSummary,
        resources,
        studentCourseMessages,
        studentCourseStatus,
        onClose
    } = props;

    const [openStatusInfo, setOpenStatusInfo] = useState(false);
    const [statusInfoAnchor, setStatusInfoAnchor] = useState(null);

    const onCloseStatusInfoPopper = (): void => {
        setOpenStatusInfo(false);
        setStatusInfoAnchor(null);
    };

    const onOpenStatusInfoPopper = (event: any): void => {
        setOpenStatusInfo(true);
        setStatusInfoAnchor(event.currentTarget);
    };

    const renderSections = (sections?: IRegistrationSectionSummary[]) => sections?.map(section => {
        let status: string = '';
        let statusMessage: string = '';
        let statusType: StatusLabelType = 'default';
        switch (section.status) {
            case RegistrationSectionSummaryStatus.InCartAuthorizationNeeded:
                status = studentCourseStatus.lblInCart;
                statusMessage = studentCourseMessages.lblSeatAvailable;
                statusType = 'draft';
                break;
            case RegistrationSectionSummaryStatus.AwaitingApproval:
                status = studentCourseStatus.lblPending;
                statusMessage = studentCourseMessages.lblRegisterRequested;
                statusType = 'pending';
                break;
            case RegistrationSectionSummaryStatus.Registered:
                status = studentCourseStatus.lblRegistered;
                statusType = 'success';
                break;
            case RegistrationSectionSummaryStatus.DropPendingApproval:
                status = studentCourseStatus.lblRegistered;
                statusMessage = studentCourseMessages.lblDropRequested;
                statusType = 'success';
                break;
            case RegistrationSectionSummaryStatus.DropDenied:
                status = studentCourseStatus.lblRegistered;
                statusMessage = studentCourseMessages.lblDropDenied;
                statusType = 'success';
                break;
            case RegistrationSectionSummaryStatus.Denied:
                status = studentCourseStatus.lblDenied;
                statusMessage = studentCourseMessages.lblRegisterDenied;
                statusType = 'error';
                break;
            case RegistrationSectionSummaryStatus.Removed:
                status = studentCourseStatus.lblRemoved;
                statusMessage = studentCourseMessages.lblClassFull;
                statusType = 'error';
                break;
            case RegistrationSectionSummaryStatus.Dropped:
                status = studentCourseStatus.lblDropped;
                statusType = 'error';
                break;
            case RegistrationSectionSummaryStatus.RegistrationPeriodEnded:
                status = studentCourseStatus.lblInCart;
                statusMessage = studentCourseMessages.lblPeriodHasEnded;
                statusType = 'draft';
                break;
            default:
                break;
        }
        return (
            <Grid container key={`section_${section.eventId}`}>
                <Grid item md={8} xs={12}>
                    <Text size="large">
                        {Format.toString(resources.formatTitleSection, [section.eventId, section.eventName])}
                    </Text>
                    <Text>
                        {Format.toString(resources.formatYearTermSession, [section.year, section.term, section.session])}
                    </Text>
                    <Text>
                        {Format.toString(resources.formatSubtypeSection, [section.eventSubType, section.section])}
                    </Text>
                </Grid>
                <Grid item md={4} xs={12}>
                    {status && (
                        <Grid container spacing={1}>
                            <Grid item xs={12} className={classes.statusContainer}>
                                <StatusLabel id={`stSection_${section.eventId}`} text={status} type={statusType} />
                            </Grid>
                            {statusMessage ? (
                                <Grid item xs={12} className={classes.statusMessageContainer}>
                                    <Text display="inline">
                                        {statusMessage}
                                    </Text>
                                    {section.status === RegistrationSectionSummaryStatus.InCartAuthorizationNeeded && (
                                        <div className={classes.statusMessageIconContainer}>
                                            <IconButton className={classes.statusMessageInfo} color="gray" onClick={onOpenStatusInfoPopper}>
                                                <Icon name="info" type="info" />
                                            </IconButton>
                                            <Popper
                                                arrow
                                                id={`popper_${section.eventId}`}
                                                open={openStatusInfo}
                                                placement="bottom-start"
                                                anchorEl={statusInfoAnchor}
                                                onClickAway={onCloseStatusInfoPopper}
                                                text={studentCourseMessages.lblAdvisorStatus}
                                                transition={false}
                                            />
                                        </div>
                                    )}
                                </Grid>
                            ) : undefined}
                        </Grid>
                    )}
                </Grid>
            </Grid>
        );
    });

    return (
        <Modal
            disableBackdropClick
            disableEscapeKeyDown
            id="registrationSummaryModal"
            header={resources.lblTitle}
            maxWidth="lg"
            open={open}
            onClose={onClose}
        >
            {registrationSummary ? (
                <>
                    <Grid container>
                        <Grid item xs>
                            <Text className={classes.periodText} weight="strong" size="h3">
                                {Format.toString(resources.formatYearTerm, [registrationSummary.year, registrationSummary.term])}
                            </Text>
                        </Grid>
                    </Grid>
                    {registrationSummary.blocks.map((block, iBlock) => (
                        <>
                            <Grid container key={`${block.blockDisplayName}`} spacing={2}>
                                <Grid item xs={12}>
                                    <Text size="large" weight="strong">
                                        {Format.toString(resources.formatBlockName, [block.groupDisplayName, block.blockDisplayName])}
                                    </Text>
                                </Grid>
                                <Grid item xs={12}>
                                    {renderSections(block.sections)}
                                </Grid>
                            </Grid>
                            {(registrationSummary.sections?.length > 0 || iBlock < (registrationSummary.blocks.length - 1)) && (<Divider />)}
                        </>
                    ))}
                    {renderSections(registrationSummary.sections)}
                </>
            ) : undefined}
        </Modal>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(RegistrationSummaryModal);