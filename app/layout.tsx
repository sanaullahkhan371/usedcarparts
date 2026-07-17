export const metadata = {
  title: 'NexusParts',
  description: 'AI Auto Parts Network',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = { darkMode: 'class' }
          `
        }}></script>
      </head>
      <body>{children}</body>
    </html>
  )
}

