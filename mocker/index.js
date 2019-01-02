const proxy = {
  'POST /api/oauth': (req, res) => {
    const { password, username } = req.body;
    if (password === 'liujie123' && username === 'Garnet') {
      return res.json({
        status: 'ok',
        data: {
          'access_token': '574af18f30d05dd9558294392b46ca22',
          'token_type': 'example',
          'expires_in': 3600,
          'refresh_token': 'tGzv3JOkF0XG5Qx2TlKWIA',
          'example_parameter': 'example_value'
        }
      });
    } else {
      return res.status(403).json({
        status: 'error',
        code: 403
      });
    }
  }
};

module.exports = proxy;