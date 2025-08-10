import { useEffect } from "react";

interface PageSEOProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
}

const PageSEO = ({ title, description, canonicalUrl }: PageSEOProps) => {
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
  }, [title, description, canonicalUrl]);

  return null;
};

export default PageSEO;
