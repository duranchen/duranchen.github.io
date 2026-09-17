{# Google Analytics — rewritten to gtag.js so GA4 (G- ids) works.
   The stock NexT 5.0.1 body used analytics.js + ga('create', ...), which only speaks
   Universal Analytics; that property stopped receiving data long ago and the library
   itself is retired. gtag.js accepts both G- (GA4) and UA- ids, so a single snippet
   serves either kind of id — no branching needed.

   Deliberately no cookie_domain: the site is served from blog.duranc.cc, which config.url
   now matches, so leaving cookie_domain out lets GA default to the real hostname.
   (Previously config.url was https://duranchen.github.io; hardcoding that host would have
   placed _ga on the wrong domain and silently lost every visit.) #}
{% if theme.google_analytics %}
<script async src="https://www.googletagmanager.com/gtag/js?id={{ theme.google_analytics }}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '{{ theme.google_analytics }}');
</script>
{% endif %}
