# Innov Events — WordPress via Vercel Proxy

Le site conserve son frontend HTML/CSS/JS. WordPress sert uniquement de CMS pour les articles.

## Flux

Navigateur → Vercel `/api/posts` → WordPress REST API → Vercel → Navigateur

Le navigateur ne contacte plus directement InfinityFree, ce qui évite le blocage CORS rencontré avec l’hébergement WordPress.

## WordPress

CMS : `https://innov-events.free.nf`

API source : `https://innov-events.free.nf/wp-json/wp/v2/posts`

## Vercel

La fonction `api/posts.js` transmet les paramètres à WordPress et renvoie sa réponse.

Le frontend utilise :
`https://innov-events-swart.vercel.app/api/posts`

## Publication

Dans WordPress : Articles → Ajouter → publier. Le nouvel article est ensuite récupéré automatiquement par `blog.html`.

## Important

Le plugin CORS WordPress n’est plus nécessaire pour cette architecture. Il peut être désactivé après validation du proxy.
