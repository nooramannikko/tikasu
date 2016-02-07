// Update with your config settings.

module.exports = {

  development: {
    debug: true,
    client: 'postgresql',
    connection: {
      host     : '128.199.57.8',
      port     : '5432',
      user     : 'admin',
      password : 'jee',
      database : 'LippuLasse'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host     : '128.199.57.8',
      port     : '5432',
      user     : 'admin',
      password : 'jee',
      database : 'LippuLasse'
    }
  }

};
