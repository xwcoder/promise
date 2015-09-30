# promise
一个es6 promise的简单实现

## API
API说明 [Promise](http://t.cn/8F5QRAc)

## 测试
<pre>
npm run
</pre>

<pre>
notice:
Promise.prototype.catch(cb)仅仅是对Promise.prototype.then(undefined, onRejected)的调用,
没考虑「异常冒泡」和「状态restore」等情况，所以和标准API有出入。
</pre>
