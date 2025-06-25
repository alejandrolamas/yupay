"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { sendPlanRequestEmail, type FormData as EmailFormData } from "@/app/actions/send-request-email"


interface Plan {
  id: string
  name: string
  price: string
  storage: string
  transactionLimit: string
  fileRetention: string
  features: { text: string; included: boolean | "custom" }[]
}

interface RequestModalProps {
  plan: Plan
  onClose: () => void
}

const primaryButtonBase = "bg-brand-green text-brand-black font-semibold"
const primaryButtonHover = "hover:bg-brand-blue-gray hover:text-brand-white"

const inputBaseClass =
  "bg-brand-gray-dark border-brand-gray-medium text-brand-white placeholder:text-brand-gray-text focus:border-brand-green focus:ring-brand-green rounded-md"
const labelBaseClass = "text-brand-gray-text"

export default function RequestModal({ plan, onClose }: RequestModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [formData, setFormData] = useState<Omit<EmailFormData, "planSeleccionado">>({
    nombre: "",
    apellidos: "",
    sector: "",
    sectorOtros: "",
    correoElectronico: "",
    telefono: "",
    facturacionNombreEmpresa: "",
    facturacionNifCif: "",
    facturacionDireccion1: "",
    facturacionDireccion2: "",
    facturacionCodigoPostal: "",
    facturacionProvincia: "",
    facturacionCiudad: "",
    facturacionPais: "España",
    dominioSubdominio: "",
    aceptacionAvisoLegal: false,
  })
  const [showSectorOtros, setShowSectorOtros] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "sector" && value === "otros") {
      setShowSectorOtros(true)
    } else if (name === "sector") {
      setShowSectorOtros(false)
      setFormData((prev) => ({ ...prev, sectorOtros: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.aceptacionAvisoLegal) {
      toast({
        title: "Error de Validación",
        description: "Debes aceptar el aviso legal y la política de privacidad para continuar.",
        variant: "destructive",
        className: "bg-red-700 border-red-800 text-white",
      })
      return
    }
    setIsSubmitting(true)
    try {
      const fullFormData: EmailFormData = { ...formData, planSeleccionado: plan.name }
      const response = await fetch("/api/send-plan-request", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify(fullFormData),
		})
		const result = await response.json()

      if (result.success) {
		  setSubmissionSuccess(true)
		  // También puedes limpiar el formulario si quieres:
		  // setFormData({...formDataInicial})
		  return
		}
    } catch (error: any) {
      toast({
        title: "Error al Enviar Solicitud",
        description:
          error.message ||
          "No se pudo enviar tu solicitud en este momento. Por favor, inténtalo de nuevo más tarde o contacta con soporte.",
        variant: "destructive",
        className: "bg-red-700 border-red-800 text-white",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-brand-gray-text">
        Rellenar este formulario no implica la instalación directa del software. Un agente se pondrá en contacto contigo
        para guiarte en todo el proceso y confirmar los detalles.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="planSeleccionado" className={labelBaseClass}>
            Plan Seleccionado
          </Label>
          <Input
            id="planSeleccionado"
            name="planSeleccionado"
            value={plan.name}
            readOnly
            className={`mt-1 ${inputBaseClass} bg-brand-gray-medium cursor-not-allowed opacity-70`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombre" className={labelBaseClass}>
              Nombre <span className="text-brand-green">*</span>
            </Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className={`mt-1 ${inputBaseClass}`}
            />
          </div>
          <div>
            <Label htmlFor="apellidos" className={labelBaseClass}>
              Apellidos <span className="text-brand-green">*</span>
            </Label>
            <Input
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
              className={`mt-1 ${inputBaseClass}`}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="sector" className={labelBaseClass}>
            Sector <span className="text-brand-green">*</span>
          </Label>
          <Select name="sector" onValueChange={(value) => handleSelectChange("sector", value)} required>
            <SelectTrigger className={`mt-1 ${inputBaseClass} text-brand-white`}>
              <SelectValue placeholder="Selecciona tu sector" />
            </SelectTrigger>
            <SelectContent className="bg-brand-gray-dark border-brand-gray-medium text-brand-white">
              {["Agencia", "Fotógrafo/a", "Diseñador/a", "Influencer", "Educador/a", "Otros"].map((item) => (
                <SelectItem
                  key={item}
                  value={item.toLowerCase().replace(/[\s/]/g, "_")}
                  className="hover:!bg-brand-green hover:!text-brand-black focus:!bg-brand-green focus:!text-brand-black data-[state=checked]:bg-brand-green data-[state=checked]:text-brand-black"
                >
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showSectorOtros && (
          <div>
            <Label htmlFor="sectorOtros" className={labelBaseClass}>
              Especifica tu sector <span className="text-brand-green">*</span>
            </Label>
            <Input
              id="sectorOtros"
              name="sectorOtros"
              value={formData.sectorOtros}
              onChange={handleChange}
              required={showSectorOtros}
              className={`mt-1 ${inputBaseClass}`}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="correoElectronico" className={labelBaseClass}>
              Correo Electrónico <span className="text-brand-green">*</span>
            </Label>
            <Input
              id="correoElectronico"
              name="correoElectronico"
              type="email"
              value={formData.correoElectronico}
              onChange={handleChange}
              required
              className={`mt-1 ${inputBaseClass}`}
            />
          </div>
          <div>
            <Label htmlFor="telefono" className={labelBaseClass}>
              Teléfono <span className="text-brand-green">*</span>
            </Label>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              required
              className={`mt-1 ${inputBaseClass}`}
            />
          </div>
        </div>

        <h3 className="text-lg font-medium pt-4 border-t border-brand-gray-medium mt-6 text-brand-white">
          Datos de Facturación
        </h3>
        <div>
          <Label htmlFor="facturacionNombreEmpresa" className={labelBaseClass}>
            Nombre o Empresa <span className="text-brand-green">*</span>
          </Label>
          <Input
            id="facturacionNombreEmpresa"
            name="facturacionNombreEmpresa"
            value={formData.facturacionNombreEmpresa}
            onChange={handleChange}
            required
            className={`mt-1 ${inputBaseClass}`}
          />
        </div>
        <div>
          <Label htmlFor="facturacionNifCif" className={labelBaseClass}>
            NIF/CIF <span className="text-brand-green">*</span>
          </Label>
          <Input
            id="facturacionNifCif"
            name="facturacionNifCif"
            value={formData.facturacionNifCif}
            onChange={handleChange}
            required
            className={`mt-1 ${inputBaseClass}`}
          />
        </div>
        <div>
          <Label htmlFor="facturacionDireccion1" className={labelBaseClass}>
            Dirección (Línea 1) <span className="text-brand-green">*</span>
          </Label>
          <Input
            id="facturacionDireccion1"
            name="facturacionDireccion1"
            value={formData.facturacionDireccion1}
            onChange={handleChange}
            required
            className={`mt-1 ${inputBaseClass}`}
          />
        </div>
        <div>
          <Label htmlFor="facturacionDireccion2" className={labelBaseClass}>
            Dirección (Línea 2)
          </Label>
          <Input
            id="facturacionDireccion2"
            name="facturacionDireccion2"
            value={formData.facturacionDireccion2}
            onChange={handleChange}
            className={`mt-1 ${inputBaseClass}`}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="facturacionCodigoPostal" className={labelBaseClass}>
              Código Postal <span className="text-brand-green">*</span>
            </Label>
            <Input
              id="facturacionCodigoPostal"
              name="facturacionCodigoPostal"
              value={formData.facturacionCodigoPostal}
              onChange={handleChange}
              required
              className={`mt-1 ${inputBaseClass}`}
            />
          </div>
          <div>
            <Label htmlFor="facturacionCiudad" className={labelBaseClass}>
              Ciudad <span className="text-brand-green">*</span>
            </Label>
            <Input
              id="facturacionCiudad"
              name="facturacionCiudad"
              value={formData.facturacionCiudad}
              onChange={handleChange}
              required
              className={`mt-1 ${inputBaseClass}`}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="facturacionProvincia" className={labelBaseClass}>
              Provincia <span className="text-brand-green">*</span>
            </Label>
            <Input
              id="facturacionProvincia"
              name="facturacionProvincia"
              value={formData.facturacionProvincia}
              onChange={handleChange}
              required
              className={`mt-1 ${inputBaseClass}`}
            />
          </div>
          <div>
            <Label htmlFor="facturacionPais" className={labelBaseClass}>
              País <span className="text-brand-green">*</span>
            </Label>
            <Input
              id="facturacionPais"
              name="facturacionPais"
              value={formData.facturacionPais}
              onChange={handleChange}
              required
              className={`mt-1 ${inputBaseClass}`}
            />
          </div>
        </div>

        <h3 className="text-lg font-medium pt-4 border-t border-brand-gray-medium mt-6 text-brand-white">
          Instalación del Software
        </h3>
        <div>
          <Label htmlFor="dominioSubdominio" className={labelBaseClass}>
            Dominio o Subdominio donde se instalará YUPAY <span className="text-brand-green">*</span>
          </Label>
          <Input
            id="dominioSubdominio"
            name="dominioSubdominio"
            value={formData.dominioSubdominio}
            onChange={handleChange}
            required
            placeholder="ej. midominio.com o tienda.midominio.com"
            className={`mt-1 ${inputBaseClass}`}
          />
        </div>

        <div className="flex items-center space-x-2 pt-4 border-t border-brand-gray-medium mt-6">
          <Checkbox
            id="aceptacionAvisoLegal"
            name="aceptacionAvisoLegal"
            checked={formData.aceptacionAvisoLegal}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
				  ...prev,
				  aceptacionAvisoLegal: Boolean(checked),
				}))
            }
            className="border-brand-gray-medium data-[state=checked]:bg-brand-green data-[state=checked]:text-brand-black data-[state=checked]:border-brand-green"
          />
          <Label htmlFor="aceptacionAvisoLegal" className={`${labelBaseClass} text-sm font-normal`}>
            Acepto el{" "}
            <a
              href="/aviso-legal"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-brand-green"
            >
              aviso legal y la política de privacidad
            </a>
            . <span className="text-brand-green">*</span>
          </Label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="bg-brand-gray-light hover:bg-brand-gray-medium border-brand-gray-medium text-brand-white font-semibold transition-colors duration-300"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`${primaryButtonBase} ${primaryButtonHover} transition-colors duration-300`}
          >
            {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
          </Button>
        </div>
		  {submissionSuccess && (
			  <div className="mt-6 p-4 bg-brand-gray-medium border border-brand-green rounded-md text-white text-center text-sm">
				  ✅ Tu solicitud ha sido enviada correctamente. Un agente se pondrá en contacto contigo pronto.
			  </div>
		  )}
      </form>
    </div>
  )
}
