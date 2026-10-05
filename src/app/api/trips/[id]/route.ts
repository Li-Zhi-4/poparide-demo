import type { NextRequest } from "next/server";
import { parseSimulation } from "@/lib/simulate";
import { simulateLatency } from "@/mocks/latency";
import { demoTrip } from "@/mocks/trip";

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/trips/[id]">,
) {
  const { id } = await ctx.params;
  const simulation = parseSimulation(
    request.nextUrl.searchParams.get("simulate"),
  );
  await simulateLatency(simulation, 600);

  if (simulation === "trip-error") {
    return Response.json(
      { error: "Our servers are having trouble. Please try again." },
      { status: 503 },
    );
  }
  if (id !== demoTrip.id) {
    return Response.json({ error: "Trip not found." }, { status: 404 });
  }
  return Response.json(demoTrip);
}
