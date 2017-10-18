# Generate Node.js compatible certs
# If Lnd folder doesn't exist we have to create it
if [ ! -d ~/Library/Application\ Support/Lnd ]; then
  mkdir -p ~/.lnd;
fi

# Generate compatible certs
openssl ecparam -genkey -name prime256v1 -out ~/Library/Application\ Support/Lnd/tls.key
openssl req -new -sha256 -key ~/Library/Application\ Support/Lnd/tls.key -out ~/Library/Application\ Support/Lnd/csr.csr -subj '/CN=localhost/O=lnd'
openssl req -x509 -sha256 -days 3650 -key ~/Library/Application\ Support/Lnd/tls.key -in ~/Library/Application\ Support/Lnd/csr.csr -out ~/Library/Application\ Support/Lnd/tls.cert
rm ~/Library/Application\ Support/Lnd/csr.csr
