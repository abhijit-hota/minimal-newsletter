import Database from 'better-sqlite3';
import express from 'express';
import cors from 'cors';

const db = new Database('/tmp/glood-database.db', { verbose: console.log });
db.prepare('CREATE TABLE IF NOT EXISTS subscribers (email TEXT UNIQUE)').run();
console.log('Connected to database.');

const app = express();
app.use(express.json());
app.use(cors());

const VALID_EMAIL_PATTERN = /[a-z0-9_]+@\w+.\w+/;

app.post('/subscribe', async (req, res) => {
	try {
		const { email } = req.body;
		const isEmailInvalid = !VALID_EMAIL_PATTERN.test(email);

		if (isEmailInvalid) {
			return res.status(400).send('Invalid E-Mail address');
		}
		const stmt = db.prepare(`INSERT INTO subscribers VALUES (?)`);
		stmt.run(email);
		res.send('Successfully subscribed');
	} catch (error) {
		if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
			return res.status(409).send('You have already subscribed to the newsletter!');
		}
		console.error(error);
		return res.status(500).send(error.message);
	}
});

app.get('/subscribers', async (req, res) => {
	try {
		const stmt = db.prepare('SELECT email FROM subscribers');
		const allSubscribers = stmt.all();
		res.json(allSubscribers.map(({ email }) => email));
	} catch (error) {
		console.error(error);
		return res.status(500).send(error.message);
	}
});

app.listen(5000, () => {
	console.log('API Server listening at 5000');
});
