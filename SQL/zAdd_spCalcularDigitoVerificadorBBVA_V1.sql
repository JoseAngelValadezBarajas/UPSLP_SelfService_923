GO

CREATE PROCEDURE zAdd_spCalcularDigitoVerificadorBBVA
    @referencia NVARCHAR(18),
    @lineaCaptura NVARCHAR(20) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- Paso 1: Convertir la referencia alfanum�rica a n�meros
    DECLARE @referenciaNumerica NVARCHAR(18) = '';
    DECLARE @i INT = 1;
    WHILE @i <= LEN(@referencia)
    BEGIN
        DECLARE @caracter CHAR(1) = SUBSTRING(@referencia, @i, 1);
        -- Verificar si es un d�gito
        IF @caracter LIKE '[0-9]'
        BEGIN
            SET @referenciaNumerica = @referenciaNumerica + @caracter;
        END
        -- Verificar si es una letra y convertirla
        ELSE
        BEGIN
            SET @referenciaNumerica = @referenciaNumerica + 
                CASE @caracter
                    WHEN 'A' THEN '1'
                    WHEN 'B' THEN '2'
                    WHEN 'C' THEN '3'
                    WHEN 'D' THEN '4'
                    WHEN 'E' THEN '5'
                    WHEN 'F' THEN '6'
                    WHEN 'G' THEN '7'
                    WHEN 'H' THEN '8'
                    WHEN 'I' THEN '9'
                    WHEN 'J' THEN '1'
                    WHEN 'K' THEN '2'
                    WHEN 'L' THEN '3'
                    WHEN 'M' THEN '4'
                    WHEN 'N' THEN '5'
                    WHEN 'O' THEN '6'
                    WHEN 'P' THEN '7'
                    WHEN 'Q' THEN '8'
                    WHEN 'R' THEN '9'
                    WHEN 'S' THEN '1'
                    WHEN 'T' THEN '2'
                    WHEN 'U' THEN '3'
                    WHEN 'V' THEN '4'
                    WHEN 'W' THEN '5'
                    WHEN 'X' THEN '6'
                    WHEN 'Y' THEN '7'
                    WHEN 'Z' THEN '8'
                    ELSE '0'
                END;
        END
        SET @i = @i + 1;
    END

    -- Paso 2: Aplicar los ponderadores
    DECLARE @ponderadores TABLE (Pos INT, Ponderador INT);
    INSERT INTO @ponderadores VALUES (1, 13), (2, 11), (3, 23), (4, 19), (5, 17), 
                                       (6, 13), (7, 11), (8, 23), (9, 19), (10, 17), 
                                       (11, 13), (12, 11), (13, 23), (14, 19), (15, 17),
                                       (16, 13), (17, 11), (18, 13);

    DECLARE @suma INT = 0;
    DECLARE @pos INT = 1;
    WHILE @pos <= LEN(@referenciaNumerica)
    BEGIN
        DECLARE @digito INT = CAST(SUBSTRING(@referenciaNumerica, @pos, 1) AS INT);
        DECLARE @ponderador INT = (SELECT Ponderador FROM @ponderadores WHERE Pos = @pos);
        SET @suma = @suma + (@digito * @ponderador);
        SET @pos = @pos + 1;
    END

    -- Paso 3: Sumar la constante 330
    DECLARE @resultadoFinal INT = @suma + 330;

    -- Paso 4: Calcular el d�gito verificador
    DECLARE @digitoVerificador INT = (@resultadoFinal % 97) + 1;

    -- Paso 5: Generar la l�nea de captura
    SET @lineaCaptura = @referencia + CAST(@digitoVerificador AS NVARCHAR(2));

    -- Retornar el resultado
    SELECT @lineaCaptura AS LineaCaptura;
END;





