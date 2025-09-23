// Utility to fetch dummy data from public folder
export async function fetchDummyData(file) {
  try {
    const response = await fetch(`/data/${file}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${file}:`, error);
    return [];
  }
}

// Export specific data fetchers
export const fetchUsers = () => fetchDummyData('users');
export const fetchPosts = () => fetchDummyData('posts');
export const fetchTags = () => fetchDummyData('tags');
export const fetchInteractions = () => fetchDummyData('interactions');
export const fetchComments = () => fetchDummyData('comments');

// Fetch all data at once
export async function fetchAllData() {
  const [users, posts, tags, interactions, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchTags(),
    fetchInteractions(),
    fetchComments()
  ]);

  return {
    users,
    posts,
    tags,
    interactions,
    comments
  };
}
