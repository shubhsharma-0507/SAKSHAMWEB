// Verifies your MongoDB Atlas connection:  npm run db:check
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set in .env.local');
  process.exit(1);
}
try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  await mongoose.connection.db.admin().ping();
  const hospitals = await mongoose.connection.collection('hospitals').countDocuments();
  console.log(`Connected to database "${mongoose.connection.name}". Hospitals stored: ${hospitals}.`);
  await mongoose.disconnect();
} catch (e) {
  const t = `${e.name} ${e.message}`;
  const why =
    /bad auth|authentication failed/i.test(t) ? 'Wrong username or password in MONGODB_URI.' :
    /whitelist|not allowed|Could not connect to any servers/i.test(t) ? "Atlas is blocking this IP. Add it under Network Access." :
    /ENOTFOUND|querySrv|EAI_AGAIN|Invalid/i.test(t) ? 'MONGODB_URI looks wrong (check the cluster host). Copy it again from Atlas.' :
    e.message;
  console.error('Could not connect:', why);
  process.exit(1);
}
