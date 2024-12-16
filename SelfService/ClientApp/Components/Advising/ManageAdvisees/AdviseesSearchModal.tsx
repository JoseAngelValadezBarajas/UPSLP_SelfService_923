/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AdviseesSearchModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import RadioGroup from '@hedtech/powercampus-design-system/react/core/RadioGroup';
import Search from '@hedtech/powercampus-design-system/react/core/Search';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IRadioOption } from '@hedtech/powercampus-design-system/types/IRadioOption';
// #endregion

// #region Internal types
export interface IAdviseesSearchModalProps {
    keyword: string;
    listOptions: IRadioOption[];
    listOptionSelected: number;
    open: boolean;
    resources: IAdviseesSearchModalResProps;
    onChangeList: (event: React.ChangeEvent<any>, value: string) => void;
    onChangeTextField: (event: any) => void;
    onClear: () => void;
    onClickApply: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onCloseModal: (modalName: string) => void;
    onOpenModal: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface IAdviseesSearchModalResProps {
    lblAdvancedSearch: string;
    lblApply: string;
    lblFilter: string;
    lblFilterSearch: string;
    lblList: string;
}
// #endregion

// #region Component
const AdviseesSearchModal: React.FC<IAdviseesSearchModalProps> = (props: IAdviseesSearchModalProps): JSX.Element => {
    const {
        keyword,
        listOptions,
        listOptionSelected,
        open,
        resources,
        onChangeList,
        onChangeTextField,
        onClear,
        onClickApply,
        onCloseModal,
        onOpenModal
    } = props;

    const onClose = (): void => {
        onCloseModal('AdviseesSearchModal');
    };

    return (
        <Modal
            footer={(
                <Button
                    id="btnApply"
                    color="secondary"
                    onClick={onClickApply}
                >
                    {resources.lblApply}
                </Button>
            )}
            id="adviseesSearchModal"
            header={resources.lblFilterSearch}
            maxWidth="xs"
            open={open}
            onClose={onClose}
        >
            <Grid container spacing={3}>
                <Grid item xs>
                    <Search
                        id="txtSearchOptions"
                        value={keyword}
                        onChange={onChangeTextField}
                        onClear={onClear}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Link id="lnkAdvancedSearch" onClick={onOpenModal}>
                        <Text color="inherit">
                            {resources.lblAdvancedSearch}
                        </Text>
                    </Link>
                </Grid>
                <br />
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs>
                    <Text size="h2">
                        {resources.lblList}
                    </Text>
                </Grid>
                <br />
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs>
                    <RadioGroup
                        id="rbgAdviseesViews"
                        name="AdviseesView"
                        options={listOptions}
                        value={listOptionSelected.toString()}
                        onChange={onChangeList}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion

export default AdviseesSearchModal;