/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: AcademicPlanDegrees.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import RadioGroup from '@hedtech/powercampus-design-system/react/core/RadioGroup';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IRadioOption } from '@hedtech/powercampus-design-system/types/IRadioOption';
import { IAcademicPlanDegree } from '../../../Types/DegreeRequirements/IAcademicPlanDegree';
// #endregion Imports

// #region Types
export interface IAcademicPlanDegreesProps extends IAcademicPlanDegreesPropsToExtend {
    degrees: IAcademicPlanDegree[];
    program: string;
}

export interface IAcademicPlanDegreesPropsToExtend {
    selectedAcademicPlan: string;
    term: string;
    year: string;
    onChangeAcademicPlan: (event: React.ChangeEvent<{}>, value: string) => void;
}

const styles = (() => createStyles({
    indent: {
        marginLeft: '20px'
    }
}));

type PropsWithStyles = IAcademicPlanDegreesProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const AcademicPlanDegrees: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        degrees,
        program,
        selectedAcademicPlan,
        term,
        year,
        onChangeAcademicPlan
    } = props;

    let degreesInAcamedicPlan: JSX.Element | undefined;
    const degreeRadioOptions: IRadioOption[] = [];

    degrees.forEach((degree, i) => {
        degreeRadioOptions.push({
            description: `${degree.degreeDesc}/${degree.curriculumDesc}`,
            value: `${year}|${term}|${program}|${degree.degreeCode}|${degree.curriculumCode}`
        });

        degreesInAcamedicPlan = (
            <div className={classes.indent}>
                <RadioGroup
                    id={`rbgDegreesAcademicPlan_${i}`}
                    name="degreesInAcademicPlan"
                    options={degreeRadioOptions}
                    value={selectedAcademicPlan}
                    onChange={onChangeAcademicPlan}
                />
            </div>
        );
    });

    return (
        <>
            {degreesInAcamedicPlan}
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(AcademicPlanDegrees);