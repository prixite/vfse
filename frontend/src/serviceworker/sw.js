if (!self.define) {
  let e,
    i = {};
  const s = (s, t) => (
    (s = new URL(s + ".js", t).href),
    i[s] ||
      new Promise((i) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = s), (e.onload = i), document.head.appendChild(e);
        } else (e = s), importScripts(s), i();
      }).then(() => {
        let e = i[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (t, l) => {
    const a =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (i[a]) return;
    let c = {};
    const n = (e) => s(e, a),
      r = { module: { uri: a }, exports: c, require: n };
    i[a] = Promise.all(t.map((e) => r[e] || n(e))).then((e) => (l(...e), c));
  };
}
define(["./workbox-6716fad7"], function (e) {
  "use strict";
  self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/static/06113bf748ae7dc33e05.ttf", revision: null },
        { url: "/static/06ec231708e211549615.svg", revision: null },
        { url: "/static/120f91ca1cfeced5a5ac.otf", revision: null },
        { url: "/static/12a0cb0157ced8a34060.png", revision: null },
        { url: "/static/1491bd436428e36b6527.png", revision: null },
        { url: "/static/1ec97508beb219d45140.png", revision: null },
        { url: "/static/22609d28e9c5bac5f9b6.png", revision: null },
        { url: "/static/29c57b05b7345f94042a.ttf", revision: null },
        { url: "/static/2f1b13834121410af5ef.otf", revision: null },
        { url: "/static/30357e2d1dc7b24a622c.svg", revision: null },
        { url: "/static/3a52f62a222cd05a32f5.png", revision: null },
        { url: "/static/3a7c914cbc8035135c38.otf", revision: null },
        { url: "/static/3bdb2f8f76c523bcc42f.svg", revision: null },
        { url: "/static/3dc31b1b0cbe0c9c5dc6.svg", revision: null },
        { url: "/static/3e770b49cbf5601aae28.svg", revision: null },
        { url: "/static/4640c17c101893e2a880.png", revision: null },
        { url: "/static/48560e4cccda7b534cb9.svg", revision: null },
        { url: "/static/4bed49edb0d25371f244.svg", revision: null },
        { url: "/static/4c5489d496361556108c.svg", revision: null },
        { url: "/static/505f0a80bb4b37d9cd5d.svg", revision: null },
        { url: "/static/53156c585a42e6a1382d.otf", revision: null },
        { url: "/static/5e318cad4dbd7492d2dd.svg", revision: null },
        { url: "/static/5eb61d0303ad620d278e.svg", revision: null },
        { url: "/static/6284097d7c1293097702.png", revision: null },
        { url: "/static/62f91ee71f9428d8754f.svg", revision: null },
        { url: "/static/65ca38c41a4d8f8fc5b8.svg", revision: null },
        { url: "/static/6e08bfae676553b79274.svg", revision: null },
        { url: "/static/783bfe300844d88399aa.svg", revision: null },
        { url: "/static/7d49ca30c14bf6240573.png", revision: null },
        { url: "/static/8ae8d8b83c1c5eeea5d0.svg", revision: null },
        { url: "/static/9751cd1808ef3e4ea25e.png", revision: null },
        {
          url: "/static/AppearanceView.bundle.js",
          revision: "b14771a67dca9e03cf22d4e63c89376e",
        },
        {
          url: "/static/AppearanceView.bundle.js.LICENSE.txt",
          revision: "4e0e34f265fae8f33b01b27ae29d9d6f",
        },
        {
          url: "/static/ArticleDocumentation.bundle.js",
          revision: "2c2f79e9e65e6b964c85792a3770df04",
        },
        {
          url: "/static/CategoryDetailView.bundle.js",
          revision: "a9a1e9ed415a515cf19731e3c18e5007",
        },
        {
          url: "/static/Documentation.bundle.js",
          revision: "bba4503b5489c7ae98a353d2677c1ab1",
        },
        {
          url: "/static/Documentation.bundle.js.LICENSE.txt",
          revision: "4e0e34f265fae8f33b01b27ae29d9d6f",
        },
        {
          url: "/static/FaqView.bundle.js",
          revision: "776c0cfb68c285c40370c7af293f2b18",
        },
        {
          url: "/static/FolderView.bundle.js",
          revision: "d60cdc4d19fd8c83cc030d97a3a62307",
        },
        {
          url: "/static/ForumView.bundle.js",
          revision: "58818f1e6dffca3827ea97acf777f293",
        },
        {
          url: "/static/ForumView.bundle.js.LICENSE.txt",
          revision: "4e0e34f265fae8f33b01b27ae29d9d6f",
        },
        {
          url: "/static/HomeView.bundle.js",
          revision: "ee3127335560f2535308e855e633f0be",
        },
        {
          url: "/static/KnowledgeBaseView.bundle.js",
          revision: "87dbbe8d8635a5f972b2abec77d83bd0",
        },
        {
          url: "/static/NotFoundPage.bundle.js",
          revision: "43624b615d142213a3c2fa2a5f44fedd",
        },
        {
          url: "/static/OrganizationView.bundle.js",
          revision: "80b010e6cc10d1e6c29304d1222f0d31",
        },
        {
          url: "/static/OrganizationView.bundle.js.LICENSE.txt",
          revision: "4e0e34f265fae8f33b01b27ae29d9d6f",
        },
        {
          url: "/static/SitesView.bundle.js",
          revision: "ca7fdf54ae7062ca4056ec4b74a1c73a",
        },
        {
          url: "/static/UserView.bundle.js",
          revision: "1ed07eba1ef4a2c215648de65dd6046b",
        },
        {
          url: "/static/UserView.bundle.js.LICENSE.txt",
          revision: "4e0e34f265fae8f33b01b27ae29d9d6f",
        },
        { url: "/static/ccd2caaf5d1d205e664d.svg", revision: null },
        { url: "/static/cdff4f2e7baf7d8e6002.svg", revision: null },
        { url: "/static/da0d3d7c61c9e115d42f.otf", revision: null },
        { url: "/static/dcd426bea8e1141e41ca.svg", revision: null },
        { url: "/static/dcee17a9b4fd9720c283.svg", revision: null },
        { url: "/static/e700c29b9bb60e33a161.otf", revision: null },
        { url: "/static/ea03f826587148b7335d.otf", revision: null },
        { url: "/static/f16e41f7b57948eeff23.svg", revision: null },
        { url: "/static/f1e5773df1d02879be7a.svg", revision: null },
        { url: "/static/f84de3f0ef7c0acbdc66.svg", revision: null },
        { url: "/static/fcaab2524c5baabd71f6.otf", revision: null },
        { url: "/static/fe21248c0bb72bab35fd.svg", revision: null },
        { url: "/static/ff0ae2098de54434828d.svg", revision: null },
        {
          url: "/static/main.bundle.js",
          revision: "670a3002caa623de80e83c835c8faa0e",
        },
        {
          url: "/static/main.bundle.js.LICENSE.txt",
          revision: "4e0e34f265fae8f33b01b27ae29d9d6f",
        },
        {
          url: "/static/requests.bundle.js",
          revision: "1f95ff3b1395f4287650d01b5a95aaee",
        },
        {
          url: "/static/requests.bundle.js.LICENSE.txt",
          revision: "4e0e34f265fae8f33b01b27ae29d9d6f",
        },
        {
          url: "/static/vendor.bundle.js.LICENSE.txt",
          revision: "fd3feafc81baa94f2e4ecc57d432725b",
        },
      ],
      {}
    );
});
