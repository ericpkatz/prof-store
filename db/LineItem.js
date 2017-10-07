const conn = require('./conn');
const Sequelize = conn.Sequelize;

const LineItem = conn.define('lineItem', {
});

module.exports = LineItem;
