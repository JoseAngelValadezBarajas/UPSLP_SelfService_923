/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AgreementDetailModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IPeopleAgreementDetail } from '../../../Types/Students/IPeopleAgreementDetail';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion

// #region Internal types
export interface IAgreementDetailModalProps {
    agreementDetail: IPeopleAgreementDetail;
    btnOk: string;
    onClose: () => void;
    open: boolean;
}

const styles = () => createStyles({
    checkboxSpace: {
        marginLeft: Tokens.spacing40
    }
});

type PropsWithStyles = IAgreementDetailModalProps & WithStyles<typeof styles>;
// #endregion Internal types

// #region Component
const AgreementDetailModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        agreementDetail,
        btnOk,
        classes,
        onClose,
        open
    } = props;

    return (
        <Modal
            footer={(
                <Grid container justifyContent="flex-end">
                    <Grid item className={classes.checkboxSpace}>
                        <Checkbox
                            checked={true}
                            disabled
                            id="chkAcceptance"
                            label={agreementDetail.acceptance}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            id="btnOk"
                            onClick={onClose}
                        >
                            {btnOk}
                        </Button>
                    </Grid>
                </Grid>
            )}
            id="AgreementDetailModal"
            header={agreementDetail.title}
            open={open}
            onClose={onClose}
        >
            <Grid container spacing={3}>
                <Grid item xs>
                    <Text>
                        <span dangerouslySetInnerHTML={{ __html: agreementDetail.content }} />
                    </Text>
                </Grid>
                <br />
            </Grid>
        </Modal>
    );
};
// #endregion

export default withStyles(styles)(AgreementDetailModal);