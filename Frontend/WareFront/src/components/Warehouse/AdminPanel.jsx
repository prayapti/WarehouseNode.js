import { useState } from 'react';
import { Users, Settings, BarChart3, Shield, Menu, X, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import '../../cssfiles/AdminPanel.css';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [users, setUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Manager', status: 'active', lastLogin: '2024-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Inbound Staff', status: 'active', lastLogin: '2024-01-14' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Outbound Staff', status: 'inactive', lastLogin: '2024-01-10' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Data Operator', status: 'active', lastLogin: '2024-01-13' },
  ]);

  const [roles, setRoles] = useState([
    { id: '1', name: 'Manager', permissions: ['read', 'write', 'delete', 'manage_users'], userCount: 3 },
    { id: '2', name: 'Inbound Staff', permissions: ['read', 'write'], userCount: 8 },
    { id: '3', name: 'Outbound Staff', permissions: ['read', 'write'], userCount: 12 },
    { id: '4', name: 'Data Operator', permissions: ['read', 'write', 'data_entry'], userCount: 5 },
  ]);

  const stats = [
    { title: 'Total Users', value: '28', change: '+12%', icon: Users },
    { title: 'Active Sessions', value: '18', change: '+5%', icon: Eye },
    { title: 'Total Roles', value: '4', change: '0%', icon: Shield },
    { title: 'System Health', value: '98%', change: '+2%', icon: BarChart3 },
  ];

  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', status: 'active' });
  const [newRole, setNewRole] = useState({ name: '', permissions: [] });
  const [viewUser, setViewUser] = useState(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addUser = () => {
    const id = (users.length + 1).toString();
    const user = { ...newUser, id, lastLogin: new Date().toISOString().split('T')[0] };
    setUsers([...users, user]);
    setShowUserModal(false);
    setNewUser({ name: '', email: '', role: '', status: 'active' });
  };

  const createRole = () => {
    const id = (roles.length + 1).toString();
    const role = { ...newRole, id, userCount: 0 };
    setRoles([...roles, role]);
    setShowRoleModal(false);
    setNewRole({ name: '', permissions: [] });
  };

  const editUser = (id) => {
    const user = users.find(u => u.id === id);
    if(!user) return;
    const name = prompt('Edit name', user.name) || user.name;
    const email = prompt('Edit email', user.email) || user.email;
    const role = prompt('Edit role', user.role) || user.role;
    const status = prompt('Edit status', user.status) || user.status;
    setUsers(prev => prev.map(u => u.id === id ? {...u, name, email, role, status } : u));
  };

  const deleteUser = (id) => {
    if(window.confirm('Are you sure you want to delete this user?')){
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };
  const handleViewUser = (user) => {
  setViewUser(user);
};

  const editRole = (id) => {
    const role = roles.find(r => r.id === id);
    if(!role) return;
    const name = prompt('Edit role name', role.name) || role.name;
    const perms = prompt('Edit permissions comma separated', role.permissions.join(',')) || role.permissions.join(',');
    setRoles(prev => prev.map(r => r.id === id ? {...r, name, permissions: perms.split(',').map(p => p.trim()).filter(Boolean) } : r));
  };

  const deleteRole = (id) => {
    if(window.confirm('Are you sure you want to delete this role?')){
      setRoles(prev => prev.filter(r => r.id !== id));
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's what's happening with your system.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              <span className="stat-change">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <Users size={16} />
            </div>
            <div className="activity-content">
              <p><strong>New user registered:</strong> John Doe</p>
              <span>2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <Shield size={16} />
            </div>
            <div className="activity-content">
              <p><strong>Role updated:</strong> Manager permissions modified</p>
              <span>4 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <Settings size={16} />
            </div>
            <div className="activity-content">
              <p><strong>System maintenance:</strong> Database backup completed</p>
              <span>1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="users-content">
      <div className="content-header">
        <h1>User Management</h1>
        <div className="header-actions">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={() => setShowUserModal(true)}>
            <Plus size={16} />
            Add User
          </button>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">{user.name.charAt(0)}</div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className="role-badge">{user.role}</span>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.lastLogin}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="View" onClick={() => handleViewUser(user)}>
                      <Eye size={14} />
                    </button>
                    <button className="btn-icon" title="Edit" onClick={() => editUser(user.id)}>
                      <Edit size={14} />
                    </button>
                    <button className="btn-icon delete" title="Delete" onClick={() => deleteUser(user.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRoles = () => (
    <div className="roles-content">
      <div className="content-header">
        <h1>Role Management</h1>
        <button className="btn-primary" onClick={() => setShowRoleModal(true)}>
          <Plus size={16} />
          Create Role
        </button>
      </div>

      <div className="roles-grid">
        {roles.map((role) => (
          <div key={role.id} className="role-card">
            <div className="role-header">
              <h3>{role.name}</h3>
              <div className="role-actions">
                <button className="btn-icon" onClick={() => editRole(role.id)}>
                  <Edit size={14} />
                </button>
                <button className="btn-icon delete" onClick={() => deleteRole(role.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="role-stats">
              <span>{role.userCount} users</span>
              <span>{role.permissions.length} permissions</span>
            </div>
            <div className="role-permissions">
              <h4>Permissions:</h4>
              <div className="permission-tags">
                {role.permissions.map((permission, index) => (
                  <span key={index} className="permission-tag">
                    {permission.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-content">
      <div className="content-header">
        <h1>System Settings</h1>
      </div>

      <div className="settings-sections">
        <div className="setting-section">
          <h3>Security Settings</h3>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Require two-factor authentication
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Force password reset every 90 days
            </label>
          </div>
          <div className="setting-item">
            <label>
              Minimum password length:
              <input type="number" defaultValue="8" min="6" max="20" />
            </label>
          </div>
        </div>

        <div className="setting-section">
          <h3>System Configuration</h3>
          <div className="setting-item">
            <label>
              System timezone:
              <select defaultValue="UTC">
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
              </select>
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Enable system maintenance mode
            </label>
          </div>
        </div>

        <div className="setting-section">
          <h3>Backup & Recovery</h3>
          <div className="setting-item">
            <label>
              Backup frequency:
              <select defaultValue="daily">
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
          </div>
          <button className="btn-primary" onClick={handleManualBackup}>Create Manual Backup</button>
        </div>
      </div>
    </div>
  );

const handleManualBackup = async () => {
  try {
    // CHANGE 1: Create Manual Backup URL
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/backup/manual`, { method: 'POST' });
    const data = await res.json();

    if (!res.ok) return alert(`Backup failed: ${data.message}`);

    // Download backup
    // CHANGE 2: Download Backup URL
    const downloadRes = await fetch(`${import.meta.env.VITE_BASE_URL}/api/backup/download/${data.filename}`);
    const blob = await downloadRes.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = data.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    alert(`Backup created successfully: ${data.filename}`);
  } catch (err) {
    alert('Error creating backup: ' + err.message);
  }
};

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'roles':
        return renderRoles();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="admin-panel">
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">TG</div>
          {sidebarOpen &&<div className="logo-text">Admin Panel</div>}
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <BarChart3 size={20} />{sidebarOpen && <span>Dashboard</span>}
          </button>
          <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={20} />{sidebarOpen && <span>Users</span>}
          </button>
          <button className={`nav-item ${activeTab === 'roles' ? 'active' : ''}`} onClick={() => setActiveTab('roles')}>
            <Shield size={20} />{sidebarOpen && <span>Roles</span>}
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} />{sidebarOpen && <span>Settings</span>}
          </button>
        </nav>
      </div>
      
      <div className="main-content">
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </div>

      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowUserModal(false)}>×</button>
            <h2>Add New User</h2>
            <form onSubmit={(e) => { e.preventDefault(); addUser(); }}>
              <label>
                Name
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </label>
              <label>
                Role
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Status
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <div className="btn-group">
                <button type="button" className="btn-secondary" onClick={() => setShowUserModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRoleModal && (
        <div className="modal-overlay" onClick={() => setShowRoleModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowRoleModal(false)}>×</button>
            <h2>Create New Role</h2>
            <form onSubmit={(e) => { e.preventDefault(); createRole(); }}>
              <label>
                Role Name
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Permissions (comma separated)
                <input
                  type="text"
                  value={newRole.permissions.join(', ')}
                  onChange={(e) => setNewRole({ ...newRole, permissions: e.target.value.split(',').map(p => p.trim()).filter(Boolean) })}
                  placeholder="read, write, delete"
                />
              </label>
              <div className="btn-group">
                <button type="button" className="btn-secondary" onClick={() => setShowRoleModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Role</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {viewUser && (
  <div className="modal-overlay" onClick={() => setViewUser(null)}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={() => setViewUser(null)}>×</button>
      <h2>User Details</h2>
      <div className="user-details">
        <p><strong>Name:</strong> {viewUser.name}</p>
        <p><strong>Email:</strong> {viewUser.email}</p>
        <p><strong>Role:</strong> {viewUser.role}</p>
        <p><strong>Status:</strong> {viewUser.status}</p>
        <p><strong>Last Login:</strong> {viewUser.lastLogin}</p>
        <p><strong>Current Password:</strong> <span className="password-placeholder">••••••••</span></p>
      </div>
      <div className="btn-group">
        <button className="btn-secondary" onClick={() => setViewUser(null)}>Close</button>
      </div>
    </div>
  </div>
)}
    </div>
    
  );
}

export default AdminPanel;