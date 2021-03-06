const crds = require('.');
const expect = require('expect');
const tmp = require('tmp');
const getport = require('getport');
const fetch = require('node-fetch');
const {Headers} = fetch;
const fastSha256 = require('fast-sha256');
const secp256k1 = require('eccrypto-sync/secp256k1');

const NULL_PRIVATE_KEY = (() => {
  const result = new Uint8Array(32);
  result[0] = 0xFF;
  return result;
})();
const jsonHeaders = (() => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return headers;
})();

const privateKey = new Buffer('MXNo7tDiY1soVtglOo7Va1HH06i6d6r7cizypViPPxs=', 'base64');
const publicKey = new Buffer('BFIrtpnhr6PWm4jzBzMJjFphs4WZwGsaqSk2Y+4zDJa9aK/kJByIBleRWDdBM6TgwuQ0DirXCulpKmzlfI2ytUU=', 'base64');
const address = 'EvfZY8ic4vz97A93MhuKkNi79i75AH1RtAeZcPN77NqC';

const privateKey2 = new Buffer('LtD8mL4xPNV0NAoVzqNpXDIXpWt2Xb2Sg7zr/0LaStY=', 'base64');
const publicKey2 = new Buffer('BBWXfrjN5NL7Y+Ws8vj3n8qOUi8cu3vQhRYi7/Qj4gAiznJyqIhunTIbmJW7o3mnW2TerlGkunfZie95/VWVKWk=', 'base64');
const address2 = '4btZmuP1YpzsmCuz9n3k6K9bpqNptnSH29jjjcdu2yjp';

