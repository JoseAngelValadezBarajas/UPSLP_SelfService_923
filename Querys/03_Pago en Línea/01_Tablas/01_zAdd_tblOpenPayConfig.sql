Create Table zAdd_tblOpenPayConfig
(
/***********************************************************************
Description:
	Tabla para almacenar la confiugración de OpenPay.
Revision History:
	2024-12-02 Addvantit-AMartinez. - Creación
************************************************************************/
Id Int Identity(1,1)
,OpenPayMerchantId nvarchar(50) Not Null
,OpenPayApiKey nvarchar(50) Not Null
,OpenPayProduction bit Not Null Default 0)