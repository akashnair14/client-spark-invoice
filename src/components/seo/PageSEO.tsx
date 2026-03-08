import { useEffect } from "react";

interface PageSEOProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  robots?: string;
  ogImage?: string;
  ogType?: string;
}

const PageSEO = ({ title, description, canonicalUrl, robots, ogImage, ogType = "website" }: PageSEOProps) => {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, true);
    }
    if (title) {
      setMeta("og:title", title, true);
    }
    setMeta("og:type", ogType, true);
    if (canonicalUrl) {
      setMeta("og:url", canonicalUrl, true);
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
    }
    if (ogImage) setMeta("og:image", ogImage, true);
    if (robots) setMeta("robots", robots);
  }, [title, description, canonicalUrl, robots, ogImage, ogType]);

  return null;
};

export default PageSEO;
