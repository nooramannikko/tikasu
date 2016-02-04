INSERT INTO POSTITOIMIPAIKKA VALUES(1, 'Tampere');
INSERT INTO POSTITOIMIPAIKKA VALUES(2, 'Raahe');
INSERT INTO POSTITOIMIPAIKKA VALUES(3, 'Helsinki');

INSERT INTO POSTINUMERO VALUES('33200', 1);
INSERT INTO POSTINUMERO VALUES('92100', 2);
INSERT INTO POSTINUMERO VALUES('00200', 3);

INSERT INTO OSOITE VALUES(1, '33200', 'Tieteenkatu 2 b 17');
INSERT INTO OSOITE VALUES(2, '92100', 'Rantakatu 18');
INSERT INTO OSOITE VALUES(3, '00200', 'Mannerheimintie 18');

INSERT INTO TAPAHTUMANJARJESTAJA VALUES(1, '8736412-1', 'tapahtumalaarnio', 2);
INSERT INTO TAPAHTUMANJARJESTAJA VALUES(2, '4610760-4', 'tapahtumalasse', 3);

INSERT INTO SIHTEERI VALUES('sihteeri', 'salasana', 'Teemu Teekkari', '0501234567', 'teemu@teekkari.fi', 1);

INSERT INTO SIHTEERIJARJESTAJA VALUES('sihteeri', 1);
INSERT INTO SIHTEERIJARJESTAJA VALUES('sihteeri', 2);

INSERT INTO VASTUUHENKILO VALUES(1, 'laarniotar', 'laarnionsana', 'Vastuu Henkilo', '04011122244', 'vastuu@henkilo.fi', 2, '8736412-1', 'sihteeri');
INSERT INTO VASTUUHENKILO VALUES(2, 'lasselaarnio', 'lassensana', 'Lasse Laarnio', '0501325355', 'lasse@laarnio.fi', 3, '4610760-4', 'sihteeri');

INSERT INTO KATEGORIA VALUES(2, 'konsertti');
INSERT INTO KATEGORIA VALUES(3, 'tanssi');
INSERT INTO KATEGORIA VALUES(4, 'titesexboys');

-- Tapahtuma
INSERT INTO TAPAHTUMA VALUES(1, 'Laarnio konsertti', 3, 24,  '2016-02-15 10:23:06', '2016-02-15 13:23:06', 2, 1);
INSERT INTO TAPAHTUMA VALUES(2, 'Tanssiesitys', 3, 8,  '2016-02-19 10:23:06', '2016-02-19 15:20:03', 3, 2);

-- Katsomot
INSERT INTO KATSOMO VALUES(1, 'hartwallareena');
INSERT INTO KATSOMO VALUES(2, 'seisomakatsomo');

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
INSERT INTO TYYPPI VALUES(1, 'opiskelija');
INSERT INTO TYYPPI VALUES(2, 'normaali');
INSERT INTO TYYPPI VALUES(3, 'elakelainen');

-- Liput
-- lipun numero, hinta, tyyppi, tarkastettu, tila, tapahtuma, katsomopaikka
INSERT INTO LIPPU VALUES(1234, 20, 1, false, 1, 1, 5);
INSERT INTO LIPPU VALUES(5156, 20, 1, false, 2, 1, 6);
INSERT INTO LIPPU VALUES(1335, 50, 2, true, 2, 2, 1);
INSERT INTO LIPPU VALUES(1337, 25, 3, false, 1, 2, 2);
