import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
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
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postError, setPostErrrror] = useState(false);
  const [intractions, setIntractions] = useState([]);
  const [intrcError, setIntractError] = useState(null);

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

  useEffect(() => {
    setIntractError(false);
    fetch(`${Api_url}/api/likes`)
      .then((res) => {
        if (!res.ok) throw new Error("failed to get likes");
      })
      .then((json) => {
        setIntractions(json.data);
      })
      .catch((err) => {
        console.log("faled to show the likes,server error");
        setIntractError(err.message);
      });
  }, []);

  if (postError) return <div> Error getinh the posts,{postError}</div>;

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

              <div className="border-t border-gray-100 px-4 py-3">
                <div className="flex gap-3 text-sm text-gray-500">
                  <span>♡ Like</span>

                  <span>💬 Comment</span>

                  <span>↗ Share</span>
                </div>
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
                    className="shrink-0 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 sm:px-4 sm:text-sm"
                  >
                    Follow
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

                <div className="border-t border-gray-100 px-4 py-3 sm:px-5">
                  <div className="flex items-center justify-start gap-2 sm:gap-3">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                      <FaHeart className=" h-4 w-4 bg-siintlver" />
                      <span>Like</span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                      <span>
                        <FaRegComment className="w-4 h-4" />
                      </span>
                      <span>Comment</span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                      <span>
                        <FaShare className="w-4 h-4" />
                      </span>

                      <span>share</span>
                    </button>
                  </div>
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
