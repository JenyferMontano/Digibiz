export async function POST(req:Request) {
    const { prompt } = await req.json();

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const chunks = prompt.split("  ");
            for (const word of chunks) {
                controller.enqueue(encoder.encode(`data: ${word}\n\n`));
                await new Promise(r => setTimeout(r, 100));
            }
            controller.close();
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream"
        }
    });
}