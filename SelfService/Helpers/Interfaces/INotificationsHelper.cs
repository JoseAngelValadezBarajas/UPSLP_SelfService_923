// --------------------------------------------------------------------
// <copyright file="INotificationsHelper.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using SelfService.Models.Account;
using SelfService.Models.Enum;
using SelfService.Models.Notifications;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SelfService.Helpers.Interfaces
{
    /// <summary>
    /// The Notifications Helper interface.
    /// </summary>
    public interface INotificationsHelper
    {
        /// <summary>
        /// Creates the specified notification event.
        /// </summary>
        /// <param name="notificationEvent">The notification event.</param>
        void Create(NotificationEventModel notificationEvent);

        /// <summary>
        /// Creates the event setup asynchronous.
        /// </summary>
        /// <param name="notificationSetupViewModel">The notification setup view model.</param>
        /// <returns></returns>
        Task<bool> CreateEventSetupAsync(NotificationSetupViewModel notificationSetupViewModel);

        /// <summary>
        /// Events the is active asynchronous.
        /// </summary>
        /// <param name="eventKey">The event key.</param>
        /// <returns></returns>
        Task<bool> EventIsActiveAsync(string eventKey);

        /// <summary>
        /// Gets the event asynchronous.
        /// </summary>
        /// <param name="eventId">The event identifier.</param>
        /// <returns></returns>
        Task<NotificationEventModel> GetEventAsync(int eventId);

        /// <summary>
        /// Gets the events asynchronous.
        /// </summary>
        /// <param name="application">The application.</param>
        /// <returns></returns>
        Task<List<NotificationEventModel>> GetEventsAsync(NotificationApplication application);

        /// <summary>
        /// Gets the event setup asynchronous.
        /// </summary>
        /// <param name="eventId">The event identifier.</param>
        /// <param name="typeId">The type identifier.</param>
        /// <returns></returns>
        Task<NotificationSetupModel> GetEventSetupAsync(int eventId, int typeId);

        /// <summary>
        /// Gets the person notification tokens by person identifier.
        /// </summary>
        /// <param name="peopleService">The people service.</param>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        List<NotificationToken> GetPersonNotificationTokensByPersonId(IPeopleService peopleService, int personId);

        /// <summary>
        /// Gets the person notification tokens by username.
        /// </summary>
        /// <param name="peopleService">The people service.</param>
        /// <param name="temporaryUserService">The temporary user service.</param>
        /// <param name="username">The username.</param>
        /// <returns></returns>
        List<NotificationToken> GetPersonNotificationTokensByUserName(IPeopleService peopleService, ITemporaryUserService temporaryUserService, string username);

        /// <summary>
        /// Gets the types asynchronous.
        /// </summary>
        /// <returns></returns>
        Task<List<NotificationTypeModel>> GetTypesAsync();

        /// <summary>
        /// Determines whether [is notification enabled].
        /// </summary>
        /// <returns>
        ///   <c>true</c> if [is notification enabled]; otherwise, <c>false</c>.
        /// </returns>
        bool IsNotificationEnabled();

        /// <summary>
        /// Sends the the change password notification.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <param name="userPassword">The user password.</param>
        /// <param name="userEmail">The user email.</param>
        /// <param name="personId">The person id.</param>
        /// <returns></returns>
        Task<bool> SendAsync(string userName, string userPassword, string userEmail, int personId);

        /// <summary>
        /// Sends the invitation notification asynchronous.
        /// </summary>
        /// <param name="studentId">The student identifier.</param>
        /// <param name="relativeId">The relative identifier.</param>
        /// <param name="invitation">The invitation.</param>
        /// <param name="confirmationUrl">The confirmation URL.</param>
        /// <param name="expiryDate">The expiry date.</param>
        /// <param name="email">The email.</param>
        Task SendAsync(int studentId, int relativeId, InvitationStatus invitation, string confirmationUrl, string expiryDate, string email);

        /// <summary>
        /// Sends the creates the account notification asynchronous.
        /// </summary>
        /// <param name="account">The account.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="eventName">Name of the event.</param>
        /// <returns></returns>
        Task<bool> SendAsync(IdentityAccountViewModel account, string userName, string eventName);

        /// <summary>
        /// Updates the event.
        /// </summary>
        /// <param name="notificationEventUpdate">The notification event update.</param>
        /// <returns></returns>
        Task<bool> UpdateEventAsync(NotificationEventUpdate notificationEventUpdate);
    }
}