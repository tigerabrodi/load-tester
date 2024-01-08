# HTTP(S) Load Tester

# Node.js requests

In Node.js, when you make an HTTP request, the response from the server is handled as a stream. This means that the data from the response is not received all at once, but in chunks over time. The response object in Node.js is an instance of `stream.Readable`, and it emits several events that you can listen to in order to process the response data. The two most commonly used events are `data` and `end`.

```js
// processing the response data
response.on('data', (chunk) => {
  console.log('A new chunk of data has arrived:', chunk)
})
```

```js
// end of the response
response.on('end', () => {
  console.log('No more data in response.')
})
```

# Metrics

## First Byte Time

Imagine you're at a restaurant and you've just ordered a meal. Think of the moment you place your order as the time you send an HTTP request to a server. Now, the kitchen starts preparing your meal, which is like the server processing your request.

The firstByteTime in this scenario would be the moment when the waiter brings out the first part of your meal, maybe a bowl of soup or a salad. It's not the entire meal, but it's the first indication that your order is being actively worked on and part of it is ready. In the context of an HTTP request, firstByteTime is the moment when the server sends back the first piece of data in response to your request. It's an important metric because it gives you an idea of how long it takes for the server to start responding after receiving your request.

This is tracked right before we start processing the the first chunk of data from the response.

## Last Byte Time

Like the waiter bringing out the last part of your meal, lastByteTime is the moment when the server sends the last piece of data in response to your request. It's the last indication that your order has been completed and is ready to be consumed.

This is where we use `response.on('end', () => {})` to measure the last byte time.

## Total Request Time

Calculated by subtracting startTime from endTime. Start time is when we receive the response, but there could be delay before we start processing the response. End time is when we finish processing the response.

## Mean

Mean is simply the average.
