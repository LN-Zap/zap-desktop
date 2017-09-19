var spawn = require('child_process').spawn;

var prc = spawn('lnd', ['--bitcoin.active', '--bitcoin.testnet', '--debuglevel=debug', '--neutrino.active', '--neutrino.connect=faucet.lightning.community:18333', '--no-macaroons']);

prc.on('close', function (code) {
  console.log('process exit code ' + code);
});