REVOKE CONNECT ON DATABASE "LippuLasse" FROM PUBLIC;

CREATE SCHEMA vastuuhenkilo_rajattu;
CREATE ROLE vastuuhenkilo LOGIN PASSWORD 'Salasana123';
GRANT CONNECT ON DATABASE "LippuLasse" TO vastuuhenkilo;
GRANT USAGE ON SCHEMA vastuuhenkilo_rajattu TO vastuuhenkilo;

-- Vastuuhenkilo needs all basic CRUD operations on TAPAHTUMA
GRANT SELECT, INSERT, UPDATE, DELETE ON TAPAHTUMA TO vastuuhenkilo;

-- Vastuuhenkilo also needs all basic CRUD operations on KATSOMO and KATSOMOPAIKKA
GRANT SELECT, INSERT, UPDATE, DELETE ON KATSOMO TO vastuuhenkilo;
GRANT SELECT, INSERT, UPDATE, DELETE ON KATSOMOPAIKKA TO vastuuhenkilo;
GRANT SELECT, INSERT, UPDATE, DELETE ON TAPAHTUMAKATSOMO TO vastuuhenkilo;

-- For special ticket price offer management (if this is vastuuhenkilos job) vastuuhenkilo also needs
-- basic CRUD on related tables
GRANT SELECT, INSERT, UPDATE, DELETE ON HINTATARJOUS TO vastuuhenkilo;
GRANT SELECT, INSERT, UPDATE, DELETE ON HINTATARJOUSLIPPU TO vastuuhenkilo;

-- For ticket sale report generation RAPORTTI view is created
-- More views can be created as needed (Like maybe a view for easy ticket printing containing both event name and place info)
CREATE VIEW RAPORTTI AS
SELECT
    TAPAHTUMA.Id,
	TAPAHTUMA.Nimi,
	TAPAHTUMA.Alv,
	TAPAHTUMA.Alkuaika,
	TAPAHTUMA.Loppuaika,
	TAPAHTUMA.Vastuuhenkilo,
	KATEGORIA.Nimi,
	OSOITE.Postiosoite,
	POSTINUMERO.Postinumero,
	POSTINUMERO.Postitoimipaikka,
	AVG(LIPPU.HINTA) AS VerotonKeskihinta,
	COUNT(LIPPU) AS Yleisomaara,
	SUM(LIPPU.HINTA) AS MyyntiVeroton,
	(TAPAHTUMA.Alv::float / 100::float) * (SUM(LIPPU.HINTA)::float) AS ALVOsuus,
	(1 + (TAPAHTUMA.Alv::float / 100::float)) * (SUM(LIPPU.HINTA)::float) AS MyyntiVerollinen 
FROM TAPAHTUMA
	LEFT OUTER JOIN LIPPU ON (
		TAPAHTUMA.Id = LIPPU.Tapahtuma AND
		LIPPU.Tila = 1 -- "Sold"
	)
	LEFT OUTER JOIN KATEGORIA ON (
	    TAPAHTUMA.Kategoria = KATEGORIA.Id
	)
	LEFT OUTER JOIN OSOITE ON (
	    TAPAHTUMA.Osoiteid = Osoite.Id
	)
	LEFT OUTER JOIN POSTINUMERO ON (
	    OSOITE.Postinumero = POSTINUMERO.Postinumero
	)
GROUP BY TAPAHTUMA.Id;

GRANT SELECT ON RAPORTTI TO vastuuhenkilo;
