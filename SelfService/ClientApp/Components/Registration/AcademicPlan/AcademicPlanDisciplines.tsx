/* Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AcademicPlanDisciplines.tsx
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
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';

// Internal components
import AcademicPlanClassifications, { IAcademicPlanClassificationResProps } from './AcademicPlanClassifications';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IDiscipline } from '../../../Types/Course/IDiscipline';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
// #endregion

// #region Internal types
export interface IAcademicPlanDisciplinesProps {
    disciplines: IDiscipline[] | undefined;
    impersonateInfo?: IImpersonateInfo;
    resources: IAcademicPlanDisciplinesResProps;
    showHideClassificationsCredits: boolean;
    showHideDisciplineCredits: boolean[];
    showSequence: boolean;
    onButtonClick: (id: string) => void;
    onClickPopOver: () => void;
    onClickShowClassificationsCredits: () => void;
    onClickShowCredits: () => void;
    onExpand: (iDiscipline: number, expanded: boolean) => void;
    onExpandClassification: (iDiscipline: number, iClassification: number, expanded: boolean) => void;
    onSearchSection: (id: string) => void;
}

export interface IAcademicPlanDisciplinesResProps {
    academicPlanClassification: IAcademicPlanClassificationResProps;
    lblCompleted: string;
    lblCredits: string;
    lblMax: string;
    lblMin: string;
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
        padding: Tokens.borderWidthThickest
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

type PropsWithStyles = IAcademicPlanDisciplinesProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const AcademicPlanDisciplines: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        disciplines,
        impersonateInfo,
        resources,
        showHideClassificationsCredits,
        showHideDisciplineCredits,
        showSequence,
        onButtonClick,
        onClickPopOver,
        onClickShowClassificationsCredits,
        onClickShowCredits,
        onExpand,
        onExpandClassification,
        onSearchSection
    } = props;

    let header: JSX.Element | undefined;
    let content: JSX.Element | undefined;
    const container: JSX.Element[] | undefined = [];

    if (disciplines && disciplines.length > 0) {
        disciplines.forEach((discipline, iDiscipline) => {
            header = (
                <>
                    <Hidden smDown>
                        <Grid container alignItems="center">
                            <Grid item xs={12} md={6} lg={8}>
                                <Text size="h3">
                                    {discipline.description}
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
                                                    {discipline.creditsCompleted}
                                                    {resources.lblPercentage}
                                                </Text>
                                            </Grid>
                                        </div>
                                        <Grid item>
                                            <LinearProgress
                                                variant="determinate"
                                                color="secondary"
                                                value={discipline.creditsCompletedValue}
                                            />
                                        </Grid>
                                    </div>
                                </Grid>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Tooltip
                                            id="showCourseCredit"
                                            title={showHideDisciplineCredits[iDiscipline] ? resources.lblShowLess : resources.lblShowMore}
                                        >
                                            <IconButton
                                                aria-label={showHideDisciplineCredits[iDiscipline]
                                                    ? resources.lblShowLess : resources.lblShowMore}
                                                className={classes.marginIcons}
                                                color={showHideDisciplineCredits[iDiscipline] ? 'secondary' : 'primary'}
                                                id={`iconBtnDisciplineShow_${iDiscipline}`}
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
                        <Grid container alignItems="center">
                            <Grid item xs={12}>
                                <Text size="h3">
                                    {discipline.description}
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
                                            {discipline.creditsCompleted}
                                            {resources.lblPercentage}
                                        </Text>
                                    </Grid>
                                </div>
                                <Grid item>
                                    <LinearProgress
                                        variant="determinate"
                                        color="secondary"
                                        value={Number(discipline.creditsCompleted)}
                                    />
                                </Grid>
                            </div>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Tooltip
                                    id="showCourseCredit"
                                    title={showHideDisciplineCredits[iDiscipline] ? resources.lblShowLess : resources.lblShowMore}
                                >
                                    <IconButton
                                        aria-label={showHideDisciplineCredits[iDiscipline] ? resources.lblShowLess : resources.lblShowMore}
                                        className={classes.marginIcons}
                                        color={showHideDisciplineCredits[iDiscipline] ? 'secondary' : 'primary'}
                                        id={`iconBtnDisciplineShow_${iDiscipline}`}
                                        onClick={onClickShowCredits}
                                    >
                                        <Icon name="info" />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Hidden>
                    <br />
                    {showHideDisciplineCredits[iDiscipline] && (
                        <Grid container id={`showHideDiscipline_${iDiscipline}`} className={classes.creditsContainerExternal}>
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
                                                            sizeTextUp="h3"
                                                            textDown={resources.lblMin}
                                                            textUp={discipline.creditMin}
                                                            withMarginTextUp
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <UpDownLabel
                                                            sizeTextDown="small"
                                                            sizeTextUp="h3"
                                                            textDown={resources.lblMax}
                                                            textUp={discipline.creditMax}
                                                            withMarginTextUp
                                                        />
                                                    </Grid>
                                                    <Grid item className={classes.marginLeft}>
                                                        <UpDownLabel
                                                            sizeTextDown="small"
                                                            sizeTextUp="h3"
                                                            textDown={resources.lblCompleted}
                                                            textUp={discipline.creditsTaken}
                                                            withMarginTextUp
                                                        />
                                                    </Grid>
                                                    <Grid item className={classes.marginLeft}>
                                                        <UpDownLabel
                                                            sizeTextDown="small"
                                                            sizeTextUp="h3"
                                                            textDown={resources.lblRemaining}
                                                            textUp={discipline.creditsRemaining}
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
                                                                textUp={discipline.creditMin}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h4"
                                                                textDown={resources.lblMax}
                                                                textUp={discipline.creditMax}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h4"
                                                                textDown={resources.lblCompleted}
                                                                textUp={discipline.creditsTaken}
                                                                withMarginTextUp
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <UpDownLabel
                                                                sizeTextDown="small"
                                                                sizeTextUp="h4"
                                                                textDown={resources.lblRemaining}
                                                                textUp={discipline.creditsRemaining}
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
                onExpand(iDiscipline, expanded);
            };

            content = (
                <AcademicPlanClassifications
                    classification={discipline.classificationList}
                    iDiscipline={iDiscipline}
                    impersonateInfo={impersonateInfo}
                    resources={resources.academicPlanClassification}
                    showHideClassificationCredits={showHideClassificationsCredits}
                    showSequence={showSequence}
                    onButtonClick={onButtonClick}
                    onClickPopOver={onClickPopOver}
                    onClickShowCredits={onClickShowClassificationsCredits}
                    onExpand={onExpandClassification}
                    onSearchSection={onSearchSection}
                />
            );

            container.push(
                <ExpansionPanel
                    key={`academicPlanClassificationsExpansion_${iDiscipline}`}
                    expanded={Boolean(discipline.expanded)}
                    header={header}
                    onChange={onExpandCallback}
                >
                    {content}
                </ExpansionPanel>
            );
        });
    }

    return (
        <>
            <br />
            {container}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(AcademicPlanDisciplines);