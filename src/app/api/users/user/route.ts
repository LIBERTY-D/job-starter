import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
    const user=  request.headers.get("user-data")
    
    return NextResponse.json(user?JSON.parse(user):null);
  }