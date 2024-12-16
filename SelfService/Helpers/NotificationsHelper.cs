// --------------------------------------------------------------------
// <copyright file="NotificationsHelper.cs" company="Ellucian">
//     Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Administration.Models.Settings;
using Hedtech.PowerCampus.Core.DTO.Constants;
using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Account;
using SelfService.Models.Enum;
using SelfService.Models.Notifications;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace SelfService.Helpers
{
    /// <summary>
    /// NotificationsHelper
    /// </summary>
    public class NotificationsHelper : INotificationsHelper
    {
        #region Private Fields

        /// <summary>
        /// The client factory
        /// </summary>
        private readonly IHttpClientFactory _clientFactory;

        /// <summary>
        /// The HTTP client helper
        /// </summary>
        private readonly IHttpClientHelper _httpClientHelper;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<NotificationsHelper> _logger;

        /// <summary>
        /// The notification settings
        /// </summary>
        private readonly NotificationSettings _notificationSettings;

        /// <summary>
        /// The people service
        /// </summary>
        private readonly IPeopleService _peopleService;

        /// <summary>
        /// The temporary user service
        /// </summary>
        private readonly ITemporaryUserService _temporaryUserService;

        #endregion Private Fields

        /// <summary>
        /// Initializes a new instance of the <see cref="NotificationsHelper"/> class.
        /// </summary>
        /// <param name="clientFactory">The client factory.</param>
        /// <param name="httpClientHelper">The HTTP client helper.</param>
        /// <param name="notificationSettings">The notification settings.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="temporaryUserService">The temporary user service.</param>
        /// <param name="logger">The logger.</param>
        public NotificationsHelper(
            IHttpClientFactory clientFactory,
            IHttpClientHelper httpClientHelper,
            IOptions<NotificationSettings> notificationSettings,
            IPeopleService peopleService,
            ITemporaryUserService temporaryUserService,
            IAppLogger<NotificationsHelper> logger) : base()
        {
            _clientFactory = clientFactory;
            _httpClientHelper = httpClientHelper;
            _notificationSettings = notificationSettings.Value;
            _peopleService = peopleService;
            _temporaryUserService = temporaryUserService;

            _logger = logger;
        }

        /// <summary>
        /// Creates the notification.
        /// </summary>
        /// <param name="notificationEvent">The notification event.</param>
        public void Create(NotificationEventModel notificationEvent)
        {
            try
            {
                _ = SendRequest(HttpMethod.Post, "api/notifications", notificationEvent);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, exception.Message, exception);
            }
        }

        /// <summary>
        /// Gets the person notification tokens.
        /// </summary>
        /// <param name="peopleService">The people service.</param>
        /// <param name="personId">The person identifier.</param>
        /// <returns></returns>
        public List<NotificationToken> GetPersonNotificationTokensByPersonId(IPeopleService peopleService, int personId)
        {
            try
            {
                People person = _peopleService.Get(personId);
                return GetPersonNotificationTokensList(person);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, exception.Message, exception);
                throw;
            }
        }

        /// <summary>
        /// Gets the person notification tokens by user name.
        /// </summary>
        /// <param name="peopleService">The people service.</param>
        /// <param name="temporaryUserService">The temporary user service.</param>
        /// <param name="username">The username.</param>
        /// <returns></returns>
        public List<NotificationToken> GetPersonNotificationTokensByUserName(IPeopleService peopleService, ITemporaryUserService temporaryUserService, string username)
        {
            try
            {
                int personId = _peopleService.GetPersonId(username);
                People person = null;
                TemporaryUser temporaryUser = null;
                if (personId > 0)
                    person = _peopleService.Get(personId);
                else
                    temporaryUser = _temporaryUserService.Get(username);
                if (person != null && !string.IsNullOrEmpty(person.Email))
                    return GetPersonNotificationTokensList(person);

                return temporaryUser != null && !string.IsNullOrEmpty(temporaryUser.Email)
                    ? GetTemporaryUserNotificationTokensList(temporaryUser)
                    : new List<NotificationToken>();
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, exception.Message, exception);
                throw;
            }
        }

        /// <summary>
        /// Determines whether [is notification enabled].
        /// </summary>
        /// <returns>
        ///   <c>true</c> if [is notification enabled]; otherwise, <c>false</c>.
        /// </returns>
        public bool IsNotificationEnabled()
        {
            bool isEnabled = true;
            if (_notificationSettings != null)
            {
                if (Convert.ToBoolean(_notificationSettings.Enabled))
                {
                    if (string.IsNullOrEmpty(_notificationSettings.Token))
                    {
                        _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, "NotificationSettings configuration. Missing Token");
                        isEnabled = false;
                    }
                }
                else
                {
                    _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, "NotificationSettings configuration, it is not enabled");
                    isEnabled = false;
                }
            }
            return isEnabled;
        }

        /// <summary>
        /// Updates the event.
        /// </summary>
        /// <param name="notificationEventUpdate">The notification event update.</param>
        /// <returns></returns>
        public Task<bool> UpdateEventAsync(NotificationEventUpdate notificationEventUpdate)
        {
            try
            {
                return SendRequest(HttpMethod.Put, "api/notification-events", notificationEventUpdate);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, exception.Message, exception);
                throw;
            }
        }

        #region Notification Event Setup

        /// <summary>
        /// Creates the event setup.
        /// </summary>
        /// <param name="notificationSetupViewModel">The notification setup view model.</param>
        /// <returns></returns>
        public async Task<bool> CreateEventSetupAsync(NotificationSetupViewModel notificationSetupViewModel)
        {
            bool resultStatus = false;
            NotificationEventModel notificationEvent = ToNotificationEvent(notificationSetupViewModel);
            try
            {
                string apiUrl = "api/notifications-setup";
                if (notificationSetupViewModel.NotificationSetupId == 0)
                    resultStatus = await SendRequest(HttpMethod.Post, apiUrl, notificationEvent);
                else
                    resultStatus = await SendRequest(HttpMethod.Put, apiUrl, notificationEvent);
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, exception.Message, exception);
            }
            return resultStatus;
        }

        /// <summary>
        /// Gets the event setup asynchronous.
        /// </summary>
        /// <param name="eventId">The event identifier.</param>
        /// <param name="typeId">The type identifier.</param>
        /// <returns></returns>
        public async Task<NotificationSetupModel> GetEventSetupAsync(int eventId, int typeId)
        {
            NotificationSetupModel notificationSetup = new();
            try
            {
                string apiUrl = "api/notifications-setup?eventId=" + eventId.ToString() + "&typeId=" + typeId.ToString();
                notificationSetup = JsonConvert.DeserializeObject<NotificationSetupModel>(await GetRequestResponseAsync(apiUrl));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, exception.Message, exception);
            }
            return notificationSetup;
        }

        #endregion Notification Event Setup

        #region Async Methods

        /// <summary>
        /// Verify if the event is active and has any setup
        /// </summary>
        /// <param name="eventKey">The event key.</param>
        /// <returns></returns>
        public async Task<bool> EventIsActiveAsync(string eventKey)
        {
            bool isActive = false;
            try
            {
                if (IsNotificationEnabled())
                {
                    NotificationEventModel notificationEvent;
                    string apiUrl = "api/notification-events?eventKey=" + eventKey;
                    notificationEvent = JsonConvert.DeserializeObject<NotificationEventModel>(await GetRequestResponseAsync(apiUrl));
                    if (notificationEvent != null && notificationEvent.IsActive)
                    {
                        if (notificationEvent.NotificationSetup?.Count <= 0)
                            _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, "Notification Setup is missing: " + eventKey);
                        else if (notificationEvent.NotificationSetup.FindAll(x => !x.IsActive).Count > 0)
                            _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, "Notification Setup is not active: " + eventKey);
                        else
                            isActive = true;
                    }
                    else
                        _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, "Notification is not Active: " + eventKey);
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, exception.Message, exception);
            }
            return isActive;
        }

        /// <summary>
        /// Gets the event asynchronous.
        /// </summary>
        /// <param name="eventId">The event identifier.</param>
        /// <returns></returns>
        public async Task<NotificationEventModel> GetEventAsync(int eventId)
        {
            NotificationEventModel notificationEvent = new();
            try
            {
                string apiUrl = "api/notification-events?eventId=" + eventId.ToString();
                notificationEvent = JsonConvert.DeserializeObject<NotificationEventModel>(await GetRequestResponseAsync(apiUrl));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, exception.Message, exception);
            }
            return notificationEvent;
        }

        /// <summary>
        /// Gets the events asynchronous.
        /// </summary>
        /// <param name="application">The application.</param>
        /// <returns></returns>
        public async Task<List<NotificationEventModel>> GetEventsAsync(NotificationApplication application)
        {
            List<NotificationEventModel> notificationEvents = new();
            try
            {
                string apiUrl = "api/notification-events?applicationId=" + (int)application;
                notificationEvents = JsonConvert.DeserializeObject<List<NotificationEventModel>>(await GetRequestResponseAsync(apiUrl));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, exception.Message, exception);
            }
            return notificationEvents;
        }

        /// <summary>
        /// Gets the notification types asynchronous.
        /// </summary>
        /// <returns></returns>
        public async Task<List<NotificationTypeModel>> GetTypesAsync()
        {
            List<NotificationTypeModel> notificationTypes = new();
            try
            {
                notificationTypes = JsonConvert.DeserializeObject<List<NotificationTypeModel>>(await GetRequestResponseAsync("api/notification-types"));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, exception.Message, exception);
            }
            return notificationTypes;
        }

        #endregion Async Methods

        #region Send Notification

        /// <summary>
        /// Sends the the change password notification.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <param name="userPassword">The user password.</param>
        /// <param name="userEmail">The user email.</param>
        /// <param name="personId">The person id.</param>
        /// <returns></returns>
        public async Task<bool> SendAsync(string userName, string userPassword, string userEmail, int personId)
        {
            try
            {
                if (await EventIsActiveAsync(NotificationEvent.ProfileAccountPasswordUpdated))
                {
                    List<NotificationToken> currentTokens = new();
                    People person = _peopleService.Get(personId);
                    currentTokens = new List<NotificationToken>
                        {
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = person.Email } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "name.prefix", Value =  person.Prefix} },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "name.firstname", Value =  person.FirstName} },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "name.middlename", Value =  person.MiddleName} },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "name.lastname", Value =  person.LastName} },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "name.suffix", Value =  person.Suffix} },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "name.nickname", Value =  person.Nickname} },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "name.lastnameprefix", Value =  person.LastNamePrefix} },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "name.legalname", Value =  person.LegalName} },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "name.displayname", Value =  person.DisplayName} },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "useraccount.username", Value = userName} },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "useraccount.password", Value = userPassword} },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "useraccount.email", Value = userEmail} },
                        };

                    Create(new NotificationEventModel
                    {
                        EventKey = NotificationEvent.ProfileAccountPasswordUpdated,
                        Tokens = currentTokens
                    });

                    return true;
                }

                return false;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, exception.Message, exception);
                return false;
            }
        }

        /// <summary>
        /// Sends the invitation notification asynchronous.
        /// </summary>
        /// <param name="studentId">The student identifier.</param>
        /// <param name="relativeId">The relative identifier.</param>
        /// <param name="invitation">The invitation.</param>
        /// <param name="confirmationUrl">The confirmation URL.</param>
        /// <param name="expiryDate">The expiry date.</param>
        /// <param name="email">The email.</param>
        public async Task SendAsync(int studentId, int relativeId, InvitationStatus invitation, string confirmationUrl, string expiryDate, string email)
        {
            try
            {
                string eventNotification = string.Empty;

                if (invitation == InvitationStatus.Created)
                    eventNotification = NotificationEvent.SharedAccessInvitationCreated;
                else if (invitation == InvitationStatus.Accepted)
                    eventNotification = NotificationEvent.SharedAccessInvitationAccepted;
                else if (invitation == InvitationStatus.Removed)
                    eventNotification = NotificationEvent.SharedAccessInvitationRemoved;
                else
                    return;

                List<NotificationToken> currentTokens;
                bool isActive = await EventIsActiveAsync(eventNotification);
                if (!isActive)
                    return;

                People student = _peopleService.Get(studentId);
                People relative = _peopleService.Get(relativeId);
                currentTokens = new List<NotificationToken>
                    {
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "student.prefix", Value = student.Prefix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "student.firstname", Value = student.FirstName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "student.displayname", Value = student.DisplayName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "student.middlename", Value = student.MiddleName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "student.lastname", Value = student.LastName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "student.suffix", Value = student.Suffix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "student.nickname", Value = student.Nickname } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "student.lastnameprefix", Value = student.LastNamePrefix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "student.legalname", Value = student.LegalName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "relative.prefix", Value = relative.Prefix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "relative.firstname", Value = relative.FirstName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "relative.displayname", Value = relative.DisplayName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "relative.middlename", Value = relative.MiddleName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "relative.lastname", Value = relative.LastName } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "relative.suffix", Value = relative.Suffix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "relative.nickname", Value = relative.Nickname } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "relative.lastnameprefix", Value = relative.LastNamePrefix } },
                        new NotificationToken { Token = new NotificationTokenDetail { Id = "relative.legalname", Value = relative.LegalName } },
                    };
                if (invitation == InvitationStatus.Created)
                {
                    currentTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "invitationconfirmationurl", Value = confirmationUrl } });
                    currentTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "invitationexpirydate", Value = expiryDate } });
                    currentTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = email } });
                }
                else if (invitation == InvitationStatus.Accepted)
                {
                    currentTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = student.Email } });
                }
                else if (invitation == InvitationStatus.Removed)
                {
                    currentTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = relative.Email } });
                }
                else
                {
                    return;
                }

                Create(new NotificationEventModel
                {
                    EventKey = eventNotification,
                    Tokens = currentTokens
                });
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, exception.Message, exception);
            }
        }

        /// <summary>
        /// Sends the creates the account notification asynchronous.
        /// </summary>
        /// <param name="account">The account.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="eventName">Name of the event.</param>
        /// <returns></returns>
        public async Task<bool> SendAsync(IdentityAccountViewModel account, string userName, string eventName)
        {
            try
            {
                bool notificationSend = true;
                if (eventName.Equals("AdmissionsApplicationAccountCreated"))
                {
                    if (await EventIsActiveAsync(NotificationEvent.AdmissionsApplicationAccountCreated))
                    {
                        List<NotificationToken> currentTokens = new()
                        {
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = account.Email, } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "useraccount.username", Value = userName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "useraccount.password", Value = account.Password } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "useraccount.email", Value = account.Email } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.firstname", Value = account.FirstName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "applicantname.lastname", Value = account.LastName } }
                        };
                        Create(new NotificationEventModel
                        {
                            EventKey = NotificationEvent.AdmissionsApplicationAccountCreated,
                            Tokens = currentTokens
                        });
                    }
                    else
                    {
                        _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, "Notification is not Active: " + NotificationEvent.AdmissionsApplicationAccountCreated);
                        notificationSend = false;
                    }
                }
                else if (eventName.Equals("ConEdAccountCreated"))
                {
                    if (await EventIsActiveAsync(NotificationEvent.ConEdAccountCreated))
                    {
                        List<NotificationToken> currentTokens = new()
                        {
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = account.Email, } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "useraccount.username", Value = userName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "useraccount.password", Value = account.Password } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "useraccount.email", Value = account.Email } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "name.firstname", Value = account.FirstName } },
                            new NotificationToken { Token = new NotificationTokenDetail { Id = "name.lastname", Value = account.LastName } }
                        };

                        Create(new NotificationEventModel
                        {
                            EventKey = NotificationEvent.ConEdAccountCreated,
                            Tokens = currentTokens
                        });
                    }
                    else
                    {
                        _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, "Notification is not Active: " + NotificationEvent.ConEdAccountCreated);
                        notificationSend = false;
                    }
                }
                else if (eventName.Equals("SharedAccessAccountCreated"))
                {
                    if (await EventIsActiveAsync(NotificationEvent.SharedAccessAccountCreated))
                    {
                        List<NotificationToken> currentTokens = GetPersonNotificationTokensByPersonId(_peopleService, account.PersonId.Value);
                        currentTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "useraccount.username", Value = userName } });
                        currentTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "useraccount.password", Value = account.Password } });
                        currentTokens.Add(new NotificationToken { Token = new NotificationTokenDetail { Id = "useraccount.email", Value = account.Email } });
                        Create(new NotificationEventModel
                        {
                            EventKey = NotificationEvent.SharedAccessAccountCreated,
                            Tokens = currentTokens
                        });
                    }
                    else
                    {
                        _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, "Notification is not Active: " + NotificationEvent.ConEdAccountCreated);
                        notificationSend = false;
                    }
                }
                return notificationSend;
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, exception.Message, exception);
                return false;
            }
        }

        #endregion Send Notification

        #region Private Methods

        /// <summary>
        /// Gets the person notification tokens list.
        /// </summary>
        /// <param name="person">The person.</param>
        /// <returns></returns>
        private List<NotificationToken> GetPersonNotificationTokensList(People person)
        {
            return new List<NotificationToken>
                {
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = person.Email } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.prefix", Value = person.Prefix } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.firstname", Value = person.FirstName } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.displayname", Value = person.DisplayName } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.middlename", Value = person.MiddleName } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.lastname", Value = person.LastName } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.suffix", Value = person.Suffix } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.nickname", Value = person.Nickname } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.lastnameprefix", Value = person.LastNamePrefix } },
                    new NotificationToken { Token = new NotificationTokenDetail { Id = "name.legalname", Value = person.LegalName } }
                };
        }

        /// <summary>
        /// Gets the request response asynchronous as string
        /// </summary>
        /// <param name="apiUrl">The API URL.</param>
        /// <returns></returns>
        private async Task<string> GetRequestResponseAsync(string apiUrl)
        {
            string jsonString = string.Empty;
            try
            {
                HttpClient client = _clientFactory.CreateClient(Constants._notificationsClient);
                HttpResponseMessage response = client.GetAsync(client.BaseAddress + apiUrl).Result;
                if (response.IsSuccessStatusCode)
                {
                    jsonString = await response.Content.ReadAsStringAsync();
                }
                else
                {
                    _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName,
                        apiUrl + " - Status: " + response.StatusCode + " " + response.Content.ToString());
                }
                client.Dispose();
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(INotificationsHelper).FullName, exception.Message, exception);
            }

            return jsonString;
        }

        /// <summary>
        /// Gets the temporary user notification tokens list.
        /// </summary>
        /// <param name="temporaryUser">The temporary user.</param>
        /// <returns></returns>
        private List<NotificationToken> GetTemporaryUserNotificationTokensList(TemporaryUser temporaryUser)
        {
            return new List<NotificationToken>
                {
                    new NotificationToken {
                        Token = new NotificationTokenDetail {
                            Id = "to",
                            Value = temporaryUser.Email
                        }
                    },
                    new NotificationToken {
                        Token = new NotificationTokenDetail {
                            Id = "name.prefix",
                            Value = string.Empty
                        }
                    },
                    new NotificationToken {
                        Token = new NotificationTokenDetail {
                            Id = "name.firstname",
                            Value = temporaryUser.FirstName
                        }
                    },
                    new NotificationToken {
                            Token = new NotificationTokenDetail {
                                Id = "name.displayname",
                                Value = string.Empty
                            }
                    },
                    new NotificationToken {
                            Token = new NotificationTokenDetail {
                                Id = "name.middlename",
                                Value =string.Empty
                            }
                    },
                    new NotificationToken {
                            Token = new NotificationTokenDetail {
                            Id = "name.lastname",
                            Value = temporaryUser.LastName
                        }
                    },
                    new NotificationToken {
                            Token = new NotificationTokenDetail {
                                Id = "name.suffix",
                                Value = string.Empty
                            }
                    },
                    new NotificationToken {
                            Token = new NotificationTokenDetail {
                                Id = "name.nickname",
                                Value = string.Empty
                            }
                    },
                    new NotificationToken {
                            Token = new NotificationTokenDetail {
                                Id = "name.lastnameprefix",
                                Value = string.Empty
                            }
                    },
                    new NotificationToken {
                            Token = new NotificationTokenDetail {
                                Id = "name.legalname",
                                Value = string.Empty
                            }
                    }
                };
        }

        /// <summary>
        /// Gets the token values.
        /// </summary>
        /// <param name="notificationSetupViewModel">The notification setup view model.</param>
        /// <returns></returns>
        private List<NotificationToken> GetTokenValues(NotificationSetupViewModel notificationSetupViewModel)
        {
            List<NotificationToken> tokenValues = new()
            {
                new NotificationToken { Token = new NotificationTokenDetail { Id = "cco", Value = notificationSetupViewModel.Cco } },
                new NotificationToken { Token = new NotificationTokenDetail { Id = "from", Value = notificationSetupViewModel.From } },
                new NotificationToken { Token = new NotificationTokenDetail { Id = "message", Value = notificationSetupViewModel.Message } },
                new NotificationToken { Token = new NotificationTokenDetail { Id = "subject", Value = notificationSetupViewModel.Subject } },
                new NotificationToken { Token = new NotificationTokenDetail { Id = "to", Value = notificationSetupViewModel.To } }
            };

            return tokenValues;
        }

        /// <summary>
        /// Sends the request.
        /// </summary>
        /// <param name="httpMethod"></param>
        /// <param name="apiUrl"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        private async Task<bool> SendRequest(HttpMethod httpMethod, string apiUrl, object content)
        {
            bool resultStatus = false;
            (bool _, HttpStatusCode httpStatusCode, string __) = await _httpClientHelper.SendNotificationsURI(httpMethod, apiUrl, content);

            if (httpStatusCode == HttpStatusCode.OK)
                resultStatus = true;
            else
                _logger.LogError(Constants._product, typeof(HttpClientHelper).FullName, "Error calling: " + apiUrl + " - Status: " + httpStatusCode);

            return resultStatus;
        }

        /// <summary>
        /// Converts to notification event.
        /// </summary>
        /// <param name="notificationSetupViewModel">The notification setup view model.</param>
        /// <returns></returns>
        private NotificationEventModel ToNotificationEvent(NotificationSetupViewModel notificationSetupViewModel)
        {
            NotificationEventModel notificationEvent = null;
            if (notificationSetupViewModel != null)
            {
                notificationEvent = new NotificationEventModel
                {
                    EventKey = notificationSetupViewModel.EventCode,
                    IsActive = notificationSetupViewModel.IsActive,
                    NotificationEventId = notificationSetupViewModel.NotificationEventId,
                    NotificationSetupId = notificationSetupViewModel.NotificationSetupId,
                    Tokens = GetTokenValues(notificationSetupViewModel),
                    TypeId = notificationSetupViewModel.TypeId
                };
            }
            return notificationEvent;
        }

        #endregion Private Methods
    }
}