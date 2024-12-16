// --------------------------------------------------------------------
// <copyright file="StudentCourseResources.cs" company="Ellucian">
//     Copyright 2019 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

namespace SelfService.Models.Resources
{
    public class StudentCourseResources
    {
        public StudentCourseStatus StudentCourseStatus { get; set; }
    }

    public class StudentCourseStatus
    {
        public string LblDenied { get; set; }
        public string LblInCart { get; set; }
        public string LblInWaitlist { get; set; }
        public string LblPending { get; set; }
        public string LblRegistered { get; set; }
    }
}