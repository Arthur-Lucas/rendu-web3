import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { LetterWrapper } from './letterWrapper';

export const WordWrapper = ({
  title = '',
  wordClassName,
  spaceClassName,
  letterWrapper = false,
}) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (letterWrapper && containerRef.current) {
      const h1Spans = Array.from(containerRef.current.querySelectorAll('span.letter'));
  
      if (!h1Spans.length) return;

      gsap.set(h1Spans, { y: '-100%' });
  
      const timeline = gsap.timeline({ paused: true });
  
      h1Spans.forEach((span, index) => {
        timeline.to(span, {
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        }, index * 0.02);
      });
  
      // Play timeline after a short delay (or immediately)
      const timeout = setTimeout(() => timeline.play(), 700);
  
      return () => clearTimeout(timeout);
    }
  }, [letterWrapper, title]);
  

  return (
    <div ref={containerRef}>
      {title.split(' ').map((word, index) => (
        <span key={index} className={wordClassName || 'word'}>
          {letterWrapper ? (
            <LetterWrapper title={word} spaceClassName={spaceClassName} />
          ) : (
            word
          )}
        </span>
      ))}
    </div>
  );
};
