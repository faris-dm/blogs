import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../conponts/Loading.jsx";
import PostSkeleton from "../conponts/Loading.jsx";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userErrror, setUserError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const Api_url = "https://personal-blog-mv8w.onrender.com/";

  const [editForm, setEditForm] = useState({
    username: "",
    description: "",
  });

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetch(`${Api_url}/api/profile`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("failed to load profile info");
        return res.json();
      })
      .then((json) => {
        if (!json.success || !json.data) {
          throw new Error(json.message || "Failed to load profile");
        }

        setUser(json.data);

        setEditForm({
          username: json.data.username,
          description: json.data.description || "",
        });

        setLoading(false);
      })
      .catch((err) => {
        setUserError(err.message);
        setLoading(false);
      });
  }, []);

  if (userErrror || !user) {
    return <div>Error: {userErrror}</div>;
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`${Api_url}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "failed to save");
      }

      setUser({
        ...user,
        ...json.data,
      });

      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleProfileImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Preview only for now.
    // Later upload this file to your backend/storage.

    const imageUrl = URL.createObjectURL(file);

    setUser({
      ...user,
      profileImage: imageUrl,
    });
  };

  const handleLogout = () => {
    // Later:
    // localStorage.removeItem("token");
    // navigate("/login");

    console.log("User logged out");
    setShowLogout(false);
  };

  return (
    <div>
      {loading ? (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : (
        <main className="mt-10 min-h-screen w-full px-4 py-5 sm:px-6 sm:py-8">
          {/* Main container */}
          <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl shadow-sm">
            {/* ================= TOP BAR ================= */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
              {/* Back + Profile */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                >
                  ← Back
                </button>

                <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
              </div>

              {/* Edit */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 sm:px-4"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            {/* ================= PROFILE ================= */}
            <section className="px-4 py-6 sm:px-6 sm:py-8">
              {!isEditing ? (
                <>
                  {/* Profile image + information */}
                  <div className="flex w-full items-center gap-4 sm:gap-6">
                    {/* Profile image */}
                    <div className="relative shrink-0">
                      {user.profile ? (
                        <img
                          src={user.profile}
                          alt={user.username}
                          className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-100 sm:h-28 sm:w-28"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-2xl font-semibold text-gray-600 ring-4 ring-gray-100 sm:h-28 sm:w-28 sm:text-3xl">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Add image button */}
                      <label
                        htmlFor="profileImage"
                        className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-lg text-white shadow-md sm:h-9 sm:w-9"
                      >
                        +
                      </label>

                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImage}
                      />
                    </div>

                    {/* User information */}
                    <div className="min-w-0 flex-1">
                      <p>{user.username}</p>
                      <p className="mt-2 max-w-md break-words text-sm leading-6 text-gray-600">
                        {user.description || "No description yet."}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                /* ================= EDIT FORM ================= */
                <div className="w-full space-y-4 text-left">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Username
                    </label>

                    <input
                      name="username"
                      value={editForm.username}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-full rounded-xl bg-gray-600 py-3 font-medium text-white transition hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {/* ================= USER STATS ================= */}
              <div className="mt-7 grid grid-cols-3 rounded-2xl py-4">
                <div className="text-center">
                  <p className="font-bold text-gray-900">{user.posts}</p>
                  <p className="text-xs text-gray-500">Posts</p>
                </div>

                <div className="border-x border-gray-200 text-center">
                  <p className="font-bold text-gray-900">{user.followers}</p>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>

                <div className="text-center">
                  <p className="font-bold text-gray-900">{user.following}</p>
                  <p className="text-xs text-gray-500">Following</p>
                </div>
              </div>
            </section>

            {/* ================= NEAREST POST ================= */}
            <section className="border-t border-gray-100 px-4 py-6 sm:px-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Nearest Post
                </h3>

                <button className="shrink-0 text-sm text-blue-600">
                  View all
                </button>
              </div>

              {user.latestPost ? (
                <article className="overflow-hidden rounded-2xl border border-gray-100">
                  {user.latestPost.images && (
                    <img
                      src={user.latestPost.images}
                      alt="Latest post"
                      className="h-48 w-full object-cover sm:h-56"
                    />
                  )}

                  <div className="p-4">
                    <p className="break-words font-semibold text-gray-900">
                      {user.latestPost.content}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm text-gray-500">
                        ❤️ {user.latestPost.likes} likes
                      </span>

                      <span className="text-xs text-gray-400">
                        {new Date(
                          user.latestPost.created_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </article>
              ) : (
                <p className="text-sm text-gray-500">No posts yet.</p>
              )}
            </section>

            {/* ================= SOCIAL MEDIA ================= */}
            <section className="border-t border-gray-100 px-4 py-6 sm:px-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Social Media
              </h3>

              <div className="space-y-3">
                <div className="flex min-w-0 items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3">
                  <span className="shrink-0 text-sm font-medium">
                    Instagram
                  </span>

                  <span className="min-w-0 truncate text-right text-sm text-gray-500">
                    {user.instagram}
                  </span>
                </div>

                <div className="flex min-w-0 items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3">
                  <span className="shrink-0 text-sm font-medium">Facebook</span>

                  <span className="min-w-0 truncate text-right text-sm text-gray-500">
                    {user.facebook}
                  </span>
                </div>

                <div className="flex min-w-0 items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3">
                  <span className="shrink-0 text-sm font-medium">Telegram</span>

                  <span className="min-w-0 truncate text-right text-sm text-gray-500">
                    {user.telegram}
                  </span>
                </div>
              </div>
            </section>

            {/* ================= PHONE ================= */}
            <section className="border-t border-gray-100 px-4 py-6 sm:px-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Phone Number
              </h3>

              {/* Phone display intentionally left commented,
              exactly as in your original logic */}
              {/*
          <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
            {user.phone}
          </div>
          */}
            </section>

            {/* ================= LOGOUT ================= */}
            <section className="border-t border-gray-100 px-4 py-6 sm:px-6">
              <button
                onClick={() => setShowLogout(true)}
                className="w-full rounded-xl border border-red-200 py-3 font-medium text-red-600 transition hover:bg-red-50"
              >
                Logout
              </button>
            </section>
          </div>

          {/* ================= LOGOUT MODAL ================= */}
          {showLogout && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl sm:p-6">
                <h2 className="text-lg font-bold text-gray-900">Logout?</h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Are you sure you want to logout from your account?
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowLogout(false)}
                    className="flex-1 rounded-xl bg-gray-100 py-3 font-medium text-gray-700"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex-1 rounded-xl bg-red-600 py-3 font-medium text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default Profile;
