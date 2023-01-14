let cron = require('node-cron')

// Creating a cron job which runs on every 10 second
cron.schedule("*/10 * * * * *", function () {
    console.log("running a task every 10 second");
},{
    scheduled:true,
    timezone:'india'
})