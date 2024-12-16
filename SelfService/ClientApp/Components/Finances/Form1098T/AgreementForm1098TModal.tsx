/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AgreementForm1098TModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IAgreementDetail } from '../../../Types/Agreements/IAgreementDetail';
// #endregion Imports

// #region Types
export interface IAgreementForm1098TModalProps {
    agreement: IAgreementDetail;
    agreementResponse: boolean;
    resources: IAgreementForm1098TModalResProps;
    onChangeResponse: () => void;
    onClose: () => void;
    onSave: () => void;
}

export interface IAgreementForm1098TModalResProps {
    btnCancel: string;
    btnSave: string;
}

const styles = createStyles({
    buttonFooter: {
        textAlign: 'right'
    },
    containerFooter: {
        width: '100%'
    }
});

type PropsWithStyles = IAgreementForm1098TModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const AgreementForm1098TModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        agreement,
        agreementResponse,
        classes,
        resources,
        onChangeResponse,
        onClose,
        onSave
    } = props;

    return (
        <Modal
            id="agreementModal"
            header={agreement.title}
            footer={(
                <Grid container alignItems="center" className={classes.containerFooter}>
                    <Grid item xs={12}>
                        <Checkbox
                            checked={agreementResponse}
                            id="chkAcceptance"
                            label={agreement.acceptance}
                            onChange={onChangeResponse}
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.buttonFooter}>
                        <Button
                            id="btnSave"
                            onClick={onSave}
                        >
                            {resources.btnSave}
                        </Button>
                    </Grid>
                </Grid>
            )}
            maxWidth="sm"
            open={open}
            onClose={onClose}
        >
            <Grid container>
                <Grid item xs={12}>
                    <Text>
                        <div dangerouslySetInnerHTML={{ __html: agreement.content }} />
                    </Text>
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(AgreementForm1098TModal);