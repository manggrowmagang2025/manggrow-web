import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    console.log('Checking Gemini API key...', geminiApiKey ? 'API key found' : 'API key missing');
    
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Build conversation context for Gemini
    const systemPrompt = `Anda adalah AI asisten ahli berkebun dan perawatan tanaman bernama "Manggrow Assistant". Anda memiliki pengetahuan mendalam tentang:

- Diagnosa penyakit tanaman
- Perawatan tanaman hias dan produktif
- Teknik penyiraman, pemupukan, dan pencahayaan
- Identifikasi hama dan cara mengatasinya
- Tips berkebun untuk pemula hingga ahli
- Rekomendasi tanaman sesuai kondisi lingkungan

Berikan jawaban yang:
- Praktis dan mudah dipahami
- Berdasarkan pengetahuan ilmiah
- Disesuaikan dengan kondisi iklim tropis Indonesia
- Ramah dan mendukung untuk pemula
- Memberikan langkah-langkah yang jelas

Selalu mulai respon dengan sapaan yang ramah dan akhiri dengan motivasi untuk terus berkebun.`;

    // Prepare messages for Gemini API
    const messages = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Halo! Saya Manggrow Assistant, siap membantu Anda dengan segala pertanyaan seputar berkebun dan perawatan tanaman. Mari kita mulai!' }] }
    ];

    // Add conversation history
    conversationHistory.forEach((msg: any) => {
      if (msg.role === 'user') {
        messages.push({ role: 'user', parts: [{ text: msg.content }] });
      } else {
        messages.push({ role: 'model', parts: [{ text: msg.content }] });
      }
    });

    // Add current message
    messages.push({ role: 'user', parts: [{ text: message }] });

    console.log('Sending request to Gemini API...');
    console.log('Request payload:', JSON.stringify({ contents: messages.slice(-4) }, null, 2)); // Log last 4 messages for debugging

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText
      });
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from Gemini');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});