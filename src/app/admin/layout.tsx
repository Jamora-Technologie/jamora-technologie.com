import type { Metadata } from "next";

/** Rien de ce qui est sous /admin ne doit être indexé, quoi qu'il arrive. */
export const metadata: Metadata = {
  title: { default: "Back-office", template: "%s - Back-office" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="flex flex-1 flex-col bg-[#070707]">{children}</div>;
}
