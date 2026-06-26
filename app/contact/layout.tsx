export const metadata = {
  title: 'Cuéntanos tu proyecto',
  description:
    'Brief para cotización de sitio web. Completa el formulario y te enviaremos una cotización clara y bien definida.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-0">{children}</div>
}
