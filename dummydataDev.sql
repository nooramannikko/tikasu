INSERT INTO POSTITOIMIPAIKKA VALUES(1, 'Tampere');
INSERT INTO POSTITOIMIPAIKKA VALUES(2, 'Raahe');
INSERT INTO POSTITOIMIPAIKKA VALUES( , 'Helsinki');

INSERT INTO POSTINUMERO VALUES('33200', 1);
INSERT INTO POSTINUMERO VALUES('92100', 2);
INSERT INTO POSTINUMERO VALUES('00200', 3);

INSERT INTO OSOITE (Postinumero, Postiosoite) VALUES('33200', 'Tieteenkatu 2 b 17');
INSERT INTO OSOITE (Postinumero, Postiosoite) VALUES('92100', 'Rantakatu 18');
INSERT INTO OSOITE (Postinumero, Postiosoite) VALUES('00200', 'Mannerheimintie 18');

INSERT INTO TAPAHTUMANJARJESTAJA VALUES(1, '8736412-1', 'tapahtumalaarnio', 2);
INSERT INTO TAPAHTUMANJARJESTAJA VALUES(2, '4610760-4', 'tapahtumalasse', 3);

INSERT INTO SIHTEERI VALUES('sihteeri', 'salasana', 'Teemu Teekkari', '0501234567', 'teemu@teekkari.fi', 1);

INSERT INTO SIHTEERIJARJESTAJA VALUES('sihteeri', 1);
INSERT INTO SIHTEERIJARJESTAJA VALUES('sihteeri', 2);

INSERT INTO VASTUUHENKILO (Tunnus, Salasana, Nimi, Puhelin, Email, Osoite, Tapahtumanjarjestaja, Sihteeri)
VALUES('laarniotar', 'laarnionsana', 'Vastuu Henkilo', '04011122244', 'vastuu@henkilo.fi', 2, 1, 'sihteeri');
INSERT INTO VASTUUHENKILO (Tunnus, Salasana, Nimi, Puhelin, Email, Osoite, Tapahtumanjarjestaja, Sihteeri)
VALUES('lasselaarnio', 'lassensana', 'Lasse Laarnio', '0501325355', 'lasse@laarnio.fi', 3, 2, 'sihteeri');

INSERT INTO KATEGORIA VALUES(2, 'konsertti');
INSERT INTO KATEGORIA VALUES(3, 'tanssi');
INSERT INTO KATEGORIA VALUES(4, 'titesexboys');

-- Tapahtuma
INSERT INTO TAPAHTUMA (Nimi, Kategoria, Alv, Alkuaika, Loppuaika, Osoiteid, Vastuuhenkilo)
VALUES('Laarnio konsertti', 3, 24,  '2016-02-15 10:23:06', '2016-02-15 13:23:06', 2, 1);
INSERT INTO TAPAHTUMA (Nimi, Kategoria, Alv, Alkuaika, Loppuaika, Osoiteid, Vastuuhenkilo)
INSERT INTO TAPAHTUMA VALUES('Tanssiesitys', 3, 8,  '2016-02-19 10:23:06', '2016-02-19 15:20:03', 3, 2);

-- Katsomot
INSERT INTO KATSOMO VALUES(1, 'hartwallareena');
INSERT INTO KATSOMO VALUES(2, 'seisomakatsomo');

-- Tapahtumien ja katsomoiden väliset suhteet
INSERT INTO TAPAHTUMAKATSOMO VALUES(1, 2);
INSERT INTO TAPAHTUMAKATSOMO VALUES(2, 1);

-- Hartwall areenan paikkoja
-- Id, rivi, paikka, katsomoId
INSERT INTO KATSOMOPAIKKA (Rivi, Paikka, Katsomo)
VALUES(1, 1, 1);
INSERT INTO KATSOMOPAIKKA (Rivi, Paikka, Katsomo)
VALUES(1, 2, 1);
INSERT INTO KATSOMOPAIKKA (Rivi, Paikka, Katsomo)
VALUES(1, 3, 1);
INSERT INTO KATSOMOPAIKKA (Rivi, Paikka, Katsomo)
VALUES(4, 1, 4, 1);

-- Seisomakatsomon paikkoja
INSERT INTO KATSOMOPAIKKA (Rivi, Paikka, Katsomo)
VALUES(6, 1, 2);
INSERT INTO KATSOMOPAIKKA (Rivi, Paikka, Katsomo)
VALUES(7, 2, 2);
INSERT INTO KATSOMOPAIKKA (Rivi, Paikka, Katsomo)
VALUES(8, 3, 2);
INSERT INTO KATSOMOPAIKKA (Rivi, Paikka, Katsomo)
VALUES(9, 4, 2);

-- Lipputyypit
INSERT INTO TYYPPI VALUES(1, 'opiskelija');
INSERT INTO TYYPPI VALUES(2, 'normaali');
INSERT INTO TYYPPI VALUES(3, 'elakelainen');

-- Liput
-- lipun numero, hinta, tyyppi, tarkastettu, tila, tapahtuma, katsomopaikka
INSERT INTO LIPPU VALUES(1234, 20, 1, false, 1, 1, 5);
INSERT INTO LIPPU VALUES(5156, 20, 1, false, 2, 1, 6);
INSERT INTO LIPPU VALUES(1335, 50, 2, true, 2, 2, 1);
INSERT INTO LIPPU VALUES(1337, 25, 3, false, 1, 2, 2);
