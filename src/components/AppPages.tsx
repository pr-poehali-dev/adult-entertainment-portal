import { AppPagesProps } from './AppPagesTypes';
import { renderPage } from './AppPagesRenderer';

export const useAppPages = (props: AppPagesProps) => {
  return { 
    renderPage: () => renderPage(props) 
  };
};
