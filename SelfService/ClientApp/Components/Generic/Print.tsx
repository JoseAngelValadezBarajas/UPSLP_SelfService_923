/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: Print.tsx
 * Type: Presentation component */

// #region Imports
import React, { useState } from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Snackbar from '@hedtech/powercampus-design-system/react/core/Snackbar';

// Types
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IPrintResources } from '../../Types/Resources/Generic/IPrintResources';

// #endregion Imports

// #region Types
export interface IPrintProps {
    classNameButtonText?: string;
    classNameIconButton?: string;
    disabled?: boolean;
    lblPrint?: string;
    link: string;
    resources: IPrintResources;
}
// #endregion Types

// #region Component
const Print: React.FC<IPrintProps> = (props: IPrintProps): JSX.Element => {
    const {
        classNameButtonText,
        classNameIconButton,
        disabled,
        lblPrint,
        link,
        resources
    } = props;

    const [open, setOpen] = useState(false);

    const onClickPrint = () => {
        setOpen(!open);
        window.location.assign(link);
    };

    const onClose = () => {
        setOpen(!open);
    };

    return (
        <>
            <Hidden smDown>
                <Button
                    TextProps={{
                        display: 'inline',
                    }}
                    IconProps={{
                        name: 'print'
                    }}
                    align="left"
                    className={classNameButtonText}
                    disabled={disabled}
                    id="lnkPrint"
                    textVariantStyling="inherit"
                    variant="text"
                    onClick={onClickPrint}
                >
                    {lblPrint ? lblPrint : resources.lblPrint}
                </Button>
            </Hidden>
            <Hidden mdUp>
                <IconButton
                    aria-label={lblPrint ? lblPrint : resources.lblPrint}
                    className={classNameIconButton}
                    color="secondary"
                    disabled={disabled}
                    id="lnkPrint"
                    onClick={onClickPrint}
                >
                    <Icon large name="print" />
                </IconButton>
            </Hidden>
            <Snackbar
                ContentProps={{
                    'aria-describedby': 'pageSnackbar_Message'
                }}
                message={(
                    <span id="pageSnackbar_Message">
                        {resources.lblPrintProcess}
                    </span>
                )}
                open={open}
                type={ResultType.success}
                onClose={onClose}
            />
        </>
    );
};
// #endregion Component

// Export: Component
export default Print;