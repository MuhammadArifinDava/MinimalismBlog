
export function getPostImageUrl(post) {
  if (post?.image) {
    if (post.image.startsWith("http")) return post.image;
    const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${base}${post.image}`;
  }
  return `https://picsum.photos/seed/${post?._id}/800/600`;
}

export function getUserAvatarUrl(user) {
  if (user?.avatarPath) {
    if (user.avatarPath.startsWith("http")) return user.avatarPath;
    const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${base}${user.avatarPath}`;
  }
  return null;
}