const _getPublicKey = privateKey => Buffer.from(secp256k1.keyFromPrivate(privateKey).getPublic('arr'));
const _sha256 = o => {
  if (typeof o === 'string') {
    o = new Buffer(o, 'utf8');
  }
  return new Buffer(fastSha256(o));
};
const _makeMinterMessage = (asset, privateKey) => {
  const startHeight = 0;
  const timestamp = 0;
  const publicKey = _getPublicKey(privateKey);
  const publicKeyString = publicKey.toString('base64');
  const payload = JSON.stringify({type: 'minter', asset, publicKey: publicKeyString, startHeight, timestamp});
  const payloadBuffer = new Buffer(payload, 'utf8');
  const payloadHash = _sha256(payloadBuffer);
  const payloadHashString = payloadHash.toString('hex');
  const signature = Buffer.from(secp256k1.sign(payloadHash, privateKey).toDER());
  const signatureString = signature.toString('base64');
  const message = {
    payload: payload,
    hash: payloadHashString,
    signature: signatureString,
  };
  return message;
};
const _makeMintMessage = (asset, quantity, privateKey) => {
  const startHeight = 0;
  const timestamp = 0;
  const publicKey = _getPublicKey(privateKey);
  const publicKeyString = publicKey.toString('base64');
  const payload = JSON.stringify({type: 'mint', asset, quantity, publicKey: publicKeyString, startHeight, timestamp});
  const payloadHash = _sha256(payload);
  const payloadHashString = payloadHash.toString('hex');
  const signature = Buffer.from(secp256k1.sign(payloadHash, privateKey).toDER());
  const signatureString = signature.toString('base64');
  const message = {
    payload: payload,
    hash: payloadHashString,
    signature: signatureString,
  };
  return message;
};
const _makeSendMessage = (asset, quantity, srcAddress, dstAddress, privateKey) => {
  const startHeight = 0;
  const timestamp = 0;
  const publicKey = _getPublicKey(privateKey);
  const publicKeyString = publicKey.toString('base64');
  const payload = JSON.stringify({type: 'send', startHeight, asset, quantity, srcAddress, dstAddress, publicKey: publicKeyString, timestamp});
  const payloadHash = _sha256(payload);
  const payloadHashString = payloadHash.toString('hex');
  const signature = Buffer.from(secp256k1.sign(payloadHash, privateKey).toDER());
  const signatureString = signature.toString('base64');
  const message = {
    payload: payload,
    hash: payloadHashString,
    signature: signatureString,
  };
  return message;
};
const _makeGetMessage = (address, asset, quantity) => {
  const startHeight = 0;
  const timestamp = 0;
  const payload = JSON.stringify({type: 'get', address, asset, quantity, startHeight, timestamp});
  const payloadHash = _sha256(payload);
  const payloadHashString = payloadHash.toString('hex');
  const signature = Buffer.from(secp256k1.sign(payloadHash, NULL_PRIVATE_KEY).toDER());
  const signatureString = signature.toString('base64');
  const message = {
    payload: payload,
    hash: payloadHashString,
    signature: signatureString,
  };
  return message;
};
const _makeDropMessage = (address, asset, quantity) => {
  const startHeight = 0;
  const timestamp = 0;
  const payload = JSON.stringify({type: 'drop', address, asset, quantity, startHeight, timestamp});
  const payloadHash = _sha256(payload);
  const payloadHashString = payloadHash.toString('hex');
  const signature = Buffer.from(secp256k1.sign(payloadHash, NULL_PRIVATE_KEY).toDER());
  const signatureString = signature.toString('base64');
  const message = {
    payload: payload,
    hash: payloadHashString,
    signature: signatureString,
  };
  return message;
};
const _makeBurnMessage = (asset, quantity, privateKey) => {
  const startHeight = 0;
  const timestamp = 0;
  const publicKey = _getPublicKey(privateKey);
  const publicKeyString = publicKey.toString('base64');
  const payload = JSON.stringify({type: 'burn', asset, quantity, publicKey: publicKeyString, startHeight, timestamp});
  const payloadHash = _sha256(payload);
  const payloadHashString = payloadHash.toString('hex');
  const signature = Buffer.from(secp256k1.sign(payloadHash, privateKey).toDER());
  const signatureString = signature.toString('base64');
  const message = {
    payload: payload,
    hash: payloadHashString,
    signature: signatureString,
  };
  return message;
};
const _makePriceMessage = (asset, price, privateKey) => {
  const startHeight = 0;
  const timestamp = 0;
  const publicKey = _getPublicKey(privateKey);
  const publicKeyString = publicKey.toString('base64');
  const payload = JSON.stringify({type: 'price', asset, price, publicKey: publicKeyString, startHeight, timestamp});
  const payloadBuffer = new Buffer(payload, 'utf8');
  const payloadHash = _sha256(payloadBuffer);
  const payloadHashString = payloadHash.toString('hex');
  const signature = Buffer.from(secp256k1.sign(payloadHash, privateKey).toDER());
  const signatureString = signature.toString('base64');
  const message = {
    payload: payload,
    hash: payloadHashString,
    signature: signatureString,
  };
  return message;
};
const _makeBuyMessage = (asset, quantity, price, privateKey) => {
  const startHeight = 0;
  const timestamp = 0;
  const publicKey = _getPublicKey(privateKey);
  const publicKeyString = publicKey.toString('base64');
  const payload = JSON.stringify({type: 'buy', asset, quantity, price, publicKey: publicKeyString, startHeight, timestamp});
  const payloadBuffer = new Buffer(payload, 'utf8');
  const payloadHash = _sha256(payloadBuffer);
  const payloadHashString = payloadHash.toString('hex');
  const signature = Buffer.from(secp256k1.sign(payloadHash, privateKey).toDER());
  const signatureString = signature.toString('base64');
  const message = {
    payload: payload,
    hash: payloadHashString,
    signature: signatureString,
  };
  return message;
};
const _resJson = res => {
  if (res.status >= 200 && res.status < 300) {
    return res.json();
  } else {
    return Promise.reject({
      status: res.status,
      stack: 'API returned failure status code: ' + res.status,
    });
  }
};

