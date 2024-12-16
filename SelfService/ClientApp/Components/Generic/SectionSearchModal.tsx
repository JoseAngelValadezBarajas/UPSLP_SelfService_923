/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: SectionSearchModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import SectionCard, { ISectionCardResProps } from './SectionCard';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';

// Types
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';
import { ISectionSearch } from '../../Types/Section/ISectionSearch';
// #endregion Imports

// #region Internal types
export interface ISectionSearchModalProps {
    addToCartClaim?: boolean;
    canAddToCart?: (section: ISection, periodIndex: number) => boolean;
    canAddToWaitlist?: (section: ISection, periodIndex: number) => boolean;
    currencySymbol: string;
    impersonateInfo?: IImpersonateInfo;
    isSuccessfulAdded?: boolean;
    numberCulture: string;
    open: boolean;
    resources: ISectionSearchModalResProps;
    sectionId: string;
    sectionIdWildCard: string;
    sections?: ISectionSearch[];
    onAddToCart?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onAddToWaitlist?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClose: () => void;
    onCloseAlert?: () => void;
    onSetPeriodIndex?: (periodIndex: number) => void;
    onViewSectionDetails: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ISectionSearchModalResProps {
    formatTitleModal: string;
    lblNoSectionSearch: string;
    lblSuccessfulAdd: string;
    lblSuccessfulAddStudent: string;
    sectionCard: ISectionCardResProps;
}
// #endregion Internal types

// #region Component
const SectionSearchModal: React.FC<ISectionSearchModalProps> = (props: ISectionSearchModalProps): JSX.Element => {
    const {
        addToCartClaim,
        canAddToCart,
        canAddToWaitlist,
        currencySymbol,
        impersonateInfo,
        isSuccessfulAdded,
        numberCulture,
        open,
        resources,
        sectionId,
        sectionIdWildCard,
        sections,
        onAddToCart,
        onAddToWaitlist,
        onSetPeriodIndex,
        onClose,
        onCloseAlert,
        onViewSectionDetails
    } = props;

    const canAdd: boolean = (impersonateInfo?.personId && addToCartClaim) || !(impersonateInfo?.personId);


    const container: JSX.Element[] | undefined = [];

    if (sections && sections.length > 0) {
        let header: JSX.Element | undefined;
        sections.forEach((sectionPeriod, periodIndex) => {
            header = (
                <Text size="h3">
                    {sectionPeriod.period}
                </Text>
            );
            const callBackSetPeriodIndex = () => {
                if (onSetPeriodIndex) {
                    onSetPeriodIndex(periodIndex);
                }
            };
            const content: JSX.Element[] | undefined = [];
            sectionPeriod.sections.forEach((section, sectionIndex) => {
                content.push(
                    <SectionCard
                        canAddToCart={canAddToCart ?
                            (canAdd && canAddToCart(section, periodIndex))
                            : undefined}
                        canAddToWaitlist={canAddToWaitlist ?
                            (canAdd && canAddToWaitlist(section, periodIndex))
                            : undefined}
                        currencySymbol={currencySymbol}
                        id={`sectionCard_${sectionIndex}`}
                        key={`sectionCard_${sectionIndex}_${section.id}`}
                        numberCulture={numberCulture}
                        resources={resources.sectionCard}
                        section={section}
                        withCard
                        onAddToCart={onAddToCart}
                        onAddToWaitlist={onAddToWaitlist}
                        onBeforeAddToCart={callBackSetPeriodIndex}
                        onBeforeAddToWaitlist={callBackSetPeriodIndex}
                        onViewSectionDetails={onViewSectionDetails}
                    />
                );
            });

            container.push(
                <ExpansionPanel
                    key={`epnlAcademicPlanSectionSearch_${periodIndex}`}
                    header={header}
                    id={`epnlAcademicPlanSectionSearch_${periodIndex}`}
                >
                    {content}
                </ExpansionPanel>
            );

        });
    }
    else {
        container.push(
            <Grid container>
                <Grid item>
                    <Text size="h3">
                        {resources.lblNoSectionSearch}
                    </Text>
                </Grid>
            </Grid>
        );
    }

    return (
        <Modal
            disableHeaderTypography
            id="sectionSearchModal"
            header={(
                <>
                    <Text size="h2">
                        {Format.toString(resources.formatTitleModal, [sectionIdWildCard ? sectionIdWildCard : sectionId])}
                    </Text>
                    <Divider />
                    {isSuccessfulAdded && (
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Alert
                                    id="msgSuccessfulAdd"
                                    open={isSuccessfulAdded}
                                    text={impersonateInfo?.personId ? resources.lblSuccessfulAdd : resources.lblSuccessfulAddStudent}
                                    type={ResultType.success}
                                    userDismissable
                                    onClose={onCloseAlert}
                                />
                            </Grid>
                        </Grid>
                    )}
                </>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            {container}
        </Modal>
    );

};
// #endregion Component

// Export: Component
export default SectionSearchModal;