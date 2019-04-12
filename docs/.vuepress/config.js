module.exports = {
  title: "Payment App API",
  description: "How to use the api for this project",
  themeConfig: {
    // Assumes GitHub. Can also be a full GitLab url.
    repo: "kingflamez/paymentappAPI",
    docsRepo: "kingflamez/paymentappAPI",
    docsDir: "docs",
    // defaults to false, set to true to enable
    editLinks: false,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: "Help us improve this page!",
    nav: [
      { text: "Home", link: "/" },
      { text: "Get Started", link: "/getting-started/setup.html" }
    ],
    head: [
      // ['link', { rel: 'icon', href: `https://rave.flutterwave.com/favicon.ico` }],
      ["link", { rel: "manifest", href: "/manifest.json" }],
      ["meta", { name: "msapplication-TileColor", content: "#000000" }]
    ],
    sidebar: [
      {
        title: "Getting Started",
        children: ["/getting-started/setup.html"]
      },
      {
        title: "Authentication",
        children: ["/auth/user/signup.html"]
      }
      // {
      //     title: 'Miscs',
      //     children: [
      //         '/refunds.html',
      //         '/bvn-validation.html',
      //         '/exchange-rates.html',
      //     ]
      // }
    ],
    displayAllHeaders: true
  },
  markdown: {
    lineNumbers: true
  }
};
