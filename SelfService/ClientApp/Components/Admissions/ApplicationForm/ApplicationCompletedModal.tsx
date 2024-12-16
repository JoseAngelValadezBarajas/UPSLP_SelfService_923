/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ApplicationCompletedModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import { IApplicationHandler } from '../../../Types/Resources/Admissions/IApplicationFormResources';
import FieldsGroupHandler from './FieldsGroupHandler';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IFieldsGroup } from '../../../Types/Form/IFieldsGroup';
import { IPaymentTransaction } from '../../../Types/Payment/IPaymentTransaction';
// #endregion

// #region Internal types
export interface IApplicationCompletedModalProps {
    dateTimeCulture: string;
    failedPayment: boolean;
    fieldGroup?: IFieldsGroup;
    paymentTransaction?: IPaymentTransaction;
    shortDatePattern: string;
    successPayment: boolean;

    onAddMore: (fieldGroup: IFieldsGroup, stepIndex: number, fieldGroupIndex: number) => void;
    onChangeCheckBox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeDateTimeField: (date: string, id: string, isValid: boolean) => void;
    onChangeDropDown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeListCheckbox: (event: any) => void;
    onChangeRadioGroup: (event: React.ChangeEvent<any>, value: string) => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClickButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onCloseFailedPayment: (event: React.MouseEvent<HTMLButtonElement>) => void;

    resourcesApplicationHandler: IApplicationHandler;
}

const styles = createStyles({
    containerDetails: {
        backgroundColor: Tokens.colorBrandNeutral200,
        padding: Tokens.spacing50
    }
});

type PropsWithStyles = IApplicationCompletedModalProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const ApplicationCompletedModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        dateTimeCulture,
        failedPayment,
        fieldGroup,
        paymentTransaction,
        shortDatePattern,
        successPayment,

        onAddMore,
        onChangeCheckBox,
        onChangeDateTimeField,
        onChangeDropDown,
        onChangeListCheckbox,
        onChangeRadioGroup,
        onChangeTextField,
        onClickButton,
        onCloseFailedPayment,

        resourcesApplicationHandler
    } = props;

    let footerModal: JSX.Element;
    footerModal = (
        <ButtonGroup id="btgFailedPayment">
            <Button
                id={'btnOk'}
                onClick={onCloseFailedPayment}
            >
                {resourcesApplicationHandler.btnOk}
            </Button>
        </ButtonGroup>
    );

    const bodyModal: JSX.Element[] = [];
    if (fieldGroup) {
        bodyModal.push(
            <Grid container spacing={3} key={`fieldGroupModal|${fieldGroup.label}`}>
                {failedPayment ?
                    (
                        <Grid item xs={12}>
                            <Text>
                                {resourcesApplicationHandler.lblContentTextApplication}
                            </Text>
                        </Grid>
                    ) :
                    successPayment && paymentTransaction ?
                        (
                            <Grid container>
                                <Grid item xs>
                                    <div className={classes.containerDetails}>
                                        <Text size="large">
                                            {resourcesApplicationHandler.lblTitleDetails}
                                        </Text>
                                        <Divider />
                                        <Grid container>
                                            <Grid item xs>
                                                <Text align="right">
                                                    {resourcesApplicationHandler.lblAmount}
                                                </Text>
                                            </Grid>
                                            <Grid item xs>
                                                <Text>
                                                    {paymentTransaction.amount}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs>
                                                <Text align="right">
                                                    {resourcesApplicationHandler.lblDescription}
                                                </Text>
                                            </Grid>
                                            <Grid item xs>
                                                <Text>
                                                    {paymentTransaction.description}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs>
                                                <Text align="right">
                                                    {resourcesApplicationHandler.lblAuthorizationCode}
                                                </Text>
                                            </Grid>
                                            <Grid item xs>
                                                <Text>
                                                    {paymentTransaction.authorizationNumber}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Grid>
                            </Grid>
                        ) :
                        undefined
                }
                {!failedPayment ?
                    (
                        <Grid item xs={12}>
                            <FieldsGroupHandler
                                dateTimeCulture={dateTimeCulture}
                                fieldGroup={fieldGroup}
                                fieldGroupIndex={1}
                                isExpansionPanel={fieldGroup.isExpansionPanel}
                                isHorizontalAligned={fieldGroup.isHorizontalAligned}
                                stepIndex={1}
                                resources={resourcesApplicationHandler}
                                onAddMore={onAddMore}
                                shortDatePattern={shortDatePattern}
                                onChangeCheckBox={onChangeCheckBox}
                                onChangeDateTimeField={onChangeDateTimeField}
                                onChangeDropDown={onChangeDropDown}
                                onChangeListCheckbox={onChangeListCheckbox}
                                onChangeRadioGroup={onChangeRadioGroup}
                                onChangeTextField={onChangeTextField}
                                onClickButton={onClickButton}
                            />
                        </Grid>
                    ) : undefined}
            </Grid>
        );
    }

    return (
        <Modal
            id="applicationCompleteModal"
            header={fieldGroup ? fieldGroup.label : undefined}
            footer={failedPayment ? footerModal : undefined}
            maxWidth="md"
            open={true}
            showTitleBarClose={false}
        >
            {bodyModal}
        </Modal>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(ApplicationCompletedModal);