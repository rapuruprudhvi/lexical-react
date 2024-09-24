const path = require('path');
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias['pdfjs-dist/build/pdf.worker'] = path.join(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.entry');
    }
    return config;
  },
};
