/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IPreferredName.ts */

import { IPreferredNameMain } from './IPreferredNameMain';
import { IPreferredNameSettings } from './IPreferredNameSettings';

export interface IPreferredName {
    genderIdentity: IPreferredNameMain;
    settings: IPreferredNameSettings;
}