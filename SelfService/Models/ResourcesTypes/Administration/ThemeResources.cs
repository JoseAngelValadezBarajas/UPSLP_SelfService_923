// --------------------------------------------------------------------
// <copyright file="ThemeResources.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.ResourcesTypes.Administration
{
    public class ThemePreview
    {
        public string LblDashboard { get; set; }
        public string LblNoCards { get; set; }
        public string LblPreview { get; set; }
        public string LblPrimaryButton { get; set; }
        public string LblSecondaryButton { get; set; }
        public string LblSelfService { get; set; }
        public string LblSignIn { get; set; }
    }

    public class ThemeResources
    {
        public string[] ActionColors { get; set; }
        public string BtnRestore { get; set; }
        public string BtnSave { get; set; }
        public string LblActionColor { get; set; }
        public string LblActionColorRequired { get; set; }
        public string LblBackground { get; set; }
        public string LblFavicon { get; set; }
        public string LblHexFormat { get; set; }
        public string LblLogo { get; set; }
        public string LblLogoAlternateText { get; set; }
        public string LblPrimaryColor { get; set; }
        public string LblPrimaryColorRequired { get; set; }
        public string LblSecondaryColor { get; set; }
        public string LblSecondaryColorRequired { get; set; }
        public string LblStudyingColor { get; set; }
        public string LblStudyingColorRequired { get; set; }
        public string LblTeachingColor { get; set; }
        public string LblTeachingColorRequired { get; set; }
        public string LblUrlFormat { get; set; }
        public ThemePreview ThemePreview { get; set; }
    }
}