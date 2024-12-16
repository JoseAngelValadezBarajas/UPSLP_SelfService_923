/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File:ChangeActivitiesModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import RadioGroup from '@hedtech/powercampus-design-system/react/core/RadioGroup';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IRadioOption } from '@hedtech/powercampus-design-system/types/IRadioOption';
import { IActivitiesSetup } from '../../../Types/Section/IActivitiesSetup';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, WithStyles, withStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion

// #region Internal types
export interface IChangeActivitiesModalProps {
    weightType: IActivitiesSetup;
    open: boolean;
    resources: IChangeActivitiesModalResProps;
    onChangeRadio?: (event: React.ChangeEvent<{}>, value: string) => void;
    onCheckboxChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClickChange: () => void;
    onClose: () => void;
}

export interface IChangeActivitiesModalResProps {
    btnChange: string;
    lblByPossiblePoints: string;
    lblEnterForEachActivity: string;
    lblEqually: string;
    lblHowToWeight: string;
    lblWeightByType: string;
}

const styles = () => createStyles({
    font: {
        '& > span:nth-child(2)': {
            fontSize: Tokens.fontSizeHeader4,
            fontWeight: Tokens.fontWeightBold
        }
    },
    marginLeft: {
        marginLeft: Tokens.sizingSmall
    }
});

type PropsWithStyles = IChangeActivitiesModalProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const ChangeActivitiesModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        open,
        resources,
        weightType,
        onChangeRadio,
        onCheckboxChange,
        onClickChange,
        onClose
    } = props;

    const weightRadioOptions: IRadioOption[] = [];
    weightRadioOptions.push(
        { description: resources.lblByPossiblePoints, value: 1 },
        { description: resources.lblEqually, value: 3 },
        { description: resources.lblEnterForEachActivity, value: 2 }
    );

    return (
        <Modal
            disableHeaderTypography
            id="changeActivitiesModal"
            header={(
                <>
                    <Text size="h2">
                        {resources.lblHowToWeight}
                    </Text>
                    <Divider />
                </>
            )}
            footer={(
                <Button
                    id="btnChange"
                    onClick={onClickChange}
                >
                    {resources.btnChange}
                </Button>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Grid container>
                <Grid item xs={12} sm={12} md={8}>
                    <RadioGroup
                        id={'rdgActivitiesWeight'}
                        key={'rdgActivitiesWeight'}
                        options={weightRadioOptions}
                        value={weightType ? String(weightType.weightMethod) : '1'}
                        onChange={onChangeRadio}
                    />
                </Grid>
            </Grid>
            <Divider />
            <br />
            <Grid container>
                <Grid item xs={12} sm={12} md={8} className={classes.marginLeft}>
                    <Checkbox
                        className={classes.font}
                        id="chkWeightByType"
                        checked={weightType.isWeightByType}
                        label={resources.lblWeightByType}
                        onChange={onCheckboxChange}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion

export default withStyles(styles)(ChangeActivitiesModal);