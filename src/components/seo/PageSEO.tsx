import { useEffect } from "react";

interface PageSEOProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  robots?: string;
}

const PageSEO = ({ title, description, canonicalUrl, robots }: PageSEOProps) => {
  useEffect(() => {
    // Title
    if (title) document.title = title;

    // Meta description
    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description;
    }

    // Robots
    if (robots) {
      let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.name = 'robots';
        document.head.appendChild(metaRobots);
      }
      metaRobots.content = robots;
    }

    // Canonical link
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
    }
  }, [title, description, canonicalUrl, robots]);

  return null;
};

export default PageSEO;
