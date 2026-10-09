import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";
import AppShell from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
});

export const metadata = {
  title: "Qarz Nazorati",
  description:
    "Nazorat qarz yuklamasi: barcha kredit, nasiya va mikroqarzlar bir joyda.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body className={inter.className}>
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
