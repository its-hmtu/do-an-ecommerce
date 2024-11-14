// const redis = require('redis');
// const client = redis.createClient({
//   url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
// })

// const REDIS_CACHE_5_MINUTES = 300;
// const REDIS_CACHE_10_MINUTES = 600;
// const REDIS_CACHE_1_HOUR = 3600;

// client.on('error', (err) => {
//   console.error("Redis error: ",err);
// })

// client.on('connect', () => {
//   console.log(`Redis connected to ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
// })

// client.on('ready', () => {
//   console.log('Redis ready');
// })

// client.connect()

// module.exports = {
//   client,
//   REDIS_CACHE_5_MINUTES,
//   REDIS_CACHE_10_MINUTES,
//   REDIS_CACHE_1_HOUR
// };