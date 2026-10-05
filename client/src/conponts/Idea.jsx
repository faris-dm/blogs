import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import PostSkeleton from "./Loading";
import { FaHeart, FaRegHeart, FaRegComment, FaShare } from "react-icons/fa";

const mockPost = {
  id: "post_001",
  author: {
    id: "user_001",
    name: "Faris Naser",
    profileImage: "",
  },
  content:
    "This is where the post content will appear. You can replace this text with your actual post data.",
  image: "",
  createdAt: "2 hours ago",
  likes: 0,
};

function Idea() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postError, setPostErrrror] = useState(false);
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [commentsLoading, setCommentsLoading] = useState({});
  const [commentErrors, setCommentErrors] = useState({});

  const [intractions, setIntractions] = useState([]);
  const [follows, setFollows] = useState([]);

  const { user } = useAuth();
  const navigate = useNavigate();
  // Controls create form
  const [isCreating, setIsCreating] = useState(false);

  // Controls preview
  const [isPreviewing, setIsPreviewing] = useState(false);
  const Api_url = "http://localhost:2019";

  // New post data
  const [newPost, setNewPost] = useState({
    content: "",
    image: null,
    imagePreview: "",
  });

  function formatPostDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return "";

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  }

  // get all the posts
  useEffect(() => {
    setLoading(true);
    setPostErrrror(false);

    fetch(`${Api_url}/api/posts`)
      .then((res) => {
        if (!res.ok) throw new Error("failed to get post");
        return res.json();
      })
      .then((json) => {
        setPosts(json.data);
        setLoading(false);
      })
      .catch((err) => {
        setPostErrrror(err.message);
        setLoading(false);
      });
  }, []);

  // // get all post likes
  // useEffect(() => {
  //   setIntractError(false);
  //   fetch(`${Api_url}/api/likes`)
  //     .then((res) => {
  //       if (!res.ok) throw new Error("failed to get likes");
  //     })
  //     .then((json) => {
  //       setIntractions(json.data);
  //     })
  //     .catch((err) => {
  //       console.log("faled to show the likes,server error");
  //       setIntractError(err.message);
  //     });
  // }, []);

  // fetch  for geting user comments
  async function toggleComments(postId) {
    // Close the comments if this post is already open
    if (openCommentsPostId === postId) {
      setOpenCommentsPostId(null);
      return;
    }

    // Open comments for the clicked post
    setOpenCommentsPostId(postId);

    // If comments for this post are already loaded, don't fetch again
    if (commentsByPost[postId]) return;

    setCommentsLoading((prev) => ({
      ...prev,
      [postId]: true,
    }));

    try {
      const res = await fetch(`${Api_url}/api/posts/${postId}/comments`);

      if (!res.ok) {
        throw new Error("Failed to get post comments");
      }

      const json = await res.json();

      // Save comments under this post's ID
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: json.data || [],
      }));
    } catch (err) {
      console.error("Failed to load comments:", err);

      setCommentErrors((prev) => ({
        ...prev,
        [postId]: "Could not load comments.",
      }));
    } finally {
      setCommentsLoading((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }
  }

  //  useEffect(()=> {
  // fetch(`${API_BASE_URL}/api/posts/${id}/comments`)
  //   .then((res) => res.json())
  //   .then((json) => {
  //     const data = json.data || [];
  //     setImages(data);
  //     if (data.length > 0) {
  //       setActiveImage(data[0].image_url);
  //     }
  //   })
  //   .catch((err) => console.error("Failed to load images:", err));
  //  }, [id])

  // route to create new comments
  //  209

  const mockComments = {
    post_001: [
      {
        id: "comment_001",
        username: "Selam Tesfaye",
        profile: "",
        content: "This is a great idea! Keep going 👏",
        created_at: new Date().toISOString(),
      },
      {
        id: "comment_002",
        username: "Abel",
        profile: "",
        content: "I like the design. Looking forward to seeing more.",
        created_at: new Date().toISOString(),
      },
    ],
  };

  const mockLikes = [
    { postId: "post_001", userId: "user_002" },
    { postId: "post_001", userId: "user_003" },
  ];

  const mockFollows = [{ userId: "user_001", followedBy: "user_002" }];

  // Keep these methods in one place.
  // Later, replace their bodies with fetch() calls to your backend.
  const postApi = {
    async getComments(postId) {
      return {
        success: true,
        data: mockComments[postId] || [],
      };
    },

    async addComment(postId, commentData) {
      const newComment = {
        id: `comment_${Date.now()}`,
        username: commentData.username,
        profile: commentData.profile || "",
        content: commentData.content,
        created_at: new Date().toISOString(),
      };

      mockComments[postId] = [...(mockComments[postId] || []), newComment];

      return {
        success: true,
        data: newComment,
      };
    },

    async getLikes() {
      return {
        success: true,
        data: mockLikes,
      };
    },

    async getFollows() {
      return {
        success: true,
        data: mockFollows,
      };
    },
  };

  // if (postError) return <div> Error geting the posts,{postError}</div>;

  // Load likes and follows from the mock API
  useEffect(() => {
    async function loadInteractions() {
      try {
        const [likesResponse, followsResponse] = await Promise.all([
          postApi.getLikes(),
          postApi.getFollows(),
        ]);

        setIntractions(likesResponse.data || []);
        setFollows(followsResponse.data || []);
      } catch (error) {
        console.error("Failed to load interactions:", error);
      }
    }

    loadInteractions();
  }, []);

  async function toggleComments(postId) {
    // Clicking the same post's comment icon closes its panel.
    if (openCommentsPostId === postId) {
      setOpenCommentsPostId(null);
      return;
    }

    setOpenCommentsPostId(postId);

    // Don't reload comments if we already have them.
    if (commentsByPost[postId]) return;

    setCommentsLoading((prev) => ({ ...prev, [postId]: true }));

    try {
      const response = await postApi.getComments(postId);

      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: response.data || [],
      }));
    } catch (error) {
      setCommentErrors((prev) => ({
        ...prev,
        [postId]: "Could not load comments. Please try again.",
      }));
    } finally {
      setCommentsLoading((prev) => ({ ...prev, [postId]: false }));
    }
  }

  function handleCommentInput(postId, value) {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  }

  async function handleConfirmComment(postId) {
    const content = (commentInputs[postId] || "").trim();

    if (!content) {
      setCommentErrors((prev) => ({
        ...prev,
        [postId]: "Please write a comment first.",
      }));
      return;
    }

    try {
      setCommentErrors((prev) => ({ ...prev, [postId]: "" }));

      const response = await postApi.addComment(postId, {
        content,
        username: user?.username || user?.name || "You",
        profile: user?.profile || user?.profileImage || "",
      });

      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), response.data],
      }));

      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (error) {
      setCommentErrors((prev) => ({
        ...prev,
        [postId]: "Could not send your comment. Please try again.",
      }));
    }
  }
  // =========================
  // TEXT INPUT
  // =========================

  const handleContentChange = (e) => {
    setNewPost({
      ...newPost,
      content: e.target.value,
    });
  };

  // =========================
  // IMAGE INPUT
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imagePreview = URL.createObjectURL(file);

    setNewPost({
      ...newPost,
      image: file,
      imagePreview: imagePreview,
    });
  };

  // =========================
  // OPEN PREVIEW
  // =========================

  const handlePreview = () => {
    if (!newPost.content.trim() && !newPost.image) {
      alert("Please add some content or an image.");
      return;
    }

    setIsPreviewing(true);
  };

  // =========================
  // CONFIRM POST
  // =========================

  const handleConfirmPost = async () => {
    try {
      const res = await fetch(`${Api_url}/api/posted`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: newPost.content,
          images: newPost.imagePreview,
        }),
      });

      const json = await res.json(); // read the body BEFORE checking res.ok

      if (!res.ok) {
        console.error("Server responded with:", json); // see the real reason
        throw new Error(json.message || "failed to create post");
      }

      setPosts([json.data, ...posts]);
      setNewPost({ content: "", image: null, imagePreview: "" });
      setIsPreviewing(false);
      setIsCreating(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // =========================
  // CANCEL CREATE
  // =========================

  const handleCancelCreate = () => {
    setNewPost({
      content: "",
      image: null,
      imagePreview: "",
    });

    setIsCreating(false);
    setIsPreviewing(false);
  };
  // pt-20 sm:pt-24
  return (
    <section className="w-full pt-20 sm:pt-24 px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* =================================
            FEED HEADER
        ================================= */}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-popins  text-gray-900 sm:text-3xl">
              Feed
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              See what people are sharing
            </p>
          </div>

          {/* CREATE BUTTON */}

          {!isCreating && (
            <button
              type="button"
              onClick={() => {
                console.log(
                  "clicked, user is:",
                  user,
                  "navigate is:",
                  navigate
                );
                if (!user) {
                  navigate("/signup");
                  return;
                }
                setIsCreating(true);
              }}
              className="shrink-0 rounded-xl bg-gray-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 active:scale-95"
            >
              + Create
            </button>
          )}
        </div>

        {/* =================================
            CREATE POST FORM
        ================================= */}

        {isCreating && !isPreviewing && (
          <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            {/* Form header */}

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Create Post
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Share something with people
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancelCreate}
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>

            {/* CONTENT */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Content
              </label>

              <textarea
                value={newPost.content}
                onChange={handleContentChange}
                rows="6"
                placeholder="What do you want to share?"
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            {/* IMAGE */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Image
              </label>

              <label
                htmlFor="postImage"
                className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-4 py-8 text-center transition hover:border-gray-400 hover:bg-gray-50"
              >
                <div>
                  <div className="text-2xl">📷</div>

                  <p className="mt-2 text-sm font-medium text-gray-700">
                    Add an image
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Choose an image from your device
                  </p>
                </div>
              </label>

              <input
                id="postImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* IMAGE PREVIEW */}

            {newPost.imagePreview && (
              <div className="relative mt-4 overflow-hidden rounded-xl">
                <img
                  src={newPost.imagePreview}
                  alt="Post preview"
                  className="max-h-80 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    setNewPost({
                      ...newPost,
                      image: null,
                      imagePreview: "",
                    })
                  }
                  className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Remove
                </button>
              </div>
            )}

            {/* PREVIEW BUTTON */}

            <button
              type="button"
              onClick={handlePreview}
              className="mt-5 w-full rounded-xl bg-gray-800 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Preview Post
            </button>
          </div>
        )}

        {/* =================================
            POST PREVIEW
        ================================= */}

        {isPreviewing && (
          <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Preview Your Post
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Check your post before publishing it.
              </p>
            </div>

            {/* Preview */}

            <article className="overflow-hidden rounded-2xl border border-gray-100">
              {/* User */}

              <div className="flex items-center gap-3 p-4">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
                  {mockPost.profile && (
                    <img
                      src={mockPost.profile}
                      alt={mockPost.author.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Faris Naser
                  </h3>

                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>

              {/* Content */}

              {newPost.content && (
                <div className="px-4 pb-5">
                  <p className="break-words text-sm leading-6 text-gray-700">
                    {newPost.content}
                  </p>
                </div>
              )}

              {/* Image */}

              {newPost.imagePreview && (
                <img
                  src={newPost.imagePreview}
                  alt="New post"
                  className="max-h-96 w-full object-cover"
                />
              )}

              {/* Actions */}

              {/* Post actions */}
              <div className="border-t border-gray-100 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    <FaHeart className="h-4 w-4" />
                    <span>Like</span>
                  </button>

                  {/* Open comments for THIS post only */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenCommentsPostId((currentId) =>
                        currentId === post.id ? null : post.id
                      );
                    }}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    <FaRegComment className="h-4 w-4" />
                    <span>Comment</span>
                    <span className="text-xs text-gray-400">
                      {(commentsByPost[post.id] || []).length}
                    </span>
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    <FaShare className="h-4 w-4" />
                    <span>Share </span>
                  </button>
                </div>

                {/* Only show comments for the selected post */}
                {openCommentsPostId === post.id && (
                  <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-800">
                        Comments
                      </h4>

                      <button
                        type="button"
                        onClick={() => setOpenCommentsPostId(null)}
                        className="text-xs text-gray-500 hover:text-gray-900"
                      >
                        Close
                      </button>
                    </div>

                    {/* This post's comments only */}
                    <div className="max-h-72 space-y-3 overflow-y-auto">
                      {(commentsByPost[post.id] || []).map((item) => (
                        <div key={item.id} className="flex items-start gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                            {item.profile ? (
                              <img
                                src={item.profile}
                                alt={item.username}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-semibold text-gray-600">
                                {item.username?.charAt(0).toUpperCase() || "U"}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 rounded-xl bg-white px-3 py-2">
                            <p className="text-xs font-semibold text-gray-800">
                              {item.username}
                            </p>
                            <p className="break-words text-sm text-gray-700">
                              {item.content}
                            </p>
                          </div>
                        </div>
                      ))}

                      {(commentsByPost[post.id] || []).length === 0 && (
                        <p className="py-3 text-center text-sm text-gray-500">
                          No comments yet.
                        </p>
                      )}
                    </div>

                    {/* Add comment */}
                    <textarea
                      value={commentInputs[post.id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      rows={2}
                      placeholder="Write a comment..."
                      className="mt-4 w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                    />

                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={async () => {
                          const content = (commentInputs[post.id] || "").trim();
                          if (!content) return;

                          const newComment = {
                            id: `comment_${Date.now()}`,
                            username: user?.username || user?.name || "You",
                            profile: user?.profile || "",
                            content,
                            created_at: new Date().toISOString(),
                          };

                          // Add to THIS post's comment list only
                          setCommentsByPost((prev) => ({
                            ...prev,
                            [post.id]: [...(prev[post.id] || []), newComment],
                          }));

                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: "",
                          }));
                        }}
                        disabled={!(commentInputs[post.id] || "").trim()}
                        className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>

            {/* Confirmation */}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setIsPreviewing(false)}
                className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={handleConfirmPost}
                className="flex-1 rounded-xl bg-gray-800 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Confirm Post
              </button>
            </div>
          </div>
        )}

        {/* =================================
            POSTS 
        ================================= */}

        <div className="space-y-10">
          {loading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="w-full rounded-2xl bg-white shadow-sm"
              >
                {/* User information */}

                <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    {/* Profile image */}

                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 sm:h-11 sm:w-11 flex items-center justify-center">
                      {post.profile ? (
                        <img
                          src={post.profile}
                          alt={`${post.username} profile`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-600 sm:text-base">
                          {post.username?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Name */}

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                        {post.username}
                      </h3>

                      <p className="text-xs text-gray-500 sm:text-sm">
                        {formatPostDate(post.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Follow */}

                  <button
                    type="button"
                    onClick={() => {
                      const authorId = post.user_id || post.userId;

                      setFollows((prev) => {
                        const alreadyFollowing = prev.some(
                          (item) =>
                            item.userId === authorId &&
                            item.followedBy === (user?.id || "current_user")
                        );

                        if (alreadyFollowing) {
                          return prev.filter(
                            (item) =>
                              !(
                                item.userId === authorId &&
                                item.followedBy === (user?.id || "current_user")
                              )
                          );
                        }

                        return [
                          ...prev,
                          {
                            userId: authorId,
                            followedBy: user?.id || "current_user",
                          },
                        ];
                      });
                    }}
                    className="shrink-0 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 sm:px-4 sm:text-sm"
                  >
                    {follows.some(
                      (item) =>
                        item.userId === (post.user_id || post.userId) &&
                        item.followedBy === (user?.id || "current_user")
                    )
                      ? "Following"
                      : "Follow"}
                  </button>
                </div>

                {/* Post content */}

                {post.content && (
                  <div className="px-4 pb-5 sm:px-5">
                    <p className="break-words text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
                      {post.content}
                    </p>
                  </div>
                )}

                {/* Post image */}

                {post.images && (
                  <img
                    src={post.images}
                    alt="Post"
                    className="max-h-[500px] w-full object-cover"
                  />
                )}

                {/* Post actions */}

                {/* Post actions and comments */}
                <div className="border-t border-gray-100 px-3 py-3 sm:px-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* LIKE */}
                    <button
                      type="button"
                      onClick={() => {
                        setIntractions((prev) => {
                          const alreadyLiked = prev.some(
                            (item) =>
                              item.postId === post.id &&
                              item.userId === user?.id
                          );

                          if (alreadyLiked) {
                            return prev.filter(
                              (item) =>
                                !(
                                  item.postId === post.id &&
                                  item.userId === user?.id
                                )
                            );
                          }

                          return [
                            ...prev,
                            {
                              postId: post.id,
                              userId: user?.id || "current_user",
                            },
                          ];
                        });
                      }}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
                    >
                      {intractions.some(
                        (item) =>
                          item.postId === post.id && item.userId === user?.id
                      ) ? (
                        <FaHeart className="h-4 w-4 text-rose-500" />
                      ) : (
                        <FaRegHeart className="h-4 w-4" />
                      )}
                      <span>Like</span>
                      <span className="text-xs text-gray-400">
                        {
                          intractions.filter((item) => item.postId === post.id)
                            .length
                        }
                      </span>
                    </button>

                    {/* COMMENT TOGGLE */}
                    <button
                      type="button"
                      onClick={() => toggleComments(post.id)}
                      aria-expanded={openCommentsPostId === post.id}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
                    >
                      <FaRegComment className="h-4 w-4" />
                      <span>Comment</span>
                      <span className="text-xs text-gray-400">
                        {(commentsByPost[post.id] || []).length}
                      </span>
                    </button>

                    {/* SHARE */}
                    <button
                      type="button"
                      // onClick={() => {
                      //   if (navigator.share) {
                      //     navigator
                      //       .share({
                      //         title: "QUILog post",
                      //         text: post.content || "Check out this post",
                      //         url: window.location.href,
                      //       })
                      //       .catch(() => {});
                      //   } else {
                      //     navigator.clipboard?.writeText(window.location.href);
                      //   }
                      // }}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
                    >
                      <FaShare className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* COMMENTS PANEL */}
                  {openCommentsPostId === post.id && (
                    <section className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-800">
                          Comments
                        </h4>

                        <button
                          type="button"
                          onClick={() => setOpenCommentsPostId(null)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
                        >
                          Close
                        </button>
                      </div>

                      {/* LOADING */}
                      {commentsLoading[post.id] && (
                        <p className="py-3 text-sm text-gray-500">
                          Loading comments...
                        </p>
                      )}

                      {/* ERROR */}
                      {commentErrors[post.id] && (
                        <p className="mb-3 text-sm text-rose-600">
                          {commentErrors[post.id]}
                        </p>
                      )}

                      {/* COMMENT LIST */}
                      {!commentsLoading[post.id] && (
                        <div className="max-h-72 space-y-4 overflow-y-auto">
                          {(commentsByPost[post.id] || []).length === 0 ? (
                            <p className="py-4 text-center text-sm text-gray-500">
                              No comments yet. Be the first to comment.
                            </p>
                          ) : (
                            (commentsByPost[post.id] || []).map((item) => (
                              <article
                                key={item.id}
                                className="flex min-w-0 items-start gap-2.5"
                              >
                                {/* COMMENTER AVATAR */}
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                                  {item.profile ? (
                                    <img
                                      src={item.profile}
                                      alt={`${item.username} profile`}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-sm font-semibold text-gray-600">
                                      {item.username?.charAt(0).toUpperCase() ||
                                        "U"}
                                    </span>
                                  )}
                                </div>

                                {/* COMMENT CONTENT */}
                                <div className="min-w-0 flex-1 rounded-xl bg-white px-3 py-2.5">
                                  <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span className="text-xs font-semibold text-gray-800">
                                      {item.username || "User"}
                                    </span>
                                    <span className="text-[11px] text-gray-400">
                                      {formatPostDate(item.created_at)}
                                    </span>
                                  </div>

                                  <p className="break-words text-sm leading-5 text-gray-700">
                                    {item.content}
                                  </p>
                                </div>
                              </article>
                            ))
                          )}
                        </div>
                      )}

                      {/* WRITE COMMENT */}
                      <div className="mt-4 border-t border-gray-200 pt-3">
                        <textarea
                          value={commentInputs[post.id] || ""}
                          onChange={(e) =>
                            handleCommentInput(post.id, e.target.value)
                          }
                          rows={2}
                          placeholder="Write a comment..."
                          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                        />

                        <div className="mt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              if (!user) {
                                navigate("/signup");
                                return;
                              }
                              handleConfirmComment(post.id);
                            }}
                            disabled={
                              !user || !(commentInputs[post.id] || "").trim()
                            }
                            className="rounded-lg bg-gray-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Idea;
