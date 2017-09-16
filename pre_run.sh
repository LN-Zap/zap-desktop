if [ "$(uname)" == "Darwin" ]; then
    # Do something under Mac OS X platform
    echo 'Its a mac'
    if brew ls --versions go > /dev/null; then
      echo 'Installing go'
      export GOPATH=~/gocode
      export PATH=$PATH:$GOPATH/bin
    else
      echo 'Installing go package.'
      brew install go &&
      export GOPATH=~/gocode
      export PATH=$PATH:$GOPATH/bin
      go get -u github.com/Masterminds/glide
    fi

    DIR=$PWD
    # Check if LND is installed
    if [ ! -d $GOPATH/src/github.com/lightningnetwork/lnd ]; then
      #Installing lnd
      git clone https://github.com/lightningnetwork/lnd $GOPATH/src/github.com/lightningnetwork/lnd
      cd $GOPATH/src/github.com/lightningnetwork/lnd - Need to use to use glide with exact directory
      glide $GOPATH/src/github.com/lightningnetwork/lnd install
      go install . ./cmd/...
    fi

    cd $DIR

    #Generate certificate
    if [ ! -f ~/Library/Application\ Support/Lnd/tls.cert ]; then
      openssl ecparam -genkey -name prime256v1 -out ~/Library/Application\ Support/Lnd/tls.key
      openssl req -new -sha256 -key ~/Library/Application\ Support/Lnd/tls.key -out ~/Library/Application\ Support/Lnd/csr.csr -subj '/CN=localhost/O=lnd'
      openssl req -x509 -sha256 -days 3650 -key ~/Library/Application\ Support/Lnd/tls.key -in ~/Library/Application\ Support/Lnd/csr.csr -out ~/Library/Application\ Support/Lnd/tls.cert
      rm ~/Library/Application\ Support/Lnd/csr.csr
    fi

    #Start LND Neutrino
    lnd --bitcoin.active --bitcoin.testnet --debuglevel=debug --neutrino.active --neutrino.connect=faucet.lightning.community:18333 --no-macaroons &
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
