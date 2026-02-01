import { NextResponse } from "next/server"

const IAM_URL = "https://iam.cloud.ibm.com/identity/token"

export async function POST() {
  try {
    const apiKey = process.env.NEXT_WATSONX_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "NEXT_WATSONX_API_KEY missing" },
        { status: 500 }
      )
    }

    const body = new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: apiKey,
    })

    const res = await fetch(IAM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body,
      cache: "no-store",
    })

    const text = await res.text()

    if (!res.ok) {
      return NextResponse.json(
        { error: "IAM failed", details: text },
        { status: 500 }
      )
    }

    const data = JSON.parse(text)

    return NextResponse.json({
      access_token: data.access_token,
      expires_in: data.expires_in,
      token_type: data.token_type,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    )
  }
}