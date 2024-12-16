/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IMyTasks.ts */

import { IMyTasksDetail } from "./IMyTasksDetial";

export interface IMyTasks {
    category: number;
    expanded: boolean;
    myTasks: IMyTasksDetail[];
    overallCount: number;
}