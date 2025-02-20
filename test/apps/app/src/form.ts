/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 
 * See the License for the specific language governing permissions and limitations under the License.
 */


/* eslint-disable max-statements */
/* eslint-disable complexity */
/* eslint-disable max-len */
import { flattenConfig, Config } from './config';
import { FormDataEvent } from './types';
import { htmlString } from './util';

const id = 'config-form';
const Form = `
  <form id="${id}" method="GET" onsubmit="onSubmitForm(event)" onformdata="onFormData(event)">
  <label for="issuer">Issuer</label><input id="f_issuer" name="issuer" type="text" /><br/>
  <label for="clientId">Client ID</label><input id="f_clientId" name="clientId" type="text" /><br/>
  <label for="clientSecret">Client Secret</label><input id="f_clientSecret" name="clientSecret" type="text" /><br/>
  <label for="responseType">Response Type (comma separated)</label><input id="f_responseType" name="responseType" type="text" /><br/>
  <label for="defaultScopes">Use DEFAULT scopes (defined by authorization server)</label><br/>
  <input id="f_default-scopes-yes" name="defaultScopes" type="radio" value="true"/>YES<br/>
  <input id="f_default-scopes-no" name="defaultScopes" type="radio" value="false"/>NO (list scopes below)<br/>
  <label for="scopes">Scopes (comma separated)</label><input id="f_scopes" name="scopes" type="text" /><br/>
  <label for="redirectUri">Redirect URI</label><input id="f_redirectUri" name="redirectUri" type="text" /><br/>
  <label for="postLogoutRedirectUri">Post Logout Redirect URI</label><input id="f_postLogoutRedirectUri" name="postLogoutRedirectUri" type="text" /><br/>
  <label for="responseMode">Response Mode</label>
  <select id="f_responseMode" name="responseMode">
    <option value="" selected>Auto</option>
    <option value="fragment">Fragment</option>
    <option value="query">Query</option>
  </select><br/>
  <label for="pkce">PKCE</label><br/>
  <input id="f_pkce-on" name="pkce" type="radio" value="true"/>ON<br/>
  <input id="f_pkce-off" name="pkce" type="radio" value="false"/>OFF<br/>
  <label for="storage">Storage</label>
  <select id="f_storage" name="storage">
    <option value="" selected>Auto</option>
    <option value="localStorage">Local Storage</option>
    <option value="sessionStorage">Session Storage</option>
    <option value="cookie">Cookie</option>
    <option value="memory">Memory</option>
  </select><br/>
  <label for="enableSharedStorage">Enable shared transaction storage (to continue flow in another tab)</label><br/>
  <input id="f_enableSharedStorage-on" name="enableSharedStorage" type="radio" value="true"/>YES<br/>
  <input id="f_enableSharedStorage-off" name="enableSharedStorage" type="radio" value="false"/>NO<br/>
  <label for="expireEarlySeconds">ExpireEarlySeconds</label><input id="f_expireEarlySeconds" name="expireEarlySeconds" type="number" /><br/>
  <label for="secure">Secure Cookies</label><br/>
  <input id="f_secureCookies-on" name="secure" type="radio" value="true"/>ON<br/>
  <input id="f_secureCookies-off" name="secure" type="radio" value="false"/>OFF<br/>
  <label for="sameSite">SameSite</label>
  <select id="f_sameSite" name="sameSite">
    <option value="" selected>Auto</option>
    <option value="none">None</option>
    <option value="lax">Lax</option>
    <option value="strict">Strict</option>
  </select><br/>
  <label for="siwVersion">Sign-in Widget version (leave blank for bundled version)</label><input id="f_siwVersion" name="siwVersion" type="text" /><br/>
  <label for="siwAuthClient">Use authClient option? (requires widget version >= 5.3)</label><br/>
  <input id="f_authClient-on" name="f_siwAuthClient" type="radio" value="true"/>YES (inject current instance)<br/>
  <input id="f_authClient-off" name="f_siwAuthClient" type="radio" value="false"/>NO (use widget bundled auth-js)<br/>

  <label for="forceRedirect">Force redirect (for SPA applications)?</label><br/>
  <input id="f_forceRedirect-on" name="forceRedirect" type="radio" value="true"/>YES<br/>
  <input id="f_forceRedirect-off" name="forceRedirect" type="radio" value="false"/>NO<br/>
  <label for="useInteractionCodeFlow">Use <strong>interaction_code</strong> grant (in signin widget flow)</label><br/>
  <input id="f_useInteractionCodeFlow-on" name="useInteractionCodeFlow" type="radio" value="true"/>YES<br/>
  <input id="f_useInteractionCodeFlow-off" name="useInteractionCodeFlow" type="radio" value="false"/>NO<br/>
  <label for="idps">IDPs (in format "type:id" space-separated, example: "Facebook:111aaa Google:222bbb")</label>
  <input id="f_idps" name="idps" type="text" /><br/>
  <hr/>
  <input id="f_submit" type="submit" value="Update Config"/>
  </form>
`;

