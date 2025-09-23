import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // Data state
  users: [],
  posts: [],
  tags: [],
  interactions: [],
  comments: [],

  // UI state
  sidebarCollapsed: false,
  currentPage: 'dashboard',

  // Actions
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setCurrentPage: (page) => set({ currentPage: page }),

  // Data actions
  setUsers: (users) => set({ users }),
  setPosts: (posts) => set({ posts }),
  setTags: (tags) => set({ tags }),
  setInteractions: (interactions) => set({ interactions }),
  setComments: (comments) => set({ comments }),

  // Fetch data
  fetchData: async (endpoint) => {
    try {
      const response = await fetch(`/data/${endpoint}.json`);
      const data = await response.json();
      
      switch (endpoint) {
        case 'users':
          set({ users: data });
          break;
        case 'posts':
          set({ posts: data });
          break;
        case 'tags':
          set({ tags: data });
          break;
        case 'interactions':
          set({ interactions: data });
          break;
        case 'comments':
          set({ comments: data });
          break;
        default:
          break;
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return [];
    }
  },

  // Stats calculations
  getStats: () => {
    const { users, posts, interactions } = get();
    const today = new Date().toISOString().split('T')[0];
    
    const totalVisits = posts.reduce((sum, post) => sum + post.views, 0);
    const usersOnline = users.filter(user => user.isOnline).length;
    const usersRegisteredToday = users.filter(user => 
      user.registeredDate === today
    ).length;
    
    const todayInteractions = interactions.filter(interaction => 
      interaction.createdAt?.startsWith(today)
    ).length;
    
    return {
      totalVisits,
      usersOnline,
      usersRegisteredToday,
      todayInteractions,
      totalUsers: users.length,
      totalPosts: posts.length
    };
  }
}));

export default useStore;