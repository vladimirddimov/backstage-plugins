import { google, pubsub_v1 } from "googleapis";

const pubsubApi = google.pubsub('v1');

export async function listPubSubSubscriptions(project: string) {
    const client = await google.auth.getClient({
        scopes: [
            'https://www.googleapis.com/auth/cloud-platform',
        ]
    });

    const request: pubsub_v1.Params$Resource$Projects$Subscriptions$List = {
        project: `projects/${project}`,
        auth: client,
    };

    const subscriptions: pubsub_v1.Schema$Subscription[] = [];
    do {
        const response = await pubsubApi.projects.subscriptions.list(request);
        if (!response) return [];
        const result = response.data;

        const itemsPage = result.subscriptions;
        if (!itemsPage) {
            return [];
        }
        subscriptions.push(...itemsPage);
        request.pageToken = result.nextPageToken ?? undefined;
    } while (request.pageToken);

    return subscriptions;
}
