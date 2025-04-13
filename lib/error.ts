import { NextResponse } from "next/server";

export const createErrorResponse = (message: string, status: number) => {
    return new NextResponse(
      JSON.stringify({ error: message }),
      {
        status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  };