const _boot = (startport = 6777) => {
  let cleanupTmpdir = null;

  return Promise.all([
    Promise.resolve('127.0.0.1'),
    new Promise((accept, reject) => {
      getport((err, p) => {
        if (!err) {
          accept(p);
        } else {
          reject(err);
        }
      });
    }),
    new Promise((accept, reject) => {
      tmp.dir({
        unsafeCleanup: true,
      }, (err, p, cleanup) => {
        if (!err) {
          cleanupTmpdir = cleanup;

          accept(p);
        } else {
          reject(err);
        }
      });
    }),
  ])
    .then(([
      host,
      port,
      tmpdir,
    ]) => {
      let c = null;
      let destroy = null;

      const _start = () => {
        c = crds({
          dataDirectory: tmpdir,
        });

        return c.listen({
          host,
          port,
        })
          .then(d => {
            destroy = d;
          });
      };
      const _stop = () => new Promise((accept, reject) => {
        destroy(err => {
          if (!err) {
            accept();
          } else {
            reject(err);
          }
        });

        c = null;
        destroy = null;
      });
      const _cleanup = () => _stop()
        .then(() => new Promise((accept, reject) => {
          cleanupTmpdir(err => {
            if (!err) {
              accept();
            } else {
              reject(err);
            }
          });
        }));

      return _start()
        .then(() => {
          return {
            c,
            host,
            port,
            tmpdir,
            start: _start,
            stop: _stop,
            cleanup: _cleanup,
          };
        });
    });
};

describe('crds', function() {
this.timeout(30 * 1000);

// mining

describe('mining', () => {
  let b;
  beforeEach(() => {
    return _boot()
      .then(newB => {
        b = newB;
      });
  });
  afterEach(() => b.cleanup());

  it('should mine block', () => {
    return Promise.all([
      new Promise((accept, reject) => {
        b.c.once('block', block => {
          accept(block);
        });
      }),
      fetch(`http://${b.host}:${b.port}/mine`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({address}),
      })
        .then(_resJson),
    ]);
  });

  it('should mine multiple blocks', () => {
    return Promise.all([
      new Promise((accept, reject) => {
        let numBlocks = 0;
        const _block = block => {
          if (++numBlocks >= 2) {
            b.c.removeListener('block', _block);

            accept(block);
          }
        };
        b.c.on('block', _block);
      }),
      fetch(`http://${b.host}:${b.port}/mine`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({address}),
      })
        .then(_resJson),
    ]);
  });

  it('should have correct balance after mining', () => {
    return Promise.all([
      new Promise((accept, reject) => {
        b.c.once('block', block => {
          accept(block);
        });
      }),
      fetch(`http://${b.host}:${b.port}/mine`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({address}),
      })
        .then(_resJson),
    ])
    .then(() => fetch(`http://${b.host}:${b.port}/mine`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({address: null}),
    }))
    .then(_resJson)
    .then(() => Promise.all([
      fetch(`http://${b.host}:${b.port}/balance/${address}/CRD`)
        .then(_resJson)
        .then(balance => {
          expect(balance).toBeGreaterThanOrEqualTo(100);
        }),
      fetch(`http://${b.host}:${b.port}/balances/${address}`)
        .then(_resJson)
        .then(balances => {
          expect(balances['CRD']).toBeGreaterThanOrEqualTo(100);
        }),
    ]))
  });
});

// messages

