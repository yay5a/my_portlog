import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Contact from '@/models/Contact';

// simple link regex: blocks obvious spam that includes http/https or www
const URL_RE = /(https?:\/\/|www\.)/i;
const MAX_LEN = 280;
const PER_IP_LIMIT = 5;       // max submissions per hour per IP

function getClientIp(req) {
	const xf = req.headers.get('x-forwarded-for') || '';
	return xf.split(',')[0].trim() || '0.0.0.0';
}

export async function POST(req) {
	try {
		const { name = '', email = '', message = '', website = '' } = await req.json();

		// honeypot: if filled, silently "OK" but drop it
		if (website && website.trim().length > 0) {
			return NextResponse.json({ ok: true }, { status: 200 });
		}

		const msg = String(message || '').trim();
		if (!msg) {
			return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
		}
		if (msg.length > MAX_LEN) {
			return NextResponse.json({ error: `Max ${MAX_LEN} characters.` }, { status: 400 });
		}
		if (URL_RE.test(msg)) {
			return NextResponse.json({ error: 'Links are not allowed.' }, { status: 400 });
		}

		await dbConnect();

		const ip = getClientIp(req);
		const ua = req.headers.get('user-agent') || '';

		// Rate limit: 5 per hour per IP
		const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
		const recentCount = await Contact.countDocuments({ ip, createdAt: { $gte: oneHourAgo } });
		if (recentCount >= PER_IP_LIMIT) {
			return NextResponse.json({ error: 'Too many messages. Try again later.' }, { status: 429 });
		}

		await Contact.create({ name: name?.trim(), email: email?.trim(), message: msg, ip, ua });

		return NextResponse.json({ ok: true }, { status: 201 });
	} catch (err) {
		console.error('Contact POST error:', err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}

// Optional: lock GET down behind a simple key if you want to read messages
export async function GET(req) {
	const key = req.headers.get('x-admin-key');
	if (!process.env.CONTACT_ADMIN_KEY || key !== process.env.CONTACT_ADMIN_KEY) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	await dbConnect();
	const messages = await Contact.find().sort({ createdAt: -1 }).limit(100).lean();
	return NextResponse.json({ messages }, { status: 200 });
}
