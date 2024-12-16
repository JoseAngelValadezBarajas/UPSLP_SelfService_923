/* Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
 * File: DegreeRequirementsDisciplines.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';

// Internal components
import DegreeRequirementsClassifications, { IDegreeRequirementsClassificationsResProps } from './DegreeRequirementsClassifications';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IStudentDegReq } from '../../../Types/DegreeRequirements/IStudentDegReq';
// #endregion Imports

// #region Internal types
export interface IDegreeRequirementsDisciplinesProps {
    academicPlan: IStudentDegReq | undefined;
    personId?: number;
    resources: IDegreeRequirementsDisciplinesResProps;
    showCredisTaken: boolean;
    showHideDisciplineCredits: boolean[];
    showHideClassificationsCredits: boolean;
    showMinCredits: boolean;
    showMinGrade: boolean;
    showPadding: boolean;
    showStatusIcons: boolean;
    showSequence: boolean;
    onButtonClick: (id: string) => void;
    onClickPopOver: () => void;
    onClickShowClassificationsCredits: () => void;
    onClickShowCredits: () => void;
    onExpand: (iDiscipline: number, expanded: boolean) => void;
    onExpandClassification: (iDiscipline: number, iClassification: number, expanded: boolean) => void;
    onSearchSection: (id: string) => void;
}

export interface IDegreeRequirementsDisciplinesResProps {
    degreeRequirementsClassification: IDegreeRequirementsClassificationsResProps;
    lblCredits: string;
    lblMax: string;
    lblMin: string;
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
        padding: Tokens.borderWidthThickest
    },
    credits: {
        display: 'inline-flex'
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

type PropsWithStyles = IDegreeRequirementsDisciplinesProps & WithStyles<typeof styles>;
// #endregion Internal types

// #region Component
const DegreeRequirementsDisciplines: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        academicPlan,
        classes,
        personId,
        resources,
        showCredisTaken,
        showHideClassificationsCredits,
        showMinGrade,
        showPadding,
        showStatusIcons,
        showSequence,
        onButtonClick,
        onClickPopOver,
        onClickShowClassificationsCredits,
        onExpand,
        onExpandClassification,
        onSearchSection
    } = props;

    let header: JSX.Element | undefined;
    let content: JSX.Element | undefined;
    const container: JSX.Element[] | undefined = [];

    if (academicPlan) {
        if (academicPlan.disciplineList && academicPlan.disciplineList.length > 0) {
            academicPlan.disciplineList.forEach((discipline, i) => {
                header = (
                    <React.Fragment>
                        <br />
                        <Hidden smDown>
                            <Grid container>
                                <Grid item xs={12} md={6} lg={8}>
                                    <Text size="h3">
                                        {discipline.description}
                                    </Text>
                                </Grid>
                                <Grid item xs={12} md={6} lg={4}>
                                    <Grid container justifyContent="flex-end">
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
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Hidden>
                        <Hidden mdUp>
                            <Grid container>
                                <Grid item xs={12} sm={9}>
                                    <Text size="h3">
                                        {discipline.description}
                                    </Text>
                                </Grid>
                                <Grid item xs={12} sm={3}>
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
                                                    </Grid>
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Hidden>
                        <br />
                    </React.Fragment>
                );

                const onExpandCallback = (_event: any, expanded: boolean) => {
                    onExpand(i, expanded);
                };

                content = (
                    <>
                        <DegreeRequirementsClassifications
                            classification={discipline.classificationList}
                            iDiscipline={i}
                            personId={personId}
                            showHideClassificationCredits={showHideClassificationsCredits}
                            showCredisTaken={showCredisTaken}
                            showStatusIcons={showStatusIcons}
                            showMinGrade={showMinGrade}
                            showPadding={showPadding}
                            showSequence={showSequence}
                            onButtonClick={onButtonClick}
                            onClickPopOver={onClickPopOver}
                            onClickShowCredits={onClickShowClassificationsCredits}
                            onExpand={onExpandClassification}
                            onSearchSection={onSearchSection}
                            resources={resources.degreeRequirementsClassification}
                        />
                    </>
                );
                container.push(
                    <ExpansionPanel
                        key={`epnlDegReqDisciplines_${i}`}
                        expanded={Boolean(discipline.expanded)}
                        header={header}
                        id={`epnlDegReqDisciplines_${i}`}
                        onChange={onExpandCallback}
                    >
                        {content}
                    </ExpansionPanel>
                );
            });
        }
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
export default withStyles(styles)(DegreeRequirementsDisciplines);