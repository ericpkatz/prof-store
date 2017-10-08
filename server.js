const app = require('./app');
const db = require('./db');

db.sync()
  .then(()=> db.seed())
  .then( seeded => console.log(seeded.users.moe.email));

app.listen(process.env.PORT || 3000);
