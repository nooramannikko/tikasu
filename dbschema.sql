-- Tämä tiedosto sisältää skriptit taulujen luomiseksi
-- Taulujen luomisen yhteydessä niille määritetään pää- ja vierasavaimet
-- Lisäksi määritellään tarkistuksia, jotka tehdään myös kantatasolla
-- Pääosa tarkastuksista suoritetaan palvelin- ja käyttöliittymätasolla

-- Ennen taulun luomista, poistetaan mahdolliset aiemmin luodut taulut
-- Postitoimipaikka ei voi olla tyhjä
DROP TABLE IF EXISTS POSTITOIMIPAIKKA;
CREATE TABLE if not exists POSTITOIMIPAIKKA(
    Postitoimipaikka VARCHAR(30) NOT NULL PRIMARY KEY CHECK(length(Postitoimipaikka)>0)
);

DROP TABLE IF EXISTS POSTINUMERO;
-- Postinumerot ovat uniikkeja ja liittyvät postitoimipaikkaan
-- Postinumerot suomessa ovat 5-merkkiä pitkiä, ja koostuvat vain numeroista
CREATE TABLE if not exists POSTINUMERO(
    Postinumero CHAR(5) NOT NULL PRIMARY KEY CHECK(Postinumero ~* '^[0-9]{5}'),
    Postitoimipaikka VARCHAR(30) REFERENCES POSTITOIMIPAIKKA (Postitoimipaikka)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
);

-- Osoite koostuu postiosoitteesta ja postinumerosta, johon viitataan
DROP TABLE IF EXISTS OSOITE;
CREATE TABLE if not exists OSOITE(
    Id SERIAL PRIMARY KEY,
    Postinumero CHAR(5) REFERENCES POSTINUMERO (Postinumero)
            ON DELETE RESTRICT
            ON UPDATE CASCADE,
    Postiosoite varchar(100) CHECK(length(Postiosoite)>0)
);

-- Tarkistetaan oikeat y-tunnukset
DROP TABLE IF EXISTS TAPAHTUMANJARJESTAJA;
CREATE TABLE if not exists TAPAHTUMANJARJESTAJA(
    Id SERIAL NOT NULL PRIMARY KEY,
    YTunnus varchar(9) 
      CHECK(
        -- Check if tunnus is exactly 9 characters long
        length(YTunnus)=9 AND
        -- Check that seven first characters are numeric
        (substring(YTunnus FROM 1 FOR 7) ~* '^[0-9]{7}') AND
        -- Check that 8th character is "-"
        (substring(YTunnus FROM 8 FOR 1) = '-') AND
        -- Check that last character is correct validation number
        -- http://www.finlex.fi/fi/laki/ajantasa/2001/20010288

        -- If sum%11 is not 1
        ((((substring(YTunnus FROM 7 FOR 1))::int) * 2 +
        ((substring(YTunnus FROM 6 FOR 1))::int) * 4 +
        ((substring(YTunnus FROM 5 FOR 1))::int) * 8 +
        ((substring(YTunnus FROM 4 FOR 1))::int) * 5 +
        ((substring(YTunnus FROM 3 FOR 1))::int) * 10 +
        ((substring(YTunnus FROM 2 FOR 1))::int) * 9 +
        ((substring(YTunnus FROM 1 FOR 1))::int) * 7 ) % 11 != 1) AND

        -- If sum%11 is zero
        (((((substring(YTunnus FROM 7 FOR 1))::int) * 2 +
        ((substring(YTunnus FROM 6 FOR 1))::int) * 4 +
        ((substring(YTunnus FROM 5 FOR 1))::int) * 8 +
        ((substring(YTunnus FROM 4 FOR 1))::int) * 5 +
        ((substring(YTunnus FROM 3 FOR 1))::int) * 10 +
        ((substring(YTunnus FROM 2 FOR 1))::int) * 9 +
        ((substring(YTunnus FROM 1 FOR 1))::int) * 7 ) % 11 = 0 AND
        -- then validation number is zero
        substring(YTunnus FROM 9 FOR 1) = '0') OR

        -- If sum%11 is greater than 1
        ((((substring(YTunnus FROM 7 FOR 1))::int) * 2 +
        ((substring(YTunnus FROM 6 FOR 1))::int) * 4 +
        ((substring(YTunnus FROM 5 FOR 1))::int) * 8 +
        ((substring(YTunnus FROM 4 FOR 1))::int) * 5 +
        ((substring(YTunnus FROM 3 FOR 1))::int) * 10 +
        ((substring(YTunnus FROM 2 FOR 1))::int) * 9 +
        ((substring(YTunnus FROM 1 FOR 1))::int) * 7 ) % 11 > 1 AND
        -- then validation number is 11 - sum%11
        ((substring(YTunnus FROM 9 FOR 1))::int) =
        (11 - ((((substring(YTunnus FROM 7 FOR 1))::int) * 2 +
        ((substring(YTunnus FROM 6 FOR 1))::int) * 4 +
        ((substring(YTunnus FROM 5 FOR 1))::int) * 8 +
        ((substring(YTunnus FROM 4 FOR 1))::int) * 5 +
        ((substring(YTunnus FROM 3 FOR 1))::int) * 10 +
        ((substring(YTunnus FROM 2 FOR 1))::int) * 9 +
        ((substring(YTunnus FROM 1 FOR 1))::int) * 7 ) % 11))))

      ),
    Nimi varchar(60),
    Osoite INTEGER REFERENCES Osoite (Id)
          ON DELETE RESTRICT
          ON UPDATE RESTRICT
);