describe('messages', () => {
  let b;
  beforeEach(() => {
    return _boot()
      .then(newB => {
        b = newB;
      });
  });
  afterEach(() => b.cleanup());

  it('should minter', () => {
    return fetch(`http://${b.host}:${b.port}/submitMessage`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
    })
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/mempool`))
      .then(_resJson)
      .then(mempool => {
        expect(mempool.messages.length).toBe(1);
        expect(JSON.parse(mempool.messages[0].payload).type).toBe('minter');
      });
  });

  it('should minter, mint, and send', () => {
    return fetch(`http://${b.host}:${b.port}/submitMessage`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
    })
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeMintMessage('ITEM.WOOD', 100, privateKey)),
      }))
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeSendMessage('ITEM.WOOD', 2, address, address2, privateKey)),
      }))
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/mempool`))
      .then(_resJson)
      .then(mempool => {
        expect(mempool.messages.length).toBe(3);
        expect(JSON.parse(mempool.messages[0].payload).type).toBe('minter');
        expect(JSON.parse(mempool.messages[1].payload).type).toBe('mint');
        expect(JSON.parse(mempool.messages[2].payload).type).toBe('send');
      });
  });

  it('should reject invalid mint', () => {
    return fetch(`http://${b.host}:${b.port}/submitMessage`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
    })
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeMintMessage('ITEM.WOOD', 100, privateKey2)),
      }))
      .then(_resJson)
      .then(() => {
        return Promise.reject(new Error('did not reject message'));
      })
      .catch(err => {
        if (err.status === 400) {
          return Promise.resolve();
        } else {
          return Promise.reject(err);
        }
      });
  });
});

// balances

