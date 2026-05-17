import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "users.json");

// Ensure db exists
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: [], otps: {} }, null, 2));
}

export const getDB = () => JSON.parse(fs.readFileSync(dbPath, "utf-8"));
export const saveDB = (data: any) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

export const findUser = (email: string) => {
  const db = getDB();
  return db.users.find((u: any) => u.email === email);
};

export const saveUser = (user: any) => {
  const db = getDB();
  db.users.push(user);
  saveDB(db);
};

export const setOtp = (email: string, otp: string) => {
  const db = getDB();
  db.otps[email] = { otp, expires: Date.now() + 10 * 60 * 1000 }; // 10 min
  saveDB(db);
};

export const verifyOtp = (email: string, otp: string) => {
  const db = getDB();
  const record = db.otps[email];
  if (!record) return false;
  if (record.otp === otp && Date.now() < record.expires) {
    delete db.otps[email];
    saveDB(db);
    return true;
  }
  return false;
};
