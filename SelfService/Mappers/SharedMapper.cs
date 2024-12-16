// --------------------------------------------------------------------
// <copyright file="SharedMapper.cs" company="Ellucian">
//     Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Foundation;
using Hedtech.PowerCampus.Core.DTO.Settings;
using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using SelfService.Helpers.Interfaces;
using SelfService.Models.Administration;
using SelfService.Models.Section;
using SelfService.Models.Shared;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using ProgramDto = Hedtech.PowerCampus.Core.DTO.Student.Program;

namespace SelfService.Mappers
{
    /// <summary>
    /// A mapper to format the data from DTOs to ViewModels(namespace SelfService.Models.Shared)
    /// </summary>
    internal static class SharedMapper
    {
        /// <summary>
        /// Converts to checklistviewmodel.
        /// </summary>
        /// <param name="codeTableList">The code table list.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToChecklistViewModel(this List<CodeTable> codeTableList)
        {
            List<ListOptionViewModel> optionViewModelList = new();
            if (codeTableList?.Count > 0)
            {
                foreach (CodeTable row in codeTableList)
                {
                    ListOptionViewModel listOptionViewModel = new()
                    {
                        Value = row.CodeValueKey,
                        Description = row.Description
                    };
                    optionViewModelList.Add(listOptionViewModel);
                }
                return optionViewModelList;
            }
            return new List<ListOptionViewModel>();
        }

        /// <summary>
        /// Converts to listitemviewmodel.
        /// </summary>
        /// <param name="codeTableList">The code table list.</param>
        /// <returns></returns>
        internal static List<ProspectListItem> ToListItemViewModel(this List<CodeTable> codeTableList)
        {
            List<ProspectListItem> optionViewModelList = new();
            if (codeTableList?.Count > 0)
            {
                foreach (CodeTable row in codeTableList)
                {
                    optionViewModelList.Add(new()
                    {
                        Id = row.Id,
                        Description = row.Description
                    });
                }
            }
            return optionViewModelList;
        }

        /// <summary>
        /// Converts to optioncomplementviewmodel.
        /// </summary>
        /// <param name="people">The people.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="peopleFormat">The people format.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToOptionComplementViewModel(this List<People> people, string nameFormat, string nameSort, bool showMiddleNameInitial, string peopleFormat = null)
        {
            List<ListOptionViewModel> operators = null;
            if (people?.Count > 0)
            {
                operators = new List<ListOptionViewModel>();
                foreach (People person in FormatHelper.GetSortedList(people.Cast<object>(), nameSort).Cast<People>().ToList())
                    operators.Add(person.ToViewModelComplement(nameFormat, nameSort, showMiddleNameInitial, peopleFormat));
            }
            return operators;
        }

