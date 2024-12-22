## Initialisation de l'API

Pour communiquer avec l'API, il est essentiel de passer par une phase d'initialisation. Cela se fait en effectuant une requête POST vers le endpoint suivant :

### Endpoint d'initialisation

**URL :** `/api/session/init`\
**Méthode :** POST\
**Corps de la requête :** Un objet JSON contenant la clé publique RSA du client, comme dans l'exemple suivant :

```json
{
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmpoShmPBV3G3kLKmNW2D\nF0Zk4dvZ3cglANPcPEpD8FUlsETgQ8U9EfCCDTKgcNQGHbEB6zvjpkxtfNAeWM1C\nCqTgmEmLcZoaC0misw7efl+xzeN49fSs+0cotU/D4taaCz59Yoy08D1O5k7UADKa\nPilXq8ugJdwydNJZCWixjYDLi87uaRRB79AvLYjY8hHcw2y7zTwzr3C5GvmhcFWc\nkNmTLEP7UG9Hmay8PsGHvHBDStyoGzFLSnaNNnprDVflXLynkuWpilh008jv1+Et\n6xY9D53SBxmXKdprMVZmBhdY1G7WEn0VdDUHi1yaMU9jY9aObmu8Rbl1yGaoSeUm\nxwIDAQAB\n-----END PUBLIC KEY-----"
}
```

## Retour du endpoint

Le endpoint retourne un objet JSON contenant les informations suivantes :

- **token** : Un identifiant unique de session pour l'utilisateur. Ce token doit être utilisé pour toutes les requêtes sécurisées ultérieures.
- **apiPublicKey** : La clé publique RSA de l'API, utilisée pour établir une communication sécurisée.

### Exemple de retour

```json
{
  "token": "session_id",
  "apiPublicKey": "clé_publique_api"
}
```

## Exemple de requête

```bash
curl -X POST http://localhost:8870/api/session/init \
  -H "Content-Type: application/json" \
  -d '{
    "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmpoShmPBV3G3kLKmNW2D\nF0Zk4dvZ3cglANPcPEpD8FUlsETgQ8U9EfCCDTKgcNQGHbEB6zvjpkxtfNAeWM1C\nCqTgmEmLcZoaC0misw7efl+xzeN49fSs+0cotU/D4taaCz59Yoy08D1O5k7UADKa\nPilXq8ugJdwydNJZCWixjYDLi87uaRRB79AvLYjY8hHcw2y7zTwzr3C5GvmhcFWc\nkNmTLEP7UG9Hmay8PsGHvHBDStyoGzFLSnaNNnprDVflXLynkuWpilh008jv1+Et\n6xY9D53SBxmXKdprMVZmBhdY1G7WEn0VdDUHi1yaMU9jY9aObmu8Rbl1yGaoSeUm\nxwIDAQAB\n-----END PUBLIC KEY-----"
  }'
```
