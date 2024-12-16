const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const commonEntries = [];
const colors = require('colors');
const clientBundleInputViewsDir = './ClientApp/Components/';
const moduleName = 'Administration';
console.log(colors.magenta(`${moduleName} Module: ${new Date()}`));

module.exports = (env, argv) => {
    return merge(common(env, argv), {
        entry: {
            ApplicationSetup: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/FormsSetup/ApplicationSetupView`),
            ConEdSetup: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/ConEdSetup/ConEdSetupView`),
            DonationsSetup: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/DonationsSetup/DonationsSetupView`),
            FormsSetup: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/FormsSetup/FormsSetupView`),
            GeneralSetup: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/GeneralSetup/GeneralSetupView`),
            InquirySetup: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/FormsSetup/InquirySetupView`),
            InstructorSetup: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/InstructorSetup/InstructorSetupView`),
            NotificationsSetup: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/NotificationsSetup/NotificationsSetupView`),
            ProfileSetup: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/ProfileSetup/ProfileSetupView`),
            RequestsSetup: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/RequestsSetup/RequestsSetupView`),
            StudentSetup: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/StudentSetup/StudentSetupView`),
            WebsiteSetup: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/WebsiteSetup/WebsiteSetupView`)
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