## Connexion à l'API

Une fois la session initialisée, vous pouvez vous connecter à l'API pour authentifier un utilisateur en utilisant le endpoint suivant :

### Endpoint de connexion

**URL :** `/api/session/login`\
**Méthode :** POST

**Corps de la requête :** Un objet JSON contenant les informations suivantes :

- **token** : Le token reçu lors de l'initialisation de la session.
- **email** : L'adresse email de l'utilisateur.
- **password** : Un objet contenant le mot de passe crypté avec la clé publique du serveur.
- **password** : Le mot de passe de l'utilisateur.

Exemple :

```json
{
  "email": "email",
  "password": { "_RSA_ENCODED_": "mot_de_passe" }
}
```

## Retour du endpoint de connexion

Le endpoint retourne un objet JSON contenant uniquement l'identifiant de la session.

### Exemple de retour

```json
{
  "sessionId": "unique_session_id"
}
```

## Exemple de requête

```bash
curl -X POST http://localhost:8870/api/session/login \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer session_id" \
  -d '{
    "email": "email",
    "password": { "_RSA_ENCODED_": "mot_de_passe" }
  }'
```
