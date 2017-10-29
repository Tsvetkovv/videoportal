import * as jwt from 'jsonwebtoken';
import * as config from '../../config';

export const handleAuth = (req, res) => {
  const token = jwt.sign(req.user, config.auth.jwt.secret, {
    expiresIn: config.auth.jwt.expires,
  });
  res.cookie('id_token', token, {
    maxAge: 1000 * config.auth.jwt.expires,
    httpOnly: true,
  });
  res.redirect('/');
};
