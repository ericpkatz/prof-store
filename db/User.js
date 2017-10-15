const conn = require('./conn');
const Sequelize = conn.Sequelize;

const User = conn.define('user', {
  name: {
    type: Sequelize.STRING ,
  },
  email: {
    type: Sequelize.STRING ,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  address: {
    type: Sequelize.JSON,
    defaultValue: {}
  }
});

User.authenticate = (credentials)=> {
  return User.findOne({
    where: credentials,
  })
  .then( user => {
    if(!user){
      throw new Error('BAD CREDENTIALS')
    }
    return User.findOrThrow(user.id);
  });
};

User.findBySession = function(session){
  if(!session.userId){
    const error = new Error('USER NOT IN SESSION');
    error.status = 401;
    throw error;
  }
  return User.findOrThrow(session.userId)
    .catch( er => {
      delete session.userId;
      throw er
    });
};

User.findOrThrow = (id)=> {
  return User.findById(id,
    {
      attributes: {
        exclude: ['password']
      },
      include: [
        {
          model: conn.models.order,
          where: {
            status: 'ORDER'
          },
          required: false,
          include: [
            conn.models.lineItem
          ]
        }
      ]
    }
  )
  .then( user => {
    if(!user){
      throw new Error('BAD CREDENTIALS')
    }
    return user;
  });
};

module.exports = User;
