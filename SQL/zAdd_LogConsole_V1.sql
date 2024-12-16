CREATE TABLE zAdd_LogConsole (
    LogId INT IDENTITY(1,1) PRIMARY KEY, -- Identificador único de cada log
    Message NVARCHAR(MAX) NOT NULL, -- El mensaje de log, que puede ser el mensaje de error o cualquier otro texto
    LogDate DATETIME NOT NULL DEFAULT GETDATE() -- La fecha y hora en que se creó el log
);




