const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://berdimurat:DcXaggoCHs9l1k9WWg5p6Lf4K9vtKS1J@dpg-d287pge3jp1c73837q10-a.oregon-postgres.render.com/cyberedu_db',
  ssl: { rejectUnauthorized: false, },
});

module.exports = pool;