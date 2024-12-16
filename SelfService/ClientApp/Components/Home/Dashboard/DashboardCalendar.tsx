/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: DashboardCalendar.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { ITheme } from '@hedtech/powercampus-design-system/types/ITheme';
import { IDashboardEvent } from '../../../Types/Dashboard/IDashboardEvent';
// #endregion Imports

// #region Types
export interface IDashboardCalendarProps {
    cultures: ICultures;
    date: string;
    dateDesc?: string;
    events?: IDashboardEvent[];
    isLoading: boolean;
    resources: IDashboardCalendarResProps;
    showStudyingLegend: boolean;
    showTeachingLegend: boolean;
    theme: ITheme;
    withDownloadLink: boolean;
    onChangeDatePicker: (date: string) => void;
    onClickClassList: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onCloseEventNotes: (index: number) => void;
    onDownloadEvent?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onViewEventNotes: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IDashboardCalendarResProps {
    btnClassList: string;
    btnDownload: string;
    btnViewCalendar: string;
    btnViewNotes: string;
    formatBuilding: string;
    formatFloor: string;
    formatOrganization: string;
    formatRoom: string;
    formatSubtype: string;
    formatTime: string;
    formatTitleSection: string;
    lblNoEvents: string;
    lblNotes: string;
    lblStudying: string;
    lblTeaching: string;
    lblYourCalendar: string;
}

const styles = theme => createStyles({
    card: {
        minHeight: '500px',
        animation: 'slidein 1s',
        height: 'auto'
    },
    eventButton: {
        marginBottom: Tokens.spacing20
    },
    eventCard: {
        borderLeft: `thick solid ${theme.palette.secondary.main}`,
        marginBottom: Tokens.spacing50,
        paddingLeft: Tokens.spacing40
    },
    eventsContainer: {
        [theme.breakpoints.up('md')]: {
            height: '350px'
        },
        minWidth: '250px',
        height: Tokens.heightFluid,
        overflowX: 'hidden',
        overflowY: 'auto',
        paddingBottom: Tokens.spacing60,
        width: Tokens.widthFluid
    },
    eventsTitle: {
        marginBottom: Tokens.spacing50
    },
    hiddenLink: {
        height: 0,
        visibility: 'hidden',
        width: 0
    },
    legendIndicator: {
        backgroundColor: theme.palette.secondary.main,
        borderRadius: '50%',
        height: Tokens.spacing40,
        marginLeft: Tokens.spacing60,
        width: Tokens.spacing40
    },
    popperText: {
        whiteSpace: 'pre-line'
    },
    popperTextContainer: {
        maxHeight: '15rem',
        maxWidth: '17.5rem',
        overflowX: 'hidden',
        overflowY: 'auto'
    }
});

type PropsWithStyles = IDashboardCalendarProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const DashboardCalendar: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        cultures,
        date,
        dateDesc,
        events,
        isLoading,
        resources,
        showStudyingLegend,
        showTeachingLegend,
        theme,
        withDownloadLink,
        onChangeDatePicker,
        onClickClassList,
        onCloseEventNotes,
        onDownloadEvent,
        onViewEventNotes
    } = props;

    let eventElements: JSX.Element[] | undefined;
    if (events && events.length > 0) {
        eventElements = events.map((event, iEvent) => {
            const eventName: string = Format.toString(resources.formatTitleSection, [event.eventId, event.eventName]);
            const eventColor: string = event.isStudent ? theme.studyingCalendarColor : theme.teachingCalendarColor;
            const onClosePopperNotes = () => onCloseEventNotes(iEvent);
            return (
                <div className={classes.eventCard} key={`event_${iEvent}`} style={{ borderLeftColor: eventColor }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Text>
                                {Format.toString(resources.formatTime, [event.startHour, event.endHour])}
                            </Text>
                            <Text gutterBottom>
                                {eventName}
                            </Text>
                            <Text color="textSecondary" size="small">
                                {Format.toString(resources.formatSubtype, [event.eventSubTypeDesc])}
                            </Text>
                            <Text color="textSecondary" size="small">
                                {Format.toString(resources.formatOrganization, [event.orgName])}
                                {event.buildingName ? Format.toString(resources.formatBuilding, [event.buildingName]) : ''}
                                {event.floorId ? Format.toString(resources.formatFloor, [event.floorId]) : ''}
                                {event.roomId ? Format.toString(resources.formatRoom, [event.roomId]) : ''}
                            </Text>
                        </Grid>
                        {!event.isStudent && (
                            <Grid item xs={12}>
                                <Button
                                    IconProps={{
                                        name: "daily-work"
                                    }}
                                    align="left"
                                    className={classes.eventButton}
                                    data-id={event.sectionId}
                                    data-session={event.academicSession || ''}
                                    data-term={event.academicTerm}
                                    data-year={event.academicYear}
                                    id={`btnClassList_${iEvent}`}
                                    textVariantStyling="inherit"
                                    variant="text"
                                    onClick={onClickClassList}
                                >
                                    {resources.btnClassList}
                                </Button>
                            </Grid>
                        )}
                        {Boolean(event.notes) && (
                            <Grid item xs={12}>
                                <Button
                                    IconProps={{
                                        name: "note"
                                    }}
                                    align="left"
                                    aria-controls={`popEventNotes_${iEvent}`}
                                    aria-expanded={event.openNotes}
                                    className={classes.eventButton}
                                    data-end-hour={event.endHourValue}
                                    data-event-name={eventName}
                                    data-start-hour={event.startHourValue}
                                    data-index={iEvent}
                                    id={`btnViewNotes_${iEvent}`}
                                    textVariantStyling="inherit"
                                    variant="text"
                                    onClick={onViewEventNotes}
                                >
                                    {resources.btnViewNotes}
                                </Button>
                                <Popper
                                    anchorEl={event.anchorElNotes}
                                    arrow
                                    id={`popEventNotes_${iEvent}`}
                                    open={event.openNotes}
                                    placement="bottom-start"
                                    title={resources.lblNotes}
                                    transition={false}
                                    TitleTypographyProps={{
                                        variant: 'h4'
                                    }}
                                    onClickAway={onClosePopperNotes}
                                >
                                    <div className={classes.popperTextContainer}>
                                        <Text className={classes.popperText}>
                                            {event.notes}
                                        </Text>
                                    </div>
                                </Popper>
                            </Grid>
                        )}
                        {withDownloadLink && (
                            <Grid item xs={12}>
                                <Button
                                    IconProps={{
                                        name: 'download',
                                        type: 'info'
                                    }}
                                    align="left"
                                    className={classes.eventButton}
                                    id={`btnDownloadEvent_${iEvent}`}
                                    textVariantStyling="inherit"
                                    variant="text"
                                    onClick={onDownloadEvent}
                                >
                                    {resources.btnDownload}
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </div>
            );
        });
    }
    else {
        eventElements = [(
            <Illustration
                height="xs"
                name="calendar"
                text={resources.lblNoEvents}
            />
        )];
    }

    return (
        <Card className={classes.card} id="crdDashboardCalendar">
            <CardContent>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Text size="h2">
                            {resources.lblYourCalendar}
                        </Text>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <Divider noMarginBottom noMarginTop />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md>
                        <Grid container direction="column" spacing={0}>
                            <Grid item>
                                <DatePicker
                                    culture={cultures.dateTimeCulture}
                                    format={cultures.shortDatePattern}
                                    id="dtpDashboardCalendar"
                                    selectedDates={[date]}
                                    value={date}
                                    variant="standalone"
                                    onChange={onChangeDatePicker}
                                />
                            </Grid>
                            {!isLoading && (showStudyingLegend || showTeachingLegend) && (
                                <Grid item>
                                    <Grid container spacing={1} wrap="nowrap">
                                        {showStudyingLegend && (
                                            <Grid item>
                                                <Grid container spacing={1}>
                                                    <Grid item>
                                                        <div className={classes.legendIndicator} style={{ backgroundColor: theme.studyingCalendarColor }} />
                                                    </Grid>
                                                    <Grid item>
                                                        <Text size="small">
                                                            {resources.lblStudying}
                                                        </Text>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        )}
                                        {showTeachingLegend && (
                                            <Grid item>
                                                <Grid container spacing={1}>
                                                    <Grid item>
                                                        <div className={classes.legendIndicator} style={{ backgroundColor: theme.teachingCalendarColor }} />
                                                    </Grid>
                                                    <Grid item>
                                                        <Text size="small">
                                                            {resources.lblTeaching}
                                                        </Text>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md>
                        {isLoading ? (
                            <ContainerLoader id="ldrDashboardCalendar" />
                        ) : (
                            <>
                                <Text className={classes.eventsTitle} size="h2">
                                    <time dateTime={date}>
                                        {dateDesc}
                                    </time>
                                </Text>
                                <div className={classes.eventsContainer}>
                                    {eventElements}
                                </div>
                            </>
                        )}
                    </Grid>
                </Grid>
                <a href="#" id="lnkHdnDownloadCalendar" className={classes.hiddenLink} />
            </CardContent>
        </Card>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(DashboardCalendar);