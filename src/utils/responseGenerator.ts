import { AIModel, Message } from '../types';

export function generateIntelligentResponse(
  prompt: string, 
  selectedModel: AIModel, 
  conversationHistory: Message[] = []
): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Get context from conversation history
  const context = conversationHistory
    .slice(-4) // Last 4 messages for context
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n');

  // Determine response type and generate appropriate content
  if (isCodeRequest(lowerPrompt)) {
    return generateCodeResponse(prompt, selectedModel, context);
  } else if (isWritingRequest(lowerPrompt)) {
    return generateWritingResponse(prompt, selectedModel, context);
  } else if (isAnalysisRequest(lowerPrompt)) {
    return generateAnalysisResponse(prompt, selectedModel, context);
  } else if (isMathRequest(lowerPrompt)) {
    return generateMathResponse(prompt, selectedModel, context);
  } else if (isExplanationRequest(lowerPrompt)) {
    return generateExplanationResponse(prompt, selectedModel, context);
  } else if (isCreativeRequest(lowerPrompt)) {
    return generateCreativeResponse(prompt, selectedModel, context);
  } else {
    return generateGeneralResponse(prompt, selectedModel, context);
  }
}

function isCodeRequest(prompt: string): boolean {
  return /code|program|function|algorithm|debug|script|api|database|sql|javascript|python|react|html|css|programming|develop/.test(prompt);
}

function isWritingRequest(prompt: string): boolean {
  return /write|article|blog|story|content|copy|marketing|email|letter|essay|paragraph/.test(prompt);
}

function isAnalysisRequest(prompt: string): boolean {
  return /analyze|analysis|compare|comparison|evaluate|assessment|review|examine|study/.test(prompt);
}

function isMathRequest(prompt: string): boolean {
  return /math|calculate|equation|formula|solve|statistics|probability|algebra|geometry|calculus/.test(prompt);
}

function isExplanationRequest(prompt: string): boolean {
  return /explain|how does|what is|why|how to|definition|meaning|concept|understand/.test(prompt);
}

function isCreativeRequest(prompt: string): boolean {
  return /creative|brainstorm|idea|story|poem|design|innovative|imagine|invent/.test(prompt);
}

function generateCodeResponse(prompt: string, model: AIModel, context: string): string {
  const codeExamples = {
    python: `# Here's a Python solution:
def example_function(data):
    """
    This function demonstrates best practices
    """
    result = []
    for item in data:
        if item.is_valid():
            result.append(item.process())
    return result

# Usage example:
data = get_sample_data()
processed = example_function(data)
print(f"Processed {len(processed)} items")`,

    javascript: `// Here's a JavaScript solution:
function exampleFunction(data) {
    /**
     * This function demonstrates modern JS practices
     */
    return data
        .filter(item => item.isValid)
        .map(item => item.process())
        .reduce((acc, curr) => [...acc, curr], []);
}

// Usage with async/await:
async function processData() {
    try {
        const data = await fetchData();
        const result = exampleFunction(data);
        console.log(\`Processed \${result.length} items\`);
        return result;
    } catch (error) {
        console.error('Processing failed:', error);
    }
}`,

    react: `// Here's a React component solution:
import React, { useState, useEffect } from 'react';

function ExampleComponent({ data }) {
    const [processedData, setProcessedData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const processData = async () => {
            setLoading(true);
            try {
                const result = await data
                    .filter(item => item.isValid)
                    .map(item => item.process());
                setProcessedData(result);
            } catch (error) {
                console.error('Processing failed:', error);
            } finally {
                setLoading(false);
            }
        };

        processData();
    }, [data]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="data-container">
            {processedData.map(item => (
                <div key={item.id} className="data-item">
                    {item.content}
                </div>
            ))}
        </div>
    );
}`
  };

  let response = `Using ${model.name}, I'll help you with this coding task.\n\n`;
  
  if (prompt.includes('python')) {
    response += codeExamples.python;
  } else if (prompt.includes('javascript') || prompt.includes('js')) {
    response += codeExamples.javascript;
  } else if (prompt.includes('react')) {
    response += codeExamples.react;
  } else {
    response += codeExamples.python; // Default to Python
  }

  response += `\n\n**Key Features:**
• Clean, readable code following best practices
• Error handling and validation
• Comprehensive comments and documentation
• Optimized for performance and maintainability

**Why ${model.name}?** ${model.name} excels at code generation with its ${model.strengths.join(', ').toLowerCase()} capabilities, ensuring high-quality, production-ready solutions.`;

  return response;
}

