process.env.NODE_ENV = 'production';

const rp = require('request-promise');
const { sequelize } = require('../models');

async function main() {
  let data;
  try {
    data = await rp('https://api.ellipsis.finance/api/getPoolData');
    data = JSON.parse(data);
  } catch(e) {
    console.error('Cannot fetch Ellipsis stats from remote', e.message);
  }

  if (data.success) {
    data  = data.data;
    try {
      await sequelize.query('INSERT INTO ellipsis_staking (apy_eps, apy_busd, datetime) VALUES (:eps, :busd, :date);', {
        replacements: {eps: data["eps"]["1"]["apyEps"], busd: data["eps"]["1"]["apyBusd"], date: Date.now() }
      });
    } catch(e) { console.error('Cannot save Ellipsis stats to DB', e.message); }
  }
}

setInterval(function() { main() }, 60 * 60 * 1000);
