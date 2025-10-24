import fs from 'fs';
import path from 'path';
import {User} from '../model/authentication.js';
import Role from '../model/Role.js';

// Create backup and return filename
export const createManualBackup = async (req, res) => {
  try {
    const users = await User.find().lean();
    const roles = await Role.find().lean();

    const totalUsers = users.length;
    const activeSessions = users.filter(u => u.status === 'active').length;
    const totalRoles = roles.length;
    const systemHealth = "98%"; // placeholder

    const stats = [
      { title: 'Total Users', value: totalUsers.toString(), change: '+0%', icon: 'Users' },
      { title: 'Active Sessions', value: activeSessions.toString(), change: '+0%', icon: 'Eye' },
      { title: 'Total Roles', value: totalRoles.toString(), change: '+0%', icon: 'Shield' },
      { title: 'System Health', value: systemHealth, change: '+0%', icon: 'BarChart3' },
    ];

    const backupData = {
      timestamp: new Date(),
      stats,
      users,
      roles,
    };

    const backupFolder = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupFolder)) fs.mkdirSync(backupFolder);

    const filename = `backup_${Date.now()}.json`;
    const filepath = path.join(backupFolder, filename);

    fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2));

    res.status(200).json({ message: 'Manual backup created', filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create backup', error: err.message });
  }
};

// Download backup file
export const downloadBackup = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), 'backups', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Backup file not found' });
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error downloading file' });
    }
  });
};
