const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://reminder_user:Gqe2bmHbgzqOJp0Th9m2DshhvBLJlUGj@dpg-d2pe6g56ubrc73c8kcu0-a.oregon-postgres.render.com/course_7w96',
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