describe('balances', () => {
  let b;
  beforeEach(() => {
    return _boot()
      .then(newB => {
        b = newB;
      });
  });
  afterEach(() => b.cleanup());

  it('should return unconfirmed balances', () => {
    return fetch(`http://${b.host}:${b.port}/submitMessage`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
    })
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeMintMessage('ITEM.WOOD', 100, privateKey)),
      }))
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeSendMessage('ITEM.WOOD', 2, address, address2, privateKey)),
      }))
      .then(_resJson)
      .then(() => Promise.all([
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/ITEM:mint`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(1);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/ITEM.WOOD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(98);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalances/${address}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['ITEM:mint']).toBe(1);
            expect(balances['ITEM.WOOD']).toBe(98);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address2}/ITEM:mint`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(0);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address2}/ITEM.WOOD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(2);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalances/${address2}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['ITEM:mint']).toBe(undefined);
            expect(balances['ITEM.WOOD']).toBe(2);
          }),
      ]));
  });

  it('should return confirmed balances', () => {
    return fetch(`http://${b.host}:${b.port}/submitMessage`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
    })
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeMintMessage('ITEM.WOOD', 100, privateKey)),
      }))
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeSendMessage('ITEM.WOOD', 2, address, address2, privateKey)),
      }))
      .then(_resJson)
      .then(() => Promise.all([
        fetch(`http://${b.host}:${b.port}/balance/${address}/ITEM:mint`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(0);
          }),
        fetch(`http://${b.host}:${b.port}/balance/${address}/ITEM.WOOD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(0);
          }),
        fetch(`http://${b.host}:${b.port}/balances/${address}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['ITEM:mint']).toBe(undefined);
            expect(balances['ITEM.WOOD']).toBe(undefined);
          }),
        fetch(`http://${b.host}:${b.port}/balance/${address2}/ITEM:mint`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(0);
          }),
        fetch(`http://${b.host}:${b.port}/balance/${address2}/ITEM.WOOD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(0);
          }),
        fetch(`http://${b.host}:${b.port}/balances/${address2}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['ITEM:mint']).toBe(undefined);
            expect(balances['ITEM.WOOD']).toBe(undefined);
          }),
      ]))
      .then(() => Promise.all([
        new Promise((accept, reject) => {
          b.c.once('block', block => {
            accept(block);
          });
        }),
        fetch(`http://${b.host}:${b.port}/mine`, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({address}),
        })
          .then(_resJson),
      ]))
      .then(() => Promise.all([
        fetch(`http://${b.host}:${b.port}/balance/${address}/ITEM:mint`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(1);
          }),
        fetch(`http://${b.host}:${b.port}/balance/${address}/ITEM.WOOD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(98);
          }),
        fetch(`http://${b.host}:${b.port}/balances/${address}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['ITEM:mint']).toBe(1);
            expect(balances['ITEM.WOOD']).toBe(98);
          }),
        fetch(`http://${b.host}:${b.port}/balance/${address2}/ITEM:mint`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(0);
          }),
        fetch(`http://${b.host}:${b.port}/balance/${address2}/ITEM.WOOD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(2);
          }),
        fetch(`http://${b.host}:${b.port}/balances/${address2}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['ITEM:mint']).toBe(undefined);
            expect(balances['ITEM.WOOD']).toBe(2);
          }),
      ]));
  });

  it('should get asset', () => {
    return fetch(`http://${b.host}:${b.port}/submitMessage`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
    })
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeGetMessage(address, 'ITEM.WOOD', 5)),
      }))
      .then(_resJson)
      .then(() => Promise.all([
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/ITEM:mint`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(1);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/ITEM.WOOD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(5);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalances/${address}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['ITEM:mint']).toBe(1);
            expect(balances['ITEM.WOOD']).toBe(5);
          }),
      ]));
  });

  it('should drop asset', () => {
    return fetch(`http://${b.host}:${b.port}/submitMessage`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
    })
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeGetMessage(address, 'ITEM.WOOD', 5)),
      }))
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeDropMessage(address, 'ITEM.WOOD', 3)),
      }))
      .then(_resJson)
      .then(() => Promise.all([
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/ITEM:mint`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(1);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/ITEM.WOOD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(2);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalances/${address}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['ITEM:mint']).toBe(1);
            expect(balances['ITEM.WOOD']).toBe(2);
          }),
      ]));
  });

  it('should burn asset', () => {
    return fetch(`http://${b.host}:${b.port}/submitMessage`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
    })
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeMintMessage('ITEM.WOOD', 10, privateKey)),
      }))
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeBurnMessage('ITEM.WOOD', 3, privateKey)),
      }))
      .then(_resJson)
      .then(() => Promise.all([
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/ITEM:mint`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(1);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/ITEM.WOOD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(7);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalances/${address}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['ITEM:mint']).toBe(1);
            expect(balances['ITEM.WOOD']).toBe(7);
          }),
      ]));
  });

  it('should mint free asset', () => {
    return fetch(`http://${b.host}:${b.port}/submitMessage`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
    })
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makePriceMessage('ITEM', 0, privateKey)),
      }))
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeMintMessage('ITEM.WOOD', 100, privateKey2)),
      }))
      .then(_resJson)
      .then(() => Promise.all([
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/ITEM:mint`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(1);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/ITEM.WOOD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(0);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalances/${address}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['ITEM:mint']).toBe(1);
            expect(balances['ITEM.WOOD']).toBe(undefined);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address2}/ITEM:mint`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(0);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address2}/ITEM.WOOD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(100);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalances/${address2}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['ITEM:mint']).toBe(undefined);
            expect(balances['ITEM.WOOD']).toBe(100);
          }),
      ]));
  });

  it('should buy priced asset', () => {
    return Promise.all([
      new Promise((accept, reject) => {
        b.c.once('block', block => {
          accept(block);
        });
      }),
      fetch(`http://${b.host}:${b.port}/mine`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({address: address2}),
      })
        .then(_resJson),
    ])
      .then(() => fetch(`http://${b.host}:${b.port}/mine`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({address: null}),
      }))
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
      }))
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makePriceMessage('ITEM', 40, privateKey)),
      }))
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeBuyMessage('ITEM', 2, 40, privateKey2)),
      }))
      .then(_resJson)
      .then(() => Promise.all([
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/ITEM:mint`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(1);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/ITEM`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(0);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalances/${address}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['CRD']).toBe(80);
            expect(balances['ITEM:mint']).toBe(1);
            expect(balances['ITEM']).toBe(undefined);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address2}/ITEM:mint`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(0);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address2}/ITEM`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(2);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalances/${address2}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['CRD'] % 100).toBe(20);
            expect(balances['ITEM:mint']).toBe(undefined);
            expect(balances['ITEM']).toBe(2);
          }),
      ]));
  });
});

// storage

