import { Link } from "react-router-dom";
import { FaGithub, FaTwitter, FaInstagram, FaTelegram } from "react-icons/fa";

const socials = [
  { icon: FaGithub, label: "GitHub", href: "github.com/faris-dm" },
  { icon: FaTwitter, label: "Twitter", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaTelegram, label: "Telegram", href: "" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 md:px-10 lg:px-20">
        {/* Brand */}
        <div>
          <h3 className="font-poppins text-xl font-semibold tracking-tight text-gray-900">
            Quilog
          </h3>
          <p className="mt-3 max-w-xs text-sm leading-6 text-gray-500">
            A simple place to share ideas, stories and small thoughts. Read what
            others write, then start your own.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
            Explore
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-gray-500">
            <li>
              <Link to="/" className="transition hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <Link to="/post" className="transition hover:text-gray-900">
                Read posts
              </Link>
            </li>
            <li>
              <Link to="/user" className="transition hover:text-gray-900">
                My profile
              </Link>
            </li>
            <li>
              <Link to="/signup" className="transition hover:text-gray-900">
                Join us
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
            Follow
          </h4>
          <div className="mt-4 flex gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:-translate-y-0.5 hover:bg-gray-900 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-gray-500 sm:flex-row sm:px-6 md:px-10 lg:px-20">
          <p>© {new Date().getFullYear()} Quilog. All rights reserved.</p>
          <p>Built with care </p>
        </div>
      </div>
    </footer>
  );
}
