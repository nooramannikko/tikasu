DROP TABLE IF EXISTS POSTITOIMIPAIKKA;
CREATE TABLE if not exists POSTITOIMIPAIKKA(
    Id SERIAL NOT NULL PRIMARY KEY,
    Postitoimipaikka VARCHAR(30) CHECK(length(Postitoimipaikka)>0)
);

DROP TABLE IF EXISTS POSTINUMERO;
CREATE TABLE if not exists POSTINUMERO(
    Postinumero CHAR(5) NOT NULL PRIMARY KEY CHECK(Postinumero SIMILAR TO '^[0-9]{5}'),
    Postitoimipaikka INTEGER REFERENCES POSTITOIMIPAIKKA (Id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
);

DROP TABLE IF EXISTS OSOITE;
CREATE TABLE if not exists OSOITE(
    Id integer PRIMARY KEY ,
    Postinumero CHAR(5) REFERENCES POSTINUMERO (Postinumero)
            ON DELETE RESTRICT
            ON UPDATE CASCADE,
    Postiosoite varchar(100) CHECK(length(Postiosoite)>0)
);

DROP TABLE IF EXISTS TAPAHTUMANJARJESTAJA;
CREATE TABLE if not exists TAPAHTUMANJARJESTAJA(
    YTunnus varchar(9) PRIMARY KEY 
      CHECK(
        -- Check if tunnus is exactly 9 characters long
        length(YTunnus)=9 AND 
        -- Check that seven first characters are numeric
        (substring(YTunnus FROM 1 FOR 7) SIMILAR TO '^[0-9]{7}') AND
        -- Check that 8th character is "-"
        (substring(YTunnus FROM 8 FOR 1) = '-') AND
        -- Check that last character is correct validation number
        -- http://www.finlex.fi/fi/laki/ajantasa/2001/20010288

        -- If sum%11 is not 1
        (((CAST (substring(YTunnus FROM 7 FOR 1))::int) * 2 + 
        (CAST (substring(YTunnus FROM 6 FOR 1)) AS INTEGER) * 4 + 
        (CAST (substring(YTunnus FROM 5 FOR 1)) AS INTEGER) * 8 + 
        (CAST (substring(YTunnus FROM 4 FOR 1)) AS INTEGER) * 5 + 
        (CAST (substring(YTunnus FROM 3 FOR 1)) AS INTEGER) * 10 +
        (CAST (substring(YTunnus FROM 2 FOR 1)) AS INTEGER) * 9 + 
        (CAST (substring(YTunnus FROM 1 FOR 1)) AS INTEGER) * 7 ) % 11 != 1) AND 
        
        -- If sum%11 is zero 
        ((((CAST (substring(YTunnus FROM 7 FOR 1)) AS INTEGER) * 2 + 
        (CAST (substring(YTunnus FROM 6 FOR 1)) AS INTEGER) * 4 + 
        (CAST (substring(YTunnus FROM 5 FOR 1)) AS INTEGER) * 8 + 
        (CAST (substring(YTunnus FROM 4 FOR 1)) AS INTEGER) * 5 + 
        (CAST (substring(YTunnus FROM 3 FOR 1)) AS INTEGER) * 10 +
        (CAST (substring(YTunnus FROM 2 FOR 1)) AS INTEGER) * 9 + 
        (CAST (substring(YTunnus FROM 1 FOR 1)) AS INTEGER) * 7 ) % 11 = 0 AND 
        -- then validation number is zero
        substring(YTunnus FROM 9 FOR 1) = '0') OR 
        
        -- If sum%11 is greater than 1 
        (((CAST (substring(YTunnus FROM 7 FOR 1)) AS INTEGER) * 2 + 
        (CAST (substring(YTunnus FROM 6 FOR 1)) AS INTEGER) * 4 + 
        (CAST (substring(YTunnus FROM 5 FOR 1)) AS INTEGER) * 8 + 
        (CAST (substring(YTunnus FROM 4 FOR 1)) AS INTEGER) * 5 + 
        (CAST (substring(YTunnus FROM 3 FOR 1)) AS INTEGER) * 10 +
        (CAST (substring(YTunnus FROM 2 FOR 1)) AS INTEGER) * 9 + 
        (CAST (substring(YTunnus FROM 1 FOR 1)) AS INTEGER) * 7 ) % 11 > 1 AND 
        -- then validation number is 11 - sum%11
        (CAST (substring(YTunnus FROM 9 FOR 1)) AS INTEGER) = 
        (11 - (((CAST (substring(YTunnus FROM 7 FOR 1)) AS INTEGER) * 2 + 
        (CAST (substring(YTunnus FROM 6 FOR 1)) AS INTEGER) * 4 + 
        (CAST (substring(YTunnus FROM 5 FOR 1)) AS INTEGER) * 8 + 
        (CAST (substring(YTunnus FROM 4 FOR 1)) AS INTEGER) * 5 + 
        (CAST (substring(YTunnus FROM 3 FOR 1)) AS INTEGER) * 10 +
        (CAST (substring(YTunnus FROM 2 FOR 1)) AS INTEGER) * 9 + 
        (CAST (substring(YTunnus FROM 1 FOR 1)) AS INTEGER) * 7 ) % 11))))

      ), 
    Nimi varchar(60)
);


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

DROP TABLE IF EXISTS VASTUUHENKILO;
CREATE TABLE if not exists VASTUUHENKILO(
    Tunnus varchar(20) NOT NULL primary key CHECK(length(Tunnus)>7),
    Salasana varchar(60) NOT NULL CHECK(length(Salasana)>7),
    Nimi varchar(201) NOT NULL CHECK(length(Nimi)>0),
    Puhelin varchar(12) NOT NULL CHECK(length(Puhelin)>0),
    Email varchar(60) NOT NULL CHECK(length(Email)>0),
    Osoite INTEGER REFERENCES Osoite(Id)
            ON DELETE RESTRICT
            ON UPDATE RESTRICT,
    Tapahtumanjarjestaja VARCHAR(9) REFERENCES TAPAHTUMANJARJESTAJA(YTunnus)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    Sihteeri VARCHAR(20) REFERENCES Sihteeri(Tunnus)
            ON DELETE SET NULL
            ON UPDATE CASCADE
);

DROP TABLE IF EXISTS SIHTEERIJARJESTAJA;
CREATE TABLE IF NOT EXISTS SIHTEERIJARJESTAJA(
    Sihteeritunnus VARCHAR(20) REFERENCES SIHTEERI(tunnus)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    Jarjestajatunnus VARCHAR(9) REFERENCES TAPAHTUMANJARJESTAJA(YTunnus)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    PRIMARY KEY(Sihteeritunnus, Jarjestajatunnus)
);

DROP TABLE IF EXISTS KATEGORIA;
CREATE TABLE IF NOT EXISTS KATEGORIA(
    Id SERIAL NOT NULL PRIMARY KEY ,
    Nimi VARCHAR(100)
);

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

DROP TABLE IF EXISTS TAPAHTUMA;
CREATE TABLE IF NOT EXISTS TAPAHTUMA(
    Id SERIAL NOT NULL PRIMARY KEY ,
    Nimi VARCHAR(50) CHECK(length(Nimi)>0),
    Kategoria INTEGER REFERENCES KATEGORIA(Id),
    Alv INTEGER CHECK(Alv>=1 AND Alv<100),
    Alkuaika TIMESTAMP,
    Loppuaika TIMESTAMP,
    Osoiteid INTEGER REFERENCES OSOITE(Id)
            ON DELETE RESTRICT
            ON UPDATE RESTRICT,
    Vastuuhenkilo VARCHAR(20) REFERENCES VASTUUHENKILO(Tunnus)
            ON DELETE SET DEFAULT
            ON UPDATE CASCADE
);

DROP TABLE IF EXISTS LIPPU;
CREATE TABLE if not exists LIPPU(
  Numero INTEGER NOT NULL PRIMARY KEY,
  Hinta DECIMAL NOT NULL CHECK(Hinta>0),
  Tyyppi integer REFERENCES Tyyppi(Id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  Tarkistettu boolean NOT NULL,
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
  TapahtumaId integer NOT NULL REFERENCES Tapahtuma(Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  KatsomoId integer NOT NULL REFERENCES Katsomo(Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY(TapahtumaId, KatsomoId)
);



DROP TABLE IF EXISTS HINTATARJOUS;
CREATE TABLE if not exists HINTATARJOUS(
  Id SERIAL NOT NULL PRIMARY KEY ,
  Hinta DECIMAL NOT NULL CHECK(Hinta>0)
);

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