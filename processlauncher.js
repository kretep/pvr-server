let pm2 = require('pm2');

let PMManager = class PMManager {

  initialize() {
    pm2.connect(function(err) {
      if (err) {
        console.error(err);
        process.exit(2);
      }
      console.log("pm2 running");
    });
  }

  launchProcess(name, script) {
    pm2.connect(function(err) {
      if (err) {
        console.error(err);
        process.exit(2);
      }
      pm2.start({
        name,
        script,
        max_memory_restart : '500M'
      }, function(err, apps) {
        console.log('Started', name);
        pm2.disconnect();
        if (err) throw err
      });
    });
  }

  quitter(name) {
    pm2.connect(function(err) {
      if (err) {
        console.error(err);
        process.exit(2);
      }
      pm2.stop(name, function(err, apps) {
        pm2.disconnect();
        if (err) throw err
      });
    });
  }

  listProcesses() {
    pm2.connect(function(err) {
      if (err) {
        console.error(err);
        process.exit(2);
      }
      pm2.list(function(err, processDescriptionList) {
        pm2.disconnect();
        //console.log(JSON.stringify(processDescriptionList));
        console.log('# processes:', processDescriptionList.length)
        if (err) throw err
      });
    });
  }

  kill() {
    pm2.killDaemon(function(err) {
      if (err) {
        console.error(err);
      }
    });
  }
}

module.exports = {
  PMManager
}
