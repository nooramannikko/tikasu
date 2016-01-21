CREATE TABLE if not exists VASTUUHENKILO(
    Tunnus varchar(20) primary key,
    Salasana varchar(60),
    Nimi varchar(201),
    Puhelin varchar(12),
    Email varchar(60),
    Osoite REFERENCES Osoite(Id),
    Tapahtumanjarjestaja REFERENCES TAPAHTUMANJARJESTAJA(YTunnus),
    Sihteeri REFERENCES Sihteeri(Tunnus)
);

CREATE TABLE if not exists TAPAHTUMANJARJESTAJA(
    YTunnus varchar(9) primary key,
    Nimi varchar(60)
);

CREATE TABLE if not exists OSOITE(
    Id integer PRIMARY KEY autoincrement,
    Postinumero REFERENCES POSTINUMERO(Postinumero),
    Postiosoite varchar(100)
);

CREATE TABLE if not exists POSTINUMERO(
    Postinumero INTEGER NOT NULL PRIMARY KEY,
    Postitoimipaikka REFERENCES POSTITOIMIPAIKKA(id)
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
    Sihteeritunnus REFERENCES SIHTEERI(tunnus),
    Jarjestajatunnus REFERENCES TAPAHTUMANJARJESTAJA(YTunnus)
    PRIMARY KEY(Sihteeritunnus, Jarjestajatunnus)
);

CREATE TABLE IF NOT EXISTS TAPAHTUMA(
    Id INTEGER NOT NULL PRIMAR KEY AUTOINCREMENT,
    Nimi VARCHAR(50),
    Kategoria REFERENCES KATEGORIA(Id),
    Alv INTEGER,
    Alkuaika VARCHAR(100),
    Loppuaika VARCHAR(100),
    Osoiteid REFERENCES OSOITE(Id),
    Vastuuhenkilo REFERENCES VASTUUHENKILO(Tunnus)
);