-- Sihteerin pääavaimena uniikki tunnus
-- Sihteerin ja tapahtumanjärjestäjän välinen suhde erillisessä taulussa
DROP TABLE IF EXISTS SIHTEERI;
CREATE TABLE if not exists SIHTEERI(
    Tunnus varchar(20) NOT NULL PRIMARY KEY CHECK(length(Tunnus)>7),
    Salasana varchar(60) NOT NULL CHECK(length(Salasana)>7),
    Nimi varchar(201) NOT NULL CHECK(length(Nimi)>0),
    Puhelin varchar(12) NOT NULL CHECK(length(Puhelin)>0),
    Email varchar(60) NOT NULL CHECK(length(Email)>0),
    Osoite INTEGER REFERENCES Osoite (Id)
          ON DELETE RESTRICT
          ON UPDATE RESTRICT
);

-- Vastuuhenkilö tietää sekä tapahtumanjärjestäjänsä, että sihteerin,
-- joka on luonut tunnuksen
DROP TABLE IF EXISTS VASTUUHENKILO;
CREATE TABLE if not exists VASTUUHENKILO(
    Id SERIAL NOT NULL PRIMARY KEY,
    Tunnus varchar(20) NOT NULL CHECK(length(Tunnus)>7),
    Salasana varchar(60) NOT NULL CHECK(length(Salasana)>7),
    Nimi varchar(201) NOT NULL CHECK(length(Nimi)>0),
    Puhelin varchar(12) NOT NULL CHECK(length(Puhelin)>0),
    Email varchar(60) NOT NULL CHECK(length(Email)>0),
    Osoite INTEGER REFERENCES Osoite(Id)
            ON DELETE RESTRICT
            ON UPDATE RESTRICT,
    Tapahtumanjarjestaja INTEGER REFERENCES TAPAHTUMANJARJESTAJA(Id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    Sihteeri VARCHAR(20) REFERENCES Sihteeri(Tunnus)
            ON DELETE SET NULL
            ON UPDATE CASCADE
);

-- Sihteerin ja tapahtumanjarjestajan valinen suhde,
-- pää-avain koostuu molempien id:stä
DROP TABLE IF EXISTS SIHTEERIJARJESTAJA;
CREATE TABLE IF NOT EXISTS SIHTEERIJARJESTAJA(
    Sihteeritunnus VARCHAR(20) REFERENCES SIHTEERI(tunnus)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    Jarjestajaid INTEGER REFERENCES TAPAHTUMANJARJESTAJA(Id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    PRIMARY KEY(Sihteeritunnus, Jarjestajaid)
);

DROP TABLE IF EXISTS KATEGORIA;
CREATE TABLE IF NOT EXISTS KATEGORIA(
    Id SERIAL NOT NULL PRIMARY KEY ,
    Nimi VARCHAR(100)
);

-- Kun lipulta poistetaan kategoria, asetetaan sille default-arvo 1, viihde
INSERT INTO Kategoria (Nimi) VALUES('viihde');

-- Lipun tyyppi, esim. opiskelija/normaali
DROP TABLE IF EXISTS TYYPPI;
CREATE TABLE if not exists TYYPPI(
  Id SERIAL NOT NULL PRIMARY KEY ,
  Nimi varchar(20)
);

DROP TABLE IF EXISTS KATSOMO;
CREATE TABLE if not exists KATSOMO(
  Id SERIAL NOT NULL PRIMARY KEY ,
  Nimi varchar(20)
);

DROP TABLE IF EXISTS KATSOMOPAIKKA;
CREATE TABLE if not exists KATSOMOPAIKKA(
  Id SERIAL NOT NULL PRIMARY KEY ,
  Rivi integer NOT NULL,
  Paikka integer NOT NULL,
  Katsomo integer NOT NULL REFERENCES Katsomo (Id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- Tapahtuman kategoria palauttaa oletus arvon jos valittu kategoria poistetaan
DROP TABLE IF EXISTS TAPAHTUMA;
CREATE TABLE IF NOT EXISTS TAPAHTUMA(
    Id SERIAL NOT NULL PRIMARY KEY ,
    Nimi VARCHAR(50) CHECK(length(Nimi)>0),
    Kategoria INTEGER DEFAULT 1 REFERENCES KATEGORIA(Id)
    		ON DELETE SET DEFAULT
    		ON UPDATE CASCADE,
    Alv INTEGER CHECK(Alv>=0 AND Alv<100),
    Alkuaika TIMESTAMP,
    Loppuaika TIMESTAMP,
    Osoiteid INTEGER REFERENCES OSOITE(Id)
            ON DELETE RESTRICT
            ON UPDATE RESTRICT,
    Vastuuhenkilo INTEGER REFERENCES VASTUUHENKILO(Id)
            ON DELETE SET DEFAULT
            ON UPDATE CASCADE
);


DROP TABLE IF EXISTS LIPPU;
CREATE TABLE if not exists LIPPU(
  Numero SERIAL NOT NULL PRIMARY KEY,
  Hinta DECIMAL NOT NULL CHECK(Hinta>0),
  Tyyppi integer REFERENCES Tyyppi(Id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  Tarkistettu boolean NOT NULL,
  -- tilat 0 = vapaa, 1 = myyty, 2 = varattu
  Tila integer NOT NULL,
  Tapahtuma integer REFERENCES Tapahtuma(Id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  Katsomopaikka integer REFERENCES Katsomopaikka(Id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

DROP TABLE IF EXISTS TAPAHTUMAKATSOMO;
CREATE TABLE if not exists TAPAHTUMAKATSOMO(
  Id SERIAL NOT NULL PRIMARY KEY,
  TapahtumaId integer NOT NULL REFERENCES Tapahtuma(Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  KatsomoId integer NOT NULL REFERENCES Katsomo(Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


DROP TABLE IF EXISTS HINTATARJOUS;
CREATE TABLE if not exists HINTATARJOUS(
  Id SERIAL NOT NULL PRIMARY KEY ,
  Hinta DECIMAL NOT NULL CHECK(Hinta>0)
);

-- Hintatarjouksen ja lipun välinen suhde
DROP TABLE IF EXISTS HINTATARJOUSLIPPU;
CREATE TABLE if not exists HINTATARJOUSLIPPU(
  LippuId INTEGER NOT NULL REFERENCES Lippu(Numero)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  TarjousId INTEGER NOT NULL REFERENCES Hintatarjous(Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY(LippuId, TarjousId)
);
