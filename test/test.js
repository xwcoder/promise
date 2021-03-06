/**
 * 部分测试用例来自 http://t.cn/8F5QRAc
 */
var assert = require("assert");
var Promise = require('../promise');

describe('then', function() {

  it('sync resolve', function (done) {
    var p = new Promise(function (resolve, reject) {
      resolve(1);
    });

    p.then(function (v) {
      assert.equal(v, 1);
      done();
    });
  });

  it('sync reject', function (done) {
    var p = new Promise(function (resolve, reject) {
      reject(0);
    });

    p.then(null, function (v) {
      assert.equal(v, 0);
      done();
    })
  });

  it('async resolve', function (done) {
    var p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(1);
      }, 100);
    });

    p.then(function (v) {
      assert.equal(v, 1);
      done();
    })
  });

  it('async reject', function (done) {
    var p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject(0);
      }, 100);
    });

    p.then(null, function (v) {
      assert.equal(v, 0);
      done();
    })
  });

  it('sync chain', function (done) {
    var p = new Promise(function (resolve, reject) {
      resolve(1);
    });

    p.then(function (v) {
      return v + 1;
    }).then(function (v) {
      return v + 2;
    }).then(function (v) {
      assert.equal(v, 4);
      done();
    });

  });

  it('async chain', function (done) {
    var p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(1);
      }, 100);
    });

    p.then(function (v) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve(v+1);
        }, 100);
      });
    }).then(function (v) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve(v+2);
        }, 100);
      });
    }).then(function (v) {
      assert.equal(v, 4);
      done();
    });

  });

  it('mix chain', function (done) {
    var p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(1);
      }, 100);
    });

    p.then(function (v) {
      return v + 1;
    }).then(function (v) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve(v+2);
        }, 100);
      });
    }).then(function (v) {
      assert.equal(v, 4);
      done();
    });
  });

  //from http://t.cn/RypcdtW
  it('chain value is independent', function () {
    var p = new Promise(function(resolve, reject) {
      resolve(1);
    });

    p.then(function(v) {
      assert.equal(v, 1);
      return v + 1;
    }).then(function(v) {
      assert.equal(v, 2);
    });

    p.then(function(v) {
      assert.equal(v, 1);
    });
  });

  it('reject in middle', function () {
    var p = new Promise(function (resolve, reject) {
      reject(1);
    });

    p.then(function () {
      assert.equal(0, 1);
    }, function (v) {
      assert.equal(v, 1);
    }).then(function (v) {
      assert.equal(typeof v, 'undefined');
    }, function () {
      assert.equal(1, 0);
    });
  });
});


describe('catch', function() {

  it('catch chain & restore', function () {
    var p1 = new Promise(function(resolve, reject) {
      resolve('Success');
    });

    p1.then(function(value) {
      console.log(value); // "Success!"
      throw 'oh, no!';
    }).catch(function(e) {
      console.log(e); // "oh, no!"
    }).then(function(e){
      console.log('after a catch the chain is restored');
    });
  });

  it('catch after two', function () {
    var p1 = new Promise(function(resolve, reject) {
      resolve('Success');
    });

    p1.then(function(value) {
      console.log(value); // "Success!"
      throw 'oh, no!';
    }).then(function () {
      assert.equal(1, 0);
    },function (e) {
      console.log('reject after throw error');
    }).catch(function(e) {
      console.log(e); // "oh, no!"
      assert.equal(1, 0);
    }).then(function(e){
      console.log('after a catch the chain is restored');
    });
  });

  it('throw erro in reject callback', function () {
    var p1 = new Promise(function(resolve, reject) {
      reject('fail!');
    });

    p1.then(function(value) {
      assert.equal(1, 0);
      console.log(value);
      throw 'oh, no!';
    }, function (value) {
      console.log(value); // "fail!"
      throw 'oh, reject error';
    }).then(function () {
      assert.equal(1, 0);
    },function (e) {
      console.log('reject after throw error: ' + e);
    }).catch(function(e) {
      console.log(e); // "oh, no!"
      assert(1, 0);
    }).then(function(e){
      console.log('after a catch the chain is restored');
    });
  });

  it('throw erro in reject callback without handler', function () {
    var p1 = new Promise(function(resolve, reject) {
      reject('fail!');
    });

    p1.then(function(value) {

    }, function (value) {
      console.log(value); // "fail!"
      throw 'oh, reject error';
    }).then(function () {
      assert.equal(1, 0);
    }).catch(function(e) {
      console.log(e); // "oh, no!"
    }).then(function(e){
      console.log('after a catch the chain is restored');
    });
  });
});

