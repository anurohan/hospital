import Link from "next/link";
import { HOSPITAL_CONFIG } from "@/config/hospital";
import { signOut } from "@/app/(auth)/actions";

export interface PortalNavItem {
  label: string;
  href: string;
}

export default function PortalShell({
  title,
  nav,
  userName,
  roleLabel,
  children,
}: {
  title: string;
  nav: PortalNavItem[];
  userName: string;
  roleLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-bold text-sky-700">
              {HOSPITAL_CONFIG.shortName}
            </Link>
            <span className="hidden text-gray-300 sm:inline">/</span>
            <span className="hidden text-sm font-semibold text-gray-700 sm:inline">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium leading-tight text-gray-800">{userName}</p>
              <p className="text-xs leading-tight text-gray-500">{roleLabel}</p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-0 px-0 sm:flex-row">
        <nav className="shrink-0 border-b border-gray-200 bg-white sm:w-56 sm:border-b-0 sm:border-r">
          <ul className="flex gap-1 overflow-x-auto p-2 sm:flex-col sm:gap-0.5 sm:p-3">
            {nav.map((item) => (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  className="block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
