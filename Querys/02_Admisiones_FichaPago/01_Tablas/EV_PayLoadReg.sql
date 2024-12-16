/****** Object:  Table [dbo].[EV_PayLoadReg]    Script Date: 11/5/2024 12:46:11 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[EV_PayLoadReg](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Id_Ficha] [int] NOT NULL,
	[Id_Application] [int] NOT NULL,
	[Id_Form] [int] NOT NULL,
	[Id_Program] [int] NOT NULL,
	[Legal_Name] [varchar](100) NOT NULL,
	[CURP] [varchar](25) NOT NULL,
	[Referencia] [varchar](25) NOT NULL,
	[Amount] [numeric](14, 6) NULL,
	[Due_Date] [datetime2](7) NULL,
	[CODE_CHARGECREDIT] [varchar](25) NULL,
	[ACA_YEAR] [varchar](10) NULL,
	[ACA_TERM] [varchar](10) NULL,
	[ACA_SESSION] [varchar](10) NULL,
	[Create_OPID] [varchar](25) NOT NULL,
	[Create_Date] [datetime2](7) NOT NULL,
	[Create_Time] [time](7) NOT NULL,
	[Status] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO