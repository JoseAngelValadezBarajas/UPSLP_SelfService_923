using System;
using Microsoft.Deployment.WindowsInstaller;
using System.Linq;
using System.Xml.Linq;
using System.IO;

namespace PowerCampus.SelfService.Installer
{
    public class CustomActions
    {
        [CustomAction]
        public static ActionResult UpdateAuthenticationSettings(Session session)
        {
            session.Log("Begin UpdateAuthenticationSettings");

            string xmlPath = session["CustomActionData"];
            xmlPath = Path.Combine(xmlPath, "Config\\AuthenticationSettings.config");

            try
            {
                XDocument xmlDoc = XDocument.Load(xmlPath);

                XElement auth = xmlDoc.Descendants("authenticationSettings").FirstOrDefault();
                XElement loginSettings = auth.Descendants("LoginSettings").FirstOrDefault();

                if (!string.IsNullOrEmpty((string)loginSettings.Attribute("EnablePasswordReset")))
                {
                    loginSettings.Attribute("EnablePasswordReset").Remove();
                }
                if (!string.IsNullOrEmpty((string)loginSettings.Attribute("PasswordResetURL")))
                {
                    loginSettings.Attribute("PasswordResetURL").Remove();
                }
                if (!string.IsNullOrEmpty((string)loginSettings.Attribute("TimeOut")))
                {
                    loginSettings.Attribute("TimeOut").Remove();
                }
                xmlDoc.Save(xmlPath);
            }
            catch (Exception e)
            {
                session.Log(e.ToString());
            }

            return ActionResult.Success;
        }
    }
}
