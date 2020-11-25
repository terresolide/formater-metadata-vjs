/**
 * UNUSED KEYCLOAK
 */
import Keycloak  from 'keycloak-js'

export default function makeAuth(auth) {
  if (auth && process.env && process.env.SSO_URL) {
    var keycloak = Keycloak({
      url: process.env.SSO_URL,
      realm: process.env.SSO_REALM,
      clientId: process.env.SSO_CLIENT_ID
    })
    return keycloak
  } else {
    return null
  }
}

