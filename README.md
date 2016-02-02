Tikasulaarnio

tietokannan conffaus:

mene vagranttiin sisälle

> createuser -P -s -e admin
passuksi jee

> su (passu on vagrant)

> dnf install nano

> nano /var/lib/pgsql/data/pg_hba.conf

vaihda kaikki "method" kohdat md5 ja tallenna ctrl+o ja ctrl+x

> service postgresql restart

> exit


DATABASEN TAPPAMINEN:

(käytä su ja loggaa rootiksi tai käytä sudoa dropdb:hen)

psql -U admin LippuLasse
update pg_database set datallowconn = 'false' where datname = 'LippuLasse';
SELECT pg_terminate_backend(procpid) FROM pg_stat_activity WHERE datname = 'LippuLasse';
\q
dropdb -U admin LippuLasse

UUDELLEENLUONTI:

navigoi skriptien kansioon
createdb -U admin LippuLasse
psql -d LippuLasse --username admin -f dbschema.sql
psql -d LippuLasse --username admin -f dummydata.sql



