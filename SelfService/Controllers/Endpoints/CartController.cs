// --------------------------------------------------------------------
// <copyright file="CartController.cs" company="Ellucian">
//     Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Hedtech.PowerCampus.Core.DTO.Student;
using Hedtech.PowerCampus.Core.Interfaces.Helpers;
using Hedtech.PowerCampus.Core.Interfaces.Services;
using Hedtech.PowerCampus.Logger;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelfService.Filters;
using SelfService.Mappers;
using SelfService.Models.Registration;
using System;
using System.Collections.Generic;

namespace SelfService.Controllers.Endpoints
{
    /// <summary>
    /// Controller with endpoints for /Cart route
    /// </summary>
    /// <seealso cref="BaseEndpointController" />
    [Authorize]
    [TypeFilter(typeof(SessionExpiredAttribute), Arguments = new object[] { true, false })]
    public class CartController : BaseEndpointController
    {
        /// <summary>
        /// The cart service
        /// </summary>
        private readonly ICartService _cartService;

        /// <summary>
        /// The logger
        /// </summary>
        private readonly IAppLogger<CartController> _logger;

        /// <summary>
        /// The temporary user service
        /// </summary>
        private readonly ITemporaryUserService _temporaryUserService;

        /// <summary>
        /// Initializes a new instance of the <see cref="CartController"/> class.
        /// </summary>
        /// <param name="cartService">The cart service.</param>
        /// <param name="serializationHelper">The serialization helper.</param>
        /// <param name="temporaryUserService">The temporary user service.</param>
        /// <param name="logger">The logger.</param>
        public CartController(
            ICartService cartService,
            ISerializationHelper serializationHelper,
            ITemporaryUserService temporaryUserService,
            IAppLogger<CartController> logger)
            : base(serializationHelper)
        {
            _cartService = cartService;
            _temporaryUserService = temporaryUserService;

            _logger = logger;
        }

        /// <summary>
        /// Endpoint to get the count of items in the cart.
        /// </summary>
        /// <returns>JsonResult</returns>
        [HttpGet]
        [Route("Cart/Count")]
        [TypeFilter(typeof(NoDirectAccessAttribute))]
        public JsonResult Count()
        {
            try
            {
                List<CartItem> cartItemList = null;
                if (Account.PersonId > 0)
                {
                    cartItemList = _cartService.Get(Account.PersonId);
                }
                else if (Account.TemporaryUserId > 0)
                {
                    cartItemList = new List<CartItem>
                    {
                        new CartItem
                        {
                            IsConEd = true,
                            Items = _temporaryUserService.GetSectionsCount(Account.TemporaryUserId)
                        }
                    };
                }
                return Json(SerializationHelper.ToJsonResult(cartItemList.ToViewModel()));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CartController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Creates the specified cart model.
        /// </summary>
        /// <param name="model">The cart model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Cart/Create")]
        [TypeFilter(typeof(ImpersonateAttribute))]
        public JsonResult Create([FromBody] CartModel model)
        {
            try
            {
                if (model is null)
                    throw new ArgumentNullException(nameof(model));

                int sectionId = model.Id;
                int personId = model.ImpersonateInfo?.PersonId > 0 ? model.ImpersonateInfo.PersonId : Account.PersonId;
                bool success = false;

                if (personId > 0)
                    success = _cartService.Create(personId, sectionId);
                else if (Account.TemporaryUserId > 0)
                    success = _temporaryUserService.CreateSection(Account.TemporaryUserId, sectionId);

                if (success)
                    return Json(SerializationHelper.ToJsonResult(sectionId));

                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CartController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Function to delete a section from the cart.
        /// </summary>
        /// <param name="id">The section identifier.</param>
        /// <returns>JsonResult</returns>
        [HttpPost]
        [Route("Cart/Delete")]
        public JsonResult Delete([FromBody] int id)
        {
            try
            {
                bool success = false;
                if (Account.PersonId > 0)
                    success = _cartService.Delete(Account.PersonId, id);
                else if (Account.TemporaryUserId > 0)
                    success = _temporaryUserService.DeleteSection(Account.TemporaryUserId, id);

                if (success)
                    return Json(SerializationHelper.ToJsonResult(id));
                return Json(SerializationHelper.ToJsonResult(null, null, 0, false));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CartController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }

        /// <summary>
        /// Edits the type of the credit.
        /// </summary>
        /// <param name="cartCreditTypeModel">The cart credit type model.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Cart/EditCreditType")]
        public JsonResult EditCreditType([FromBody] CartCreditTypeModel cartCreditTypeModel)
        {
            try
            {
                bool wasUpdated = _cartService.UpdateCreditType(Account.PersonId, cartCreditTypeModel.Id, cartCreditTypeModel.CreditType);
                return Json(SerializationHelper.ToJsonResult(wasUpdated));
            }
            catch (Exception exception)
            {
                _logger.LogError(Constants._product, typeof(CartController).FullName, exception.Message, exception);
                return Json(SerializationHelper.ToJsonResult(null, null, 500, false));
            }
        }
    }
}