describe('storage', () => {
  let b;
  beforeEach(() => {
    return _boot()
      .then(newB => {
        b = newB;
      });
  });
  afterEach(() => b.cleanup());

  it('should remember confirmed messages', () => {
    return fetch(`http://${b.host}:${b.port}/submitMessage`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
    })
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeMintMessage('ITEM.WOOD', 20, privateKey)),
      }))
      .then(_resJson)
      .then(() => Promise.all([
        new Promise((accept, reject) => {
          b.c.once('block', block => {
            accept(block);
          });
        }),
        fetch(`http://${b.host}:${b.port}/mine`, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({address}),
        })
          .then(_resJson),
      ]))
      .then(() => fetch(`http://${b.host}:${b.port}/mine`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({address: null}),
      }))
      .then(_resJson)
      .then(() => b.stop())
      .then(() => b.start())
      .then(() => Promise.all([
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/CRD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBeGreaterThanOrEqualTo(100);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/ITEM.WOOD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(20);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalances/${address}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['CRD']).toBeGreaterThanOrEqualTo(100);
            expect(balances['ITEM.WOOD']).toBe(20);
          }),
      ]));
  });

  it('should forget unconfirmed messages', () => {
    return Promise.all([
      new Promise((accept, reject) => {
        b.c.once('block', block => {
          accept(block);
        });
      }),
      fetch(`http://${b.host}:${b.port}/mine`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({address}),
      })
        .then(_resJson),
    ])
      .then(() => fetch(`http://${b.host}:${b.port}/mine`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({address: null}),
      }))
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
      }))
      .then(_resJson)
      .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeMintMessage('ITEM.WOOD', 20, privateKey)),
      }))
      .then(_resJson)
      .then(() => b.stop())
      .then(() => b.start())
      .then(() => Promise.all([
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/CRD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBeGreaterThanOrEqualTo(100);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalance/${address}/ITEM.WOOD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(0);
          }),
        fetch(`http://${b.host}:${b.port}/unconfirmedBalances/${address}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['CRD']).toBeGreaterThanOrEqualTo(100);
            expect(balances['ITEM.WOOD']).toBe(undefined);
          }),
      ]));
  });
});

// peers

describe('peers', () => {
  let b1;
  let b2;
  beforeEach(() => {
    return _boot()
      .then(b => {
        b1 = b;

        return _boot(b1.port + 1)
          .then(b => {
            b2 = b;
          });
      });
  });
  afterEach(() => Promise.all([
    b1.cleanup(),
    b2.cleanup(),
  ]));

  it('should sync blocks', () => {
    return Promise.all([
      new Promise((accept, reject) => {
        b1.c.once('block', block => {
          accept(block);
        });
      }),
      fetch(`http://${b1.host}:${b1.port}/mine`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({address}),
      })
        .then(_resJson),
    ])
      .then(() => fetch(`http://${b1.host}:${b1.port}/mine`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({address: null}),
      }))
      .then(_resJson)
      .then(() => Promise.all([
        new Promise((accept, reject) => {
          b2.c.once('block', block => {
            accept(block);
          });
        }),
        fetch(`http://${b2.host}:${b2.port}/peer`, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({url: `http://${b1.host}:${b1.port}`}),
        })
          .then(_resJson),
      ]));
  });

  it('should sync mempool', () => {
    return fetch(`http://${b1.host}:${b1.port}/submitMessage`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
    })
      .then(_resJson)
      .then(() => fetch(`http://${b1.host}:${b1.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeMintMessage('ITEM.WOOD', 100, privateKey)),
      }))
      .then(_resJson)
      .then(() => Promise.all([
        new Promise((accept, reject) => {
          let numMessages = 0;
          const _message = message => {
            if (++numMessages >= 2) {
              b2.c.removeListener('message', _message);

              accept(message);
            }
          };
          b2.c.on('message', _message);
        }),
        fetch(`http://${b2.host}:${b2.port}/peer`, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({url: `http://${b1.host}:${b1.port}`}),
        })
          .then(_resJson),
      ]))
      .then(() => Promise.all([
        fetch(`http://${b2.host}:${b2.port}/unconfirmedBalance/${address}/ITEM:mint`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(1);
          }),
        fetch(`http://${b2.host}:${b2.port}/unconfirmedBalance/${address}/ITEM.WOOD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(100);
          }),
        fetch(`http://${b2.host}:${b2.port}/unconfirmedBalances/${address}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['ITEM:mint']).toBe(1);
            expect(balances['ITEM.WOOD']).toBe(100);
          }),
      ]));
  });
});

