import { GoogleProjectLocator, getProjectLocator } from "../project-locator";
import {
    GooglePubSubTopicResourceTransformer,
    defaultPubSubTopicResourceTransformer
} from "../transformers/defaultResourceTransformer";
import {
    TaskScheduleDefinition,
    readTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-tasks';

import { Config } from "@backstage/config";

export type GooglePubSubTopicEntityProviderConfig = {
    id: string;
    projectLocator: GoogleProjectLocator;
    ownerLabel: string;
    componentLabel: string;
    resourceType: string;
    resourceTransformer: GooglePubSubTopicResourceTransformer;
    schedule: TaskScheduleDefinition;
    disabled: boolean;
}

export function readProviderConfigs(options: {
    config: Config,
    resourceTransformer?: GooglePubSubTopicResourceTransformer
}): GooglePubSubTopicEntityProviderConfig[] {

    const providersConfig = options.config.getOptionalConfigArray('catalog.providers.gcp');
    if (!providersConfig) {
        return [];
    }

    return providersConfig
        .map(config => readProviderConfig(config, options.resourceTransformer))
        .filter(provider => !provider.disabled);
}

export function readProviderConfig(
    config: Config,
    resourceTransformer?: GooglePubSubTopicResourceTransformer
): GooglePubSubTopicEntityProviderConfig {
    // when project is not defined, default to 'organization'
    const id = config.getOptionalString("project") ?? 'organization';
    const ownerLabel = config.getOptionalString('ownerLabel') ?? 'owner';
    const componentLabel = config.getOptionalString('componentLabel') ?? 'component';
    const resourceType = config.getOptionalString('pubsub.resourceType') ?? 'Pub/Sub Topic';
    const disabled = config.getOptionalBoolean('pubsub.disabled') || false;

    const schedule = readTaskScheduleDefinitionFromConfig(config.getConfig('schedule'));

    return {
        id,
        ownerLabel,
        componentLabel,
        resourceType,
        projectLocator: getProjectLocator(config),
        resourceTransformer: resourceTransformer ?? defaultPubSubTopicResourceTransformer,
        schedule,
        disabled
    };
}