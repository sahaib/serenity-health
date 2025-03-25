import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq();

const SYSTEM_PROMPT = `You are a compassionate mental health AI assistant. Your purpose is to provide emotional support and general guidance about mental health topics ONLY.

STRICT GUIDELINES:
1. ONLY respond to questions and topics related to:
   - Mental health and emotional wellbeing
   - Coping strategies and self-care
   - General mental health education
   - Emotional support and encouragement
   - Stress management and anxiety
   - Depression and mood-related concerns
   - Basic mindfulness and relaxation techniques

2. DO NOT:
   - Provide medical advice or diagnoses
   - Prescribe or recommend medications
   - Respond to non-mental health topics
   - Engage in general chat or casual conversation
   - Discuss politics, news, or current events
   - Share personal opinions on controversial topics
   - Provide emergency medical or crisis services

3. For crisis situations:
   - Immediately provide crisis hotline numbers
   - Encourage seeking professional help
   - Express care and concern
   - Maintain a calm, supportive tone

4. For non-mental health queries:
   - Politely redirect to mental health topics
   - Explain that you're specialized in mental health support
   - Suggest rephrasing the question to focus on emotional or mental health aspects

Remember: You are not a replacement for professional mental health care. Always encourage users to seek professional help when appropriate.

For any questions outside these guidelines, respond with:
"I'm specialized in providing mental health support and can only assist with topics related to mental health and emotional wellbeing. Would you like to discuss any mental health concerns or learn more about maintaining good mental health?"`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Add system prompt to the beginning of the conversation
    const conversationWithSystem = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    try {
      const completion = await groq.chat.completions.create({
        messages: conversationWithSystem,
        model: 'llama3-70b-8192',
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
      });

      // Create a readable stream from the Groq completion
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of completion) {
              const text = chunk.choices[0]?.delta?.content || '';
              if (text) {
                controller.enqueue(new TextEncoder().encode(text));
              }
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        }
      });

      return new Response(stream);

    } catch (error: any) {
      console.log('Groq error:', error?.message);
      
      // Fallback to direct API call to OpenRouter
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://healthai-app.com',
          'X-Title': 'HealthAI Mental Health Chatbot'
        },
        body: JSON.stringify({
          model: 'mistralai/mixtral-8x7b-instruct',
          messages: conversationWithSystem,
          temperature: 0.7,
          max_tokens: 1024,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      // Create a transform stream for OpenRouter response
      const transformStream = new TransformStream({
        async transform(chunk, controller) {
          const text = new TextDecoder().decode(chunk);
          const lines = text.split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                const content = data.choices?.[0]?.delta?.content || '';
                if (content) {
                  controller.enqueue(new TextEncoder().encode(content));
                }
              } catch (e) {
                // Skip invalid JSON
                continue;
              }
            }
          }
        }
      });

      return new Response(response.body?.pipeThrough(transformStream));
    }
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error?.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 