INSERT INTO POSTITOIMIPAIKKA (Postitoimipaikka) VALUES ('Tampere');
INSERT INTO POSTITOIMIPAIKKA (Postitoimipaikka) VALUES ('Raahe');
INSERT INTO POSTITOIMIPAIKKA (Postitoimipaikka) VALUES ('Helsinki');

INSERT INTO POSTINUMERO VALUES('33200', 1);
INSERT INTO POSTINUMERO VALUES('92100', 2);
INSERT INTO POSTINUMERO VALUES('00200', 3);

INSERT INTO OSOITE VALUES(1, '33200', 'Tieteenkatu 2 b 17');
INSERT INTO OSOITE VALUES(2, '92100', 'Rantakatu 18');
INSERT INTO OSOITE VALUES(3, '00200', 'Mannerheimintie 18');

INSERT INTO TAPAHTUMANJARJESTAJA (YTunnus, Nimi, Osoite) VALUES('8736412-1', 'tapahtumalaarnio', 2);
INSERT INTO TAPAHTUMANJARJESTAJA (YTunnus, Nimi, Osoite) VALUES('4610760-4', 'tapahtumalasse', 3);

INSERT INTO SIHTEERI VALUES('sihteeri', 'salasana', 'Teemu Teekkari', '0501234567', 'teemu@teekkari.fi', 1);

INSERT INTO SIHTEERIJARJESTAJA VALUES('sihteeri', 1);
INSERT INTO SIHTEERIJARJESTAJA VALUES('sihteeri', 2);

INSERT INTO VASTUUHENKILO VALUES(1, 'laarniotar', 'laarnionsana', 'Vastuu Henkilo', '04011122244', 'vastuu@henkilo.fi', 2, 1, 'sihteeri');
INSERT INTO VASTUUHENKILO VALUES(2, 'lasselaarnio', 'lassensana', 'Lasse Laarnio', '0501325355', 'lasse@laarnio.fi', 3, 2, 'sihteeri');

INSERT INTO KATEGORIA (Nimi) VALUES('kosertti');
INSERT INTO KATEGORIA (Nimi) VALUES('tanssi');
INSERT INTO KATEGORIA (Nimi) VALUES('titesexboys');

-- Tapahtuma
INSERT INTO TAPAHTUMA VALUES(1, 'Laarnio konsertti', 3, 24,  '2016-02-15 10:23:06', '2016-02-15 13:23:06', 2, 1);
INSERT INTO TAPAHTUMA VALUES(2, 'Tanssiesitys', 3, 8,  '2016-02-19 10:23:06', '2016-02-19 15:20:03', 3, 2);

-- Katsomot
INSERT INTO KATSOMO (Nimi) VALUES('hartwallareena');
INSERT INTO KATSOMO (Nimi) VALUES('seisomakatsomo');

-- Tapahtumien ja katsomoiden väliset suhteet
INSERT INTO TAPAHTUMAKATSOMO VALUES(1, 2);
INSERT INTO TAPAHTUMAKATSOMO VALUES(2, 1);

-- Hartwall areenan paikkoja
-- Id, rivi, paikka, katsomoId
INSERT INTO KATSOMOPAIKKA VALUES(1, 1, 1, 1);
INSERT INTO KATSOMOPAIKKA VALUES(2, 1, 2, 1);
INSERT INTO KATSOMOPAIKKA VALUES(3, 1, 3, 1);
INSERT INTO KATSOMOPAIKKA VALUES(4, 1, 4, 1);

-- Seisomakatsomon paikkoja
INSERT INTO KATSOMOPAIKKA VALUES(5, 6, 1, 2);
INSERT INTO KATSOMOPAIKKA VALUES(6, 7, 2, 2);
INSERT INTO KATSOMOPAIKKA VALUES(7, 8, 3, 2);
INSERT INTO KATSOMOPAIKKA VALUES(8, 9, 4, 2);

-- Lipputyypit
INSERT INTO TYYPPI (Nimi) VALUES('opiskelija');
INSERT INTO TYYPPI (Nimi) VALUES('normaali');
INSERT INTO TYYPPI (Nimi) VALUES('elakelainen');

-- Liput
-- lipun numero, hinta, tyyppi, tarkastettu, tila, tapahtuma, katsomopaikka
INSERT INTO LIPPU (Hinta, Tyyppi, Tarkistettu, Tila, Tapahtuma, Katsomopaikka) VALUES(20, 1, false, 1, 1, 5);
INSERT INTO LIPPU (Hinta, Tyyppi, Tarkistettu, Tila, Tapahtuma, Katsomopaikka) VALUES(20, 1, false, 2, 1, 6);
INSERT INTO LIPPU (Hinta, Tyyppi, Tarkistettu, Tila, Tapahtuma, Katsomopaikka) VALUES(50, 2, true, 2, 2, 1);
INSERT INTO LIPPU (Hinta, Tyyppi, Tarkistettu, Tila, Tapahtuma, Katsomopaikka) VALUES(25, 3, false, 1, 2, 2);
