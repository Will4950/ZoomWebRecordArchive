const fs = require('fs');
const fetch = require('node-fetch');
const config = require('./config');

module.exports = (token, payload) => {
    if (typeof payload.object != 'undefined'){
        var topic = payload.object.topic;
        var start_time = new Date(payload.object.start_time).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).replace(',', '');        
        var email = payload.object.host_email;
        var uuid = payload.object.uuid.replace(/[/\\?%*:|"<>]/g, '-');
        
        payload.object.recording_files.forEach(ele => {
            var rectype = ele.recording_type;
            var dir = config.dir + email + '/';       
            var filename = start_time.replace(/[^a-z0-9]/gi, '_') + '-' + topic.replace(/[^a-z0-9]/gi, '_') + '-' + rectype + '-' + uuid + '.' + ele.file_extension.toLowerCase();    
            var url = ele.download_url + '?access_token=' + token;     
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
           
            fetch(url).then((res) => {
                res.body.pipe(fs.createWriteStream(dir + filename));
            }).then(() => console.log('saved | ' + dir + filename));           
         
        });

    } else {
        console.error('recording.completed  | no object');
    }
}