// Mock Users (with password added for login)
const mockUsers = [
  { _id: '1', name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', role: 'Student' },
  { _id: '2', name: 'Bob Smith', email: 'bob@example.com', password: 'password123', role: 'Leader' },
  { _id: '3', name: 'Charlie Brown', email: 'charlie@example.com', password: 'password123', role: 'Teacher' },
];

// Mock Projects
const mockProjects = [
  {
    _id: '1',
    name: 'Project Alpha',
    description: 'A collaborative project for students',
    leader: '2',
    members: ['1', '3'],
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Project Beta',
    description: 'Another collaborative project',
    leader: '2',
    members: ['1'],
    status: 'Active',
    createdAt: new Date().toISOString()
  }
];

// Mock Tasks
const mockTasks = [
  {
    _id: '1',
    title: 'Task 1',
    description: 'First task',
    project: '1',
    assignedTo: '1',
    status: 'Pending',
    priority: 'High',
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];

// Simulate delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Mock API
const api = {

  // ✅ GET
  get: async (url) => {
    await delay(300);

    if (url === '/projects') return { data: mockProjects };
    if (url === '/tasks') return { data: mockTasks };
    if (url === '/auth/users') return { data: mockUsers };

    if (url.startsWith('/tasks/project/')) {
      const id = url.split('/').pop();
      return { data: mockTasks.filter(t => t.project === id) };
    }

    return { data: [] };
  },

  // ✅ POST
  post: async (url, data) => {
    await delay(300);

    // REGISTER
    if (url === '/auth/register') {
      const exists = mockUsers.find(u => u.email === data.email);

      if (exists) {
        throw {
          response: {
            data: { message: 'User already exists' }
          }
        };
      }

      const newUser = {
        _id: Date.now().toString(),
        name: data.name,
        email: data.email,
        password: data.password || 'password123',
        role: 'Student'
      };

      mockUsers.push(newUser);

      return {
        data: {
          user: newUser,
          token: 'mock-token'
        }
      };
    }

    // LOGIN
    if (url === '/auth/login') {
      const user = mockUsers.find(u => u.email === data.email);

      if (!user || user.password !== data.password) {
        throw {
          response: {
            data: { message: 'Invalid email or password' }
          }
        };
      }

      return {
        data: {
          user,
          token: 'mock-token'
        }
      };
    }

    // CREATE TASK
    if (url === '/tasks') {
      const newTask = {
        ...data,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      mockTasks.push(newTask);
      return { data: newTask };
    }

    return { data: {} };
  },

  // ✅ PUT
  put: async (url, data) => {
    await delay(300);

    if (url.startsWith('/tasks/')) {
      const id = url.split('/')[2];
      const task = mockTasks.find(t => t._id === id);

      if (task) {
        Object.assign(task, data);
        return { data: task };
      }
    }

    return { data: {} };
  },

  // ✅ DELETE
  delete: async (url) => {
    await delay(300);

    if (url.startsWith('/tasks/')) {
      const id = url.split('/')[2];
      const index = mockTasks.findIndex(t => t._id === id);

      if (index !== -1) mockTasks.splice(index, 1);
    }

    if (url.startsWith('/projects/')) {
      const id = url.split('/')[2];
      const index = mockProjects.findIndex(p => p._id === id);

      if (index !== -1) mockProjects.splice(index, 1);
    }

    return { data: {} };
  }
};

export default api;