REVOKE CONNECT ON DATABASE LippuLasse FROM PUBLIC;

CREATE SCHEMA vastuuhenkilo_rajattu;
CREATE ROLE vastuuhenkilo LOGIN PASSWORD 'Salasana123';
GRANT CONNECT ON DATABASE LippuLasse TO vastuuhenkilo;
GRANT USAGE ON SCHEMA vastuuhenkilo_rajattu TO vastuuhenkilo;

-- Vastuuhenkilo needs all basic CRUD operations on TAPAHTUMA
GRANT SELECT, INSERT, UPDATE, DELETE ON TAPAHTUMA TO vastuuhenkilo;

CREATE VIEW RAPORTTI AS
SELECT 
	TAPAHTUMA.*,
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
GROUP BY TAPAHTUMA.Id;

GRANT SELECT ON RAPORTTI TO vastuuhenkilo;
