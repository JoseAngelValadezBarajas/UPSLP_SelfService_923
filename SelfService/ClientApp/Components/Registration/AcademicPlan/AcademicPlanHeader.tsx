/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: AcademicPlanHeader.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import LinearProgress from '@hedtech/powercampus-design-system/react/core/LinearProgress';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';

// Internal components
import Print from '../../Generic/Print';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Types
import { IStudentDegReq } from '../../../Types/DegreeRequirements/IStudentDegReq';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { IPrintResources } from '../../../Types/Resources/Generic/IPrintResources';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion

// #region Internal types
export interface IAcademicPlanHeaderProps {
    academicPlan: IStudentDegReq;
    allExpanded: boolean;
    canViewOtherPlans?: boolean;
    email?: string;
    expectedGraduationDate?: string;
    fullName?: string;
    graduationPeriod?: string;
    isWhatIf: boolean;
    printLink: string;
    printingResources: IPrintResources;
    resources: IAcademicPlanHeaderResProps;
    showHideCourse: boolean;
    studentMailToUrl?: string;
    onChangePlan?: () => void;
    onClickShowCourse: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onExpandAll: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IAcademicPlanHeaderResProps {
    btnCollapse: string;
    btnExpand: string;
    btnOtherPlans: string;
    formatName: string;
    formatYearTerm: string;
    lblAcademicPlanInstructions: string;
    lblCompleted: string;
    lblContactAdvisor: string;
    lblCourse: string;
    lblCredits: string;
    lblDiscipline: string;
    lblExpectedGraduationDate: string;
    lblGpa: string;
    lblGraduationPeriod: string;
    lblMax: string;
    lblMin: string;
    lblOverall: string;
    lblPercentage: string;
    lblRemaining: string;
    lblRequiredCredits: string;
    lblShowLess: string;
    lblShowMore: string;
}

const styles = (theme: Theme) => createStyles({
    border: {
        borderColor: Tokens.colorBrandNeutral300,
        borderRadius: Tokens.spacing30,
        borderStyle: 'solid',
        borderWidth: 'thin',
        display: 'inline-flex',
        marginRight: '3.4375rem',
        padding: '0.625rem'
    },
    borderSM: {
        borderColor: Tokens.colorBrandNeutral300,
        borderRadius: Tokens.spacing30,
        borderStyle: 'solid',
        borderWidth: 'thin',
        display: 'inline-flex',
        padding: '0.625rem'
    },
    course: {
        display: 'inline-flex',
        marginLeft: '1.65rem'
    },
    courseMaxMin: {
        display: 'inline-flex',
        marginLeft: '1rem'
    },
    credits: {
        display: 'inline-flex',
        marginLeft: '1.25rem'
    },
    courseContainer: {
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'center'
        },
        justifyContent: 'flex-end'
    },
    discipline: {
        marginTop: '1.25rem'
    },
    disciplineSM: {
        marginTop: Tokens.spacing60
    },
    marginIcons: {
        marginRight: Tokens.spacing30
    },
    marginLeft: {
        marginLeft: Tokens.spacing40
    }
});

type PropsWithStyles = IAcademicPlanHeaderProps & WithStyles<typeof styles> & WithWidth;
// #endregion Internal types

