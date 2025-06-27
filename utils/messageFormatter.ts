// utils/messageFormatter.js

export const formatLLMResponse = (rawResponse:any) => {
  if (!rawResponse || typeof rawResponse !== 'string') {
    return 'I got your message! How can I help?';
  }

  let formattedText = rawResponse;

  // Remove thinking blocks
  formattedText = formattedText.replace(/<think>.*?<\/think>/gs, '');

  // Remove XML tags
  formattedText = formattedText.replace(/<[^>]*>/g, '');

  // Handle code blocks - convert to readable format
  formattedText = formattedText.replace(/```(\w*)\n([\s\S]*?)\n```/g, (match, lang, code) => {
    const language = lang ? `${lang.toUpperCase()} Code:` : 'Code:';
    const cleanCode: string = code
      .split('\n')
      .map((line:any) => line.trim())
      .filter((line:any) => line.length > 0)
      .join('\n');
    return `\n\n${language}\n${cleanCode}\n`;
  });

  // Handle inline code
  formattedText = formattedText.replace(/`([^`]+)`/g, '"$1"');

  // Convert headers to readable format
  formattedText = formattedText.replace(/^### (.*$)/gm, '\n$1:\n');
  formattedText = formattedText.replace(/^## (.*$)/gm, '\n$1:\n');
  formattedText = formattedText.replace(/^# (.*$)/gm, '\n$1:\n');

  // Handle bold text
  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '$1');
  formattedText = formattedText.replace(/__(.*?)__/g, '$1');

  // Handle italic text
  formattedText = formattedText.replace(/\*(.*?)\*/g, '$1');
  formattedText = formattedText.replace(/_(.*?)_/g, '$1');

  // Handle lists - convert to readable format
  formattedText = formattedText.replace(/^\s*[-*+]\s+(.*)$/gm, '• $1');
  formattedText = formattedText.replace(/^\s*\d+\.\s+(.*)$/gm, (match, text, offset, string) => {
    const lines = string.substr(0, offset).split('\n');
    const currentLineIndex = lines.length;
    const numberedLists = string.substr(0, offset).match(/^\s*\d+\.\s+/gm) || [];
    const currentNumber = numberedLists.length + 1;
    return `${currentNumber}. ${text}`;
  });

  // Handle blockquotes
  formattedText = formattedText.replace(/^>\s*(.*)$/gm, '"$1"');

  // Handle horizontal rules
  formattedText = formattedText.replace(/^[-*_]{3,}$/gm, '---');

  // Handle tables - convert to readable format
  formattedText = formattedText.replace(/\|(.*?)\|/g, (match, content) => {
    return content.split('|').map((cell:any) => cell.trim()).join(' | ');
  });

  // Clean up excessive newlines
  formattedText = formattedText.replace(/\n{3,}/g, '\n\n');

  // Convert escaped newlines
  formattedText = formattedText.replace(/\\n/g, '\n');

  // Remove leading/trailing whitespace
  formattedText = formattedText.trim();

  // Handle empty responses
  if (!formattedText || formattedText.length === 0) {
    return 'I received your message. How can I assist you?';
  }

  return formattedText;
};

// Advanced formatting for code blocks with syntax highlighting info
export const formatCodeBlock = (code: string, language?: string) => {
  const langNames: { [key: string]: string } = {
    'js': 'JavaScript',
    'javascript': 'JavaScript',
    'ts': 'TypeScript',
    'typescript': 'TypeScript',
    'python': 'Python',
    'py': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'html': 'HTML',
    'css': 'CSS',
    'bash': 'Terminal',
    'sh': 'Shell',
    'json': 'JSON',
    'xml': 'XML',
    'sql': 'SQL',
    'php': 'PHP',
    'ruby': 'Ruby',
    'go': 'Go',
    'rust': 'Rust',
    'swift': 'Swift',
    'kotlin': 'Kotlin'
  };

  const displayName = language && langNames[language.toLowerCase()] ? langNames[language.toLowerCase()] : 'Code';
  return `\n${displayName}:\n${code}\n`;
};