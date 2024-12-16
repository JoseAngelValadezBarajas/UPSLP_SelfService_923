const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const commonEntries = [];
const colors = require('colors');
const clientBundleInputViewsDir = './ClientApp/Components/';
const moduleName = 'Grades';
console.log(colors.magenta(`${moduleName} Module: ${new Date()}`));

module.exports = (env, argv) => {
    return merge(common(env, argv), {
        entry: {
            UnofficialTranscript: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/UnofficialTranscript/UnofficialTranscriptView`),
            GradeReport: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/GradeReport/GradeReportView`),
            RequestTranscript: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/RequestTranscript/RequestTranscriptView`),
            AlertReport: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/AlertReport/AlertReportView`),
            AttendanceReport: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/AttendanceReport/AttendanceReportView`)
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