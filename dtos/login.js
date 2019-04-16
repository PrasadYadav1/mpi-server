const t = require('tcomb');

const Login = t.struct({
  userName: t.String,
  password: t.String
});

const LoginSuccess = t.struct({
  userId: t.String,
  userName: t.String,
  password: t.maybe(String),
  firstname: t.String,
  lastname: t.String,
  email: t.maybe(String),
  position: t.String,
  responsibility: t.String,
  division: t.maybe(String),
  role: t.maybe(String),
  title: t.maybe(String),
  CreatedAt: t.maybe(t.Date),
  UpdatedAt: t.maybe(t.Date)
});

const LoginResponse = t.struct({
  token: t.String,
  user: LoginSuccess
});

module.exports = { Login, LoginResponse };
