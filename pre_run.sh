if [ "$(uname)" == "Darwin" ]; then
  # Check for Go
  command -v go > /dev/null 2>&1 || { 
    echo "Installing Go"
    brew install go
    export GOPATH=~/go
    export PATH=$PATH:$GOPATH/bin
  }

  # Check for Glide
  command -v glide > /dev/null 2>&1 || {
    echo "Installing Glide"
    go get -u github.com/Masterminds/glide
  }

  # Check if LND is installed
  if [ ! -d $GOPATH/src/github.com/lightningnetwork/lnd ]; then
    #Installing lnd
    git clone https://github.com/lightningnetwork/lnd $GOPATH/src/github.com/lightningnetwork/lnd
    cd $GOPATH/src/github.com/lightningnetwork/lnd
    glide $GOPATH/src/github.com/lightningnetwork/lnd install
    go install . ./cmd/...
  fi

  # Check for certs
  if [ ! -f ~/Library/Application\ Support/Lnd/tls.cert ]; then
    openssl ecparam -genkey -name prime256v1 -out ~/Library/Application\ Support/Lnd/tls.key
    openssl req -new -sha256 -key ~/Library/Application\ Support/Lnd/tls.key -out ~/Library/Application\ Support/Lnd/csr.csr -subj '/CN=localhost/O=lnd'
    openssl req -x509 -sha256 -days 3650 -key ~/Library/Application\ Support/Lnd/tls.key -in ~/Library/Application\ Support/Lnd/csr.csr -out ~/Library/Application\ Support/Lnd/tls.cert
    rm ~/Library/Application\ Support/Lnd/csr.csr
  fi
  
  #Start APP
  cross-env START_HOT=1 npm run start-renderer-dev
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    # Do something under GNU/Linux platform
    echo 'linux'
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
    # Do something under 32 bits Windows NT platform
    echo 'win32'
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
    # Do something under 64 bits Windows NT platform
    echo 'win64'
fi