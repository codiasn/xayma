## Inscription à l'API

Ce endpoint permet de créer un nouvel utilisateur dans le système en fournissant les informations nécessaires à l'inscription.

### Endpoint d'inscription

**URL :** `/api/session/register`  
**Méthode :** POST  
**Corps de la requête :** Un objet JSON contenant les informations suivantes :

- **email** : L'adresse email unique de l'utilisateur.
- **firstName** : Le prénom de l'utilisateur.
- **lastName** : Le nom de famille de l'utilisateur.
- **password** : Un objet contenant le mot de passe crypté avec la clé publique du serveur.

Exemple :

```json
{
  "email": "email",
  "firstName": "first name",
  "lastName": "last name",
  "password": { "_RSA_ENCODED_": "mot_de_passe" }
}
```

## Retour du endpoint d'inscription

Le endpoint retourne un objet JSON vide. En parallèle, un email contenant un lien de vérification sera envoyé à l'adresse fournie pour confirmer l'identité de l'utilisateur.

## Exemple de requête

```bash
curl -X POST http://localhost:8870/api/session/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email",
    "firstName": "first name",
    "lastName": "last name",
    "password": { "_RSA_ENCODED_": "mot_de_passe" }
  }'
```
