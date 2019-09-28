let passport = require("passport");
let passportJWT = require("passport-jwt");
let usr = require("../models").users;
let cfg = require("./jwt_config.js");
let ExtractJWT = passportJWT.ExtractJwt;
let Strategy = passportJWT.Strategy;
let params = {
  secretOrKey: cfg.jwtSecret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
};
module.exports = function() {
  let strategy = new Strategy(params, function(payload, done) {
    const user = usr.find({
      attributes: [
        "id",
        "userName",
        "email",
        "userRole",
        "firstName",
        "lastName",
        "headUserId",
        "mobileNumber",
        "warehouseId",
        "branchId",
        "outletIds"
      ],
      where: { id: payload.id }
    });
    user.then(u => {
      // console.log(u);
      if (u) {
        return done(null, {
          userId: u.id,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          userRole: u.userRole,
          headUserId: u.headUserId,
          mobileNumber: u.mobileNumber,
          warehouseId: u.warehouseId,
          branchId: u.branchId,
          outletIds: u.outletIds
        });
      } else {
        return done(new Error("User not found"), null);
      }
    });
  });
  passport.use(strategy);
  return {
    initialize: function() {
      return passport.initialize();
    },
    authenticate: function() {
      return passport.authenticate("jwt", cfg.jwtSession);
    }
  };
};
