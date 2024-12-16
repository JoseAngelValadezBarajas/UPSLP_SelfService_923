Create Table zAdd_tblOpenPayTransactionId
(
/***********************************************************************
Description:
	Tabla para almacenar la relación del Id de Transacción de PC con la de OpenPay.
Revision History:
	2024-12-02 Addvantit-AMartinez. - Creación
************************************************************************/
ID int identity(1,1),
PaymentTransactionId int,
OpenPayId nvarchar(50))