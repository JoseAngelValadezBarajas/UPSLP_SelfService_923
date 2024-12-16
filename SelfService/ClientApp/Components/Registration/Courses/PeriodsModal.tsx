/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: PeriodsModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import RadioGroup from '@hedtech/powercampus-design-system/react/core/RadioGroup';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IRadioOption } from '@hedtech/powercampus-design-system/types/IRadioOption';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
// #endregion

// #region Internal types
export interface IPeriodsModalProps {
    disableSelect: boolean;
    open: boolean;
    periodsForRegistration?: IRadioOption[];
    periodsForSearch?: IRadioOption[];
    resources: IPeriodsModalResProps;
    selectedPeriod?: string;
    onChangePeriod: (event: React.ChangeEvent<{}>, value: string) => void;
    onClose: () => void;
    onSelect: () => void;
}

export interface IPeriodsModalResProps {
    btnSelectPeriod: string;
    lblPeriodModalTitle: string;
    lblTermsNoOpen: string;
    lblTermsNoOpenComment: string;
    lblTermsOpen: string;
    lblTermsOpenEmpty: string;
}

const styles = createStyles({
    complementRadio: {
        marginLeft: Tokens.spacing30
    }
});

type PropsWithStyles = IPeriodsModalProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const PeriodsModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        disableSelect,
        open,
        periodsForRegistration,
        periodsForSearch,
        resources,
        selectedPeriod,
        onChangePeriod,
        onClose,
        onSelect
    } = props;

    let showSelectButton: boolean = false;

    let termsOpen: JSX.Element;

    if (periodsForRegistration && periodsForRegistration.length > 0) {
        termsOpen = (
            <Grid item xs>
                <Text size="h3">
                    {resources.lblTermsOpen}
                </Text>
                <RadioGroup
                    complementClassName={classes.complementRadio}
                    id="rbgPeriodsForRegistration"
                    name="PeriodsForRegistration"
                    options={periodsForRegistration}
                    value={selectedPeriod}
                    onChange={onChangePeriod}
                />
            </Grid>
        );
        showSelectButton = true;
    }
    else {
        termsOpen = (
            <Grid item xs>
                <Text size="h3">
                    {resources.lblTermsOpen}
                </Text>
                <Alert
                    id="msgWarningTermsOpenEmpty"
                    open
                    text={resources.lblTermsOpenEmpty}
                    type={ResultType.warning}
                />
            </Grid>
        );
    }

    let termsNoOpen: JSX.Element | undefined;
    if (periodsForSearch && periodsForSearch.length > 0) {
        termsNoOpen = (
            <Grid container spacing={3}>
                <Grid item xs>
                    <Text size="h3">
                        {resources.lblTermsNoOpen}
                    </Text>
                    <Text>
                        {resources.lblTermsNoOpenComment}
                    </Text>
                    <RadioGroup
                        id="rbgPeriodsForSearch"
                        name="PeriodsForSearch"
                        options={periodsForSearch}
                        value={selectedPeriod}
                        onChange={onChangePeriod}
                    />
                </Grid>
            </Grid>
        );
        showSelectButton = true;
    }

    let footerModal: JSX.Element | undefined;
    if (showSelectButton) {
        footerModal = (
            <Button
                disabled={disableSelect}
                id={'btnSelectPeriod'}
                onClick={onSelect}
            >
                {resources.btnSelectPeriod}
            </Button>
        );
    }

    return (
        <Modal
            id="periodsModal"
            header={resources.lblPeriodModalTitle}
            footer={footerModal}
            open={open}
            onClose={onClose}
        >
            <Grid container spacing={3}>
                {termsOpen}
            </Grid>
            {termsNoOpen}
        </Modal>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(PeriodsModal);