/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-36b4d269'], (function (workbox) { 'use strict';

  self.skipWaiting();

  workbox.clientsClaim();


  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([
    {
      "url": "/static/06113bf748ae7dc33e05.ttf",
      "revision": null
    },
    {
      "url": "/static/06ec231708e211549615.svg",
      "revision": null
    },
    {
      "url": "/static/120f91ca1cfeced5a5ac.otf",
      "revision": null
    },
    {
      "url": "/static/12a0cb0157ced8a34060.png",
      "revision": null
    },
    {
      "url": "/static/1491bd436428e36b6527.png",
      "revision": null
    },
    {
      "url": "/static/1ec97508beb219d45140.png",
      "revision": null
    },
    {
      "url": "/static/22609d28e9c5bac5f9b6.png",
      "revision": null
    },
    {
      "url": "/static/29c57b05b7345f94042a.ttf",
      "revision": null
    },
    {
      "url": "/static/2f1b13834121410af5ef.otf",
      "revision": null
    },
    {
      "url": "/static/30357e2d1dc7b24a622c.svg",
      "revision": null
    },
    {
      "url": "/static/3a52f62a222cd05a32f5.png",
      "revision": null
    },
    {
      "url": "/static/3a7c914cbc8035135c38.otf",
      "revision": null
    },
    {
      "url": "/static/3bdb2f8f76c523bcc42f.svg",
      "revision": null
    },
    {
      "url": "/static/3dc31b1b0cbe0c9c5dc6.svg",
      "revision": null
    },
    {
      "url": "/static/3e770b49cbf5601aae28.svg",
      "revision": null
    },
    {
      "url": "/static/4640c17c101893e2a880.png",
      "revision": null
    },
    {
      "url": "/static/48560e4cccda7b534cb9.svg",
      "revision": null
    },
    {
      "url": "/static/4bed49edb0d25371f244.svg",
      "revision": null
    },
    {
      "url": "/static/4c5489d496361556108c.svg",
      "revision": null
    },
    {
      "url": "/static/505f0a80bb4b37d9cd5d.svg",
      "revision": null
    },
    {
      "url": "/static/53156c585a42e6a1382d.otf",
      "revision": null
    },
    {
      "url": "/static/5e318cad4dbd7492d2dd.svg",
      "revision": null
    },
    {
      "url": "/static/5eb61d0303ad620d278e.svg",
      "revision": null
    },
    {
      "url": "/static/6284097d7c1293097702.png",
      "revision": null
    },
    {
      "url": "/static/62f91ee71f9428d8754f.svg",
      "revision": null
    },
    {
      "url": "/static/65ca38c41a4d8f8fc5b8.svg",
      "revision": null
    },
    {
      "url": "/static/6e08bfae676553b79274.svg",
      "revision": null
    },
    {
      "url": "/static/783bfe300844d88399aa.svg",
      "revision": null
    },
    {
      "url": "/static/7d49ca30c14bf6240573.png",
      "revision": null
    },
    {
      "url": "/static/8ae8d8b83c1c5eeea5d0.svg",
      "revision": null
    },
    {
      "url": "/static/9751cd1808ef3e4ea25e.png",
      "revision": null
    },
    {
      "url": "/static/AppearanceView.bundle.js",
      "revision": "e4af7ebf997ef9961eca8ecfa5d2ae38"
    },
    {
      "url": "/static/ArticleDocumentation.bundle.js",
      "revision": "9155356716c5e4c5c8829808e3f46ab1"
    },
    {
      "url": "/static/CategoryDetailView.bundle.js",
      "revision": "18b8e4bc3feacdb8cb9afdd5ca643378"
    },
    {
      "url": "/static/Documentation.bundle.js",
      "revision": "2f7006d700574c7a2a179bc7feade251"
    },
    {
      "url": "/static/FaqView.bundle.js",
      "revision": "4fdf06fb71470ff1a0f4cb1997e16674"
    },
    {
      "url": "/static/FolderView.bundle.js",
      "revision": "41c30be86d45f7ad61fb38c83b37f31b"
    },
    {
      "url": "/static/ForumView.bundle.js",
      "revision": "e313e42ecb5e1706d93a4d884375bc38"
    },
    {
      "url": "/static/HomeView.bundle.js",
      "revision": "7ad58bdc68480a018686e94e1ff88c29"
    },
    {
      "url": "/static/KnowledgeBaseView.bundle.js",
      "revision": "0d06e7427597b4cb4c89bc040125e87c"
    },
    {
      "url": "/static/NotFoundPage.bundle.js",
      "revision": "9c1960c8adfa18e152d46d91969cda05"
    },
    {
      "url": "/static/OrganizationView.bundle.js",
      "revision": "7154fdd5c8295494fa4bb3f7737c9d5e"
    },
    {
      "url": "/static/SitesView.bundle.js",
      "revision": "739aa0a03f42ad2992e216ad7407f85c"
    },
    {
      "url": "/static/UserView.bundle.js",
      "revision": "456bcf443fb44b50a0596c8930c2de3a"
    },
    {
      "url": "/static/ccd2caaf5d1d205e664d.svg",
      "revision": null
    },
    {
      "url": "/static/cdff4f2e7baf7d8e6002.svg",
      "revision": null
    },
    {
      "url": "/static/da0d3d7c61c9e115d42f.otf",
      "revision": null
    },
    {
      "url": "/static/dcd426bea8e1141e41ca.svg",
      "revision": null
    },
    {
      "url": "/static/dcee17a9b4fd9720c283.svg",
      "revision": null
    },
    {
      "url": "/static/e700c29b9bb60e33a161.otf",
      "revision": null
    },
    {
      "url": "/static/ea03f826587148b7335d.otf",
      "revision": null
    },
    {
      "url": "/static/f16e41f7b57948eeff23.svg",
      "revision": null
    },
    {
      "url": "/static/f1e5773df1d02879be7a.svg",
      "revision": null
    },
    {
      "url": "/static/f84de3f0ef7c0acbdc66.svg",
      "revision": null
    },
    {
      "url": "/static/fcaab2524c5baabd71f6.otf",
      "revision": null
    },
    {
      "url": "/static/fe21248c0bb72bab35fd.svg",
      "revision": null
    },
    {
      "url": "/static/ff0ae2098de54434828d.svg",
      "revision": null
    },
    {
      "url": "/static/main.bundle.js",
      "revision": "8ca7fef118e41a4893368469304cf24d"
    },
    {
      "url": "/static/requests.bundle.js",
      "revision": "ae073fc8b6499ee70b85057619e19010"
    }
  ], {});

}));
//# sourceMappingURL=sw.js.map
