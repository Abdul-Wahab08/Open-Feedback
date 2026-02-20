import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en">
      <div
        className="flex flex-col min-h-screen"
      >
        <Navbar />
        {children}
        <Footer />
      </div>
    // </html>
  );
}
