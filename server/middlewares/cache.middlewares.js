const cache = (req, res, next, client) => {
  // cache function using redis
  const key = req.originalUrl;
  client.get(key, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      res.send(data);
    } else {
      next();
    }
  });
};

export default cache;