function generateWritingResponse(prompt: string, model: AIModel, context: string): string {
  const writingTemplates = {
    article: `# Understanding the Topic: A Comprehensive Guide

## Introduction
In today's rapidly evolving landscape, understanding this subject has become increasingly important. This comprehensive guide will walk you through the essential concepts, practical applications, and key insights you need to know.

## Key Points to Consider

### 1. Fundamental Concepts
The foundation of this topic rests on several core principles that shape how we approach and understand the subject matter.

### 2. Practical Applications
Real-world implementation involves considering multiple factors and stakeholder perspectives to achieve optimal outcomes.

### 3. Best Practices
Industry leaders recommend following established guidelines while remaining flexible enough to adapt to unique circumstances.

## Conclusion
By understanding these concepts and applying them thoughtfully, you can achieve meaningful results and contribute positively to your field.`,

    marketing: `🎯 **Strategic Marketing Approach**

**Objective:** Create compelling content that resonates with your target audience and drives meaningful engagement.

**Key Messages:**
• Value proposition that addresses real customer pain points
• Unique differentiators that set you apart from competitors
• Clear call-to-action that guides users toward desired outcomes

**Content Strategy:**
1. **Awareness Stage:** Educational content that builds trust and authority
2. **Consideration Stage:** Comparative content highlighting your advantages
3. **Decision Stage:** Testimonials and case studies proving your value

**Execution Plan:**
- Multi-channel approach across digital and traditional platforms
- Consistent brand messaging and visual identity
- Data-driven optimization based on performance metrics

**Success Metrics:**
- Engagement rates and audience growth
- Lead generation and conversion rates
- Brand awareness and sentiment tracking`,

    email: `Subject: [Compelling Subject Line That Gets Opened]

Dear [Name],

I hope this message finds you well. I'm reaching out because [specific reason that shows you've done your research].

[Opening paragraph that immediately provides value or addresses their needs]

Here's what I'd like to propose:

• [Benefit 1]: Specific value you can provide
• [Benefit 2]: How this solves their problem
• [Benefit 3]: Why timing matters

[Supporting paragraph with evidence, social proof, or relevant details]

I'd love to discuss this further at your convenience. Would you be available for a brief call this week?

Best regards,
[Your name]

P.S. [Compelling postscript that reinforces your main message]`
  };

  let response = `Using ${model.name}'s advanced writing capabilities, here's a tailored response:\n\n`;
  
  if (prompt.includes('article') || prompt.includes('blog')) {
    response += writingTemplates.article;
  } else if (prompt.includes('marketing') || prompt.includes('copy')) {
    response += writingTemplates.marketing;
  } else if (prompt.includes('email')) {
    response += writingTemplates.email;
  } else {
    response += writingTemplates.article; // Default template
  }

  response += `\n\n**Writing Excellence Features:**
• Engaging, audience-focused content
• Clear structure and logical flow
• Compelling calls-to-action
• SEO-optimized when applicable

**Why ${model.name}?** This model's ${model.strengths.join(', ').toLowerCase()} make it perfect for creating high-quality, persuasive content that achieves your communication goals.`;

  return response;
}

function generateAnalysisResponse(prompt: string, model: AIModel, context: string): string {
  return `Using ${model.name}'s analytical capabilities, here's a comprehensive analysis:

## Executive Summary
Based on the available information, several key patterns and insights emerge that warrant detailed examination.

## Key Findings

### 1. Primary Observations
• **Trend Analysis**: Current data suggests significant patterns that align with industry benchmarks
• **Performance Metrics**: Key indicators show both strengths and areas for improvement
• **Comparative Assessment**: When measured against similar cases, unique characteristics become apparent

### 2. Critical Factors
• **Impact Assessment**: The most significant variables affecting outcomes
• **Risk Evaluation**: Potential challenges and mitigation strategies
• **Opportunity Identification**: Areas with highest potential for positive impact

### 3. Data-Driven Insights
• **Quantitative Analysis**: Statistical significance and confidence intervals
• **Qualitative Assessment**: Contextual factors that numbers alone cannot capture
• **Predictive Modeling**: Likely scenarios based on current trajectories

## Recommendations

### Immediate Actions
1. **Priority 1**: Address the most critical issues first
2. **Priority 2**: Implement quick wins for momentum
3. **Priority 3**: Establish monitoring systems for ongoing assessment

### Long-term Strategy
- Develop comprehensive framework for sustained improvement
- Create feedback loops for continuous optimization
- Build capabilities for future challenges

## Conclusion
The analysis reveals both challenges and opportunities. Success will depend on strategic implementation of recommendations while maintaining flexibility to adapt as conditions evolve.

**Why ${model.name}?** This model's ${model.strengths.join(', ').toLowerCase()} provide the analytical depth and accuracy needed for complex problem-solving and strategic decision-making.`;
}

