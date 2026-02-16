const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    client: 'better-sqlite3',
    connection: {
      filename: path.join(__dirname, '..', '.tmp', 'data.db'),
    },
    useNullAsDefault: true,
  },
});
