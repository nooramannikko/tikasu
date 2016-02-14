REVOKE CONNECT ON DATABASE "LippuLasse" FROM PUBLIC;

CREATE SCHEMA vastuuhenkilo_rajattu;
CREATE ROLE vastuuhenkilo LOGIN PASSWORD '430VJMY42%4r';
GRANT CONNECT ON DATABASE "LippuLasse" TO vastuuhenkilo;
GRANT USAGE ON SCHEMA vastuuhenkilo_rajattu TO vastuuhenkilo;

-- Vastuuhenkilo needs all basic CRUD operations on TAPAHTUMA
GRANT SELECT, INSERT, UPDATE, DELETE ON TAPAHTUMA TO vastuuhenkilo;
GRANT USAGE, SELECT ON SEQUENCE tapahtuma_id_seq TO vastuuhenkilo;

-- Vastuuhenkilo also needs all basic CRUD operations on KATSOMO and KATSOMOPAIKKA
GRANT SELECT, INSERT, UPDATE, DELETE ON KATSOMO TO vastuuhenkilo;
-- Also grant permissions to sequences (auto increment pks)
GRANT USAGE, SELECT ON SEQUENCE katsomo_id_seq TO vastuuhenkilo;
GRANT SELECT, INSERT, UPDATE, DELETE ON KATSOMOPAIKKA TO vastuuhenkilo;
GRANT USAGE, SELECT ON SEQUENCE katsomopaikka_id_seq TO vastuuhenkilo;
GRANT SELECT, INSERT, UPDATE, DELETE ON TAPAHTUMAKATSOMO TO vastuuhenkilo;
GRANT USAGE, SELECT ON SEQUENCE tapahtumakatsomo_id_seq TO vastuuhenkilo;

-- For special ticket price offer management (if this is vastuuhenkilos job) vastuuhenkilo also needs
-- basic CRUD on related tables
GRANT SELECT, INSERT, UPDATE, DELETE ON HINTATARJOUS TO vastuuhenkilo;
GRANT USAGE, SELECT ON SEQUENCE hintatarjous_id_seq TO vastuuhenkilo;
GRANT SELECT, INSERT, UPDATE, DELETE ON HINTATARJOUSLIPPU TO vastuuhenkilo;

-- In this exercise vastuuhenkilo also needs select (and crud) on following tables
GRANT SELECT ON LIPPU TO vastuuhenkilo;
GRANT SELECT ON KATEGORIA TO vastuuhenkilo;
GRANT SELECT, INSERT, UPDATE, DELETE ON OSOITE TO vastuuhenkilo;
-- Also grant permissions to sequences (auto increment pks)
GRANT USAGE, SELECT ON SEQUENCE osoite_id_seq TO vastuuhenkilo;
GRANT SELECT, INSERT, UPDATE, DELETE ON POSTINUMERO TO vastuuhenkilo;
GRANT SELECT, INSERT, UPDATE, DELETE ON POSTITOIMIPAIKKA TO vastuuhenkilo;

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
	KATEGORIA.Nimi AS Kategoria,
	KATEGORIA.Id AS KategoriaId,
	OSOITE.Postiosoite,
	POSTINUMERO.Postinumero,
	POSTINUMERO.Postitoimipaikka,
	COALESCE(AVG(LIPPU.HINTA), 0) AS VerotonKeskihinta,
	COUNT(LIPPU) AS Yleisomaara,
	COALESCE(SUM(LIPPU.HINTA), 0) AS MyyntiVeroton,
	COALESCE((TAPAHTUMA.Alv::float / 100::float) * (SUM(LIPPU.HINTA)::float), 0) AS ALVOsuus,
	COALESCE((1 + (TAPAHTUMA.Alv::float / 100::float)) * (SUM(LIPPU.HINTA)::float), 0) AS MyyntiVerollinen 
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
GROUP BY TAPAHTUMA.Id, KATEGORIA.Nimi, KATEGORIA.Id, OSOITE.Postiosoite, POSTINUMERO.Postinumero, POSTINUMERO.Postitoimipaikka;

GRANT SELECT ON RAPORTTI TO vastuuhenkilo;

-- Limit userdata to only users that belong to tapahtumanjarjestaja "tapahtumalaarnio".
-- This is simply a security measure to isolate organization specific data.
CREATE VIEW TAPAHTUMALAARNIO_VASTUUHENKILO AS
SELECT
    Id,
    Tunnus,
    Salasana,
    Nimi,
    Puhelin,
    Email,
    Osoite,
    Tapahtumanjarjestaja,
    Sihteeri
FROM VASTUUHENKILO
WHERE Tapahtumanjarjestaja = 1;

GRANT SELECT ON TAPAHTUMALAARNIO_VASTUUHENKILO TO vastuuhenkilo;

GRANT SELECT ON TAPAHTUMANJARJESTAJA TO vastuuhenkilo;