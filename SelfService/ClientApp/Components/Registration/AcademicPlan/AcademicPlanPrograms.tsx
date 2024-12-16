/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: AcademicPlanPrograms.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import AcademicPlanDegrees, { IAcademicPlanDegreesPropsToExtend } from './AcademicPlanDegrees';

// Types
import { IAcademicPlanProgram } from '../../../Types/DegreeRequirements/IAcademicPlanProgram';
// #endregion Imports

// #region Types
export interface IAcademicPlanProgramsProps extends IAcademicPlanDegreesPropsToExtend {
    programs?: IAcademicPlanProgram[];
}
// #endregion Types

// #region Component
const AcademicPlanPrograms: React.FC<IAcademicPlanProgramsProps> = (props: IAcademicPlanProgramsProps): JSX.Element => {
    const {
        programs,
        selectedAcademicPlan,
        term,
        year,
        onChangeAcademicPlan
    } = props;

    const programsInAcamedicPlan: JSX.Element[] = [];
    if (programs) {
        programs.forEach((program, i) => {
            programsInAcamedicPlan.push(
                <React.Fragment key={`academicPlanDegree_${i}`}>
                    <Text size="h3">
                        {program.programDesc}
                    </Text>
                    <AcademicPlanDegrees
                        degrees={program.degrees}
                        program={program.programCode}
                        selectedAcademicPlan={selectedAcademicPlan}
                        term={term}
                        year={year}
                        onChangeAcademicPlan={onChangeAcademicPlan}
                    />
                </React.Fragment>
            );
        });

    }
    return (
        <>
            {programsInAcamedicPlan}
        </>
    );
};
// #endregion Component

// Export: Component
export default AcademicPlanPrograms;