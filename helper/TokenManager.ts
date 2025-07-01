import { request } from "playwright";
import { expect } from "playwright/test";
import * as env from "../testAssets/test-data/env-test.json"
import fs from 'fs'

export default class TokenManager {
  private static authToken: string | null = null;

  public static async loadAuthToken() {
    if (!TokenManager.authToken) {
      // Load the auth token
      console.log("Token was not loaded earlier and trying to read from the auth token file");
      try {
        const responseBody = await fs.readFileSync('auth-token.json', 'utf-8');
        const tokenData = await JSON.parse(responseBody);
        const token = tokenData.access_token;
        TokenManager.authToken = token;
        console.log("access_token is ", TokenManager.authToken);
        return token;
      } catch (error) {
        console.log("Error: Token was not found in the auth token file, generating the token by calling API");
        TokenManager.authToken = await this.fetchAuthToken();
      }
    }
    return TokenManager.authToken;
  }

  public static getAuthToken(): string | null {
    return TokenManager.authToken;
  }

  public static async loadInvalidAuthToken(): Promise<string> {
    // Load the invalid auth token
    const invalidAuthToken = await fetchInvalidAuthToken();
    return invalidAuthToken;
  }


  static async fetchAuthToken(): Promise<string> {
    let authResponse = await (await request.newContext()).post(`/oauth/token?client_id=${env.userName}&client_secret=${env.password}&grant_type=client_credentials`, {
      data: {}
    });
    let authResponseBody;
    try {
      expect(authResponse.status()).toBe(200);
      authResponseBody = await authResponse.json();
    } catch (error) {
      authResponse = await (await request.newContext()).post(`/oauth/token?client_id=${env.userName}&client_secret=${env.password}&grant_type=client_credentials`, {
        data: {}
      });
      authResponseBody = await authResponse.json();
    }
    console.log(await authResponse.json());
    const access_token = authResponseBody.access_token
    fs.writeFileSync('auth-token.json', JSON.stringify({ access_token }));
    return access_token;
  }

}


async function fetchInvalidAuthToken() {
  const authResponse = await (await request.newContext()).post(`/oauth/token?client_id=invalidClientId&client_secret=invalidClientSecret&grant_type=client_credentials`, {
    data: {}
  });
  let authResponseBody;
  try {
    expect(authResponse.status(), 'Expecting status code 401 for invalid credentials').toBe(401);
    expect(authResponse.statusText(), 'Expecting status text unauthorized for invalid credentials').toBe("Unauthorized");
    authResponseBody = await authResponse.json();
  } catch (error) {
    console.log("Failed to fetch invalid auth token: ", error);
  }
  return authResponseBody;
}
