"use server"

import nodemailer from "nodemailer"
import { z } from "zod"

// Define schema for form data validation
const FormDataSchema = z.object({
  planSeleccionado: z.string().min(1, "Plan es requerido"),
  cicloFacturacion: z.enum(["monthly", "annual"]),
  nombre: z.string().min(1, "Nombre es requerido"),
  apellidos: z.string().min(1, "Apellidos son requeridos"),
  sector: z.string().min(1, "Sector es requerido"),
  sectorOtros: z.string().optional(),
  correoElectronico: z.string().email("Correo electrónico inválido"),
  telefono: z.string().min(1, "Teléfono es requerido"),
  metodosContacto: z.array(z.string()).min(1, "Debes seleccionar al menos un método de contacto"),
  codigoReferido: z.string().optional(),
  facturacionNombreEmpresa: z.string().min(1, "Nombre o empresa de facturación es requerido"),
  facturacionNifCif: z.string().min(1, "NIF/CIF es requerido"),
  facturacionDireccion1: z.string().min(1, "Dirección de facturación es requerida"),
  facturacionDireccion2: z.string().optional(),
  facturacionCodigoPostal: z.string().min(1, "Código postal de facturación es requerido"),
  facturacionProvincia: z.string().min(1, "Provincia de facturación es requerida"),
  facturacionCiudad: z.string().min(1, "Ciudad de facturación es requerida"),
  facturacionPais: z.string().min(1, "País de facturación es requerido"),
  dominioSubdominio: z.string().min(1, "Dominio o subdominio es requerido"),
  aceptacionAvisoLegal: z.boolean().refine((val) => val === true, {
    message: "Debe aceptar el aviso legal",
  }),
})

export type FormData = z.infer<typeof FormDataSchema>

export async function sendPlanRequestEmail(data: FormData) {
  const validation = FormDataSchema.safeParse(data)

  if (!validation.success) {
    return { success: false, error: "Datos del formulario inválidos.", issues: validation.error.issues }
  }

  const validatedData = validation.data

  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_SENDER_NAME,
    EMAIL_RECIPIENT, // Target email: alamas@dro.studio
  } = process.env

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASSWORD || !EMAIL_SENDER_NAME || !EMAIL_RECIPIENT) {
    console.error("Faltan variables de entorno para la configuración del email.")
    return { success: false, error: "Error de configuración del servidor de correo." }
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number.parseInt(EMAIL_PORT, 10),
    secure: Number.parseInt(EMAIL_PORT, 10) === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  })

  const sectorDisplay =
    validatedData.sector === "otros" && validatedData.sectorOtros
      ? `${validatedData.sector} (${validatedData.sectorOtros})`
      : validatedData.sector

  const mailOptions = {
    from: `"${EMAIL_SENDER_NAME}" <${EMAIL_USER}>`,
    to: EMAIL_RECIPIENT,
    subject: `Nueva Solicitud de Plan YUPAY - ${validatedData.planSeleccionado}`,
    html: `
      <h1>Nueva Solicitud de Plan YUPAY</h1>
      <p><strong>Plan Seleccionado:</strong> ${validatedData.planSeleccionado}</p>
      <p><strong>Ciclo de Facturación:</strong> ${validatedData.cicloFacturacion === "annual" ? "Anual" : "Mensual"}</p>
      ${validatedData.codigoReferido ? `<p><strong>Código de Referido:</strong> ${validatedData.codigoReferido}</p>` : ""}
      
      <h2>Datos del Solicitante:</h2>
      <ul>
        <li><strong>Nombre Completo:</strong> ${validatedData.nombre} ${validatedData.apellidos}</li>
        <li><strong>Correo Electrónico:</strong> ${validatedData.correoElectronico}</li>
        <li><strong>Teléfono:</strong> ${validatedData.telefono}</li>
        <li><strong>Sector:</strong> ${sectorDisplay}</li>
        <li><strong>Preferencia de Contacto:</strong> ${validatedData.metodosContacto.join(", ")}</li>
      </ul>
      
      <h2>Datos de Facturación:</h2>
      <ul>
        <li><strong>Nombre o Empresa:</strong> ${validatedData.facturacionNombreEmpresa}</li>
        <li><strong>NIF/CIF:</strong> ${validatedData.facturacionNifCif}</li>
        <li><strong>Dirección 1:</strong> ${validatedData.facturacionDireccion1}</li>
        ${validatedData.facturacionDireccion2 ? `<li><strong>Dirección 2:</strong> ${validatedData.facturacionDireccion2}</li>` : ""}
        <li><strong>Código Postal:</strong> ${validatedData.facturacionCodigoPostal}</li>
        <li><strong>Ciudad:</strong> ${validatedData.facturacionCiudad}</li>
        <li><strong>Provincia:</strong> ${validatedData.facturacionProvincia}</li>
        <li><strong>País:</strong> ${validatedData.facturacionPais}</li>
      </ul>
      
      <h2>Instalación:</h2>
      <p><strong>Dominio/Subdominio para instalación YUPAY:</strong> ${validatedData.dominioSubdominio}</p>
      <p><strong>Aceptó Aviso Legal:</strong> ${validatedData.aceptacionAvisoLegal ? "Sí" : "No"}</p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error: any) {
    console.error("Error al enviar el email:", error)
    return { success: false, error: error.message || "No se pudo enviar el correo." }
  }
}
