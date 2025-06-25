import { NextResponse } from "next/server"
import { sendPlanRequestEmail } from "@/app/actions/send-request-email"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    console.log("[API] Data recibida:", data)

    const result = await sendPlanRequestEmail(data)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      console.warn("[API] Validación fallida:", result.issues || result.error)
      return NextResponse.json({ success: false, error: result.error, issues: result.issues }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Error en /api/send-plan-request:", error)
    return NextResponse.json({ success: false, error: "Error inesperado en el servidor." }, { status: 500 })
  }
}
