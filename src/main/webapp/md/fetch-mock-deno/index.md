# Fetch Mock in Deno

📅 _Published: 2025-01-02_

Deno provides built-in [mocking APIs](https://jsr.io/@std/testing/doc/mock) in its [standard library](https://jsr.io/@std).

The documentation of mock APIs is very well written in tutorial style. Here I just offer a TL;DR.

Given an example function uses `fetch`:

```ts
const getData = async (url: string): Promise<string> => {
  const resp = await fetch(url);
  if (!resp.ok) {
    return 'Response not OK!';
  }
  let re;
  try {
    re = await resp.json();
    re = JSON.stringify(re);
  } catch (err) {
    console.error((err as Error).message);
    re = 'JSON parsing error!';
  }
  return re;
};
```

And we want to test if it correctly returns error message if response of fetch is not a 200er.

So we must replace Deno's built-in `fetch` method with our own function which returns a response we wanted:

```ts
const respNotOk = () => {
  const resp = new Response('', {
    status: 400 // make a non-OK response
  });
  return Promise.resolve(resp);
};

using fetchStub = stub(globalThis, 'fetch', respNotOk); // "fetch" is under the "globalThis" namespace
```

That's all. Whenever `fetch()` is called, our dummy 400-Response will be returned instead. We can then assert the return value or parameters being called with. Full example code:

```ts
import {assertEquals} from '@std/assert';
import {assertSpyCallAsync, stub} from '@std/testing/mock';

const getData = async (url: string): Promise<string> => {
  const resp = await fetch(url);
  if (!resp.ok) {
    return 'Response not OK!';
  }
  let re;
  try {
    re = await resp.json();
    re = JSON.stringify(re);
  } catch (err) {
    console.error((err as Error).message);
    re = 'JSON parsing error!';
  }
  return re;
};

const respNotOk = () => {
  const resp = new Response('', {
    status: 400
  });
  return Promise.resolve(resp);
};

Deno.test('Fetch can be mocked', async () => {
  using fetchStub = stub(globalThis, 'fetch', respNotOk);

  const retVal = await getData('http://localhost/400');

  assertEquals(retVal, 'Response not OK!');

  await assertSpyCallAsync(fetchStub, 0, {
    args: ['http://localhost/400']
  });
});
```

🔚
