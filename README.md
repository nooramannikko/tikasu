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


