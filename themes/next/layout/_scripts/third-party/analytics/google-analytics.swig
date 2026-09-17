{# Google Analytics — rewritten to gtag.js so GA4 (G- ids) works.
   The stock NexT 5.0.1 body used analytics.js + ga('create', ...), which only speaks
   Universal Analytics; that property stopped receiving data long ago and the library
   itself is retired. gtag.js accepts both G- (GA4) and UA- ids, so a single snippet
   serves either kind of id — no branching needed.

   Deliberately no cookie_domain: config.url is https://duranchen.github.io but the site
   is actually served from blog.duranc.cc, so hardcoding that host would place _ga on the
   wrong domain and silently lose every visit. Leaving it out lets GA default to the real
   hostname. #}
{% if theme.google_analytics %}
<script async src="https://www.googletagmanager.com/gtag/js?id={{ theme.google_analytics }}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '{{ theme.google_analytics }}');
</script>
{% endif %}
