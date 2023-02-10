import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import {createServer} from 'node:http';
import {createHmac} from 'node:crypto';
import fs from 'node:fs';

const router = express.Router();

async function processFile(token, object, file) {
	console.log(`Processing ${file.id}`);

	let directory = `./downloads/${object.host_email}/`;

	let start_time = object.start_time.replace(/[^a-z0-9]/gi, '_');
	let id = object.id;
	let topic = object.topic.replace(/[^a-z0-9]/gi, '_');
	let type = file.recording_type;
	let ext = file.file_extension.toLowerCase();
	let filename = `${start_time} [${id}] ${topic}_${type}.${ext}`;

	if (!fs.existsSync(directory)) fs.mkdirSync(directory, {recursive: true});

	try {
		let blob = await axios({
			method: 'get',
			url: file.download_url,
			headers: {Authorization: `Bearer ${token}`},
			responseType: 'stream'
		});

		blob.data.pipe(fs.createWriteStream(`${directory}${filename}`));
	} catch (e) {
		console.log(`error: ${e}`);
	}
}

router.post('/', express.json(), async (req, res) => {
	try {
		if (req.body.event === 'endpoint.url_validation') {
			let hashForPlainToken = createHmac('sha256', process.env.SECRET_TOKEN)
				.update(req.body.payload.plainToken)
				.digest('hex');
			res.status(200).json({
				plainToken: req.body.payload.plainToken,
				encryptedToken: hashForPlainToken
			});
			return;
		}
	} catch (e) {
		res.sendStatus(401);
		return;
	}

	try {
		let message = `v0:${req.headers['x-zm-request-timestamp']}:${JSON.stringify(
			req.body
		)}`;
		let hashForVerify = createHmac('sha256', process.env.SECRET_TOKEN)
			.update(message)
			.digest('hex');
		let signature = `v0=${hashForVerify}`;
		if (req.headers['x-zm-signature'] !== signature)
			throw new Error('Invalid signature');
	} catch (e) {
		res.sendStatus(400);
		return;
	}

	res.sendStatus(200);
	let body = {...req.body};

	if (body.event === 'recording.completed') {
		console.log('Processing recording.completed event...');

		let token = body.download_token;

		try {
			for (let file of body.payload.object.recording_files) {
				await processFile(token, body.payload.object, file);
			}
		} catch (e) {
			if (e instanceof TypeError)
				console.log('No recording files found in payload');
		}

		try {
			for (let file of body.payload.object.participant_audio_files) {
				await processFile(token, body.payload.object, file);
			}
		} catch (e) {
			if (e instanceof TypeError)
				console.log('No participant audio files found in payload');
		}
	}
});

router.use((req, res) => {
	res.sendStatus(404);
});

async function onError(error) {
	console.log(`http | ${error}`);
	process.exit(1);
}

async function onListening() {
	console.log(
		`http | listening on ${
			process.env.HOST === '0.0.0.0' ? 'locahost' : process.env.HOST
		}:${process.env.PORT}`
	);
}

const app = express();
app.set('x-powered-by', false);
app.use(router);
const server = createServer(app);
server.on('error', onError);
server.on('listening', onListening);

if (!!process.env.PORT === false) process.env.PORT = 3000;
if (!!process.env.HOST === false) process.env.HOST = '0.0.0.0';

server.listen(process.env.PORT, process.env.HOST);
