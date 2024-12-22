### Confirmation de l'identité

Ce endpoint confirme l'identité de l'utilisateur via un lien envoyé par email.

**URL :** `/api/session/confirm-identity?token=token`\
**Méthode :** POST\
**Query Parameter :**

- **token** : Le token de vérification envoyé par email.

**Retour :** Confirmation de l'identité de l'utilisateur ou une erreur si l'utilisateur n'est pas trouvé.

```json
{
  "id": "session_id"
}
```

---

### Déconnexion

Ce endpoint permet de déconnecter l'utilisateur.

**URL :** `/api/session/logout`\
**Méthode :** POST

**Retour :** Confirmation de la déconnexion.

```json
{
  "id": "session_id"
}
```

---

### Demande de réinitialisation de mot de passe

Ce endpoint envoie un email contenant un lien pour réinitialiser le mot de passe.

**URL :** `/api/session/request-reset-password`\
**Méthode :** POST\
**Corps de la requête :**

```json
{
  "email": "email"
}
```

**Retour :** Confirmation de l'envoi de l'email.

```json
{}
```

---

### Réinitialisation de mot de passe

Ce endpoint permet de réinitialiser le mot de passe de l'utilisateur à l'aide du token envoyé par email.

**URL :** `/api/session/reset-password`\
**Méthode :** POST\
**Corps de la requête :**

```json
{
  "token": "reset_token",
  "newPassword": { "_RSA_ENCODED_": "nouveau_mot_de_passe" }
}
```

**Retour :** Confirmation de la réinitialisation du mot de passe.

```json
{}
```
