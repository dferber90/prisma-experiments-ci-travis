const nodeExternals = require("webpack-node-externals");

module.exports = {
  // TODO publish "modify" function as npm package or ask razzle to do this
  // by default
  modify: (config, { target, dev }, webpack) => {
    if (target === "node") {
      config.externals = [
        nodeExternals({
          // razzle default config
          whitelist: [
            dev ? "webpack/hot/poll?300" : null,
            /\.(eot|woff|woff2|ttf|otf)$/,
            /\.(svg|png|jpg|jpeg|gif|ico)$/,
            /\.(mp4|mp3|ogg|swf|webp)$/,
            /\.(css|scss|sass|sss|less)$/
          ].filter(x => x),
          // adding this enables using yarn workspaces!
          modulesFromFile: true
        })
      ];
    }

    return config;
  }
};
