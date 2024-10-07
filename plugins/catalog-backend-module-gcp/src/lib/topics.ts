import { google, pubsub_v1 } from "googleapis";

const pubsubApi = google.pubsub('v1');

export async function listPubSubTopics(project: string) {
    const client = await google.auth.getClient({
        scopes: [
            'https://www.googleapis.com/auth/cloud-platform',
        ]
    });

    const request: pubsub_v1.Params$Resource$Projects$Topics$List = {
        project: `projects/${project}`,
        auth: client,
    };

    const topics: pubsub_v1.Schema$Topic[] = [];
    do {
        const response = await pubsubApi.projects.topics.list(request);
        if (!response) return [];
        const result = response.data;

        const itemsPage = result.topics;
        if (!itemsPage) {
            return [];
        }
        topics.push(...itemsPage);
        request.pageToken = result.nextPageToken ?? undefined;
    } while (request.pageToken);

    return topics;
}
