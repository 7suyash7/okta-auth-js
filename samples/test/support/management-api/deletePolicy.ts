import { Client, AuthorizationServerPolicy } from '@okta/okta-sdk-nodejs';
import { getConfig } from '../../util/configUtils';
import addAppToPolicy from './addAppToPolicy';

interface ProfileEnrollmentPolicy extends AuthorizationServerPolicy {
  default: boolean;
}

export default async function (policyNamePrefix: string, policyType: string) {
  const config = getConfig();
  const oktaClient = new Client({
    orgUrl: config.orgUrl,
    token: config.oktaAPIKey
  });

  try {
    const policies = [];
    for await (let policy of oktaClient.listPolicies({type: policyType})) {
      policies.push(policy);
    }

    const defaultPolicy = policies.find(policy => (policy as ProfileEnrollmentPolicy).default);
    const testPolicies = policies.filter(policy => policy && policy.name.startsWith(policyNamePrefix));

    if (policyType === 'Okta:ProfileEnrollment') {
      // assign app to default policy first
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await addAppToPolicy(defaultPolicy!.id, config.clientId!);
    }

    for (let policy of testPolicies) {
      if (policy) {
        await oktaClient.deletePolicy(policy.id);
      }
    }

  } catch (e) {
    console.warn('Unable to delete test case policy:', policyNamePrefix, policyType);
    throw e;
  }
}
