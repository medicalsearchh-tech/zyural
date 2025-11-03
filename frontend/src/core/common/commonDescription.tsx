import React from 'react';
import DOMPurify from 'dompurify';

interface CommonDescriptionProps {
  description: string;
  className?: string;
  maxLength?: number;
  showReadMore?: boolean;
}

const CommonDescription: React.FC<CommonDescriptionProps> = ({ 
  description, 
  className = "course-description",
  maxLength,
  showReadMore = false
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  // Return early if no description
  if (!description) {
    return <div className={className}>No description available.</div>;
  }

  // Sanitize the HTML content
  const sanitizedHTML = DOMPurify.sanitize(description, {
    ALLOWED_TAGS: [
      'p', 'div', 'span', 'br', 'strong', 'b', 'em', 'i', 'u', 
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 
      'blockquote', 'a', 'img'
    ],
    ALLOWED_ATTR: [
      'style', 'class', 'href', 'target', 'src', 'alt', 'title'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });

  // Function to truncate HTML content
  const truncateHTML = (html: string, maxLen: number): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    if (textContent.length <= maxLen) {
      return html;
    }
    
    // Simple truncation - you might want a more sophisticated approach
    const truncatedText = textContent.substring(0, maxLen) + '...';
    return DOMPurify.sanitize(`<p>${truncatedText}</p>`);
  };

  // Determine what content to show
  const getDisplayContent = (): string => {
    if (!maxLength || !showReadMore) {
      return sanitizedHTML;
    }
    
    if (isExpanded) {
      return sanitizedHTML;
    }
    
    return truncateHTML(sanitizedHTML, maxLength);
  };

  // Check if content needs truncation
  const needsTruncation = (): boolean => {
    if (!maxLength || !showReadMore) return false;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitizedHTML;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    return textContent.length > maxLength;
  };

  return (
    <div className={className}>
      <div 
        dangerouslySetInnerHTML={{ __html: getDisplayContent() }}
        style={{
          lineHeight: '1.6',
          color: '#333',
        }}
      />
      
      {needsTruncation() && (
        <button
          type="button"
          className="btn btn-link p-0 mt-2 text-primary"
          style={{ textDecoration: 'none', fontSize: '0.9rem' }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default CommonDescription;