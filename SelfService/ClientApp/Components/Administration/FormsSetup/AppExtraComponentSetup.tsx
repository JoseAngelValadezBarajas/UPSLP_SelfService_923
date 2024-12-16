/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AppExtraComponentSetup.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IAppExtraComponentSetupResources } from '../../../Types/Resources/Administration/IApplicationSetupResources';
// #endregion Imports

// #region Types
export interface IAppExtraComponentSetupProps {
    emptyAlt: boolean;
    emptyId: boolean;
    emptyLabel: boolean;
    emptySrc: boolean;
    isHtlmElement: boolean;
    isImage: boolean;
    textId?: string;
    textSrc?: string;
    textAlt?: string;
    textLabel?: string;

    onChangeTextField: (event: any) => void;

    resources: IAppExtraComponentSetupResources;
}
// #endregion Types

// #region Component
const AppExtraComponentSetup: React.FC<IAppExtraComponentSetupProps> = (props: IAppExtraComponentSetupProps): JSX.Element => {
    const {
        emptyAlt,
        emptyId,
        emptyLabel,
        emptySrc,
        isHtlmElement,
        isImage,
        textId,
        textSrc,
        textAlt,
        textLabel,

        onChangeTextField,

        resources
    } = props;

    let image: JSX.Element | undefined;
    if (isImage) {
        image = (
            <>
                <Grid item xs={12} md={12}>
                    <TextField
                        error={emptySrc}
                        helperText={emptySrc ?
                            resources.lblEnterSrc : ''}
                        id="txtSrcText"
                        label={resources.lblSrc}
                        required={true}
                        type="text"
                        value={textSrc || ''}
                        onChange={onChangeTextField}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        error={emptyAlt}
                        helperText={emptySrc ?
                            resources.lblEnterAlt : ''}
                        id="txtAltText"
                        label={resources.lblAlt}
                        required={true}
                        type="text"
                        value={textAlt || ''}
                        onChange={onChangeTextField}
                    />
                </Grid>
            </>
        );
    }

    let htmlElement: JSX.Element | undefined;
    if (isHtlmElement) {
        htmlElement = (
            <>
                <Grid item xs={12} md={12}>
                    <TextField
                        error={emptyLabel}
                        helperText={emptyLabel ?
                            resources.lblEnterValue : ''}
                        id="txtTextValue"
                        label={resources.lblValue}
                        multiline
                        required={true}
                        type="text"
                        value={textLabel || ''}
                        onChange={onChangeTextField}
                    />
                </Grid>
            </>
        );
    }

    let content: JSX.Element | undefined;
    content = (
        <>
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
            {image}
            {htmlElement}
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
export default AppExtraComponentSetup;