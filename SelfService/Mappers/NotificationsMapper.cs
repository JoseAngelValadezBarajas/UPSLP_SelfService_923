// --------------------------------------------------------------------
// <copyright file="NotificationsMapper.cs" company="Ellucian">
//     Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Administration.Models.Notifications;
using Hedtech.PowerCampus.Core.DTO.Navigation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Newtonsoft.Json;
using SelfService.Helpers;
using SelfService.Models.Enum;
using SelfService.Models.Notifications;
using SelfService.Models.ResourcesTypes.Administration;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace SelfService.Mappers
{
    /// <summary>
    /// NotificationsMapper
    /// </summary>
    internal static class NotificationsMapper
    {
        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="notificationsDTO">The notifications dto.</param>
        /// <param name="nameFormatService">The name format service.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="dateTimeCultureFormat">The date time culture format.</param>
        /// <returns></returns>
        internal static List<NotificationViewModel> ToViewModel(this List<Notification> notificationsDTO, INameFormatService nameFormatService, bool showMiddleNameInitial, string dateTimeCultureFormat)
        {
            List<NotificationViewModel> notifications = null;

            if (notificationsDTO?.Count > 0)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(dateTimeCultureFormat);
                notifications = new List<NotificationViewModel>();
                foreach (Notification notificationDTO in notificationsDTO)
                {
                    notifications.Add(
                        new NotificationViewModel
                        {
                            Status = notificationDTO.Status,
                            CreateDatetime =
                            $"{FormatHelper.ToShortDate(notificationDTO.CreateDatetime, datetimeCulture)} {FormatHelper.ToShortTime(notificationDTO.CreateDatetime, datetimeCulture)}",
                            RevisionDatetime =
                            $"{FormatHelper.ToShortDate(notificationDTO.RevisionDatetime, datetimeCulture)} {FormatHelper.ToShortTime(notificationDTO.RevisionDatetime, datetimeCulture)}",
                            NotificationId = notificationDTO.NotificationId,
                            NotificationType = notificationDTO.NotificationType,
                            PersonIdTo = notificationDTO.PersonIdTo,
                            PersonIdFrom = notificationDTO.PersonIdFrom,
                            PersonFrom = notificationDTO.PersonFrom.ToViewModel(nameFormatService, showMiddleNameInitial)
                        });
                }
            }

            return notifications;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="notificationTypes">The notification types.</param>
        /// <returns></returns>
        internal static List<NotificationTypeViewModel> ToViewModel(this List<NotificationTypeModel> notificationTypes)
        {
            List<NotificationTypeViewModel> types = null;
            if (notificationTypes?.Count > 0)
            {
                types = new List<NotificationTypeViewModel>();
                foreach (NotificationTypeModel notificationType in notificationTypes)
                {
                    types.Add(new NotificationTypeViewModel
                    {
                        TypeId = notificationType.NotificationTypeId,
                        NotificationTemplate = JsonConvert.DeserializeObject<List<NotificationTemplate>>(notificationType.DefaultTemplate)
                    });
                }
            }
            return types;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="notificationEvents">The notification events.</param>
        /// <param name="resourcesHelper">The resources helper.</param>
        /// <param name="language">The language.</param>
        /// <returns></returns>
        internal static List<NotificationAreaViewModel> ToViewModel(this List<NotificationEventModel> notificationEvents, IResourcesHelper resourcesHelper, string language)
        {
            List<NotificationAreaViewModel> notificationAreas = new();
            List<NotificationEventsResource> resources = resourcesHelper.GetResourceType<List<NotificationEventsResource>>(language,
                new SiteMapPage("Administration", "NotificationEvents"), ValidationHelper.IsValidResource);
            if (notificationEvents != null)
            {
                foreach (IGrouping<NotificationEventArea, NotificationEventModel> eventGroup in notificationEvents.GroupBy(x => (NotificationEventArea)x.Area))
                {
                    notificationAreas.Add(new NotificationAreaViewModel
                    {
                        Area = eventGroup.Key,
                        NotificationEvents = GetEventsByArea(eventGroup.Key, notificationEvents, resources).OrderBy(x => x.EventName).ToList()
                    });
                }
            }
            return notificationAreas.OrderBy(x => x.Area).ToList();
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="notificationEventModel">The notification event model.</param>
        /// <param name="resourcesHelper">The resources helper.</param>
        /// <param name="language">The language.</param>
        /// <returns></returns>
        internal static NotificationEventViewModel ToViewModel(this NotificationEventModel notificationEventModel, IResourcesHelper resourcesHelper, string language)
        {
            List<NotificationEventsResource> resources = resourcesHelper.GetResourceType<List<NotificationEventsResource>>(language,
                new SiteMapPage("Administration", "NotificationEvents"), ValidationHelper.IsValidResource);
            NotificationEventViewModel notificationEventViewModel = new()
            {
                Area = (NotificationEventArea)notificationEventModel.Area,
                EventCode = notificationEventModel.EventKey,
                EventDescription = resources.Find(x => x.EventCode == notificationEventModel.EventKey)?.EventDescription,
                EventId = notificationEventModel.NotificationEventId,
                EventName = resources.Find(x => x.EventCode == notificationEventModel.EventKey)?.EventName,
                EventTypes = GetEventTypes(notificationEventModel.NotificationSetup),
                IsActive = notificationEventModel.IsActive,
                TokenGroupDetail = GetTokenGroupDetails(notificationEventModel.TokenGroup)
            };

            return notificationEventViewModel;
        }

        /// <summary>
        /// Converts to NotificationSetupViewModel.
        /// </summary>
        /// <param name="notificationSetupModel">The notification setup model.</param>
        /// <returns></returns>
        internal static NotificationSetupViewModel ToViewModel(this NotificationSetupModel notificationSetupModel)
        {
            NotificationSetupViewModel notificationSetupViewModel = null;
            if (notificationSetupModel?.Template != null)
            {
                List<NotificationToken> notificationTokens = JsonConvert.DeserializeObject<List<NotificationToken>>(notificationSetupModel.Template);
                notificationSetupViewModel = new NotificationSetupViewModel
                {
                    NotificationSetupId = notificationSetupModel.NotificationSetupId,
                    IsActive = notificationSetupModel.IsActive
                };

                foreach (NotificationToken notificationToken in notificationTokens)
                {
                    switch (notificationToken.Token.Id)
                    {
                        case "cco":
                            notificationSetupViewModel.Cco = notificationToken.Token.Value;
                            break;

                        case "from":
                            notificationSetupViewModel.From = notificationToken.Token.Value;
                            break;

                        case "message":
                            notificationSetupViewModel.Message = notificationToken.Token.Value;
                            break;

                        case "subject":
                            notificationSetupViewModel.Subject = notificationToken.Token.Value;
                            break;

                        case "to":
                            notificationSetupViewModel.To = notificationToken.Token.Value;
                            break;
                    }
                }
            }

            return notificationSetupViewModel;
        }

        /// <summary>
        /// Gets the token group details.
        /// </summary>
        /// <param name="tokenGroup">The token group.</param>
        /// <returns></returns>
        private static List<TokenGroupDetailViewModel> GetTokenGroupDetails(NotificationTokenGroup tokenGroup)
        {
            List<TokenGroupDetailViewModel> tokenGroupDetails = new();

            if (tokenGroup != null)
            {
                //Verify first if there are collections to create a new tokengroupdetail
                foreach (IGrouping<string, TokenGroupDetailModel> tokenGroupDetail in tokenGroup.TokenGroupDetail.GroupBy(x => x.CollectionName).ToList())
                {
                    if (tokenGroupDetail.Key != null)
                    {
                        tokenGroupDetails.Add(new TokenGroupDetailViewModel
                        {
                            TokenKey = tokenGroupDetail.Key,
                            IsCollection = true
                        });
                    }
                }

                foreach (TokenGroupDetailModel tokenGroupDetail in tokenGroup.TokenGroupDetail.Where(x => string.IsNullOrEmpty(x.CollectionName)))
                {
                    tokenGroupDetails.Add(new TokenGroupDetailViewModel
                    {
                        TokenKey = tokenGroupDetail.TokenKey,
                        IsCollection = false
                    });
                }
            }
            return tokenGroupDetails;
        }

        #region Private Methods

        /// <summary>
        /// Gets the events by area.
        /// </summary>
        /// <param name="area">The area.</param>
        /// <param name="notificationEvents">The notification events.</param>
        /// <param name="resources">The resources.</param>
        /// <returns></returns>
        private static List<NotificationEventViewModel> GetEventsByArea(NotificationEventArea area, List<NotificationEventModel> notificationEvents,
            List<NotificationEventsResource> resources)
        {
            List<NotificationEventViewModel> notificationEventsViewModel = new();
            foreach (NotificationEventModel notificationEvent in notificationEvents.Where(x => x.Area == (int)area).ToList())
            {
                notificationEventsViewModel.Add(new NotificationEventViewModel
                {
                    EventName = resources.Find(x => x.EventCode == notificationEvent.EventKey)?.EventName,
                    EventDescription = resources.Find(x => x.EventCode == notificationEvent.EventKey)?.EventDescription,
                    EventCode = notificationEvent.EventKey,
                    EventId = notificationEvent.NotificationEventId,
                    EventTypes = GetEventTypes(notificationEvent.NotificationSetup),
                    IsActive = notificationEvent.IsActive
                });
            }
            return notificationEventsViewModel;
        }

        /// <summary>
        /// Gets the event types.
        /// </summary>
        /// <param name="notificationSetup">The notification setup.</param>
        /// <returns></returns>
        private static List<string> GetEventTypes(List<NotificationSetupModel> notificationSetup)
        {
            List<string> eventTypes = new();
            foreach (NotificationSetupModel setup in notificationSetup)
                eventTypes.Add(setup.NotificationType?.CodeValueKey);

            return eventTypes;
        }

        #endregion Private Methods
    }
}