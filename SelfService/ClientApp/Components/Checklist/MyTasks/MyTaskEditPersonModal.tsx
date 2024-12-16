/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: MyTasksEditPersonModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import PeopleSearch from '@hedtech/powercampus-design-system/react/components/PeopleSearch';

// Types
import { IMyTasksDetail } from '../../../Types/Checklist/IMyTasksDetial';
import { IMyTasksMainResources } from '../../../Types/Resources/Checklist/IMyTasksMainResources';
import { IPeopleSearchModel } from '@hedtech/powercampus-design-system/types/PeopleSearch/IPeopleSearchModel';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// #endregion Imports

// #region Types
export interface IMyTasksEditPersonModalProps {    
    onClickStep: (event: any) => void;
    onClose: () => void;
    onNext: () => void;
    open: boolean;
    personId: number;
    resources: IMyTasksMainResources;
    editTask: IMyTasksDetail;
    selectedPerson?: IPeopleSearchModel;
}

const styles = createStyles({
    assignContainer: {
        marginLeft: Tokens.spacing60
    },
    boxStep: {
        '& > span > span > span': {
            textAlign: 'left'
        },
        '&:focus': {
            boxShadow: 'none'
        }
    },
    mobileStepperContent: {
        minHeight: '65vh',
        padding: `${Tokens.spacing40} ${Tokens.spacing40} 0 ${Tokens.spacing40}`
    },
    secondStepSeparator: {
        marginTop: Tokens.spacing40
    }
});

type PropsWithStyles = IMyTasksEditPersonModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const MyTasksEditPersonModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {        
        onClose,
        onNext,
        open,
        editTask,
        personId,
        resources,
    } = props;

    let contentSetp0: JSX.Element;
    let contentPage: JSX.Element | undefined;
    contentSetp0 = (
        <PeopleSearch />
    );

    contentPage = (
        <Modal
            disableBackdropClick
            disableEscapeKeyDown
            footer={(
                <ButtonGroup id="btgPeopleSearch">
                    <Button
                        id="btnBack"
                        color="secondary"
                        onClick={onClose}
                    >
                        {resources.lblBack}
                    </Button>
                    <Button
                        id="btnNext"
                        onClick={onNext}
                    >
                        {resources.lblNext}
                    </Button>
                </ButtonGroup>
            )}
            id="peopleSearchAssignModal"
            header={personId ? resources.lblChangeResponsible : editTask.actionName}
            maxWidth="lg"
            open={open}
            onClose={onClose}
        >
            {contentSetp0}
        </Modal>
    );

    return (
        <>
            {contentPage}
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(MyTasksEditPersonModal);