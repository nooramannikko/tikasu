
sudo dnf -y update
sudo dnf -y upgrade
sudo dnf -y install git
# TODO: Sudo su
curl --silent --location https://rpm.nodesource.com/setup_5.x | sudo bash -
sudo dnf -y install nodejs 
sudo dnf -y install postgresql-server postgresql-contrib
sudo systemctl enable postgresql
# sudo postgresql-setup initdb
sudo postgresql-setup initdb
sudo systemctl start postgresql

# TODO: Fix port forwarding ? Now 5432 -> 7777
# Create PostgreSQL database postgres://vagrant:vagrant@localhost/LippuLasse
echo "Ignore the following error about permission denied in /home/vagrant, its nothing."
sudo -u postgres psql -c "CREATE ROLE vagrant WITH SUPERUSER PASSWORD 'vagrant' LOGIN;"
sudo -u vagrant createdb
#sudo -u vagrant psql -c "CREATE DATABASE "LippuLasse";"
createdb "LippuLasse"

# Assume db scripts are found in /vagrant/ (repository has been cloned before booting up vagrant)
psql -d LippuLasse --username vagrant -f /vagrant/dbschema.sql
psql -d LippuLasse --username vagrant -f /vagrant/dummydata.sql
psql -d LippuLasse --username vagrant -f /vagrant/vastuuhenkiloschema.sql