function generateMathResponse(prompt: string, model: AIModel, context: string): string {
  return `Using ${model.name}'s mathematical capabilities, here's a detailed solution:

## Problem Analysis
Let me break down this mathematical problem step by step to ensure clarity and accuracy.

## Solution Approach

### Step 1: Problem Setup
First, let's identify the given information and what we need to find:
- Given: [Key variables and constraints]
- Find: [Target solution or proof]

### Step 2: Mathematical Framework
The most appropriate method for solving this is:
\`\`\`
Formula/Equation: [Relevant mathematical expression]
Where: [Variable definitions]
\`\`\`

### Step 3: Detailed Calculation
Working through the solution systematically:

1. **Initial Setup**: [Starting equation or expression]
2. **Algebraic Manipulation**: [Step-by-step transformations]
3. **Substitution**: [Plugging in known values]
4. **Simplification**: [Reducing to final form]

### Step 4: Verification
Let's verify our answer by:
- Checking units and dimensional analysis
- Substituting back into original equation
- Considering reasonableness of the result

## Final Answer
**Result**: [Clear, highlighted final answer]

## Alternative Approaches
Other methods that could be used include:
- [Method 1]: Brief description of alternative approach
- [Method 2]: When this method might be preferred

**Why ${model.name}?** This model's ${model.strengths.join(', ').toLowerCase()} ensure mathematical accuracy and clear step-by-step reasoning for complex problem-solving.`;
}

function generateExplanationResponse(prompt: string, model: AIModel, context: string): string {
  return `Using ${model.name}'s comprehensive knowledge base, here's a clear explanation:

## Overview
Let me break this down in a way that's easy to understand, starting with the basics and building up to more complex concepts.

## Core Concepts

### What It Is
At its fundamental level, this concept refers to [basic definition in simple terms]. Think of it like [relatable analogy] - this helps illustrate the basic principle.

### How It Works
The underlying mechanism involves several key components:

1. **Primary Process**: [Main function or operation]
2. **Supporting Elements**: [Contributing factors or components]
3. **Interactions**: [How different parts work together]

### Why It Matters
This is important because:
- **Practical Impact**: How it affects everyday life or work
- **Broader Implications**: Wider significance in the field
- **Future Relevance**: Why understanding this is valuable going forward

## Real-World Examples
To make this more concrete, consider these examples:

### Example 1: [Specific Case]
[Detailed example showing the concept in action]

### Example 2: [Different Context]
[Another example from a different perspective or application]

## Common Misconceptions
People often misunderstand this topic in these ways:
- **Misconception 1**: [Common error and correction]
- **Misconception 2**: [Another frequent mistake and clarification]

## Key Takeaways
The most important points to remember:
• [Essential insight 1]
• [Essential insight 2]
• [Essential insight 3]

**Why ${model.name}?** This model's ${model.strengths.join(', ').toLowerCase()} enable clear, accurate explanations that make complex topics accessible and understandable.`;
}

