# promise
一个es6 promise的简单实现

API说明 [Promise](http://t.cn/8F5QRAc)

```
notice:
Promise.prototype.catch(cb)仅仅是对Promise.prototype.then(undefined, onRejected)的调用,
没考虑<code>异常冒泡</code>和<code>状态restore</code>等情况，所以和标准API有出入。
```
