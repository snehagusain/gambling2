/**
 * Firebase to Supabase Migration Script
 * 
 * This script exports data from Firebase Firestore and imports it to Supabase.
 * IMPORTANT: This is an example script - adapt it to your specific data structure.
 */

require('dotenv').config();
const admin = require('firebase-admin');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK with service account
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const firestore = admin.firestore();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Note: This is different from the anon key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Collection mapping between Firebase and Supabase
const COLLECTIONS = {
  'users': {
    tableName: 'users',
    transform: transformUser
  },
  'admins': {
    tableName: 'admins',
    transform: transformAdmin
  },
  'wallets': {
    tableName: 'wallets',
    transform: transformWallet
  },
  'matches': {
    tableName: 'matches',
    transform: transformMatch
  },
  'transactions': {
    tableName: 'transactions',
    transform: transformTransaction
  }
};

// Mapping user IDs between systems
const userIdMap = new Map();

// Main migration function
async function migrateData() {
  try {
    console.log('Starting migration from Firebase to Supabase...');
    
    // Backup data to JSON files (for safety)
    await backupToJson();
    
    // Migrate users first to establish ID mappings
    await migrateCollection('users');
    
    // Migrate other collections
    for (const collection of Object.keys(COLLECTIONS)) {
      if (collection !== 'users') {
        await migrateCollection(collection);
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Backup Firestore data to JSON
async function backupToJson() {
  console.log('Backing up Firestore data to JSON...');
  const backupDir = path.join(__dirname, 'backup', `${Date.now()}`);
  
  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Backup each collection
  for (const collection of Object.keys(COLLECTIONS)) {
    const snapshot = await firestore.collection(collection).get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const filePath = path.join(backupDir, `${collection}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Backed up ${data.length} documents from ${collection}`);
  }
}

// Migrate a specific collection
async function migrateCollection(collectionName) {
  console.log(`Migrating collection: ${collectionName}`);
  const { tableName, transform } = COLLECTIONS[collectionName];
  
  // Fetch data from Firestore
  const snapshot = await firestore.collection(collectionName).get();
  console.log(`Found ${snapshot.docs.length} documents in ${collectionName}`);
  
  // Transform and insert data in batches
  const batchSize = 100;
  const batches = [];
  
  for (let i = 0; i < snapshot.docs.length; i += batchSize) {
    const batch = snapshot.docs.slice(i, i + batchSize);
    const transformedData = await Promise.all(
      batch.map(async (doc) => {
        return transform({ id: doc.id, ...doc.data() });
      })
    );
    
    // Filter out null values (items to skip)
    const validData = transformedData.filter(item => item !== null);
    
    if (validData.length > 0) {
      // Insert into Supabase
      const { data, error } = await supabase
        .from(tableName)
        .insert(validData);
      
      if (error) {
        console.error(`Error inserting into ${tableName}:`, error);
        throw error;
      }
      
      console.log(`Inserted ${validData.length} rows into ${tableName}`);
    }
    
    batches.push(validData.length);
  }
  
  console.log(`Migration of ${collectionName} completed. Total records: ${batches.reduce((a, b) => a + b, 0)}`);
}

// Transform functions for each collection
async function transformUser(user) {
  const { id, displayName, email, status, createdAt } = user;
  
  // Create entry in the users table
  const newUser = {
    auth_id: id,
    display_name: displayName || null,
    email: email || null,
    status: status || 'active',
    created_at: createdAt ? new Date(createdAt.toDate()).toISOString() : new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Insert into Supabase to get the new ID
  const { data, error } = await supabase
    .from('users')
    .insert(newUser)
    .select('id')
    .single();
  
  if (error) {
    console.error('Error inserting user:', error);
    return null;
  }
  
  // Store the mapping between Firebase UID and Supabase ID
  userIdMap.set(id, data.id);
  
  return null; // Already inserted
}

async function transformAdmin(admin) {
  const { id, uid, role } = admin;
  
  // Look up the new user ID
  const newUserId = userIdMap.get(uid);
  if (!newUserId) {
    console.error(`User ID ${uid} not found for admin ${id}`);
    return null;
  }
  
  return {
    user_id: newUserId,
    role: role || 'admin',
    created_at: new Date().toISOString()
  };
}

async function transformWallet(wallet) {
  const { id, userId, balance } = wallet;
  
  // Look up the new user ID
  const newUserId = userIdMap.get(userId);
  if (!newUserId) {
    console.error(`User ID ${userId} not found for wallet ${id}`);
    return null;
  }
  
  return {
    user_id: newUserId,
    balance: balance || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function transformMatch(match) {
  const { 
    id, matchId, sport, match: matchName, 
    teamA, teamB, time, league, odds, status 
  } = match;
  
  return {
    match_id: matchId,
    sport,
    match: matchName,
    team_a: teamA,
    team_b: teamB,
    time,
    league,
    odds: JSON.stringify(odds),
    status: status || 'upcoming',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

async function transformTransaction(transaction) {
  const { 
    id, userId, type, amount, timestamp, 
    description, status, betDetails 
  } = transaction;
  
  // Look up the new user ID
  const newUserId = userIdMap.get(userId);
  if (!newUserId) {
    console.error(`User ID ${userId} not found for transaction ${id}`);
    return null;
  }
  
  return {
    user_id: newUserId,
    type,
    amount,
    description: description || null,
    bet_details: betDetails ? JSON.stringify(betDetails) : null,
    status: status || 'completed',
    created_at: timestamp ? new Date(timestamp.toDate()).toISOString() : new Date().toISOString()
  };
}

// Run the migration
migrateData().catch(console.error); 