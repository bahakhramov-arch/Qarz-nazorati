import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { text, numbers } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY topilmadi. .env.local faylini tekshiring.' },
        { status: 500 }
      );
    }

    // Системный промпт с поддержкой узбекского и русского языков
    const systemMessage = `
      You are a smart, helpful, and friendly AI assistant for the "Qarz nazorati" application. 
      You can assist users with financial management, debt tracking, contract analysis, programming, or general questions.
      IMPORTANT RULES:
      1. Always reply in the exact same language the user uses (if user writes in Russian, reply in Russian; if user writes in Uzbek, reply in Uzbek).
      2. Keep responses concise, practical, and clear.
      3. If financial numbers (income, total payments) are provided, you can use them to give helpful insights.
    `;

    const userMessage = `
      Foydalanuvchi xabari / Сообщение пользователя: "${text}"
      Moliyaviy ko'rsatkichlar / Финансовые данные: ${JSON.stringify(numbers || {})}
    `;

    // Запрос к Groq API с актуальной моделью openai/gpt-oss-20b
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Groq API bilan bog\'lanishda xatolik yuz berdi.' },
        { status: response.status }
      );
    }

    const aiReply = data.choices?.[0]?.message?.content || 'Javob olinmadi.';

    return NextResponse.json({ result: aiReply });

  } catch (error) {
    console.error('AI Route Error:', error);
    return NextResponse.json(
      { error: 'Serverda xatolik yuz berdi: ' + error.message },
      { status: 500 }
    );
  }
}