describe('three peers', () => {
  let b1;
  let b2;
  let b3;
  beforeEach(() => {
    return _boot()
      .then(b => {
        b1 = b;

        return _boot(b1.port + 1)
          .then(b => {
            b2 = b;
          })
          .then(() => {
            return _boot(b2.port + 1)
              .then(b => {
                b3 = b;
              });
          });
      });
  });
  afterEach(() => Promise.all([
    b1.cleanup(),
    b2.cleanup(),
    b3.cleanup(),
  ]));

  it('should sync blocks three ways', () => {
    return Promise.all([
      new Promise((accept, reject) => {
        b1.c.once('block', block => {
          accept(block);
        });
      }),
      fetch(`http://${b1.host}:${b1.port}/mine`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({address}),
      })
        .then(_resJson),
    ])
      .then(() => fetch(`http://${b1.host}:${b1.port}/mine`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({address: null}),
      }))
      .then(_resJson)
      .then(() => Promise.all([
        new Promise((accept, reject) => {
          b2.c.once('block', block => {
            accept(block);
          });
        }),
        fetch(`http://${b2.host}:${b2.port}/peer`, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({url: `http://${b1.host}:${b1.port}`}),
        })
          .then(_resJson),
        new Promise((accept, reject) => {
          b3.c.once('block', block => {
            accept(block);
          });
        }),
        fetch(`http://${b3.host}:${b3.port}/peer`, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({url: `http://${b2.host}:${b2.port}`}),
        })
          .then(_resJson),
      ]));
  });

  it('should sync mempool three ways', () => {
    return fetch(`http://${b1.host}:${b1.port}/submitMessage`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
    })
      .then(_resJson)
      .then(() => fetch(`http://${b1.host}:${b1.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeMintMessage('ITEM.WOOD', 100, privateKey)),
      }))
      .then(_resJson)
      .then(() => Promise.all([
        new Promise((accept, reject) => {
          let numMessages = 0;
          const _message = message => {
            if (++numMessages >= 2) {
              b2.c.removeListener('message', _message);

              accept(message);
            }
          };
          b2.c.on('message', _message);
        }),
        fetch(`http://${b2.host}:${b2.port}/peer`, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({url: `http://${b1.host}:${b1.port}`}),
        })
          .then(_resJson),
        new Promise((accept, reject) => {
          let numMessages = 0;
          const _message = message => {
            if (++numMessages >= 2) {
              b3.c.removeListener('message', _message);

              accept(message);
            }
          };
          b3.c.on('message', _message);
        }),
        fetch(`http://${b3.host}:${b3.port}/peer`, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({url: `http://${b2.host}:${b2.port}`}),
        })
          .then(_resJson),
      ]))
      .then(() => Promise.all([
        fetch(`http://${b3.host}:${b3.port}/unconfirmedBalance/${address}/ITEM:mint`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(1);
          }),
        fetch(`http://${b3.host}:${b3.port}/unconfirmedBalance/${address}/ITEM.WOOD`)
          .then(_resJson)
          .then(balance => {
            expect(balance).toBe(100);
          }),
        fetch(`http://${b3.host}:${b3.port}/unconfirmedBalances/${address}`)
          .then(_resJson)
          .then(balances => {
            expect(balances['ITEM:mint']).toBe(1);
            expect(balances['ITEM.WOOD']).toBe(100);
          }),
      ]));
  });
});

