import type { ReactNode } from "react";
import { Toaster } from "crispy-toast/web";

export const metadata = { title: "Crispy Toast · Next.js" };

// Server component: <Toaster /> can be imported here directly because the
// web entry is marked "use client".
export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
				{children}
				<Toaster position="top-center" />
			</body>
		</html>
	);
}
