/* Copyright 2018-2020 Ellucian Company L.P. and its affiliates.
 * File: AvailableAcademicPlanModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import AcademicPlanPrograms from './AcademicPlanPrograms';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IAcademicDegReq } from '../../../Types/DegreeRequirements/IAcademicDegReq';
// #endregion Imports

// #region Internal types
export interface IAvailableAcademicPlanModalProps {
    academicPlans: IAcademicDegReq[];
    open: boolean;
    resources: IAvailableAcademicPlanModalResProps;
    selectedAcademicPlan?: string;
    onChangeAcademicPlan: (event: React.ChangeEvent<{}>, value: string) => void;
    onClose: () => void;
    onSelect: () => void;
}

export interface IAvailableAcademicPlanModalResProps {
    btnSelectAcademicPlan: string;
    lblModalTitle: string;
}

const styles = (() => createStyles({
    indent: {
        marginLeft: '20px'
    }
}));

type PropsWithStyles = IAvailableAcademicPlanModalProps & WithStyles<typeof styles>;
// #endregion Internal types

// #region Component
const AvailableAcademicPlanModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        academicPlans,
        classes,
        open,
        resources,
        selectedAcademicPlan,
        onChangeAcademicPlan,
        onClose,
        onSelect
    } = props;

    const availableAcademicPlans: JSX.Element[] = [];

    academicPlans.forEach((plan, i) => {
        if (selectedAcademicPlan) {
            availableAcademicPlans.push(
                <React.Fragment key={`academicPlanProgram_${i}`}>
                    <Text size="h3">
                        {plan.year}
/
                        {plan.termDesc}
                    </Text>
                    <div className={classes.indent}>
                        <AcademicPlanPrograms
                            programs={plan.programs}
                            selectedAcademicPlan={selectedAcademicPlan}
                            term={plan.termCode}
                            year={plan.year}
                            onChangeAcademicPlan={onChangeAcademicPlan}
                        />
                    </div>
                </React.Fragment>
            );
        }
    });

    return (
        <Modal
            id="modalAvailableAcademicPlan"
            header={resources.lblModalTitle}
            footer={(
                <Button
                    id={'btnSelectAcademicPlanAvailable'}
                    color="primary"
                    onClick={onSelect}
                >
                    {resources.btnSelectAcademicPlan}
                </Button>
            )}
            open={open}
            onClose={onClose}
        >
            {availableAcademicPlans}
        </Modal>
    );

};
// #endregion Component

// Export: Component
export default withStyles(styles)(AvailableAcademicPlanModal);