export { Form };

export function updateForm(origConfig: Config): void {
  const config = flattenConfig(origConfig);
  (document.getElementById('f_issuer') as HTMLInputElement).value = config.issuer;
  (document.getElementById('f_redirectUri') as HTMLInputElement).value = config.redirectUri;
  (document.getElementById('f_responseType') as HTMLInputElement).value = config.responseType.join(',');
  (document.getElementById('f_scopes') as HTMLInputElement).value = config.scopes.join(',');
  (document.getElementById('f_postLogoutRedirectUri') as HTMLInputElement).value = config.postLogoutRedirectUri;
  (document.getElementById('f_clientId') as HTMLInputElement).value = config.clientId;
  (document.getElementById('f_clientSecret') as HTMLInputElement).value = config.clientSecret;
  (document.querySelector(`#f_responseMode [value="${config.responseMode || ''}"]`) as HTMLOptionElement).selected = true;
  (document.querySelector(`#f_storage [value="${config.storage || ''}"]`) as HTMLOptionElement).selected = true;
  (document.getElementById('f_expireEarlySeconds') as HTMLInputElement).value = config.expireEarlySeconds;
  (document.querySelector(`#f_sameSite [value="${config.sameSite || ''}"]`) as HTMLOptionElement).selected = true;
  (document.getElementById('f_siwVersion') as HTMLInputElement).value = config.siwVersion;
  (document.getElementById('f_idps') as HTMLInputElement).value = config.idps;

  if (config.pkce) {
    (document.getElementById('f_pkce-on') as HTMLInputElement).checked = true;
  } else {
    (document.getElementById('f_pkce-off') as HTMLInputElement).checked = true;
  }

  if (config.secure) {
    (document.getElementById('f_secureCookies-on') as HTMLInputElement).checked = true;
  } else {
    (document.getElementById('f_secureCookies-off') as HTMLInputElement).checked = true;
  }

  if (config.defaultScopes) {
    (document.getElementById('f_default-scopes-yes') as HTMLInputElement).checked = true;
    (document.getElementById('f_scopes') as HTMLInputElement).disabled = true;
  } else {
    (document.getElementById('f_default-scopes-no') as HTMLInputElement).checked = true;
    (document.getElementById('f_scopes') as HTMLInputElement).disabled = false;
  }

  if (config.useInteractionCodeFlow) {
    (document.getElementById('f_useInteractionCodeFlow-on') as HTMLInputElement).checked = true;
  } else {
    (document.getElementById('f_useInteractionCodeFlow-off') as HTMLInputElement).checked = true;
  }

  if (config.forceRedirect) {
    (document.getElementById('f_forceRedirect-on') as HTMLInputElement).checked = true;
  } else {
    (document.getElementById('f_forceRedirect-off') as HTMLInputElement).checked = true;
  }

  if (config.siwAuthClient) {
    (document.getElementById('f_authClient-on') as HTMLInputElement).checked = true;
  } else {
    (document.getElementById('f_authClient-off') as HTMLInputElement).checked = true;
  }

  if (config.enableSharedStorage) {
    (document.getElementById('f_enableSharedStorage-on') as HTMLInputElement).checked = true;
  } else {
    (document.getElementById('f_enableSharedStorage-off') as HTMLInputElement).checked = true;
  }
}

// Keeps us in the same tab
export function onSubmitForm(event: Event): void {
  event.preventDefault();
  // eslint-disable-next-line no-new
  new FormData(document.getElementById(id) as HTMLFormElement); // will fire formdata event
}

// Take the data from the form and update query parameters on the current page
export function onFormData(event: FormDataEvent): void {
  const formData = event.formData;
  const params: any = {};
  formData.forEach((value, key) => {
    params[key] = value;
  });
  const query = '?' + Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`).join('&');
  const newUri = window.location.origin + '/' + query;
  window.location.replace(newUri);
}

export function showConfigForm(config: Config): void {
  let el = document.getElementById('config-area');
  if (el) {
    el.remove();
    return; // act as a toggle
  }
  el = document.createElement('DIV');
  document.body.appendChild(el);
  el.innerHTML = `
    <div id="config-area" class="flex-row">
      <div id="form-content" class="box">${Form}</div>
      <div id="config-dump" class="box"></div>
    </div>
  `;

  updateForm(config);
  document.getElementById('config-dump').innerHTML = `
    <h2>Config</h2>
    ${ htmlString(config) }
  `;
}