// #region Component
class AcademicPlanHeader extends React.Component<PropsWithStyles> {
    public render(): JSX.Element {
        const {
            academicPlan,
            allExpanded,
            canViewOtherPlans,
            classes,
            email,
            expectedGraduationDate,
            fullName,
            graduationPeriod,
            isWhatIf,
            printingResources,
            printLink,
            resources,
            showHideCourse,
            studentMailToUrl,
            width,
            onChangePlan,
            onClickShowCourse,
            onExpandAll
        } = this.props;

        const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();

        const overallGPASection: JSX.Element = (
            <Grid
                container
                justifyContent={isWidthUp('sm', width) ? 'flex-end' : 'center'}
                wrap="nowrap"
            >
                <Grid item>
                    <UpDownLabel
                        sizeTextDown="small"
                        sizeTextUp="h3"
                        textDown={resources.lblGpa}
                        textUp={academicPlan.degreeGpa}
                        withMarginTextUp
                    />
                </Grid>
                <Grid item>
                    <UpDownLabel
                        sizeTextDown="small"
                        sizeTextUp="h3"
                        textDown={resources.lblOverall}
                        textUp={academicPlan.overallGpa}
                        withMarginTextUp
                    />
                </Grid>
            </Grid>
        );
        const moreInfoButton: JSX.Element = (
            <Tooltip
                id="showCourseCredit"
                title={showHideCourse ? resources.lblShowLess : resources.lblShowMore}
            >
                <IconButton
                    aria-label={showHideCourse ? resources.lblShowLess : resources.lblShowMore}
                    className={classes.marginIcons}
                    color={showHideCourse ? 'secondary' : 'primary'}
                    id="btnList"
                    onClick={onClickShowCourse}
                >
                    <Icon name="info" />
                </IconButton>
            </Tooltip>
        );
        const progressSection: JSX.Element = (
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
                                {academicPlan.creditsCompleted}
                                {resources.lblPercentage}
                            </Text>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <LinearProgress
                        variant="determinate"
                        color="secondary"
                        value={academicPlan.creditsCompletedValue}
                    />
                </Grid>
            </Grid>
        );

        const onClickEmail = () => {
            if (studentMailToUrl) {
                window.open(Format.toString(studentMailToUrl, [email]),
                    studentMailToUrl.toLowerCase() === 'mailto:{0}' ? '_self' : '_blank');
            }
        };

        const summarySection: JSX.Element = (
            <>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Text>
                            {resources.lblAcademicPlanInstructions}
                        </Text>
                    </Grid>
                    {Boolean(fullName) && (
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Text>
                                        {resources.lblContactAdvisor}
                                    </Text>
                                </Grid>
                                <Grid item>
                                    <Button
                                        IconProps={{
                                            name: 'email'
                                        }}
                                        id="btnSendAdvisorEmail"
                                        align="left"
                                        textVariantStyling="inherit"
                                        variant="text"
                                        onClick={onClickEmail}
                                    >
                                        {fullName}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                    {graduationPeriod ? (
                        <Grid item xs={12}>
                            <Text>
                                {resources.lblGraduationPeriod}
                                {graduationPeriod}
                            </Text>
                        </Grid>
                    ) : expectedGraduationDate ? (
                        <Grid item xs={12}>
                            <Text>
                                {resources.lblExpectedGraduationDate}
                                {expectedGraduationDate}
                            </Text>
                        </Grid>
                    ) : undefined}
                </Grid>
            </>
        );

        return (
            <Card>
                <CardContent>
                    <Hidden smDown>
                        <Grid
                            container
                            justifyContent="space-between"
                            wrap="nowrap"
                        >
                            <Grid item>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item>
                                        <Text size="h3" id="lblAcademicPlanName">
                                            {Format.toString(resources.formatName, [
                                                academicPlan.programDesc,
                                                academicPlan.degreeDesc,
                                                academicPlan.curriculumDesc
                                            ])}
                                        </Text>
                                    </Grid>
                                    <Grid item>
                                        <Text
                                            size="h4"
                                            weight="strong"
                                            id="lblYearTerm"
                                        >
                                            {Format.toString(resources.formatYearTerm, [academicPlan.matricYear, academicPlan.matricTerm])}
                                        </Text>
                                    </Grid>
                                    {!isWhatIf && (
                                        <Hidden xsDown>
                                            <Grid item>
                                                {summarySection}
                                            </Grid>
                                        </Hidden>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid item>
                                {!isWhatIf && (
                                    <Grid container justifyContent="flex-end">
                                        <Grid item>
                                            <Print
                                                resources={printingResources}
                                                link={printLink}
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                                <Hidden xsDown>
                                    {overallGPASection}
                                </Hidden>
                                <Hidden smUp>
                                    {moreInfoButton}
                                </Hidden>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction={isWidthUp('sm', width) ? 'row' : 'column'}
                            justifyContent="space-between"
                        >
                            <Grid item>
                                {(onChangePlan && canViewOtherPlans) && (
                                    <Button
                                        color="secondary"
                                        id="btnOtherPlans"
                                        onClick={onChangePlan}
                                    >
                                        {resources.btnOtherPlans}
                                    </Button>
                                )}
                            </Grid>
                            <Grid item>
                                <Grid
                                    container
                                    direction={isWidthUp('sm', width) ? 'row' : 'column'}
                                    justifyContent={isWidthUp('sm', width) ? 'flex-end' : 'flex-start'}
                                    spacing={2}
                                >
                                    <Hidden smUp>
                                        {!isWhatIf && (
                                            <Grid item>
                                                {summarySection}
                                            </Grid>
                                        )}
                                        <Grid item>
                                            {overallGPASection}
                                        </Grid>
                                    </Hidden>
                                    <Grid item>
                                        <Grid
                                            container
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                {progressSection}
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            container
                                            justifyContent="flex-end"
                                        >
                                            <Hidden smDown>
                                                <Grid item>
                                                    {moreInfoButton}
                                                </Grid>
                                            </Hidden>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        {showHideCourse && (
                            <>
                                <br />
                                <Grid container className={classes.courseContainer}>
                                    <Grid item>
                                        <Grid container className={classes.courseContainer}>
                                            <Grid item className={classes.discipline}>
                                                <UpDownLabel
                                                    sizeTextDown="small"
                                                    sizeTextUp="h3"
                                                    textDown={resources.lblDiscipline}
                                                    textUp={academicPlan.discipline}
                                                    withMarginTextUp
                                                />
                                            </Grid>
                                            <div className={classes.border}>
                                                <div>
                                                    <Grid item>
                                                        <Text size="small">
                                                            {resources.lblCourse}
                                                        </Text>
                                                    </Grid>
                                                    <div className={classes.course}>
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h3"
                                                                textDown={resources.lblMin}
                                                                textUp={academicPlan.coursesMin}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                        <Grid item className={classes.marginLeft}>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h3"
                                                                textDown={resources.lblMax}
                                                                textUp={academicPlan.coursesMax}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={classes.border}>
                                                <div>
                                                    <Grid item>
                                                        <Text size="small">
                                                            {resources.lblCredits}
                                                        </Text>
                                                    </Grid>
                                                    <div className={classes.course}>
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h3"
                                                                textDown={resources.lblMin}
                                                                textUp={academicPlan.creditMin}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h3"
                                                                textDown={resources.lblMax}
                                                                textUp={academicPlan.creditsMax}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                        <Grid item className={classes.marginLeft}>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h3"
                                                                textDown={resources.lblCompleted}
                                                                textUp={academicPlan.creditsTaken}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                        <Grid item className={classes.marginLeft}>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h3"
                                                                textDown={resources.lblRemaining}
                                                                textUp={academicPlan.creditsRemaining}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                    </div>
                                                </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <br />
                            </>
                        )}
                        {layoutResources && academicPlan?.disciplineList && academicPlan.disciplineList.length > 0 && (
                            <>
                                <br />
                                <Grid
                                    container
                                    justifyContent="flex-end"
                                >
                                    <Grid item>
                                        <Button
                                            data-expanded={!allExpanded}
                                            id="btnExpandCollapseAll"
                                            variant="text"
                                            onClick={onExpandAll}
                                        >
                                            {allExpanded ? layoutResources.lblCollapseAll : layoutResources.lblExpandAll}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </Hidden>
                    <Hidden mdUp>
                        <Grid container>
                            <Grid item xs>
                                <Text size="h3">
                                    {Format.toString(resources.formatName, [
                                        academicPlan.programDesc,
                                        academicPlan.degreeDesc,
                                        academicPlan.curriculumDesc
                                    ])}
                                </Text>
                            </Grid>
                            {!isWhatIf && (
                                <Grid item>
                                    <Print
                                        resources={printingResources}
                                        link={printLink}
                                    />
                                </Grid>
                            )}
                        </Grid>
                        <Grid container>
                            <Grid item>
                                <Text
                                    size="h4"
                                    weight="strong"
                                >
                                    {Format.toString(resources.formatYearTerm, [academicPlan.matricYear, academicPlan.matricTerm])}
                                </Text>
                            </Grid>
                        </Grid>
                        {!isWhatIf && (
                            <Grid container>
                                <Grid item>
                                    {summarySection}
                                </Grid>
                            </Grid>
                        )}
                        <Grid container justifyContent="center">
                            <Grid item>
                                {overallGPASection}
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                {progressSection}
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                {moreInfoButton}
                            </Grid>
                        </Grid><br />
                        {showHideCourse && (
                            <>
                                <Grid
                                    container
                                    justifyContent={'center'}
                                    wrap="nowrap"
                                >
                                    <Grid item className={classes.disciplineSM}>
                                        <UpDownLabel
                                            sizeTextDown="small"
                                            sizeTextUp="h3"
                                            textDown={resources.lblDiscipline}
                                            textUp={academicPlan.discipline}
                                            withMarginTextUp
                                        />
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent={'flex-start'}
                                    wrap="nowrap"
                                >
                                    <Grid item>
                                        <div className={classes.borderSM}>
                                            <div>
                                                <Grid item>
                                                    <Text size="small">
                                                        {resources.lblCourse}
                                                    </Text>
                                                </Grid>
                                                <div>
                                                    <Grid container className={classes.courseContainer}>
                                                        <Grid className={classes.courseMaxMin} />
                                                        <Grid />
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h3"
                                                                textDown={resources.lblMin}
                                                                textUp={academicPlan.coursesMin}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                        <Grid />
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h3"
                                                                textDown={resources.lblMax}
                                                                textUp={academicPlan.coursesMax}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                        <Grid className={classes.courseMaxMin} />
                                                        <Grid />
                                                        <Grid />
                                                    </Grid>
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent={'center'}
                                    wrap="nowrap"
                                >
                                    <Grid item>
                                        <div className={classes.borderSM}>
                                            <div>
                                                <Grid item>
                                                    <Text size="small">
                                                        {resources.lblCredits}
                                                    </Text>
                                                </Grid>
                                                <div className={classes.credits}>
                                                    <Grid container className={classes.courseContainer}>
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h3"
                                                                textDown={resources.lblMin}
                                                                textUp={academicPlan.creditMin}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h3"
                                                                textDown={resources.lblMax}
                                                                textUp={academicPlan.creditsMax}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h3"
                                                                textDown={resources.lblCompleted}
                                                                textUp={academicPlan.creditsTaken}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h3"
                                                                textDown={resources.lblRemaining}
                                                                textUp={academicPlan.creditsRemaining}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                        <Grid container>
                            <Grid item xs={12} sm={12}>
                                {(onChangePlan && canViewOtherPlans) && (
                                    <Button
                                        color="secondary"
                                        id="btnOtherPlans"
                                        onClick={onChangePlan}
                                    >
                                        {resources.btnOtherPlans}
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                        {layoutResources && (
                            <Grid
                                container
                                justifyContent="flex-end"
                            >
                                <Grid item>
                                    <Button
                                        data-expanded={!allExpanded}
                                        id="btnExpandCollapseAll"
                                        variant="text"
                                        onClick={onExpandAll}
                                    >
                                        {allExpanded ? layoutResources.lblCollapseAll : layoutResources.lblExpandAll}
                                    </Button>
                                </Grid>
                            </Grid>
                        )}
                    </Hidden>
                </CardContent>
            </Card>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(AcademicPlanHeader));