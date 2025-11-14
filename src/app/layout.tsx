import './globals.css';

export const metadata = {
    title: 'On Pitch Performance',
    description: 'AI-powered player development platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="flex flex-col h-dvh border-red-500 bg-background text-foreground antialiased">
                {children}
            </body>
        </html>
    );
}
