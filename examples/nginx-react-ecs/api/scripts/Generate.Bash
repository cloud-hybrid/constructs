#/bin/bash --posix

openssl req -config Development.conf -new -x509 -sha256 -newkey rsa:2048 -nodes -keyout Development.key -days 1024 -out Development.crt
openssl pkcs12 -export -out Development.pfx -inkey Development.key -in Development.crt

# MacOS
sudo security -v add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain Development.crt

# Ubuntu LTS 20.04
sudo apt install libnss3-tools --yes
pk12util -d "sql:${HOME}/.pki/nssdb" -i Development.pfx
certutil -d sql:$HOME/.pki/nssdb -A -t "P,," -n "Development Certificate" -i Development.crt

exit ${?}