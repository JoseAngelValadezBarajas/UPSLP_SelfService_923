const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const commonEntries = [];
const colors = require('colors');
const clientBundleInputViewsDir = './ClientApp/Components/';
const moduleName = 'Admissions';
console.log(colors.magenta(`${moduleName} Module: ${new Date()}`));

module.exports = (env, argv) => {
    return merge(common(env, argv), {
        entry: {
            Applications: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/Applications/ApplicationsView`),
            ApplicationForm: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/ApplicationForm/ApplicationFormView`),
            Inquiries: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/Inquiries/InquiriesView`),
            InquiryForm: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/InquiryForm/InquiryFormView`),
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