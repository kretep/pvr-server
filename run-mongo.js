
const spawn = require('child_process').spawn;
const pipe = spawn('mongod', []);
pipe.stdout.on('data', function (data) {
 console.log(data.toString('utf8'));
});
pipe.stderr.on('data', (data) => {
 console.log(data.toString('utf8'));
});
pipe.on('close', (code) => {
 console.log('Process exited with code: '+ code);
});