describe('resync', () => {
  let b1;
  let b2;
  beforeEach(() => {
    return _boot()
      .then(b => {
        b1 = b;

        return _boot(b1.port + 1)
          .then(b => {
            b2 = b;
          });
      });
  });
  afterEach(() => Promise.all([
    b1.cleanup(),
    b2.cleanup(),
  ]));

  it('should catch up', () => {
    return Promise.all([
      {
        b: b1,
        privateKey: privateKey,
        totalNumBlocks: 1,
      },
      {
        b: b2,
        privateKey: privateKey2,
        totalNumBlocks: 4,
      },
    ].map(({b, privateKey, totalNumBlocks}) =>
      fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
      })
        .then(_resJson)
        .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify(_makeMintMessage('ITEM.WOOD', 100, privateKey)),
        }))
        .then(_resJson)
        .then(() => Promise.all([
          new Promise((accept, reject) => {
            let numBlocks = 0;

            const _block = block => {
              if (++numBlocks >= totalNumBlocks) {
                accept(block);

                b.c.removeListener('block', _block);
              }
            };
            b.c.on('block', _block);
          }),
          fetch(`http://${b.host}:${b.port}/mine`, {
            method: 'POST',
            headers: jsonHeaders,
            body: JSON.stringify({address}),
          })
            .then(_resJson),
        ]))
        .then(() => fetch(`http://${b.host}:${b.port}/mine`, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({address: null}),
        }))
        .then(_resJson)
    ))
      .then(() => fetch(`http://${b2.host}:${b2.port}/peer`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({url: `http://${b1.host}:${b1.port}`}),
      }))
      .then(_resJson)
      .then(() => new Promise((accept, reject) => { // wait for nodes to sync
        setTimeout(accept, 1000);
      }))
      .then(() => Promise.all([b1, b2].map(b =>
        fetch(`http://${b2.host}:${b2.port}/blocks/${4}`)
          .then(_resJson)
      )))
      .then(blocks => {
        expect(blocks[0].hash).toBe(blocks[1].hash);
      });
  });

  it('should come to consensus', () => {
    return Promise.all([
      {
        b: b1,
        privateKey: privateKey,
      },
      {
        b: b2,
        privateKey: privateKey2,
      },
    ].map(({b, privateKey}) =>
      fetch(`http://${b.host}:${b.port}/submitMessage`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(_makeMinterMessage('ITEM', privateKey)),
      })
        .then(_resJson)
        .then(() => fetch(`http://${b.host}:${b.port}/submitMessage`, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify(_makeMintMessage('ITEM.WOOD', 100, privateKey)),
        }))
        .then(_resJson)
        .then(() => Promise.all([
          new Promise((accept, reject) => {
            let numBlocks = 0;

            const _block = block => {
              if (++numBlocks >= 6) {
                accept(block);

                b.c.removeListener('block', _block);
              }
            };
            b.c.on('block', _block);
          }),
          fetch(`http://${b.host}:${b.port}/mine`, {
            method: 'POST',
            headers: jsonHeaders,
            body: JSON.stringify({address}),
          })
            .then(_resJson),
        ]))
        .then(() => fetch(`http://${b.host}:${b.port}/mine`, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify({address: null}),
        }))
        .then(_resJson)
    ))
      .then(() => fetch(`http://${b2.host}:${b2.port}/peer`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({url: `http://${b1.host}:${b1.port}`}),
      }))
      .then(_resJson)
      .then(() => new Promise((accept, reject) => { // wait for nodes to sync
        setTimeout(accept, 1000);
      }))
      .then(() => Promise.all(
        [1, 2, 3, 4, 5, 6].map(n =>
          Promise.all(
            [b1, b2].map(b =>
              fetch(`http://${b2.host}:${b2.port}/blocks/${n}`)
                .then(_resJson)
            )
          )
        )
      ))
      .then(ns => {
        for (let i = 0; i < ns.length; i++) {
          const blocks = ns[i];
          expect(blocks[0].hash).toBe(blocks[1].hash);
        }
      });
  });
});

});
