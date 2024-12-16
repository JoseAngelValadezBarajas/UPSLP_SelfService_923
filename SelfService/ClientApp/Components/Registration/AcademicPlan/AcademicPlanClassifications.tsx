/* Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AcademicPlanClassifications.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import LinearProgress from '@hedtech/powercampus-design-system/react/core/LinearProgress';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';

// Internal components
import AcademicPlanCourses, { IAcademicPlanCoursesResProps } from './AcademicPlanCourses';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IClassification } from '../../../Types/Course/IClassification';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
// #endregion Imports

// #region Internal types
export interface IAcademicPlanClassificationsProps {
    classification: IClassification[] | undefined;
    iDiscipline: number;
    impersonateInfo?: IImpersonateInfo;
    resources: IAcademicPlanClassificationResProps;
    showHideClassificationCredits: any[];
    showSequence: boolean;
    onButtonClick: (id: string) => void;
    onClickPopOver: () => void;
    onClickShowCredits: () => void;
    onExpand: (iDiscipline: number, iClassification: number, expanded: boolean) => void;
    onSearchSection: (id: string, eventsubtype: string) => void;
}

export interface IAcademicPlanClassificationResProps {
    academicPlanCourses: IAcademicPlanCoursesResProps;
    lblCredits: string;
    lblCompleted: string;
    lblMax: string;
    lblMin: string;
    lblNoClassificationsAvailable: string;
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
        marginRight: '1.25rem',
        padding: '0.625rem'
    },
    borderSM: {
        borderColor: Tokens.colorBrandNeutral300,
        borderRadius: Tokens.spacing30,
        borderStyle: 'solid',
        borderWidth: 'thin',
        display: 'inline-flex',
        marginLeft: Tokens.spacing40,
        padding: '0.1rem'
    },
    credits: {
        display: 'inline-flex',
        marginLeft: '1.25rem'
    },
    creditsCompleted: {
        display: 'inline-flex',
        marginBottom: Tokens.spacing30
    },
    creditsContainer: {
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'center'
        },
        justifyContent: 'flex-end'
    },
    creditsContainerExternal: {
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'center'
        },
        justifyContent: 'flex-end',
        marginBottom: Tokens.spacing30,
        marginTop: Tokens.spacing30
    },
    creditsSM: {
        display: 'inline-flex'
    },
    divCredits: {
        padding: Tokens.spacing40
    },
    marginIcons: {
        marginRight: Tokens.spacing30
    },
    marginLeft: {
        marginLeft: Tokens.spacing40
    }
});

type PropsWithStyles = IAcademicPlanClassificationsProps & WithStyles<typeof styles>;
// #endregion Internal types

// #region Component
const AcademicPlanClassifications: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        classification,
        iDiscipline,
        impersonateInfo,
        resources,
        showHideClassificationCredits,
        showSequence,
        onButtonClick,
        onClickPopOver,
        onClickShowCredits,
        onExpand,
        onSearchSection
    } = props;

    let header: JSX.Element | undefined;
    let content: JSX.Element | undefined;
    const container: JSX.Element[] | undefined = [];

    if (classification && classification.length > 0) {
        classification.forEach((classification, iClassification) => {
            const index: number = showHideClassificationCredits.findIndex(x => x[1] === iDiscipline && x[2] === iClassification);
            header = (
                <>
                    <Hidden smDown>
                        <Grid container alignItems="center">
                            <Grid item xs={12} md={6} lg={8}>
                                <Text size="h3">
                                    {classification.description}
                                </Text>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <Grid container justifyContent="flex-end">
                                    <div className={classes.divCredits}>
                                        <div className={classes.creditsCompleted}>
                                            <Grid item>
                                                <Text>
                                                    {resources.lblRequiredCredits}
                                                </Text>
                                            </Grid>
                                            <Grid item className={classes.marginLeft}>
                                                <Text>
                                                    {classification.creditsCompleted}
                                                    {resources.lblPercentage}
                                                </Text>
                                            </Grid>
                                        </div>
                                        <Grid item>
                                            <LinearProgress
                                                variant="determinate"
                                                color="secondary"
                                                value={classification.creditsCompletedValue}
                                            />
                                        </Grid>
                                    </div>
                                </Grid>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Tooltip
                                            id="showCourseCredit"
                                            title={showHideClassificationCredits[index][0] ? resources.lblShowLess : resources.lblShowMore}
                                        >
                                            <IconButton
                                                aria-label={showHideClassificationCredits[index][0] ? resources.lblShowLess : resources.lblShowMore}
                                                className={classes.marginIcons}
                                                color={showHideClassificationCredits[index][0] ? 'secondary' : 'primary'}
                                                id={`iconClass_${iDiscipline}_${iClassification}`}
                                                onClick={onClickShowCredits}
                                            >
                                                <Icon name="info" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Hidden>
                    <Hidden mdUp>
                        <Grid container alignItems="center" justifyContent="flex-start">
                            <Grid item xs={12}>
                                <Text size="h3">
                                    {classification.description}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" justifyContent="flex-start">
                            <div className={classes.divCredits}>
                                <div className={classes.creditsCompleted}>
                                    <Grid item>
                                        <Text>
                                            {resources.lblRequiredCredits}
                                        </Text>
                                    </Grid>
                                    <Grid item className={classes.marginLeft}>
                                        <Text>
                                            {classification.creditsCompleted}
                                            {resources.lblPercentage}
                                        </Text>
                                    </Grid>
                                </div>
                                <Grid item>
                                    <LinearProgress
                                        variant="determinate"
                                        color="secondary"
                                        value={Number(classification.creditsCompleted)}
                                    />
                                </Grid>
                            </div>

                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Tooltip
                                    id="showCourseCredit"
                                    title={showHideClassificationCredits[index][0] ? resources.lblShowLess : resources.lblShowMore}
                                >
                                    <IconButton
                                        aria-label={showHideClassificationCredits[index][0] ? resources.lblShowLess : resources.lblShowMore}
                                        className={classes.marginIcons}
                                        color={showHideClassificationCredits[index][0] ? 'secondary' : 'primary'}
                                        id={`iconClass_${iDiscipline}_${iClassification}`}
                                        onClick={onClickShowCredits}
                                    >
                                        <Icon name="info" />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Hidden>
                    <br />
                    {showHideClassificationCredits[index][0] && (
                        <Grid container id={`showHideClass_${iClassification}`} className={classes.creditsContainerExternal}>
                            <Grid item>
                                <Hidden smDown>
                                    <Grid container>
                                        <div className={classes.border}>
                                            <div>
                                                <Grid item>
                                                    <Text size="small">
                                                        {resources.lblCredits}
                                                    </Text>
                                                </Grid>
                                                <div className={classes.credits}>
                                                    <Grid item>
                                                        <UpDownLabel
                                                            sizeTextDown="small"
                                                            sizeTextUp="h4"
                                                            textDown={resources.lblMin}
                                                            textUp={classification.creditMin}
                                                            withMarginTextUp
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <UpDownLabel
                                                            sizeTextDown="small"
                                                            sizeTextUp="h4"
                                                            textDown={resources.lblMax}
                                                            textUp={classification.creditMax}
                                                            withMarginTextUp
                                                        />
                                                    </Grid>
                                                    <Grid item className={classes.marginLeft}>
                                                        <UpDownLabel
                                                            sizeTextDown="small"
                                                            sizeTextUp="h4"
                                                            textDown={resources.lblCompleted}
                                                            textUp={classification.creditsTaken}
                                                            withMarginTextUp
                                                        />
                                                    </Grid>
                                                    <Grid item className={classes.marginLeft}>
                                                        <UpDownLabel
                                                            sizeTextDown="small"
                                                            sizeTextUp="h4"
                                                            textDown={resources.lblRemaining}
                                                            textUp={classification.creditsRemaining}
                                                            withMarginTextUp
                                                        />
                                                    </Grid>
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                </Hidden>
                            </Grid>
                            <Grid item>
                                <Hidden mdUp>
                                    <Grid container>
                                        <div className={classes.borderSM}>
                                            <div>
                                                <Grid item>
                                                    <Text size="small">
                                                        {resources.lblCredits}
                                                    </Text>
                                                </Grid>
                                                <div className={classes.creditsSM}>
                                                    <Grid container className={classes.creditsContainer}>
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h4"
                                                                textDown={resources.lblMin}
                                                                textUp={classification.creditMin}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h4"
                                                                textDown={resources.lblMax}
                                                                textUp={classification.creditMax}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h4"
                                                                textDown={resources.lblCompleted}
                                                                textUp={classification.creditsTaken}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h4"
                                                                textDown={resources.lblRemaining}
                                                                textUp={classification.creditsRemaining}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                </Hidden>
                            </Grid>
                        </Grid>
                    )}
                </>
            );

            const onExpandCallback = (_event: any, expanded: boolean) => {
                onExpand(iDiscipline, iClassification, expanded);
            };

            content = (
                <AcademicPlanCourses
                    courses={classification.courseEventList}
                    impersonateInfo={impersonateInfo}
                    resources={resources.academicPlanCourses}
                    showSequence={showSequence}
                    onButtonClick={onButtonClick}
                    onClickPopOver={onClickPopOver}
                    onSearchSection={onSearchSection}
                />
            );

            container.push(
                <ExpansionPanel
                    key={`academicPlanCoursesExpansion_${iClassification}`}
                    expanded={Boolean(classification.expanded)}
                    header={header}
                    onChange={onExpandCallback}
                >
                    {content}
                </ExpansionPanel>
            );
        });
    }
    else {
        return (
            <Grid container spacing={3} key={'noClassificationAvailable'}>
                <Grid item xs={12} >
                    <br />
                    <MessageStyled
                        classMessage="noResults"
                        message={resources.lblNoClassificationsAvailable}
                    />
                </Grid>
            </Grid>
        );
    }

    return (
        <>
            <br />
            {container}
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(AcademicPlanClassifications);