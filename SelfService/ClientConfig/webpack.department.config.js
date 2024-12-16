const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const commonEntries = [];
const colors = require('colors');
const clientBundleInputViewsDir = './ClientApp/Components/';
const moduleName = 'Department';
console.log(colors.magenta(`${moduleName} Module: ${new Date()}`));

module.exports = (env, argv) => {
    return merge(common(env, argv), {
        entry: {
            CourseManagement: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/CourseManagement/CourseManagementView`),
            SetupApprovals: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/SetupApprovals/SetupApprovalsView`),
            ApproveGrades: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/ApproveGrades/ApproveGradesView`),
            CourseTemplates: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/CourseTemplates/CourseTemplatesView`),
        },

        optimization: {
            splitChunks: {
                cacheGroups: {
                    defaultVendor: {
                        name: `${moduleName}Vendors`
                    }
                }
            }
        }
    });
};