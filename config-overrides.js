module.exports = {
  webpack: function (config, env) {
    config.externals = {
        BMap: 'BMap',
        BMapLib: 'BMapLib'
    }
    return config
  }
}