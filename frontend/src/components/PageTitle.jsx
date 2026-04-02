import { useEffect } from 'react';

/**
 * PageTitle – reusable component that updates the browser tab title.
 *
 * Usage:
 *   <PageTitle title="About Us - IFTIINHUB" />
 */
const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = title;
    // Restore a default title when the component unmounts (optional)
    return () => {
      document.title = 'IFTIINHUB';
    };
  }, [title]);

  return null; // renders nothing in the DOM
};

export default PageTitle;
