import { getSlotsDoctor } from "@/server/db/appointments";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");

  if (!doctorId) {
    return NextResponse.json({ error: "Missing doctorId" }, { status: 400 });
  }

  const slots = await getSlotsDoctor(doctorId);
  return NextResponse.json(slots);
}