        /// <summary>
        /// Map the data from Instructors(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="instructorsDTO">The instructors dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToOptionsViewModel(this List<Instructor> instructorsDTO, string nameFormat, string nameSort, bool showMiddleNameInitial)
        {
            List<ListOptionViewModel> instructors = null;
            instructorsDTO = FormatHelper.GetSortedList(instructorsDTO.Cast<object>(), nameSort).Cast<Instructor>().ToList();
            if (instructorsDTO?.Count > 0)
            {
                instructors = instructorsDTO.Select(instructor => new ListOptionViewModel
                {
                    Value = instructor.PersonId,
                    Description = FormatHelper.ToNameFormat(FormatHelper.SetNamePartsToDictionary(
                        new string[]
                        {
                            instructor.Prefix,
                            instructor.FirstName,
                            instructor.MiddleName,
                            instructor.LastNamePrefix,
                            instructor.LastName,
                            instructor.DisplayName,
                            instructor.Pronoun,
                            instructor.Suffix
                        }
                        ), nameFormat, showMiddleNameInitial)
                }).ToList();
            }
            return instructors;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="people">The people.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToOptionViewModel(this List<People> people, string nameFormat, string nameSort, bool showMiddleNameInitial)
        {
            List<ListOptionViewModel> operators = null;
            if (people?.Count > 0)
            {
                operators = new List<ListOptionViewModel>();
                foreach (People person in FormatHelper.GetSortedList(people.Cast<object>(), nameSort).Cast<People>().ToList())
                    operators.Add(person.ToViewModel(nameFormat, showMiddleNameInitial));
            }
            return operators;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="termPeriods">The term periods.</param>
        /// <param name="byTermPeriodId">if set to <c>true</c> [by term period identifier].</param>
        /// <param name="byTermCode">if set to <c>true</c> [by term code].</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<TermPeriod> termPeriods, bool byTermPeriodId = true, bool byTermCode = false)
        {
            List<ListOptionViewModel> options = new();
            foreach (TermPeriod termPeriod in termPeriods)
            {
                string year = !string.IsNullOrEmpty(termPeriod.Year) ? $"{termPeriod.Year}/" : string.Empty;
                string term = byTermCode ? termPeriod.TermCode : termPeriod.TermDesc;
                options.Add(new ListOptionViewModel
                {
                    Value = byTermPeriodId ? termPeriod.TermPeriodId : $"{year}{term}",
                    Description = $"{year}{termPeriod.TermDesc}"
                });
            }
            return options;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="actions">The actions.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<ChecklistAction> actions)
        {
            List<ListOptionViewModel> options = new();
            ListOptionViewModel option;
            foreach (ChecklistAction action in actions)
            {
                option = new ListOptionViewModel
                {
                    Complement = action,
                    Value = action.ActionId,
                    Description = action.ActionName
                };
                options.Add(option);
            }
            return options;
        }

        /// <summary>
        /// Map the data from Degree(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="degreesDTO">The degrees dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<Degree> degreesDTO)
        {
            List<ListOptionViewModel> degrees = null;
            if (degreesDTO?.Count > 0)
            {
                degrees = degreesDTO.Select(d => new ListOptionViewModel
                {
                    Value = $"{d.Code}/{d.CurriculumCode}",
                    Description = $"{d.Description}/{d.CurriculumDesc}"
                }).ToList();
            }
            return degrees;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="periodsDTO">The periods dto.</param>
        /// <param name="byTermId">if set to <c>true</c> [by term identifier].</param>
        /// <param name="includeSession">if set to <c>true</c> [include session].</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<Period> periodsDTO, bool byTermId, bool includeSession)
        {
            List<ListOptionViewModel> periods = null;

            if (periodsDTO?.Count > 0)
                periods = periodsDTO.Select(p => p.ToViewModel(byTermId, includeSession)).ToList();

            return periods;
        }

        /// <summary>
        /// Map the data from Period(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="periodDTO">The period dto.</param>
        /// <param name="byTermId">if set to <c>true</c> [by term identifier].</param>
        /// <param name="includeSession">if set to <c>true</c> [include session].</param>
        /// <returns>
        /// ListOptionViewModel
        /// </returns>
        internal static ListOptionViewModel ToViewModel(this Period periodDTO, bool byTermId, bool includeSession)
        {
            ListOptionViewModel period = null;

            if (periodDTO != null)
            {
                if (byTermId)
                {
                    period = new()
                    {
                        Value = $"{periodDTO.TermPeriodId}",
                        Description = includeSession && !string.IsNullOrEmpty(periodDTO.SessionCode) ?
                            $"{periodDTO.Year}/{periodDTO.TermDesc}/{periodDTO.SessionDesc}" : $"{periodDTO.Year}/{periodDTO.TermDesc}"
                    };
                }
                else
                {
                    period = new()
                    {
                        Value = includeSession && !string.IsNullOrEmpty(periodDTO.SessionCode) ?
                            $"{periodDTO.Year}/{periodDTO.TermCode}/{periodDTO.SessionCode}" : $"{periodDTO.Year}/{periodDTO.TermCode}",
                        Description = includeSession && !string.IsNullOrEmpty(periodDTO.SessionCode) ?
                            $"{periodDTO.Year}/{periodDTO.TermDesc}/{periodDTO.SessionDesc}" : $"{periodDTO.Year}/{periodDTO.TermDesc}"
                    };
                }
                if (periodDTO.PreRegistrationDate != FormatHelper.FromDatePicker("0001-01-01"))
                {
                    period.Complement = new PeriodStatusViewModel
                    {
                        Status = periodDTO.AuthorizationStatus,
                        PreRegistrationDate = string.Empty,
                        LastRegistrationDate = string.Empty
                    };
                }
            }

            return period;
        }

        /// <summary>
        /// Map the data from Program(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="programsDTO">The programs dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<ProgramDto> programsDTO)
        {
            List<ListOptionViewModel> programs = null;

            if (programsDTO?.Count > 0)
            {
                programs = programsDTO.Select(p => new ListOptionViewModel
                {
                    Value = p.Code,
                    Description = p.Description
                }).ToList();
            }
            return programs;
        }

        /// <summary>
        /// Map the data from SessionPeriod(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="sessionPeriodsDTO">The session periods dto.</param>
        /// <param name="bySessionPeriodId">if set to <c>true</c> [by session period identifier].</param>
        /// <param name="yearTermSession">if set to <c>true</c> [year term session].</param>
        /// <param name="byTermPeriodId">if set to <c>true</c> [by term period identifier].</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<SessionPeriod> sessionPeriodsDTO, bool bySessionPeriodId, bool yearTermSession = false, bool byTermPeriodId = false)
        {
            List<ListOptionViewModel> sessionPeriods = null;

            if (sessionPeriodsDTO?.Count > 0)
            {
                if (byTermPeriodId || bySessionPeriodId)
                {
                    sessionPeriods = sessionPeriodsDTO.Select(s =>
                    {
                        dynamic value;
                        if (byTermPeriodId && bySessionPeriodId)
                            value = $"{s.TermPeriodId}/{s.SessionPeriodId}";
                        else if (byTermPeriodId)
                            value = s.TermPeriodId;
                        else
                            value = s.SessionPeriodId;
                        return new ListOptionViewModel
                        {
                            Value = value,
                            Description = string.IsNullOrEmpty(s.SessionDesc) ? $"{s.Year}/{s.TermDesc}" : $"{s.Year}/{s.TermDesc}/{s.SessionDesc}"
                        };
                    }).ToList();
                }
                else
                {
                    if (yearTermSession)
                    {
                        sessionPeriods = sessionPeriodsDTO.Select(s => new ListOptionViewModel
                        {
                            Value = string.IsNullOrEmpty(s.SessionDesc) ? $"{s.Year}/{s.TermCode}" : $"{s.Year}/{s.TermCode}/{s.SessionCode}",
                            Description = string.IsNullOrEmpty(s.SessionDesc) ? $"{s.Year}/{s.TermDesc}" : $"{s.Year}/{s.TermDesc}/{s.SessionDesc}"
                        }).ToList();
                    }
                    else
                    {
                        sessionPeriods = sessionPeriodsDTO.Select(s => new ListOptionViewModel
                        {
                            Value = s.SessionCode,
                            Description = s.SessionDesc
                        }).ToList();
                    }
                }
            }

            return sessionPeriods;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="sessionPeriodsDTO">The session periods dto.</param>
        /// <param name="bySessionPeriodId">if set to <c>true</c> [by session period identifier].</param>
        /// <returns></returns>
        internal static ListOptionViewModel ToViewModel(this SessionPeriod sessionPeriodsDTO, bool bySessionPeriodId)
        {
            ListOptionViewModel sessionPeriod = null;

            if (sessionPeriodsDTO != null)
            {
                if (bySessionPeriodId)
                {
                    sessionPeriod = new ListOptionViewModel
                    {
                        Value = sessionPeriodsDTO.SessionPeriodId,
                        Description = string.IsNullOrEmpty(sessionPeriodsDTO.SessionDesc) ? ($"{sessionPeriodsDTO.Year}/{sessionPeriodsDTO.TermDesc}") :
                        ($"{sessionPeriodsDTO.Year}/{sessionPeriodsDTO.TermDesc}/{sessionPeriodsDTO.SessionDesc}")
                    };
                }
                else
                {
                    sessionPeriod = new ListOptionViewModel
                    {
                        Value = sessionPeriodsDTO.SessionCode,
                        Description = sessionPeriodsDTO.SessionDesc
                    };
                }
            }
            return sessionPeriod;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="sessionPeriodsDTO">The session periods dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<SessionPeriod> sessionPeriodsDTO)
        {
            List<ListOptionViewModel> sessionPeriods = null;

            if (sessionPeriodsDTO?.Count > 0)
            {
                sessionPeriods = sessionPeriodsDTO.Select(s => new ListOptionViewModel
                {
                    Value = s.SessionPeriodId,
                    Description = s.TermDesc
                }).ToList();
            }

            return sessionPeriods;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="sectionPeriodsDTO">The section periods dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<SectionPeriod> sectionPeriodsDTO)
        {
            List<ListOptionViewModel> sectionPeriods = null;

            if (sectionPeriodsDTO?.Count > 0)
            {
                sectionPeriods = sectionPeriodsDTO.Select(s => new ListOptionViewModel
                {
                    Value = s.Id,
                    Description = $"{s.EventId }/{s.EventName }/{s.EventSubTypeDesc}/{s.Section}",
                }).ToList();
            }

            return sectionPeriods;
        }

        /// <summary>
        /// Map the data from Meeting(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="meetingsDTO">The meetings dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<Meeting> meetingsDTO)
        {
            List<ListOptionViewModel> meetings = null;

            if (meetingsDTO?.Count > 0)
            {
                meetings = meetingsDTO.Select(m => new ListOptionViewModel
                {
                    Value = m.Code,
                    Description = m.Description
                }).ToList();
            }

            return meetings;
        }

        /// <summary>
        /// Map the data from Campus(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="campusDTO">The campus dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<Campus> campusDTO)
        {
            List<ListOptionViewModel> campus = null;

            if (campusDTO?.Count > 0)
            {
                campus = campusDTO.Select(c => new ListOptionViewModel
                {
                    Value = c.Code,
                    Description = c.Name
                }).ToList();
            }

            return campus;
        }

        /// <summary>
        /// To the ListOptionViewModel.
        /// </summary>
        /// <param name="codeTableList">The code table list.</param>
        /// <param name="byId">if set to <c>true</c> [by identifier].</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<CodeTable> codeTableList, bool byId)
        {
            List<ListOptionViewModel> optionViewModelList = new();
            if (codeTableList?.Count > 0)
            {
                foreach (CodeTable row in codeTableList)
                {
                    ListOptionViewModel listOptionViewModel = new()
                    {
                        Value = byId ? row.Id.ToString() : row.CodeValueKey,
                        Description = row.Description
                    };
                    optionViewModelList.Add(listOptionViewModel);
                }
                return optionViewModelList;
            }
            return new List<ListOptionViewModel>();
        }

        /// <summary>
        /// Map the data from SectionSubType(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="subTypesDTO">The sub types dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<SectionSubType> subTypesDTO)
        {
            List<ListOptionViewModel> subTypes = null;

            if (subTypesDTO?.Count > 0)
            {
                subTypes = subTypesDTO.Select(s => new ListOptionViewModel
                {
                    Value = s.Code,
                    Description = s.Description
                }).ToList();
            }

            return subTypes;
        }

        /// <summary>
        /// Map the data from CreditType(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="creditTypesDTO">The credit types dto.</param>
        /// <param name="byCode">if set to <c>true</c> [by code].</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<CreditType> creditTypesDTO, bool byCode = false)
        {
            List<ListOptionViewModel> creditTypes = null;

            if (creditTypesDTO?.Count > 0)
            {
                creditTypes = creditTypesDTO.Select(c => new ListOptionViewModel
                {
                    Value = byCode ? c.Code : c.Type,
                    Description = c.Description
                }).ToList();
            }

            return creditTypes;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="instructorsDTO">The instructors dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<AvatarViewModel> ToViewModel(this List<Instructor> instructorsDTO, string nameFormat, string nameSort, bool showMiddleNameInitial)
        {
            List<AvatarViewModel> instructors = null;
            if (instructorsDTO?.Count > 0)
            {
                instructors = new();
                foreach (Instructor itemInstructor in instructorsDTO)
                    instructors.Add(itemInstructor.ToViewModel(nameFormat, nameSort, showMiddleNameInitial));
            }
            return instructors;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="people">The people.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static List<AvatarViewModel> ToViewModel(this List<People> people, string nameFormat, string nameSort, bool showMiddleNameInitial)
        {
            List<AvatarViewModel> instructors = null;
            if (people?.Count > 0)
            {
                instructors = new List<AvatarViewModel>();
                foreach (People person in FormatHelper.GetSortedList(people.Cast<object>(), nameSort).Cast<People>().ToList())
                    instructors.Add(person.ToViewModel(nameFormat, nameSort, showMiddleNameInitial));
            }
            return instructors;
        }

        /// <summary>
        /// Converts to avatarviewmodel with picture
        /// </summary>
        /// <param name="people">The people.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="peopleService">The people service.</param>
        /// <param name="showStudentPicture">if set to <c>true</c> [show student picture].</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="pictureHelper">The picture helper.</param>
        /// <returns></returns>
        internal static List<AvatarViewModel> ToViewModel(this List<People> people, string nameFormat, string nameSort,
            IPeopleService peopleService, bool showStudentPicture, bool showMiddleNameInitial, IPictureHelper pictureHelper)
        {
            List<AvatarViewModel> avatarList = null;
            if (people?.Count > 0)
            {
                avatarList = new List<AvatarViewModel>();
                foreach (People person in FormatHelper.GetSortedList(people.Cast<object>(), nameSort).Cast<People>().ToList())
                {
                    AvatarViewModel avatar = person.ToViewModel(nameFormat, nameSort, showMiddleNameInitial);
                    avatar.HasPicture =
                            showStudentPicture && person.HasPicture && pictureHelper.GetPictureAsync(peopleService.GetPicture(person.PersonId.Value)) != null;
                    avatarList.Add(avatar);
                }
            }
            return avatarList;
        }

        /// <summary>
        /// Map the data from Instructor(DTO) to string.
        /// </summary>
        /// <param name="instructorDTO">The instructor dto.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static AvatarViewModel ToViewModel(this Instructor instructorDTO, string nameFormat, string nameSort, bool showMiddleNameInitial)
        {
            AvatarViewModel instructor = null;

            if (instructorDTO != null)
            {
                instructor = new AvatarViewModel();
                Dictionary<string, string> nameParts = FormatHelper.SetNamePartsToDictionary(
                    new string[]
                    {
                        instructorDTO.Prefix,
                        instructorDTO.FirstName,
                        instructorDTO.MiddleName,
                        instructorDTO.LastNamePrefix,
                        instructorDTO.LastName,
                        instructorDTO.DisplayName,
                        instructorDTO.Pronoun,
                        instructorDTO.Suffix
                    });
                instructor.FullName = FormatHelper.ToNameFormat(nameParts, nameFormat, showMiddleNameInitial);
                instructor.FirstLetter = FormatHelper.ToFirstLetterSortName(nameParts, nameSort);
                Random random = !instructorDTO.PersonId.HasValue
                    ? new Random(instructor.FullName.Length * DateTime.Now.Millisecond)
                    : new Random(Convert.ToInt32(instructorDTO.PersonId) + (instructor.FullName.Length * DateTime.Now.Millisecond));
                instructor.ColorFirstLetter = random.Next(1, 7);
                if (instructorDTO.PersonId != null)
                    instructor.PersonId = instructorDTO.PersonId.Value;
            }

            return instructor;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="people">The people.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="peopleFormat">The people format.</param>
        /// <returns></returns>
        internal static AvatarViewModel ToViewModel(this People people, string nameFormat, string nameSort, bool showMiddleNameInitial, string peopleFormat = null)
        {
            AvatarViewModel avatarViewModel = null;

            if (people != null)
            {
                Dictionary<string, string> nameParts = FormatHelper.SetNamePartsToDictionary(
                    new string[]
                    {
                        people.Prefix,
                        people.FirstName,
                        people.MiddleName,
                        people.LastNamePrefix,
                        people.LastName,
                        people.DisplayName,
                        people.Pronoun,
                        people.Suffix
                    });
                if (peopleFormat != null)
                {
                    avatarViewModel = new()
                    {
                        FullName = FormatHelper.ToNameFormat(nameParts, nameFormat, showMiddleNameInitial),
                        FirstLetter = FormatHelper.ToFirstLetterSortName(nameParts, nameSort),
                        HasPicture = people.HasPicture,
                        PeopleId = string.IsNullOrEmpty(people.PeopleId) && !(string.IsNullOrEmpty(people.PeopleCodeId)) ?
                        FormatHelper.ToPeopleId(people.PeopleCodeId.Substring(1, people.PeopleCodeId.Length - 1), peopleFormat) :
                        FormatHelper.ToPeopleId(people.PeopleId, peopleFormat)
                    };
                }
                else
                {
                    avatarViewModel = new AvatarViewModel
                    {
                        FullName = FormatHelper.ToNameFormat(nameParts, nameFormat, showMiddleNameInitial),
                        FirstLetter = FormatHelper.ToFirstLetterSortName(nameParts, nameSort),
                        HasPicture = people.HasPicture,
                        PeopleId = string.IsNullOrEmpty(people.PeopleId) && !(string.IsNullOrEmpty(people.PeopleCodeId)) ?
                                            people.PeopleCodeId.Substring(1, people.PeopleCodeId.Length - 1) :
                                            people.PeopleId
                    };
                }
                Random random = !people.PersonId.HasValue
                    ? new Random(avatarViewModel.FullName.Length * DateTime.Now.Millisecond)
                    : new Random(Convert.ToInt32(people.PersonId) + (avatarViewModel.FullName.Length * DateTime.Now.Millisecond));
                avatarViewModel.ColorFirstLetter = random.Next(1, 7);
                if (people.PersonId != null)
                    avatarViewModel.PersonId = people.PersonId.Value;
            }

            return avatarViewModel;
        }

        /// <summary>
        /// Converts to StudentShared to AvatarViewModel.
        /// </summary>
        /// <param name="studentShared">The student shared.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="peopleFormat">The people format.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static AvatarViewModel ToViewModel(this StudentShared studentShared, string nameFormat, string nameSort, string peopleFormat, bool showMiddleNameInitial)
        {
            AvatarViewModel avatarViewModel = null;

            if (studentShared != null)
            {
                Dictionary<string, string> nameParts = FormatHelper.SetNamePartsToDictionary(
                    new string[]
                    {
                        studentShared.Name.Prefix,
                        studentShared.Name.FirstName,
                        studentShared.Name.MiddleName,
                        studentShared.Name.LastNamePrefix,
                        studentShared.Name.LastName,
                        studentShared.Name.DisplayName,
                        studentShared.Name.Pronoun,
                        studentShared.Name.Suffix
                    });

                avatarViewModel = new AvatarViewModel
                {
                    FullName = FormatHelper.ToNameFormat(nameParts, nameFormat, showMiddleNameInitial),
                    FirstLetter = FormatHelper.ToFirstLetterSortName(nameParts, nameSort),
                    PeopleId = string.IsNullOrEmpty(studentShared.PeopleId) && !(string.IsNullOrEmpty(studentShared.PeopleCodeId)) ?
                        FormatHelper.ToPeopleId(studentShared.PeopleCodeId.Substring(1, studentShared.PeopleCodeId.Length - 1), peopleFormat) :
                        FormatHelper.ToPeopleId(studentShared.PeopleId, peopleFormat)
                };
                Random random = new(Convert.ToInt32(studentShared.PersonId) + (avatarViewModel.FullName.Length * DateTime.Now.Millisecond));
                avatarViewModel.ColorFirstLetter = random.Next(1, 7);
                avatarViewModel.PersonId = studentShared.PersonId;
            }

            return avatarViewModel;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="people">The people.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <returns></returns>
        internal static ListOptionViewModel ToViewModel(this People people, string nameFormat, bool showMiddleNameInitial)
        {
            ListOptionViewModel optionViewModel = null;

            if (people != null)
            {
                optionViewModel = new ListOptionViewModel();
                Dictionary<string, string> nameParts = FormatHelper.SetNamePartsToDictionary(
                    new string[]
                    {
                        people.Prefix,
                        people.FirstName,
                        people.MiddleName,
                        people.LastNamePrefix,
                        people.LastName,
                        people.DisplayName,
                        people.Pronoun,
                        people.Suffix
                    });
                optionViewModel.Description = FormatHelper.ToNameFormat(nameParts, nameFormat, showMiddleNameInitial);
                optionViewModel.Value = people.PersonId.Value;
                optionViewModel.Complement = people.Email ?? string.Empty;
            }
            return optionViewModel;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="avatars">The avatars.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<AvatarViewModel> avatars)
        {
            List<ListOptionViewModel> list = null;

            if (avatars != null)
            {
                list = new List<ListOptionViewModel>();
                foreach (AvatarViewModel avatar in avatars)
                {
                    list.Add(new ListOptionViewModel
                    {
                        Description = avatar.FullName,
                        Value = avatar.PersonId
                    });
                }
            }

            return list;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="scheduleDTO">The schedule dto.</param>
        /// <param name="datetimeCulture">The datetime culture.</param>
        /// <returns></returns>
        internal static ScheduleViewModel ToViewModel(this Schedule scheduleDTO, CultureInfo datetimeCulture)
        {
            ScheduleViewModel schedule = null;

            if (scheduleDTO != null)
            {
                schedule = new ScheduleViewModel
                {
                    BldgName = scheduleDTO.BldgName,
                    DayDesc = scheduleDTO.DayDesc,
                    EndTime = FormatHelper.ToShortTime(scheduleDTO.EndTime, datetimeCulture),
                    FloorId = scheduleDTO.FloorId,
                    HasTimeConflict = scheduleDTO.HasTimeConflict,
                    OrgName = scheduleDTO.OrgName,
                    RoomId = scheduleDTO.RoomId,
                    ScheduledDays = new List<int>(),
                    ScheduledEndTime = new List<int>(),
                    ScheduledStartTime = new List<int>(),
                    StartTime = FormatHelper.ToShortTime(scheduleDTO.StartTime, datetimeCulture)
                };
                schedule.ScheduledStartTime.Add(scheduleDTO.StartTime.Hour);
                schedule.ScheduledStartTime.Add(scheduleDTO.StartTime.Minute);
                schedule.ScheduledStartTime.Add(scheduleDTO.StartTime.Second);
                schedule.ScheduledEndTime.Add(scheduleDTO.EndTime.Hour);
                schedule.ScheduledEndTime.Add(scheduleDTO.EndTime.Minute);
                schedule.ScheduledEndTime.Add(scheduleDTO.EndTime.Second);
                if (scheduleDTO.IsSunday)
                    schedule.ScheduledDays.Add(0);
                if (scheduleDTO.IsMonday)
                    schedule.ScheduledDays.Add(1);
                if (scheduleDTO.IsTuesday)
                    schedule.ScheduledDays.Add(2);
                if (scheduleDTO.IsWednesday)
                    schedule.ScheduledDays.Add(3);
                if (scheduleDTO.IsThursday)
                    schedule.ScheduledDays.Add(4);
                if (scheduleDTO.IsFriday)
                    schedule.ScheduledDays.Add(5);
                if (scheduleDTO.IsSaturday)
                    schedule.ScheduledDays.Add(6);
            }

            return schedule;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="schedulesDTO">The schedules dto.</param>
        /// <param name="datetimeCulture">The datetime culture.</param>
        /// <returns></returns>
        internal static List<ScheduleViewModel> ToViewModel(this List<Schedule> schedulesDTO, CultureInfo datetimeCulture)
        {
            List<ScheduleViewModel> schedules = null;
            if (schedulesDTO?.Count > 0)
            {
                schedules = new List<ScheduleViewModel>();
                foreach (Schedule itemSchedule in schedulesDTO)
                    schedules.Add(itemSchedule.ToViewModel(datetimeCulture));
            }
            return schedules;
        }

        /// <summary>
        /// Map the data from Department(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="deparmentsDTO">The deparments dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<Department> deparmentsDTO)
        {
            List<ListOptionViewModel> departments = null;

            if (deparmentsDTO?.Count > 0)
            {
                departments = deparmentsDTO.Select(p => new ListOptionViewModel
                {
                    Value = p.Code,
                    Description = p.Description
                }).ToList();
            }

            return departments;
        }

        /// <summary>
        /// Map the data from College(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="collegesDTO">The colleges dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<College> collegesDTO)
        {
            List<ListOptionViewModel> colleges = null;

            if (collegesDTO?.Count > 0)
            {
                colleges = collegesDTO.Select(p => new ListOptionViewModel
                {
                    Value = p.Code,
                    Description = p.Description
                }).ToList();
            }

            return colleges;
        }

        /// <summary>
        /// Map the data from Curriculum(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="curriculumsDTO">The curriculums dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<Curriculum> curriculumsDTO)
        {
            List<ListOptionViewModel> curriculumns = null;

            if (curriculumsDTO?.Count > 0)
            {
                curriculumns = curriculumsDTO.Select(p => new ListOptionViewModel
                {
                    Value = p.Code,
                    Description = p.Description
                }).ToList();
            }

            return curriculumns;
        }

        /// <summary>
        /// Map the data from ClassLevel(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="classLevelsDTO">The class levels dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<ClassLevel> classLevelsDTO)
        {
            List<ListOptionViewModel> classLevels = null;

            if (classLevelsDTO?.Count > 0)
            {
                classLevels = classLevelsDTO.Select(p => new ListOptionViewModel
                {
                    Value = p.Code,
                    Description = p.Description
                }).ToList();
            }

            return classLevels;
        }

        /// <summary>
        /// Map the data from Population(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="populationsDTO">The populations dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<Population> populationsDTO)
        {
            List<ListOptionViewModel> populations = null;

            if (populationsDTO?.Count > 0)
            {
                populations = populationsDTO.Select(p => new ListOptionViewModel
                {
                    Value = p.Code,
                    Description = p.Description
                }).ToList();
            }

            return populations;
        }

        /// <summary>
        /// Map the data from GeneralEducation(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="generalEducationListDTO">The general education list dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<GeneralEducation> generalEducationListDTO)
        {
            List<ListOptionViewModel> generalEducationList = null;

            if (generalEducationListDTO?.Count > 0)
            {
                generalEducationList = generalEducationListDTO.Select(p => new ListOptionViewModel
                {
                    Value = p.Code,
                    Description = p.Description
                }).ToList();
            }

            return generalEducationList;
        }

        /// <summary>
        /// Map the data from statementsDTO(DTO) to ListOptionViewModel.
        /// </summary>
        /// <param name="statementsDTO">The statements dto.</param>
        /// <param name="general">The general.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this Dictionary<int, DateTime> statementsDTO, InstitutionSettings.General general)
        {
            List<ListOptionViewModel> statementList = null;

            if (statementsDTO?.Count > 0)
            {
                CultureInfo datetimeCulture = FormatHelper.GetCustomDateTimeFormat(general.DateTimeCulture);
                statementList = statementsDTO.Select(p => new ListOptionViewModel
                {
                    Value = p.Key,
                    Description = $"{p.Key} - {FormatHelper.ToShortDate(p.Value, datetimeCulture)}"
                }).ToList();
            }

            return statementList;
        }

        /// <summary>
        /// Map financialAidPeriodsDTO list to ListOptionViewModel list
        /// </summary>
        /// <param name="financialAidPeriodsDTO">The financial aid periods dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<FinancialAidPeriod> financialAidPeriodsDTO)
        {
            List<ListOptionViewModel> periods = new();
            if (financialAidPeriodsDTO?.Count > 0)
            {
                foreach (FinancialAidPeriod item in financialAidPeriodsDTO)
                {
                    periods.Add(new ListOptionViewModel
                    {
                        Value = item.StudentAwardYearToken,
                        Description = item.AwardYearToken.ToString()
                    });
                }
            }
            return periods;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="eventTypeListDTO">The event type list dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<EventType> eventTypeListDTO)
        {
            List<ListOptionViewModel> eventTypeList = null;

            if (eventTypeListDTO?.Count > 0)
            {
                eventTypeList = eventTypeListDTO.Select(p => new ListOptionViewModel
                {
                    Value = p.Code,
                    Description = p.Description
                }).ToList();
            }

            return eventTypeList;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="creditTypeListDTO">The credit type list dto.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<CreditType> creditTypeListDTO)
        {
            List<ListOptionViewModel> creditTypeList = null;

            if (creditTypeListDTO?.Count > 0)
            {
                creditTypeList = creditTypeListDTO.Select(p => new ListOptionViewModel
                {
                    Value = p.Code,
                    Description = p.Description
                }).ToList();
            }

            return creditTypeList;
        }

        /// <summary>
        /// To the view model.
        /// </summary>
        /// <param name="assignments">The assignments.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<Assignment> assignments)
        {
            List<ListOptionViewModel> sectionGradeActivities = null;

            if (assignments?.Count > 0)
            {
                sectionGradeActivities = assignments.Select(s => new ListOptionViewModel
                {
                    Value = s.AssignmentId,
                    Description = s.Description + " - " + s.AssignmentTitle
                }).ToList();
            }
            return sectionGradeActivities;
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="codeTableList">The code table list.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<CodeTable> codeTableList)
        {
            List<ListOptionViewModel> optionViewModelList = new();
            if (codeTableList?.Count > 0)
            {
                foreach (CodeTable row in codeTableList)
                {
                    ListOptionViewModel listOptionViewModel = new()
                    {
                        Value = row.Id,
                        Description = row.Description
                    };
                    optionViewModelList.Add(listOptionViewModel);
                }
                return optionViewModelList;
            }
            return new List<ListOptionViewModel>();
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="codeTableList">The code table list.</param>
        /// <param name="byCode">if set to <c>true</c> [by code].</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<CodeTablePhoneFormat> codeTableList, bool byCode = false)
        {
            List<ListOptionViewModel> optionViewModelList = new();
            if (codeTableList?.Count > 0)
            {
                foreach (CodeTablePhoneFormat row in codeTableList)
                {
                    ListOptionViewModel listOptionViewModel = new()
                    {
                        Complement = row.PhoneFormat,
                        Value = byCode ? row.CodeValueKey : row.Id.ToString(),
                        Description = row.Description
                    };
                    optionViewModelList.Add(listOptionViewModel);
                }
                return optionViewModelList;
            }
            return new List<ListOptionViewModel>();
        }

        /// <summary>
        /// Converts to viewmodel.
        /// </summary>
        /// <param name="codeTableList">The code table list.</param>
        /// <returns></returns>
        internal static List<ListOptionViewModel> ToViewModel(this List<InstitutionSettingFilter> codeTableList)
        {
            List<ListOptionViewModel> optionViewModelList = new();
            if (codeTableList?.Count > 0)
            {
                foreach (InstitutionSettingFilter row in codeTableList)
                {
                    ListOptionViewModel listOptionViewModel = new()
                    {
                        Value = row.Id,
                        Description = row.Description
                    };
                    optionViewModelList.Add(listOptionViewModel);
                }
                return optionViewModelList;
            }
            return new List<ListOptionViewModel>();
        }

        /// <summary>
        /// Converts to viewmodelcomplement.
        /// </summary>
        /// <param name="people">The people.</param>
        /// <param name="nameFormat">The name format.</param>
        /// <param name="nameSort">The name sort.</param>
        /// <param name="showMiddleNameInitial">if set to <c>true</c> [show middle name initial].</param>
        /// <param name="peopleFormat">The people format.</param>
        /// <returns></returns>
        internal static ListOptionViewModel ToViewModelComplement(this People people, string nameFormat, string nameSort, bool showMiddleNameInitial, string peopleFormat = null)
        {
            ListOptionViewModel optionViewModel = null;

            if (people != null)
            {
                optionViewModel = new ListOptionViewModel();
                Dictionary<string, string> nameParts = FormatHelper.SetNamePartsToDictionary(
                    new string[]
                    {
                        people.Prefix,
                        people.FirstName,
                        people.MiddleName,
                        people.LastNamePrefix,
                        people.LastName,
                        people.DisplayName,
                        people.Pronoun,
                        people.Suffix
                    });
                optionViewModel.Description = FormatHelper.ToNameFormat(nameParts, nameFormat, showMiddleNameInitial);
                optionViewModel.Value = people.PersonId.Value;
                optionViewModel.Complement = people.ToContactViewModel(nameFormat, nameSort, showMiddleNameInitial, peopleFormat);
            }
            return optionViewModel;
        }
    }
}