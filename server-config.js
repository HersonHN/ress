module.exports = {
  updateInterval:
        (process.env.NODE_ENV == 'production') ?
        10 * 60 * 1000 : // ten minutes
        50 * 1000, // 5 seconds
  port: process.env.RESS_PORT || 4100
}
