/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AppIconSetup.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IAppTextSetupResources } from '../../../Types/Resources/Administration/IApplicationSetupResources';
// #endregion Imports

// #region Types
export interface IAppIconSetupProps {
    emptyId: boolean;
    emptyLabel: boolean;
    textActionUrl?: string;
    textId?: string;
    textLabel?: string;

    onChangeTextField: (event: any) => void;

    resources: IAppTextSetupResources;
}
// #endregion Types

// #region Component
const AppTextSetup: React.FC<IAppIconSetupProps> = (props: IAppIconSetupProps): JSX.Element => {
    const {
        emptyId,
        emptyLabel,
        textActionUrl,
        textId,
        textLabel,

        onChangeTextField,

        resources
    } = props;

    let content: JSX.Element | undefined;
    content = (
        <>
            {textId !== 'finishId' ?
                (
                    <Grid item xs={12} md={12}>
                        <TextField
                            error={emptyId}
                            helperText={emptyId ?
                                resources.lblEnterId : ''}
                            id="txtTextId"
                            label={resources.lblId}
                            required={true}
                            type="text"
                            value={textId || ''}
                            onChange={onChangeTextField}
                        />
                    </Grid>
                ) :
                undefined}
            <Grid item xs={12} md={12}>
                <TextField
                    error={emptyLabel}
                    helperText={emptyLabel ?
                        resources.lblEnterLabel : ''}
                    id="txtTextLabel"
                    label={resources.lblLabel}
                    multiline
                    required={true}
                    type="text"
                    value={textLabel || ''}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <TextField
                    id="txtTextActionUrl"
                    label={resources.lblActionUrl}
                    multiline
                    type="text"
                    value={textActionUrl || ''}
                    onChange={onChangeTextField}
                />
            </Grid>
        </>
    );

    return (
        <>
            {content}
        </>
    );
};
// #endregion Component

// Export: Component
export default AppTextSetup;