# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "box-cutter/fedora23" # Lintula is running RHEL 6.7, lets use fedora instead
  config.vm.provision :shell, path: "initdb.sh", privileged: false # installs psql and creates database
  config.vm.network "forwarded_port", guest: 11130, host: 11130 # todo
end
