Create Table zAdd_tblOpenPayTransactionId
(
/***********************************************************************
Description:
	Tabla para almacenar la relaci�n del Id de Transacci�n de PC con la de OpenPay.
Revision History:
	2024-12-02 Addvantit-AMartinez. - Creaci�n
************************************************************************/
ID int identity(1,1),
PaymentTransactionId int,
OpenPayId nvarchar(50))