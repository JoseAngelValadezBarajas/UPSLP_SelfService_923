/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ThemePreview.tsx
 * Type: Presentation component */

// #region Imports
import React, { useState } from 'react';

// Core components
import Application from '@hedtech/powercampus-design-system/react/core/Application';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import RadioGroup from '@hedtech/powercampus-design-system/react/core/RadioGroup';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import createEDSTheme from '@hedtech/powercampus-design-system/react/core/themes/createEDSTheme';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Tokens, { CtaColors } from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { ITheme } from '@hedtech/powercampus-design-system/types/ITheme';
import { IThemeValidations } from '../../../Types/Theme/IThemeValidations';
// #endregion

// #region Internal types
export interface IThemePreviewProps {
    defaultBackground: string;
    defaultFavicon: string;
    defaultLogo: string;
    resources: IThemePreviewResProps;
    themeSettings: ITheme;
    themeValidations: IThemeValidations;
}

export interface IThemePreviewResProps {
    lblDashboard: string;
    lblNoCards: string;
    lblPreview: string;
    lblPrimaryButton: string;
    lblSecondaryButton: string;
    lblSelfService: string;
    lblSignIn: string;
}

const styles = createStyles({
    previewBar: {
        borderBottom: `${Tokens.borderWidthThickest} solid ${Tokens.colorBrandNeutral100}`,
        height: Tokens.heightHeaderBar,
        maxHeight: Tokens.heightHeaderBar,
        minHeight: Tokens.heightHeaderBar,
        width: Tokens.widthFluid
    },
    previewBrowserBar: {
        borderBottom: `${Tokens.borderWidthThick} solid ${Tokens.colorBrandNeutral300}`
    },
    previewContainer: {
        display: 'flex',
        flexFlow: 'column nowrap',
        height: '460px',
        minWidth: '200px',
        width: Tokens.widthFluid
    },
    previewContent: {
        backgroundPosition: 'top',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: Tokens.heightFluid,
        overflowX: 'hidden',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
    },
    previewContentDashboard: {
        padding: `${Tokens.spacing60} ${Tokens.spacing60} ${Tokens.spacing30} ${Tokens.spacing60}`,
    },
    previewContentNoCards: {
        height: Tokens.heightFluid,
        padding: `0 ${Tokens.spacing30}`,
        overflowX: 'hidden'
    },
    previewContentSignIn: {
        padding: `${Tokens.spacing60} ${Tokens.spacing30} ${Tokens.spacing30} ${Tokens.spacing30}`,
    },
    previewElementLong: {
        backgroundColor: Tokens.colorBrandNeutral300,
        borderRadius: Tokens.borderRadiusMedium,
        display: 'inline-block',
        height: Tokens.sizingXSmall,
        marginBottom: Tokens.spacing30,
        marginRight: Tokens.spacing30,
        width: Tokens.widthFluid
    },
    previewElementLongThick: {
        backgroundColor: Tokens.colorBrandNeutral300,
        borderRadius: Tokens.borderRadiusMedium,
        display: 'inline-block',
        height: Tokens.sizingMedium,
        marginBottom: Tokens.spacing30,
        marginRight: Tokens.spacing30,
        width: Tokens.widthFluid
    },
    previewElementShort: {
        backgroundColor: Tokens.colorBrandNeutral300,
        borderRadius: Tokens.borderRadiusMedium,
        display: 'inline-block',
        height: Tokens.sizingXSmall,
        marginBottom: Tokens.spacing30,
        marginRight: Tokens.spacing30,
        width: '50%'
    },
    previewFavicon: {
        height: Tokens.sizingSmall,
        margin: Tokens.spacing30,
        marginTop: Tokens.spacing35,
        width: Tokens.sizingSmall
    },
    previewFaviconContainer: {
        alignItems: 'center',
        backgroundColor: Tokens.colorBrandNeutral200,
        borderTopRightRadius: Tokens.borderRadiusLarge,
        display: 'flex',
        width: Tokens.layout70
    },
    previewLogo: {
        height: Tokens.heightFluid
    },
    previewLogoAlone: {
        height: '3.75rem',
        padding: Tokens.spacing40
    },
    previewLogoContent: {
        height: '3.75rem',
        padding: Tokens.spacing40
    }
});

