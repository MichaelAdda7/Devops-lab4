var redis = require("redis");
const configure = require('./configure');

const config = configure();

var db = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
  retry_strategy: (options) => {
    if (options.error && options.error.code === "ECONNREFUSED") {
      // Si Redis refuse vraiment la connexion -> arrête
      return new Error("Redis server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 5) {
      // Si ça fait + de 5 min -> arrête
      return new Error("Retry time exhausted");
    }
    // sinon continue en augmentant le délai (max 3s)
    return Math.min(options.attempt * 100, 3000);
  }
});

db.on("connect", () => {
  console.log("✅ Connected to Redis");
});

db.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

process.on("SIGINT", function() {
  db.quit();
});

module.exports = db;
