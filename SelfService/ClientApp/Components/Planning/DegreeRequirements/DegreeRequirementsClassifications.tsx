/* Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
 * File: DegreeRequirementsCourses.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';

// Internal components
import DegreeRequirementsCourses, { IDegreeRequirementsCoursesResProps } from './DegreeRequirementsCourses';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IClassification } from '../../../Types/Course/IClassification';
// #endregion Imports

// #region Internal types
export interface IDegreeRequirementsClassificationsProps {
    classification: IClassification[] | undefined;
    iDiscipline: number;
    personId?: number;
    resources: IDegreeRequirementsClassificationsResProps;
    showCredisTaken: boolean;
    showHideClassificationCredits: any[];
    showPadding: boolean;
    showStatusIcons: boolean;
    showMinGrade: boolean;
    showSequence: boolean;
    onButtonClick: (id: string) => void;
    onClickPopOver: () => void;
    onClickShowCredits: () => void;
    onExpand: (iDiscipline: number, iClassification: number, expanded: boolean) => void;
    onSearchSection: (id: string) => void;
    disciplineIndex?: number;
}

export interface IDegreeRequirementsClassificationsResProps {
    degreeRequirementsCourses: IDegreeRequirementsCoursesResProps;
    lblCredits: string;
    lblMax: string;
    lblMin: string;
    lblNoClassificationsAvailable: string;
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

type PropsWithStyles = IDegreeRequirementsClassificationsProps & WithStyles<typeof styles>;
// #endregion Internal types

// #region Component
const DegreeRequirementsClassifications: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        classification,
        iDiscipline,
        personId,
        resources,
        showPadding,
        showStatusIcons,
        showMinGrade,
        showSequence,
        onButtonClick,
        onClickPopOver,
        onExpand,
        onSearchSection,
        disciplineIndex
    } = props;

    let header: JSX.Element | undefined;
    let content: JSX.Element | undefined;
    const container: JSX.Element[] | undefined = [];

    if (classification && classification.length > 0) {
        classification.forEach((classification, iClassification) => {
            header = (
                <>
                    <br />
                    <Hidden smDown>
                        <Grid container>
                            <Grid item xs={12} md={6} lg={8}>
                                <Text size="h4">
                                    {classification.description}
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
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Hidden>
                    <Hidden mdUp>
                        <Grid container justifyContent="flex-start">
                            <Grid item xs={12} sm={8}>
                                <Text size="h4">
                                    {classification.description}
                                </Text>
                            </Grid>
                            <Grid item xs={12} sm={4}>
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
                                            </Grid>
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Hidden>
                    <br />
                </>
            );

            const onExpandCallback = (_event: any, expanded: boolean) => {
                onExpand(iDiscipline, iClassification, expanded);
            };

            content = (
                <>
                    <DegreeRequirementsCourses
                        courses={classification.courseEventList}
                        personId={personId}
                        showStatusIcons={showStatusIcons}
                        showMinGrade={showMinGrade}
                        showPadding={showPadding}
                        showSequence={showSequence}
                        onButtonClick={onButtonClick}
                        onClickPopOver={onClickPopOver}
                        onSearchSection={onSearchSection}
                        resources={resources.degreeRequirementsCourses}
                        disciplineIndex={disciplineIndex}
                    />
                </>
            );
            container.push(
                <ExpansionPanel
                    key={`epnlDegReqClassifications_${iDiscipline}_${iClassification}`}
                    expanded={Boolean(classification.expanded)}
                    header={header}
                    id={`epnlDegReqClassifications_${iDiscipline}_${iClassification}`}
                    onChange={onExpandCallback}

                >
                    {content}
                </ExpansionPanel>
            );
        });
    }
    else {
        return (
            <Grid container>
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
export default withStyles(styles)(DegreeRequirementsClassifications);