function generateCreativeResponse(prompt: string, model: AIModel, context: string): string {
  const creativeTemplates = {
    story: `# The Unexpected Journey

## Chapter 1: The Beginning
In a world not so different from our own, where possibilities stretched beyond the horizon like morning mist, our story begins with an ordinary moment that would change everything.

Sarah had always believed that the most extraordinary adventures began with the most mundane decisions. Today, as she stood at the crossroads of Maple and Third Street, coffee in hand and uncertainty in her heart, she had no idea how prophetic that belief would prove to be.

The letter in her pocket crinkled as she shifted her weight. Three words written in elegant script: "You are ready." No signature, no return address, just those three words that had arrived at precisely the moment she needed them most.

## Chapter 2: The Discovery
What happened next would challenge everything she thought she knew about the world, about herself, and about the thin line between reality and possibility...

[The story continues with rich character development, unexpected plot twists, and meaningful themes that resonate with readers]`,

    ideas: `🚀 **Creative Brainstorming Session**

## Innovative Concepts

### 1. Disruptive Approach
**The Big Idea**: What if we completely reimagined the traditional approach?
- Turn conventional wisdom on its head
- Combine unexpected elements for unique solutions
- Focus on user experience over technical features

### 2. Cross-Industry Inspiration
**Learning from Others**: Borrowing successful strategies from different fields
- Healthcare's patient-centered approach → Customer service
- Gaming's engagement mechanics → Education
- Nature's efficiency principles → Business processes

### 3. Future-Forward Thinking
**Tomorrow's Solutions Today**: Anticipating future needs
- Emerging technology integration
- Changing demographic preferences
- Environmental and social responsibility

## Implementation Strategies
- **Rapid Prototyping**: Test ideas quickly and cheaply
- **User Feedback Loops**: Involve your audience in development
- **Iterative Improvement**: Refine based on real-world results

## Next Steps
1. Select the most promising concepts
2. Develop minimum viable versions
3. Gather feedback and iterate
4. Scale successful implementations`,

    design: `🎨 **Creative Design Concept**

## Design Philosophy
Creating solutions that are not just functional, but emotionally resonant and visually compelling.

### Core Principles
- **Simplicity**: Remove unnecessary complexity
- **Accessibility**: Design for all users
- **Sustainability**: Consider long-term impact
- **Innovation**: Push creative boundaries

### Visual Direction
**Color Palette**: [Thoughtful color choices with psychological impact]
**Typography**: [Font selections that enhance readability and brand personality]
**Layout**: [Spatial relationships that guide user attention]

### User Experience Flow
1. **First Impression**: Immediate visual impact and clear value proposition
2. **Engagement**: Interactive elements that encourage exploration
3. **Conversion**: Smooth path to desired actions
4. **Retention**: Memorable experience that brings users back

### Technical Considerations
- Responsive design for all devices
- Performance optimization for fast loading
- SEO-friendly structure
- Analytics integration for continuous improvement`
  };

  let response = `Using ${model.name}'s creative capabilities, here's an innovative response:\n\n`;
  
  if (prompt.includes('story') || prompt.includes('narrative')) {
    response += creativeTemplates.story;
  } else if (prompt.includes('idea') || prompt.includes('brainstorm')) {
    response += creativeTemplates.ideas;
  } else if (prompt.includes('design')) {
    response += creativeTemplates.design;
  } else {
    response += creativeTemplates.ideas; // Default to ideas
  }

  response += `\n\n**Creative Excellence Features:**
• Original, engaging content
• Multi-dimensional thinking
• Practical implementation guidance
• Inspiration for further development

**Why ${model.name}?** This model's ${model.strengths.join(', ').toLowerCase()} foster innovative thinking and creative problem-solving that goes beyond conventional approaches.`;

  return response;
}

function generateGeneralResponse(prompt: string, model: AIModel, context: string): string {
  return `Using ${model.name}'s comprehensive capabilities, here's a thoughtful response to your question:

## Understanding Your Request
I can see you're looking for information about "${prompt}". Let me provide you with a comprehensive and helpful response.

## Key Information

### Primary Insights
Based on current knowledge and best practices, here are the most important points to consider:

• **Core Concept**: The fundamental principle underlying this topic
• **Practical Applications**: How this applies in real-world scenarios  
• **Important Considerations**: Factors that influence outcomes and decisions

### Detailed Analysis
When examining this topic more closely, several key aspects emerge:

1. **Background Context**: Understanding the foundation helps inform better decisions
2. **Current State**: Where things stand today and recent developments
3. **Future Implications**: Trends and predictions for what's ahead

### Actionable Recommendations
Based on this analysis, here's what I recommend:

- **Immediate Steps**: What you can do right now to move forward
- **Medium-term Planning**: Strategies for the next few months
- **Long-term Vision**: How to position yourself for future success

## Additional Resources
To deepen your understanding, consider exploring:
- Industry reports and research studies
- Expert opinions and thought leadership
- Practical case studies and examples

## Conclusion
The key to success with this topic is understanding both the theoretical foundation and practical implementation. By taking a balanced approach that considers multiple perspectives, you'll be well-positioned to achieve your goals.

**Why ${model.name}?** This model's ${model.strengths.join(', ').toLowerCase()} provide the comprehensive knowledge and analytical depth needed to address complex questions with nuanced, helpful responses.

Is there any specific aspect you'd like me to explore further?`;
}