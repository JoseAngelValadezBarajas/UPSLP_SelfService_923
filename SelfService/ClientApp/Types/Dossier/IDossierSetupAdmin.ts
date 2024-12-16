/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IDossierSetupAdmin.ts */

import { IDossierSetup } from "@hedtech/powercampus-design-system/types/Dossier/IDossierSetup";

export interface IDossierSetupAdmin extends IDossierSetup  {
    isNew?: boolean;
    showOptions?: boolean;
}

export interface IDossierSetupValidations {
    blockNameDuplicated: boolean;
    blockNameModified: boolean;
    displayModeModified: boolean;
    viewNameModified: boolean;
}