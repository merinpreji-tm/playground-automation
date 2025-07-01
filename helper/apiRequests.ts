import { expect, request, test } from "@playwright/test";
import fs from 'fs';
import path from 'path';
import * as apiCodes from "../testAssets/test-data/apiCodes.json";
import TokenManager from "./TokenManager";


class ApiRequests {

    static async getAPI(endpoint, statusAndFormatCheck = true, token?: string) {
        const access_token = token || await TokenManager.loadAuthToken();
        const before = performance.now()
        const response = await (await request.newContext()).get(endpoint, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        });
        const after = performance.now();
        const timeTaken = after - before;
        // console.log("Time taken for GET API call is ============>>>> ", timeTaken);

        const statusCode = response.status();
        const statusText = response.statusText();
        if (statusAndFormatCheck) {
            expect(statusCode, 'Status code should be').toBe(apiCodes.getStatusCodePass);
            expect(statusText, 'Status text should be').toBe(apiCodes.getStatusTextPass);
        }

        // Verify that the content type and response body is JSON
        if (statusAndFormatCheck) {
            // Validate that the 'Content-Type' header has the expected value
            const contentTypeHeader: string | undefined = response.headers()['content-type'];
            expect(contentTypeHeader, 'Content type should be').toBeDefined();
            expect(contentTypeHeader, 'Content type should contain').toContain('application/json');

            // Validate that the response body is Parsed JSON using Jest
            const responseBodyBuffer = await response.body(); // Get the response body as a Buffer
            const responseBody = responseBodyBuffer.toString('utf-8'); // Convert Buffer to a UTF-8 encoded string
            const responseJson: object = JSON.parse(responseBody); // Parse the string as JSON

            // Expectations for the Parsed JSON
            expect(responseJson, 'Response should be a valid JSON').toBeDefined();
            expect(responseJson, 'Response should be an object').toBeInstanceOf(Object);
        }

        return [response, timeTaken];
    }

    static async postAPI(endpoint, body?: object, statusAndFormatCheck = true, token?: string) {
        const access_token = token || await TokenManager.loadAuthToken();
        const before = performance.now()
        const response = await (await request.newContext()).post(endpoint, {
            data: body
            , headers: {
                "Authorization": `Bearer ${access_token}`
            }
        });
        const after = performance.now();
        const timeTaken = after - before;
        // console.log("Time taken for GET API call is ============>>>> ", timeTaken);

        const statusCode = response.status();
        const statusText = response.statusText();
        if (statusAndFormatCheck) {
            expect(statusCode, 'Status code should be').toBe(apiCodes.postStatusCodePass);
            expect(statusText, 'Status text should be ').toBe(apiCodes.postStatusTextPass)
        }

        if (statusAndFormatCheck) {
            const contentTypeHeader: string | undefined = response.headers()['content-type'];
            expect(contentTypeHeader, 'Content type should be').toBeDefined();
            expect(contentTypeHeader, 'Content type should contain').toContain('application/json');

            const responseBodyBuffer = await response.body();
            const responseBody = responseBodyBuffer.toString('utf-8');
            const responseJson: object = JSON.parse(responseBody);

            expect(responseJson, 'Response should be a valid JSON').toBeDefined();
            expect(responseJson, 'Response should be an object').toBeInstanceOf(Object);
        }

        return [response, timeTaken];
    }

    static async putAPI(endpoint, body?: object, statusAndFormatCheck = true, token?: string) {
        const access_token = token || await TokenManager.loadAuthToken();
        const before = performance.now()
        const response = await (await request.newContext()).put(endpoint, {
            data: body
            , headers: {
                "Authorization": `Bearer ${access_token}`
            }
        });
        const after = performance.now();
        const timeTaken = after - before;
        // console.log("Time taken for GET API call is ============>>>> ", timeTaken);

        const statusCode = response.status();
        const statusText = response.statusText();
        if (statusAndFormatCheck) {
            expect(statusCode, 'Status code should be').toBe(apiCodes.putStatusCodePass);
            expect(statusText, 'Status text should be').toBe(apiCodes.putStatusTextPass);
        }

        if (statusAndFormatCheck) {
            const contentTypeHeader: string | undefined = response.headers()['content-type'];
            expect(contentTypeHeader, 'Content type should be').toBeDefined();
            expect(contentTypeHeader, 'Content type should contain').toContain('application/json');

            const responseBodyBuffer = await response.body();
            const responseBody = responseBodyBuffer.toString('utf-8');
            const responseJson: object = JSON.parse(responseBody);

            expect(responseJson, 'Response should be a valid JSON').toBeDefined();
            expect(responseJson, 'Response should be an object').toBeInstanceOf(Object);
        }

        return [response, timeTaken];
    }


    static async deleteAPI(endpoint, statusAndFormatCheck = true, token?: string) {
        const access_token = token || await TokenManager.loadAuthToken();
        const before = performance.now()
        const response = await (await request.newContext()).delete(endpoint, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        });
        const after = performance.now();
        const timeTaken = after - before;
        // console.log("Time taken for DELETE API call is ============>>>> ", timeTaken);

        const statusCode = response.status();
        const statusText = response.statusText();

        if (statusAndFormatCheck) {
            expect(statusCode, 'Status code should be').toBe(apiCodes.deleteStatusCodePass);
            expect(statusText, 'Status text should be').toBe(apiCodes.deleteStatusTextPass);
        }

        if (statusAndFormatCheck) {
            const contentTypeHeader: string | undefined = response.headers()['content-type'];
            expect(contentTypeHeader, 'Content type should be').toBeDefined();
            expect(contentTypeHeader, 'Content type should contain').toContain('application/json');

            const responseBodyBuffer = await response.body();
            const responseBody = responseBodyBuffer.toString('utf-8');
            const responseJson: object = JSON.parse(responseBody);

            expect(responseJson, 'Response should be a valid JSON').toBeDefined();
            expect(responseJson, 'Response should be an object').toBeInstanceOf(Object);
        }

        return [response, timeTaken];
    }


}

export const getAPI = ApiRequests.getAPI;
export const postAPI = ApiRequests.postAPI;
export const putAPI = ApiRequests.putAPI;
export const deleteAPI = ApiRequests.deleteAPI;