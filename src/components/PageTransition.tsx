import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  pageKey: string;
}

const PageTransition = ({ children, pageKey }: PageTransitionProps) => {
  const [displayContent, setDisplayContent] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    
    const exitTimer = setTimeout(() => {
      setDisplayContent(children);
      setIsTransitioning(false);
    }, 150);

    return () => {
      clearTimeout(exitTimer);
    };
  }, [pageKey, children]);

  return (
    <div
      className={`transition-opacity duration-300 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {displayContent}
    </div>
  );
};

export default PageTransition;
