require('dotenv').config();
const bcrypt   = require('bcrypt');
const supabase = require('../config/db');

(async () => {
  try {
    const passwordHash = await bcrypt.hash('Admin@123', 12);

    const { error } = await supabase
      .from('users')
      .upsert(
        {
        
          username:      'admin',
          password_hash: passwordHash,
          role:          'admin',
        },
        { onConflict: 'email' }
      );

    if (error) throw error;

    console.log('Admin seeded successfully');
    console.log('Username: admin');
    console.log('Password: Admin@123');
  } catch (err) {
    console.error('Seed failed:', err.message);
  }
})();