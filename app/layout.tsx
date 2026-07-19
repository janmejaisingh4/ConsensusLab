import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title:"ConsensusLab — Many minds. Better answers.", description:"A self-consistency engine powered by OpenAI, Claude, and Gemini." };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