type PropsWithStyles = IThemePreviewProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const ThemePreview: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        defaultBackground,
        defaultFavicon,
        defaultLogo,
        resources,
        themeSettings,
        themeValidations
    } = props;

    const [previewOption, setPreviewOption] = useState('0');

    const newTheme: any = createEDSTheme('light');
    newTheme.palette.ctaColor = themeSettings.actionColor ? CtaColors[themeSettings.actionColor] : Tokens.colorCtaBlueActive;
    newTheme.palette.primary.main = themeSettings.primaryColor && !themeValidations.primaryColorError ? themeSettings.primaryColor.toUpperCase() : Tokens.colorBrandPrimary;
    newTheme.palette.secondary.main = themeSettings.secondaryColor && !themeValidations.secondaryColorError ? themeSettings.secondaryColor.toUpperCase() : Tokens.colorBrandSecondary;
    const gradient: string = 'linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.65) 100%), ';
    const gradientImage: string = themeSettings.backgroundUrl ? gradient : '';
    const imageUrl: string = themeSettings.backgroundUrl ? themeSettings.backgroundUrl : defaultBackground;

    return (
        <>
            <Grid container>
                <Grid item xs>
                    <Text size="h2">
                        {resources.lblPreview}
                    </Text>
                    <Divider noMarginBottom />
                </Grid>
            </Grid>
            <Grid container direction="row-reverse" spacing={0}>
                <Grid item xs>
                    <RadioGroup
                        id="rbgPreviewOptions"
                        isRowAligned
                        name="ThemePreviewOptions"
                        options={[{
                            description: resources.lblNoCards,
                            value: '0'
                        },
                        {
                            description: resources.lblSignIn,
                            value: '1'
                        },
                        {
                            description: resources.lblDashboard,
                            value: '2'
                        }
                        ]}
                        value={previewOption}
                        onChange={(_event, value) => setPreviewOption(value)}
                    />
                </Grid>
            </Grid>
            <Application theme={newTheme}>
                <div className={classes.previewContainer}>
                    <div
                        className={classes.previewBrowserBar}
                    >
                        <div
                            className={classes.previewFaviconContainer}
                        >
                            <div>
                                <img
                                    alt={'favicon'}
                                    className={classes.previewFavicon}
                                    src={themeSettings.faviconUrl ? themeSettings.faviconUrl : defaultFavicon}
                                />
                            </div>
                            <div>
                                <Text
                                    display="inline"
                                    size="small"
                                >
                                    {resources.lblSelfService}
                                </Text>
                            </div>
                        </div>
                    </div>
                    <div
                        className={classes.previewBar}
                        style={{
                            backgroundColor: Tokens.colorBrandNeutral100,
                            borderColor: themeSettings.secondaryColor
                        }}
                    >
                        {themeSettings.primaryColor.toUpperCase() === Tokens.colorBrandPrimary ? (
                            <div
                                className={classes.previewLogoContent}
                                style={{
                                    backgroundColor: themeSettings.primaryColor
                                }}
                            >
                                <img
                                    alt={themeSettings.logoAlternateText}
                                    className={classes.previewLogo}
                                    src={themeSettings.logoUrl ? themeSettings.logoUrl : defaultLogo}
                                />
                            </div>
                        ) : (
                                <img
                                    alt={themeSettings.logoAlternateText}
                                    className={classes.previewLogoAlone}
                                    style={{
                                        backgroundColor: themeSettings.primaryColor
                                    }}
                                    src={themeSettings.logoUrl ? themeSettings.logoUrl : defaultLogo}
                                />
                            )}
                    </div>
                    <div
                        className={classes.previewContent}
                        style={{
                            backgroundImage: `${gradientImage}url(${imageUrl})`
                        }}
                    >
                        {previewOption === '0' && (
                            <Grid container className={classes.previewContentNoCards} alignItems="flex-end">
                                <Grid item xs={12}>
                                    <ButtonGroup id="btgExampleButtons">
                                        <Button aria-disabled="true"  id="btnPrimaryExample" >
                                            {resources.lblPrimaryButton}
                                        </Button>
                                        <Button
                                            aria-disabled="true"
                                            color="secondary"
                                            id="btnSecondaryExample"
                                        >
                                            {resources.lblSecondaryButton}
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                            </Grid>
                        )}
                        {previewOption === '1' && (
                            <Grid container className={classes.previewContentSignIn} alignItems="flex-end">
                                <Grid item xs={12}>
                                    <Grid container justifyContent="center">
                                        <Grid item xs={8} lg={6}>
                                            <Card>
                                                <CardContent>
                                                    <Grid container justifyContent="center">
                                                        <Grid item xs={6}>
                                                            <div className={classes.previewElementLong} />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container>
                                                        <Grid item xs>
                                                            <div className={classes.previewElementLongThick} />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container justifyContent="flex-end">
                                                        <Grid item>
                                                            <Button aria-disabled="true" id="btnPrimaryExample">
                                                                {resources.lblPrimaryButton}
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                        {previewOption === '2' && (
                            <Grid container className={classes.previewContentDashboard} spacing={5}>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs>
                                            <Card>
                                                <CardContent>
                                                    <div className={classes.previewElementShort} />
                                                    <div className={classes.previewElementLong} />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs>
                                            <Card>
                                                <CardContent>
                                                    <div className={classes.previewElementShort} />
                                                    <div className={classes.previewElementLong} />
                                                    <div className={classes.previewElementLong} />
                                                    <div className={classes.previewElementLong} />
                                                    <div className={classes.previewElementLong} />
                                                    <div className={classes.previewElementLong} />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs>
                                            <Card accent="secondary">
                                                <CardContent>
                                                    <div className={classes.previewElementShort} />
                                                    <div className={classes.previewElementLong} />
                                                    <div className={classes.previewElementLong} />
                                                    <div className={classes.previewElementLong} />
                                                    <div className={classes.previewElementLong} />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </div>
                </div>
            </Application>
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(ThemePreview);