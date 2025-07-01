"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import RequestModal from "@/components/request-modal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Lightbox from "@/components/lightbox"
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  CreditCard,
  Mail,
  Package,
  Server,
  Palette,
  Code2,
  Camera,
  BookOpen,
  Settings,
  Lock,
  History,
  XCircle,
  Briefcase,
  Sparkles,
  Building,
  Rocket,
  Cloud,
  DatabaseZap,
  ShieldAlert,
  Eye,
} from "lucide-react"

interface PlanFeature {
  text: string
  included: boolean | "custom"
  icon?: React.ReactNode
}
interface Plan {
  id: string
  name: string
  price: string
  priceDetails?: string
  highlight?: boolean
  storage: string
  transactionLimit: string
  fileRetention: string
  features: PlanFeature[]
}

const primaryButtonBase = "bg-brand-green text-brand-black font-semibold"
const primaryButtonHover = "hover:bg-brand-blue-gray hover:text-brand-white"

const plans: Plan[] = [
  {
    id: "basic",
    name: "BASIC",
    price: "19€",
    priceDetails: "/ mes",
    storage: "50 GB",
    transactionLimit: "1 GB",
    fileRetention: "7 días",
    features: [
      { text: "Soporte básico", included: true, icon: <CheckCircle2 className="w-5 h-5 text-brand-green" /> },
      { text: "Soporte por email", included: true, icon: <CheckCircle2 className="w-5 h-5 text-brand-green" /> },
      { text: "Analíticas básicas", included: true, icon: <CheckCircle2 className="w-5 h-5 text-brand-green" /> },
      { text: "Soporte prioritario", included: false, icon: <XCircle className="w-5 h-5 text-red-500" /> },
      { text: "Soporte dedicado", included: false, icon: <XCircle className="w-5 h-5 text-red-500" /> },
      { text: "Marca blanca (Custom branding)", included: false, icon: <XCircle className="w-5 h-5 text-red-500" /> },
      {
        text: "Licencia comercial / acceso código",
        included: false,
        icon: <XCircle className="w-5 h-5 text-red-500" />,
      },
    ],
  },
  {
    id: "pro",
    name: "PRO",
    price: "49€",
    priceDetails: "/ mes",
    highlight: true,
    storage: "250 GB",
    transactionLimit: "2 GB",
    fileRetention: "Ilimitada",
    features: [
      { text: "Soporte básico", included: true, icon: <CheckCircle2 className="w-5 h-5 text-brand-green" /> },
      { text: "Soporte por email", included: true, icon: <CheckCircle2 className="w-5 h-5 text-brand-green" /> },
      { text: "Analíticas básicas", included: true, icon: <CheckCircle2 className="w-5 h-5 text-brand-green" /> },
      { text: "Soporte prioritario", included: true, icon: <CheckCircle2 className="w-5 h-5 text-brand-green" /> },
      { text: "Soporte dedicado", included: false, icon: <XCircle className="w-5 h-5 text-red-500" /> },
      { text: "Marca blanca (Custom branding)", included: false, icon: <XCircle className="w-5 h-5 text-red-500" /> },
      {
        text: "Licencia comercial / acceso código",
        included: false,
        icon: <XCircle className="w-5 h-5 text-red-500" />,
      },
    ],
  },
  {
    id: "max",
    name: "MAX",
    price: "149€",
    priceDetails: "/ mes",
    storage: "2 TB",
    transactionLimit: "5 GB",
    fileRetention: "Ilimitada",
    features: [
      { text: "Soporte básico", included: true, icon: <CheckCircle2 className="w-5 h-5 text-brand-green" /> },
      { text: "Soporte por email", included: true, icon: <CheckCircle2 className="w-5 h-5 text-brand-green" /> },
      { text: "Analíticas básicas", included: true, icon: <CheckCircle2 className="w-5 h-5 text-brand-green" /> },
      { text: "Soporte prioritario", included: true, icon: <CheckCircle2 className="w-5 h-5 text-brand-green" /> },
      { text: "Soporte Dedicado", included: true, icon: <CheckCircle2 className="w-5 h-5 text-brand-green" /> },
      {
        text: "Marca blanca (Custom branding)",
        included: true,
        icon: <CheckCircle2 className="w-5 h-5 text-brand-green" />,
      },
      {
        text: "Licencia comercial / acceso código",
        included: false,
        icon: <XCircle className="w-5 h-5 text-red-500" />,
      },
    ],
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    price: "A Medida",
    priceDetails: "",
    storage: "Personalizado",
    transactionLimit: "Personalizado",
    fileRetention: "Ilimitada",
    features: [
      { text: "Todo lo del plan MAX", included: true, icon: <CheckCircle2 className="w-5 h-5 text-brand-green" /> },
      { text: "Almacenamiento personalizado", included: "custom", icon: <Settings className="w-5 h-5 text-sky-400" /> },
      {
        text: "Límite transacción personalizado",
        included: "custom",
        icon: <Settings className="w-5 h-5 text-sky-400" />,
      },
      { text: "Soporte dedicado VIP", included: true, icon: <CheckCircle2 className="w-5 h-5 text-brand-green" /> },
      {
        text: "Licencia comercial / acceso código",
        included: true,
        icon: <CheckCircle2 className="w-5 h-5 text-brand-green" />,
      },
      { text: "Integraciones personalizadas", included: "custom", icon: <Settings className="w-5 h-5 text-sky-400" /> },
    ],
  },
]

