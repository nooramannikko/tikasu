CREATE TABLE if not exists VASTUUHENKILO(
    Tunnus varchar(20) primary key,
    Salasana varchar(60),
    Nimi varchar(201),
    Puhelin varchar(12),
    Email varchar(60),
    Osoite REFERENCES Osoite(Id)
            ON DELETE RESTRICT
            ON UPDATE RESTRICT,
    Tapahtumanjarjestaja REFERENCES TAPAHTUMANJARJESTAJA(YTunnus)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    Sihteeri REFERENCES Sihteeri(Tunnus)
            ON DELETE SET NULL
            ON UPDATE CASCADE
);

CREATE TABLE if not exists TAPAHTUMANJARJESTAJA(
    YTunnus varchar(9) primary key,
    Nimi varchar(60)
);

CREATE TABLE if not exists OSOITE(
    Id integer PRIMARY KEY autoincrement,
    Postinumero REFERENCES POSTINUMERO(Postinumero)
            ON DELETE RESTRICT
            ON UPDATE CASCADE,
    Postiosoite varchar(100)
);

CREATE TABLE if not exists POSTINUMERO(
    Postinumero INTEGER NOT NULL PRIMARY KEY,
    Postitoimipaikka REFERENCES POSTITOIMIPAIKKA(id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
);

CREATE TABLE if not exists POSTITOIMIPAIKKA(
    Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    Postitoimipaikka VARCHAR(30)
);

CREATE TABLE if not exists SIHTEERI(
    Tunnus varchar(20) NOT NULL PRIMARY KEY,
    Salasana varchar(60),
    Nimi varchar(201),
    Puhelin varchar(12),
    Email varchar(60),
    Osoite REFERENCES Osoite(Id)
);

CREATE TABLE IF NOT EXISTS SIHTEERIJARJESTAJA(
    Sihteeritunnus REFERENCES SIHTEERI(tunnus)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    Jarjestajatunnus REFERENCES TAPAHTUMANJARJESTAJA(YTunnus)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    PRIMARY KEY(Sihteeritunnus, Jarjestajatunnus)
);

CREATE TABLE if not exists LIPPU(
  Numero integer NOT NULL PRIMARY KEY,
  Hinta varchar(20),
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

CREATE TABLE if not exists TYYPPI(
  Id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  Nimi varchar(20)
);

CREATE TABLE if not exists TAPAHTUMAKATSOMO(
  TapahtumaId integer NOT NULL REFERENCES Tapahtuma(Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  KatsomoId integer NOT NULLE REFERENCES Katsomo(Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY(TapahtumaId, KatsomoId)
);

CREATE TABLE if not exists KATSOMO(
  Id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  Nimi varchar(20)
);

CREATE TABLE if not exists KATSOMOPAIKKA(
  Id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  Rivi integer NOT NULL,
  Paikka integer NOT NULL,
  Katsomo integer NOT NULL REFERENCES Katsomo(Id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE if not exists HINTATARJOUS(
  Id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  Hinta varchar(20)
);

CREATE TABLE if not exists HINTATARJOUSLIPPU(
  LippuId INTEGER NOT NULL REFERENCES Lippu(Numero)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  TarjousId INTEGER NOT NULL REFERENCES Hintatarjous(Id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY(LippuId, TarjousId)
);

CREATE TABLE IF NOT EXISTS TAPAHTUMA(
    Id INTEGER NOT NULL PRIMAR KEY AUTOINCREMENT,
    Nimi VARCHAR(50),
    Kategoria REFERENCES KATEGORIA(Id),
    Alv INTEGER,
    Alkuaika VARCHAR(100),
    Loppuaika VARCHAR(100),
    Osoiteid REFERENCES OSOITE(Id)
            ON DELETE RESTRICT
            ON UPDATE RESTRICT,
    Vastuuhenkilo REFERENCES VASTUUHENKILO(Tunnus)
            ON DELETE SET DEFAULT
            ON UPDATE CASCADE
);