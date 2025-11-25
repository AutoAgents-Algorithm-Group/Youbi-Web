import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const CHAT_API_URL = process.env.CHAT_API_URL || 'https://api.jiekou.ai/openai/v1/chat/completions';
const API_KEY = process.env.IMAGE_API_KEY || 'sk_2aUrxBPF5QKlf_mu8y4OEUXBbd4Y0Vl7xc66AscB8aU';

// Agent definitions
const AGENTS = {
  andrew: {
    name: 'Andrew',
    role: 'AI Butler & Manager',
    systemPrompt: `You are Andrew, a professional AI butler and manager. You're helpful, friendly, and efficient. 
    
Your responsibilities:
- Understand user needs and route them to the right specialist
- Provide general assistance and conversation
- Coordinate between different specialists (Ray for design, Frank for analytics)
- Keep responses concise and helpful

When users ask about:
- Image enhancement, design, or visual improvements → Route to Ray (the designer)
- Data analysis, statistics, or performance metrics → Route to Frank (the data analyst)
- General questions or chat → Handle yourself as Andrew

Always introduce yourself as Andrew on first contact. Be warm and professional.`
  },
  ray: {
    name: 'Ray',
    role: 'Design Specialist',
    systemPrompt: `You are Ray, a creative design specialist with expertise in visual enhancement and image editing.

Your expertise:
- Image enhancement and beautification
- Color grading and filter recommendations
- Visual design principles
- TikTok cover optimization

Keep responses creative but practical. Provide specific design recommendations.`
  },
  frank: {
    name: 'Frank',
    role: 'Data Analytics Specialist',
    systemPrompt: `You are Frank, a data analytics specialist focused on social media metrics and performance analysis.

Your expertise:
- TikTok analytics and metrics
- Performance tracking and trends
- Growth strategy recommendations
- Data-driven insights

Keep responses data-focused and actionable. Provide clear metrics and recommendations.`
  }
};

// Determine which agent should handle the request
function determineAgent(message: string): 'andrew' | 'ray' | 'frank' {
  const lowerMessage = message.toLowerCase();
  
  // Keywords for design-related queries
  const designKeywords = ['image', 'design', 'enhance', 'beautify', 'color', 'filter', 'cover', 'thumbnail', 'visual', 'photo', 'picture'];
  if (designKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'ray';
  }
  
  // Keywords for analytics-related queries
  const analyticsKeywords = ['data', 'analytics', 'stats', 'statistics', 'performance', 'metrics', 'views', 'likes', 'followers', 'growth', 'trend'];
  if (analyticsKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'frank';
  }
  
  // Default to Andrew
  return 'andrew';
}

// POST /api/chat - Send message to AI agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Please provide a message' },
        { status: 400 }
      );
    }

    console.log('Received chat message:', message);

    // Determine which agent should respond
    const agentType = determineAgent(message);
    const agent = AGENTS[agentType];

    console.log(`Routing to agent: ${agent.name} (${agent.role})`);

    // Prepare conversation messages
    const messages = [
      {
        role: 'system',
        content: agent.systemPrompt
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call the LLM API
    const response = await axios.post(
      CHAT_API_URL,
      {
        model: 'gemini-2.5-pro',
        messages: messages,
        max_tokens: 512,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const assistantMessage = response.data.choices[0].message.content;

    console.log(`${agent.name} response:`, assistantMessage.substring(0, 100) + '...');

    // Add agent introduction if it's Andrew and he's responding
    let finalMessage = assistantMessage;
    if (agentType === 'andrew' && conversationHistory.length === 0) {
      finalMessage = `Hi! I'm Andrew, your AI butler. ${assistantMessage}`;
    } else if (agentType === 'ray') {
      finalMessage = `*Ray (Design Specialist)*: ${assistantMessage}`;
    } else if (agentType === 'frank') {
      finalMessage = `*Frank (Data Analyst)*: ${assistantMessage}`;
    }

    return NextResponse.json({ 
      success: true, 
      message: finalMessage,
      agent: {
        name: agent.name,
        role: agent.role,
        type: agentType
      }
    });
  } catch (error: any) {
    console.error('Chat API error:', error.response?.data || error.message);
    
    // Fallback response
    return NextResponse.json({
      success: true,
      message: "Hi! I'm Andrew, your AI butler. I'm here to help you with your questions. How can I assist you today?",
      agent: {
        name: 'Andrew',
        role: 'AI Butler & Manager',
        type: 'andrew'
      }
    });
  }
}

