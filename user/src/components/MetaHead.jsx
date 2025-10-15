import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

const MetaHead = ({ title, description, keywords, noIndex = false }) => {
  const location = useLocation();
  const canonicalUrl = `https://client.jaazmarkets.com${location.pathname}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default MetaHead;
