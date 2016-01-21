CREATE TABLE if not exists VASTUUHENKILO(
  Tunnus varchar(20) primary key,
  Salasana varchar(60),
  Nimi varchar(201),
  Puhelin varchar(12),
  Email varchar(60),
  Osoite REFERENCES Osoite(Id),
  Tapahtumanjarjestaja REFERENCES Tapahtumanjarjestaja(YTunnus),
  Sihteeri REFERENCES Sihteeri(Tunnus)
);

CREATE TABLE if not exists TAPAHTUMANJARJESTAJA(

);