//http://t.cn/RypMfrQ
describe('Promise.resolve', function () {
  it('Resolving an array', function () {
    var p = Promise.resolve([1,2,3]);
    p.then(function(v) {
      assert.equal(v[0], 1); // 1
    });
  });
});

//http://t.cn/RypMlid
describe('Promise.reject', function () {

  it('Testing static reject', function () {
    Promise.reject(1).then(function(reason) {
      // not called
    }, function(v) {
      assert.equal(v, 1);
    });
  });

  it('test an error', function () {
    Promise.reject(new Error("fail")).then(function(error) {
      // not called
    }, function(error) {
      assert.equal(error.toString(), 'Error: fail');
    });
  });
});

describe('Promise.all', function () {

  it('sync && async: resolve', function (done) {
    var p1 = Promise.resolve(1);
    var p2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(2);
      }, 100);
    });

    var p3 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(3);
      }, 200);
    });

    Promise.all([true, p1, p2, p3])
    .then(function(v) {
      assert.equal(v[0], true);
      assert.equal(v[1], 1);
      assert.equal(v[2], 2);
      assert.equal(v[3], 3);
      done();
    });
  });

  it('sync && async: reject', function (done) {
    var p1 = Promise.resolve(1);
    var p2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject(2);
      }, 100);
    });

    var p3 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(3);
      }, 200);
    });

    Promise.all([true, p1, p2, p3])
    .then(function(v) {
      console.log('resolve:' + v);
    }, function (v) {
      assert.equal(v, 2);
      done();
    });
  });
});

describe('Promise.race', function () {
  it('race resolve with sync', function (done) {
    var p1 = Promise.resolve(1);
    var p2 = new Promise(function (resolve) {
      setTimeout(function () {
        resolve(2);
      }, 100);
    });
    var p3 = new Promise(function (resolve) {
      setTimeout(function () {
        resolve(3);
      }, 50);
    });

    Promise.race([p1, p2, p3])
    .then(function (v) {
      assert.equal(v, 1);
      done();
    });
  });

  it('race resolve with all async', function (done) {
    var p1 = new Promise(function (resolve) {
      setTimeout(function () {
        resolve(1);
      }, 200);
    });
    var p2 = new Promise(function (resolve) {
      setTimeout(function () {
        resolve(2);
      }, 100);
    });
    var p3 = new Promise(function (resolve) {
      setTimeout(function () {
        resolve(3);
      }, 50);
    });

    Promise.race([p1, p2, p3])
    .then(function (v) {
      assert.equal(v, 3);
      done();
    });
  });

  it('race reject with sync', function (done) {

    var p1 = Promise.reject(1);

    var p2 = new Promise(function (resolve) {
      setTimeout(function () {
        resolve(2);
      }, 100);
    });
    var p3 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject(3);
      }, 50);
    });

    Promise.race([p1, p2, p3])
    .then(function (v) {
    }, function (v) {
      assert.equal(v, 1);
      done();
    });
  });

  it('race reject with all async', function (done) {

    var p1 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject(1);
      }, 100);
    });

    var p2 = new Promise(function (resolve) {
      setTimeout(function () {
        resolve(2);
      }, 100);
    });
    var p3 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject(3);
      }, 50);
    });

    Promise.race([p1, p2, p3])
    .then(function (v) {
    }, function (v) {
      assert.equal(v, 3);
      done();
    });
  });
});
