IF EXISTS (SELECT *	FROM SYS.sysobjects	WHERE NAME = 'zAdd_TblError'AND XTYPE = 'U')
	DROP TABLE zAdd_TblError
GO
CREATE TABLE zAdd_TblError
(ID INT IDENTITY(1,1),
CERROR NVARCHAR(MAX),
CREATE_DATE DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)