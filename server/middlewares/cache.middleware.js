const {
  client: redisClient
} = require('../config/redis');

const checkCache = async (req, res, next) => {
  const cached = await redisClient.get(req.originalUrl);
  if (cached) {
    return res.json(JSON.parse(cached));
  } else {
    next();
  }
}

module.exports = checkCache;