const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
          }
        })
      },
      { threshold: 0.1 },
    )
    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observer.observe(el))
    return () => elements.forEach((el) => observer.unobserve(el))
  }, [])
}

const ParallaxSection = ({
  imageUrl,
  imageAlt,
  title,
  children,
  imageLeft = false,
  imageQuery,
  bgColor = "bg-brand-black",
}: {
  imageUrl?: string
  imageAlt: string
  title: string
  children: React.ReactNode
  imageLeft?: boolean
  imageQuery?: string
  bgColor?: string
}) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
          setOffsetY((scrollPercent - 0.5) * 30)
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const finalImageUrl =
    imageUrl ||
    `/placeholder.svg?width=800&height=600&text=${encodeURIComponent(imageQuery || imageAlt)}&bgColor=191919&textColor=C1DF1F`

  return (
    <section ref={sectionRef} className={`py-20 md:py-28 overflow-hidden ${bgColor}`}>
      <div
        className={`container mx-auto px-6 grid lg:grid-cols-2 gap-12 md:gap-20 items-center ${imageLeft ? "lg:grid-flow-row-dense" : ""}`}
      >
        <div
          className={`animate-on-scroll ${imageLeft ? "lg:col-start-2" : ""} transform transition-transform duration-500 ease-out`}
          style={{ "--initial-translate-y": "20px" } as React.CSSProperties}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-brand-white mb-6">{title}</h2>
          <div className="space-y-4 text-brand-gray-text text-lg">{children}</div>
        </div>
        <div className={`relative ${imageLeft ? "lg:col-start-1" : ""}`}>
          <div
            className="rounded-xl shadow-custom-dark overflow-hidden transform transition-transform duration-1000 ease-out"
            style={{ transform: `translateY(${offsetY}px)` }}
          >
            <Image
              src={finalImageUrl || "/placeholder.svg"}
              alt={imageAlt}
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function YupayLanding() {
  useScrollAnimation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<{ src: string; alt: string }[]>([])
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  const handleImageClick = (images: { src: string; alt: string }[], index: number) => {
    setLightboxImages(images)
    setLightboxStartIndex(index)
    setLightboxOpen(true)
  }

  const handleRequestPlan = (plan: Plan) => {
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  const mainFeatures = [
    {
      title: "Pagos seguros con Stripe",
      description:
        "Recibe pagos directamente en tu cuenta en múltiples divisas de forma segura y automatizada con el líder mundial.",
      icon: <CreditCard className="w-8 h-8 mb-3 text-brand-green" />,
    },
    {
      title: "Seguridad avanzada",
      description:
        "Nadie podrá robar tu contenido. Protegemos tu contenido con JWT, control de acceso, archivos privados y previews con marca de agua.",
      icon: <ShieldCheck className="w-8 h-8 mb-3 text-brand-green" />,
    },
    {
      title: "Comunicación eficiente",
      description:
        "Notificaciones por email para ti y tus clientes, manteniendo a todos informados. Evita caer en SPAM gracias a nuestra integración con Sendgrid",
      icon: <Mail className="w-8 h-8 mb-3 text-brand-green" />,
    },
    {
      title: "Protección Anti-Robo",
      description:
        "Tus archivos originales solo serán accesibles tras el pago. Las vistas previas están protegidas y se renderizan en baja calidad y con marca de agua.",
      icon: <Lock className="w-8 h-8 mb-3 text-brand-green" />,
    },
  ]

  const securityAndReliabilityFeatures = [
    {
      title: "Tecnología Cloud robusta",
      description:
        "Infraestructura escalable en la nube de AWS y de alta disponibilidad que garantiza el acceso continuado.",
      icon: <Cloud className="w-7 h-7 mr-3 text-brand-green" />,
    },
    {
      title: "Copias de seguridad diarias",
      description: "Los datos y archivos se respaldan automáticamente a diario para tu tranquilidad.",
      icon: <DatabaseZap className="w-7 h-7 mr-3 text-brand-green" />,
    },
    {
      title: "Estándares de seguridad",
      description: "Cumplimos con las mejores prácticas de seguridad para proteger la información sensible.",
      icon: <ShieldAlert className="w-7 h-7 mr-3 text-brand-green" />,
    },
    {
      title: "Control de acceso estricto",
      description: "Solo las personas con autorización tienen acceso a tus archivos.",
      icon: <Eye className="w-7 h-7 mr-3 text-brand-green" />,
    },
  ]

  const useCases = [
    { name: "Fotógrafos", icon: <Camera className="w-10 h-10 mx-auto mb-3 text-brand-green" /> },
    { name: "Diseñadores", icon: <Palette className="w-10 h-10 mx-auto mb-3 text-brand-green" /> },
    { name: "Desarrolladores", icon: <Code2 className="w-10 h-10 mx-auto mb-3 text-brand-green" /> },
    { name: "Consultores", icon: <Briefcase className="w-10 h-10 mx-auto mb-3 text-brand-green" /> },
    { name: "Agencias", icon: <Building className="w-10 h-10 mx-auto mb-3 text-brand-green" /> },
    { name: "Educadores", icon: <BookOpen className="w-10 h-10 mx-auto mb-3 text-brand-green" /> },
  ]

  const techStack = [
    {
      name: "Next.js 14",
      icon: <Rocket className="w-8 h-8 text-brand-gray-text group-hover:text-brand-green transition-colors" />,
    },
    {
      name: "MongoDB",
      icon: <Server className="w-8 h-8 text-brand-gray-text group-hover:text-brand-green transition-colors" />,
    },
    {
      name: "TypeScript",
      icon: <Code2 className="w-8 h-8 text-brand-gray-text group-hover:text-brand-green transition-colors" />,
    },
    {
      name: "Tailwind CSS",
      icon: <Palette className="w-8 h-8 text-brand-gray-text group-hover:text-brand-green transition-colors" />,
    },
    {
      name: "Sharp",
      icon: <Sparkles className="w-8 h-8 text-brand-gray-text group-hover:text-brand-green transition-colors" />,
    },
    {
      name: "Nodemailer",
      icon: <Mail className="w-8 h-8 text-brand-gray-text group-hover:text-brand-green transition-colors" />,
    },
  ]

  const faqs = [
    {
      question: "¿Qué se necesita para instalar YUPAY?",
      answer:
        "Solo un dominio (o subdominio) donde quieras que se cargue la plataforma. La instalación es manual y personalizada: yo mismo la haré contigo paso a paso. YUPAY funciona como un SaaS; eso significa que la aplicación vive en nuestros servidores, pero la disfrutas con tu propia URL (Y branding en caso de tener la licencia correspondiente). Me ocupo de apuntar tu dominio, subir la instancia y dejar todo listo para que cobres desde el primer minuto.",
      images: [],
    },
    {
      question: "¿El código fuente es accesible?",
      answer:
        "No. El core es cerrado para garantizar seguridad y estabilidad. Dicho esto, con el plan Enterprise puedo desarrollar módulos o integraciones a medida. Pregúntame sin miedo si necesitas algo especial.",
      images: [],
    },
    {
      question: "¿Cómo se reciben los pagos por las ventas?",
      answer:
        "Los cobros se procesan a través de Stripe: tarjetas, suscripciones, pagos únicos… YUPAY no actúa de intermediario, el dinero entra directo en tu cuenta de Stripe (cualquiera puede disponer de una cuenta de Stripe). Durante la instalación configuramos juntos tu cuenta, la vinculamos a YUPAY y compruebas en vivo que los importes llegan a tu banco.",
      images: [],
    },
    {
      question: "¿Qué ocurre si se agota el espacio del plan contratado?",
      answer:
        "Cuando tu almacenamiento supera el límite del plan, el sistema te avisa. A partir de ahí puedes o bien borrar transacciones/archivos antiguos o bien pedirme ampliar o ajustar tu plan según lo que realmente necesites. Nada se bloquea sin previo aviso, así que estarás tranquilo.",
      images: [],
    },
    {
      question: "¿Desde qué correo se envían avisos a los clientes?",
      answer:
        "Desde el que tú decidas. Durante la instalación configuramos la cuenta (dominio, SPF, DKIM, etc.) para que los emails salgan con tu nombre desde nuestro servidor y con firma Sendgrid para asegurarte de que siempre llega y eviten la carpeta de spam. Te acompaño en todo el proceso.",
      images: [],
    },
    {
      question: "¿Se pueden añadir o eliminar archivos en una transacción?",
      answer:
        "¡Aquí va un pequeño easter egg!: aunque tu plan limite las subidas iniciales (p. ej. 2 GB por transacción), una vez creada la transacción puedes seguir adjuntando archivos hasta agotar el espacio total de la cuenta. Mientras la transacción esté pendiente de pago puedes añadir y eliminar archivos sin problema. Una vez pagada solo podrás añadir, nunca eliminar, para mantener la integridad de la operación. Si necesitas borrar todo, puedes eliminar la transacción entera (tras doble confirmación). Si le das a “Eliminar”… ¡la culpa es tuya!",
      images: [],
    },
    {
      question: "¿Se puede usar una licencia en varios dominios?",
      answer:
        "No. Cada licencia queda amarrada al dominio/subdominio que elijas. El sistema valida tanto la licencia como la URL de instalación. Asegúrate de elegir bien tu dominio antes de lanzar.",
      images: [],
    },
    {
      question: "¿Hay permanencia?",
      answer:
        "No hay permanencia ni letra pequeña. Cancelas cuando quieras desde tu panel y el servicio dejará de facturarte en el siguiente ciclo. Tus datos quedan disponibles hasta el fin del ciclo de facturación por si quieres volver.",
      images: [],
    },
    {
      question: "¿Qué soporte se incluye?",
      answer:
        "En el plan BASIC recibes soporte por correo electrónico con respuesta en 24-48 h; en el plan PRO se añade chat prioritario y la media baja a unas 12 h; y en el plan MAX disfrutas además de atención telefónica y por Whatsapp, SLA garantizado y un gestor técnico dedicado.",
      images: [],
    },
    {
      question: "¿Se actualiza la plataforma automáticamente?",
      answer:
        "Sí. Cada nueva versión se despliega en los servidores sin que tengas que mover un dedo. Te avisaré de los cambios más importantes y, si afectan a tu flujo, te ayudaré a adaptarlos.",
      images: [],
    },
    {
      question: "¿Qué métodos de pago acepta Stripe a través de YUPAY?",
      answer:
        "Depende de tu país y de lo que actives en Stripe, pero suelen estar disponibles: Apple Pay, Google Pay, Bizum, iDEAL, Bancontact, Klarna, SEPA Débito, pagos diferidos, wallets locales y muchas más. Solo tienes que habilitarlas en tu dashboard de Stripe; YUPAY las mostrará automáticamente.",
      images: [],
    },
    {
      question: "¿Cómo ven los clientes los archivos y cómo los descargan?",
      answer:
        "Tus clientes disfrutan de una experiencia fluida y segura. Primero, ven una vista previa de los archivos con una marca de agua para proteger tu contenido (solo en imágenes y pdf, en el resto de archivos no ven preview). Una vez completado el pago a través de Stripe, se desbloquean automáticamente los enlaces de descarga para los archivos originales en alta resolución. Pueden acceder a sus compras y volver a descargar los archivos en cualquier momento desde su panel de cliente personal.",
      images: [
        {
          src: "/transaccion4.png",
          alt: "El cliente recibe un correo electrónico con la transacción",
        },
        {
          src: "/transaccion1.png",
          alt: "Accede a la transacción y ve toda la información",
        },
        {
          src: "/transaccion2.png",
          alt: "Ejemplo de vista previa de una imagen con marca de agua",
        },
        {
          src: "/transaccion3.png",
          alt: "Ejemplo de vista previa de un pdf con marca de agua",
        },
        {
          src: "/transaccion5.png",
          alt: "Una vez abonada, se le permite descargar los originales de manera individual o en zip",
        },
        {
          src: "/transaccion6.png",
          alt: "El cliente dispone siempre de un perfil donde consultar todas las compras realizadas",
        },
      ],
    },
    {
      question: "¿Puedo probarlo?",
      answer:
        "¡Claro! Escríbeme a alamas@dro.studio y te paso las credenciales del entorno de pruebas. Eso sí, el entorno de pago es de verdad: si decides abonar algo… no prometo devoluciones 😉",
      images: [],
    },
  ]

  return (
    <div className="flex-1 bg-brand-black text-brand-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-40 min-h-screen flex items-center justify-center overflow-hidden bg-brand-black">
        <div className="absolute inset-0 opacity-[0.02] z-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="heroGridDarker" width="70" height="70" patternUnits="userSpaceOnUse">
                <circle cx="35" cy="35" r="1" fill="var(--brand-gray-medium)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#heroGridDarker)" />
          </svg>
        </div>
        <div className="absolute inset-0 opacity-[0.03] z-0">
          {" "}
          {/* Sutil efecto de partículas */}
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="heroParticles" width="150" height="150" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="30" r="0.7" fill="var(--brand-gray-light)" />
                <circle cx="100" cy="50" r="0.5" fill="var(--brand-gray-light)" />
                <circle cx="60" cy="110" r="0.8" fill="var(--brand-gray-light)" />
                <circle cx="130" cy="140" r="0.6" fill="var(--brand-gray-light)" />
                <circle cx="50" cy="10" r="0.5" fill="var(--brand-gray-light)" />
                <circle cx="10" cy="120" r="0.7" fill="var(--brand-gray-light)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#heroParticles)" />
          </svg>
        </div>
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-8 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="relative w-50 h-12 md:w-70 md:h-16 mb-6 mx-auto">
              <Image
                src="/blanco.png?width=450&height=450&text=Gestion+Facil&bgColor=191919&textColor=C1DF1F"
                alt="Logo yupay"
                priority
                className="object-contain"
                fill
              />
            </div>

            <p className="text-2xl md:text-3xl font-light text-brand-gray-text mb-8">
              Transforma tu contenido digital en ingresos.
            </p>
            <p className="mt-6 text-lg md:text-xl text-brand-gray-text">
              Se acabó <strong>perseguir</strong> a los clientes para que paguen por tus servicios. Vende tus sesiones
              fotográficas, cursos, plantillas o cualquier archivo digital de manera segura y profesional, sin
              complicaciones. YUPAY es la plataforma "todo en uno" que ofrece el control total sobre tus ventas.
            </p>
            <Button
              size="lg"
              className={`mt-12 px-10 py-6 text-lg rounded-lg shadow-custom-green transform hover:scale-105 transition-all duration-300 ${primaryButtonBase} ${primaryButtonHover}`}
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              Descubre los planes
            </Button>
          </div>
          <div
            className="relative hidden lg:block h-[400px] md:h-[500px] animate-on-scroll"
            style={{ "--initial-translate-y": "30px" } as React.CSSProperties}
          >
            <div className="group absolute top-[5%] right-[10%] w-[400px] h-[400px] md:w-[350px] md:h-[350px] bg-brand-gray-dark rounded-lg shadow-custom-dark overflow-hidden transform rotate-3 transition-transform duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:rotate-0">
              <Image
                src="/placeholder-2.jpg?width=400&height=400&text=Interfaz+Limpia&bgColor=191919&textColor=C1DF1F"
                alt="YUPAY Interface Preview 1"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="group absolute bottom-[15%] left-[5%] w-[350px] h-[350px] md:w-[300px] md:h-[300px] bg-brand-gray-dark rounded-lg shadow-custom-dark overflow-hidden transform -rotate-2 transition-transform duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:rotate-0 z-10">
              <Image
                src="/placeholder-1.jpg?width=350&height=350&text=Gestion+Facil&bgColor=191919&textColor=C1DF1F"
                alt="YUPAY Interface Preview 2"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is YUPAY? */}
      <section className="py-16 md:py-24 bg-brand-gray-deep">
        <div
          className="container mx-auto px-6 text-center animate-on-scroll"
          style={{ "--initial-translate-y": "20px" } as React.CSSProperties}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-brand-white">¿Qué es YUPAY?</h2>
          <p className="mt-4 text-lg text-brand-gray-text max-w-3xl mx-auto">
            YUPAY es una <strong>plataforma completa de contenido digital</strong> que permite a profesionales, agencias
            y empresas <strong>vender archivos digitales de forma segura, automatizada y profesional</strong>, sin
            perder en ningún momento su trazabilidad. Es la solución perfecta para fotógrafos, diseñadores,
            desarrolladores, consultores y cualquier negocio que venda contenido por internet.
          </p>
        </div>
      </section>

      {/* Why Choose YUPAY / Main Features */}
      <section className="py-16 md:py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div
            className="text-center mb-16 animate-on-scroll"
            style={{ "--initial-translate-y": "20px" } as React.CSSProperties}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-brand-white">¿Por qué elegir YUPAY?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="p-8 bg-brand-blue-gray text-brand-white rounded-xl shadow-custom-light hover:shadow-custom-green transition-all duration-300 flex flex-col items-center text-center animate-on-scroll hover:scale-105"
                style={{ "--initial-translate-y": "20px", animationDelay: `${index * 0.1}s` } as React.CSSProperties}
              >
                {feature.icon}
                <h3 className="mt-3 text-xl font-semibold text-brand-white">{feature.title}</h3>
                <p className="mt-2 text-brand-white text-sm flex-grow">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ParallaxSection
        title="Panel de administración intuitivo y potente"
        imageAlt="Panel de Administración de YUPAY"
        imageQuery="Panel de control de administrador YUPAY con graficas y tablas"
        imageUrl="placeholder-3.jpg"
        bgColor="bg-brand-gray-deep"
      >
        <p>
          Gestiona tu contenido digital sin esfuerzo. Con YUPAY, tendrás un centro de mando completo para supervisar
          cada aspecto de tus ventas.
        </p>
        <ul className="mt-6 space-y-3 list-disc list-inside text-brand-gray-text">
          <li>
            <strong>Dashboard con métricas:</strong> Visualiza ingresos, ventas y actividad en tiempo real.
          </li>
          <li>
            <strong>Gestión Drag & Drop:</strong> Sube y organiza archivos fácilmente.
          </li>
          <li>
            <strong>Búsqueda avanzada:</strong> Encuentra transacciones por cliente, fecha o estado.
          </li>
          <li>
            <strong>Edición individual:</strong> Modifica detalles de archivos o transacciones específicas.
          </li>
        </ul>
      </ParallaxSection>

      <ParallaxSection
        title="Experiencia de Cliente Fluida y Profesional"
        imageAlt="Experiencia de Cliente en YUPAY"
        imageLeft={true}
        imageQuery="Interfaz de cliente YUPAY mostrando historial de compras y descargas"
        imageUrl="placeholder-4.jpg"
        bgColor="bg-brand-black"
      >
        <p>Ofrece a tus clientes un proceso de compra seguro y confortable que promueva confianza y transparencia.</p>
        <ul className="mt-6 space-y-3 list-disc list-inside text-brand-gray-text">
          <li>
            <strong>Registro automático:</strong> Acceso instantáneo para clientes tras su primera compra, creación
            automática de perfil de cliente.
          </li>
          <li>
            <strong>Previews interactivas:</strong> Previsualiza imágenes y documentos en baja resolución y con marca de
            agua para evitar uso inapropiado.
          </li>
          <li>
            <strong>Descarga segura post-pago:</strong> Enlaces únicos y protegidos para cada archivo.
          </li>
          <li>
            <strong>Historial de compras:</strong> Panel personal para acceder a todas las compras, descarga individual
            y en lote.
          </li>
          <li>
            <strong>Interfaz responsive:</strong> Experiencia fluida en cualquier dispositivo.
          </li>
        </ul>
      </ParallaxSection>

      {/* Security and Reliability Section */}
      <section className="py-16 md:py-24 bg-brand-gray-deep">
        <div className="container mx-auto px-6">
          <div
            className="text-center mb-16 animate-on-scroll"
            style={{ "--initial-translate-y": "20px" } as React.CSSProperties}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-brand-white">Seguridad y confianza en la nube</h2>
            <p className="mt-4 text-lg text-brand-gray-text max-w-3xl mx-auto">
              Todos los contenidos y datos quedarán protegidos con la última tecnología y la mayor profesionalidad.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityAndReliabilityFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 bg-brand-blue-gray text-brand-white rounded-xl shadow-custom-light hover:shadow-custom-green/80 transition-all duration-300 flex items-start animate-on-scroll"
                style={{ "--initial-translate-y": "20px", animationDelay: `${index * 0.1}s` } as React.CSSProperties}
              >
                <div className="flex-shrink-0 mr-4 mt-1">{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-white">{feature.title}</h3>
                  <p className="mt-1 text-brand-white text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 md:py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div
            className="text-center mb-16 animate-on-scroll"
            style={{ "--initial-translate-y": "20px" } as React.CSSProperties}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-brand-white">Ideal para diversos profesionales</h2>
            <p className="mt-4 text-lg text-brand-gray-text max-w-2xl mx-auto">
              YUPAY se adapta a las necesidades de profesionales y empresas de múltiples sectores.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {useCases.map((useCase, index) => (
              <div
                key={useCase.name}
                className="p-6 bg-brand-gray-dark rounded-xl shadow-custom-light hover:shadow-custom-green hover:scale-105 transform transition-all duration-300 animate-on-scroll"
                style={{ "--initial-translate-y": "20px", animationDelay: `${index * 0.05}s` } as React.CSSProperties}
              >
                {useCase.icon}
                <h3 className="mt-2 text-lg font-medium text-brand-white">{useCase.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-brand-gray-deep">
        <div className="container mx-auto px-6">
          <div
            className="text-center mb-12 animate-on-scroll"
            style={{ "--initial-translate-y": "20px" } as React.CSSProperties}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-brand-white">
              Planes flexibles para crecer contigo
            </h2>
            <p className="mt-4 text-lg text-brand-gray-text max-w-2xl mx-auto">
              Elige el plan que mejor se adapte a tu volumen y necesidades. ¡Sin comisiones ocultas!
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div
            className="flex justify-center items-center mb-12 animate-on-scroll"
            style={{ "--initial-translate-y": "20px", animationDelay: "0.1s" } as React.CSSProperties}
          >
            <div className="inline-flex bg-brand-gray-dark p-1 rounded-lg space-x-1">
              <Button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-brand-green text-brand-black"
                    : "bg-transparent text-brand-gray-text hover:bg-brand-gray-light"
                }`}
              >
                Mensual
              </Button>
              <div className="relative">
                <Button
                  onClick={() => setBillingCycle("annual")}
                  className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors duration-300 ${
                    billingCycle === "annual"
                      ? "bg-brand-green text-brand-black"
                      : "bg-transparent text-brand-gray-text hover:bg-brand-gray-light"
                  }`}
                >
                  Anual
                </Button>
                <div className="absolute -top-3 -right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full transform rotate-12 pointer-events-none">
                  ¡2 meses gratis!
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 items-stretch">
            {plans.map((plan, index) => {
              const isNumericPrice = plan.price.includes("€")
              const monthlyPrice = isNumericPrice ? Number.parseInt(plan.price.replace("€", "")) : 0
              const annualPrice = isNumericPrice ? monthlyPrice * 10 : 0

              const displayPrice = billingCycle === "annual" && isNumericPrice ? `€${annualPrice}` : plan.price
              const displayDetails = billingCycle === "annual" && isNumericPrice ? "/año" : plan.priceDetails

              return (
                <Card
                  key={plan.id}
                  className={`flex flex-col bg-brand-gray-dark border text-brand-white shadow-custom-dark hover:shadow-custom-green transition-all duration-300 rounded-xl animate-on-scroll ${plan.highlight ? `border-brand-green ring-2 ring-brand-green ring-offset-2 ring-offset-brand-gray-deep` : "border-brand-gray-medium"}`}
                  style={{ "--initial-translate-y": "20px", animationDelay: `${index * 0.1}s` } as React.CSSProperties}
                >
                  <CardHeader className="text-center p-6">
                    {plan.highlight && (
                      <div className="text-xs font-semibold uppercase tracking-wider text-brand-green mb-2">
                        Recomendado
                      </div>
                    )}
                    <CardTitle className="text-2xl font-bold text-brand-white">{plan.name}</CardTitle>
                    <CardDescription
                      className={`text-4xl font-extrabold ${plan.highlight ? "text-brand-green" : "text-brand-white"} mt-2`}
                    >
                      {displayPrice}
                      {displayDetails && (
                        <span className="text-sm font-normal text-brand-gray-text">{displayDetails}</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow p-6 space-y-3">
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center text-brand-gray-text">
                        <Package className="w-5 h-5 mr-3 text-brand-gray-text" /> Almacenamiento: {plan.storage}
                      </li>
                      <li className="flex items-center text-brand-gray-text">
                        <Zap className="w-5 h-5 mr-3 text-brand-gray-text" /> Límite por transacción:{" "}
                        {plan.transactionLimit}
                      </li>
                      <li className="flex items-center text-brand-gray-text">
                        <History className="w-5 h-5 mr-3 text-brand-gray-text" /> Retención de archivos¹:{" "}
                        {plan.fileRetention}
                      </li>
                      {plan.features.map((feature) => (
                        <li key={feature.text} className="flex items-center text-brand-gray-text">
                          {feature.icon ? (
                            <span className="mr-3">{feature.icon}</span>
                          ) : feature.included === true ? (
                            <CheckCircle2 className="w-5 h-5 mr-3 text-brand-green" />
                          ) : feature.included === false ? (
                            <XCircle className="w-5 h-5 mr-3 text-red-500" />
                          ) : (
                            <Settings className="w-5 h-5 mr-3 text-sky-400" />
                          )}
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-6">
                    <Button
                      className={`w-full py-3 text-md rounded-md transition-colors duration-300 transform hover:scale-105 ${plan.highlight ? `${primaryButtonBase} ${primaryButtonHover}` : `bg-brand-gray-light text-brand-white ${primaryButtonHover}`}`}
                      onClick={() => handleRequestPlan(plan)}
                    >
                      {plan.id === "enterprise" ? "Contactar para Presupuesto" : "Solicitar Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
          <div
            className="mt-10 text-center text-sm text-brand-gray-text animate-on-scroll"
            style={{ "--initial-translate-y": "20px" } as React.CSSProperties}
          >
            <p className="mt-1">
              ¹ La retención de archivos indica el tiempo que los archivos de una transacción permanecen disponibles
              para el cliente después de la compra antes de ser eliminados automáticamente para liberar espacio.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 md:py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div
            className="text-center mb-16 animate-on-scroll"
            style={{ "--initial-translate-y": "20px" } as React.CSSProperties}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-brand-white">Preguntas frecuentes</h2>
            <p className="mt-4 text-lg text-brand-gray-text max-w-2xl mx-auto">
              Resolvemos algunas de las dudas más comunes sobre YUPAY.
            </p>
          </div>
          <div
            className="max-w-4xl mx-auto animate-on-scroll"
            style={{ "--initial-translate-y": "20px" } as React.CSSProperties}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-brand-gray-dark border-b border-brand-gray-medium rounded-lg mb-4 px-6"
                >
                  <AccordionTrigger className="text-left text-lg font-medium text-brand-white hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-6">
                    <p className="text-brand-gray-text">{faq.answer}</p>
                    {faq.images.length > 0 && (
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {faq.images.map((image, imgIndex) => (
                          <div
                            key={imgIndex}
                            className="relative aspect-[4/3] rounded-md overflow-hidden shadow-custom-dark cursor-pointer group"
                            onClick={() => handleImageClick(faq.images, imgIndex)}
                          >
                            <Image
                              src={image.src || "/placeholder.svg"}
                              alt={image.alt}
                              layout="fill"
                              objectFit="cover"
                              className="group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Eye className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 md:py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div
            className="text-center mb-16 animate-on-scroll"
            style={{ "--initial-translate-y": "20px" } as React.CSSProperties}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-brand-white">Tecnología de vanguardia</h2>
            <p className="mt-4 text-lg text-brand-gray-text max-w-xl mx-auto">
              Construido con herramientas modernas para ofrecerte la mejor experiencia, rendimiento y seguridad.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8 md:gap-x-16">
            {techStack.map((tech, index) => (
              <div
                key={tech.name}
                className="flex flex-col items-center text-center group animate-on-scroll"
                style={{ "--initial-translate-y": "20px", animationDelay: `${index * 0.05}s` } as React.CSSProperties}
              >
                <div className="p-4 bg-brand-gray-dark rounded-full group-hover:bg-brand-green/10 transition-colors duration-300">
                  {tech.icon}
                </div>
                <span className="mt-3 text-sm text-brand-gray-text group-hover:text-brand-green transition-colors duration-300">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-brand-gray-medium bg-brand-black">
        <div className="container mx-auto px-6 text-center text-sm text-brand-gray-text">
          &copy; {new Date().getFullYear()} YUPAY (yupay.es). Todos los derechos reservados.
          <p className="mt-1">Una solución de Alejandro Lamas.</p>
        </div>
      </footer>

      {selectedPlan && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-brand-gray-dark border-brand-gray-medium text-brand-white rounded-lg shadow-custom-dark">
            <DialogHeader className="p-6 border-b border-brand-gray-medium">
              <DialogTitle className="text-2xl text-brand-white">Solicitar Plan: {selectedPlan.name}</DialogTitle>
              <DialogDescription className="text-brand-gray-text">
                {selectedPlan.id === "enterprise"
                  ? "Un asesor se pondrá en contacto para configurar tu plan personalizado."
                  : "Rellena tus datos y un agente te contactará para finalizar el proceso."}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6">
              <RequestModal plan={selectedPlan} onClose={() => setIsModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      )}
      {lightboxOpen && (
        <Lightbox images={lightboxImages} startIndex={lightboxStartIndex} onClose={() => setLightboxOpen(false)} />
      )}
    </div>
  )
}
